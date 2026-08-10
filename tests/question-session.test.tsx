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
  });

  it("persists the selected answer before showing the official answer key and provenance", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ isCorrect: false, correctAnswer: "A" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<QuestionSession questions={questions} />);

    fireEvent.click(screen.getByRole("radio", { name: /D\./i }));
    fireEvent.click(screen.getByRole("button", { name: "Comprobar respuesta" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/attempts", expect.objectContaining({ method: "POST" }));
    });
    const requestBody = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(requestBody).toEqual({
      questionId: "ADIF-2025-1131-Q01",
      answer: "D",
      mode: "practice",
      elapsedMs: expect.any(Number),
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
});
