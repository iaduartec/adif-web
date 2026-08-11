import { describe, expect, it } from "vitest";
import {
  calculateReadiness,
  type ReadinessInput,
  type ReadinessLevel,
} from "../lib/adaptive/readiness";

const NOW = new Date("2026-08-11T10:00:00.000Z");

function concepts(count = 10) {
  return Array.from({ length: count }, (_, index) => ({
    id: `concept-${index + 1}`,
    title: `Concepto ${index + 1}`,
    lessonId: index < Math.ceil(count / 2) ? "lesson-a" : "lesson-b",
    lessonTitle: index < Math.ceil(count / 2) ? "Lección A" : "Lección B",
  }));
}

function questions(count = 40, conceptCount = 10) {
  return Array.from({ length: count }, (_, index) => ({
    id: `question-${index + 1}`,
    conceptIds: [`concept-${(index % conceptCount) + 1}`],
  }));
}

function mastery(currentCount = 0, conceptCount = 10): ReadinessInput["mastery"] {
  return Array.from({ length: conceptCount }, (_, index) => ({
    conceptId: `concept-${index + 1}`,
    status: index < currentCount ? "review" as const : "learning" as const,
    dueOn: index < currentCount ? "2026-08-11" : "2026-08-10",
    lastReviewedAt: index < currentCount ? "2026-08-01T09:00:00.000Z" : null,
  }));
}

function recallEvents(count = 10): ReadinessInput["reviewEvents"] {
  return Array.from({ length: count }, (_, index) => ({
    conceptId: `concept-${index + 1}`,
    sourceKind: "recall" as const,
    rating: 2 as const,
    occurredAt: "2026-08-05T09:00:00.000Z",
  }));
}

function attempts(count: number, elapsedMs = 60_000): ReadinessInput["questionAttempts"] {
  return Array.from({ length: count }, (_, index) => ({
    questionId: `question-${index + 1}`,
    isCorrect: true,
    elapsedMs,
    mode: "practice" as const,
    createdAt: "2026-08-10T09:00:00.000Z",
  }));
}

function input(overrides: Partial<ReadinessInput> = {}): ReadinessInput {
  return {
    now: NOW,
    concepts: concepts(),
    questions: questions(),
    mastery: mastery(),
    questionAttempts: [],
    reviewEvents: [],
    simulations: [],
    simulationAttempts: [],
    simulationAnswers: [],
    lessonActivity: [],
    ...overrides,
  };
}

function recentSimulations(count: number, answeredPerExam = 10) {
  const simulations: Array<ReadinessInput["simulations"][number]> = [];
  const simulationAttempts: Array<ReadinessInput["simulationAttempts"][number]> = [];
  const simulationAnswers: Array<ReadinessInput["simulationAnswers"][number]> = [];

  for (let index = 0; index < count; index += 1) {
    const simulationId = `exam-${index + 1}`;
    const attemptId = `simulation-attempt-${index + 1}`;
    const questionIds = Array.from({ length: 10 }, (_, questionIndex) => `question-${questionIndex + 1}`);
    simulations.push({ id: simulationId, title: `Examen ${index + 1}`, durationMinutes: 10, questionIds });
    simulationAttempts.push({
      id: attemptId,
      simulationId,
      correctCount: answeredPerExam,
      incorrectCount: 0,
      omittedCount: 10 - answeredPerExam,
      elapsedMs: 600_000,
      createdAt: `2026-08-0${index + 1}T09:00:00.000Z`,
    });
    simulationAnswers.push(...questionIds.map((questionId, questionIndex) => ({
      attemptId,
      questionId,
      isCorrect: questionIndex < answeredPerExam,
      selectedAnswer: questionIndex < answeredPerExam ? "A" as const : null,
    })));
  }

  return { simulations, simulationAttempts, simulationAnswers };
}

describe("calculateReadiness levels", () => {
  it.each([
    [19, 10, "insufficient"],
    [20, 9, "insufficient"],
    [20, 10, "building"],
  ] as const)(
    "applies the 20-question and 10-reviewed-concept evidence boundaries (%s/%s)",
    (attemptedCount, reviewedCount, expectedLevel) => {
      const snapshot = calculateReadiness(input({
        questionAttempts: attempts(attemptedCount),
        reviewEvents: recallEvents(reviewedCount),
      }));

      expect(snapshot.level).toBe(expectedLevel);
      expect(snapshot.sample).toEqual({
        reviewedConcepts: reviewedCount,
        uniqueAttemptedQuestions: attemptedCount,
      });
    },
  );

  it.each([
    {
      name: "building below 60% coverage",
      attemptedCount: 20,
      currentCount: 8,
      expected: "building",
    },
    {
      name: "building below 50% current domain",
      attemptedCount: 40,
      currentCount: 4,
      expected: "building",
    },
    {
      name: "consolidating between the building and on-track thresholds",
      attemptedCount: 30,
      currentCount: 7,
      expected: "consolidating",
    },
    {
      name: "on track at every approved boundary",
      attemptedCount: 32,
      currentCount: 8,
      expected: "on_track",
    },
  ] satisfies Array<{
    name: string;
    attemptedCount: number;
    currentCount: number;
    expected: ReadinessLevel;
  }>)("classifies $name", ({ attemptedCount, currentCount, expected }) => {
    const simulationHistory = recentSimulations(3);
    const history = recallEvents(10).flatMap((event, index) => [
      {
        ...event,
        sourceKind: "question" as const,
        questionId: `question-${index + 1}`,
        rating: 3 as const,
        occurredAt: "2026-08-01T08:00:00.000Z",
      },
      { ...event, rating: index < 7 ? 2 as const : 1 as const },
    ]);
    const snapshot = calculateReadiness(input({
      mastery: mastery(currentCount),
      questionAttempts: attempts(attemptedCount),
      reviewEvents: history,
      ...simulationHistory,
    }));

    expect(snapshot.level).toBe(expected);
    expect(snapshot.deferredRetention.percentage).toBe(70);
    expect(snapshot.recentSimulations).toBe(3);
    expect(snapshot.speed.percentage).toBe(100);
  });

  it("selects the first unmet obstacle and explains criteria without probability claims", () => {
    const snapshot = calculateReadiness(input({
      mastery: mastery(8),
      questionAttempts: attempts(30),
      reviewEvents: recallEvents(10),
    }));

    expect(snapshot.mainObstacle?.key).toBe("coverage");
    expect(snapshot.criteria.map((criterion) => criterion.key)).toEqual([
      "evidence",
      "coverage",
      "domain",
      "retention",
      "simulations",
      "speed",
    ]);
    expect(snapshot.criteria.map((criterion) => criterion.explanation).join(" "))
      .not.toMatch(/probabilidad|garant[ií]a|asegura/i);
  });
});

describe("calculateReadiness metrics", () => {
  it("filters retired content out of every historical and current metric", () => {
    const snapshot = calculateReadiness(input({
      concepts: [{ id: "concept-active", title: "Activo", lessonId: "lesson-a", lessonTitle: "Lección A" }],
      questions: [{ id: "question-active", conceptIds: ["concept-active"] }],
      mastery: [
        { conceptId: "concept-active", status: "review", dueOn: null, lastReviewedAt: "2026-08-10T09:00:00Z" },
        { conceptId: "concept-retired", status: "consolidated", dueOn: null, lastReviewedAt: "2026-08-10T09:00:00Z" },
      ],
      questionAttempts: [
        { questionId: "question-active", isCorrect: true, elapsedMs: 1_000, mode: "practice", createdAt: "2026-08-11T09:00:00Z" },
        { questionId: "question-retired", isCorrect: false, elapsedMs: 1_000, mode: "practice", createdAt: "2026-08-11T09:00:00Z" },
      ],
      reviewEvents: [
        { conceptId: "concept-active", sourceKind: "recall", rating: 2, occurredAt: "2026-08-10T09:00:00Z" },
        { conceptId: "concept-retired", sourceKind: "recall", rating: 2, occurredAt: "2026-08-10T09:00:00Z" },
      ],
      simulationAttempts: [{
        id: "retired-attempt",
        simulationId: "retired-exam",
        correctCount: 1,
        incorrectCount: 0,
        omittedCount: 0,
        elapsedMs: 1_000,
        createdAt: "2026-08-11T09:00:00Z",
      }],
    }));

    expect(snapshot.coverage).toEqual({ attempted: 1, percentage: 100, total: 1 });
    expect(snapshot.sample).toEqual({ reviewedConcepts: 1, uniqueAttemptedQuestions: 1 });
    expect(snapshot.accuracy.historical).toEqual({ correct: 1, percentage: 100, total: 1 });
    expect(snapshot.currentDomain).toEqual({ current: 1, percentage: 100, total: 1 });
    expect(snapshot.recentSimulations).toBe(0);
  });

  it("computes recent accuracy by the last 14 Madrid days and historical accuracy over all active answers", () => {
    const snapshot = calculateReadiness(input({
      concepts: concepts(2),
      questions: questions(3, 2),
      questionAttempts: [
        { questionId: "question-1", isCorrect: true, elapsedMs: 1_000, mode: "practice", createdAt: "2026-08-11T08:00:00Z" },
        { questionId: "question-2", isCorrect: true, elapsedMs: 1_000, mode: "practice", createdAt: "2026-07-28T22:30:00Z" },
        { questionId: "question-3", isCorrect: false, elapsedMs: 1_000, mode: "practice", createdAt: "2026-07-28T21:30:00Z" },
      ],
    }));

    expect(snapshot.accuracy.recent).toEqual({ correct: 2, percentage: 100, total: 2 });
    expect(snapshot.accuracy.historical).toEqual({ correct: 2, percentage: 66.67, total: 3 });
  });

  it("counts deferred recall only after prior evidence at least 24 hours earlier", () => {
    const snapshot = calculateReadiness(input({
      concepts: concepts(3),
      reviewEvents: [
        { conceptId: "concept-1", sourceKind: "question", questionId: "question-1", rating: 3, occurredAt: "2026-08-01T09:00:00Z" },
        { conceptId: "concept-1", sourceKind: "recall", rating: 2, occurredAt: "2026-08-02T09:00:00Z" },
        { conceptId: "concept-2", sourceKind: "question", questionId: "question-2", rating: 3, occurredAt: "2026-08-01T09:01:00Z" },
        { conceptId: "concept-2", sourceKind: "recall", rating: 3, occurredAt: "2026-08-02T09:00:00Z" },
        { conceptId: "concept-3", sourceKind: "question", questionId: "question-3", rating: 3, occurredAt: "2026-08-01T09:00:00Z" },
        { conceptId: "concept-3", sourceKind: "recall", rating: 1, occurredAt: "2026-08-02T10:00:00Z" },
        { conceptId: "retired", sourceKind: "question", questionId: "retired", rating: 3, occurredAt: "2026-08-01T09:00:00Z" },
        { conceptId: "retired", sourceKind: "recall", rating: 3, occurredAt: "2026-08-02T10:00:00Z" },
      ],
    }));

    expect(snapshot.deferredRetention).toEqual({ eligible: 2, percentage: 50, retained: 1 });
  });

  it("includes omitted simulation questions in speed and requires the whole exam to finish on time", () => {
    const snapshot = calculateReadiness(input({
      concepts: concepts(4),
      questions: questions(4, 4),
      questionAttempts: [
        { questionId: "question-1", isCorrect: true, elapsedMs: 90_000, mode: "practice", createdAt: "2026-08-11T08:00:00Z" },
        { questionId: "question-2", isCorrect: true, elapsedMs: 90_001, mode: "practice", createdAt: "2026-08-11T08:01:00Z" },
      ],
      simulations: [{ id: "exam", title: "Examen", durationMinutes: 10, questionIds: ["question-1", "question-2", "question-3", "question-4"] }],
      simulationAttempts: [
        { id: "sim-on-time", simulationId: "exam", correctCount: 3, incorrectCount: 0, omittedCount: 1, elapsedMs: 600_000, createdAt: "2026-08-10T08:00:00Z" },
        { id: "sim-overtime", simulationId: "exam", correctCount: 4, incorrectCount: 0, omittedCount: 0, elapsedMs: 600_001, createdAt: "2026-08-09T08:00:00Z" },
      ],
      simulationAnswers: [
        { attemptId: "sim-on-time", questionId: "question-1", isCorrect: true, selectedAnswer: "A" },
        { attemptId: "sim-on-time", questionId: "question-2", isCorrect: true, selectedAnswer: "A" },
        { attemptId: "sim-on-time", questionId: "question-3", isCorrect: true, selectedAnswer: "A" },
        { attemptId: "sim-on-time", questionId: "question-4", isCorrect: false, selectedAnswer: null },
        { attemptId: "sim-overtime", questionId: "question-1", isCorrect: true, selectedAnswer: "A" },
        { attemptId: "sim-overtime", questionId: "question-2", isCorrect: true, selectedAnswer: "A" },
        { attemptId: "sim-overtime", questionId: "question-3", isCorrect: true, selectedAnswer: "A" },
        { attemptId: "sim-overtime", questionId: "question-4", isCorrect: true, selectedAnswer: "A" },
      ],
    }));

    expect(snapshot.speed).toEqual({ percentage: 40, timely: 4, total: 10 });
  });

  it("calculates and normalizes ADIF net score against the official exam total", () => {
    const snapshot = calculateReadiness(input({
      concepts: concepts(10),
      questions: questions(10, 10),
      simulations: [{
        id: "exam-1",
        title: "Examen 1",
        durationMinutes: 10,
        questionIds: Array.from({ length: 10 }, (_, index) => `question-${index + 1}`),
      }],
      simulationAttempts: [{
        id: "simulation-attempt-1",
        simulationId: "exam-1",
        correctCount: 6,
        incorrectCount: 3,
        omittedCount: 1,
        elapsedMs: 600_000,
        createdAt: "2026-08-10T08:00:00Z",
      }],
    }));

    expect(snapshot.simulationScores).toEqual([{
      attemptId: "simulation-attempt-1",
      examId: "exam-1",
      examTitle: "Examen 1",
      netScore: 5,
      normalizedPercentage: 50,
      totalQuestions: 10,
    }]);
  });

  it("orders displayed simulation scores from the latest active attempt", () => {
    const snapshot = calculateReadiness(input({
      concepts: concepts(2),
      questions: questions(2, 2),
      simulations: [{ id: "exam", title: "Examen", durationMinutes: 10, questionIds: ["question-1", "question-2"] }],
      simulationAttempts: [
        { id: "older", simulationId: "exam", correctCount: 1, incorrectCount: 1, omittedCount: 0, elapsedMs: 600_000, createdAt: "2026-08-01T09:00:00Z" },
        { id: "latest", simulationId: "exam", correctCount: 2, incorrectCount: 0, omittedCount: 0, elapsedMs: 600_000, createdAt: "2026-08-10T09:00:00Z" },
      ],
    }));

    expect(snapshot.simulationScores.map((score) => score.attemptId)).toEqual(["latest", "older"]);
  });

  it("groups the active streak by Madrid calendar days across activity types", () => {
    const snapshot = calculateReadiness(input({
      concepts: concepts(2),
      questions: questions(2, 2),
      questionAttempts: [{
        questionId: "question-1",
        isCorrect: true,
        elapsedMs: 1_000,
        mode: "practice",
        createdAt: "2026-08-09T22:30:00Z",
      }],
      reviewEvents: [{
        conceptId: "concept-1",
        sourceKind: "recall",
        rating: 2,
        occurredAt: "2026-08-09T20:00:00Z",
      }],
      lessonActivity: [{ lessonId: "lesson-a", occurredAt: "2026-08-08T09:00:00Z" }],
    }));

    expect(snapshot.streak).toBe(3);
  });

  it("aggregates real active answers by concept and lesson without double-counting a multi-concept question", () => {
    const snapshot = calculateReadiness(input({
      concepts: [
        { id: "concept-1", title: "Concepto 1", lessonId: "lesson-a", lessonTitle: "Lección A" },
        { id: "concept-2", title: "Concepto 2", lessonId: "lesson-a", lessonTitle: "Lección A" },
        { id: "concept-3", title: "Concepto 3", lessonId: "lesson-b", lessonTitle: "Lección B" },
        { id: "concept-4", title: "Sin intentos", lessonId: "lesson-b", lessonTitle: "Lección B" },
      ],
      questions: [
        { id: "question-1", conceptIds: ["concept-1", "concept-2"] },
        { id: "question-2", conceptIds: ["concept-2"] },
        { id: "question-3", conceptIds: ["concept-3"] },
      ],
      questionAttempts: [
        { questionId: "question-1", isCorrect: true, elapsedMs: 1_000, mode: "practice", createdAt: "2026-08-11T08:00:00Z" },
        { questionId: "question-2", isCorrect: false, elapsedMs: 1_000, mode: "practice", createdAt: "2026-08-11T08:01:00Z" },
        { questionId: "question-retired", isCorrect: true, elapsedMs: 1_000, mode: "practice", createdAt: "2026-08-11T08:02:00Z" },
      ],
      simulations: [{ id: "exam", title: "Examen", durationMinutes: 10, questionIds: ["question-3"] }],
      simulationAttempts: [{
        id: "sim",
        simulationId: "exam",
        correctCount: 1,
        incorrectCount: 0,
        omittedCount: 0,
        elapsedMs: 60_000,
        createdAt: "2026-08-11T09:00:00Z",
      }],
      simulationAnswers: [{ attemptId: "sim", questionId: "question-3", isCorrect: true, selectedAnswer: "A" }],
    }));

    expect(snapshot.concepts.map(({ conceptId, correct, total }) => ({ conceptId, correct, total }))).toEqual([
      { conceptId: "concept-1", correct: 1, total: 1 },
      { conceptId: "concept-2", correct: 1, total: 2 },
      { conceptId: "concept-3", correct: 1, total: 1 },
      { conceptId: "concept-4", correct: 0, total: 0 },
    ]);
    expect(snapshot.lessons.map(({ lessonId, correct, total }) => ({ lessonId, correct, total }))).toEqual([
      { lessonId: "lesson-a", correct: 1, total: 2 },
      { lessonId: "lesson-b", correct: 1, total: 1 },
    ]);
  });
});
