import { z } from "zod";
import { lessonTheories } from "../../content/lesson-theory";

/** Controlled original aptitude taxonomy for the psychometric domain. */
export const originalPsychometricTopicIds = [
  "verbal",
  "synonym-antonym",
  "numerical",
  "calculation",
  "series",
  "logic",
  "matrices",
  "abstract-patterns",
  "attention",
  "difference-detection",
  "memory",
  "sequences",
  "perceptual-speed",
] as const;

export type PsychometricAptitudeId = (typeof originalPsychometricTopicIds)[number];

export const psychometricAptitudeSchema = z.enum(originalPsychometricTopicIds);
export const psychometricSkillSchema = psychometricAptitudeSchema;

export function psychometricAptitudeConceptId(id: PsychometricAptitudeId): string {
  return `psico-topic-${id}`;
}

const aptitudeTitles: Record<PsychometricAptitudeId, string> = {
  verbal: "Aptitud verbal",
  "synonym-antonym": "Sinónimos y antónimos",
  numerical: "Aptitud numérica",
  calculation: "Cálculo mental",
  series: "Series numéricas",
  logic: "Razonamiento lógico",
  matrices: "Matrices",
  "abstract-patterns": "Patrones abstractos",
  attention: "Atención",
  "difference-detection": "Detección de diferencias",
  memory: "Memoria",
  sequences: "Secuencias",
  "perceptual-speed": "Velocidad perceptiva",
};

const psychologyConceptIds = new Set(lessonTheories["psicometria"]!.concepts.map(({ id }) => id));

/**
 * Each aptitude must map to its own active teaching concept so reviewed items
 * can link to a concrete didactic note. Kept in sync with `content/theories/psicometria.ts`.
 */
export const psychometricAptitudes = originalPsychometricTopicIds.map((id) => {
  const activeConceptIds = [psychometricAptitudeConceptId(id)];
  if (!activeConceptIds.every((conceptId) => psychologyConceptIds.has(conceptId))) {
    throw new Error(`Psychometric aptitude '${id}' has no active teaching concept.`);
  }
  return { id, title: aptitudeTitles[id], skill: id, activeConceptIds };
});

export function getPsychometricCurriculum() {
  return structuredClone(psychometricAptitudes);
}

export {
  psychometricModeSchema,
  psychometricModes,
  selectPsychometricQuestions,
} from "./psychometric-modes";
export type { PsychometricMode } from "./psychometric-modes";
