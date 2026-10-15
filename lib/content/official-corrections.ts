import {
  officialCorrectionSchema,
  officialCorrectionSetsSchema,
  publicationReviewSchema,
  type OfficialCorrection,
  type OfficialCorrectionSet,
  type PublicationReview,
  type PublicationStatus,
} from "./schema";

export type CorrectionExamRecord = {
  id: string;
  year: number;
  call: string;
  profileCode: string;
  questionNumbers: number[];
  reserveQuestionNumbers: number[];
};

export type CorrectionSourceRecord = {
  sourceId: string;
  sourceVersion: string;
  url: string;
  sourceType: "primary" | "secondary" | "didactic";
  status: "verified" | "needs_check" | "superseded" | "unavailable";
  locatorPolicy: "document-level" | "section" | "exact";
};

export type CorrectableQuestion = {
  examId: string;
  questionNumber: number;
  answer: "A" | "B" | "C" | "D";
};

export type CorrectedOfficialQuestion = CorrectableQuestion & {
  initialAnswer: CorrectableQuestion["answer"];
  effectiveAnswer: CorrectableQuestion["answer"] | null;
  action: OfficialCorrection["action"] | null;
  replacementQuestionNumber: number | null;
  correctionSource: OfficialCorrection["correctionSource"] | null;
};

export function applyOfficialCorrections(
  question: CorrectableQuestion,
  corrections: OfficialCorrection[],
): CorrectedOfficialQuestion {
  const matching = corrections.filter(
    (correction) =>
      correction.examId === question.examId &&
      correction.questionNumber === question.questionNumber,
  );

  if (matching.length > 1) {
    throw new Error(`Duplicate correction for ${question.examId} question ${question.questionNumber}`);
  }

  const correction = matching[0];
  if (!correction) {
    return {
      ...question,
      initialAnswer: question.answer,
      effectiveAnswer: question.answer,
      action: null,
      replacementQuestionNumber: null,
      correctionSource: null,
    };
  }

  const parsed = officialCorrectionSchema.safeParse(correction);
  if (!parsed.success) {
    throw new Error(`Invalid correction for ${question.examId} question ${question.questionNumber}`);
  }
  if (question.answer !== parsed.data.initialAnswer) {
    throw new Error(
      `Initial answer mismatch for ${question.examId} question ${question.questionNumber}`,
    );
  }

  return {
    ...question,
    initialAnswer: parsed.data.initialAnswer,
    effectiveAnswer: parsed.data.action === "annulled" ? null : parsed.data.finalAnswer,
    action: parsed.data.action,
    replacementQuestionNumber: parsed.data.replacementQuestionNumber,
    correctionSource: parsed.data.correctionSource,
  };
}

export function validatePublicationStatus(
  status: PublicationStatus,
  review: PublicationReview | null,
  sources: CorrectionSourceRecord[],
): string[] {
  if (review === null) {
    return status === "approved_for_publication"
      ? ["approved_for_publication requires a dated human review"]
      : [];
  }

  const parsed = publicationReviewSchema.safeParse(review);
  if (!parsed.success) {
    return parsed.error.issues.map((issue) =>
      `${issue.path.join(".") || "publicationReview"}: ${issue.message}`,
    );
  }

  const { decision, permittedUse, evidence } = parsed.data;
  const matchingSource = sources.find(
    (source) =>
      source.sourceId === evidence.sourceId && source.sourceVersion === evidence.sourceVersion,
  );
  const errors: string[] = [];

  if (
    !matchingSource ||
    matchingSource.status !== "verified" ||
    matchingSource.locatorPolicy !== "exact"
  ) {
    errors.push("publication review evidence references an unresolved source version or non-exact locator");
  }

  if (decision === "approved" && permittedUse === "public_question_text") {
    if (status !== "approved_for_publication") {
      errors.push("publication status does not match the publication review decision");
    }
    if (evidence.locator.trim().length === 0) {
      errors.push("approved public question text requires an exact evidence locator");
    }
  } else if (status === "approved_for_publication") {
    errors.push("approved_for_publication requires an approved public-question-text review");
  } else if (decision === "denied" && status !== "restricted") {
    errors.push("publication status does not match the publication review decision");
  } else if (decision === "pending" && status === "restricted") {
    errors.push("publication status does not match the publication review decision");
  }

  return errors;
}

export function validateOfficialCorrectionSets(
  input: unknown,
  exams: CorrectionExamRecord[],
  sources: CorrectionSourceRecord[],
): string[] {
  const parsed = officialCorrectionSetsSchema.safeParse(input);
  if (!parsed.success) {
    return parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
  }

  const errors: string[] = [];
  const seenYears = new Set<number>();
  for (const [setIndex, set] of parsed.data.entries()) {
    if (seenYears.has(set.year)) errors.push(`Duplicate correction set for ${set.year}`);
    seenYears.add(set.year);
    errors.push(
      ...validatePublicationStatus(set.publicationStatus, set.publicationReview, sources).map(
        (error) => `${set.year}: ${error}`,
      ),
    );

    const setExams = set.examIds.map((examId) => exams.find((candidate) => candidate.id === examId));
    for (const [examIndex, exam] of setExams.entries()) {
      if (!exam) {
        errors.push(`correction set ${set.year} references unknown exam ${set.examIds[examIndex]}`);
      } else if (
        exam.year !== set.year ||
        exam.call !== set.call ||
        exam.profileCode !== set.profileCode
      ) {
        errors.push(`correction set form identity does not match ${exam.id}`);
      }
    }
    if (set.reconciliationStatus !== "pending") {
      const resolution = sources.find(
        (candidate) =>
          candidate.sourceId === set.resolutionSource.sourceId &&
          candidate.sourceVersion === set.resolutionSource.sourceVersion &&
          candidate.url === set.resolutionSource.sourceUrl,
      );
      if (
        !resolution ||
        resolution.sourceType !== "primary" ||
        resolution.status !== "verified" ||
        resolution.locatorPolicy !== "exact"
      ) {
        errors.push(`${set.year}: verified reconciliation requires a resolved primary tribunal source`);
      }
    }
    if (set.publicationReview) {
      const declared = [...set.examIds].sort();
      const reviewed = [...set.publicationReview.scope.examIds].sort();
      if (declared.length !== reviewed.length || declared.some((id, index) => id !== reviewed[index])) {
        errors.push(`${set.year}: publication review scope does not exactly match the correction-set forms`);
      }
    }

    const seenQuestions = new Set<string>();
    for (const [correctionIndex, correction] of set.corrections.entries()) {
      const identity = `${correction.examId}\u0000${correction.questionNumber}`;
      if (seenQuestions.has(identity)) {
        errors.push(`Duplicate correction for ${correction.examId} question ${correction.questionNumber}`);
      }
      seenQuestions.add(identity);

      if (!set.examIds.includes(correction.examId)) {
        errors.push(`correction ${correction.examId} is outside the declared ${set.year} form scope`);
      }

      const exam = exams.find((candidate) => candidate.id === correction.examId);
      if (!exam) {
        errors.push(`corrections[${setIndex}][${correctionIndex}] references unknown exam ${correction.examId}`);
        continue;
      }
      if (
        exam.year !== set.year ||
        exam.call !== set.call ||
        exam.profileCode !== set.profileCode
      ) {
        errors.push(`correction form identity does not match ${correction.examId}`);
      }
      if (!exam.questionNumbers.includes(correction.questionNumber)) {
        errors.push(`question ${correction.questionNumber} is outside exam ${correction.examId}`);
      }
      if (correction.replacementQuestionNumber !== null) {
        if (!exam.reserveQuestionNumbers.includes(correction.replacementQuestionNumber)) {
          errors.push(
            `replacement question ${correction.replacementQuestionNumber} is not a listed reserve for ${correction.examId}`,
          );
        }
      }

      const source = sources.find(
        (candidate) =>
          candidate.sourceId === correction.correctionSource.sourceId &&
          candidate.sourceVersion === correction.correctionSource.sourceVersion &&
          candidate.url === correction.correctionSource.sourceUrl,
      );
      if (
        !source ||
        source.sourceType !== "primary" ||
        source.status !== "verified" ||
        source.locatorPolicy !== "exact"
      ) {
        errors.push(
          `unresolved correction source for ${correction.examId} question ${correction.questionNumber}`,
        );
      }
    }
  }

  return errors;
}

export type { OfficialCorrection, OfficialCorrectionSet };
