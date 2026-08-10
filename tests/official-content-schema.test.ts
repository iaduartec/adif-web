import { describe, expect, it } from "vitest";

import {
  officialExamSchema,
  officialQuestionSchema,
} from "../lib/content/schema";

const source = {
  kind: "official_adif_exam" as const,
  year: 2025,
  call: "PNI25/01",
  profileCode: "25/10PO",
  profileName: "Oficial de Telecomunicaciones de Entrada",
  examCode: "1131",
  questionNumber: 1,
  section: "specific" as const,
  isReserve: false,
  documentUrl: "https://www.adif.es/documents/20124/45240815/examen.pdf",
  bookletPage: 61,
  answerKeyPage: 6,
  verifiedAt: "2026-08-10",
  fingerprint: "sha256:4f8f26b905099d51b9f2d47a3c6cf1186be75f75c38644c9a92ef116e11f4ec1",
};

const officialQuestion = {
  id: "ADIF-2025-1131-Q01",
  sectionLabel: "Conocimiento específico",
  prompt: "Pregunta oficial de prueba de contrato.",
  options: [
    { key: "A", text: "Opción A" },
    { key: "B", text: "Opción B" },
    { key: "C", text: "Opción C" },
    { key: "D", text: "Opción D" },
  ],
  answer: "A",
  origin: "official_reference" as const,
  source,
};

describe("official ADIF content schemas", () => {
  it("parses a valid official question fixture", () => {
    expect(officialQuestionSchema.safeParse(officialQuestion).success).toBe(true);
  });

  it("rejects official questions without both source page references", () => {
    const { answerKeyPage: _answerKeyPage, ...withoutAnswerKeyPage } = source;

    expect(
      officialQuestionSchema.safeParse({
        ...officialQuestion,
        source: withoutAnswerKeyPage,
      }).success,
    ).toBe(false);
  });

  it("rejects a source URL outside www.adif.es", () => {
    expect(
      officialQuestionSchema.safeParse({
        ...officialQuestion,
        source: { ...source, documentUrl: "https://example.com/examen.pdf" },
      }).success,
    ).toBe(false);
  });

  it("rejects duplicate option keys", () => {
    expect(
      officialQuestionSchema.safeParse({
        ...officialQuestion,
        options: [
          { key: "A", text: "Opción A" },
          { key: "A", text: "Opción B" },
          { key: "C", text: "Opción C" },
          { key: "D", text: "Opción D" },
        ],
      }).success,
    ).toBe(false);
  });

  it("rejects answers outside A through D", () => {
    expect(
      officialQuestionSchema.safeParse({ ...officialQuestion, answer: "E" }).success,
    ).toBe(false);
  });

  it("rejects question IDs that do not match their official source", () => {
    expect(
      officialQuestionSchema.safeParse({
        ...officialQuestion,
        id: "ADIF-2025-1131-Q02",
      }).success,
    ).toBe(false);
  });

  it("rejects exam IDs and question IDs that do not match the official source", () => {
    expect(
      officialExamSchema.safeParse({
        id: "ADIF-2025-9999",
        title: "Examen oficial ADIF 2025 1131",
        source,
        questionIds: [officialQuestion.id],
        durationMinutes: 120,
        completeness: "complete",
        scoring: { correct: 1, incorrect: -1 / 3, omitted: 0 },
      }).success,
    ).toBe(false);

    expect(
      officialExamSchema.safeParse({
        id: "ADIF-2025-1131",
        title: "Examen oficial ADIF 2025 1131",
        source,
        questionIds: ["ADIF-2025-9999-Q01"],
        durationMinutes: 120,
        completeness: "complete",
        scoring: { correct: 1, incorrect: -1 / 3, omitted: 0 },
      }).success,
    ).toBe(false);
  });
});
