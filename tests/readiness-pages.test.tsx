import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { DailyPlanInput } from "../lib/adaptive/daily-plan";
import type { ReadinessInput } from "../lib/adaptive/readiness";

const { assembleDailyPlanInput, assembleReadinessInput, createServerClient, redirect, ReadinessUnavailableError } = vi.hoisted(() => ({
  assembleDailyPlanInput: vi.fn(),
  assembleReadinessInput: vi.fn(),
  createServerClient: vi.fn(),
  redirect: vi.fn(),
  ReadinessUnavailableError: class ReadinessUnavailableError extends Error {},
}));

vi.mock("next/navigation", () => ({ redirect }));
vi.mock("../lib/supabase/server", () => ({ createServerClient }));
vi.mock("../lib/adaptive/daily-plan-server", () => ({ assembleDailyPlanInput }));
vi.mock("../lib/adaptive/readiness-server", () => ({ assembleReadinessInput, ReadinessUnavailableError }));

import DashboardPage from "../app/(dashboard)/page";
import EstadisticasPage from "../app/(dashboard)/estadisticas/page";

const readinessInput: ReadinessInput = {
  now: new Date("2026-08-11T10:00:00.000Z"),
  concepts: [{ id: "concept-a", title: "Concepto A", lessonId: "igualdad", lessonTitle: "Igualdad" }],
  questions: [{ id: "ADIF-2025-1131-Q01", conceptIds: ["concept-a"] }],
  mastery: [{ conceptId: "concept-a", status: "at_risk", dueOn: "2026-08-10", lastReviewedAt: "2026-08-01T09:00:00Z" }],
  questionAttempts: [{
    questionId: "ADIF-2025-1131-Q01",
    isCorrect: false,
    elapsedMs: 91_000,
    mode: "practice",
    createdAt: "2026-08-11T09:00:00Z",
  }],
  reviewEvents: [{ conceptId: "concept-a", sourceKind: "recall", rating: 1, occurredAt: "2026-08-10T09:00:00Z" }],
  simulations: [{ id: "ADIF-2025-1131", title: "Modelo 1131", durationMinutes: 120, questionIds: ["ADIF-2025-1131-Q01"] }],
  simulationAttempts: [],
  simulationAnswers: [],
  lessonActivity: [{ lessonId: "igualdad", occurredAt: "2026-08-09T09:00:00Z" }],
};

const dailyPlanInput: DailyPlanInput = {
  date: "2026-08-11",
  availableMinutes: 30,
  reviews: [{ conceptId: "concept-a", title: "Concepto A", dueOn: "2026-08-10", status: "at_risk" }],
  lessons: [{ lessonId: "igualdad", title: "Igualdad", remainingMinutes: 10 }],
  practiceQuestions: [],
  simulations: [],
  uniqueAttemptedQuestionIds: [],
  reviewedConceptIds: [],
  simulationAttempts: [],
  postponedTaskKeysYesterday: [],
  actions: [],
};

describe("readiness routes", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-08-11T10:00:00.000Z"));
    assembleDailyPlanInput.mockReset().mockResolvedValue(dailyPlanInput);
    assembleReadinessInput.mockReset().mockResolvedValue(readinessInput);
    createServerClient.mockReset().mockResolvedValue({
      auth: {
        getUser: vi.fn(async () => ({
          data: { user: { id: "user-1", user_metadata: { full_name: "Ana López" } }, error: null },
        })),
      },
      from: vi.fn(() => {
        const result = Promise.resolve({ data: { weekly_target_minutes: 120 }, error: null });
        const query = {
          select: vi.fn(),
          eq: vi.fn(),
          maybeSingle: vi.fn(() => result),
          then: result.then.bind(result),
        };
        query.select.mockReturnValue(query);
        query.eq.mockReturnValue(query);
        return query;
      }),
    });
  });

  it("builds the authenticated home from the readiness and daily-plan server inputs", async () => {
    render(await DashboardPage());

    expect(assembleReadinessInput).toHaveBeenCalledWith(expect.anything(), "user-1", expect.any(Date));
    expect(assembleDailyPlanInput).toHaveBeenCalledWith("2026-08-11", expect.objectContaining({
      userId: "user-1",
      readinessInput: expect.any(Promise),
    }));
    expect(screen.getByRole("heading", { name: "Estado de preparación" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Sesión de hoy" })).toBeVisible();
    expect(screen.getByText("Racha actual")).toBeVisible();
    expect(screen.getAllByRole("link", { name: "Revisar Concepto A" })[0]).toHaveAttribute(
      "href",
      "/repasos?concepts=concept-a",
    );
  });

  it("keeps statistics and adds readiness metrics by lesson and concept", async () => {
    render(await EstadisticasPage());

    expect(assembleReadinessInput).toHaveBeenCalledWith(expect.anything(), "user-1", expect.any(Date));
    expect(screen.getByRole("heading", { name: "Estadísticas de estudio" })).toBeVisible();
    expect(screen.getByRole("table", { name: "Rendimiento por lección" })).toBeVisible();
    expect(screen.getByRole("table", { name: "Rendimiento por concepto" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Precisión por sección oficial" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Cobertura por año y modelo oficial" })).toBeVisible();
  });

  it.each([
    ["home", async () => DashboardPage(), "/"],
    ["statistics", async () => EstadisticasPage(), "/estadisticas"],
  ] as const)("renders scoped, safe, retryable recovery on the %s route", async (_name, renderPage, retryHref) => {
    assembleReadinessInput.mockRejectedValueOnce(
      new ReadinessUnavailableError("database relation and policy details"),
    );

    render(await renderPage());

    expect(screen.getByRole("alert")).toHaveTextContent(/indicadores no disponibles/i);
    expect(screen.getByRole("link", { name: "Reintentar" })).toHaveAttribute("href", retryHref);
    expect(screen.getByRole("link", { name: "Temario activo" })).toHaveAttribute("href", "/curso");
    expect(screen.getByRole("link", { name: "Preguntas oficiales" })).toHaveAttribute("href", "/tests");
    expect(screen.queryByText(/database relation|policy details/i)).not.toBeInTheDocument();
  });
});
