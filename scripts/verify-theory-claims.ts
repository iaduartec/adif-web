import { lessonTheories } from "../content/lesson-theory";
import type { LegalReference, TheoryClaim } from "../content/theory-types";

console.log("Starting theory claims traceability validation...");
let errorCount = 0;

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

const JURISPRUDENCE_MARKERS = ["sentencia", "jurisprudencia", "tribunal supremo", "doctrina"];

// Instrument coherence: when the claim text names a legal instrument
// explicitly, at least one referenced source must belong to that instrument.
// Claims anchored on a "Constitución" source are exempt from the non-CE rules
// because constitutional framing legitimately discusses any law (e.g. why a
// law is organic, or what majority amends it).
const INSTRUMENT_RULES: Array<{ label: string; mention: RegExp; token: string }> = [
  { label: "LO 3/2007", mention: /LO 3\/2007|Ley Orgánica 3\/2007/, token: "3/2007" },
  { label: "Ley 31/1995", mention: /Ley 31\/1995|31\/1995/, token: "31/1995" },
  { label: "RD 2395/2004", mention: /RD 2395\/2004|Real Decreto 2395\/2004/, token: "2395/2004" },
  { label: "Ley 53/1984", mention: /Ley 53\/1984|53\/1984/, token: "53/1984" },
  { label: "RD 664/2015", mention: /RD 664\/2015|Real Decreto 664\/2015/, token: "664/2015" },
  { label: "RD 346/2011", mention: /RD 346\/2011|Real Decreto 346\/2011/, token: "346/2011" },
  { label: "RDL 5/2015", mention: /RDL 5\/2015|Real Decreto Legislativo 5\/2015|TREBEP|\bEBEP\b/, token: "trebep" },
  { label: "Constitución", mention: /Constitución/, token: "ce" },
  { label: "Declaración sobre la Red", mention: /Declaración sobre la Red|\bDR\b/, token: "2027" },
  { label: "RD 186/2016", mention: /RD 186\/2016|Real Decreto 186\/2016/, token: "186/2016" },
  { label: "RD 902/2020", mention: /RD 902\/2020/, token: "902/2020" },
  { label: "RD 773/1997", mention: /RD 773\/1997|Real Decreto 773\/1997/, token: "773/1997" },
  { label: "Directiva 2014/30/UE", mention: /Directiva 2014\/30\/UE/, token: "2014/30" },
  { label: "Ley 38/2015", mention: /Ley 38\/2015|Ley del Sector Ferroviario/, token: "38/2015" },
  { label: "EN 50121", mention: /EN 50121/, token: "50121" },
];

function isLegalSource(source: LegalReference | undefined): boolean {
  if (!source) return false;
  const title = source.sourceTitle.toLowerCase();
  return LEGAL_TITLE_MARKERS.some((m) => title.includes(m));
}

function checkClaim(
  moduleName: string,
  location: string,
  claim: TheoryClaim,
  sourcesById: Map<string, LegalReference>
) {
  const hasBasis = Array.isArray(claim.legalBasis) && claim.legalBasis.length > 0;

  // 1. normative/interpretative MUST carry a legalBasis.
  if ((claim.kind === "normative" || claim.kind === "interpretative") && !hasBasis) {
    console.error(
      `[${moduleName}] Error in ${location} (claim ID: ${claim.id}): ` +
        `Kind is '${claim.kind}' but 'legalBasis' is missing or empty.`
    );
    errorCount++;
  }

  // 2. Every referenced source must exist and be a legal source for
  //    normative/interpretative claims.
  if (hasBasis) {
    claim.legalBasis.forEach((sourceId) => {
      const source = sourcesById.get(sourceId);
      if (!source) {
        console.error(
          `[${moduleName}] Error in ${location} (claim ID: ${claim.id}): ` +
            `References source ID '${sourceId}' which is not registered in the module's sources.`
        );
        errorCount++;
      }
    });
  }

  // 3. didactic claims must NOT cite legal instruments (guides are allowed).
  if (claim.kind === "didactic" && hasBasis) {
    claim.legalBasis.forEach((sourceId) => {
      const source = sourcesById.get(sourceId);
      if (source && isLegalSource(source)) {
        console.error(
          `[${moduleName}] Error in ${location} (claim ID: ${claim.id}): ` +
            `didactic claim must not cite legal source '${sourceId}' (${source.sourceTitle}).`
        );
        errorCount++;
      }
    });
  }

  // 4. Claims asserting legal consequences must have a supporting legal basis.
  if (!hasBasis && claim.kind !== "didactic") {
    const lower = claim.text.toLowerCase();
    const mentionsConsequence = CONSEQUENCE_MARKERS.some((m) => lower.includes(m));
    if (mentionsConsequence) {
      console.error(
        `[${moduleName}] Error in ${location} (claim ID: ${claim.id}): ` +
          `Text asserts a legal consequence (${CONSEQUENCE_MARKERS.find((m) => lower.includes(m))}) ` +
          `but has no 'legalBasis'.`
      );
      errorCount++;
    }
  }

  // 5. Claims citing jurisprudence must point to a concrete ruling: either an
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
        console.error(
          `[${moduleName}] Error in ${location} (claim ID: ${claim.id}): ` +
            `Mentions jurisprudence ('${JURISPRUDENCE_MARKERS.find((m) => lower.includes(m))}') ` +
            `without citing a specific ruling or a jurisprudential source in 'legalBasis'.`
        );
        errorCount++;
      }
    }
  }

  // 6. Instrument coherence: a claim that names a legal instrument must
  //    reference a source belonging to it.
  if ((claim.kind === "normative" || claim.kind === "interpretative") && hasBasis) {
    const basisSourceIds = claim.legalBasis
      .map((sourceId) => sourcesById.get(sourceId)?.sourceId ?? "")
      .filter(Boolean);
    const hasCESource = basisSourceIds.some((s) => s.toLowerCase() === "ce");
    for (const rule of INSTRUMENT_RULES) {
      if (!rule.mention.test(claim.text)) continue;
      if (rule.token === "ce") {
        if (!hasCESource) {
          console.error(
            `[${moduleName}] Error in ${location} (claim ID: ${claim.id}): ` +
              `Text mentions the '${rule.label}' but no 'Constitución' source is referenced in legalBasis.`
          );
          errorCount++;
        }
        continue;
      }
      if (hasCESource) continue;
      const covered = basisSourceIds.some((s) => s.toLowerCase().includes(rule.token));
      if (!covered) {
        console.error(
          `[${moduleName}] Error in ${location} (claim ID: ${claim.id}): ` +
            `Text mentions '${rule.label}' but no referenced source belongs to it ` +
            `(legalBasis sourceIds: ${basisSourceIds.join(", ") || "none"}).`
        );
        errorCount++;
      }
    }
  }

  // 7. Locator coherence: if the text cites an article/apartado number, at
  //    least one referenced locator must cover it.
  if ((claim.kind === "normative" || claim.kind === "interpretative") && hasBasis) {
    const locators = claim.legalBasis
      .map((sourceId) => sourcesById.get(sourceId)?.locator ?? "")
      .filter(Boolean);
    const joined = locators.join(" | ");
    const locatorTokens = new Set<string>();
    for (const locator of locators) {
      const m = locator.match(/(\d+(?:\.\d+)*)/);
      if (m) locatorTokens.add(m[1]);
    }
    const locatorRe = /(?:art(?:ículo|\.)\s*(\d+(?:\.\d+)?)|apartado\s+(\d+(?:\.\d+)?)|art\s*(\d+(?:\.\d+)?))/gi;
    const mentioned: string[] = [];
    let m;
    while ((m = locatorRe.exec(claim.text))) {
      const num = m[1] ?? m[2] ?? m[3];
      if (num && !joined.includes(num) && ![...locatorTokens].some((t) => t === num)) {
        mentioned.push(num);
      }
    }
    if (mentioned.length) {
      console.error(
        `[${moduleName}] Error in ${location} (claim ID: ${claim.id}): ` +
          `Text cites article/apartado ${mentioned.join(", ")} but the referenced ` +
          `locators (${joined || "none"}) do not cover it.`
      );
      errorCount++;
    }
  }
}

for (const [name, theory] of Object.entries(lessonTheories)) {
  if (!theory) continue;

  const sourcesById = new Map<string, LegalReference>();
  theory.sources?.forEach((s) => sourcesById.set(s.id, s));

  // 1. Check introduction claims
  if (Array.isArray(theory.introduction)) {
    theory.introduction.forEach((claim, idx) => {
      checkClaim(name, `introduction[${idx}]`, claim, sourcesById);
    });
  }

  // 2. Check concepts claims
  if (Array.isArray(theory.concepts)) {
    theory.concepts.forEach((concept) => {
      if (Array.isArray(concept.claims)) {
        concept.claims.forEach((claim, idx) => {
          checkClaim(name, `concept ${concept.id} claim[${idx}]`, claim, sourcesById);
        });
      }
    });
  }

  // 3. Check examples application claims
  if (Array.isArray(theory.examples)) {
    theory.examples.forEach((example) => {
      if (Array.isArray(example.application)) {
        example.application.forEach((claim, idx) => {
          checkClaim(name, `example ${example.id} application[${idx}]`, claim, sourcesById);
        });
      }
    });
  }

  // 4. Check reviewTakeaways claims
  if (Array.isArray(theory.reviewTakeaways)) {
    theory.reviewTakeaways.forEach((claim, idx) => {
      checkClaim(name, `reviewTakeaways[${idx}]`, claim, sourcesById);
    });
  }
}

if (errorCount > 0) {
  console.error(`Claims validation failed with ${errorCount} errors.`);
  process.exit(1);
} else {
  console.log("Claims validation passed successfully!");
  process.exit(0);
}
