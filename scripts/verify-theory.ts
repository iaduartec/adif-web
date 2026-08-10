import { pathToFileURL } from "node:url";

import { lessonTheories } from "../content/lesson-theory";
import type { TheorySection } from "../content/theory-types";

export const VALID_KINDS = ["normative", "interpretative", "didactic", "example"];

type LocatedClaim = { location: string; claim: { id?: string; text?: string; kind?: string; legalBasis?: unknown } };

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

/**
 * Registers a stable ID in the GLOBAL registry (across every module) and
 * returns an error message when the ID is already taken, or `null` when the
 * registration succeeds. Claim, concept, example and source IDs share the same
 * namespace: the full combination must be globally unique.
 */
export function registerGlobalId(
  globalIds: Map<string, string>,
  id: string,
  location: string
): string | null {
  const existing = globalIds.get(id);
  if (existing) {
    return `Duplicate global ID '${id}' found at '${existing}' and '${location}'`;
  }
  globalIds.set(id, location);
  return null;
}

function checkClaim(moduleName: string, location: string, claim: LocatedClaim["claim"]): string[] {
  const errors: string[] = [];
  if (!claim.id || typeof claim.id !== "string") {
    errors.push(`[${moduleName}] Error in ${location}: missing/invalid 'id'`);
  }
  if (!claim.text || typeof claim.text !== "string" || claim.text.trim() === "") {
    errors.push(`[${moduleName}] Error in ${location}: missing/invalid 'text'`);
  }
  if (!claim.kind || !VALID_KINDS.includes(claim.kind)) {
    errors.push(
      `[${moduleName}] Error in ${location}: missing/invalid 'kind': ${String(claim.kind)}`
    );
  }
  if (!Array.isArray(claim.legalBasis)) {
    errors.push(
      `[${moduleName}] Error in ${location}: 'legalBasis' is missing or not an array`
    );
  }
  return errors;
}

/**
 * Structural validation plus GLOBAL ID uniqueness. Every claim, concept,
 * example and source ID is registered in a single namespace shared by all
 * modules, so duplicates across theories are reported.
 */
export function validateTheoryStructure(theories: Record<string, TheorySection>): string[] {
  const errors: string[] = [];
  const globalIds = new Map<string, string>();

  for (const [name, theory] of Object.entries(theories)) {
    if (!theory) {
      errors.push(`Error: Module ${name} is null or undefined.`);
      continue;
    }

    const expectedKeys: (keyof typeof theory)[] = [
      "introduction",
      "concepts",
      "examples",
      "reviewTakeaways",
      "sources",
    ];
    for (const key of expectedKeys) {
      if (!theory[key]) {
        errors.push(`[${name}] Error: Missing top-level key: ${key}`);
      }
    }

    if (Array.isArray(theory.introduction)) {
      theory.introduction.forEach((claim, idx) => {
        errors.push(...checkClaim(name, `introduction[${idx}]`, claim));
        if (claim.id) {
          const err = registerGlobalId(globalIds, claim.id, `${name}: introduction[${idx}]`);
          if (err) errors.push(`[${name}] Error: ${err}`);
        }
      });
    } else {
      errors.push(`[${name}] Error: 'introduction' is not an array`);
    }

    if (Array.isArray(theory.concepts)) {
      theory.concepts.forEach((concept, idx) => {
        if (!concept.id || typeof concept.id !== "string") {
          errors.push(`[${name}] Error in concepts[${idx}]: missing/invalid 'id'`);
        } else {
          const err = registerGlobalId(globalIds, concept.id, `${name}: concept ${concept.id}`);
          if (err) errors.push(`[${name}] Error: ${err}`);
        }
        if (!concept.title || typeof concept.title !== "string") {
          errors.push(`[${name}] Error in concepts[${idx}]: missing/invalid 'title'`);
        }
        if (!Array.isArray(concept.claims)) {
          errors.push(`[${name}] Error in concepts[${idx}]: 'claims' is not an array`);
        } else {
          concept.claims.forEach((claim, cIdx) => {
            errors.push(...checkClaim(name, `concept ${concept.id} claim[${cIdx}]`, claim));
            if (claim.id) {
              const err = registerGlobalId(
                globalIds,
                claim.id,
                `${name}: concept ${concept.id} claim[${cIdx}]`
              );
              if (err) errors.push(`[${name}] Error: ${err}`);
            }
          });
        }
      });
    } else {
      errors.push(`[${name}] Error: 'concepts' is not an array`);
    }

    if (Array.isArray(theory.examples)) {
      theory.examples.forEach((example, idx) => {
        if (!example.id || typeof example.id !== "string") {
          errors.push(`[${name}] Error in examples[${idx}]: missing/invalid 'id'`);
        } else {
          const err = registerGlobalId(globalIds, example.id, `${name}: example ${example.id}`);
          if (err) errors.push(`[${name}] Error: ${err}`);
        }
        if (!example.situation || typeof example.situation !== "string") {
          errors.push(`[${name}] Error in examples[${idx}]: missing/invalid 'situation'`);
        }
        if (!Array.isArray(example.application)) {
          errors.push(`[${name}] Error in examples[${idx}]: 'application' is not an array`);
        } else {
          example.application.forEach((claim, aIdx) => {
            errors.push(...checkClaim(name, `example ${example.id} application[${aIdx}]`, claim));
            if (claim.id) {
              const err = registerGlobalId(
                globalIds,
                claim.id,
                `${name}: example ${example.id} application[${aIdx}]`
              );
              if (err) errors.push(`[${name}] Error: ${err}`);
            }
          });
        }
      });
    } else {
      errors.push(`[${name}] Error: 'examples' is not an array`);
    }

    if (Array.isArray(theory.reviewTakeaways)) {
      theory.reviewTakeaways.forEach((claim, idx) => {
        errors.push(...checkClaim(name, `reviewTakeaways[${idx}]`, claim));
        if (claim.id) {
          const err = registerGlobalId(globalIds, claim.id, `${name}: reviewTakeaways[${idx}]`);
          if (err) errors.push(`[${name}] Error: ${err}`);
        }
      });
    } else {
      errors.push(`[${name}] Error: 'reviewTakeaways' is not an array`);
    }

    theory.sources?.forEach((source, idx) => {
      if (source.id) {
        const err = registerGlobalId(globalIds, source.id, `${name}: source[${idx}]`);
        if (err) errors.push(`[${name}] Error: ${err}`);
      }
    });
  }

  return errors;
}

const isMain = process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  console.log("Starting theory structural validation...");
  const errors = validateTheoryStructure(lessonTheories);
  for (const error of errors) console.error(error);

  if (errors.length > 0) {
    console.error(`Validation failed with ${errors.length} errors.`);
    process.exit(1);
  } else {
    console.log("Validation passed successfully!");
    process.exit(0);
  }
}
