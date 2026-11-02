import { beforeEach, describe, expect, it, vi } from "vitest";

const { createServerClient, rpc } = vi.hoisted(() => ({
  createServerClient: vi.fn(),
  rpc: vi.fn(),
}));

vi.mock("../lib/supabase/server", () => ({ createServerClient }));

import { POST } from "../app/api/attempts/route";
import { listOriginalPracticeQuestions } from "../lib/content/original-practice-repository";
import { createMockSupabaseClient } from "../lib/supabase/mock-client";
import { getMockStore } from "../lib/supabase/mock-store";

function request(questionId: string, selectedAnswer = "A", clientEventId = "018f4c5e-7c2a-7d61-a85e-969efdde4dd5", mode?: "practice" | "simulation") {
  return new Request("http://localhost/api/attempts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionId, selectedAnswer, elapsedMs: 420, clientEventId, ...(mode ? { mode } : {}) }),
  });
}

describe("POST /api/attempts with original practice", () => {
  const original = listOriginalPracticeQuestions({ status: "reviewed" })[0]!;

  beforeEach(() => {
    rpc.mockReset().mockResolvedValue({ data: { attempt_id: "attempt-original", is_correct: false }, error: null });
    createServerClient.mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "server-user" } } }) },
      rpc,
    });
  });

  it("resolves reviewed originals, grades via the RPC, and reveals feedback only after persistence", async () => {
    const response = await POST(request(original.id, original.answer === "A" ? "B" : "A"));
    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toMatchObject({
      attemptId: "attempt-original",
      isCorrect: false,
      correctAnswer: original.answer,
      explanation: original.explanation,
    });
    expect(rpc).toHaveBeenCalledWith("record_practice_attempt", expect.objectContaining({ p_question_id: original.id }));
  });

  it("reveals a validated primary citation only with post-attempt feedback", async () => {
    const grounded = listOriginalPracticeQuestions({ domain: "general-knowledge", status: "reviewed" })[0]!;
    const response = await POST(request(grounded.id, grounded.answer));
    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toMatchObject({
      explanation: grounded.explanation,
      answerGrounding: {
        sourceId: grounded.sourceId,
        sourceVersion: grounded.sourceVersion,
        locator: grounded.sourceLocator,
      },
    });
  });

  it("returns the same trusted feedback on an idempotent retry", async () => {
    const body = { questionId: original.id, selectedAnswer: original.answer, elapsedMs: 420, clientEventId: "018f4c5e-7c2a-7d61-a85e-969efdde4dd5" };
    const first = await POST(new Request("http://localhost/api/attempts", { method: "POST", body: JSON.stringify(body) }));
    const retry = await POST(new Request("http://localhost/api/attempts", { method: "POST", body: JSON.stringify(body) }));
    await expect(first.json()).resolves.toMatchObject({ correctAnswer: original.answer, explanation: original.explanation });
    await expect(retry.json()).resolves.toMatchObject({ correctAnswer: original.answer, explanation: original.explanation });
    expect(rpc).toHaveBeenCalledTimes(2);
  });

  it.each(["orig-unknown-999", ...listOriginalPracticeQuestions({ status: "draft" }).slice(0, 1).map((q) => q.id)])(
    "rejects unknown or draft IDs without writing (%s)", async (id) => {
      const response = await POST(request(id));
      expect(response.status).toBe(404);
      await expect(response.json()).resolves.toMatchObject({ retryable: false });
      expect(rpc).not.toHaveBeenCalled();
    },
  );

  it("does not expose original keys, explanations or citations when unauthenticated", async () => {
    createServerClient.mockResolvedValueOnce({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
      rpc,
    });
    const response = await POST(request(original.id));
    expect(response.status).toBe(401);
    expect(rpc).not.toHaveBeenCalled();
    const body = await response.text();
    expect(body).not.toContain(original.explanation);
    expect(body).not.toContain('"correctAnswer"');
  });

  it("rejects a changed retry payload as an idempotency conflict", async () => {
    rpc.mockResolvedValueOnce({ data: null, error: { code: "23514", message: "Idempotency key was already used with a different payload." } });
    const response = await POST(request(original.id, original.answer === "A" ? "B" : "A"));
    expect(response.status).toBe(409);
  });

  it("rejects simulation mode for original questions before persistence", async () => {
    const response = await POST(request(original.id, original.answer, undefined, "simulation"));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ retryable: false });
    expect(rpc).not.toHaveBeenCalled();
  });
});

describe("private original-key mock registry", () => {
  beforeEach(() => getMockStore().reset());

  it("grades reviewed items from private fixture keys and keeps them out of Data API selects", async () => {
    const question = listOriginalPracticeQuestions({ status: "reviewed" })[0]!;
    const client = createMockSupabaseClient();
    const result = await client.rpc("record_practice_attempt", {
      p_question_id: question.id,
      p_selected_answer: question.answer,
      p_elapsed_ms: 60,
      p_client_event_id: "018f4c5e-7c2a-7d61-a85e-969efdde4dd5",
      p_mode: "practice",
    });

    expect(result).toMatchObject({ data: { is_correct: true }, error: null });
    expect(getMockStore().questionAttempts).toHaveLength(1);
    expect(getMockStore().learningQuestions.get(question.id)?.correct_answer).toBe(question.answer);
    const selected = await client.from("learning_questions").select("*");
    expect(selected.data).toEqual([]);
  });

  it("mirrors the database rejection for original simulation mode on direct RPC calls", async () => {
    const question = listOriginalPracticeQuestions({ status: "reviewed" })[0]!;
    const client = createMockSupabaseClient();
    const result = await client.rpc("record_practice_attempt", {
      p_question_id: question.id,
      p_selected_answer: question.answer,
      p_elapsed_ms: 60,
      p_client_event_id: "018f4c5e-7c2a-7d61-a85e-969efdde4dd5",
      p_mode: "simulation",
    });
    expect(result).toMatchObject({ data: null, error: { code: "23514" } });
    expect(getMockStore().questionAttempts).toHaveLength(0);
  });
});
