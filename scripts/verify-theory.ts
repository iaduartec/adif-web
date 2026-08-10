import { lessonTheories } from "../content/lesson-theory";
import type {
  TheoryClaim,
  TheorySection,
} from "../content/theory-types";

console.log("Starting theory structural validation...");
let errorCount = 0;

const VALID_KINDS = ["normative", "interpretative", "didactic", "example"];

type LocatedClaim = { location: string; claim: TheoryClaim };

function allClaims(theory: TheorySection): LocatedClaim[] {
  const out: LocatedClaim[] = [];
  theory.introduction?.forEach((claim, idx) =>
    out.push({ location: `introduction[${idx}]`, claim })
  );
  theory.concepts?.forEach((concept) =>
    concept.claims?.forEach((claim, idx) =>
      out.push({ location: `concept ${concept.id} claim[${idx}]`, claim })
    )
  );
  theory.examples?.forEach((example) =>
    example.application?.forEach((claim, idx) =>
      out.push({ location: `example ${example.id} application[${idx}]`, claim })
    )
  );
  theory.reviewTakeaways?.forEach((claim, idx) =>
    out.push({ location: `reviewTakeaways[${idx}]`, claim })
  );
  return out;
}

function checkClaim(moduleName: string, location: string, claim: TheoryClaim) {
  if (!claim.id || typeof claim.id !== "string") {
    console.error(`[${moduleName}] Error in ${location}: missing/invalid 'id'`);
    errorCount++;
  }
  if (!claim.text || typeof claim.text !== "string" || claim.text.trim() === "") {
    console.error(`[${moduleName}] Error in ${location}: missing/invalid 'text'`);
    errorCount++;
  }
  if (!claim.kind || !VALID_KINDS.includes(claim.kind)) {
    console.error(
      `[${moduleName}] Error in ${location}: missing/invalid 'kind': ${String(claim.kind)}`
    );
    errorCount++;
  }
  if (!Array.isArray(claim.legalBasis)) {
    console.error(
      `[${moduleName}] Error in ${location}: 'legalBasis' is missing or not an array`
    );
    errorCount++;
  }
}

for (const [name, theory] of Object.entries(lessonTheories)) {
  console.log(`Checking module: ${name}`);

  if (!theory) {
    console.error(`Error: Module ${name} is null or undefined.`);
    errorCount++;
    continue;
  }

  // 1. Check top-level properties
  const expectedKeys: (keyof typeof theory)[] = [
    "introduction",
    "concepts",
    "examples",
    "reviewTakeaways",
    "sources",
  ];
  for (const key of expectedKeys) {
    if (!theory[key]) {
      console.error(`[${name}] Error: Missing top-level key: ${key}`);
      errorCount++;
    }
  }

  // 2. Validate each section's shape and claims
  if (Array.isArray(theory.introduction)) {
    theory.introduction.forEach((claim, idx) =>
      checkClaim(name, `introduction[${idx}]`, claim)
    );
  } else {
    console.error(`[${name}] Error: 'introduction' is not an array`);
    errorCount++;
  }

  if (Array.isArray(theory.concepts)) {
    theory.concepts.forEach((concept, idx) => {
      if (!concept.id || typeof concept.id !== "string") {
        console.error(`[${name}] Error in concepts[${idx}]: missing/invalid 'id'`);
        errorCount++;
      }
      if (!concept.title || typeof concept.title !== "string") {
        console.error(`[${name}] Error in concepts[${idx}]: missing/invalid 'title'`);
        errorCount++;
      }
      if (!Array.isArray(concept.claims)) {
        console.error(`[${name}] Error in concepts[${idx}]: 'claims' is not an array`);
        errorCount++;
      } else {
        concept.claims.forEach((claim, cIdx) =>
          checkClaim(name, `concept ${concept.id} claim[${cIdx}]`, claim)
        );
      }
    });
  } else {
    console.error(`[${name}] Error: 'concepts' is not an array`);
    errorCount++;
  }

  if (Array.isArray(theory.examples)) {
    theory.examples.forEach((example, idx) => {
      if (!example.id || typeof example.id !== "string") {
        console.error(`[${name}] Error in examples[${idx}]: missing/invalid 'id'`);
        errorCount++;
      }
      if (!example.situation || typeof example.situation !== "string") {
        console.error(`[${name}] Error in examples[${idx}]: missing/invalid 'situation'`);
        errorCount++;
      }
      if (!Array.isArray(example.application)) {
        console.error(`[${name}] Error in examples[${idx}]: 'application' is not an array`);
        errorCount++;
      } else {
        example.application.forEach((claim, aIdx) =>
          checkClaim(name, `example ${example.id} application[${aIdx}]`, claim)
        );
      }
    });
  } else {
    console.error(`[${name}] Error: 'examples' is not an array`);
    errorCount++;
  }

  if (Array.isArray(theory.reviewTakeaways)) {
    theory.reviewTakeaways.forEach((claim, idx) =>
      checkClaim(name, `reviewTakeaways[${idx}]`, claim)
    );
  } else {
    console.error(`[${name}] Error: 'reviewTakeaways' is not an array`);
    errorCount++;
  }

  // 3. Duplicate ID detection (claims + sources must be globally unique)
  const seenIds = new Set<string>();
  const registerId = (id: string, kind: string) => {
    if (seenIds.has(id)) {
      console.error(`[${name}] Error: Duplicate ${kind} ID: ${id}`);
      errorCount++;
    } else {
      seenIds.add(id);
    }
  };

  for (const located of allClaims(theory)) {
    if (located.claim.id) registerId(located.claim.id, "claim");
  }
  theory.sources?.forEach((s) => {
    if (s.id) registerId(s.id, "source");
  });
}

if (errorCount > 0) {
  console.error(`Validation failed with ${errorCount} errors.`);
  process.exit(1);
} else {
  console.log("Validation passed successfully!");
  process.exit(0);
}
