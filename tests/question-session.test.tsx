import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { QuestionSession, type PracticeQuestion } from "../components/practice/question-session";
import { listOfficialQuestions } from "../lib/content/repository";

const officialQuestion = listOfficialQuestions({ ids: ["ADIF-2025-1131-Q01"] })[0]!;
const { answer: _answer, ...practiceQuestion } = officialQuestion;
const questions: PracticeQuestion[] = [practiceQuestion];

describe("QuestionSession", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("persists the selected answer before showing the official answer key and provenance", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ isCorrect: false, correctAnswer: "A" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<QuestionSession questions={questions} />);

    expect(screen.getByRole("heading", { level: 2, name: officialQuestion.prompt })).toBeVisible();
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("radio", { name: /D\./i }));
    fireEvent.click(screen.getByRole("button", { name: "Comprobar respuesta" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/attempts", expect.objectContaining({ method: "POST" }));
    });
    const requestBody = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(requestBody).toEqual({
      questionId: "ADIF-2025-1131-Q01",
      selectedAnswer: "D",
      mode: "practice",
      elapsedMs: expect.any(Number),
      clientEventId: expect.stringMatching(/^[0-9a-f-]{36}$/i),
    });
    expect(await screen.findByText("Respuesta incorrecta. Respuesta correcta: A.")).toBeVisible();
    expect(screen.getByText("Pregunta oficial ADIF")).toBeVisible();
    expect(screen.getByText("2025 · PNI25/01 · 25/10PO · modelo 1131 · pregunta 1")).toBeVisible();
    expect(screen.getByRole("link", { name: "Ver en el documento oficial" })).toHaveAttribute(
      "href",
      officialQuestion.source.documentUrl,
    );
    expect(screen.queryByText(/explicación/i)).not.toBeInTheDocument();
  });

  it("resends the exact first request body after an uncertain failure", async () => {
    const now = vi.spyOn(Date, "now").mockReturnValue(1_000);
    const fetchMock = vi.fn()
      .mockRejectedValueOnce(new Error("Sin conexión"))
      .mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ isCorrect: true, correctAnswer: "A" }),
      });
    vi.stubGlobal("fetch", fetchMock);

    render(<QuestionSession questions={questions} />);
    fireEvent.click(screen.getByRole("radio", { name: /^A\./i }));
    fireEvent.click(screen.getByRole("button", { name: "Comprobar respuesta" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Sin conexión");
    const firstBody = fetchMock.mock.calls[0][1]?.body;
    expect(JSON.parse(firstBody as string)).toMatchObject({
      questionId: officialQuestion.id,
      selectedAnswer: "A",
      mode: "practice",
      elapsedMs: 0,
      clientEventId: expect.stringMatching(/^[0-9a-f-]{36}$/i),
    });
    expect(screen.getByRole("radio", { name: /^B\./i })).toBeDisabled();

    now.mockReturnValue(9_000);
    fireEvent.click(screen.getByRole("button", { name: "Reintentar respuesta" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(fetchMock.mock.calls[1][1]?.body).toBe(firstBody);
  });

  it("unfreezes the answer after a definitive validation response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: "Solicitud inválida" }),
    }));

    render(<QuestionSession questions={questions} />);
    fireEvent.click(screen.getByRole("radio", { name: /^A\./i }));
    fireEvent.click(screen.getByRole("button", { name: "Comprobar respuesta" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Solicitud inválida");
    expect(screen.getByRole("radio", { name: /^B\./i })).toBeEnabled();
    expect(screen.queryByRole("button", { name: "Reintentar respuesta" })).not.toBeInTheDocument();
  });

  it.each([408, 425, 429])("preserves the exact retry envelope for uncertain HTTP %s", async (status) => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: false,
        status,
        json: async () => ({ error: "Entrega incierta" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ isCorrect: true, correctAnswer: "A" }),
      });
    vi.stubGlobal("fetch", fetchMock);

    render(<QuestionSession questions={questions} />);
    fireEvent.click(screen.getByRole("radio", { name: /^A\./i }));
    fireEvent.click(screen.getByRole("button", { name: "Comprobar respuesta" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Entrega incierta");
    const firstBody = fetchMock.mock.calls[0][1]?.body;
    expect(screen.getByRole("radio", { name: /^B\./i })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Reintentar respuesta" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(fetchMock.mock.calls[1][1]?.body).toBe(firstBody);
  });

  it.each([
    [true, 400, true],
    [false, 503, false],
  ])("prefers server retryable=%s over fallback classification for HTTP %s", async (retryable, status, frozen) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      status,
      json: async () => ({ error: "Clasificación del servidor", retryable }),
    }));

    render(<QuestionSession questions={questions} />);
    fireEvent.click(screen.getByRole("radio", { name: /^A\./i }));
    fireEvent.click(screen.getByRole("button", { name: "Comprobar respuesta" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Clasificación del servidor");
    if (frozen) {
      expect(screen.getByRole("radio", { name: /^B\./i })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Reintentar respuesta" })).toBeInTheDocument();
    } else {
      expect(screen.getByRole("radio", { name: /^B\./i })).toBeEnabled();
      expect(screen.queryByRole("button", { name: "Reintentar respuesta" })).not.toBeInTheDocument();
    }
  });
});
