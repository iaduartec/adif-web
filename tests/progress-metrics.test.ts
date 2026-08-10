import { describe, expect, it } from "vitest";
import {
  calculateMetrics,
  recommendNextSession,
  type MetricQuestion,
} from "../lib/progress/metrics";

const mockQuestions: MetricQuestion[] = [
  { id: "Q0001", module: "G1 Igualdad" },
  { id: "Q0002", module: "G1 Igualdad" },
  { id: "Q0003", module: "G2 Prevención de Riesgos Laborales" },
  { id: "Q0004", module: "G2 Prevención de Riesgos Laborales" },
];

describe("calculateMetrics", () => {
  const refDate = new Date("2026-08-02T12:00:00Z");

  it("handles empty history correctly", () => {
    const metrics = calculateMetrics([], [], mockQuestions, refDate);

    expect(metrics.streak).toBe(0);
    expect(metrics.weakestModule).toBeNull();
    expect(metrics.accuracyByModule).toEqual({});
    expect(metrics.sevenDayActivity).toHaveLength(7);
    metrics.sevenDayActivity.forEach((day) => {
      expect(day.count).toBe(0);
    });
  });

  it("calculates accuracy by module and identifies the weakest module", () => {
    const attempts = [
      { question_id: "Q0001", is_correct: true, created_at: "2026-08-02T10:00:00Z" },
      { question_id: "Q0002", is_correct: false, created_at: "2026-08-02T10:05:00Z" }, // G1: 50%
      { question_id: "Q0003", is_correct: false, created_at: "2026-08-02T10:10:00Z" }, // G2: 0%
    ];

    const metrics = calculateMetrics(attempts, [], mockQuestions, refDate);

    expect(metrics.accuracyByModule["G1 Igualdad"]).toEqual({ correct: 1, total: 2, accuracy: 0.5 });
    expect(metrics.accuracyByModule["G2 Prevención de Riesgos Laborales"]).toEqual({ correct: 0, total: 1, accuracy: 0 });
    expect(metrics.weakestModule).toBe("G2 Prevención de Riesgos Laborales");
  });

  it("calculates streak correctly across consecutive days of activity", () => {
    const attempts = [
      { question_id: "Q0001", is_correct: true, created_at: "2026-08-02T10:00:00Z" }, // today
      { question_id: "Q0002", is_correct: true, created_at: "2026-08-01T10:00:00Z" }, // yesterday
      { question_id: "Q0003", is_correct: true, created_at: "2026-07-31T10:00:00Z" }, // day before
    ];

    const metrics = calculateMetrics(attempts, [], mockQuestions, refDate);
    expect(metrics.streak).toBe(3);
  });

  it("resets streak if there is a gap in consecutive days", () => {
    const attempts = [
      { question_id: "Q0001", is_correct: true, created_at: "2026-08-02T10:00:00Z" }, // today
      { question_id: "Q0002", is_correct: true, created_at: "2026-07-31T10:00:00Z" }, // gap on Aug 1st
    ];

    const metrics = calculateMetrics(attempts, [], mockQuestions, refDate);
    expect(metrics.streak).toBe(1); // Only today's activity is counted in the current active streak
  });

  it("computes 7-day activity correctly", () => {
    const attempts = [
      { question_id: "Q0001", is_correct: true, created_at: "2026-08-02T10:00:00Z" }, // today (3 attempts)
      { question_id: "Q0002", is_correct: true, created_at: "2026-08-02T10:05:00Z" },
      { question_id: "Q0003", is_correct: true, created_at: "2026-08-02T10:10:00Z" },
      { question_id: "Q0001", is_correct: true, created_at: "2026-08-01T10:00:00Z" }, // yesterday (1 attempt)
    ];

    const metrics = calculateMetrics(attempts, [], mockQuestions, refDate);

    expect(metrics.sevenDayActivity).toHaveLength(7);
    expect(metrics.sevenDayActivity[6].count).toBe(3); // Aug 2nd
    expect(metrics.sevenDayActivity[5].count).toBe(1); // Aug 1st
    expect(metrics.sevenDayActivity[4].count).toBe(0); // July 31st
  });
});

describe("recommendNextSession", () => {
  it("recommends finishing the first uncompleted lesson first", () => {
    const lessons = [
      { slug: "igualdad", title: "Igualdad", percent: 100, completed: true },
      { slug: "prevencion", title: "Prevención", percent: 40, completed: false },
    ];

    const rec = recommendNextSession(lessons, "G1 Igualdad");
    expect(rec.type).toBe("lesson");
    expect(rec.id).toBe("prevencion");
    expect(rec.href).toBe("/curso/prevencion");
  });

  it("recommends practicing the weakest module if all lessons are completed", () => {
    const lessons = [
      { slug: "igualdad", title: "Igualdad", percent: 100, completed: true },
    ];

    const rec = recommendNextSession(lessons, "G1 Igualdad");
    expect(rec.type).toBe("practice");
    expect(rec.id).toBe("G1 Igualdad");
    expect(rec.href).toBe("/tests?module=G1%20Igualdad&practice=true");
  });

  it("recommends the first simulation if everything is complete and there is no weakest module", () => {
    const rec = recommendNextSession([], null, [{ id: "SIM-07", title: "Simulacro 07" }]);
    expect(rec.type).toBe("simulation");
    expect(rec.id).toBe("SIM-07");
    expect(rec.href).toBe("/simulacros/SIM-07");
  });

  it("falls back to SIM-01 when there are no simulations provided", () => {
    const rec = recommendNextSession([], null);
    expect(rec.type).toBe("simulation");
    expect(rec.id).toBe("SIM-01");
    expect(rec.href).toBe("/simulacros/SIM-01");
  });
});
