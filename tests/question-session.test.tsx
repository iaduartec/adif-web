import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { QuestionSession, type PracticeQuestion } from "../components/practice/question-session";

const questions: PracticeQuestion[] = [
  {
    id: "Q0001",
    module: "G1 Igualdad",
    prompt: "¿Qué medida protege a varias personas?",
    options: [
      { key: "A", text: "Respuesta incorrecta" },
      { key: "B", text: "Otra respuesta" },
      { key: "C", text: "Otra opción" },
      { key: "D", text: "Respuesta correcta" },
    ],
    explanation: "La medida colectiva protege simultáneamente a varias personas.",
    sourceNote: "Explicación didáctica original.",
    origin: "original_explanation",
  },
  {
    id: "Q0002",
    module: "G2 PRL",
    prompt: "¿Cuál es la segunda pregunta?",
    options: [
      { key: "A", text: "Primera" },
      { key: "B", text: "Segunda" },
      { key: "C", text: "Tercera" },
      { key: "D", text: "Cuarta" },
    ],
    explanation: "Explicación de la segunda pregunta.",
    sourceNote: "Explicación didáctica original.",
    origin: "original_explanation",
  },
];

describe("QuestionSession", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("persists the selected answer before showing correction and then advances to the next question", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ isCorrect: false, correctAnswer: "D" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<QuestionSession questions={questions} />);

    fireEvent.click(screen.getByRole("radio", { name: /A\. Respuesta incorrecta/i }));
    fireEvent.click(screen.getByRole("button", { name: "Comprobar respuesta" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/attempts", expect.objectContaining({ method: "POST" }));
    });
    const requestBody = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(requestBody).toEqual({
      questionId: "Q0001",
      answer: "A",
      mode: "practice",
      elapsedMs: expect.any(Number),
    });
    expect(await screen.findByRole("status")).toHaveTextContent("Respuesta incorrecta. Respuesta correcta: D.");
    expect(screen.getByText("La medida colectiva protege simultáneamente a varias personas.")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Siguiente pregunta" }));

    expect(screen.getByRole("heading", { name: "¿Cuál es la segunda pregunta?" })).toBeVisible();
    expect(screen.getByText("Pregunta 2 de 2")).toBeVisible();
  });
});
