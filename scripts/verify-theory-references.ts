import { pathToFileURL } from "node:url";

import { lessonTheories } from "../content/lesson-theory";
import type { LegalReference, TheorySection } from "../content/theory-types";

// Domains accepted for legal/official references. Only hosts actually used by
// the theory sources: BOE (normativa), ADIF (documentos institucionales) and
// Council of Europe (marco pedagógico MCER). Spanish legal sources must point
// to BOE.
export const OFFICIAL_DOMAINS = ["www.boe.es", "www.adif.es", "www.coe.int"];

// Accent-stripped words that indicate the reference is "artículo" or a
// breakdown artifact rather than a real locator.
export const LOCATOR_BLACKLIST = ["art-culo", "art-iculo", "art_culo", "Art-culo"];

/**
 * Kind of official source. `legislation` covers norms published in BOE/DOUE;
 * `official-document` covers institutional documents published by an official
 * body (ADIF, Council of Europe…); `standard` covers technical standards;
 * `syllabus-reference` covers sources whose only official anchor is the exam
 * call/syllabus (they prove the source is examined, NOT its content);
 * `pedagogical` covers purely educational material.
 *
 * The kind drives the validation rules: a `normative` claim must never be
 * backed exclusively by `syllabus-reference` sources.
 */
export type SourceKind =
  | "legislation"
  | "official-document"
  | "standard"
  | "syllabus-reference"
  | "pedagogical";

export const SOURCE_KINDS: readonly SourceKind[] = [
  "legislation",
  "official-document",
  "standard",
  "syllabus-reference",
  "pedagogical",
];

export type OfficialSourceIdentity = {
  canonicalTitle: string;
  canonicalUrl: string;
  kind: SourceKind;
};

/**
 * Canonical official identity per `sourceId`: the official document title
 * (`canonicalTitle`), its canonical URL (`canonicalUrl`) and its source kind.
 * Every legal reference carrying a given `sourceId` MUST point to the exact
 * document identity registered here — both the URL and the title.
 *
 * BOE document IDs (`BOE-A-…`, `DOUE-L-…`) are the authoritative identity of
 * a norm: a typo in the ID silently sends learners to a different document, so
 * identity is validated verbatim instead of relying only on the domain
 * allow-list. Any `sourceId` not present in this registry fails the check, so
 * the registry is kept complete whenever a new source is added.
 *
 * ADIF exam-call pages (`/w/pni26-01-personal-operativo`) only demonstrate that
 * a norm/standard is on the exam syllabus, so EN 50121 and MET-PSI-01 are
 * classified as `syllabus-reference`, never as primary legal sources.
 */
export const OFFICIAL_SOURCE_REGISTRY: Record<string, OfficialSourceIdentity> = {
  "CE": {
    canonicalTitle: "Constitución Española",
    canonicalUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229",
    kind: "legislation",
  },
  "LO 3/2007": {
    canonicalTitle:
      "Ley Orgánica 3/2007, de 22 de marzo, para la igualdad efectiva de mujeres y hombres",
    canonicalUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2007-6115",
    kind: "legislation",
  },
  "Ley 31/1995": {
    canonicalTitle: "Ley 31/1995, de 8 de noviembre, de prevención de riesgos laborales",
    canonicalUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
    kind: "legislation",
  },
  "Ley 38/2015": {
    canonicalTitle: "Ley 38/2015, de 29 de septiembre, del sector ferroviario",
    canonicalUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-10440",
    kind: "legislation",
  },
  "Ley 53/1984": {
    canonicalTitle:
      "Ley 53/1984, de 26 de diciembre, de incompatibilidades del personal al servicio de las Administraciones Públicas",
    canonicalUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
    kind: "legislation",
  },
  "RD 2395/2004": {
    canonicalTitle:
      "Real Decreto 2395/2004, de 30 de diciembre, por el que se aprueba el Estatuto de la entidad pública empresarial Administrador de Infraestructuras Ferroviarias",
    canonicalUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2004-21913",
    kind: "legislation",
  },
  "RD 346/2011": {
    canonicalTitle:
      "Real Decreto 346/2011, de 11 de marzo, por el que se aprueba el Reglamento regulador de las infraestructuras comunes de telecomunicaciones para el acceso a los servicios de telecomunicación en el interior de las edificaciones",
    canonicalUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
    kind: "legislation",
  },
  "RD 664/2015": {
    canonicalTitle:
      "Real Decreto 664/2015, de 17 de julio, por el que se aprueba el Reglamento de Circulación Ferroviaria",
    canonicalUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-8042",
    kind: "legislation",
  },
  "RD 773/1997": {
    canonicalTitle:
      "Real Decreto 773/1997, de 30 de mayo, sobre disposiciones mínimas de seguridad y salud relativas a la utilización por los trabajadores de equipos de protección individual",
    canonicalUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1997-12735",
    kind: "legislation",
  },
  "RD 902/2020": {
    canonicalTitle: "Real Decreto 902/2020, de 13 de octubre, de igualdad retributiva de las mujeres y hombres",
    canonicalUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2020-12215",
    kind: "legislation",
  },
  "TREBEP": {
    canonicalTitle:
      "Real Decreto Legislativo 5/2015, de 30 de octubre, por el que se aprueba el texto refundido de la Ley del Estatuto Básico del Empleado Público",
    canonicalUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11719",
    kind: "legislation",
  },
  "Real Decreto 186/2016": {
    canonicalTitle:
      "Real Decreto 186/2016, de 6 de mayo, por el que se regula la compatibilidad electromagnética de los equipos eléctricos y electrónicos",
    canonicalUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2016-4442",
    kind: "legislation",
  },
  "Directiva 2014/30/UE": {
    canonicalTitle:
      "Directiva 2014/30/UE del Parlamento Europeo y del Consejo, de 26 de febrero de 2014, sobre la armonización de las legislaciones de los Estados miembros en materia de compatibilidad electromagnética",
    canonicalUrl: "https://www.boe.es/buscar/doc.php?id=DOUE-L-2014-80623",
    kind: "legislation",
  },
  "DR 2027": {
    canonicalTitle: "Declaración sobre la Red de Adif (Edición 2027)",
    canonicalUrl: "https://www.adif.es/sobre-adif/declaracion-red",
    kind: "official-document",
  },
  "ADIF PNI23/01": {
    canonicalTitle: "Plantillas correctoras y cuadernillos de examen PNI23/01",
    canonicalUrl:
      "https://www.adif.es/documents/20124/17165113/%2807.11.2023%29%20-%20Plantillas%20correctoras%20y%20cuadernillos%20de%20examen.pdf/dce76c5e-ae60-a0d0-568e-4f4db30c3823",
    kind: "official-document",
  },
  "ADIF PNI24/01": {
    canonicalTitle: "Plantillas correctoras y cuadernillos de examen PNI24/01",
    canonicalUrl:
      "https://www.adif.es/documents/20124/33942288/%2825.11.2024%29%20-%20Plantillas%20correctoras%20y%20cuadernillos%20de%20examen.pdf/7d5847b0-d613-65b0-a0a2-ae936d6e0500",
    kind: "official-document",
  },
  "ADIF PNI25/01": {
    canonicalTitle: "Plantillas correctoras y cuadernillos de examen PNI25/01",
    canonicalUrl:
      "https://www.adif.es/documents/20124/45240815/%2818.11.2025%29%2B-%2BPlantillas%2Bcorrectoras%2By%2Bcuadernillos%2Bde%2Bexamen.pdf/a2b9f608-83b0-34ee-0aa4-aba4ee6baf6b",
    kind: "official-document",
  },
  "EN 50121": {
    canonicalTitle:
      "Norma armonizada europea de compatibilidad electromagnética en aplicaciones ferroviarias",
    canonicalUrl: "https://www.adif.es/w/pni26-01-personal-operativo",
    kind: "syllabus-reference",
  },
  "MET-PSI-01": {
    canonicalTitle: "Guía Metodológica de Evaluación de Aptitudes Cognitivas y Psicométricas",
    canonicalUrl: "https://www.adif.es/w/pni26-01-personal-operativo",
    kind: "syllabus-reference",
  },
  "MCER-A2": {
    canonicalTitle: "Marco Común Europeo de Referencia para las Lenguas (MCER)",
    canonicalUrl:
      "https://www.coe.int/en/web/common-european-framework-reference-languages/introduction-and-context",
    kind: "official-document",
  },
};

/**
 * Returns the registered `SourceKind` for a `sourceId`, or `undefined` when the
 * `sourceId` is not registered at all.
 */
export function getSourceKind(sourceId: string): SourceKind | undefined {
  return OFFICIAL_SOURCE_REGISTRY[sourceId]?.kind;
}

/**
 * Counts registered sources per kind, useful for reports.
 */
export function getSourcesByKind(): Record<SourceKind, number> {
  const counts: Record<SourceKind, number> = {
    legislation: 0,
    "official-document": 0,
    standard: 0,
    "syllabus-reference": 0,
    pedagogical: 0,
  };
  for (const identity of Object.values(OFFICIAL_SOURCE_REGISTRY)) {
    counts[identity.kind] = (counts[identity.kind] ?? 0) + 1;
  }
  return counts;
}

function normalizeOfficialUrl(url: string): string | null {
  try {
    return new URL(url).toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

/**
 * Controlled title normalization used to compare a module's `sourceTitle`
 * against the registry `canonicalTitle`. Purely mechanical: Unicode NFC,
 * trimming, collapsing of consecutive whitespace and an optional trailing
 * period. It deliberately does NOT attempt semantic/fuzzy matching — a title
 * must reproduce the official title, not paraphrase it.
 */
export function normalizeCanonicalTitle(title: string): string {
  return title.normalize("NFC").trim().replace(/\s+/g, " ").replace(/\.$/, "");
}

/**
 * Enforces the identity between a source's `sourceId` and its canonical
 * official identity (URL AND title). Returns an error for every source whose
 * URL or title differs from the registered identity for its `sourceId`, or
 * whose `sourceId` is not registered at all.
 */
export function validateOfficialSourceIdentity(
  theories: Record<string, TheorySection>
): string[] {
  const errors: string[] = [];

  for (const [name, theory] of Object.entries(theories)) {
    theory.sources?.forEach((source, idx) => {
      const identity = OFFICIAL_SOURCE_REGISTRY[source.sourceId];
      if (!identity) {
        errors.push(
          `[${name}] Error in source[${idx}] (${source.id}): sourceId '${source.sourceId}' has no entry in OFFICIAL_SOURCE_REGISTRY`
        );
        return;
      }
      if (normalizeOfficialUrl(source.sourceUrl) !== normalizeOfficialUrl(identity.canonicalUrl)) {
        errors.push(
          `[${name}] Error in source[${idx}] (${source.id}): sourceUrl does not match the official source identity for '${source.sourceId}' (expected ${identity.canonicalUrl}, got ${source.sourceUrl})`
        );
      }
      if (
        normalizeCanonicalTitle(source.sourceTitle) !== normalizeCanonicalTitle(identity.canonicalTitle)
      ) {
        errors.push(
          `[${name}] Error in source[${idx}] (${source.id}): sourceTitle does not match the official source identity for '${source.sourceId}' (expected '${identity.canonicalTitle}', got '${source.sourceTitle}')`
        );
      }
    });
  }

  return errors;
}

/**
 * Structural validation of the `sources` array of every theory module: stable
 * unique IDs, required fields, clean locators and official URLs. Combines the
 * per-field checks with the strict document-identity check.
 */
export function validateTheoryReferences(theories: Record<string, TheorySection>): string[] {
  const errors: string[] = [];

  for (const [name, theory] of Object.entries(theories)) {
    if (!theory || !Array.isArray(theory.sources)) {
      errors.push(`[${name}] Error: 'sources' is missing or not an array`);
      continue;
    }

    const seenIds = new Set<string>();

    theory.sources.forEach((source: LegalReference, idx) => {
      // 1. Verify stable, unique ID
      if (!source.id || typeof source.id !== "string" || source.id.trim() === "") {
        errors.push(`[${name}] Error in source[${idx}]: missing/invalid 'id'`);
      } else {
        if (seenIds.has(source.id)) {
          errors.push(`[${name}] Error in source[${idx}]: duplicate source ID '${source.id}'`);
        } else {
          seenIds.add(source.id);
        }
      }

      // 2. Verify sourceId and title
      if (!source.sourceId || typeof source.sourceId !== "string" || source.sourceId.trim() === "") {
        errors.push(`[${name}] Error in source[${idx}] (${source.id}): missing/invalid 'sourceId'`);
      }
      if (!source.sourceTitle || typeof source.sourceTitle !== "string" || source.sourceTitle.trim() === "") {
        errors.push(`[${name}] Error in source[${idx}] (${source.id}): missing/invalid 'sourceTitle'`);
      }

      // 3. Verify locator
      if (!source.locator || typeof source.locator !== "string" || source.locator.trim() === "") {
        errors.push(`[${name}] Error in source[${idx}] (${source.id}): missing/invalid 'locator'`);
      } else {
        for (const forbidden of LOCATOR_BLACKLIST) {
          if (source.locator.includes(forbidden)) {
            errors.push(
              `[${name}] Error in source[${idx}] (${source.id}): locator contains broken text "${forbidden}"`
            );
          }
        }
      }

      // 4. Verify URL structure (https://...)
      if (!source.sourceUrl || typeof source.sourceUrl !== "string") {
        errors.push(`[${name}] Error in source[${idx}] (${source.id}): missing/invalid 'sourceUrl'`);
      } else {
        try {
          const url = new URL(source.sourceUrl);
          if (url.protocol !== "https:") {
            errors.push(
              `[${name}] Error in source[${idx}] (${source.id}): 'sourceUrl' protocol must be https: (got ${url.protocol})`
            );
          }
          if (!OFFICIAL_DOMAINS.includes(url.hostname)) {
            errors.push(
              `[${name}] Error in source[${idx}] (${source.id}): 'sourceUrl' host '${url.hostname}' is not an official domain (${OFFICIAL_DOMAINS.join(", ")})`
            );
          }
        } catch (err) {
          errors.push(`[${name}] Error in source[${idx}] (${source.id}): 'sourceUrl' is not a valid URL: ${source.sourceUrl}`);
        }
      }
    });
  }

  errors.push(...validateOfficialSourceIdentity(theories));

  return errors;
}

const isMain = process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  console.log("Starting theory references validation...");
  const errors = validateTheoryReferences(lessonTheories);
  for (const error of errors) console.error(error);

  const byKind = getSourcesByKind();
  console.log(
    `Sources by kind: legislation ${byKind.legislation}, official-document ${byKind["official-document"]}, standard ${byKind.standard}, syllabus-reference ${byKind["syllabus-reference"]}, pedagogical ${byKind.pedagogical}`
  );

  if (errors.length > 0) {
    console.error(`References validation failed with ${errors.length} errors.`);
    process.exit(1);
  } else {
    console.log("References validation passed successfully!");
    process.exit(0);
  }
}
