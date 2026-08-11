import { describe, expect, it, vi } from "vitest";

import type { Database } from "../lib/database.types";
import { createMockSupabaseClient } from "../lib/supabase/mock-client";
import { getMockStore } from "../lib/supabase/mock-store";
import { getOfficialExam } from "../lib/content/repository";
import { activeTheoryConceptRegistry } from "../content/theory-concepts";

describe("adaptive learning Supabase mock", () => {
  it("exposes empty adaptive records and onboarding-ready study goal defaults", async () => {
    const store = getMockStore();
    store.reset();

    expect(store.conceptMastery).toEqual([]);
    expect(store.reviewEvents).toEqual([]);
    expect(store.dailyPlanActions).toEqual([]);
    expect(store.studyGoals[0]).toMatchObject({
      exam_date: null,
      onboarding_completed_at: "2026-08-11T00:00:00.000Z",
      session_minutes: 30,
    });

    const client = createMockSupabaseClient();
    await client.from("concept_mastery").insert({
      concept_id: "concept-1",
      user_id: "test-user-id",
    });
    await client.from("review_events").insert({
      client_event_id: "97e8506c-ea4d-4ce1-b42e-554969cebd3a",
      concept_id: "concept-1",
      question_id: null,
      rating: 2,
      source_kind: "recall",
      user_id: "test-user-id",
    });
    await client.from("daily_plan_actions").insert({
      action: "postpone",
      plan_date: "2026-08-11",
      replacement_task_key: null,
      task_key: "review:concept-1",
      user_id: "test-user-id",
    });

    expect(store.conceptMastery).toEqual([
      expect.objectContaining({
        concept_id: "concept-1",
        correct_evidence: 0,
        due_on: null,
        ease_factor: 2.5,
        incorrect_evidence: 0,
        interval_days: 0,
        last_evidence_at: null,
        last_reviewed_at: null,
        repetitions: 0,
        status: "new",
        user_id: "test-user-id",
      }),
    ]);
    expect(store.reviewEvents).toEqual([
      expect.objectContaining({
        occurred_at: expect.any(String),
        source_kind: "recall",
      }),
    ]);
    expect(store.dailyPlanActions).toHaveLength(1);
  });

  it("rejects review-event mutations so immutable history stays unchanged", async () => {
    const store = getMockStore();
    store.reset();
    const client = createMockSupabaseClient();

    await client.from("review_events").insert({
      client_event_id: "97e8506c-ea4d-4ce1-b42e-554969cebd3a",
      concept_id: "concept-1",
      question_id: null,
      rating: 2,
      source_kind: "recall",
      user_id: "test-user-id",
    });

    const update = await client
      .from("review_events")
      .update({ rating: 3 })
      .eq("client_event_id", "97e8506c-ea4d-4ce1-b42e-554969cebd3a");
    const deletion = await client
      .from("review_events")
      .delete()
      .eq("client_event_id", "97e8506c-ea4d-4ce1-b42e-554969cebd3a");
    const upsert = await client.from("review_events").upsert(
      {
        client_event_id: "97e8506c-ea4d-4ce1-b42e-554969cebd3a",
        concept_id: "concept-1",
        question_id: null,
        rating: 3,
        source_kind: "recall",
        user_id: "test-user-id",
      },
      { onConflict: "user_id,client_event_id" },
    );

    expect(update).toMatchObject({ data: null, error: expect.any(Error) });
    expect(deletion).toMatchObject({ data: null, error: expect.any(Error) });
    expect(upsert).toMatchObject({ data: null, error: expect.any(Error) });
    expect(store.reviewEvents).toEqual([
      expect.objectContaining({ rating: 2 }),
    ]);
  });

  it("matches the daily action uniqueness contract for one original task per user and date", async () => {
    const store = getMockStore();
    store.reset();
    const client = createMockSupabaseClient();
    const action = {
      action: "postpone" as const,
      plan_date: "2026-08-11",
      replacement_task_key: null,
      task_key: "review:concept-1",
      user_id: "test-user-id",
    };

    const first = await client.from("daily_plan_actions").insert(action);
    const duplicate = await client.from("daily_plan_actions").insert(action);

    expect(first.error).toBeNull();
    expect(duplicate).toMatchObject({ data: null, error: { code: "23505" } });
    expect(store.dailyPlanActions).toHaveLength(1);
  });

  it("models the authenticated append-only daily action RPC and immutable retry contract", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-11T10:00:00.000Z"));
    try {
      const store = getMockStore();
      store.reset();
      const client = createMockSupabaseClient();
      const args = {
        p_plan_date: "2026-08-11",
        p_task_key: "lesson:lesson-a",
        p_action: "replace",
        p_replacement_task_key: "review:concept-a",
      };

      const first = await client.rpc("record_daily_plan_action", args);
      const retry = await client.rpc("record_daily_plan_action", args);
      const changed = await client.rpc("record_daily_plan_action", {
        ...args,
        p_replacement_task_key: "review:concept-b",
      });

      expect(first).toEqual({ data: true, error: null });
      expect(retry).toEqual(first);
      expect(changed).toMatchObject({ data: null, error: { code: "23505" } });
      expect(store.dailyPlanActions).toHaveLength(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it("rolls back an internally duplicated daily-action batch atomically", async () => {
    const store = getMockStore();
    store.reset();
    const client = createMockSupabaseClient();
    const action = {
      action: "postpone" as const,
      plan_date: "2026-08-11",
      replacement_task_key: null,
      task_key: "review:concept-1",
      user_id: "test-user-id",
    };

    const duplicateBatch = await client.from("daily_plan_actions").insert([action, action]);

    expect(duplicateBatch).toMatchObject({ data: null, error: { code: "23505" } });
    expect(store.dailyPlanActions).toEqual([]);
  });

  it("exposes generated table contracts for adaptive records", () => {
    const studyGoal: Database["public"]["Tables"]["study_goals"]["Insert"] = {
      user_id: "test-user-id",
      weekly_target_minutes: 120,
    };
    const mastery: Database["public"]["Tables"]["concept_mastery"]["Insert"] = {
      concept_id: "concept-1",
      user_id: "test-user-id",
    };
    const reviewEvent: Database["public"]["Tables"]["review_events"]["Insert"] = {
      client_event_id: "97e8506c-ea4d-4ce1-b42e-554969cebd3a",
      concept_id: "concept-1",
      rating: 3,
      source_kind: "recall",
      user_id: "test-user-id",
    };
    const dailyAction: Database["public"]["Tables"]["daily_plan_actions"]["Insert"] = {
      action: "postpone",
      plan_date: "2026-08-11",
      task_key: "review:concept-1",
      user_id: "test-user-id",
    };

    expect(studyGoal.session_minutes).toBeUndefined();
    expect(mastery.status).toBeUndefined();
    expect(reviewEvent.question_id).toBeUndefined();
    expect(dailyAction.replacement_task_key).toBeUndefined();
  });

  it("models an idempotent atomic practice attempt with derived mastery", async () => {
    const store = getMockStore();
    store.reset();
    const client = createMockSupabaseClient();
    const args = {
      p_question_id: "ADIF-2025-1131-Q01",
      p_selected_answer: "D",
      p_elapsed_ms: 500,
      p_client_event_id: "018f4c5e-7c2a-7d61-a85e-969efdde4dd5",
    };

    const first = await client.rpc("record_practice_attempt", args);
    const retry = await client.rpc("record_practice_attempt", args);

    expect(retry).toEqual(first);
    expect(store.questionAttempts).toHaveLength(1);
    expect(store.reviewEvents).toHaveLength(1);
    expect(store.conceptMastery).toEqual([
      expect.objectContaining({
        concept_id: "ict-concept-24",
        incorrect_evidence: 1,
        repetitions: 0,
        status: "at_risk",
      }),
    ]);
  });

  it("models an idempotent simulation without accepting client correctness", async () => {
    const store = getMockStore();
    store.reset();
    const client = createMockSupabaseClient();
    const exam = getOfficialExam("ADIF-2023-1433")!;
    const answers = exam.questionIds.map((questionId, index) => ({
      question_id: questionId,
      selected_answer: index === 0 ? "C" : null,
    }));
    const args = {
      p_simulation_id: exam.id,
      p_elapsed_ms: 1_000,
      p_answers: answers,
      p_client_event_id: "118f4c5e-7c2a-7d61-a85e-969efdde4dd5",
    };

    const first = await client.rpc("submit_simulation_attempt", args);
    const retry = await client.rpc("submit_simulation_attempt", args);

    expect(retry).toEqual(first);
    expect(store.simulationAttempts).toHaveLength(1);
    expect(store.simulationAttempts[0]).toMatchObject({ correct_count: 1, incorrect_count: 0, omitted_count: 14 });
    expect(store.simulationAnswers).toHaveLength(15);
    expect(store.reviewEvents).toHaveLength(1);
  });

  it("rejects an idempotency key reused with a changed practice or simulation payload", async () => {
    const store = getMockStore();
    store.reset();
    const client = createMockSupabaseClient();
    const practiceArgs = {
      p_question_id: "ADIF-2025-1131-Q01",
      p_selected_answer: "D",
      p_elapsed_ms: 500,
      p_client_event_id: "218f4c5e-7c2a-7d61-a85e-969efdde4dd5",
      p_mode: "practice",
    };
    await client.rpc("record_practice_attempt", practiceArgs);
    const practiceConflict = await client.rpc("record_practice_attempt", {
      ...practiceArgs,
      p_selected_answer: "A",
    });

    const exam = getOfficialExam("ADIF-2023-1433")!;
    const simulationArgs = {
      p_simulation_id: exam.id,
      p_elapsed_ms: 1_000,
      p_answers: exam.questionIds.map((questionId) => ({ question_id: questionId, selected_answer: null })),
      p_client_event_id: "318f4c5e-7c2a-7d61-a85e-969efdde4dd5",
    };
    await client.rpc("submit_simulation_attempt", simulationArgs);
    const simulationConflict = await client.rpc("submit_simulation_attempt", {
      ...simulationArgs,
      p_elapsed_ms: 2_000,
    });

    expect(practiceConflict).toMatchObject({ data: null, error: expect.objectContaining({ code: "23514" }) });
    expect(simulationConflict).toMatchObject({ data: null, error: expect.objectContaining({ code: "23514" }) });
    expect(store.questionAttempts).toHaveLength(1);
    expect(store.simulationAttempts).toHaveLength(1);
  });

  it.each([
    "incomplete",
    "duplicate",
    "foreign",
    "invalid-answer",
    "invalid-elapsed",
  ])("rolls back an invalid %s simulation payload", async (variant) => {
    const store = getMockStore();
    store.reset();
    const client = createMockSupabaseClient();
    const exam = getOfficialExam("ADIF-2023-1433")!;
    const answers: Array<{ question_id: string; selected_answer: string | null }> = exam.questionIds.map(
      (questionId) => ({ question_id: questionId, selected_answer: null }),
    );
    let elapsedMs = 1_000;
    if (variant === "incomplete") answers.pop();
    if (variant === "duplicate") answers[answers.length - 1] = { ...answers[0] };
    if (variant === "foreign") answers[answers.length - 1] = { question_id: "ADIF-2025-1131-Q01", selected_answer: null };
    if (variant === "invalid-answer") answers[0].selected_answer = "E";
    if (variant === "invalid-elapsed") elapsedMs = 86_400_001;

    const result = await client.rpc("submit_simulation_attempt", {
      p_simulation_id: exam.id,
      p_elapsed_ms: elapsedMs,
      p_answers: answers,
      p_client_event_id: "418f4c5e-7c2a-7d61-a85e-969efdde4dd5",
    });

    expect(result).toMatchObject({ data: null, error: expect.any(Error) });
    expect(store.simulationAttempts).toEqual([]);
    expect(store.simulationAnswers).toEqual([]);
    expect(store.reviewEvents).toEqual([]);
    expect(store.conceptMastery).toEqual([]);
  });

  it("rejects practice and simulation persistence when a mapped concept is inactive", async () => {
    const store = getMockStore();
    store.reset();
    const client = createMockSupabaseClient();
    const mutableRegistry = activeTheoryConceptRegistry as Map<string, unknown>;
    const concept = mutableRegistry.get("ict-concept-24")!;
    mutableRegistry.delete("ict-concept-24");

    try {
      const result = await client.rpc("record_practice_attempt", {
        p_question_id: "ADIF-2025-1131-Q01",
        p_selected_answer: "A",
        p_elapsed_ms: 500,
        p_client_event_id: "518f4c5e-7c2a-7d61-a85e-969efdde4dd5",
        p_mode: "practice",
      });
      expect(result).toMatchObject({ data: null, error: expect.any(Error) });
      expect(store.questionAttempts).toEqual([]);

      const exam = getOfficialExam("ADIF-2025-1131")!;
      const simulationResult = await client.rpc("submit_simulation_attempt", {
        p_simulation_id: exam.id,
        p_elapsed_ms: 500,
        p_answers: exam.questionIds.map((questionId) => ({ question_id: questionId, selected_answer: null })),
        p_client_event_id: "618f4c5e-7c2a-7d61-a85e-969efdde4dd5",
      });
      expect(simulationResult).toMatchObject({ data: null, error: expect.any(Error) });
      expect(store.simulationAttempts).toEqual([]);
      expect(store.simulationAnswers).toEqual([]);
    } finally {
      mutableRegistry.set("ict-concept-24", concept);
    }
  });
});
