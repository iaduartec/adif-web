import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { OriginalPracticeSession } from "../components/practice/original-practice-session";
import { listOriginalPracticeQuestions } from "../lib/content/original-practice-repository";
import { toPublicPracticeQuestion } from "../lib/content/original-practice-public-dto";

const questions = listOriginalPracticeQuestions({ domain: "psychometric", status: "reviewed" })
  .map(toPublicPracticeQuestion).filter((question) => question !== null)
  .filter((question, index, all) => all.findIndex((candidate) => candidate.topicId === question.topicId) === index)
  .slice(0, 2);

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("OriginalPracticeSession", () => {
  it("holds practice answers locally and reveals no feedback until the whole block is stored", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, status: 201, json: async () => ({ isCorrect: true, correctAnswer: "A", explanation: "Primera explicación." }) })
      .mockResolvedValueOnce({ ok: false, status: 503, json: async () => ({ error: "Error temporal", retryable: true }) })
      .mockResolvedValueOnce({ ok: true, status: 201, json: async () => ({ isCorrect: false, correctAnswer: "B", explanation: "Segunda explicación." }) });
    vi.stubGlobal("fetch", fetchMock);

    render(<OriginalPracticeSession questions={questions} />);
    fireEvent.click(screen.getByRole("radio", { name: /Práctica/ }));
    fireEvent.click(screen.getByRole("button", { name: "Comenzar bloque" }));
    fireEvent.click(screen.getByRole("radio", { name: /^A\./i }));
    fireEvent.click(screen.getByRole("button", { name: "Siguiente pregunta" }));
    fireEvent.click(screen.getByRole("radio", { name: /^B\./i }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.queryByText(/respuesta correcta/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Anterior" }));
    fireEvent.click(screen.getByRole("radio", { name: /^C\./i }));
    fireEvent.click(screen.getByRole("button", { name: "Siguiente pregunta" }));
    fireEvent.click(screen.getByRole("button", { name: "Entregar práctica y corregir" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Error temporal");
    expect(screen.queryByText(/Primera explicación|Segunda explicación|respuesta correcta/i)).not.toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const sent = fetchMock.mock.calls.map((call) => JSON.parse(call[1]?.body as string));
    expect(sent[0]).toMatchObject({ questionId: questions[0]!.id, selectedAnswer: "C", mode: "practice", clientEventId: expect.any(String) });
    expect(sent[1]).toMatchObject({ questionId: questions[1]!.id, selectedAnswer: "B", mode: "practice", clientEventId: expect.any(String) });

    fireEvent.click(screen.getByRole("button", { name: "Anterior" }));
    expect(screen.getByRole("radio", { name: /^A\./i })).toBeDisabled();
    expect(screen.getByRole("radio", { name: /^C\./i })).toBeChecked();
    fireEvent.click(screen.getByRole("button", { name: "Siguiente pregunta" }));

    fireEvent.click(screen.getByRole("button", { name: "Reintentar y entregar práctica" }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));
    expect(fetchMock.mock.calls[2][1]?.body).toBe(fetchMock.mock.calls[1][1]?.body);
    expect(await screen.findByText("Primera explicación.")).toBeVisible();
    expect(screen.getByText("Segunda explicación.")).toBeVisible();
    expect(screen.getByText(/Incorrecta\. Respuesta correcta: B\./)).toBeVisible();
  });

  it("checks each training answer immediately and reuses the same request after an uncertain failure", async () => {
    const fetchMock = vi.fn()
      .mockRejectedValueOnce(new Error("Sin conexión"))
      .mockResolvedValueOnce({ ok: true, status: 201, json: async () => ({ isCorrect: true, correctAnswer: "A" }) });
    vi.stubGlobal("fetch", fetchMock);

    render(<OriginalPracticeSession questions={questions} />);
    fireEvent.click(screen.getByRole("button", { name: "Comenzar bloque" }));
    fireEvent.click(screen.getByRole("radio", { name: /^A\./i }));
    fireEvent.click(screen.getByRole("button", { name: "Comprobar respuesta" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Sin conexión");
    expect(screen.getByRole("radio", { name: /^B\./i })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Reintentar respuesta" }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(fetchMock.mock.calls[1][1]?.body).toBe(fetchMock.mock.calls[0][1]?.body);
    expect(await screen.findByText("Respuesta correcta.")).toBeVisible();
    expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toMatchObject({
      questionId: questions[0]!.id,
      selectedAnswer: "A",
      mode: "practice",
      elapsedMs: expect.any(Number),
      clientEventId: expect.stringMatching(/^[0-9a-f-]{36}$/i),
    });
  });

  it("lets the learner choose a topic and a bounded question count before starting", () => {
    render(<OriginalPracticeSession questions={questions} />);
    fireEvent.change(screen.getByRole("combobox", { name: "Tema" }), { target: { value: questions[1]!.topicId } });
    fireEvent.change(screen.getByRole("spinbutton", { name: "Cantidad de preguntas" }), { target: { value: "1" } });
    fireEvent.click(screen.getByRole("radio", { name: /Práctica/ }));
    fireEvent.click(screen.getByRole("button", { name: "Comenzar bloque" }));

    expect(screen.getByText(`Pregunta 1 de 1 · ${questions[1]!.topic}`)).toBeVisible();
    expect(screen.getByText(questions[1]!.prompt)).toBeVisible();
  });
});
