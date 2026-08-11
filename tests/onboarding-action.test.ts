import { beforeEach, describe, expect, it, vi } from "vitest";

const { createServerClient, redirect, upsert } = vi.hoisted(() => ({
  createServerClient: vi.fn(),
  redirect: vi.fn((url: string) => { throw new Error(`redirect:${url}`); }),
  upsert: vi.fn(),
}));

vi.mock("next/navigation", () => ({ redirect }));
vi.mock("../lib/supabase/server", () => ({ createServerClient }));

import { saveOnboarding } from "../app/onboarding/actions";
import { initialOnboardingFormState } from "../lib/onboarding-form-state";

describe("saveOnboarding", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    upsert.mockResolvedValue({ error: null });
    createServerClient.mockResolvedValue({
      auth: { getUser: vi.fn(async () => ({ data: { user: { id: "user-1" } } })) },
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn(async () => ({ data: { onboarding_completed_at: "2026-08-01T10:00:00.000Z" } })),
        upsert,
      })),
    });
  });

  it("keeps supplied values and errors available after a validation failure", async () => {
    const formData = new FormData();
    formData.set("weekly_target_minutes", "0");
    formData.set("session_minutes", "30");

    const result = await saveOnboarding("/curso", initialOnboardingFormState, formData);

    expect(result.values.weeklyTargetMinutes).toBe("0");
    expect(result.errors.weeklyTargetMinutes).toBeTruthy();
    expect(upsert).not.toHaveBeenCalled();
  });

  it("upserts the authenticated profile without replacing its original completion time", async () => {
    const formData = new FormData();
    formData.set("weekly_target_minutes", "180");
    formData.append("preferred_days", "1");
    formData.append("preferred_days", "4");
    formData.set("session_minutes", "30");

    await expect(saveOnboarding("/curso", initialOnboardingFormState, formData)).rejects.toThrow("redirect:/curso");

    expect(upsert).toHaveBeenCalledWith({
      user_id: "user-1",
      weekly_target_minutes: 180,
      preferred_days: [1, 4],
      session_minutes: 30,
      exam_date: null,
      onboarding_completed_at: "2026-08-01T10:00:00.000Z",
    }, { onConflict: "user_id" });
  });
});
