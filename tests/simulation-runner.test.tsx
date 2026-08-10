import { cleanup, fireEvent, render, screen, waitFor, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { submitSimulation } = vi.hoisted(() => ({ submitSimulation: vi.fn() }));

vi.mock("../app/actions/simulations", () => ({ submitSimulation }));

import { SimulationRunner } from "../components/practice/simulation-runner";
import { SimulationResults } from "../components/practice/simulation-results";
import { OfficialSource } from "../components/practice/official-source";
import { SimulationPageClient } from "../app/(dashboard)/simulacros/[id]/client";
import type { OfficialQuestion } from "../lib/content/schema";

type ExamQuestion = Omit<OfficialQuestion, "answer">;

const source = {
  kind: "official_adif_exam" as const,
  year: 2024,
  call: "PNI24/01",
  profileCode: "24/05PO",
  profileName: "Oficial de Telecomunicaciones de Entrada",
  examCode: "3403",
  questionNumber: 1,
  section: "specific" as const,
  isReserve: false,
  documentUrl: "https://www.adif.es/documents/examen-3403.pdf",
  bookletPage: 187,
  answerKeyPage: 19,
  verifiedAt: "2026-08-10",
  fingerprint: "sha256:115f6c60c9433982fffc9172f695afba38a969a92124f97ad8d707b2f7fcf7d0",
};

const questions: ExamQuestion[] = Array.from({ length: 3 }, (_, i) => ({
  id: `ADIF-2024-3403-Q${String(i + 1).padStart(2, "0")}`,
  sectionLabel: "Parte específica",
  prompt: `Pregunta oficial ${i + 1}`,
  options: [
    { key: "A" as const, text: "Opción A" },
    { key: "B" as const, text: "Opción B" },
    { key: "C" as const, text: "Opción C" },
    { key: "D" as const, text: "Opción D" },
  ],
  origin: "official_reference" as const,
  source: { ...source, questionNumber: i + 1 },
}));

const exam = {
  id: "ADIF-2024-3403",
  title: "Examen oficial ADIF 2024 3403",
  source,
  durationMinutes: 15,
  questionIds: questions.map((question) => question.id),
  completeness: "specific_part" as const,
  scoring: { correct: 1, incorrect: -1 / 3, omitted: 0 },
};

describe("SimulationRunner", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    submitSimulation.mockReset();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("uses the documented duration of the official exam", () => {
    render(
      <SimulationRunner
        examId={exam.id}
        questions={questions}
        durationMinutes={exam.durationMinutes}
        onFinish={() => {}}
      />,
    );

    expect(screen.getByText(/15:00/)).toBeVisible();
    expect(screen.getByText("Pregunta 1 de 3")).toBeVisible();
    expect(screen.getAllByRole("radio")).toHaveLength(4);
  });

  it("records the answer and navigates to the next question", () => {
    render(
      <SimulationRunner
        examId={exam.id}
        questions={questions}
        durationMinutes={exam.durationMinutes}
        onFinish={() => {}}
      />,
    );

    fireEvent.click(screen.getByRole("radio", { name: /A\. Opción A/i }));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/i }));

    expect(screen.getByText("Pregunta 2 de 3")).toBeVisible();
  });

  it("submits answers when delivering an exam", async () => {
    const mockResult = {
      attemptId: "att-1",
      correct: 2,
      incorrect: 1,
      omitted: 0,
      score: 1.67,
      elapsedMs: 5000,
      corrections: [
        { questionId: questions[0].id, selectedAnswer: "A", correctAnswer: "D", isCorrect: false },
        { questionId: questions[1].id, selectedAnswer: "B", correctAnswer: "B", isCorrect: true },
        { questionId: questions[2].id, selectedAnswer: "C", correctAnswer: "C", isCorrect: true },
      ],
    };
    submitSimulation.mockResolvedValue(mockResult);

    const onFinish = vi.fn();
    render(
      <SimulationRunner
        examId={exam.id}
        questions={questions}
        durationMinutes={exam.durationMinutes}
        onFinish={onFinish}
      />,
    );

    fireEvent.click(screen.getByRole("radio", { name: /A\. Opción A/i }));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/i }));
    fireEvent.click(screen.getByRole("radio", { name: /B\. Opción B/i }));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/i }));
    fireEvent.click(screen.getByRole("radio", { name: /C\. Opción C/i }));

    fireEvent.click(screen.getByRole("button", { name: /Entregar examen/i }));
    fireEvent.click(screen.getByRole("button", { name: /Confirmar entrega/i }));

    await waitFor(() => {
      expect(submitSimulation).toHaveBeenCalledWith(
        exam.id,
        {
          [questions[0].id]: "A",
          [questions[1].id]: "B",
          [questions[2].id]: "C",
        },
        expect.any(Number),
      );
    });

    await waitFor(() => {
      expect(onFinish).toHaveBeenCalledWith(mockResult);
    });
  });

  it("auto-delivers when the official time limit expires", async () => {
    submitSimulation.mockResolvedValue({
      attemptId: "att-2",
      correct: 0,
      incorrect: 0,
      omitted: 3,
      score: 0,
      elapsedMs: 900000,
      corrections: [],
    });

    render(
      <SimulationRunner
        examId={exam.id}
        questions={questions}
        durationMinutes={exam.durationMinutes}
        onFinish={() => {}}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(15 * 60 * 1000 + 1000);
    });

    await waitFor(() => {
      expect(submitSimulation).toHaveBeenCalled();
    });
  });
});

describe("SimulationPageClient", () => {
  afterEach(cleanup);

  it("shows the documented historical-model header before starting", () => {
    render(<SimulationPageClient exam={exam} questions={questions} />);

    expect(screen.getByRole("heading", { name: "Examen oficial ADIF 2024 3403" })).toBeVisible();
    expect(screen.getByText(/2024 · PNI24\/01 · 24\/05PO · modelo 3403 · Parte específica/i)).toBeVisible();
    expect(screen.getByText(/3 preguntas · 15 minutos/i)).toBeVisible();
    expect(screen.getByText("Documento oficial ADIF")).toBeVisible();
    expect(screen.queryByText(/pregunta 1/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Ver en el documento oficial/i })).toHaveAttribute("href", source.documentUrl);
  });

  it("passes the documented exam duration to the runner", () => {
    render(<SimulationPageClient exam={exam} questions={questions} />);

    fireEvent.click(screen.getByRole("button", { name: /Comenzar examen/i }));

    expect(screen.getByRole("timer")).toHaveTextContent("15:00");
  });
});

describe("OfficialSource", () => {
  afterEach(cleanup);

  it("keeps the question label and number for question sessions", () => {
    render(<OfficialSource source={source} />);

    expect(screen.getByText("Pregunta oficial ADIF")).toBeVisible();
    expect(screen.getByText(/pregunta 1/i)).toBeVisible();
  });
});

describe("SimulationResults", () => {
  afterEach(cleanup);

  it("shows the raw net score and the official source without an invented explanation", () => {
    render(
      <SimulationResults
        result={{
          attemptId: "att-1",
          correct: 0,
          incorrect: 3,
          omitted: 0,
          score: -1,
          elapsedMs: 300000,
          corrections: [
            { questionId: questions[0].id, selectedAnswer: "A", correctAnswer: "D", isCorrect: false },
          ],
        }}
        questions={questions}
      />,
    );

    expect(screen.getByText("-1")).toBeVisible();
    expect(screen.getByText(/puntuación neta de esta parte disponible/i)).toBeVisible();
    expect(screen.getByRole("link", { name: /Ver en el documento oficial/i })).toHaveAttribute("href", source.documentUrl);
    expect(screen.queryByText(/Explicación/)).not.toBeInTheDocument();
  });
});
