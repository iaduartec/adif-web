import { describe, expect, it } from "vitest";

import { assembleDailyPlanInputFromRows } from "../lib/adaptive/daily-plan-server";
import { buildDailyPlan } from "../lib/adaptive/daily-plan";

describe("daily-plan server assembly", () => {
  it("assembles only active content and authenticated history into deterministic domain input", () => {
    const input = assembleDailyPlanInputFromRows({
      date: "2026-08-11",
      sessionMinutes: 30,
      content: {
        concepts: [
          { conceptId: "active-a", title: "Active A", lessonId: "lesson-a" },
          { conceptId: "active-b", title: "Active B", lessonId: "lesson-b" },
        ],
        lessons: [
          { lessonId: "lesson-b", title: "Lesson B" },
          { lessonId: "lesson-a", title: "Lesson A" },
        ],
        questions: [
          { id: "q-active-2", conceptIds: ["active-b"] },
          { id: "q-active-1", conceptIds: ["active-a"] },
          { id: "q-retired", conceptIds: ["retired"] },
        ],
        simulations: [{ examId: "exam-a", title: "Exam", durationMinutes: 15, sourceYear: 2024 }],
      },
      history: {
        mastery: [
          { conceptId: "active-a", status: "at_risk", dueOn: "2026-08-10", repetitions: 1 },
          { conceptId: "retired", status: "at_risk", dueOn: "2026-08-01", repetitions: 9 },
        ],
        lessonProgress: [
          { lessonId: "lesson-a", percent: 100, completed: true },
          { lessonId: "lesson-b", percent: 96, completed: false },
        ],
        questionAttempts: [
          { questionId: "q-active-1" },
          { questionId: "q-active-1" },
          { questionId: "q-retired" },
        ],
        simulationAttempts: [{ examId: "exam-a", createdAt: "2026-08-03T22:30:00.000Z" }],
        actions: [
          { planDate: "2026-08-10", taskKey: "review:active-b", action: "postpone", replacementTaskKey: null },
          { planDate: "2026-08-11", taskKey: "review:active-a", action: "postpone", replacementTaskKey: null },
          { planDate: "2026-08-09", taskKey: "review:old", action: "postpone", replacementTaskKey: null },
        ],
      },
    });

    expect(input).toMatchObject({
      date: "2026-08-11",
      availableMinutes: 30,
      reviews: [{ conceptId: "active-a", title: "Active A", dueOn: "2026-08-10", status: "at_risk" }],
      lessons: [{ lessonId: "lesson-b", title: "Lesson B", remainingMinutes: 5 }],
      practiceQuestions: [{ id: "q-active-1" }, { id: "q-active-2" }],
      uniqueAttemptedQuestionIds: ["q-active-1"],
      reviewedConceptIds: ["active-a"],
      simulationAttempts: [{ examId: "exam-a", attemptedOn: "2026-08-04" }],
      postponedTaskKeysYesterday: ["review:active-b"],
      actions: [{
        planDate: "2026-08-11",
        taskKey: "review:active-a",
        action: "postpone",
        replacementTaskKey: null,
      }],
    });
  });

  it("marks fewer than 20 unique questions or 10 reviewed concepts as insufficient evidence", () => {
    const input = assembleDailyPlanInputFromRows({
      date: "2026-08-11",
      sessionMinutes: 20,
      content: {
        concepts: [{ conceptId: "active", title: "Active", lessonId: "lesson" }],
        lessons: [{ lessonId: "lesson", title: "Lesson" }],
        questions: Array.from({ length: 10 }, (_, index) => ({ id: `q-${index}`, conceptIds: ["active"] })),
        simulations: [],
      },
      history: { mastery: [], lessonProgress: [], questionAttempts: [], simulationAttempts: [], actions: [] },
    });

    expect(buildDailyPlan(input).evidenceSufficient).toBe(false);
    expect(input.actions).toEqual([]);
    expect(input.lessons).toEqual([{ lessonId: "lesson", title: "Lesson", remainingMinutes: 10 }]);
  });

  it("marks evidence sufficient only when both exact minimums are met", () => {
    const input = assembleDailyPlanInputFromRows({
      date: "2026-08-11",
      sessionMinutes: 20,
      content: {
        concepts: Array.from({ length: 10 }, (_, index) => ({
          conceptId: `concept-${index}`,
          title: `Concept ${index}`,
          lessonId: "lesson",
        })),
        lessons: [{ lessonId: "lesson", title: "Lesson" }],
        questions: Array.from({ length: 20 }, (_, index) => ({ id: `q-${index}`, conceptIds: [`concept-${index % 10}`] })),
        simulations: [],
      },
      history: {
        mastery: Array.from({ length: 10 }, (_, index) => ({
          conceptId: `concept-${index}`,
          status: "review",
          dueOn: "2026-08-12",
          repetitions: 1,
        })),
        lessonProgress: [],
        questionAttempts: Array.from({ length: 20 }, (_, index) => ({ questionId: `q-${index}` })),
        simulationAttempts: [],
        actions: [],
      },
    });

    expect(buildDailyPlan(input).evidenceSufficient).toBe(true);
  });
});
