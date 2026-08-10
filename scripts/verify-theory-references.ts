import { lessonTheories } from "../content/lesson-theory";

console.log("Starting theory references validation...");
let errorCount = 0;

// Domains accepted for legal/official references. Only hosts actually used by
// the theory sources: BOE (normativa), ADIF (documentos institucionales) and
// Council of Europe (marco pedagógico MCER). Spanish legal sources must point
// to BOE.
const OFFICIAL_DOMAINS = ["www.boe.es", "www.adif.es", "www.coe.int"];

// Accent-stripped words that indicate the reference is "artículo" or a
// breakdown artifact rather than a real locator.
const LOCATOR_BLACKLIST = ["art-culo", "art-iculo", "art_culo", "Art-culo"];

for (const [name, theory] of Object.entries(lessonTheories)) {
  if (!theory || !Array.isArray(theory.sources)) {
    console.error(`[${name}] Error: 'sources' is missing or not an array`);
    errorCount++;
    continue;
  }

  const seenIds = new Set<string>();

  theory.sources.forEach((source, idx) => {
    // 1. Verify stable, unique ID
    if (!source.id || typeof source.id !== "string" || source.id.trim() === "") {
      console.error(`[${name}] Error in source[${idx}]: missing/invalid 'id'`);
      errorCount++;
    } else {
      if (seenIds.has(source.id)) {
        console.error(`[${name}] Error in source[${idx}]: duplicate source ID '${source.id}'`);
        errorCount++;
      } else {
        seenIds.add(source.id);
      }
    }

    // 2. Verify sourceId and title
    if (!source.sourceId || typeof source.sourceId !== "string" || source.sourceId.trim() === "") {
      console.error(`[${name}] Error in source[${idx}] (${source.id}): missing/invalid 'sourceId'`);
      errorCount++;
    }
    if (!source.sourceTitle || typeof source.sourceTitle !== "string" || source.sourceTitle.trim() === "") {
      console.error(`[${name}] Error in source[${idx}] (${source.id}): missing/invalid 'sourceTitle'`);
      errorCount++;
    }

    // 3. Verify locator
    if (!source.locator || typeof source.locator !== "string" || source.locator.trim() === "") {
      console.error(`[${name}] Error in source[${idx}] (${source.id}): missing/invalid 'locator'`);
      errorCount++;
    } else {
      for (const forbidden of LOCATOR_BLACKLIST) {
        if (source.locator.includes(forbidden)) {
          console.error(
            `[${name}] Error in source[${idx}] (${source.id}): locator contains broken text "${forbidden}"`
          );
          errorCount++;
        }
      }
    }

    // 4. Verify URL structure (https://...)
    if (!source.sourceUrl || typeof source.sourceUrl !== "string") {
      console.error(`[${name}] Error in source[${idx}] (${source.id}): missing/invalid 'sourceUrl'`);
      errorCount++;
    } else {
      try {
        const url = new URL(source.sourceUrl);
        if (url.protocol !== "https:") {
          console.error(`[${name}] Error in source[${idx}] (${source.id}): 'sourceUrl' protocol must be https: (got ${url.protocol})`);
          errorCount++;
        }
        if (!OFFICIAL_DOMAINS.includes(url.hostname)) {
          console.error(
            `[${name}] Error in source[${idx}] (${source.id}): 'sourceUrl' host '${url.hostname}' is not an official domain (${OFFICIAL_DOMAINS.join(", ")})`
          );
          errorCount++;
        }
      } catch (err) {
        console.error(`[${name}] Error in source[${idx}] (${source.id}): 'sourceUrl' is not a valid URL: ${source.sourceUrl}`);
        errorCount++;
      }
    }
  });
}

if (errorCount > 0) {
  console.error(`References validation failed with ${errorCount} errors.`);
  process.exit(1);
} else {
  console.log("References validation passed successfully!");
  process.exit(0);
}
