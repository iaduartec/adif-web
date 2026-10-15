import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";

import { importOfficialExamContent, parseOfficialExamTranscriptions } from "../scripts/import-official-exams";
import type { CorrectionSourceRecord } from "../lib/content/official-corrections";

const manifestEntry = {
  id: "ADIF-2025-1131",
  year: 2025,
  call: "PNI25/01",
  profileCode: "25/10PO",
  profileName: "Oficial de Telecomunicaciones de Entrada",
  examCode: "1131",
  documentUrl: "https://www.adif.es/documents/20124/45240815/examen.pdf",
  documentSourceId: "ADIF PNI25/01 initial booklet",
  documentSourceVersion: "initial-booklet-2025-11-18",
  initialAnswerKeySourceId: "ADIF PNI25/01 initial booklet",
  initialAnswerKeySourceVersion: "initial-booklet-2025-11-18",
  initialAnswerKeyPage: 6,
  finalAnswerKeySourceId: "ADIF PNI25/01 tribunal resolution",
  finalAnswerKeySourceVersion: "tribunal-resolution-2025-12-02",
  finalAnswerKeyPage: 9,
  durationMinutes: 120,
  expectedQuestionNumbers: [1, 2],
  reserveQuestionNumbers: [] as number[],
  transcriptionStatus: "complete" as const,
  completeness: "complete" as "complete" | "specific_part",
  scoring: { correct: 1, incorrect: -1 / 3, omitted: 0 },
};

const resolutionUrl = "https://www.adif.es/documents/20124/45240815/resolucion.pdf";
const resolutionSource = {
  sourceId: "ADIF PNI25/01 tribunal resolution",
  sourceVersion: "tribunal-resolution-2025-12-02",
  sourceUrl: resolutionUrl,
  locator: "PDF p. 9/16, plantilla definitiva 25/10PO, formulario 1131.",
};
const correctionSet = {
  year: 2025,
  call: "PNI25/01",
  profileCode: "25/10PO",
  profileName: "Oficial de Telecomunicaciones de Entrada",
  examIds: ["ADIF-2025-1131"],
  reconciliationStatus: "verified_no_changes" as const,
  resolutionSource,
  publicationStatus: "link_only" as const,
  publicationReview: null,
  corrections: [],
};
const sourceRegistry: CorrectionSourceRecord[] = [
  {
    sourceId: manifestEntry.documentSourceId,
    sourceVersion: manifestEntry.documentSourceVersion,
    url: manifestEntry.documentUrl,
    sourceType: "primary" as const,
    status: "verified" as const,
    locatorPolicy: "exact" as const,
  },
  {
    sourceId: resolutionSource.sourceId,
    sourceVersion: resolutionSource.sourceVersion,
    url: resolutionUrl,
    sourceType: "primary" as const,
    status: "verified" as const,
    locatorPolicy: "exact" as const,
  },
];

const question = {
  section: "specific" as const,
  sectionLabel: "Conocimientos específicos",
  isReserve: false,
  bookletPage: 61,
  answerKeyPage: 6,
  verifiedAt: "2026-08-10",
  conceptIds: ["ict-concept-1"],
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
    correctionSets: [structuredClone(correctionSet)],
    sourceRegistry: sourceRegistry.map((entry) => ({ ...entry })),
  };
}

describe("official ADIF exam importer", () => {
  it("keeps the production import closed and leaves generated content untouched while ADIF PDFs are unverified", async () => {
    const targets = ["content/questions.json", "content/exams.json", "content/official-exams/import-report.json"];
    const before = await Promise.all(targets.map((file) => readFile(file, "utf8")));

    await expect(importOfficialExamContent()).rejects.toThrow(/Correction evidence validation failed|verified primary source/i);

    const after = await Promise.all(targets.map((file) => readFile(file, "utf8")));
    expect(after).toEqual(before);
  });

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

  it("preserves validated concept mappings in imported questions", () => {
    const result = parseOfficialExamTranscriptions(validInput());

    expect(result.questions.map((item) => item.conceptIds)).toEqual([
      ["ict-concept-1"],
      ["ict-concept-1"],
    ]);
  });

  it("returns initial and effective answers with exact versioned provenance and a closed publication status", () => {
    const result = parseOfficialExamTranscriptions(validInput());

    expect(result.questions[0]).toMatchObject({
      initialAnswer: "A",
      effectiveAnswer: "A",
      correctionSource: null,
      validity: "pending_review",
      publicationStatus: "link_only",
      provenance: {
        booklet: {
          sourceId: "ADIF PNI25/01 initial booklet",
          sourceVersion: "initial-booklet-2025-11-18",
          locator: "PDF p. 61",
        },
        initialAnswerKey: {
          sourceId: "ADIF PNI25/01 initial booklet",
          sourceVersion: "initial-booklet-2025-11-18",
          locator: "PDF p. 6",
        },
        tribunalResolution: resolutionSource,
      },
    });
  });

  it("rejects reserve flags that contradict the form manifest", () => {
    const input = validInput();
    input.transcriptions[0].questions[0].isReserve = true;

    expect(() => parseOfficialExamTranscriptions(input)).toThrow(/reserve metadata does not match/i);

    const missingReserveFlag = validInput();
    missingReserveFlag.manifest[0] = { ...manifestEntry, reserveQuestionNumbers: [1] };
    expect(() => parseOfficialExamTranscriptions(missingReserveFlag)).toThrow(/reserve metadata does not match/i);
  });

  it("rejects a source registry whose tribunal resolution is unverified before importing", () => {
    const input = validInput();
    input.sourceRegistry[1] = { ...sourceRegistry[1], status: "needs_check" };

    expect(() => parseOfficialExamTranscriptions(input)).toThrow(/verified|unresolved/i);
  });

  it("applies the verified 2024 annulment without inventing a reserve replacement", () => {
    const bookletUrl = "https://www.adif.es/documents/20124/33942288/cuadernillo.pdf";
    const annulmentResolutionUrl = "https://www.adif.es/documents/20124/33942288/resolucion.pdf";
    const annulmentLocator = "PDF p. 11/31, plantilla final 24/05PO, formulario 1044, pregunta 6: ANULADA.";
    const input = {
      manifest: [{
        id: "ADIF-2024-1044",
        year: 2024,
        call: "PNI24/01",
        profileCode: "24/05PO",
        profileName: "Oficial de Telecomunicaciones de Entrada",
        examCode: "1044",
        documentUrl: bookletUrl,
        documentSourceId: "ADIF PNI24/01 initial booklet",
        documentSourceVersion: "initial-booklet-2024-11-25",
        initialAnswerKeySourceId: "ADIF PNI24/01 initial booklet",
        initialAnswerKeySourceVersion: "initial-booklet-2024-11-25",
        initialAnswerKeyPage: 6,
        finalAnswerKeySourceId: "ADIF PNI24/01 tribunal resolution",
        finalAnswerKeySourceVersion: "tribunal-resolution-2024-12-16",
        finalAnswerKeyPage: 11,
        durationMinutes: 15,
        expectedQuestionNumbers: [6],
        reserveQuestionNumbers: [],
        transcriptionStatus: "complete" as const,
        completeness: "specific_part" as const,
        scoring: { correct: 1, incorrect: -1 / 3, omitted: 0 },
      }],
      transcriptions: [{
        examId: "ADIF-2024-1044",
        questions: [{ number: 6, ...question, answerKeyPage: 6, answer: "C" as const }],
      }],
      correctionSets: [{
        year: 2024,
        call: "PNI24/01",
        profileCode: "24/05PO",
        profileName: "Oficial de Telecomunicaciones de Entrada",
        examIds: ["ADIF-2024-1044"],
        reconciliationStatus: "verified_with_changes" as const,
        resolutionSource: {
          sourceId: "ADIF PNI24/01 tribunal resolution",
          sourceVersion: "tribunal-resolution-2024-12-16",
          sourceUrl: annulmentResolutionUrl,
          locator: "PDF pp. 6 y 11/31: alegaciones estimadas y plantilla final 24/05PO.",
        },
        publicationStatus: "link_only" as const,
        publicationReview: null,
        corrections: [{
          examId: "ADIF-2024-1044",
          questionNumber: 6,
          initialAnswer: "C" as const,
          finalAnswer: null,
          action: "annulled" as const,
          replacementQuestionNumber: null,
          correctionSource: {
            sourceId: "ADIF PNI24/01 tribunal resolution",
            sourceVersion: "tribunal-resolution-2024-12-16",
            sourceUrl: annulmentResolutionUrl,
            locator: annulmentLocator,
          },
        }],
      }],
      sourceRegistry: [
        {
          sourceId: "ADIF PNI24/01 initial booklet",
          sourceVersion: "initial-booklet-2024-11-25",
          url: bookletUrl,
          sourceType: "primary" as const,
          status: "verified" as const,
          locatorPolicy: "exact" as const,
        },
        {
          sourceId: "ADIF PNI24/01 tribunal resolution",
          sourceVersion: "tribunal-resolution-2024-12-16",
          url: annulmentResolutionUrl,
          sourceType: "primary" as const,
          status: "verified" as const,
          locatorPolicy: "exact" as const,
        },
      ],
    };

    const result = parseOfficialExamTranscriptions(input);

    expect(result.questions[0]).toMatchObject({
      id: "ADIF-2024-1044-Q06",
      answer: "C",
      initialAnswer: "C",
      effectiveAnswer: null,
      replacementQuestionNumber: null,
      correctionSource: { sourceId: "ADIF PNI24/01 tribunal resolution", locator: annulmentLocator },
    });
  });

  it("rejects mappings to concepts outside the active registry", () => {
    const input = validInput();
    input.transcriptions[0].questions[0].conceptIds = ["missing-concept"];

    expect(() => parseOfficialExamTranscriptions(input)).toThrow(/concept/i);
  });

  it("rejects a duplicate year, model, and question number", () => {
    const input = validInput();
    input.transcriptions = [{
      examId: "ADIF-2025-1131",
      questions: [
        { number: 1, ...question },
        { number: 1, ...question },
      ],
    }];

    expect(() => parseOfficialExamTranscriptions(input)).toThrow(/duplicate/i);
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
      modelResults: {
        "ADIF-2025-1131": { accepted: 2, rejected: 0 },
      },
    });
  });

  it("rejects unexpected specific-part numbers from publication and reports their real count", () => {
    const input = {
      ...validInput(),
      manifest: [{ ...manifestEntry, completeness: "specific_part" as const, transcriptionStatus: "partial" as const }],
    };
    input.transcriptions[0].questions[1] = {
      number: 3,
      ...question,
      prompt: "Pregunta fuera del tramo publicado.",
    };

    const result = parseOfficialExamTranscriptions(input);

    expect(result.questions.map((item) => item.id)).toEqual(["ADIF-2025-1131-Q01"]);
    expect(result.report.modelResults).toEqual({
      "ADIF-2025-1131": { accepted: 1, rejected: 1 },
    });
    expect(result.report.acceptedQuestionCount).toBe(1);
  });
});
