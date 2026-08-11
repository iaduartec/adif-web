import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { assembleDailyPlanInput, createServerClient, maybeSingle, rpc } = vi.hoisted(() => ({
  assembleDailyPlanInput: vi.fn(),
  createServerClient: vi.fn(),
  maybeSingle: vi.fn(),
  rpc: vi.fn(),
}));

vi.mock("../lib/adaptive/daily-plan-server", () => ({ assembleDailyPlanInput }));
vi.mock("../lib/supabase/server", () => ({ createServerClient }));

import { postponeDailyTask, replaceDailyTask } from "../app/actions/daily-plan";

const planInput = {
  date: "2026-08-11",
  availableMinutes: 30,
  reviews: Array.from({ length: 7 }, (_, index) => ({
    conceptId: `concept-${String.fromCharCode(97 + index)}`,
    title: `Concept ${index}`,
    dueOn: "2026-08-10",
    status: "review" as const,
  })),
  lessons: [
    { lessonId: "lesson-a", title: "Lesson A", remainingMinutes: 20 },
    { lessonId: "lesson-b", title: "Lesson B", remainingMinutes: 20 },
  ],
  practiceQuestions: Array.from({ length: 10 }, (_, index) => ({ id: `q-${index}` })),
  simulations: [],
  uniqueAttemptedQuestionIds: Array.from({ length: 20 }, (_, index) => `attempted-${index}`),
  reviewedConceptIds: Array.from({ length: 10 }, (_, index) => `reviewed-${index}`),
  simulationAttempts: [],
  postponedTaskKeysYesterday: [],
  actions: [],
} as const;

describe("daily-plan server actions", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-11T10:00:00.000Z"));
    vi.clearAllMocks();
    assembleDailyPlanInput.mockResolvedValue(planInput);
    maybeSingle.mockResolvedValue({ data: null, error: null });
    rpc.mockResolvedValue({ data: true, error: null });
    createServerClient.mockResolvedValue({
      auth: { getUser: vi.fn(async () => ({ data: { user: { id: "user-1" } }, error: null })) },
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle,
      })),
      rpc,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("persists a postponement with the authenticated user and treats an identical retry as success", async () => {
    await expect(postponeDailyTask("2026-08-11", "review:concept-a")).resolves.toEqual({ ok: true });
    expect(rpc).toHaveBeenCalledWith("record_daily_plan_action", {
      p_plan_date: "2026-08-11",
      p_task_key: "review:concept-a",
      p_action: "postpone",
      p_replacement_task_key: null,
    });

    maybeSingle.mockResolvedValueOnce({
      data: { action: "postpone", replacement_task_key: null },
      error: null,
    });
    await expect(postponeDailyTask("2026-08-11", "review:concept-a")).resolves.toEqual({ ok: true });
    expect(rpc).toHaveBeenCalledTimes(1);
  });

  it("allows one active, different, same-or-shorter replacement per original task and date", async () => {
    await expect(replaceDailyTask("2026-08-11", "lesson:lesson-a", "review:concept-g")).resolves.toEqual({ ok: true });

    expect(rpc).toHaveBeenCalledWith("record_daily_plan_action", expect.objectContaining({
      p_action: "replace",
      p_task_key: "lesson:lesson-a",
      p_replacement_task_key: "review:concept-g",
    }));

    maybeSingle.mockResolvedValueOnce({
      data: { action: "replace", replacement_task_key: "review:concept-g" },
      error: null,
    });
    await expect(replaceDailyTask("2026-08-11", "lesson:lesson-a", "review:concept-g")).resolves.toEqual({ ok: true });
    expect(rpc).toHaveBeenCalledTimes(1);
  });

  it("rejects unauthenticated, stale, same, longer, and second replacement requests before writing", async () => {
    await expect(replaceDailyTask("2026-08-11", "lesson:lesson-a", "lesson:lesson-a")).rejects.toThrow(/distinta/i);
    await expect(replaceDailyTask("2026-08-11", "review:concept-a", "lesson:lesson-b")).rejects.toThrow(/duraci/i);
    await expect(replaceDailyTask("2026-08-11", "lesson:lesson-a", "lesson:inactive")).rejects.toThrow(/activa/i);
    await expect(replaceDailyTask("2026-08-11", "lesson:lesson-a", "review:concept-a")).rejects.toThrow(/incluida/i);

    assembleDailyPlanInput.mockResolvedValueOnce({
      ...planInput,
      actions: [{
        planDate: "2026-08-11",
        taskKey: "review:concept-g",
        action: "postpone",
        replacementTaskKey: null,
      }],
    });
    await expect(replaceDailyTask("2026-08-11", "lesson:lesson-a", "review:concept-g")).rejects.toThrow(/aplazada|reemplazada|asignada/i);

    maybeSingle.mockResolvedValueOnce({
      data: { action: "replace", replacement_task_key: "review:concept-a" },
      error: null,
    });
    await expect(replaceDailyTask("2026-08-11", "lesson:lesson-a", "practice:other")).rejects.toThrow(/una vez/i);

    createServerClient.mockResolvedValueOnce({
      auth: { getUser: vi.fn(async () => ({ data: { user: null }, error: null })) },
      from: vi.fn(),
    });
    await expect(postponeDailyTask("2026-08-11", "review:concept-a")).rejects.toThrow(/iniciar sesi/i);
    expect(rpc).not.toHaveBeenCalled();
  });

  it("rejects a plan date other than the server-assembled Madrid day", async () => {
    await expect(postponeDailyTask("2026-08-10", "review:concept-a")).rejects.toThrow(/fecha/i);
    expect(rpc).not.toHaveBeenCalled();
  });
});
