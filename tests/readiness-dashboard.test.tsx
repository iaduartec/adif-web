import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AdaptiveDashboard } from "../components/dashboard/adaptive-dashboard";
import { ReadinessStatistics } from "../components/dashboard/readiness-statistics";
import { NAV_ITEMS } from "../components/shell/nav-items";
import { calculateReadiness } from "../lib/adaptive/readiness";
import type { DailyPlan } from "../lib/adaptive/daily-plan";

const snapshot = calculateReadiness({
  now: new Date("2026-08-11T10:00:00.000Z"),
  concepts: [
    { id: "concept-a", title: "Concepto A", lessonId: "lesson-a", lessonTitle: "Lección A" },
    { id: "concept-b", title: "Concepto B", lessonId: "lesson-b", lessonTitle: "Lección B" },
  ],
  questions: [
    { id: "question-a", conceptIds: ["concept-a"] },
    { id: "question-b", conceptIds: ["concept-b"] },
  ],
  mastery: [
    { conceptId: "concept-a", status: "at_risk", dueOn: "2026-08-10", lastReviewedAt: "2026-08-01T09:00:00Z" },
    { conceptId: "concept-b", status: "review", dueOn: "2026-08-20", lastReviewedAt: "2026-08-02T09:00:00Z" },
  ],
  questionAttempts: [
    { questionId: "question-a", isCorrect: false, elapsedMs: 91_000, mode: "practice", createdAt: "2026-08-11T09:00:00Z" },
    { questionId: "question-b", isCorrect: true, elapsedMs: 80_000, mode: "practice", createdAt: "2026-08-10T09:00:00Z" },
  ],
  reviewEvents: [
    { conceptId: "concept-a", sourceKind: "recall", rating: 1, occurredAt: "2026-08-09T09:00:00Z" },
  ],
  simulations: [{ id: "exam-a", title: "Examen oficial A", durationMinutes: 120, questionIds: ["question-a", "question-b"] }],
  simulationAttempts: [],
  simulationAnswers: [],
  lessonActivity: [],
});

const plan: DailyPlan = {
  date: "2026-08-11",
  availableMinutes: 30,
  initialBudgets: { review: 12, lesson: 10, practice: 8 },
  tasks: [
    {
      kind: "review",
      key: "review:concept-a",
      conceptId: "concept-a",
      title: "Concepto A",
      dueOn: "2026-08-10",
      status: "at_risk",
      estimatedMinutes: 3,
    },
    {
      kind: "lesson",
      key: "lesson:lesson-b",
      lessonId: "lesson-b",
      block: 0,
      title: "Lección B",
      estimatedMinutes: 10,
    },
  ],
  allocatedMinutes: 13,
  unusedMinutes: 17,
  evidenceSufficient: false,
};

describe("adaptive dashboard", () => {
  afterEach(cleanup);

  it("renders the seven required server sections in the approved order", () => {
    render(
      <AdaptiveDashboard
        elapsedMinutesThisWeek={45}
        nextSimulation={{ id: "exam-a", title: "Examen oficial A", durationMinutes: 120 }}
        plan={plan}
        snapshot={snapshot}
        userName="Ana"
        weeklyTargetMinutes={120}
      />,
    );

    expect(screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)).toEqual([
      "Estado de preparación",
      "Sesión de hoy",
      "Repasos vencidos",
      "Lecciones en riesgo",
      "Próximo simulacro",
      "Resumen semanal",
      "Recursos complementarios",
    ]);
  });

  it("states insufficient evidence plainly, exposes the first obstacle, and keeps useful empty/action states accessible", () => {
    const { container } = render(
      <AdaptiveDashboard
        elapsedMinutesThisWeek={45}
        nextSimulation={{ id: "exam-a", title: "Examen oficial A", durationMinutes: 120 }}
        plan={plan}
        snapshot={snapshot}
        userName="Ana"
        weeklyTargetMinutes={120}
      />,
    );

    expect(screen.getByText("Evidencia insuficiente")).toBeVisible();
    expect(screen.getByText(/Principal obstáculo: Evidencia/i)).toBeVisible();
    expect(container.textContent).not.toMatch(/probabilidad|garant[ií]a|asegura/i);
    expect(screen.getAllByRole("link", { name: "Revisar Concepto A" })[0]).toHaveAttribute("href", "/curso/lesson-a");
    expect(screen.getByRole("link", { name: "Continuar Lección B" })).toHaveAttribute("href", "/curso/lesson-b");
    expect(screen.getByRole("link", { name: "Abrir Examen oficial A" })).toHaveAttribute("href", "/simulacros/exam-a");
    expect(screen.getByText("Racha actual").nextElementSibling).toHaveTextContent("3 días");
  });
});

describe("readiness statistics", () => {
  afterEach(cleanup);

  it("exposes streak and true concept and lesson metrics in semantic tables", () => {
    render(<ReadinessStatistics snapshot={snapshot} />);

    expect(screen.getByText("Racha actual").nextElementSibling).toHaveTextContent("3 días");
    const conceptTable = screen.getByRole("table", { name: "Rendimiento por concepto" });
    expect(within(conceptTable).getByText("Concepto A")).toBeVisible();
    expect(within(conceptTable).getByText("Concepto B")).toBeVisible();
    const lessonTable = screen.getByRole("table", { name: "Rendimiento por lección" });
    expect(within(lessonTable).getByText("Lección A")).toBeVisible();
    expect(within(lessonTable).getByText("Lección B")).toBeVisible();
  });

  it("labels the root navigation destination as preparation", () => {
    expect(NAV_ITEMS[0]).toMatchObject({ href: "/", label: "Preparación" });
  });
});
