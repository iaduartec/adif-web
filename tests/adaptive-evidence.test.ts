import { describe, expect, it } from "vitest";

import { collectActiveEvidence } from "../lib/adaptive/evidence";

describe("collectActiveEvidence", () => {
  it("uses the same active practice, simulation, mastery, and recall evidence contract", () => {
    const evidence = collectActiveEvidence({
      activeConceptIds: new Set(["concept-a", "concept-b", "concept-c"]),
      activeQuestionIds: new Set(["question-a", "question-b", "question-c"]),
      mastery: [
        { conceptId: "concept-a", lastReviewedAt: "2026-08-01T09:00:00Z" },
        { conceptId: "concept-retired", lastReviewedAt: "2026-08-01T09:00:00Z" },
      ],
      questionAttempts: [
        { questionId: "question-a" },
        { questionId: "question-a" },
        { questionId: "question-retired" },
      ],
      simulationAnswers: [
        { questionId: "question-b", selectedAnswer: "A" },
        { questionId: "question-c", selectedAnswer: null },
        { questionId: "question-retired", selectedAnswer: "B" },
      ],
      reviewEvents: [
        { conceptId: "concept-b", sourceKind: "recall", questionId: null, rating: 0 },
        { conceptId: "concept-c", sourceKind: "question", questionId: "question-c", rating: 3 },
        { conceptId: "concept-retired", sourceKind: "recall", questionId: null, rating: 3 },
      ],
    });

    expect(evidence.uniqueAttemptedQuestionIds).toEqual(["question-a", "question-b"]);
    expect(evidence.reviewedConceptIds).toEqual(["concept-a", "concept-b"]);
  });
});
