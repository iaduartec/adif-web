import { describe, expect, it } from "vitest";

import {
  applyOfficialCorrections,
  validateOfficialCorrectionSets,
  validatePublicationStatus,
  publicationReviewCoversQuestionSection,
  type OfficialCorrection,
  type OfficialCorrectionSet,
  type CorrectionSourceRecord,
} from "../lib/content/official-corrections";
import {
  officialCorrectionSchema,
  officialCorrectionSetsSchema,
  type PublicationReview,
} from "../lib/content/schema";
import corrections2023 from "../content/official-exams/corrections/2023.json";
import corrections2024 from "../content/official-exams/corrections/2024.json";
import corrections2025 from "../content/official-exams/corrections/2025.json";
import transcription2025A from "../content/official-exams/transcriptions/2025-1131.json";
import transcription2025B from "../content/official-exams/transcriptions/2025-4104.json";

const sourceReference = {
  sourceId: "ADIF PNI25/01 resolución",
  sourceVersion: "tribunal-resolution-2025",
  sourceUrl: "https://www.adif.es/documents/20124/45240815/resolucion.pdf",
  locator: "p. 4, apartado 2",
};

const correction = (overrides: Partial<OfficialCorrection> = {}): OfficialCorrection => ({
  examId: "ADIF-2025-1131",
  questionNumber: 14,
  initialAnswer: "B",
  finalAnswer: "C",
  action: "changed",
  replacementQuestionNumber: null,
  correctionSource: sourceReference,
  ...overrides,
});

const review: PublicationReview = {
  decisionId: "rights-2025-01",
  decision: "approved" as const,
  permittedUse: "public_question_text" as const,
  reviewedAt: "2026-10-15",
  reviewerRole: "human_editor" as const,
  scope: {
    examIds: ["ADIF-2025-1131", "ADIF-2025-4104"],
    sections: ["specific"],
    content: "official_question_text" as const,
  },
  evidence: {
    sourceId: "ADIF permission review 2025",
    sourceVersion: "review-1",
    locator: "p. 2, resolution 5",
    basis: "documented_legal_review" as const,
  },
  rationale: "La revisión documentada autoriza la publicación de este conjunto.",
};

const verifiedSources: CorrectionSourceRecord[] = [
  ...[corrections2023, corrections2024, corrections2025].map((set) => ({
    sourceId: set.resolutionSource.sourceId,
    sourceVersion: set.resolutionSource.sourceVersion,
    sourceType: "primary" as const,
    status: "verified" as const,
    locatorPolicy: "exact" as const,
    url: set.resolutionSource.sourceUrl,
  })),
  {
    sourceId: sourceReference.sourceId,
    sourceVersion: sourceReference.sourceVersion,
    sourceType: "primary",
    status: "verified",
    locatorPolicy: "exact",
    url: sourceReference.sourceUrl,
  },
  {
    sourceId: "ADIF permission review with pending verification",
    sourceVersion: "review-pending",
    sourceType: "primary",
    status: "needs_check",
    locatorPolicy: "exact",
    url: "https://www.adif.es/documents/20124/45240815/review-pending.pdf",
  },
  {
    sourceId: review.evidence.sourceId,
    sourceVersion: review.evidence.sourceVersion,
    sourceType: "primary",
    status: "verified",
    locatorPolicy: "exact",
    url: "https://www.adif.es/documents/20124/45240815/rights-review.pdf",
    rightsBasis: "documented_legal_review",
  },
];

const examRecords = [
  ...["1433", "4101"].map((examCode) => ({
    id: `ADIF-2023-${examCode}`,
    year: 2023,
    call: "PNI23/01",
    profileCode: "23/05PO",
    questionNumbers: Array.from({ length: 18 }, (_, index) => index + 1),
    reserveQuestionNumbers: [16, 17, 18],
  })),
  ...["1044", "2442", "3403", "3413"].map((examCode) => ({
    id: `ADIF-2024-${examCode}`,
    year: 2024,
    call: "PNI24/01",
    profileCode: "24/05PO",
    questionNumbers: Array.from({ length: 18 }, (_, index) => index + 1),
    reserveQuestionNumbers: [16, 17, 18],
  })),
  {
    id: "ADIF-2025-1131",
    year: 2025,
    call: "PNI25/01",
    profileCode: "25/10PO",
    questionNumbers: Array.from({ length: 18 }, (_, index) => index + 1),
    reserveQuestionNumbers: [16, 17, 18],
  },
  {
    id: "ADIF-2025-4104",
    year: 2025,
    call: "PNI25/01",
    profileCode: "25/10PO",
    questionNumbers: Array.from({ length: 18 }, (_, index) => index + 1),
    reserveQuestionNumbers: [16, 17, 18],
  },
];

const correctionSet = (corrections: OfficialCorrection[]): OfficialCorrectionSet => ({
  year: 2025,
  call: "PNI25/01",
  profileCode: "25/10PO",
  profileName: "Oficial de Telecomunicaciones de Entrada",
    examIds: ["ADIF-2025-1131", "ADIF-2025-4104"],
  reconciliationStatus: corrections.length === 0 ? "verified_no_changes" : "verified_with_changes",
  resolutionSource: sourceReference,
  publicationStatus: "link_only",
  publicationReview: null,
  corrections,
});

describe("ADIF tribunal corrections", () => {
  it("keeps the 2023-2025 telecom forms and tribunal outcomes source-resolvable", () => {
    const sets = [corrections2023, corrections2024, corrections2025];

    expect(officialCorrectionSetsSchema.safeParse(sets).success).toBe(true);
    expect(validateOfficialCorrectionSets(sets, examRecords, verifiedSources)).toEqual([]);
  });

  it("records only the two PNI24/01 annulments and never infers a reserve replacement", () => {
    expect(corrections2024.examIds).toEqual([
      "ADIF-2024-1044",
      "ADIF-2024-2442",
      "ADIF-2024-3403",
      "ADIF-2024-3413",
    ]);
    expect(corrections2024.corrections).toEqual([
      expect.objectContaining({
        examId: "ADIF-2024-1044",
        questionNumber: 6,
        initialAnswer: "C",
        finalAnswer: null,
        action: "annulled",
        replacementQuestionNumber: null,
      }),
      expect.objectContaining({
        examId: "ADIF-2024-2442",
        questionNumber: 8,
        initialAnswer: "C",
        finalAnswer: null,
        action: "annulled",
        replacementQuestionNumber: null,
      }),
    ]);
    expect(corrections2024.corrections.every((row) => row.correctionSource.locator.includes("p. 11/31"))).toBe(true);
  });

  it("marks 2023 and 2025 as reconciled with no Telecom key changes", () => {
    expect(corrections2023.reconciliationStatus).toBe("verified_no_changes");
    expect(corrections2023.corrections).toEqual([]);
    expect(corrections2025.reconciliationStatus).toBe("verified_no_changes");
    expect(corrections2025.corrections).toEqual([]);
    expect(transcription2025A.questions.find((question) => question.number === 14)?.answer).toBe("B");
    expect(transcription2025B.questions.find((question) => question.number === 13)?.answer).toBe("B");
  });

  it("keeps the original key and applies a confirmed final answer", () => {
    const result = applyOfficialCorrections(
      { examId: "ADIF-2025-1131", questionNumber: 14, answer: "B" },
      [correction({ action: "confirmed", finalAnswer: "B" })],
    );

    expect(result).toMatchObject({
      initialAnswer: "B",
      effectiveAnswer: "B",
      action: "confirmed",
      replacementQuestionNumber: null,
    });
  });

  it("uses the tribunal answer when the tribunal changes the initial key", () => {
    const result = applyOfficialCorrections(
      { examId: "ADIF-2025-1131", questionNumber: 14, answer: "B" },
      [correction()],
    );

    expect(result.initialAnswer).toBe("B");
    expect(result.effectiveAnswer).toBe("C");
    expect(result.correctionSource).toEqual(sourceReference);
  });

  it("rejects applying a correction to a question whose imported initial key differs", () => {
    expect(() =>
      applyOfficialCorrections(
        { examId: "ADIF-2025-1131", questionNumber: 14, answer: "A" },
        [correction()],
      ),
    ).toThrow("Initial answer mismatch");
  });

  it("removes an annulled question from scoring without inferring a reserve", () => {
    const result = applyOfficialCorrections(
      { examId: "ADIF-2025-1131", questionNumber: 14, answer: "B" },
      [correction({ action: "annulled", finalAnswer: null })],
    );

    expect(result.effectiveAnswer).toBeNull();
    expect(result.replacementQuestionNumber).toBeNull();
  });

  it("preserves only an explicitly specified reserve replacement for an annulment", () => {
    const result = applyOfficialCorrections(
      { examId: "ADIF-2025-1131", questionNumber: 14, answer: "B" },
      [correction({ action: "annulled", finalAnswer: null, replacementQuestionNumber: 18 })],
    );

    expect(result.effectiveAnswer).toBeNull();
    expect(result.replacementQuestionNumber).toBe(18);
  });

  it("rejects a final answer or reserve replacement inconsistent with the tribunal action", () => {
    expect(officialCorrectionSchema.safeParse(correction({ action: "annulled", finalAnswer: "C" })).success).toBe(false);
    expect(officialCorrectionSchema.safeParse(correction({ action: "confirmed", replacementQuestionNumber: 18 })).success).toBe(false);
  });

  it("rejects duplicate correction rows and references to unknown forms or question numbers", () => {
    expect(
      validateOfficialCorrectionSets(
        [correctionSet([correction(), correction()])],
        examRecords,
        verifiedSources,
      ),
    ).toContain("Duplicate correction for ADIF-2025-1131 question 14");

    expect(
      validateOfficialCorrectionSets(
        [correctionSet([correction({ examId: "ADIF-2025-9999" })])],
        examRecords,
        verifiedSources,
      ).join("\n"),
    ).toContain("unknown exam");

    expect(
      validateOfficialCorrectionSets(
        [correctionSet([correction({ questionNumber: 99 })])],
        examRecords,
        verifiedSources,
      ).join("\n"),
    ).toContain("outside exam");
  });

  it("rejects a verified reconciliation whose tribunal source is not pinned and verified", () => {
    const set = correctionSet([]);
    set.resolutionSource = { ...sourceReference, sourceVersion: "unverified-version" };
    expect(
      validateOfficialCorrectionSets([set], examRecords, verifiedSources).join("\n"),
    ).toContain("verified reconciliation requires a resolved primary tribunal source");
  });

  it("rejects a correction whose source URL, version, or primary verification cannot be resolved", () => {
    expect(
      validateOfficialCorrectionSets(
        [correctionSet([correction({ correctionSource: { ...sourceReference, sourceVersion: "unknown" } })])],
        examRecords,
        verifiedSources,
      ).join("\n"),
    ).toContain("unresolved correction source");

    expect(
      validateOfficialCorrectionSets(
        [correctionSet([correction({ correctionSource: { ...sourceReference, sourceUrl: "https://www.adif.es/other.pdf" } })])],
        examRecords,
        verifiedSources,
      ).join("\n"),
    ).toContain("unresolved correction source");
  });
});

describe("official question publication gate", () => {
  it("does not approve publication from a status string alone", () => {
    expect(
      validatePublicationStatus("approved_for_publication", null, verifiedSources),
    ).toEqual(["approved_for_publication requires a dated human review"]);
  });

  it.each([
    ["metadata-only use", { ...review, permittedUse: "metadata_only" }],
    ["pending decision", { ...review, decision: "pending" }],
    ["invalid calendar date", { ...review, reviewedAt: "2026-02-31" }],
    ["unknown source version", { ...review, evidence: { ...review.evidence, sourceVersion: "unknown" } }],
    ["missing exact locator", { ...review, evidence: { ...review.evidence, locator: " " } }],
    ["unverified source", { ...review, evidence: { ...review.evidence, sourceId: "ADIF permission review with pending verification", sourceVersion: "review-pending" } }],
  ])("blocks approved publication with %s evidence", (_label, candidateReview) => {
    const errors = validatePublicationStatus(
      "approved_for_publication",
      candidateReview as PublicationReview,
      verifiedSources,
    );

    expect(errors.length).toBeGreaterThan(0);
  });

  it("accepts publication only with a dated, exact, verified source and text-use decision", () => {
    expect(validatePublicationStatus("approved_for_publication", review, verifiedSources)).toEqual([]);
  });

  it("requires an explicit question-section scope for approved public text", () => {
    const unscopedReview = { ...review, scope: { ...review.scope, sections: undefined } };
    expect(validateOfficialCorrectionSets([{
      ...correctionSet([]),
      publicationStatus: "approved_for_publication",
      publicationReview: unscopedReview,
    }], examRecords, verifiedSources).join("\n")).toContain("must list the exact question sections");
  });

  it("does not let a review for one section authorize another question section", () => {
    expect(publicationReviewCoversQuestionSection(review, "ADIF-2025-1131", "specific")).toBe(true);
    expect(publicationReviewCoversQuestionSection(review, "ADIF-2025-1131", "general")).toBe(false);
    expect(publicationReviewCoversQuestionSection({
      ...review,
      scope: { ...review.scope, sections: undefined },
    }, "ADIF-2025-1131", "specific")).toBe(false);
  });

  it("rejects a publication review dated after the evaluation date", () => {
    const futureReview: PublicationReview = { ...review, reviewedAt: "2026-10-16" };

    expect(
      validatePublicationStatus("approved_for_publication", futureReview, verifiedSources, "2026-10-15").join("\n"),
    ).toContain("review date is later than the evaluation date");
  });

  it("rejects a verified booklet or answer-key source as rights-review evidence", () => {
    const unrelatedSourceReview: PublicationReview = {
      ...review,
      evidence: {
        ...review.evidence,
        sourceId: sourceReference.sourceId,
        sourceVersion: sourceReference.sourceVersion,
      },
    };

    expect(
      validatePublicationStatus("approved_for_publication", unrelatedSourceReview, verifiedSources).join("\n"),
    ).toContain("not registered for the declared rights basis");
  });

  it("does not allow an approved review to be hidden behind a pending publication status", () => {
    expect(validatePublicationStatus("review_pending", review, verifiedSources).join("\n")).toContain(
      "does not match the publication review decision",
    );
  });

  it("rejects a review whose explicit form scope differs from the correction set", () => {
    const set = correctionSet([]);
    set.publicationStatus = "approved_for_publication";
    set.publicationReview = {
      ...review,
      scope: { ...review.scope, examIds: ["ADIF-2025-1131"] },
    };

    expect(
      validateOfficialCorrectionSets([set], examRecords, verifiedSources).join("\n"),
    ).toContain("publication review scope does not exactly match");
  });
});
