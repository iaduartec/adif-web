import { cleanup, fireEvent, render, screen, waitFor, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { submitSimulation } = vi.hoisted(() => ({ submitSimulation: vi.fn() }));

vi.mock("../app/actions/simulations", () => ({ submitSimulation }));

import { SimulationRunner } from "../components/practice/simulation-runner";
import { SimulationResults } from "../components/practice/simulation-results";
import type { LegacyPracticeQuestion } from "../lib/content/repository";

const questions: LegacyPracticeQuestion[] = Array.from({ length: 3 }, (_, i) => ({
  id: `Q${String(i + 1).padStart(4, "0")}`,
  module: "G1 Igualdad",
  prompt: `Pregunta ${i + 1}`,
  options: [
    { key: "A" as const, text: "Opción A" },
    { key: "B" as const, text: "Opción B" },
    { key: "C" as const, text: "Opción C" },
    { key: "D" as const, text: "Opción D" },
  ],
  explanation: `Explicación ${i + 1}`,
  sourceNote: "Fuente original.",
  origin: "original_explanation" as const,
}));

describe("SimulationRunner", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    submitSimulation.mockReset();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("renders the countdown timer and question navigator", () => {
    render(
      <SimulationRunner
        simulationId="SIM-01"
        questions={questions}
        durationMinutes={90}
        onFinish={() => {}}
      />,
    );

    expect(screen.getByText(/90:00/)).toBeVisible();
    expect(screen.getByText("Pregunta 1 de 3")).toBeVisible();
    expect(screen.getAllByRole("radio")).toHaveLength(4);
  });

  it("records the answer and navigates to the next question", () => {
    render(
      <SimulationRunner
        simulationId="SIM-01"
        questions={questions}
        durationMinutes={90}
        onFinish={() => {}}
      />,
    );

    fireEvent.click(screen.getByRole("radio", { name: /A\. Opción A/i }));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/i }));

    expect(screen.getByText("Pregunta 2 de 3")).toBeVisible();
  });

  it("submits answers on manual delivery and calls onFinish with results", async () => {
    const mockResult = {
      attemptId: "att-1",
      correct: 2,
      incorrect: 1,
      omitted: 0,
      score: 1.67,
      elapsedMs: 5000,
      corrections: [
        { questionId: "Q0001", selectedAnswer: "A", correctAnswer: "D", isCorrect: false },
        { questionId: "Q0002", selectedAnswer: "B", correctAnswer: "B", isCorrect: true },
        { questionId: "Q0003", selectedAnswer: "C", correctAnswer: "C", isCorrect: true },
      ],
    };
    submitSimulation.mockResolvedValue(mockResult);

    const onFinish = vi.fn();
    render(
      <SimulationRunner
        simulationId="SIM-01"
        questions={questions}
        durationMinutes={90}
        onFinish={onFinish}
      />,
    );

    // Answer all 3 questions
    fireEvent.click(screen.getByRole("radio", { name: /A\. Opción A/i }));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/i }));

    fireEvent.click(screen.getByRole("radio", { name: /B\. Opción B/i }));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/i }));

    fireEvent.click(screen.getByRole("radio", { name: /C\. Opción C/i }));

    // Click deliver
    fireEvent.click(screen.getByRole("button", { name: /Entregar simulacro/i }));

    // Confirm delivery
    fireEvent.click(screen.getByRole("button", { name: /Confirmar entrega/i }));

    await waitFor(() => {
      expect(submitSimulation).toHaveBeenCalledWith(
        "SIM-01",
        { Q0001: "A", Q0002: "B", Q0003: "C" },
        expect.any(Number),
      );
    });

    await waitFor(() => {
      expect(onFinish).toHaveBeenCalledWith(mockResult);
    });
  });

  it("auto-delivers when timer reaches zero", async () => {
    const mockResult = {
      attemptId: "att-2",
      correct: 0,
      incorrect: 0,
      omitted: 3,
      score: 0,
      elapsedMs: 5400000,
      corrections: [],
    };
    submitSimulation.mockResolvedValue(mockResult);

    const onFinish = vi.fn();
    render(
      <SimulationRunner
        simulationId="SIM-01"
        questions={questions}
        durationMinutes={90}
        onFinish={onFinish}
      />,
    );

    // Advance 90 minutes
    act(() => {
      vi.advanceTimersByTime(90 * 60 * 1000 + 1000);
    });

    await waitFor(() => {
      expect(submitSimulation).toHaveBeenCalled();
    });
  });
});

describe("SimulationResults", () => {
  afterEach(cleanup);

  it("renders the score summary and individual corrections", () => {
    render(
      <SimulationResults
        result={{
          attemptId: "att-1",
          correct: 45,
          incorrect: 10,
          omitted: 5,
          score: 41.67,
          elapsedMs: 4500000,
          corrections: [
            { questionId: "Q0001", selectedAnswer: "A", correctAnswer: "D", isCorrect: false },
          ],
        }}
        questions={questions}
      />,
    );

    expect(screen.getByText(/45/)).toBeVisible();
    expect(screen.getByText(/41\.67/)).toBeVisible();
    expect(screen.getByText(/Q0001/)).toBeVisible();
  });
});
