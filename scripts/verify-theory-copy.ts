import { lessonTheories } from "../content/lesson-theory";

console.log("Starting theory copy audit...");
let errorCount = 0;

const blacklistedSubstrings = [
  "prevalece sobre la legislación ordinaria",
  "responsabilidad objetiva",
  "verification_pending",
  "verificationNote"
];

function checkText(moduleName: string, location: string, text: string) {
  if (!text) return;
  const lowerText = text.toLowerCase();
  for (const blacklist of blacklistedSubstrings) {
    if (lowerText.includes(blacklist.toLowerCase())) {
      console.error(
        `[${moduleName}] Error in ${location}: Found prohibited expression or technical regression: "${blacklist}"`
      );
      errorCount++;
    }
  }
}

for (const [name, theory] of Object.entries(lessonTheories)) {
  if (!theory) continue;

  // Introduction
  if (Array.isArray(theory.introduction)) {
    theory.introduction.forEach((claim, idx) => {
      checkText(name, `introduction[${idx}]`, claim.text);
    });
  }

  // Concepts
  if (Array.isArray(theory.concepts)) {
    theory.concepts.forEach((concept) => {
      if (Array.isArray(concept.claims)) {
        concept.claims.forEach((claim, idx) => {
          checkText(name, `concept ${concept.id} claim[${idx}]`, claim.text);
        });
      }
    });
  }

  // Examples
  if (Array.isArray(theory.examples)) {
    theory.examples.forEach((example) => {
      checkText(name, `example ${example.id} situation`, example.situation);
      if (Array.isArray(example.application)) {
        example.application.forEach((claim, idx) => {
          checkText(
            name,
            `example ${example.id} application[${idx}]`,
            claim.text
          );
        });
      }
    });
  }

  // Takeaways
  if (Array.isArray(theory.reviewTakeaways)) {
    theory.reviewTakeaways.forEach((claim, idx) => {
      checkText(name, `reviewTakeaways[${idx}]`, claim.text);
    });
  }
}

if (errorCount > 0) {
  console.error(`Copy audit failed with ${errorCount} errors.`);
  process.exit(1);
} else {
  console.log("Copy audit passed successfully!");
  process.exit(0);
}
