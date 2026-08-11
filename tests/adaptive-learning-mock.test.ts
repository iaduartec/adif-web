import { describe, expect, it } from "vitest";

import type { Database } from "../lib/database.types";
import { createMockSupabaseClient } from "../lib/supabase/mock-client";
import { getMockStore } from "../lib/supabase/mock-store";
import { getOfficialExam } from "../lib/content/repository";

describe("adaptive learning Supabase mock", () => {
  it("exposes empty adaptive records and onboarding-ready study goal defaults", async () => {
    const store = getMockStore();
    store.reset();

    expect(store.conceptMastery).toEqual([]);
    expect(store.reviewEvents).toEqual([]);
    expect(store.dailyPlanActions).toEqual([]);
    expect(store.studyGoals[0]).toMatchObject({
      exam_date: null,
      onboarding_completed_at: null,
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
});
