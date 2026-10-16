import { z } from "zod";

export const psychometricModeSchema = z.enum(["training", "timed", "simulation"]);
export type PsychometricMode = z.infer<typeof psychometricModeSchema>;

/**
 * Mode selection changes how the block is timed, never where the questions come
 * from: the same reviewed records are used in every mode.
 */
export const psychometricModes = [
  {
    value: "training",
    label: "Entrenamiento",
    secondsPerQuestion: null,
    description: "Sin cronómetro: prioriza razonar el patrón de cada aptitud antes de responder.",
  },
  {
    value: "timed",
    label: "Contrarreloj",
    secondsPerQuestion: 30,
    description: "Cronómetro opcional por pregunta para ganar velocidad sin sacrificar precisión.",
  },
  {
    value: "simulation",
    label: "Simulacro",
    secondsPerQuestion: 24,
    description: "Bloque cronometrado separado; la procedencia de las preguntas no cambia, solo el tiempo.",
  },
] as const satisfies readonly {
  value: PsychometricMode;
  label: string;
  secondsPerQuestion: number | null;
  description: string;
}[];

export function selectPsychometricQuestions<T extends { id: string }>(
  questions: readonly T[],
  mode: unknown,
): readonly T[] {
  psychometricModeSchema.parse(mode);
  return [...questions];
}
