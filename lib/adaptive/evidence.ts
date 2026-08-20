type EvidenceMastery = { conceptId: string; lastReviewedAt: string | null };
type EvidenceQuestionAttempt = { questionId: string };
type EvidenceSimulationAnswer = { questionId: string; selectedAnswer: string | null };
type EvidenceReviewEvent = {
  conceptId: string;
  sourceKind: "recall" | "question";
  questionId?: string | null;
  rating: number;
};

export type ActiveEvidenceInput = {
  activeConceptIds: ReadonlySet<string>;
  activeQuestionIds: ReadonlySet<string>;
  mastery: readonly EvidenceMastery[];
  questionAttempts: readonly EvidenceQuestionAttempt[];
  simulationAnswers: readonly EvidenceSimulationAnswer[];
  reviewEvents: readonly EvidenceReviewEvent[];
};

function compareText(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

/** Shared evidence gate for readiness and daily-plan allocation. */
export function collectActiveEvidence(input: ActiveEvidenceInput) {
  const attemptedQuestionIds = new Set<string>();
  for (const attempt of input.questionAttempts) {
    if (input.activeQuestionIds.has(attempt.questionId)) attemptedQuestionIds.add(attempt.questionId);
  }
  for (const answer of input.simulationAnswers) {
    if (answer.selectedAnswer !== null && input.activeQuestionIds.has(answer.questionId)) {
      attemptedQuestionIds.add(answer.questionId);
    }
  }

  const reviewedConceptIds = new Set<string>();
  for (const entry of input.mastery) {
    if (entry.lastReviewedAt !== null && input.activeConceptIds.has(entry.conceptId)) {
      reviewedConceptIds.add(entry.conceptId);
    }
  }
  for (const event of input.reviewEvents) {
    if (event.sourceKind === "recall" && input.activeConceptIds.has(event.conceptId)) {
      reviewedConceptIds.add(event.conceptId);
    }
  }

  return {
    uniqueAttemptedQuestionIds: [...attemptedQuestionIds].sort(compareText),
    reviewedConceptIds: [...reviewedConceptIds].sort(compareText),
  };
}
