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
  toPublicOfficialQuestionStatus,
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
      currentness: "current",
      validityEvidence: {
        sourceId: "RD 346/2011",
        sourceVersion: "consolidated-page-2026-10-15",
        sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-5834",
        locator: "Anexo II, apartado de interconexión de fibra óptica",
        reviewedAt: "2026-10-15",
      },
      publicationStatus: "approved_for_publication",
    }, { status: "approved_for_publication", evidenceValid: true, errors: [] })).toBe(false);
    expect(getOfficialQuestion(question.id)).toBeUndefined();
    expect(listOfficialQuestions()).toEqual([]);
  });

  it.each(["link_only", "review_pending", "restricted"] as const)(
    "returns metadata without protected text or answer keys for %s questions",
    (publicationStatus) => {
      const question = {
        ...getOfficialQuestionRecord("ADIF-2025-1131-Q01")!,
        publicationStatus,
      };
      const metadata = toPublicOfficialQuestionStatus(question);

      expect(metadata).toMatchObject({
        id: question.id,
        origin: "official_reference",
        validity: "pending_review",
        publicationStatus,
      });
      expect(metadata).not.toHaveProperty("prompt");
      expect(metadata).not.toHaveProperty("options");
      expect(metadata).not.toHaveProperty("answer");
      expect(metadata).not.toHaveProperty("initialAnswer");
      expect(metadata).not.toHaveProperty("effectiveAnswer");
      expect(toPublicOfficialQuestion(question)).toBeNull();
    },
  );

  it("includes the exact form-level final tribunal citation when an item has no individual correction", () => {
    const question = getOfficialQuestionRecord("ADIF-2024-3403-Q01")!;
    const metadata = toPublicOfficialQuestionStatus(question);

    expect(metadata.correctionSource).toMatchObject({
      sourceId: "ADIF PNI24/01 tribunal resolution",
      sourceVersion: "tribunal-resolution-2024-12-16",
      sourceUrl: expect.stringContaining("70febb4b-f8a2-de01-d00d-11feba2b6aa3"),
      locator: expect.stringContaining("plantilla final"),
    });
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

  it("filters historical records by currentness without enabling them for practice", () => {
    expect(listOfficialQuestionRecords({ validity: "pending_review" })).toHaveLength(102);
    expect(listOfficialQuestionRecords({ validity: "changed" })).toEqual([]);
    expect(listOfficialQuestionRecords({ year: 2024, validity: "pending_review" }))
      .toHaveLength(36);
    expect(listOfficialQuestions({ validity: "pending_review" })).toEqual([]);
  });
});
