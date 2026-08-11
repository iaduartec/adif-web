import { describe, expect, it } from "vitest";

import {
  buildDailyPlan,
  listDailyTaskCandidates,
  type DailyPlanInput,
} from "../lib/adaptive/daily-plan";

const baseInput = (overrides: Partial<DailyPlanInput> = {}): DailyPlanInput => ({
  date: "2026-08-11",
  availableMinutes: 30,
  reviews: [],
  lessons: [],
  practiceQuestions: [],
  simulations: [],
  uniqueAttemptedQuestionIds: Array.from({ length: 20 }, (_, index) => `attempted-${index}`),
  reviewedConceptIds: Array.from({ length: 10 }, (_, index) => `reviewed-${index}`),
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

  it("uses a partial lesson chunk before lower-priority practice when 5-9 minutes remain", () => {
    const plan = buildDailyPlan(baseInput({
      availableMinutes: 16,
      lessons: [{ lessonId: "lesson", title: "Lesson", remainingMinutes: 20 }],
      practiceQuestions: questions(5),
    }));

    expect(plan.tasks.filter((task) => task.kind === "lesson").map((task) => task.estimatedMinutes)).toEqual([10, 6]);
    expect(plan.tasks.some((task) => task.kind === "practice")).toBe(false);
  });

  it("never schedules a later lesson block before its earlier resumable chunks", () => {
    const plan = buildDailyPlan(baseInput({
      availableMinutes: 20,
      lessons: [{ lessonId: "lesson", title: "Lesson", remainingMinutes: 25 }],
    }));

    expect(plan.tasks.filter((task) => task.kind === "lesson").map((task) => task.key)).toEqual([
      "lesson:lesson",
      "lesson:lesson:block:1",
    ]);
    expect(plan.tasks.filter((task) => task.kind === "lesson").map((task) => task.estimatedMinutes)).toEqual([10, 10]);
  });

  it("scales a ten-question pool into stable five-question blocks when its initial budget needs half sessions", () => {
    const plan = buildDailyPlan(baseInput({
      availableMinutes: 30,
      practiceQuestions: questions(10),
    }));
    const practice = plan.tasks.filter((task) => task.kind === "practice");

    expect(practice).toHaveLength(2);
    expect(practice.map((task) => [task.estimatedMinutes, task.questionCount])).toEqual([[6, 5], [6, 5]]);
    expect(new Set(practice.flatMap((task) => task.questionIds)).size).toBe(10);
  });

  it("returns diagnostic new-question practice and the first incomplete lesson when evidence is insufficient", () => {
    const plan = buildDailyPlan(baseInput({
      uniqueAttemptedQuestionIds: [],
      reviewedConceptIds: [],
      lessons: [
        { lessonId: "lesson-b", title: "B", remainingMinutes: 10 },
        { lessonId: "lesson-a", title: "A", remainingMinutes: 10 },
      ],
      practiceQuestions: questions(12),
    }));

    expect(plan.tasks.length).toBeGreaterThanOrEqual(2);
    expect(plan.tasks[0]).toMatchObject({ kind: "practice", diagnostic: true, questionCount: 10 });
    expect(plan.tasks[1]).toMatchObject({ kind: "lesson", lessonId: "lesson-a", estimatedMinutes: 10 });
    expect(plan.tasks[0].key).toBe(buildDailyPlan(baseInput({
      uniqueAttemptedQuestionIds: [],
      reviewedConceptIds: [],
      lessons: [{ lessonId: "lesson-a", title: "A", remainingMinutes: 10 }],
      practiceQuestions: [...questions(12)].reverse(),
    })).tasks[0].key);
  });

  it("treats evidence as sufficient exactly at 20 unique questions and 10 reviewed concepts", () => {
    const counts = (questionCount: number, conceptCount: number) => buildDailyPlan(baseInput({
      uniqueAttemptedQuestionIds: Array.from({ length: questionCount }, (_, index) => `attempted-${index}`),
      reviewedConceptIds: Array.from({ length: conceptCount }, (_, index) => `reviewed-${index}`),
      practiceQuestions: questions(10),
    })).evidenceSufficient;

    expect(counts(19, 10)).toBe(false);
    expect(counts(20, 9)).toBe(false);
    expect(counts(20, 10)).toBe(true);
  });

  it("fills a long insufficient-evidence session with nonoverlapping stable practice and lesson blocks", () => {
    const input = baseInput({
      availableMinutes: 60,
      uniqueAttemptedQuestionIds: [],
      reviewedConceptIds: [],
      lessons: [
        { lessonId: "lesson-a", title: "A", remainingMinutes: 30 },
        { lessonId: "lesson-b", title: "B", remainingMinutes: 30 },
      ],
      practiceQuestions: questions(30),
    });
    const plan = buildDailyPlan(input);
    const practice = plan.tasks.filter((task) => task.kind === "practice");
    const lesson = plan.tasks.filter((task) => task.kind === "lesson");
    const allQuestionIds = practice.flatMap((task) => task.questionIds);

    expect(practice).toHaveLength(3);
    expect(lesson.length).toBeGreaterThanOrEqual(2);
    expect(new Set(practice.map((task) => task.key)).size).toBe(practice.length);
    expect(new Set(allQuestionIds).size).toBe(allQuestionIds.length);
    expect(plan.allocatedMinutes).toBe(56);
    expect(plan.unusedMinutes).toBe(4);
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
      uniqueAttemptedQuestionIds: [],
      reviewedConceptIds: [],
      simulations,
      simulationAttempts: [{ examId: "exam-2025", attemptedOn: "2026-08-05" }],
    }));
    const sevenDays = buildDailyPlan(baseInput({
      availableMinutes: 60,
      uniqueAttemptedQuestionIds: [],
      reviewedConceptIds: [],
      simulations,
      simulationAttempts: [{ examId: "exam-2025", attemptedOn: "2026-08-04" }],
    }));

    expect(enoughEvidence.tasks.find((task) => task.kind === "simulation")).toMatchObject({ examId: "exam-2023-a" });
    expect(enoughEvidence.tasks.filter((task) => task.kind === "simulation")).toHaveLength(1);
    expect(tooSoon.tasks.some((task) => task.kind === "simulation")).toBe(false);
    expect(sevenDays.tasks.find((task) => task.kind === "simulation")).toMatchObject({ examId: "exam-2023-a" });
    expect(sevenDays.tasks.filter((task) => task.kind === "simulation")).toHaveLength(1);
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

  it("keeps the original task when a replacement would exceed the final review cap", () => {
    const input = baseInput({
      availableMinutes: 20,
      uniqueAttemptedQuestionIds: Array.from({ length: 20 }, (_, index) => `attempted-${index}`),
      reviewedConceptIds: Array.from({ length: 10 }, (_, index) => `reviewed-${index}`),
      reviews: Array.from({ length: 5 }, (_, index) => ({
        conceptId: `concept-${String.fromCharCode(97 + index)}`,
        title: `Concept ${index}`,
        dueOn: "2026-08-10",
        status: "review" as const,
      })),
      lessons: [{ lessonId: "lesson-a", title: "Lesson", remainingMinutes: 20 }],
      actions: [
        { planDate: "2026-08-11", taskKey: "lesson:lesson-a", action: "replace", replacementTaskKey: "review:concept-e" },
      ],
    });

    const rebuilt = buildDailyPlan(input);

    expect(rebuilt.tasks.some((task) => task.key === "lesson:lesson-a")).toBe(true);
    expect(rebuilt.tasks.some((task) => task.key === "review:concept-e")).toBe(false);
    expect(rebuilt.tasks.filter((task) => task.kind === "review").reduce(
      (minutes, task) => minutes + task.estimatedMinutes,
      0,
    )).toBe(12);
    expect(rebuilt.allocatedMinutes).toBeLessThanOrEqual(rebuilt.availableMinutes);
    expect(rebuilt.tasks).toHaveLength(5);
  });

  it("rejects a replacement lesson block when its prerequisite block is not earlier in the final plan", () => {
    const rebuilt = buildDailyPlan(baseInput({
      availableMinutes: 30,
      reviews: Array.from({ length: 6 }, (_, index) => ({
        conceptId: `concept-${index}`,
        title: `Concept ${index}`,
        dueOn: "2026-08-10",
        status: "review" as const,
      })),
      lessons: [
        { lessonId: "lesson-a", title: "A", remainingMinutes: 10 },
        { lessonId: "lesson-z", title: "Z", remainingMinutes: 20 },
      ],
      actions: [{
        planDate: "2026-08-11",
        taskKey: "lesson:lesson-a",
        action: "replace",
        replacementTaskKey: "lesson:lesson-z:block:1",
      }],
    }));

    expect(rebuilt.tasks.some((task) => task.key === "lesson:lesson-a")).toBe(true);
    expect(rebuilt.tasks.some((task) => task.key === "lesson:lesson-z:block:1")).toBe(false);
    expect(rebuilt.tasks.some((task) => task.key === "lesson:lesson-z")).toBe(false);
  });

  it("allows a replacement lesson block when its prerequisite is already earlier in the final plan", () => {
    const rebuilt = buildDailyPlan(baseInput({
      availableMinutes: 40,
      reviews: Array.from({ length: 5 }, (_, index) => ({
        conceptId: `concept-${index}`,
        title: `Concept ${index}`,
        dueOn: "2026-08-10",
        status: "review" as const,
      })),
      lessons: [{ lessonId: "lesson-z", title: "Z", remainingMinutes: 20 }],
      simulations: [{ examId: "exam-a", title: "A", durationMinutes: 12, sourceYear: 2023 }],
      postponedTaskKeysYesterday: ["simulation:exam-a"],
      actions: [{
        planDate: "2026-08-11",
        taskKey: "simulation:exam-a",
        action: "replace",
        replacementTaskKey: "lesson:lesson-z:block:1",
      }],
    }));

    expect(rebuilt.tasks.map((task) => task.key)).toContain("lesson:lesson-z");
    expect(rebuilt.tasks.map((task) => task.key)).toContain("lesson:lesson-z:block:1");
    expect(rebuilt.tasks.some((task) => task.key === "simulation:exam-a")).toBe(false);
  });

  it("keeps a non-simulation original when its replacement would add a second simulation", () => {
    const common = baseInput({
      availableMinutes: 60,
      practiceQuestions: questions(10),
      simulations: [
        { examId: "exam-a", title: "A", durationMinutes: 12, sourceYear: 2023 },
        { examId: "exam-b", title: "B", durationMinutes: 12, sourceYear: 2024 },
      ],
    });
    const original = buildDailyPlan(common);
    const practice = original.tasks.find((task) => task.kind === "practice");
    expect(practice).toBeDefined();

    const rebuilt = buildDailyPlan({
      ...common,
      actions: [{
        planDate: "2026-08-11",
        taskKey: practice!.key,
        action: "replace",
        replacementTaskKey: "simulation:exam-b",
      }],
    });

    expect(rebuilt.tasks.filter((task) => task.kind === "simulation")).toHaveLength(1);
    expect(rebuilt.tasks.some((task) => task.key === "simulation:exam-a")).toBe(true);
    expect(rebuilt.tasks.some((task) => task.key === practice!.key)).toBe(true);
  });

  it("rejects an earlier replacement atomically instead of dropping an untouched later simulation", () => {
    const common = baseInput({
      availableMinutes: 30,
      lessons: [{ lessonId: "lesson-a", title: "A", remainingMinutes: 10 }],
      simulations: [
        { examId: "exam-a", title: "A", durationMinutes: 10, sourceYear: 2023 },
        { examId: "exam-b", title: "B", durationMinutes: 10, sourceYear: 2024 },
      ],
    });
    const original = buildDailyPlan(common);
    expect(original.tasks.map((task) => task.key)).toEqual([
      "lesson:lesson-a",
      "simulation:exam-a",
    ]);

    const rebuilt = buildDailyPlan({
      ...common,
      actions: [{
        planDate: "2026-08-11",
        taskKey: "lesson:lesson-a",
        action: "replace",
        replacementTaskKey: "simulation:exam-b",
      }],
    });

    expect(rebuilt.tasks.map((task) => task.key)).toEqual(original.tasks.map((task) => task.key));
    expect(rebuilt.allocatedMinutes).toBe(original.allocatedMinutes);
  });

  it("cascades a postponed lesson prerequisite while preserving independent work and replacements", () => {
    const common = baseInput({
      availableMinutes: 40,
      lessons: [
        { lessonId: "lesson-x", title: "X", remainingMinutes: 20 },
        { lessonId: "lesson-y", title: "Y", remainingMinutes: 10 },
      ],
      practiceQuestions: questions(10),
    });
    const original = buildDailyPlan(common);
    const selectedPractice = original.tasks.find((task) => task.kind === "practice");
    const replacementPractice = listDailyTaskCandidates(common).find((task) => (
      task.kind === "practice" && task.key !== selectedPractice?.key
    ));
    expect(selectedPractice).toBeDefined();
    expect(replacementPractice).toBeDefined();
    expect(original.tasks.filter((task) => task.kind === "lesson").map((task) => task.key)).toEqual([
      "lesson:lesson-x",
      "lesson:lesson-x:block:1",
      "lesson:lesson-y",
    ]);

    const rebuilt = buildDailyPlan({
      ...common,
      actions: [
        {
          planDate: "2026-08-11",
          taskKey: "lesson:lesson-x",
          action: "postpone",
          replacementTaskKey: null,
        },
        {
          planDate: "2026-08-11",
          taskKey: selectedPractice!.key,
          action: "replace",
          replacementTaskKey: replacementPractice!.key,
        },
      ],
    });

    expect(rebuilt.tasks.map((task) => task.key)).toEqual([
      replacementPractice!.key,
      "lesson:lesson-y",
    ]);
    expect(rebuilt.allocatedMinutes).toBe(16);
    expect(rebuilt.unusedMinutes).toBe(24);
  });

  it("keeps original work when a stored replacement conflicts with a selected or acted-on target", () => {
    const common = baseInput({
      availableMinutes: 20,
      uniqueAttemptedQuestionIds: Array.from({ length: 20 }, (_, index) => `attempted-${index}`),
      reviewedConceptIds: Array.from({ length: 10 }, (_, index) => `reviewed-${index}`),
      reviews: Array.from({ length: 5 }, (_, index) => ({
        conceptId: `concept-${String.fromCharCode(97 + index)}`,
        title: `Concept ${index}`,
        dueOn: "2026-08-10",
        status: "review" as const,
      })),
      lessons: [{ lessonId: "lesson-a", title: "Lesson", remainingMinutes: 20 }],
    });
    const selectedConflict = buildDailyPlan({
      ...common,
      actions: [{ planDate: "2026-08-11", taskKey: "lesson:lesson-a", action: "replace", replacementTaskKey: "review:concept-a" }],
    });
    const actedOnConflict = buildDailyPlan({
      ...common,
      actions: [
        { planDate: "2026-08-11", taskKey: "review:concept-e", action: "postpone", replacementTaskKey: null },
        { planDate: "2026-08-11", taskKey: "lesson:lesson-a", action: "replace", replacementTaskKey: "review:concept-e" },
      ],
    });

    expect(selectedConflict.tasks.some((task) => task.key === "lesson:lesson-a")).toBe(true);
    expect(selectedConflict.tasks.filter((task) => task.key === "review:concept-a")).toHaveLength(1);
    expect(actedOnConflict.tasks.some((task) => task.key === "lesson:lesson-a")).toBe(true);
    expect(actedOnConflict.tasks.some((task) => task.key === "review:concept-e")).toBe(false);
  });

  it("cannot replay an inactive or oversized stored replacement into the rebuilt plan", () => {
    const common = baseInput({
      availableMinutes: 20,
      reviews: Array.from({ length: 5 }, (_, index) => ({
        conceptId: `concept-${String.fromCharCode(97 + index)}`,
        title: `Concept ${index}`,
        dueOn: "2026-08-10",
        status: "review" as const,
      })),
      lessons: [
        { lessonId: "lesson-a", title: "A", remainingMinutes: 10 },
        { lessonId: "lesson-b", title: "B", remainingMinutes: 10 },
      ],
    });
    const inactive = buildDailyPlan({
      ...common,
      actions: [{ planDate: "2026-08-11", taskKey: "review:concept-a", action: "replace", replacementTaskKey: "lesson:inactive" }],
    });
    const oversized = buildDailyPlan({
      ...common,
      actions: [{ planDate: "2026-08-11", taskKey: "review:concept-a", action: "replace", replacementTaskKey: "lesson:lesson-b" }],
    });

    expect(inactive.tasks.some((task) => task.key === "review:concept-a")).toBe(true);
    expect(inactive.tasks.some((task) => task.key === "lesson:inactive")).toBe(false);
    expect(oversized.tasks.some((task) => task.key === "review:concept-a")).toBe(true);
    expect(oversized.tasks.some((task) => task.key === "lesson:lesson-b")).toBe(false);
  });

  it("boosts yesterday's stable debt key for lessons, practice blocks, and simulations", () => {
    const sufficient = {
      uniqueAttemptedQuestionIds: Array.from({ length: 20 }, (_, index) => `attempted-${index}`),
      reviewedConceptIds: Array.from({ length: 10 }, (_, index) => `reviewed-${index}`),
    };
    const lessons = baseInput({
      ...sufficient,
      availableMinutes: 10,
      lessons: [
        { lessonId: "lesson-a", title: "A", remainingMinutes: 10 },
        { lessonId: "lesson-b", title: "B", remainingMinutes: 10 },
      ],
    });
    const lessonDebt = buildDailyPlan({ ...lessons, postponedTaskKeysYesterday: ["lesson:lesson-b"] });

    const practiceCandidates = buildDailyPlan(baseInput({
      ...sufficient,
      availableMinutes: 24,
      practiceQuestions: questions(10),
    })).tasks.filter((task) => task.kind === "practice");
    expect(practiceCandidates).toHaveLength(2);
    const postponedPracticeKey = practiceCandidates[1]?.key ?? "practice:missing";
    const practiceDebt = buildDailyPlan(baseInput({
      ...sufficient,
      availableMinutes: 12,
      practiceQuestions: questions(10),
      postponedTaskKeysYesterday: [postponedPracticeKey],
    }));

    const simulationDebt = buildDailyPlan(baseInput({
      ...sufficient,
      availableMinutes: 15,
      simulations: [
        { examId: "exam-a", title: "A", durationMinutes: 15, sourceYear: 2023 },
        { examId: "exam-b", title: "B", durationMinutes: 15, sourceYear: 2024 },
      ],
      postponedTaskKeysYesterday: ["simulation:exam-b"],
    }));

    expect(lessonDebt.tasks[0].key).toBe("lesson:lesson-b");
    expect(practiceDebt.tasks[0].key).toBe(postponedPracticeKey);
    expect(simulationDebt.tasks[0].key).toBe("simulation:exam-b");
  });

  it("rejects impossible ISO-looking calendar dates", () => {
    expect(() => buildDailyPlan(baseInput({ date: "2026-02-31" }))).toThrow(/date/i);
  });
});
