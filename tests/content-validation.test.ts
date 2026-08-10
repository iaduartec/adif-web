import { describe, expect, it } from "vitest";

import { lessonReferenceSchema, questionSchema, simulationSchema } from "../lib/content/schema";
import {
  createContentRepository,
  getLesson,
  getQuestion,
  getSimulation,
  listLessons,
  listQuestions,
} from "../lib/content/repository";
import { lessonSummaries } from "../content/lesson-summaries";

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
  it("rejects an official lesson reference without a canonical HTTPS URL", () => {
    expect(
      lessonReferenceSchema.safeParse({
        title: "Ley Orgánica 3/2007",
        origin: "official_reference",
        url: "http://www.boe.es/buscar/act.php?id=BOE-A-2007-6115",
      }).success,
    ).toBe(false);
  });

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

  it("rejects simulations that repeat a question ID", () => {
    expect(
      simulationSchema.safeParse({
        id: "SIM-01",
        title: "Simulacro 01",
        questionIds: Array.from({ length: 60 }, () => "Q0001"),
        origin: "original_explanation",
      }).success,
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

  it("keeps structured summaries for the highest-yield lessons", () => {
    expect(lessonSummaries.psicometria.overview).toMatch(/psicométrica/i);
    expect(lessonSummaries["ingles-a2"].sections).toHaveLength(3);
    expect(lessonSummaries["ict-rd-346-2011"].sections).toHaveLength(3);
    expect(lessonSummaries["compatibilidad-electromagnetica"].sections).toHaveLength(3);
    expect(lessonSummaries["rcf-libro-1"].sections).toHaveLength(3);
  });

  it("uses the Personal Operativo PNI26/01 source for psychometric practice", () => {
    const url = getLesson("psicometria")!.officialReferences[0].url;

    expect(url).toBe("https://www.adif.es/w/pni26-01-personal-operativo");
    expect(url).not.toContain("pni26-03");
  });

  it("rejects simulations that reference questions outside the bank during repository construction", () => {
    const simulation = getSimulation("SIM-01")!;

    expect(() =>
      createContentRepository({
        lessons: listLessons(),
        questions: listQuestions(),
        simulations: [
          {
            ...simulation,
            questionIds: [...simulation.questionIds.slice(0, 59), "Q9999"],
          },
        ],
      }),
    ).toThrow(/missing question ID/);
  });

  it("rejects malformed lessons before they reach repository consumers", () => {
    const lesson = getLesson("igualdad")!;

    expect(() =>
      createContentRepository({
        lessons: [{ ...lesson, officialReferences: [] }],
        questions: listQuestions(),
        simulations: [],
      }),
    ).toThrow();
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
