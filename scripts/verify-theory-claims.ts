import { lessonTheories } from "../content/lesson-theory";
import type { TheoryClaim } from "../content/theory-types";

console.log("Starting theory claims traceability validation...");
let errorCount = 0;

function checkClaim(
  moduleName: string,
  location: string,
  claim: TheoryClaim,
  validSourceIds: Set<string>
) {
  if (claim.kind === "normative" || claim.kind === "interpretative") {
    if (!Array.isArray(claim.legalBasis) || claim.legalBasis.length === 0) {
      console.error(
        `[${moduleName}] Error in ${location} (claim ID: ${claim.id}): ` +
          `Kind is '${claim.kind}' but 'legalBasis' is missing, empty, or not an array.`
      );
      errorCount++;
    } else {
      claim.legalBasis.forEach((sourceId) => {
        if (!validSourceIds.has(sourceId)) {
          console.error(
            `[${moduleName}] Error in ${location} (claim ID: ${claim.id}): ` +
              `References source ID '${sourceId}' which is not registered in the module's sources.`
          );
          errorCount++;
        }
      });
    }
  }
}

for (const [name, theory] of Object.entries(lessonTheories)) {
  if (!theory) continue;

  const validSourceIds = new Set(theory.sources?.map((s) => s.id) || []);

  // 1. Check introduction claims
  if (Array.isArray(theory.introduction)) {
    theory.introduction.forEach((claim, idx) => {
      checkClaim(name, `introduction[${idx}]`, claim, validSourceIds);
    });
  }

  // 2. Check concepts claims
  if (Array.isArray(theory.concepts)) {
    theory.concepts.forEach((concept) => {
      if (Array.isArray(concept.claims)) {
        concept.claims.forEach((claim, idx) => {
          checkClaim(
            name,
            `concept ${concept.id} claim[${idx}]`,
            claim,
            validSourceIds
          );
        });
      }
    });
  }

  // 3. Check examples application claims
  if (Array.isArray(theory.examples)) {
    theory.examples.forEach((example) => {
      if (Array.isArray(example.application)) {
        example.application.forEach((claim, idx) => {
          checkClaim(
            name,
            `example ${example.id} application[${idx}]`,
            claim,
            validSourceIds
          );
        });
      }
    });
  }

  // 4. Check reviewTakeaways claims
  if (Array.isArray(theory.reviewTakeaways)) {
    theory.reviewTakeaways.forEach((claim, idx) => {
      checkClaim(name, `reviewTakeaways[${idx}]`, claim, validSourceIds);
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
