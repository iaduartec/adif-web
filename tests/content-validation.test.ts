import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { lessonSummaries } from "../content/lesson-summaries";
import { activeTheoryConceptRegistry } from "../content/theory-concepts";
import { lessons } from "../content/lessons";
import {
  lessonReferenceSchema,
  officialExamsSchema,
  officialQuestionsSchema,
  questionSchema,
} from "../lib/content/schema";
import { contentFingerprint } from "../scripts/import-official-exams";

const repositoryRoot = path.resolve(import.meta.dirname, "..");

function readJson(fileName: string): unknown {
  const target = path.join(repositoryRoot, "content", fileName);
  return existsSync(target) ? JSON.parse(readFileSync(target, "utf8")) : [];
}

function listQuestions() {
  return officialQuestionsSchema.safeParse(readJson("questions.json"));
}

function listOfficialExams() {
  return officialExamsSchema.safeParse(readJson("exams.json"));
}

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

const retiredGenericDistractors = [
  "Aplicar una regla distinta solo porque contiene palabras tecnicas similares.",
  "Suponer que toda decision es valida si mejora la rapidez de ejecucion.",
  "Omitir la comprobacion documental porque el resultado parece evidente.",
];

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
    expect(questionSchema.safeParse({ ...validQuestion, answer: "E" }).success).toBe(false);
  });

});

describe("active official course content", () => {
  it("maps every official appearance to unique active theory concepts", () => {
    const parsed = listQuestions();
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    expect(activeTheoryConceptRegistry.size).toBe(87);
    expect(parsed.data).toHaveLength(102);
    for (const question of parsed.data) {
      expect(question.conceptIds.length, question.id).toBeGreaterThan(0);
      expect(new Set(question.conceptIds).size, question.id).toBe(question.conceptIds.length);
      expect(
        question.conceptIds.every((conceptId) => activeTheoryConceptRegistry.has(conceptId)),
        question.id,
      ).toBe(true);
    }
  });

  it("publishes 102 uniquely identified official ADIF appearances", () => {
    const parsed = listQuestions();
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    const questions = parsed.data;
    expect(questions).toHaveLength(102);
    expect(new Set(questions.map((question) => question.id)).size).toBe(102);
    expect(
      questions.every(
        (question) =>
          question.id ===
          `ADIF-${question.source.year}-${question.source.examCode}-Q${String(
            question.source.questionNumber,
          ).padStart(2, "0")}`,
      ),
    ).toBe(true);
    expect(questions.every((question) => question.origin === "official_reference")).toBe(true);
    expect(
      questions.every((question) => question.source.documentUrl.startsWith("https://www.adif.es/")),
    ).toBe(true);
  });

  it("uses deterministic fingerprints and preserves literal ADIF reuse across models", () => {
    const parsed = listQuestions();
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    const questionsByFingerprint = new Map<string, typeof parsed.data>();
    for (const question of parsed.data) {
      expect(question.source.fingerprint).toBe(
        contentFingerprint({
          prompt: question.prompt,
          options: question.options,
          answer: question.answer,
        }),
      );
      const appearances = questionsByFingerprint.get(question.source.fingerprint) ?? [];
      appearances.push(question);
      questionsByFingerprint.set(question.source.fingerprint, appearances);
    }

    const reusedContent = [...questionsByFingerprint.values()].filter((appearances) => appearances.length > 1);
    expect(questionsByFingerprint.size).toBe(72);
    expect(reusedContent).toHaveLength(30);
    expect(
      reusedContent.every(
        (appearances) =>
          appearances.length === 2 &&
          new Set(
            appearances.map((question) => `${question.source.year}-${question.source.examCode}`),
          ).size === 2 &&
          new Set(
            appearances.map((question) =>
              JSON.stringify([question.prompt, question.options, question.answer]),
            ),
          ).size === 1,
      ),
    ).toBe(true);
  });

  it("publishes the six visually reviewed official exam models", () => {
    const parsedExams = listOfficialExams();
    const parsedQuestions = listQuestions();
    expect(parsedExams.success).toBe(true);
    expect(parsedQuestions.success).toBe(true);
    if (!parsedExams.success || !parsedQuestions.success) return;

    expect(parsedExams.data.map((exam) => [exam.id, exam.questionIds.length])).toEqual([
      ["ADIF-2023-1433", 15],
      ["ADIF-2023-4101", 15],
      ["ADIF-2024-3403", 18],
      ["ADIF-2024-3413", 18],
      ["ADIF-2025-1131", 18],
      ["ADIF-2025-4104", 18],
    ]);
    expect(parsedExams.data.map((exam) => exam.durationMinutes)).toEqual([15, 15, 15, 15, 15, 15]);
    expect(parsedExams.data.every((exam) => exam.completeness === "specific_part")).toBe(true);
    const expectedQuestionNumbers = {
      "ADIF-2023-1433": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      "ADIF-2023-4101": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      "ADIF-2024-3403": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
      "ADIF-2024-3413": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
      "ADIF-2025-1131": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
      "ADIF-2025-4104": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    } as const;

    for (const exam of parsedExams.data) {
      const appearances = parsedQuestions.data.filter(
        (question) => `ADIF-${question.source.year}-${question.source.examCode}` === exam.id,
      );
      expect(exam.questionIds).toEqual(appearances.map((question) => question.id));
      expect(appearances.map((question) => question.source.questionNumber)).toEqual(
        expectedQuestionNumbers[exam.id as keyof typeof expectedQuestionNumbers],
      );
    }

    const questionIds = parsedExams.data.flatMap((exam) => exam.questionIds);
    expect(questionIds).toHaveLength(102);
    expect(new Set(questionIds).size).toBe(102);

    const missing2023Reserves = parsedQuestions.data.filter(
      (question) => question.source.year === 2023 && question.source.questionNumber >= 16,
    );
    expect(missing2023Reserves).toEqual([]);

    const publishedReserves = parsedQuestions.data.filter(
      (question) => question.source.year >= 2024 && question.source.questionNumber >= 16,
    );
    expect(publishedReserves).toHaveLength(12);
    expect(
      publishedReserves.every(
        (question) => question.source.isReserve && ["A", "B", "C", "D"].includes(question.answer),
      ),
    ).toBe(true);
    expect(
      parsedQuestions.data
        .filter((question) => question.source.questionNumber <= 15)
        .every((question) => !question.source.isReserve),
    ).toBe(true);
  });

  it("does not publish any retired generic synthetic distractor", () => {
    const parsed = listQuestions();
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    const activeOptions = parsed.data.flatMap((question) => question.options.map((option) => option.text));
    expect(activeOptions).not.toEqual(expect.arrayContaining(retiredGenericDistractors));
  });
});

describe("lesson content", () => {
  it("provides lessons with declared origins and stable slugs", () => {
    expect(lessons.length).toBeGreaterThanOrEqual(8);
    expect(lessons.every((lesson) => lesson.origin)).toBe(true);
    expect(lessons.find((lesson) => lesson.slug === "igualdad")?.origin).toBe("original_explanation");
  });

  it("keeps structured summaries for the highest-yield lessons", () => {
    expect(lessonSummaries.psicometria.overview).toMatch(/psicométrica/i);
    expect(lessonSummaries["ingles-a2"].sections).toHaveLength(3);
    expect(lessonSummaries["ict-rd-346-2011"].sections).toHaveLength(3);
    expect(lessonSummaries["compatibilidad-electromagnetica"].sections).toHaveLength(3);
    expect(lessonSummaries["rcf-libro-1"].sections).toHaveLength(3);
  });

  it("uses the Personal Operativo PNI26/01 source for psychometric practice", () => {
    const psychometricLesson = lessons.find((lesson) => lesson.slug === "psicometria");
    expect(psychometricLesson?.officialReferences[0].url).toBe(
      "https://www.adif.es/w/pni26-01-personal-operativo",
    );
  });
});
