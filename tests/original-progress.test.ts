import { describe, expect, it } from "vitest";
import { calculateOriginalProgress } from "../lib/progress/original-progress";

describe("original-practice progress", () => {
  it("groups known reviewed practice attempts by subject and preserves counts", () => {
    const result = calculateOriginalProgress([
      { id: "orig-one", domain: "english-a2" },
      { id: "orig-two", domain: "english-a2" },
      { id: "orig-three", domain: "telecom" },
    ], [
      { questionId: "orig-one", isCorrect: false, elapsedMs: 1000, mode: "practice", createdAt: "2026-11-01T09:00:00Z" },
      { questionId: "orig-one", isCorrect: true, elapsedMs: 3000, mode: "practice", createdAt: "2026-11-02T09:00:00Z" },
      { questionId: "orig-three", isCorrect: false, elapsedMs: 2000, mode: "practice", createdAt: "2026-11-02T10:00:00Z" },
      { questionId: "unknown", isCorrect: true, elapsedMs: 500, mode: "practice", createdAt: "2026-11-02T10:00:00Z" },
      { questionId: "orig-two", isCorrect: true, elapsedMs: 500, mode: "simulation", createdAt: "2026-11-02T10:00:00Z" },
    ]);
    expect(result.find((item) => item.domain === "english-a2")).toEqual({
      domain: "english-a2", totalQuestions: 2, attemptedQuestions: 1, attempts: 2, correct: 1,
      elapsedMs: 4000, latestAt: "2026-11-02T09:00:00Z",
    });
    expect(result.find((item) => item.domain === "telecom")).toMatchObject({ attemptedQuestions: 1, attempts: 1, correct: 0 });
  });

  it("reports no attempts rather than invented percentages for a new learner", () => {
    expect(calculateOriginalProgress([{ id: "orig-one", domain: "psychometric" }], [])).toEqual([
      { domain: "psychometric", totalQuestions: 1, attemptedQuestions: 0, attempts: 0, correct: 0, elapsedMs: 0, latestAt: null },
    ]);
  });
});
