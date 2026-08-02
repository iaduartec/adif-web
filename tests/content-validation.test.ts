import { describe, expect, it } from "vitest";

import { questionSchema } from "../lib/content/schema";
import {
  getLesson,
  getQuestion,
  getSimulation,
  listLessons,
  listQuestions,
} from "../lib/content/repository";

const validQuestion = {
  id: "Q0001",
  module: "G1 Igualdad",
  prompt: "Seleccione la respuesta correcta.",
  options: [
    { key: "A", text: "Opción A" },
    { key: "B", text: "Opción B" },
    { key: "C", text: "Opción C" },
    { key: "D", text: "Opción D" },
  ],
  answer: "A",
  explanation: "Explicación didáctica original.",
  sourceNote: "Referencia de estudio; verificar en fuente oficial.",
  origin: "original_explanation",
};

describe("course content schemas", () => {
  it("rejects questions that do not contain exactly four keyed options", () => {
    expect(
      questionSchema.safeParse({
        ...validQuestion,
        options: validQuestion.options.slice(0, 3),
      }).success,
    ).toBe(false);
  });

  it("rejects questions whose answer is not a valid option key", () => {
    expect(
      questionSchema.safeParse({ ...validQuestion, answer: "E" }).success,
    ).toBe(false);
  });
});

describe("course content repository", () => {
  it("exposes a complete, uniquely identified question bank", () => {
    const questions = listQuestions();

    expect(questions).toHaveLength(4_500);
    expect(new Set(questions.map((question) => question.id)).size).toBe(4_500);
    expect(getQuestion("Q0001")?.id).toBe("Q0001");
    expect(getQuestion("Q4500")?.id).toBe("Q4500");
    expect(getQuestion("Q4501")).toBeUndefined();
  });

  it("filters questions by module, text, IDs, and origin in one public result", () => {
    const question = getQuestion("Q0001");
    expect(question).toBeDefined();

    const results = listQuestions({
      module: question!.module,
      query: question!.prompt.slice(0, 12),
      ids: ["Q0001", "Q0002"],
      origin: "original_explanation",
    });

    expect(results.map((result) => result.id)).toEqual(["Q0001"]);
  });

  it("provides lessons with declared origins and stable slugs", () => {
    const lessons = listLessons();

    expect(lessons.length).toBeGreaterThanOrEqual(8);
    expect(lessons.every((lesson) => lesson.origin)).toBe(true);
    expect(getLesson("igualdad")?.origin).toBe("original_explanation");
    expect(getLesson("missing-lesson")).toBeUndefined();
  });

  it("provides thirty simulations containing sixty distinct existing questions", () => {
    const questionIds = new Set(listQuestions().map((question) => question.id));
    const simulations = Array.from({ length: 30 }, (_, index) =>
      getSimulation(`SIM-${String(index + 1).padStart(2, "0")}`),
    );

    expect(simulations).toHaveLength(30);
    expect(simulations.every((simulation) => simulation !== undefined)).toBe(true);
    expect(
      simulations.every(
        (simulation) =>
          simulation!.questionIds.length === 60 &&
          new Set(simulation!.questionIds).size === 60 &&
          simulation!.questionIds.every((id) => questionIds.has(id)),
      ),
    ).toBe(true);
    expect(getSimulation("SIM-31")).toBeUndefined();
  });
});
