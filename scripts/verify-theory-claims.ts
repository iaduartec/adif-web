import { pathToFileURL } from "node:url";

import { lessonTheories } from "../content/lesson-theory";
import type { LegalReference, TheoryClaim, TheorySection } from "../content/theory-types";
import { getSourceKind } from "./verify-theory-references";

// Source titles whose ID should never appear in a `didactic` claim's legalBasis.
const LEGAL_TITLE_MARKERS = [
  "ley",
  "real decreto",
  "reglamento",
  "directiva",
  "constitución",
  "constituci\u00f3n",
  "estatuto",
  "código",
  "codigo",
  "tratado",
  "texto refundido",
];

// Claims of sanctions/nullity/responsibility must point to a legal source that
// supports them; a claim that references such consequence WITHOUT any legalBasis
// (or with only a guide) is flagged.
const CONSEQUENCE_MARKERS = [
  "nulidad",
  "infracción",
  "infraccion",
  "sancion",
  "sanción",
  "expediente disciplinario",
  "despido",
  "penal",
];

const JURISPRUDENCE_MARKERS = [
  "sentencia",
  "jurisprudencia",
  "tribunal supremo",
  "tribunal constitucional",
  "doctrina",
];

// Strong legal-obligation phrasing that a `didactic` (purely pedagogical) claim
// must never assert. A controlled pattern set — no NLP — used to surface claims
// that hide a legal assertion behind the didactic label.
const LEGAL_OBLIGATION_MARKERS = [
  "está obligad",
  "están obligad",
  "tiene la obligación",
  "tienen la obligación",
  "tiene derecho",
  "tienen derecho",
  "deberá ",
  "deberán ",
  "es obligatorio",
  "será sancion",
  "constituye infracción",
  "la ley exige",
];

/**
 * Stable instrument registry. `sourceIds` lists the accepted `sourceId` strings
 * that denote the instrument; `mention` detects when a claim text names it.
 * Instrument matching NEVER relies on fragile substring checks like
 * `sourceId.includes("3/2007")`: sources are compared against this normalized
 * registry with exact matching after normalization.
 */
export type InstrumentDef = {
  id: string;
  label: string;
  mention: RegExp;
  sourceIds: string[];
};

export const INSTRUMENTS: InstrumentDef[] = [
  { id: "ce", label: "Constitución", mention: /Constitución/, sourceIds: ["CE"] },
  { id: "lo3-2007", label: "LO 3/2007", mention: /LO 3\/2007|Ley Orgánica 3\/2007/, sourceIds: ["LO 3/2007"] },
  { id: "lprl-31-1995", label: "Ley 31/1995", mention: /Ley 31\/1995|\bLPRL\b/, sourceIds: ["Ley 31/1995"] },
  { id: "rd2395-2004", label: "RD 2395/2004", mention: /RD 2395\/2004|Real Decreto 2395\/2004/, sourceIds: ["RD 2395/2004"] },
  { id: "rd346-2011", label: "RD 346/2011", mention: /RD 346\/2011|Real Decreto 346\/2011/, sourceIds: ["RD 346/2011"] },
  { id: "lsf-38-2015", label: "Ley 38/2015", mention: /Ley 38\/2015|Ley del Sector Ferroviario/, sourceIds: ["Ley 38/2015"] },
  { id: "trebep", label: "TREBEP", mention: /TREBEP|\bEBEP\b|Real Decreto Legislativo 5\/2015/, sourceIds: ["TREBEP"] },
  { id: "rd664-2015", label: "RD 664/2015", mention: /RD 664\/2015|Real Decreto 664\/2015/, sourceIds: ["RD 664/2015"] },
  { id: "rd902-2020", label: "RD 902/2020", mention: /RD 902\/2020/, sourceIds: ["RD 902/2020"] },
  { id: "rd773-1997", label: "RD 773/1997", mention: /RD 773\/1997|Real Decreto 773\/1997/, sourceIds: ["RD 773/1997"] },
  { id: "rd186-2016", label: "Real Decreto 186/2016", mention: /RD 186\/2016|Real Decreto 186\/2016/, sourceIds: ["RD 186/2016", "Real Decreto 186/2016"] },
  { id: "directiva-2014-30-ue", label: "Directiva 2014/30/UE", mention: /Directiva 2014\/30\/UE/, sourceIds: ["Directiva 2014/30/UE"] },
  { id: "en50121", label: "EN 50121", mention: /EN 50121/, sourceIds: ["EN 50121"] },
  { id: "dr-2027", label: "Declaración sobre la Red", mention: /Declaración sobre la Red|\bDR\b/, sourceIds: ["DR 2027"] },
  { id: "ley53-1984", label: "Ley 53/1984", mention: /Ley 53\/1984/, sourceIds: ["Ley 53/1984"] },
];

export function normalizeInstrumentName(name: string): string {
  return name.trim().toLowerCase();
}

export function sourceBelongsToInstrument(
  source: LegalReference,
  instrument: InstrumentDef
): boolean {
  return instrument.sourceIds.some(
    (id) => normalizeInstrumentName(id) === normalizeInstrumentName(source.sourceId)
  );
}

function isLegalSource(source: LegalReference | undefined): boolean {
  if (!source) return false;
  const title = source.sourceTitle.toLowerCase();
  return LEGAL_TITLE_MARKERS.some((m) => title.includes(m));
}

/**
 * Extracts the exact numeric article/apartado tokens mentioned in a claim
 * text. "Artículo 6.2", "Art. 6.2", "artículo 6.2" and "apartado 5.1" all
 * normalize to a single exact token ("6.2", "5.1").
 */
export function extractMentionedLocators(text: string): string[] {
  const out: string[] = [];
  const re = /\b(?:artículo|art\.?|apartado)\s*(\d+(?:\.\d+)?)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) out.push(m[1]);
  return out;
}

/**
 * Extracts the exact numeric tokens present in a reference locator.
 * "Artículo 81.1" -> ["81.1"]; "Capítulo I" -> [].
 */
export function extractReferenceLocators(locator: string): string[] {
  const out: string[] = [];
  const re = /(\d+(?:\.\d+)*)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(locator))) out.push(m[1]);
  return out;
}

export function checkClaim(
  moduleName: string,
  location: string,
  claim: TheoryClaim,
  sourcesById: Map<string, LegalReference>
): string[] {
  const errors: string[] = [];
  const hasBasis = Array.isArray(claim.legalBasis) && claim.legalBasis.length > 0;

  // 1. normative/interpretative MUST carry a legalBasis.
  if ((claim.kind === "normative" || claim.kind === "interpretative") && !hasBasis) {
    errors.push(
      `[${moduleName}] Error in ${location} (claim ID: ${claim.id}): ` +
        `Kind is '${claim.kind}' but 'legalBasis' is missing or empty.`
    );
  }

  // 2. Every referenced source must exist and be a legal source for
  //    normative/interpretative claims.
  if (hasBasis) {
    claim.legalBasis.forEach((sourceId) => {
      const source = sourcesById.get(sourceId);
      if (!source) {
        errors.push(
          `[${moduleName}] Error in ${location} (claim ID: ${claim.id}): ` +
            `References source ID '${sourceId}' which is not registered in the module's sources.`
        );
      }
    });
  }

  // 3. didactic claims must NOT cite legal instruments (guides are allowed).
  if (claim.kind === "didactic" && hasBasis) {
    claim.legalBasis.forEach((sourceId) => {
      const source = sourcesById.get(sourceId);
      if (source && isLegalSource(source)) {
        errors.push(
          `[${moduleName}] Error in ${location} (claim ID: ${claim.id}): ` +
            `didactic claim must not cite legal source '${sourceId}' (${source.sourceTitle}).`
        );
      }
    });
  }

  // 4. Claims asserting legal consequences must have a supporting legal basis.
  if (!hasBasis && claim.kind !== "didactic") {
    const lower = claim.text.toLowerCase();
    const mentionsConsequence = CONSEQUENCE_MARKERS.some((m) => lower.includes(m));
    if (mentionsConsequence) {
      errors.push(
        `[${moduleName}] Error in ${location} (claim ID: ${claim.id}): ` +
          `Text asserts a legal consequence (${CONSEQUENCE_MARKERS.find((m) => lower.includes(m))}) ` +
          `but has no 'legalBasis'.`
      );
    }
  }

  // 5. A claim marked didactic must not hide a legal obligation behind the
  //    pedagogical label. If it asserts a clear legal duty/right it must be
  //    reclassified (normative/interpretative) with an exact reference or the
  //    phrasing must be softened.
  if (claim.kind === "didactic") {
    const lower = claim.text.toLowerCase();
    const obligationMarker = LEGAL_OBLIGATION_MARKERS.find((m) => lower.includes(m));
    if (obligationMarker) {
      errors.push(
        `[${moduleName}] Error in ${location} (claim ID: ${claim.id}): ` +
          `didactic claim asserts a legal obligation/right ('${obligationMarker}') ` +
          `without a supporting 'legalBasis' — reclassify as normative/interpretative ` +
          `with an exact reference or soften the phrasing.`
      );
    }
  }

  // 6. Claims citing jurisprudence must point to a concrete ruling: either an
  //    explicit citation in the text or a jurisprudential source in the basis.
  if (claim.kind === "interpretative" || claim.kind === "normative") {
    const lower = claim.text.toLowerCase();
    const mentionsJurisprudence = JURISPRUDENCE_MARKERS.some((m) => lower.includes(m));
    if (mentionsJurisprudence) {
      const hasTextCitation = /stc\s+\d|sentencia del tribunal|sentencia\s+de\s+\d|sentencias?\s+\d/.test(lower);
      const hasJurSource =
        hasBasis &&
        claim.legalBasis.some((sourceId) => {
          const source = sourcesById.get(sourceId);
          if (!source) return false;
          const title = source.sourceTitle.toLowerCase();
          const id = source.id.toLowerCase();
          return (
            title.includes("sentencia") ||
            title.includes("tribunal") ||
            title.includes("jurisprudencia") ||
            id.startsWith("stc") ||
            id.startsWith("sts")
          );
        });
      if (!hasTextCitation && !hasJurSource) {
        errors.push(
          `[${moduleName}] Error in ${location} (claim ID: ${claim.id}): ` +
            `Mentions jurisprudence ('${JURISPRUDENCE_MARKERS.find((m) => lower.includes(m))}') ` +
            `without citing a specific ruling or a jurisprudential source in 'legalBasis'.`
        );
      }
    }
  }

  // 7. Instrument coherence: EVERY instrument explicitly named in the claim
  //    text must be covered by a referenced source belonging to it. There is no
  //    global CE exemption: a claim naming both the Constitución and the
  //    LO 3/2007 must reference both instruments.
  if ((claim.kind === "normative" || claim.kind === "interpretative") && hasBasis) {
    const basisSources = claim.legalBasis
      .map((sourceId) => sourcesById.get(sourceId))
      .filter((s): s is LegalReference => Boolean(s));
    for (const instrument of INSTRUMENTS) {
      if (!instrument.mention.test(claim.text)) continue;
      const covered = basisSources.some((source) => sourceBelongsToInstrument(source, instrument));
      if (!covered) {
        errors.push(
          `[${moduleName}] Error in ${location} (claim ID: ${claim.id}): ` +
            `Text mentions '${instrument.label}' but no referenced source belongs to it ` +
            `(legalBasis sourceIds: ${claim.legalBasis.join(", ") || "none"}).`
        );
      }
    }
  }

  // 8. Locator coherence: if the text cites an article/apartado number, at
  //    least one referenced locator must contain that EXACT token. String
  //    containment (`includes`) is never used: "Art. 8" must NOT match the
  //    locator "Artículo 81.1", nor "Art. 4" the locator "Artículo 45".
  if ((claim.kind === "normative" || claim.kind === "interpretative") && hasBasis) {
    const referenceTokens = new Set<string>();
    const locators: string[] = [];
    for (const sourceId of claim.legalBasis) {
      const source = sourcesById.get(sourceId);
      if (source?.locator) {
        locators.push(source.locator);
        for (const token of extractReferenceLocators(source.locator)) referenceTokens.add(token);
      }
    }
    const unmatched = extractMentionedLocators(claim.text).filter((token) => !referenceTokens.has(token));
    if (unmatched.length) {
      errors.push(
        `[${moduleName}] Error in ${location} (claim ID: ${claim.id}): ` +
          `Text cites article/apartado ${unmatched.join(", ")} but the referenced ` +
          `locators (${locators.join(" | ") || "none"}) do not cover it.`
      );
    }
  }

  // 9. A normative claim must not be backed EXCLUSIVELY by `syllabus-reference`
  //    sources. A syllabus reference (exam call page) only proves the source is
  //    on the exam syllabus — it never evidences the legal content the claim
  //    asserts. The claim must either be reclassified as didactic or backed by
  //    an official legal source.
  if (claim.kind === "normative" && hasBasis) {
    const basisKinds = claim.legalBasis.map((sourceId) => {
      const source = sourcesById.get(sourceId);
      return source ? getSourceKind(source.sourceId) : undefined;
    });
    if (basisKinds.length > 0 && basisKinds.every((kind) => kind === "syllabus-reference")) {
      errors.push(
        `[${moduleName}] Error in ${location} (claim ID: ${claim.id}): ` +
          `normative claim is backed exclusively by syllabus-reference sources ` +
          `(${claim.legalBasis.join(", ")}) — a syllabus reference only proves the source ` +
          `is on the exam syllabus; reclassify as didactic or back it with an official legal source.`
      );
    }
  }

  return errors;
}

export function validateTheoryClaims(theories: Record<string, TheorySection>): string[] {
  const errors: string[] = [];

  for (const [name, theory] of Object.entries(theories)) {
    if (!theory) continue;

    const sourcesById = new Map<string, LegalReference>();
    theory.sources?.forEach((s) => sourcesById.set(s.id, s));

    if (Array.isArray(theory.introduction)) {
      theory.introduction.forEach((claim, idx) => {
        errors.push(...checkClaim(name, `introduction[${idx}]`, claim, sourcesById));
      });
    }

    if (Array.isArray(theory.concepts)) {
      theory.concepts.forEach((concept) => {
        if (Array.isArray(concept.claims)) {
          concept.claims.forEach((claim, idx) => {
            errors.push(...checkClaim(name, `concept ${concept.id} claim[${idx}]`, claim, sourcesById));
          });
        }
      });
    }

    if (Array.isArray(theory.examples)) {
      theory.examples.forEach((example) => {
        if (Array.isArray(example.application)) {
          example.application.forEach((claim, idx) => {
            errors.push(...checkClaim(name, `example ${example.id} application[${idx}]`, claim, sourcesById));
          });
        }
      });
    }

    if (Array.isArray(theory.reviewTakeaways)) {
      theory.reviewTakeaways.forEach((claim, idx) => {
        errors.push(...checkClaim(name, `reviewTakeaways[${idx}]`, claim, sourcesById));
      });
    }
  }

  return errors;
}

const isMain = process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  console.log("Starting theory claims traceability validation...");
  const errors = validateTheoryClaims(lessonTheories);
  for (const error of errors) console.error(error);

  if (errors.length > 0) {
    console.error(`Claims validation failed with ${errors.length} errors.`);
    process.exit(1);
  } else {
    console.log("Claims validation passed successfully!");
    process.exit(0);
  }
}
