import { describe, expect, it } from "vitest";

import {
  ONBOARDING_SESSION_MINUTES,
  getMadridDate,
  parseOnboardingInput,
  selectBalancedDiagnosticQuestionIds,
} from "../lib/onboarding";

describe("onboarding contract", () => {
  it("accepts a complete preparation profile and retains optional choices", () => {
    const input = new FormData();
    input.set("weekly_target_minutes", "240");
    input.set("preferred_days", "1");
    input.set("session_minutes", "45");
    input.set("exam_date", "2026-08-12");
    input.set("diagnostic", "true");
    const result = parseOnboardingInput(input, "2026-08-11");

    expect(result).toEqual({
      data: {
        weeklyTargetMinutes: 240,
        preferredDays: [1],
        sessionMinutes: 45,
        examDate: "2026-08-12",
        diagnostic: true,
      },
      errors: {},
    });
  });

  it("rejects invalid targets, empty availability, unapproved session durations, and past Madrid dates", () => {
    const input = new FormData();
    input.set("weekly_target_minutes", "1681");
    input.set("session_minutes", "120");
    input.set("exam_date", "2026-08-10");

    const result = parseOnboardingInput(input, "2026-08-11");

    expect(result.data).toBeNull();
    expect(result.errors).toMatchObject({
      weeklyTargetMinutes: expect.any(String),
      preferredDays: expect.any(String),
      sessionMinutes: expect.any(String),
      examDate: expect.any(String),
    });
  });

  it("only exposes the supported session duration choices", () => {
    expect(ONBOARDING_SESSION_MINUTES).toEqual([20, 30, 45, 60]);
  });

  it("gets today in Madrid rather than relying on the server local timezone", () => {
    expect(getMadridDate(new Date("2026-08-10T22:30:00.000Z"))).toBe("2026-08-11");
  });

  it("selects fifteen diagnostic questions evenly across available official sections", () => {
    const selected = selectBalancedDiagnosticQuestionIds([
      { id: "g-1", source: { section: "general" } },
      { id: "g-2", source: { section: "general" } },
      { id: "g-3", source: { section: "general" } },
      { id: "s-1", source: { section: "specific" } },
      { id: "s-2", source: { section: "specific" } },
      { id: "s-3", source: { section: "specific" } },
      { id: "p-1", source: { section: "psychotechnical" } },
      { id: "p-2", source: { section: "psychotechnical" } },
      { id: "p-3", source: { section: "psychotechnical" } },
    ]);

    expect(selected).toHaveLength(9);
    expect(selected).toEqual(["g-1", "s-1", "p-1", "g-2", "s-2", "p-2", "g-3", "s-3", "p-3"]);
  });
});
