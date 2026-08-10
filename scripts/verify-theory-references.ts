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
 * Canonical official URL per `sourceId`. Every legal reference carrying a
 * given `sourceId` MUST point to the exact document identity registered here.
 * BOE document IDs (`BOE-A-…`, `DOUE-L-…`) are the authoritative identity of
 * a norm: a typo in the ID silently sends learners to a different document,
 * so identity is validated verbatim instead of relying only on the domain
 * allow-list. Any `sourceId` not present in this registry fails the check, so
 * the registry is kept complete whenever a new source is added.
 */
export const OFFICIAL_SOURCE_REGISTRY: Record<string, string> = {
  "CE": "https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229",
  "LO 3/2007": "https://www.boe.es/buscar/act.php?id=BOE-A-2007-6115",
  "Ley 31/1995": "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
  "Ley 38/2015": "https://www.boe.es/buscar/act.php?id=BOE-A-2015-10440",
  "Ley 53/1984": "https://www.boe.es/buscar/act.php?id=BOE-A-1985-151",
  "RD 2395/2004": "https://www.boe.es/buscar/act.php?id=BOE-A-2004-21913",
  "RD 346/2011": "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
  "RD 664/2015": "https://www.boe.es/buscar/act.php?id=BOE-A-2015-8042",
  "RD 773/1997": "https://www.boe.es/buscar/act.php?id=BOE-A-1997-12735",
  "RD 902/2020": "https://www.boe.es/buscar/act.php?id=BOE-A-2020-12215",
  "TREBEP": "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11719",
  "Real Decreto 186/2016": "https://www.boe.es/buscar/act.php?id=BOE-A-2016-4442",
  "Directiva 2014/30/UE": "https://www.boe.es/buscar/doc.php?id=DOUE-L-2014-80623",
  "DR 2027": "https://www.adif.es/sobre-adif/declaracion-red",
  "EN 50121": "https://www.adif.es/w/pni26-01-personal-operativo",
  "MET-PSI-01": "https://www.adif.es/w/pni26-01-personal-operativo",
  "MCER-A2": "https://www.coe.int/en/web/common-european-framework-reference-languages/introduction-and-context",
};

function normalizeOfficialUrl(url: string): string | null {
  try {
    return new URL(url).toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

/**
 * Enforces the identity between a source's `sourceId` and its canonical
 * official URL. Returns an error for every source whose URL differs from the
 * registered identity for its `sourceId`, or whose `sourceId` is not
 * registered at all.
 */
export function validateOfficialSourceIdentity(
  theories: Record<string, TheorySection>
): string[] {
  const errors: string[] = [];

  for (const [name, theory] of Object.entries(theories)) {
    theory.sources?.forEach((source, idx) => {
      const canonical = OFFICIAL_SOURCE_REGISTRY[source.sourceId];
      if (!canonical) {
        errors.push(
          `[${name}] Error in source[${idx}] (${source.id}): sourceId '${source.sourceId}' has no entry in OFFICIAL_SOURCE_REGISTRY`
        );
        return;
      }
      if (normalizeOfficialUrl(source.sourceUrl) !== normalizeOfficialUrl(canonical)) {
        errors.push(
          `[${name}] Error in source[${idx}] (${source.id}): sourceUrl does not match the official source identity for '${source.sourceId}' (expected ${canonical}, got ${source.sourceUrl})`
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

  if (errors.length > 0) {
    console.error(`References validation failed with ${errors.length} errors.`);
    process.exit(1);
  } else {
    console.log("References validation passed successfully!");
    process.exit(0);
  }
}
