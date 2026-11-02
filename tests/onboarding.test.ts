import { describe, expect, it } from "vitest";

import {
  ONBOARDING_SESSION_MINUTES,
  getMadridDate,
  parseOnboardingInput,
} from "../lib/onboarding";
import type { OriginalPracticeQuestionDto } from "../lib/content/original-practice-public-dto";
import { toPublicPracticeQuestion } from "../lib/content/original-practice-public-dto";
import { listOriginalPracticeQuestions } from "../lib/content/original-practice-repository";
import { selectBalancedOriginalDiagnosticQuestions } from "../lib/onboarding-diagnostic";

const diagnosticDomains = ["general-knowledge", "psychometric", "english-a2", "telecom"] as const;

const eligibleOriginals = listOriginalPracticeQuestions({ status: "reviewed" })
  .map(toPublicPracticeQuestion)
  .filter((question) => question !== null);

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

  it("rejects malformed preferred-day tokens and impossible calendar dates before persistence", () => {
    const input = new FormData();
    input.set("weekly_target_minutes", "120");
    input.append("preferred_days", "");
    input.append("preferred_days", "1");
    input.set("session_minutes", "30");
    input.set("exam_date", "2026-02-31");

    const result = parseOnboardingInput(input, "2026-02-01");

    expect(result.data).toBeNull();
    expect(result.errors.preferredDays).toBeTruthy();
    expect(result.errors.examDate).toBeTruthy();
  });

  it("only exposes the supported session duration choices", () => {
    expect(ONBOARDING_SESSION_MINUTES).toEqual([20, 30, 45, 60]);
  });

  it("gets today in Madrid rather than relying on the server local timezone", () => {
    expect(getMadridDate(new Date("2026-08-10T22:30:00.000Z"))).toBe("2026-08-11");
  });

  it("selects fifteen unique public originals in deterministic round-robin domain order", () => {
    const selected = selectBalancedOriginalDiagnosticQuestions(eligibleOriginals);
    const repeated = selectBalancedOriginalDiagnosticQuestions(eligibleOriginals);
    const counts = Object.fromEntries(diagnosticDomains.map((domain) => [
      domain,
      selected.filter((question) => question.domain === domain).length,
    ]));

    expect(selected).toHaveLength(15);
    expect(selected.map((question) => question.id)).toEqual(repeated.map((question) => question.id));
    expect(selected.map((question) => question.domain).slice(0, 8)).toEqual([
      "general-knowledge", "psychometric", "english-a2", "telecom",
      "general-knowledge", "psychometric", "english-a2", "telecom",
    ]);
    expect(new Set(selected.map((question) => question.id)).size).toBe(15);
    expect(counts).toEqual({ "general-knowledge": 4, psychometric: 4, "english-a2": 4, telecom: 3 });
    expect(selected.every((question) => question.origin === "original")).toBe(true);
  });

  it("deduplicates ids, ignores invalid public DTOs and returns the available unique originals when fewer than fifteen exist", () => {
    const available = diagnosticDomains.flatMap((domain) => eligibleOriginals.filter((question) => question.domain === domain).slice(0, 2));
    const duplicate = { ...available[0]!, answer: "A" } as unknown as OriginalPracticeQuestionDto;
    const wrongDomain = { ...available[0]!, id: "invalid-domain", domain: "official" } as unknown as OriginalPracticeQuestionDto;
    const selected = selectBalancedOriginalDiagnosticQuestions([
      ...available,
      available[0]!,
      duplicate,
      wrongDomain,
    ]);

    expect(selected).toHaveLength(8);
    expect(new Set(selected.map((question) => question.id)).size).toBe(8);
    expect(selected.some((question) => question.id === "invalid-domain")).toBe(false);
    expect(selected.some((question) => question.id === available[0]!.id && "answer" in question)).toBe(false);
  });
});
