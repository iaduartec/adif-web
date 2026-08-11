import { beforeEach, describe, expect, it, vi } from "vitest";

const { createServerClient, rpc } = vi.hoisted(() => ({
  createServerClient: vi.fn(),
  rpc: vi.fn(),
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
    rpc.mockReset().mockResolvedValue({
      data: { attempt_id: "attempt-1", is_correct: true },
      error: null,
    });
    createServerClient.mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "server-user" } } }) },
      rpc,
    });
  });

  it("accepts only public answer input and delegates one atomic idempotent write", async () => {
    const response = await POST(attemptRequest({
      questionId: "ADIF-2025-1131-Q01",
      selectedAnswer: "A",
      elapsedMs: 420,
      clientEventId: "018f4c5e-7c2a-7d61-a85e-969efdde4dd5",
    }));

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toMatchObject({
      attemptId: "attempt-1",
      isCorrect: true,
      correctAnswer: "A",
    });
    expect(rpc).toHaveBeenCalledWith("record_practice_attempt", {
      p_question_id: "ADIF-2025-1131-Q01",
      p_selected_answer: "A",
      p_elapsed_ms: 420,
      p_client_event_id: "018f4c5e-7c2a-7d61-a85e-969efdde4dd5",
    });
  });

  it("rejects tampered client-owned score and identity fields before writing", async () => {
    const response = await POST(attemptRequest({
      questionId: "ADIF-2025-1131-Q01",
      selectedAnswer: "A",
      elapsedMs: 0,
      clientEventId: "018f4c5e-7c2a-7d61-a85e-969efdde4dd5",
      isCorrect: false,
      score: 999,
      userId: "attacker",
    }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ error: expect.stringMatching(/inválida/i) });
    expect(rpc).not.toHaveBeenCalled();
  });

  it("does not reveal an answer or write an attempt without an authenticated user", async () => {
    createServerClient.mockResolvedValueOnce({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
      from: vi.fn(),
    });

    const response = await POST(attemptRequest({
      questionId: "ADIF-2025-1131-Q01",
      selectedAnswer: "A",
      elapsedMs: 0,
      clientEventId: "018f4c5e-7c2a-7d61-a85e-969efdde4dd5",
    }));

    expect(response.status).toBe(401);
    expect(rpc).not.toHaveBeenCalled();
  });

  it("keeps retired question IDs inert even when a user has historical attempts", async () => {
    const response = await POST(attemptRequest({
      questionId: "Q0001",
      selectedAnswer: "A",
      elapsedMs: 0,
      clientEventId: "018f4c5e-7c2a-7d61-a85e-969efdde4dd5",
    }));

    expect(response.status).toBe(404);
    expect(rpc).not.toHaveBeenCalled();
  });

  it("returns the first atomic result when an idempotency key is retried", async () => {
    const body = {
      questionId: "ADIF-2025-1131-Q01",
      selectedAnswer: "A",
      elapsedMs: 420,
      clientEventId: "018f4c5e-7c2a-7d61-a85e-969efdde4dd5",
    };

    const first = await POST(attemptRequest(body));
    const retry = await POST(attemptRequest(body));

    await expect(first.json()).resolves.toMatchObject({ attemptId: "attempt-1", isCorrect: true });
    await expect(retry.json()).resolves.toMatchObject({ attemptId: "attempt-1", isCorrect: true });
    expect(rpc).toHaveBeenCalledTimes(2);
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
