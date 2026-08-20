import { describe, expect, it } from "vitest";

import { getOfficialExam, getOfficialQuestion } from "../lib/content/repository";
import {
  toPublicOfficialExam,
  toPublicOfficialQuestion,
} from "../lib/content/public-dto";

describe("public official-content DTOs", () => {
  it("serializes practice questions without answers, fingerprints, or answer-derived fields", () => {
    const question = getOfficialQuestion("ADIF-2025-1131-Q01")!;

    const publicQuestion = toPublicOfficialQuestion(question);

    expect(publicQuestion).toEqual({
      id: question.id,
      sectionLabel: question.sectionLabel,
      prompt: question.prompt,
      conceptIds: question.conceptIds,
      options: question.options,
      origin: "official_reference",
      source: {
        kind: "official_adif_exam",
        year: 2025,
        call: "PNI25/01",
        profileCode: "25/10PO",
        profileName: "Oficial de Telecomunicaciones de Entrada",
        examCode: "1131",
        questionNumber: 1,
        section: "specific",
        isReserve: false,
        documentUrl: question.source.documentUrl,
        bookletPage: question.source.bookletPage,
        answerKeyPage: question.source.answerKeyPage,
        verifiedAt: question.source.verifiedAt,
      },
    });
    expect(publicQuestion).not.toHaveProperty("answer");
    expect(publicQuestion.source).not.toHaveProperty("fingerprint");
  });

  it("serializes historical exam props and their questions through the same safe boundary", () => {
    const exam = getOfficialExam("ADIF-2025-1131")!;
    const question = getOfficialQuestion(exam.questionIds[0])!;

    const payload = {
      exam: toPublicOfficialExam(exam),
      questions: [toPublicOfficialQuestion(question)],
    };

    expect(payload.exam.source).not.toHaveProperty("fingerprint");
    expect(payload.questions[0]).not.toHaveProperty("answer");
    expect(payload.questions[0].source).not.toHaveProperty("fingerprint");
  });
});
