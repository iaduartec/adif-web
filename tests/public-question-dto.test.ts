import { describe, expect, it } from "vitest";

import {
  getOfficialExam,
  getOfficialExamRecord,
  getOfficialQuestion,
  getOfficialQuestionRecord,
  listOfficialExams,
  listOfficialExamRecords,
  listOfficialQuestions,
  listOfficialQuestionRecords,
} from "../lib/content/repository";
import {
  getOfficialPublicationDecision,
  isOfficialQuestionPracticeEligible,
} from "../lib/content/official-publication";
import {
  toPublicOfficialExam,
  toPublicOfficialQuestion,
} from "../lib/content/public-dto";

describe("official publication gate", () => {
  it("defaults legacy records to link-only and withholds question text and keys", () => {
    const question = getOfficialQuestionRecord("ADIF-2025-1131-Q01")!;

    expect(question).toMatchObject({
      initialAnswer: "A",
      effectiveAnswer: null,
      validity: "pending_review",
      publicationStatus: "link_only",
    });
    expect(getOfficialPublicationDecision("ADIF-2025-1131")).toMatchObject({
      status: "link_only",
      evidenceValid: false,
    });
    expect(toPublicOfficialQuestion(question)).toBeNull();
    expect(isOfficialQuestionPracticeEligible({
      ...question,
      effectiveAnswer: "A",
      validity: "current",
      publicationStatus: "approved_for_publication",
    })).toBe(false);
    expect(getOfficialQuestion(question.id)).toBeUndefined();
    expect(listOfficialQuestions()).toEqual([]);
  });

  it("retains historical IDs, exam shells, and learner history while excluding restricted content from practice", () => {
    const question = getOfficialQuestionRecord("ADIF-2025-1131-Q01")!;
    const exam = getOfficialExamRecord("ADIF-2025-1131")!;

    expect(question.id).toBe("ADIF-2025-1131-Q01");
    expect(exam.questionIds).toContain(question.id);
    expect(getOfficialExam("ADIF-2025-1131")).toBeUndefined();
    expect(listOfficialExams()).toEqual([]);
    expect(listOfficialQuestionRecords()).toHaveLength(102);
    expect(listOfficialExamRecords()).toHaveLength(6);
    expect(toPublicOfficialExam(exam)).not.toHaveProperty("answer");
  });
});
