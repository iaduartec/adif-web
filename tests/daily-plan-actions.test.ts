import { beforeEach, describe, expect, it, vi } from "vitest";

const { assembleDailyPlanInput, createServerClient, insert, maybeSingle } = vi.hoisted(() => ({
  assembleDailyPlanInput: vi.fn(),
  createServerClient: vi.fn(),
  insert: vi.fn(),
  maybeSingle: vi.fn(),
}));

vi.mock("../lib/adaptive/daily-plan-server", () => ({ assembleDailyPlanInput }));
vi.mock("../lib/supabase/server", () => ({ createServerClient }));

import { postponeDailyTask, replaceDailyTask } from "../app/actions/daily-plan";

const planInput = {
  date: "2026-08-11",
  availableMinutes: 30,
  evidenceSufficient: true,
  reviews: [{ conceptId: "concept-a", title: "A", dueOn: "2026-08-10", status: "review" }],
  lessons: [{ lessonId: "lesson-a", title: "Lesson", remainingMinutes: 10 }],
  practiceQuestions: Array.from({ length: 10 }, (_, index) => ({ id: `q-${index}` })),
  simulations: [],
  uniqueAttemptedQuestionIds: [],
  reviewedConceptIds: [],
  simulationAttempts: [],
  postponedTaskKeysYesterday: [],
  actions: [],
} as const;

describe("daily-plan server actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    assembleDailyPlanInput.mockResolvedValue(planInput);
    maybeSingle.mockResolvedValue({ data: null, error: null });
    insert.mockResolvedValue({ error: null });
    createServerClient.mockResolvedValue({
      auth: { getUser: vi.fn(async () => ({ data: { user: { id: "user-1" } }, error: null })) },
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle,
        insert,
      })),
    });
  });

  it("persists a postponement with the authenticated user and treats an identical retry as success", async () => {
    await expect(postponeDailyTask("2026-08-11", "review:concept-a")).resolves.toEqual({ ok: true });
    expect(insert).toHaveBeenCalledWith({
      user_id: "user-1",
      plan_date: "2026-08-11",
      task_key: "review:concept-a",
      action: "postpone",
      replacement_task_key: null,
    });

    maybeSingle.mockResolvedValueOnce({
      data: { action: "postpone", replacement_task_key: null },
      error: null,
    });
    await expect(postponeDailyTask("2026-08-11", "review:concept-a")).resolves.toEqual({ ok: true });
    expect(insert).toHaveBeenCalledTimes(1);
  });

  it("allows one active, different, same-or-shorter replacement per original task and date", async () => {
    await expect(replaceDailyTask("2026-08-11", "lesson:lesson-a", "review:concept-a")).resolves.toEqual({ ok: true });

    expect(insert).toHaveBeenCalledWith(expect.objectContaining({
      user_id: "user-1",
      action: "replace",
      task_key: "lesson:lesson-a",
      replacement_task_key: "review:concept-a",
    }));

    maybeSingle.mockResolvedValueOnce({
      data: { action: "replace", replacement_task_key: "review:concept-a" },
      error: null,
    });
    await expect(replaceDailyTask("2026-08-11", "lesson:lesson-a", "review:concept-a")).resolves.toEqual({ ok: true });
    expect(insert).toHaveBeenCalledTimes(1);
  });

  it("rejects unauthenticated, stale, same, longer, and second replacement requests before writing", async () => {
    await expect(replaceDailyTask("2026-08-11", "lesson:lesson-a", "lesson:lesson-a")).rejects.toThrow(/distinta/i);
    await expect(replaceDailyTask("2026-08-11", "review:concept-a", "lesson:lesson-a")).rejects.toThrow(/duraci/i);
    await expect(replaceDailyTask("2026-08-11", "lesson:lesson-a", "lesson:inactive")).rejects.toThrow(/activa/i);

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
    expect(insert).not.toHaveBeenCalled();
  });

  it("rejects a plan date other than the server-assembled Madrid day", async () => {
    await expect(postponeDailyTask("2026-08-10", "review:concept-a")).rejects.toThrow(/fecha/i);
    expect(insert).not.toHaveBeenCalled();
  });
});
