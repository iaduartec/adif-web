import { lessonTheories } from "../content/lesson-theory";

console.log("Starting theory structural validation...");
let errorCount = 0;

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

  // 2. Validate introduction
  if (Array.isArray(theory.introduction)) {
    theory.introduction.forEach((claim, idx) => {
      if (!claim.id || typeof claim.id !== "string") {
        console.error(`[${name}] Error in introduction[${idx}]: missing/invalid 'id'`);
        errorCount++;
      }
      if (!claim.text || typeof claim.text !== "string") {
        console.error(`[${name}] Error in introduction[${idx}]: missing/invalid 'text'`);
        errorCount++;
      }
      if (!claim.kind || !["normative", "interpretative", "didactic", "example"].includes(claim.kind)) {
        console.error(`[${name}] Error in introduction[${idx}]: missing/invalid 'kind': ${claim.kind}`);
        errorCount++;
      }
    });
  } else {
    console.error(`[${name}] Error: 'introduction' is not an array`);
    errorCount++;
  }

  // 3. Validate concepts
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
        concept.claims.forEach((claim, cIdx) => {
          if (!claim.id || typeof claim.id !== "string") {
            console.error(`[${name}] Error in concept ${concept.id} claim[${cIdx}]: missing/invalid 'id'`);
            errorCount++;
          }
          if (!claim.text || typeof claim.text !== "string") {
            console.error(`[${name}] Error in concept ${concept.id} claim[${cIdx}]: missing/invalid 'text'`);
            errorCount++;
          }
          if (!claim.kind || !["normative", "interpretative", "didactic", "example"].includes(claim.kind)) {
            console.error(`[${name}] Error in concept ${concept.id} claim[${cIdx}]: missing/invalid 'kind': ${claim.kind}`);
            errorCount++;
          }
        });
      }
    });
  } else {
    console.error(`[${name}] Error: 'concepts' is not an array`);
    errorCount++;
  }

  // 4. Validate examples
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
        example.application.forEach((claim, aIdx) => {
          if (!claim.id || typeof claim.id !== "string") {
            console.error(`[${name}] Error in example ${example.id} application[${aIdx}]: missing/invalid 'id'`);
            errorCount++;
          }
          if (!claim.text || typeof claim.text !== "string") {
            console.error(`[${name}] Error in example ${example.id} application[${aIdx}]: missing/invalid 'text'`);
            errorCount++;
          }
          if (!claim.kind || !["normative", "interpretative", "didactic", "example"].includes(claim.kind)) {
            console.error(`[${name}] Error in example ${example.id} application[${aIdx}]: missing/invalid 'kind': ${claim.kind}`);
            errorCount++;
          }
        });
      }
    });
  } else {
    console.error(`[${name}] Error: 'examples' is not an array`);
    errorCount++;
  }

  // 5. Validate reviewTakeaways
  if (Array.isArray(theory.reviewTakeaways)) {
    theory.reviewTakeaways.forEach((claim, idx) => {
      if (!claim.id || typeof claim.id !== "string") {
        console.error(`[${name}] Error in reviewTakeaways[${idx}]: missing/invalid 'id'`);
        errorCount++;
      }
      if (!claim.text || typeof claim.text !== "string") {
        console.error(`[${name}] Error in reviewTakeaways[${idx}]: missing/invalid 'text'`);
        errorCount++;
      }
      if (!claim.kind || !["normative", "interpretative", "didactic", "example"].includes(claim.kind)) {
        console.error(`[${name}] Error in reviewTakeaways[${idx}]: missing/invalid 'kind': ${claim.kind}`);
        errorCount++;
      }
    });
  } else {
    console.error(`[${name}] Error: 'reviewTakeaways' is not an array`);
    errorCount++;
  }
}

if (errorCount > 0) {
  console.error(`Validation failed with ${errorCount} errors.`);
  process.exit(1);
} else {
  console.log("Validation passed successfully!");
  process.exit(0);
}
