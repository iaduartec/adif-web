import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { createServerClient, redirect } = vi.hoisted(() => ({
  createServerClient: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("next/navigation", () => ({ redirect }));
vi.mock("../lib/supabase/server", () => ({ createServerClient }));

import OnboardingPage from "../app/onboarding/page";

describe("OnboardingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads an existing preparation profile for editing without redirecting a completed user", async () => {
    createServerClient.mockResolvedValue({
      auth: { getUser: vi.fn(async () => ({ data: { user: { id: "user-1" } } })) },
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn(async () => ({ data: {
          weekly_target_minutes: 300,
          preferred_days: [2, 5],
          session_minutes: 60,
          exam_date: "2026-12-01",
          onboarding_completed_at: "2026-08-01T10:00:00.000Z",
        } })),
      })),
    });

    render(await OnboardingPage({ searchParams: Promise.resolve({ next: "/curso" }) }));

    expect(screen.getByRole("heading", { name: "Ajusta tu preparación" })).toBeVisible();
    expect(screen.getByRole("spinbutton", { name: "Objetivo semanal (minutos)" })).toHaveValue(300);
    expect(screen.getByRole("checkbox", { name: "Martes" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "60 minutos" })).toBeChecked();
    expect(redirect).not.toHaveBeenCalled();
  });
});
