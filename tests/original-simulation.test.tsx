import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { submitOriginalSimulation } = vi.hoisted(() => ({ submitOriginalSimulation: vi.fn() }));
vi.mock("../app/actions/original-simulations", () => ({ submitOriginalSimulation }));

import { OriginalPracticeSession } from "../components/practice/original-practice-session";
import type { OriginalSimulationOutcome } from "../app/actions/original-simulations";
import { listOriginalPracticeQuestions } from "../lib/content/original-practice-repository";
import { toPublicPracticeQuestion } from "../lib/content/original-practice-public-dto";

const sourceQuestions = listOriginalPracticeQuestions({ domain: "psychometric", status: "reviewed" }).slice(0, 3);
const questions = sourceQuestions.map(toPublicPracticeQuestion).filter((question) => question !== null);
const testRecoveryScope = "000000000000000000000000";

afterEach(() => {
  cleanup();
  for (const domain of ["telecom", "general-knowledge", "english-a2", "psychometric"]) {
    window.sessionStorage.removeItem(`adif360:original-simulation:v2:${domain}:000000000000000000000000`);
  }
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("original full-bank simulation", () => {
  it("allows blanks and answer changes, hides corrections until delivery, and reviews every question", async () => {
    submitOriginalSimulation.mockImplementation(async (input: unknown) => {
      const submission = input as { questionIds: string[]; answers: Record<string, "A" | "B" | "C" | "D"> };
      return {
        ok: true,
        corrections: submission.questionIds.map((questionId, index) => {
          const source = sourceQuestions.find((candidate) => candidate.id === questionId)!;
          const selectedAnswer = submission.answers[questionId] ?? null;
          return {
            questionId,
            selectedAnswer,
            correctAnswer: source.answer,
            isCorrect: selectedAnswer === source.answer,
            explanation: `Explicación ${index + 1}`,
          };
        }),
      };
    });

  render(<OriginalPracticeSession examMode questions={questions} recoveryScope={testRecoveryScope} title="Simulacro psicotécnico" />);
    expect(screen.getByText(/3 preguntas originales revisadas disponibles/)).toBeVisible();
    expect(screen.getByText(/no representa una duración oficial/i)).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Iniciar simulacro original" }));
    expect(screen.getByRole("navigation", { name: "Navegación del simulacro" })).toBeVisible();
    expect(screen.queryByText(/Explicación 1/)).not.toBeInTheDocument();

    const firstPrompt = screen.getByRole("heading", { level: 3 }).textContent;
    const firstSource = sourceQuestions.find((candidate) => candidate.prompt === firstPrompt)!;
    const firstWrongKey = firstSource.answer === "A" ? "B" : "A";
    fireEvent.click(screen.getByRole("radio", { name: new RegExp(`^${firstWrongKey}\\.`, "i") }));
    fireEvent.click(screen.getByRole("button", { name: "Pregunta 2, en blanco" }));
    const secondPrompt = screen.getByRole("heading", { level: 3 }).textContent;
    const secondSource = sourceQuestions.find((candidate) => candidate.prompt === secondPrompt)!;
    const secondWrongKey = secondSource.answer === "A" ? "B" : "A";
    fireEvent.click(screen.getByRole("radio", { name: new RegExp(`^${secondWrongKey}\\.`, "i") }));
    fireEvent.click(screen.getByRole("button", { name: "Pregunta 1, respondida" }));
    fireEvent.click(screen.getByRole("radio", { name: new RegExp(`^${firstSource.answer}\\.`, "i") }));
    fireEvent.click(screen.getByRole("button", { name: "Entregar simulacro" }));

    await waitFor(() => expect(submitOriginalSimulation).toHaveBeenCalledTimes(1));
    const submission = submitOriginalSimulation.mock.calls[0]![0] as {
      questionIds: string[];
      answers: Record<string, string>;
      elapsedMsByQuestion: Record<string, number>;
      clientEventIds: Record<string, string>;
    };
    expect(submission.questionIds).toHaveLength(3);
    expect(new Set(submission.questionIds).size).toBe(3);
    expect(submission.answers).toEqual({
      [firstSource.id]: firstSource.answer,
      [secondSource.id]: secondWrongKey,
    });
    expect(Object.keys(submission.elapsedMsByQuestion)).toEqual(submission.questionIds);
    expect(Object.values(submission.elapsedMsByQuestion).every((elapsedMs) => Number.isInteger(elapsedMs) && elapsedMs >= 0)).toBe(true);
    expect(submission.clientEventIds[firstSource.id]).toMatch(/^[0-9a-f-]{36}$/i);
    expect(await screen.findByRole("heading", { name: "Resultados del simulacro original" })).toBeVisible();
    expect(screen.getByRole("region", { name: "Corrección del bloque" })).toHaveTextContent(/1 acierto.*1 error.*1 blanco de 3/);
    expect(screen.getByText("Resultado orientativo: 33% de aciertos sobre las preguntas presentadas; no es una nota oficial.")).toBeVisible();
    expect(screen.getByText(/Resultado por materia/)).toBeVisible();
    expect(screen.getAllByText(/Tu respuesta: En blanco/)).toHaveLength(1);
    expect(screen.getAllByText(/Explicación/)).toHaveLength(3);
  });

  it("submits the full bank automatically when the learner-selected timer expires", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    submitOriginalSimulation.mockResolvedValue({
      ok: true,
      corrections: questions.map((question) => ({
        questionId: question.id, selectedAnswer: null, correctAnswer: "B", isCorrect: false, explanation: "Explicación.",
      })),
    });
    render(<OriginalPracticeSession examMode questions={questions} recoveryScope={testRecoveryScope} />);
    fireEvent.change(screen.getByLabelText("Tiempo límite orientativo en minutos (opcional)"), { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: "Iniciar simulacro original" }));
    await act(async () => {
      vi.advanceTimersByTime(60_000);
      await Promise.resolve();
    });
    await waitFor(() => expect(submitOriginalSimulation).toHaveBeenCalledTimes(1));
    expect(submitOriginalSimulation).toHaveBeenCalledWith(expect.objectContaining({ answers: {} }));
    expect(await screen.findByRole("heading", { name: "Resultados del simulacro original" })).toBeVisible();
  });

  it("caps a manually entered orientative duration at 600 minutes", () => {
    render(<OriginalPracticeSession examMode questions={questions} recoveryScope={testRecoveryScope} />);
    fireEvent.change(screen.getByLabelText("Tiempo límite orientativo en minutos (opcional)"), { target: { value: "601" } });
    fireEvent.click(screen.getByRole("button", { name: "Iniciar simulacro original" }));

    expect(screen.getByText("Tiempo restante: 600:00")).toBeVisible();
  });

  it("catches up the countdown after a suspended tab resumes", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    submitOriginalSimulation.mockResolvedValue({
      ok: true,
      corrections: questions.map((question) => ({
        questionId: question.id, selectedAnswer: null, correctAnswer: "B", isCorrect: false, explanation: "Explicación.",
      })),
    });
    render(<OriginalPracticeSession examMode questions={questions} recoveryScope={testRecoveryScope} />);
    fireEvent.change(screen.getByLabelText("Tiempo límite orientativo en minutos (opcional)"), { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: "Iniciar simulacro original" }));
    await act(async () => { vi.advanceTimersByTime(10_000); });
    expect(screen.getByText("Tiempo restante: 0:50")).toBeVisible();

    await act(async () => {
      vi.setSystemTime(Date.now() + 60_000);
      document.dispatchEvent(new Event("visibilitychange"));
      await Promise.resolve();
    });

    await waitFor(() => expect(submitOriginalSimulation).toHaveBeenCalledTimes(1));
    expect(await screen.findByRole("heading", { name: "Resultados del simulacro original" })).toBeVisible();
  });

  it("accepts only one voluntary delivery from a rapid double click", async () => {
    submitOriginalSimulation.mockResolvedValue({
      ok: true,
      corrections: questions.map((question) => ({
        questionId: question.id, selectedAnswer: null, correctAnswer: "B", isCorrect: false, explanation: "Explicación.",
      })),
    });
    render(<OriginalPracticeSession examMode questions={questions} recoveryScope={testRecoveryScope} />);
    fireEvent.click(screen.getByRole("button", { name: "Iniciar simulacro original" }));
    const deliver = screen.getByRole("button", { name: "Entregar simulacro" });
    await act(async () => {
      fireEvent.click(deliver);
      fireEvent.click(deliver);
    });

    expect(submitOriginalSimulation).toHaveBeenCalledTimes(1);
    expect(await screen.findByRole("heading", { name: "Resultados del simulacro original" })).toBeVisible();
  });

  it("keeps one delivery when manual submission and timer expiry coincide", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    let resolveSubmission: ((value: OriginalSimulationOutcome) => void) | undefined;
    submitOriginalSimulation.mockImplementation(() => new Promise((resolve) => { resolveSubmission = resolve; }));
    render(<OriginalPracticeSession examMode questions={questions} recoveryScope={testRecoveryScope} />);
    fireEvent.change(screen.getByLabelText("Tiempo límite orientativo en minutos (opcional)"), { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: "Iniciar simulacro original" }));
    const deliver = screen.getByRole("button", { name: "Entregar simulacro" });

    await act(async () => {
      fireEvent.click(deliver);
      vi.setSystemTime(Date.now() + 60_000);
      document.dispatchEvent(new Event("visibilitychange"));
      await Promise.resolve();
    });

    expect(submitOriginalSimulation).toHaveBeenCalledTimes(1);
    resolveSubmission?.({
      ok: true,
      corrections: questions.map((question, index) => ({
        questionId: question.id, selectedAnswer: null, correctAnswer: sourceQuestions[index]!.answer, isCorrect: false, explanation: "Explicación.",
      })),
    });
    expect(await screen.findByRole("heading", { name: "Resultados del simulacro original" })).toBeVisible();
    expect(submitOriginalSimulation).toHaveBeenCalledTimes(1);
  });

  it("does not automatically replay an interrupted delivery after recovery", async () => {
    let resolveFirst: ((value: OriginalSimulationOutcome) => void) | undefined;
    submitOriginalSimulation.mockImplementationOnce(() => new Promise((resolve) => { resolveFirst = resolve; }));
    const firstRender = render(<OriginalPracticeSession examMode questions={questions} recoveryScope={testRecoveryScope} />);
    fireEvent.click(screen.getByRole("button", { name: "Iniciar simulacro original" }));
    fireEvent.click(screen.getAllByRole("radio")[1]!);
    fireEvent.click(screen.getByRole("button", { name: "Entregar simulacro" }));
    await waitFor(() => expect(submitOriginalSimulation).toHaveBeenCalledTimes(1));

    const originalPayload = submitOriginalSimulation.mock.calls[0]![0];
    const stored = window.sessionStorage.getItem("adif360:original-simulation:v2:psychometric:000000000000000000000000")!;
    expect(stored).toContain('"deliveryState":"submitting"');
    expect(stored).not.toMatch(/correctAnswer|explanation/i);
    firstRender.unmount();

    const submission = originalPayload as { questionIds: string[]; answers: Record<string, "A" | "B" | "C" | "D"> };
    submitOriginalSimulation.mockResolvedValueOnce({
      ok: true,
      corrections: submission.questionIds.map((questionId) => {
        const selectedAnswer = submission.answers[questionId] ?? null;
        const correctAnswer = sourceQuestions.find((question) => question.id === questionId)!.answer;
        return {
          questionId,
          selectedAnswer,
          correctAnswer,
          isCorrect: selectedAnswer === correctAnswer,
          explanation: "Explicación recuperada.",
        };
      }),
    });
    render(<OriginalPracticeSession examMode questions={questions} recoveryScope={testRecoveryScope} />);

    expect(await screen.findByText(/No sabemos si la entrega se completó/)).toBeVisible();
    expect(submitOriginalSimulation).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Reintentar el mismo envío" }));
    expect(await screen.findByRole("heading", { name: "Resultados del simulacro original" })).toBeVisible();
    expect(submitOriginalSimulation).toHaveBeenCalledTimes(2);
    expect(submitOriginalSimulation.mock.calls[1]![0]).toEqual(originalPayload);
  });

  it("offers a safe exit for a confirmed submission conflict", async () => {
    submitOriginalSimulation.mockResolvedValueOnce({ ok: false, retryable: false, kind: "conflict", error: "conflicto" });
    render(<OriginalPracticeSession examMode questions={questions} recoveryScope={testRecoveryScope} />);
    fireEvent.click(screen.getByRole("button", { name: "Iniciar simulacro original" }));
    fireEvent.click(screen.getByRole("button", { name: "Entregar simulacro" }));
    expect(await screen.findByText(/puede haberse entregado desde otra pestaña/i)).toBeVisible();
    expect(screen.getByRole("link", { name: "Volver a simulacros" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Iniciar un nuevo intento" })).toBeVisible();
    expect(screen.queryByRole("button", { name: "Entregar simulacro" })).not.toBeInTheDocument();
  });

  it("keeps an unknown submission frozen without resending it after a network failure", async () => {
    submitOriginalSimulation.mockRejectedValueOnce(new Error("network response lost"));
    const view = render(<OriginalPracticeSession examMode questions={questions} recoveryScope={testRecoveryScope} />);
    fireEvent.click(screen.getByRole("button", { name: "Iniciar simulacro original" }));
    fireEvent.click(screen.getAllByRole("radio")[0]!);
    fireEvent.click(screen.getByRole("button", { name: "Entregar simulacro" }));
    expect(await screen.findByText(/No sabemos si la entrega se completó/)).toBeVisible();
    const payload = submitOriginalSimulation.mock.calls[0]![0];
    expect(submitOriginalSimulation).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Reintentar el mismo envío" })).toBeVisible();
    view.unmount();
    render(<OriginalPracticeSession examMode questions={questions} recoveryScope={testRecoveryScope} />);
    expect(await screen.findByText(/No sabemos si la entrega se completó/)).toBeVisible();
    expect(submitOriginalSimulation).toHaveBeenCalledTimes(1);
    expect(submitOriginalSimulation.mock.calls[0]![0]).toEqual(payload);
  });

  it("offers an exit when the server never confirms the delivery", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    submitOriginalSimulation.mockImplementationOnce(() => new Promise(() => {}));
    render(<OriginalPracticeSession examMode questions={questions} recoveryScope={testRecoveryScope} />);
    fireEvent.click(screen.getByRole("button", { name: "Iniciar simulacro original" }));
    fireEvent.click(screen.getByRole("button", { name: "Entregar simulacro" }));
    await act(async () => { vi.advanceTimersByTime(30_000); await Promise.resolve(); });
    expect(await screen.findByText(/No sabemos si la entrega se completó/)).toBeVisible();
    expect(screen.getByRole("link", { name: "Volver a simulacros" })).toBeVisible();
    expect(submitOriginalSimulation).toHaveBeenCalledTimes(1);
  });
});
