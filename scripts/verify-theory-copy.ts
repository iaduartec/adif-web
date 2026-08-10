import { lessonTheories } from "../content/lesson-theory";

console.log("Starting theory copy audit...");
let errorCount = 0;

const blacklistedSubstrings = [
  "prevalece sobre la legislación ordinaria",
  "responsabilidad objetiva",
  "verification_pending",
  "verificationNote",
];

// Common typographical regressions that indicate broken text.
const typoPatterns: Array<[string, RegExp]> = [
  ["missing accent in 'constituira'", /\bconstituira\b/],
  ["missing accent in 'razon'", /\brazon de\b/],
  ["missing accent in 'funcion'", /\ben funcion de\b/],
  ["missing accent in 'sera'", /\bsera (el|la|de|obligator)/],
  ["missing accent in 'debera'", /\bdebera\b/],
  ["missing accent in 'podra'", /\bpodra\b/],
  ["duplicated word", /\b(\w{3,})\s+\1\b/],
  ["empty parentheses", /\(\s*\)/],
  ["two consecutive spaces", /\S {2,}\S/],
];

// Absolute expressions that overstate legal certainty unless explicitly
// authorized for a specific claim.
// Uses phrases rather than single words to avoid legal terms like
// "mayoría absoluta" or "seguridad absoluta".
const ABSOLUTE_EXPRESSIONS = [
  "es de carácter absoluto",
  "es absolutamente",
  "absolutamente incompatible",
  "sin excepción alguna",
  "totalmente prohibido",
  "rigurosamente prohibido",
  "automáticamente",
  "nunca se debe",
  "no se puede nunca",
];

// Per-claim exceptions for absolute expressions. An exception is scoped to a
// SINGLE claim: if the same expression appears in any other claim it is still
// flagged. There are no global or module-level overrides on purpose.
// Format: { claimId, expression, reason }
const ABSOLUTE_WHITELIST: Array<{
  claimId: string;
  expression: string;
  reason: string;
}> = [];

function checkText(moduleName: string, location: string, claimId: string, text: string) {
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

  for (const [label, pattern] of typoPatterns) {
    if (pattern.test(text)) {
      console.error(`[${moduleName}] Error in ${location}: ${label}: "${text}"`);
      errorCount++;
    }
  }

  for (const expression of ABSOLUTE_EXPRESSIONS) {
    if (lowerText.includes(expression)) {
      const authorized = ABSOLUTE_WHITELIST.some(
        (w) => w.claimId === claimId && w.expression === expression
      );
      if (!authorized) {
        console.error(
          `[${moduleName}] Error in ${location} (claim ID: ${claimId}): overreaching absolute expression "${expression}": "${text}"`
        );
        errorCount++;
      }
    }
  }
}

for (const [name, theory] of Object.entries(lessonTheories)) {
  if (!theory) continue;

  // Introduction
  if (Array.isArray(theory.introduction)) {
    theory.introduction.forEach((claim, idx) => {
      checkText(name, `introduction[${idx}]`, claim.id, claim.text);
    });
  }

  // Concepts
  if (Array.isArray(theory.concepts)) {
    theory.concepts.forEach((concept) => {
      if (Array.isArray(concept.claims)) {
        concept.claims.forEach((claim, idx) => {
          checkText(name, `concept ${concept.id} claim[${idx}]`, claim.id, claim.text);
        });
      }
    });
  }

  // Examples
  if (Array.isArray(theory.examples)) {
    theory.examples.forEach((example) => {
      checkText(name, `example ${example.id} situation`, example.id, example.situation);
      if (Array.isArray(example.application)) {
        example.application.forEach((claim, idx) => {
          checkText(
            name,
            `example ${example.id} application[${idx}]`,
            claim.id,
            claim.text
          );
        });
      }
    });
  }

  // Takeaways
  if (Array.isArray(theory.reviewTakeaways)) {
    theory.reviewTakeaways.forEach((claim, idx) => {
      checkText(name, `reviewTakeaways[${idx}]`, claim.id, claim.text);
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
