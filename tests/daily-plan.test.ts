import { describe, expect, it } from "vitest";

import {
  buildDailyPlan,
  type DailyPlanInput,
} from "../lib/adaptive/daily-plan";

const baseInput = (overrides: Partial<DailyPlanInput> = {}): DailyPlanInput => ({
  date: "2026-08-11",
  availableMinutes: 30,
  evidenceSufficient: true,
  reviews: [],
  lessons: [],
  practiceQuestions: [],
  simulations: [],
  uniqueAttemptedQuestionIds: [],
  reviewedConceptIds: [],
  simulationAttempts: [],
  postponedTaskKeysYesterday: [],
  actions: [],
  ...overrides,
});

const questions = (count: number) => Array.from({ length: count }, (_, index) => ({
  id: `question-${String(index + 1).padStart(2, "0")}`,
}));

describe("buildDailyPlan", () => {
  it("orders overdue reviews by postponement debt, due date, at-risk status, then stable concept id", () => {
    const plan = buildDailyPlan(baseInput({
      availableMinutes: 20,
      reviews: [
        { conceptId: "concept-b", title: "B", dueOn: "2026-08-09", status: "review" },
        { conceptId: "concept-c", title: "C", dueOn: "2026-08-10", status: "at_risk" },
        { conceptId: "concept-a", title: "A", dueOn: "2026-08-10", status: "at_risk" },
        { conceptId: "concept-debt", title: "Debt", dueOn: "2026-08-10", status: "review" },
      ],
      postponedTaskKeysYesterday: ["review:concept-debt"],
    }));

    expect(plan.tasks.map((task) => task.key)).toEqual([
      "review:concept-debt",
      "review:concept-b",
      "review:concept-a",
      "review:concept-c",
    ]);
  });

  it("starts from floor 40/35/25 percent budgets and fills unused capacity by priority", () => {
    const plan = buildDailyPlan(baseInput({
      availableMinutes: 60,
      reviews: Array.from({ length: 12 }, (_, index) => ({
        conceptId: `concept-${String(index).padStart(2, "0")}`,
        title: `Concept ${index}`,
        dueOn: "2026-08-10",
        status: "review" as const,
      })),
      lessons: [
        { lessonId: "lesson-a", title: "Lesson A", remainingMinutes: 30 },
        { lessonId: "lesson-b", title: "Lesson B", remainingMinutes: 30 },
      ],
      practiceQuestions: questions(10),
    }));

    expect(plan.initialBudgets).toEqual({ review: 24, lesson: 21, practice: 15 });
    expect(plan.tasks.filter((task) => task.kind === "review")).toHaveLength(9);
    expect(plan.tasks.filter((task) => task.kind === "lesson")).toHaveLength(2);
    expect(plan.tasks.find((task) => task.kind === "practice")).toMatchObject({
      estimatedMinutes: 12,
      questionCount: 10,
    });
    expect(plan.allocatedMinutes).toBe(59);
    expect(plan.unusedMinutes).toBe(1);
  });

  it("never lets review work exceed 60 percent even when no other work is eligible", () => {
    const plan = buildDailyPlan(baseInput({
      availableMinutes: 30,
      reviews: Array.from({ length: 20 }, (_, index) => ({
        conceptId: `concept-${index}`,
        title: `Concept ${index}`,
        dueOn: "2026-08-01",
        status: "at_risk" as const,
      })),
    }));

    expect(plan.tasks).toHaveLength(6);
    expect(plan.allocatedMinutes).toBe(18);
    expect(plan.unusedMinutes).toBe(12);
  });

  it("uses bounded resumable lesson chunks and scales practice only to the supported half session", () => {
    const plan = buildDailyPlan(baseInput({
      availableMinutes: 25,
      lessons: [
        { lessonId: "almost-done", title: "Almost done", remainingMinutes: 7 },
        { lessonId: "long", title: "Long lesson", remainingMinutes: 90 },
      ],
      practiceQuestions: questions(7),
    }));

    const lessons = plan.tasks.filter((task) => task.kind === "lesson");
    expect(lessons.map((task) => task.estimatedMinutes)).toEqual([7, 10]);
    expect(plan.tasks.find((task) => task.kind === "practice")).toMatchObject({
      estimatedMinutes: 6,
      questionCount: 5,
    });
    expect(plan.tasks.every((task) => task.estimatedMinutes <= plan.availableMinutes)).toBe(true);
  });

  it("keeps a normal lesson chunk at ten minutes when the full plan still has room", () => {
    const plan = buildDailyPlan(baseInput({
      availableMinutes: 20,
      reviews: [
        { conceptId: "concept-a", title: "A", dueOn: "2026-08-10", status: "review" },
        { conceptId: "concept-b", title: "B", dueOn: "2026-08-10", status: "review" },
      ],
      lessons: [{ lessonId: "lesson", title: "Lesson", remainingMinutes: 90 }],
    }));

    expect(plan.tasks.find((task) => task.kind === "lesson")?.estimatedMinutes).toBe(10);
  });

  it("returns diagnostic new-question practice and the first incomplete lesson when evidence is insufficient", () => {
    const plan = buildDailyPlan(baseInput({
      evidenceSufficient: false,
      lessons: [
        { lessonId: "lesson-b", title: "B", remainingMinutes: 10 },
        { lessonId: "lesson-a", title: "A", remainingMinutes: 10 },
      ],
      practiceQuestions: questions(12),
    }));

    expect(plan.tasks).toHaveLength(2);
    expect(plan.tasks[0]).toMatchObject({ kind: "practice", diagnostic: true, questionCount: 10 });
    expect(plan.tasks[1]).toMatchObject({ kind: "lesson", lessonId: "lesson-a", estimatedMinutes: 10 });
    expect(plan.tasks[0].key).toBe(buildDailyPlan(baseInput({
      evidenceSufficient: false,
      lessons: [{ lessonId: "lesson-a", title: "A", remainingMinutes: 10 }],
      practiceQuestions: [...questions(12)].reverse(),
    })).tasks[0].key);
  });

  it("offers the oldest stable official simulation only after enough evidence or seven Madrid calendar days", () => {
    const simulations = [
      { examId: "exam-2025", title: "2025", durationMinutes: 15, sourceYear: 2025 },
      { examId: "exam-2023-b", title: "2023 B", durationMinutes: 15, sourceYear: 2023 },
      { examId: "exam-2023-a", title: "2023 A", durationMinutes: 15, sourceYear: 2023 },
    ];
    const enoughEvidence = buildDailyPlan(baseInput({
      availableMinutes: 60,
      uniqueAttemptedQuestionIds: questions(20).map(({ id }) => id),
      reviewedConceptIds: Array.from({ length: 10 }, (_, index) => `concept-${index}`),
      simulations,
    }));
    const tooSoon = buildDailyPlan(baseInput({
      availableMinutes: 60,
      simulations,
      simulationAttempts: [{ examId: "exam-2025", attemptedOn: "2026-08-05" }],
    }));
    const sevenDays = buildDailyPlan(baseInput({
      availableMinutes: 60,
      simulations,
      simulationAttempts: [{ examId: "exam-2025", attemptedOn: "2026-08-04" }],
    }));

    expect(enoughEvidence.tasks.find((task) => task.kind === "simulation")).toMatchObject({ examId: "exam-2023-a" });
    expect(tooSoon.tasks.some((task) => task.kind === "simulation")).toBe(false);
    expect(sevenDays.tasks.find((task) => task.kind === "simulation")).toMatchObject({ examId: "exam-2023-a" });
  });

  it("never selects an official simulation that does not fit the available minutes", () => {
    const plan = buildDailyPlan(baseInput({
      availableMinutes: 20,
      uniqueAttemptedQuestionIds: questions(20).map(({ id }) => id),
      reviewedConceptIds: Array.from({ length: 10 }, (_, index) => `concept-${index}`),
      simulations: [{ examId: "long-exam", title: "Long", durationMinutes: 25, sourceYear: 2023 }],
    }));

    expect(plan.tasks.some((task) => task.kind === "simulation")).toBe(false);
  });

  it("applies today's postpone and replacement actions without materializing a stored plan", () => {
    const input = baseInput({
      availableMinutes: 20,
      reviews: [
        { conceptId: "concept-a", title: "A", dueOn: "2026-08-10", status: "review" },
        { conceptId: "concept-b", title: "B", dueOn: "2026-08-10", status: "review" },
      ],
      lessons: [{ lessonId: "lesson-a", title: "Lesson", remainingMinutes: 10 }],
      actions: [
        { planDate: "2026-08-11", taskKey: "review:concept-a", action: "postpone", replacementTaskKey: null },
        { planDate: "2026-08-11", taskKey: "review:concept-b", action: "replace", replacementTaskKey: "lesson:lesson-a" },
      ],
    });

    expect(buildDailyPlan(input).tasks.map((task) => task.key)).toEqual(["lesson:lesson-a"]);
  });
});
