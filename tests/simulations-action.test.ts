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

  return {
    client: {
      auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
      from,
    },
    from,
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
    );

    expect(result).toMatchObject({ correct: 0, incorrect: 2, omitted: 0, score: -0.67 });
    expect(supabase.insertedAttempts).toEqual([
      expect.objectContaining({ simulation_id: exam.id, score: -0.67 }),
    ]);
    expect(supabase.insertedAnswers).toEqual([
      [
        expect.objectContaining({ question_id: "ADIF-2024-3403-Q01" }),
        expect.objectContaining({ question_id: "ADIF-2024-3403-Q02" }),
      ],
    ]);
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
      ),
    ).rejects.toThrow(/no pertenece al examen oficial/i);

    expect(supabase.from).not.toHaveBeenCalled();
  });
});
