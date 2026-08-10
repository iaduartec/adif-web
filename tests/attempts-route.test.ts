import { beforeEach, describe, expect, it, vi } from "vitest";

const { createServerClient, insert, select, single } = vi.hoisted(() => ({
  createServerClient: vi.fn(),
  insert: vi.fn(),
  select: vi.fn(),
  single: vi.fn(),
}));

vi.mock("../lib/supabase/server", () => ({ createServerClient }));

import { POST } from "../app/api/attempts/route";
import { getOfficialExam, listOfficialExams, listOfficialQuestions } from "../lib/content/repository";

function attemptRequest(body: unknown) {
  return new Request("http://localhost/api/attempts", {
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
}

describe("POST /api/attempts", () => {
  beforeEach(() => {
    insert.mockReset();
    select.mockReset();
    single.mockReset();
    single.mockResolvedValue({ data: { id: "attempt-1" }, error: null });
    select.mockReturnValue({ single });
    insert.mockReturnValue({ select });
    createServerClient.mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "server-user" } } }) },
      from: vi.fn(() => ({ insert })),
    });
  });

  it("derives correctness and owner from server-side data", async () => {
    const response = await POST(attemptRequest({
      questionId: "ADIF-2025-1131-Q01",
      answer: "A",
      mode: "practice",
      elapsedMs: 420,
    }));

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toMatchObject({
      attemptId: "attempt-1",
      isCorrect: true,
      correctAnswer: "A",
    });
    expect(insert).toHaveBeenCalledWith({
      user_id: "server-user",
      question_id: "ADIF-2025-1131-Q01",
      selected_answer: "A",
      is_correct: true,
      mode: "practice",
      elapsed_ms: 420,
    });
  });

  it("rejects tampered client-owned score and identity fields before writing", async () => {
    const response = await POST(attemptRequest({
      questionId: "ADIF-2025-1131-Q01",
      answer: "A",
      mode: "practice",
      elapsedMs: 0,
      isCorrect: false,
      score: 999,
      userId: "attacker",
    }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ error: expect.stringMatching(/inválida/i) });
    expect(insert).not.toHaveBeenCalled();
  });

  it("does not reveal an answer or write an attempt without an authenticated user", async () => {
    createServerClient.mockResolvedValueOnce({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
      from: vi.fn(),
    });

    const response = await POST(attemptRequest({ questionId: "ADIF-2025-1131-Q01", answer: "A", mode: "practice", elapsedMs: 0 }));

    expect(response.status).toBe(401);
    expect(insert).not.toHaveBeenCalled();
  });

  it("keeps retired question IDs inert even when a user has historical attempts", async () => {
    const response = await POST(attemptRequest({ questionId: "Q0001", answer: "A", mode: "practice", elapsedMs: 0 }));

    expect(response.status).toBe(404);
    expect(insert).not.toHaveBeenCalled();
  });
});

describe("official content repository", () => {
  it("combines official year, model, section, text, and ID filters", () => {
    const questions = listOfficialQuestions({
      year: 2025,
      examCode: "1131",
      section: "specific",
      query: "cordones",
      ids: ["ADIF-2025-1131-Q01", "ADIF-2025-4104-Q01"],
    });

    expect(questions.map((question) => question.id)).toEqual(["ADIF-2025-1131-Q01"]);
  });

  it("publishes official models only when their referenced questions are active", () => {
    expect(getOfficialExam("ADIF-2025-1131")?.questionIds).toHaveLength(18);
    expect(listOfficialExams()).toHaveLength(6);
  });
});
