import { beforeEach, describe, expect, it, vi } from "vitest";
import { createHash } from "node:crypto";

const { createServerClient, rpc, getUser } = vi.hoisted(() => ({
  createServerClient: vi.fn(),
  rpc: vi.fn(),
  getUser: vi.fn(),
}));
vi.mock("../lib/supabase/server", () => ({ createServerClient }));

import { submitOriginalSimulation } from "../app/actions/original-simulations";
import { listOriginalPracticeQuestions } from "../lib/content/original-practice-repository";

const question = listOriginalPracticeQuestions({ domain: "psychometric", status: "reviewed" })[0]!;
const secondQuestion = listOriginalPracticeQuestions({ domain: "psychometric", status: "reviewed" })[1]!;
const accountScope = createHash("sha256").update("test-user").digest("hex").slice(0, 24);

describe("submitOriginalSimulation", () => {
  beforeEach(() => {
    rpc.mockReset().mockResolvedValue({ data: { attempt_id: "attempt-1", is_correct: false }, error: null });
    getUser.mockReset().mockResolvedValue({ data: { user: { id: "test-user" } } });
    createServerClient.mockReset().mockResolvedValue({ auth: { getUser }, rpc });
  });

  it("persists answered original items through the existing practice RPC and returns the full correction after delivery", async () => {
    const selectedAnswer = question.answer === "A" ? "B" : "A";
    const secondAnswer = secondQuestion.answer === "A" ? "B" : "A";
    const result = await submitOriginalSimulation({
      accountScope,
      questionIds: [question.id, secondQuestion.id],
      answers: { [question.id]: selectedAnswer, [secondQuestion.id]: secondAnswer },
      elapsedMsByQuestion: { [question.id]: 1200, [secondQuestion.id]: 3400 },
      clientEventIds: {
        [question.id]: "8d464b7d-9eb8-4fe8-8b2e-9f3f9c29a72f",
        [secondQuestion.id]: "fd249bb1-6308-4f46-8b2e-9f3f9c29a72f",
      },
    });

    expect(rpc).toHaveBeenNthCalledWith(1, "record_practice_attempt", {
      p_question_id: question.id,
      p_selected_answer: selectedAnswer,
      p_elapsed_ms: 1200,
      p_client_event_id: "8d464b7d-9eb8-4fe8-8b2e-9f3f9c29a72f",
      p_mode: "practice",
    });
    expect(rpc).toHaveBeenNthCalledWith(2, "record_practice_attempt", {
      p_question_id: secondQuestion.id,
      p_selected_answer: secondAnswer,
      p_elapsed_ms: 3400,
      p_client_event_id: "fd249bb1-6308-4f46-8b2e-9f3f9c29a72f",
      p_mode: "practice",
    });
    expect(result).toEqual({
      ok: true,
      corrections: [question, secondQuestion].map((item, index) => ({
        questionId: item.id,
        selectedAnswer: index === 0 ? selectedAnswer : secondAnswer,
        correctAnswer: item.answer,
        isCorrect: false,
        explanation: item.explanation,
      })),
    });
  });

  it("does not persist or reveal an answer when no user is authenticated", async () => {
    getUser.mockResolvedValueOnce({ data: { user: null } });
    const result = await submitOriginalSimulation({
      accountScope,
      questionIds: [question.id], answers: {}, elapsedMsByQuestion: {}, clientEventIds: {},
    });
    expect(result).toMatchObject({ ok: false, retryable: false });
    expect(rpc).not.toHaveBeenCalled();
  });

  it("fails closed if the RPC score disagrees with the locally reviewed answer key", async () => {
    rpc.mockResolvedValueOnce({ data: { attempt_id: "attempt-1", is_correct: false }, error: null });
    const result = await submitOriginalSimulation({
      accountScope,
      questionIds: [question.id],
      answers: { [question.id]: question.answer },
      elapsedMsByQuestion: { [question.id]: 1200 },
      clientEventIds: { [question.id]: "428d9aa2-23c5-4ce8-b072-9121f05d495d" },
    });

    expect(result).toMatchObject({ ok: false, retryable: true });
    expect(rpc).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["23514", "Idempotency key was already used with a different payload."],
    ["23514", "check constraint failed"],
    ["23514", "unrecognized database message"],
    ["08006", "connection lost"],
  ])("classifies RPC error %s (%s) as an unknown submission", async (code, message) => {
    rpc.mockResolvedValueOnce({ data: null, error: { code, message } });
    const result = await submitOriginalSimulation({
      accountScope,
      questionIds: [question.id], answers: { [question.id]: "A" },
      elapsedMsByQuestion: { [question.id]: 1200 },
      clientEventIds: { [question.id]: "428d9aa2-23c5-4ce8-b072-9121f05d495d" },
    });
    expect(result).toMatchObject({ ok: false, kind: "submission_unknown", retryable: true });
    expect(rpc).toHaveBeenCalledTimes(1);
  });

  it("reports a later RPC failure as unknown after an earlier answer may have been written", async () => {
    const submission = {
      accountScope,
      questionIds: [question.id, secondQuestion.id],
      answers: { [question.id]: "A" as const, [secondQuestion.id]: "B" as const },
      elapsedMsByQuestion: { [question.id]: 1200, [secondQuestion.id]: 3400 },
      clientEventIds: {
        [question.id]: "8d464b7d-9eb8-4fe8-8b2e-9f3f9c29a72f",
        [secondQuestion.id]: "fd249bb1-6308-4f46-8b2e-9f3f9c29a72f",
      },
    };
    rpc
      .mockResolvedValueOnce({ data: { attempt_id: "attempt-1", is_correct: question.answer === "A" }, error: null })
      .mockResolvedValueOnce({ data: null, error: { code: "08006", message: "connection lost" } });

    const result = await submitOriginalSimulation(submission);

    expect(result).toMatchObject({ ok: false, kind: "submission_unknown", retryable: true });
    expect(rpc).toHaveBeenCalledTimes(2);
    expect(rpc).toHaveBeenNthCalledWith(1, "record_practice_attempt", {
      p_question_id: question.id,
      p_selected_answer: "A",
      p_elapsed_ms: 1200,
      p_client_event_id: submission.clientEventIds[question.id],
      p_mode: "practice",
    });
    expect(rpc).toHaveBeenNthCalledWith(2, "record_practice_attempt", {
      p_question_id: secondQuestion.id,
      p_selected_answer: "B",
      p_elapsed_ms: 3400,
      p_client_event_id: submission.clientEventIds[secondQuestion.id],
      p_mode: "practice",
    });
  });

  it("stops retrying when a later RPC explicitly reports an inactive question", async () => {
    const submission = {
      accountScope,
      questionIds: [question.id, secondQuestion.id],
      answers: { [question.id]: "A" as const, [secondQuestion.id]: "B" as const },
      elapsedMsByQuestion: { [question.id]: 1200, [secondQuestion.id]: 3400 },
      clientEventIds: {
        [question.id]: "8d464b7d-9eb8-4fe8-8b2e-9f3f9c29a72f",
        [secondQuestion.id]: "fd249bb1-6308-4f46-8b2e-9f3f9c29a72f",
      },
    };
    rpc
      .mockResolvedValueOnce({ data: { attempt_id: "attempt-1", is_correct: question.answer === "A" }, error: null })
      .mockResolvedValueOnce({ data: null, error: { code: "P0002", message: "Question is not active." } });

    const result = await submitOriginalSimulation(submission);

    expect(result).toMatchObject({ ok: false, kind: "recoverable_error", retryable: false });
    expect(rpc).toHaveBeenCalledTimes(2);
  });

  it("retries a possibly partial delivery with the exact same event IDs and payloads", async () => {
    const submission = {
      accountScope,
      questionIds: [question.id, secondQuestion.id],
      answers: { [question.id]: "A" as const, [secondQuestion.id]: "B" as const },
      elapsedMsByQuestion: { [question.id]: 1200, [secondQuestion.id]: 3400 },
      clientEventIds: {
        [question.id]: "8d464b7d-9eb8-4fe8-8b2e-9f3f9c29a72f",
        [secondQuestion.id]: "fd249bb1-6308-4f46-8b2e-9f3f9c29a72f",
      },
    };
    rpc
      .mockResolvedValueOnce({ data: { attempt_id: "attempt-1", is_correct: question.answer === "A" }, error: null })
      .mockResolvedValueOnce({ data: null, error: { code: "08006", message: "connection lost" } })
      // The first response represents an idempotent replay of the possibly stored answer.
      .mockResolvedValueOnce({ data: { attempt_id: "attempt-1", is_correct: question.answer === "A" }, error: null })
      .mockResolvedValueOnce({ data: { attempt_id: "attempt-2", is_correct: secondQuestion.answer === "B" }, error: null });

    const firstResult = await submitOriginalSimulation(submission);
    const retryResult = await submitOriginalSimulation(submission);

    expect(firstResult).toMatchObject({ ok: false, kind: "submission_unknown", retryable: true });
    expect(retryResult).toMatchObject({ ok: true, corrections: [
      expect.objectContaining({ questionId: question.id, selectedAnswer: "A" }),
      expect.objectContaining({ questionId: secondQuestion.id, selectedAnswer: "B" }),
    ] });
    expect(rpc).toHaveBeenCalledTimes(4);
    expect(rpc.mock.calls[0]).toEqual(rpc.mock.calls[2]);
    expect(rpc.mock.calls[1]).toEqual(rpc.mock.calls[3]);
  });

  it("replays an identical completed submission with the same idempotency keys", async () => {
    const submission = {
      accountScope,
      questionIds: [question.id],
      answers: { [question.id]: "A" as const },
      elapsedMsByQuestion: { [question.id]: 1200 },
      clientEventIds: { [question.id]: "428d9aa2-23c5-4ce8-b072-9121f05d495d" },
    };
    const firstResult = await submitOriginalSimulation(submission);
    const repeatedResult = await submitOriginalSimulation(submission);

    expect(repeatedResult).toEqual(firstResult);
    expect(rpc).toHaveBeenCalledTimes(2);
    expect(rpc.mock.calls[1]).toEqual(rpc.mock.calls[0]);
  });

  it("refuses a delivery if the authenticated account changed", async () => {
    getUser.mockResolvedValueOnce({ data: { user: { id: "different-user" } } });
    const result = await submitOriginalSimulation({ accountScope, questionIds: [question.id], answers: {}, elapsedMsByQuestion: {}, clientEventIds: {} });
    expect(result).toMatchObject({ ok: false, kind: "recoverable_error" });
    expect(rpc).not.toHaveBeenCalled();
  });
});
