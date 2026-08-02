import { describe, expect, it } from "vitest";

import { deriveErrorNotebook } from "../lib/practice/error-notebook";
import type { PracticeQuestion } from "../components/practice/question-session";

const questions: PracticeQuestion[] = [
  {
    id: "Q0001", module: "G1 Igualdad", prompt: "Primera pregunta", options: [{ key: "A", text: "A" }, { key: "B", text: "B" }, { key: "C", text: "C" }, { key: "D", text: "D" }], explanation: "Explicación 1", sourceNote: "Fuente 1", origin: "original_explanation",
  },
  {
    id: "Q0002", module: "G2 PRL", prompt: "Segunda pregunta", options: [{ key: "A", text: "A" }, { key: "B", text: "B" }, { key: "C", text: "C" }, { key: "D", text: "D" }], explanation: "Explicación 2", sourceNote: "Fuente 2", origin: "original_explanation",
  },
];

describe("deriveErrorNotebook", () => {
  it("keeps only questions whose latest attempt is incorrect and joins their static content", () => {
    const items = deriveErrorNotebook(questions, [
      { question_id: "Q0001", is_correct: false, created_at: "2026-08-01T09:00:00.000Z" },
      { question_id: "Q0002", is_correct: false, created_at: "2026-08-01T10:00:00.000Z" },
      { question_id: "Q0001", is_correct: true, created_at: "2026-08-01T11:00:00.000Z" },
    ]);

    expect(items).toEqual([
      expect.objectContaining({ id: "Q0002", prompt: "Segunda pregunta", module: "G2 PRL" }),
    ]);
  });
});
