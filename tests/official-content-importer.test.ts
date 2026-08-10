import { describe, expect, it } from "vitest";

import { parseOfficialExamTranscriptions } from "../scripts/import-official-exams";

const manifestEntry = {
  id: "ADIF-2025-1131",
  year: 2025,
  call: "PNI25/01",
  profileCode: "25/10PO",
  profileName: "Oficial de Telecomunicaciones de Entrada",
  examCode: "1131",
  documentUrl: "https://www.adif.es/documents/20124/45240815/examen.pdf",
  durationMinutes: 120,
  expectedQuestionNumbers: [1, 2],
  completeness: "complete" as const,
  scoring: { correct: 1, incorrect: -1 / 3, omitted: 0 },
};

const question = {
  section: "specific" as const,
  sectionLabel: "Conocimientos específicos",
  isReserve: false,
  bookletPage: 61,
  answerKeyPage: 6,
  verifiedAt: "2026-08-10",
  prompt: "¿Cuál es la respuesta correcta de la pregunta oficial?",
  options: [
    { key: "A", text: "Opción oficial A" },
    { key: "B", text: "Opción oficial B" },
    { key: "C", text: "Opción oficial C" },
    { key: "D", text: "Opción oficial D" },
  ],
  answer: "A" as const,
};

function validInput() {
  return {
    manifest: [manifestEntry],
    transcriptions: [
      {
        examId: "ADIF-2025-1131",
        questions: [
          { number: 1, ...question },
          {
            number: 2,
            ...question,
            prompt: "¿Cuál es la segunda respuesta oficial?",
          },
        ],
      },
    ],
  };
}

describe("official ADIF exam importer", () => {
  it("creates stable official IDs and SHA-256 fingerprints", () => {
    const first = parseOfficialExamTranscriptions(validInput());
    const second = parseOfficialExamTranscriptions(validInput());

    expect(first.questions.map((item) => item.id)).toEqual([
      "ADIF-2025-1131-Q01",
      "ADIF-2025-1131-Q02",
    ]);
    expect(first.questions.map((item) => item.source.fingerprint)).toEqual([
      "sha256:f10693e44e5ef2742477c9e6f90b903f54d836b2423dff856ef8b2049aa9eb81",
      "sha256:b7968bff57c619b03043f1e544bfe5f651cc5ffa5781c8510c9dc68ff0db8494",
    ]);
    expect(second.questions.map((item) => item.source.fingerprint)).toEqual(
      first.questions.map((item) => item.source.fingerprint),
    );
  });

  it("rejects a duplicate year, model, and question number", () => {
    expect(() =>
      parseOfficialExamTranscriptions({
        manifest: [manifestEntry],
        transcriptions: [
          {
            examId: "ADIF-2025-1131",
            questions: [
              { number: 1, ...question },
              { number: 1, ...question },
            ],
          },
        ],
      }),
    ).toThrow(/duplicate/i);
  });

  it("rejects a question without four options or an answer key", () => {
    const input = validInput();
    input.transcriptions[0].questions[0] = {
      number: 1,
      ...question,
      options: question.options.slice(0, 3),
      answer: undefined as unknown as "A",
    };

    expect(() => parseOfficialExamTranscriptions(input)).toThrow(/four options|answer/i);
  });

  it("rejects a complete model with missing expected question numbers", () => {
    const input = validInput();
    input.transcriptions[0].questions.pop();

    expect(() => parseOfficialExamTranscriptions(input)).toThrow(/complete|missing/i);
  });

  it("rejects a source outside www.adif.es", () => {
    const input = validInput();
    input.manifest[0] = { ...manifestEntry, documentUrl: "https://example.com/examen.pdf" };

    expect(() => parseOfficialExamTranscriptions(input)).toThrow(/www\.adif\.es/i);
  });

  it("rejects wording that matches a retired synthetic distractor", () => {
    expect(() =>
      parseOfficialExamTranscriptions({
        ...validInput(),
        retiredSyntheticDistractors: ["Opción oficial C"],
      }),
    ).toThrow(/retired synthetic distractor/i);
  });

  it("reports manifest and accepted record counts", () => {
    const { report } = parseOfficialExamTranscriptions(validInput());

    expect(report).toEqual({
      manifestExamCount: 1,
      acceptedExamCount: 1,
      acceptedQuestionCount: 2,
      acceptedQuestionCounts: { "ADIF-2025-1131": 2 },
    });
  });
});
