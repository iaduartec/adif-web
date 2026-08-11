import { lessonTheories } from "./lesson-theory";
import type { TheoryConcept } from "./theory-types";

const activeConcepts = Object.values(lessonTheories).flatMap((theory) => theory.concepts);

export const activeTheoryConceptRegistry: ReadonlyMap<string, TheoryConcept> = new Map(
  activeConcepts.map((concept) => [concept.id, concept]),
);
