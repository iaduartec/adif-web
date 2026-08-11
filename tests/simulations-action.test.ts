import { beforeEach, describe, expect, it, vi } from "vitest";

const { getOfficialExam, getOfficialQuestion, createServerClient } = vi.hoisted(() => ({
  getOfficialExam: vi.fn(),
  getOfficialQuestion: vi.fn(),
  createServerClient: vi.fn(),
}));

vi.mock("../lib/content/repository", () => ({ getOfficialExam, getOfficialQuestion }));
vi.mock("../lib/supabase/server", () => ({ createServerClient }));

import { submitSimulation } from "../app/actions/simulations";

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

const exam = {
  id: "ADIF-2024-3403",
  title: "Examen oficial ADIF 2024 3403",
  source,
  questionIds: ["ADIF-2024-3403-Q01", "ADIF-2024-3403-Q02"],
  durationMinutes: 15,
  completeness: "specific_part" as const,
  scoring: { correct: 1, incorrect: -1 / 3, omitted: 0 },
};

const questionById = new Map([
  [
    "ADIF-2024-3403-Q01",
    {
      id: "ADIF-2024-3403-Q01",
      sectionLabel: "Parte específica",
      prompt: "Primera pregunta oficial",
      options: ["A", "B", "C", "D"].map((key) => ({ key, text: `Opción ${key}` })),
      answer: "A",
      origin: "official_reference" as const,
      source,
    },
  ],
  [
    "ADIF-2024-3403-Q02",
    {
      id: "ADIF-2024-3403-Q02",
      sectionLabel: "Parte específica",
      prompt: "Segunda pregunta oficial",
      options: ["A", "B", "C", "D"].map((key) => ({ key, text: `Opción ${key}` })),
      answer: "B",
      origin: "official_reference" as const,
      source: { ...source, questionNumber: 2 },
    },
  ],
]);

function createSupabaseDouble() {
  const insertedAttempts: unknown[] = [];
  const insertedAnswers: unknown[] = [];
  const from = vi.fn((table: string) => ({
    insert: (payload: unknown) => {
      if (table === "simulation_attempts") {
        insertedAttempts.push(payload);
        return {
          select: () => ({
            single: async () => ({ data: { id: "attempt-1" }, error: null }),
          }),
        };
      }

      insertedAnswers.push(payload);
      return Promise.resolve({ error: null });
    },
  }));
  const rpc = vi.fn(async (_name: string, args: { p_answers: Array<{ question_id: string; selected_answer: string | null }> }) => {
    const persistedAnswers = args.p_answers.map((answer) => ({
      ...answer,
      is_correct: answer.question_id.endsWith("Q01")
        ? answer.selected_answer === "A"
        : answer.selected_answer === "B",
    }));
    const correctCount = persistedAnswers.filter((answer) => answer.is_correct).length;
    const omittedCount = persistedAnswers.filter((answer) => answer.selected_answer === null).length;
    const incorrectCount = persistedAnswers.length - correctCount - omittedCount;
    return {
      data: {
        attempt_id: "attempt-1",
        correct_count: correctCount,
        incorrect_count: incorrectCount,
        omitted_count: omittedCount,
        score: Math.round((correctCount - incorrectCount / 3) * 100) / 100,
        elapsed_ms: 1200,
        answers: persistedAnswers,
      },
      error: null,
    };
  });

  return {
    client: {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      from,
      rpc,
    },
    from,
    rpc,
    insertedAttempts,
    insertedAnswers,
  };
}

describe("submitSimulation", () => {
  beforeEach(() => {
    getOfficialExam.mockReset().mockReturnValue(exam);
    getOfficialQuestion.mockReset().mockImplementation((id: string) => questionById.get(id));
    createServerClient.mockReset();
  });

  it("scores only the official model questions and preserves a negative net score", async () => {
    const supabase = createSupabaseDouble();
    createServerClient.mockResolvedValue(supabase.client);

    const result = await submitSimulation(
      exam.id,
      {
        "ADIF-2024-3403-Q01": "D",
        "ADIF-2024-3403-Q02": "D",
      },
      1200,
      "018f4c5e-7c2a-7d61-a85e-969efdde4dd5",
    );

    expect(result).toMatchObject({ correct: 0, incorrect: 2, omitted: 0, score: -0.67 });
    expect(supabase.rpc).toHaveBeenCalledWith("submit_simulation_attempt", {
      p_simulation_id: exam.id,
      p_elapsed_ms: 1200,
      p_client_event_id: "018f4c5e-7c2a-7d61-a85e-969efdde4dd5",
      p_answers: [
        { question_id: "ADIF-2024-3403-Q01", selected_answer: "D" },
        { question_id: "ADIF-2024-3403-Q02", selected_answer: "D" },
      ],
    });
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it("rejects an answer keyed to another official model", async () => {
    const supabase = createSupabaseDouble();
    createServerClient.mockResolvedValue(supabase.client);

    await expect(
      submitSimulation(
        exam.id,
        {
          "ADIF-2024-3403-Q01": "A",
          "ADIF-2023-1433-Q01": "B",
        },
        1200,
        "018f4c5e-7c2a-7d61-a85e-969efdde4dd5",
      ),
    ).rejects.toThrow(/no pertenece al examen oficial/i);

    expect(supabase.from).not.toHaveBeenCalled();
  });

  it.each(["E", "", "A "])("rejects the invalid answer value %j before persistence", async (answer) => {
    const supabase = createSupabaseDouble();
    createServerClient.mockResolvedValue(supabase.client);

    await expect(submitSimulation(
      exam.id,
      { "ADIF-2024-3403-Q01": answer },
      1200,
      "018f4c5e-7c2a-7d61-a85e-969efdde4dd5",
    )).rejects.toThrow(/respuesta.*inválida/i);

    expect(supabase.rpc).not.toHaveBeenCalled();
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, 86_400_001])(
    "rejects the invalid or out-of-bounds duration %s before persistence",
    async (elapsedMs) => {
      const supabase = createSupabaseDouble();
      createServerClient.mockResolvedValue(supabase.client);

      await expect(submitSimulation(
        exam.id,
        {},
        elapsedMs,
        "018f4c5e-7c2a-7d61-a85e-969efdde4dd5",
      )).rejects.toThrow(/Tiempo transcurrido inválido/i);

      expect(supabase.rpc).not.toHaveBeenCalled();
      expect(supabase.from).not.toHaveBeenCalled();
    },
  );

  it("rejects a malformed idempotency key before persistence", async () => {
    const supabase = createSupabaseDouble();
    createServerClient.mockResolvedValue(supabase.client);

    await expect(submitSimulation(exam.id, {}, 1200, "not-a-uuid")).rejects.toThrow(/identificador/i);
    expect(supabase.rpc).not.toHaveBeenCalled();
  });

  it("returns the canonical persisted simulation result instead of recomputing a retry payload", async () => {
    const supabase = createSupabaseDouble();
    supabase.rpc.mockResolvedValueOnce({
      data: {
        attempt_id: "persisted-attempt",
        correct_count: 1,
        incorrect_count: 1,
        omitted_count: 0,
        score: 0.67,
        elapsed_ms: 900,
        answers: [
          { question_id: "ADIF-2024-3403-Q01", selected_answer: "A", is_correct: true },
          { question_id: "ADIF-2024-3403-Q02", selected_answer: "D", is_correct: false },
        ],
      },
      error: null,
    });
    createServerClient.mockResolvedValue(supabase.client);

    const result = await submitSimulation(
      exam.id,
      { "ADIF-2024-3403-Q01": "D", "ADIF-2024-3403-Q02": "D" },
      1200,
      "018f4c5e-7c2a-7d61-a85e-969efdde4dd5",
    );

    expect(result).toMatchObject({
      attemptId: "persisted-attempt",
      correct: 1,
      incorrect: 1,
      omitted: 0,
      score: 0.67,
      elapsedMs: 900,
      corrections: [
        expect.objectContaining({ questionId: "ADIF-2024-3403-Q01", selectedAnswer: "A", isCorrect: true }),
        expect.objectContaining({ questionId: "ADIF-2024-3403-Q02", selectedAnswer: "D", isCorrect: false }),
      ],
    });
  });
});
