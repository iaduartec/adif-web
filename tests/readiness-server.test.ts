import { describe, expect, it } from "vitest";
import { vi } from "vitest";
import {
  assembleReadinessInput,
  assembleReadinessInputFromRows,
  ReadinessUnavailableError,
  readReadinessHistory,
} from "../lib/adaptive/readiness-server";

describe("readiness server assembly", () => {
  it("maps active content and authenticated history into the pure readiness contract", () => {
    const now = new Date("2026-08-11T10:00:00.000Z");
    const result = assembleReadinessInputFromRows({
      now,
      content: {
        concepts: [{ id: "concept-a", title: "Concepto A", lessonId: "lesson-a", lessonTitle: "Lección A" }],
        questions: [{ id: "question-a", conceptIds: ["concept-a"] }],
        simulations: [{ id: "exam-a", title: "Examen A", durationMinutes: 15, questionIds: ["question-a"] }],
      },
      rows: {
        mastery: [{
          concept_id: "concept-a",
          status: "review",
          due_on: "2026-08-12",
          last_reviewed_at: "2026-08-10T09:00:00Z",
        }],
        questionAttempts: [{
          question_id: "question-a",
          is_correct: true,
          elapsed_ms: 45_000,
          mode: "diagnostic",
          created_at: "2026-08-11T08:00:00Z",
        }],
        reviewEvents: [{
          concept_id: "concept-a",
          source_kind: "recall",
          question_id: null,
          rating: 2,
          occurred_at: "2026-08-10T09:00:00Z",
        }],
        simulationAttempts: [{
          id: "attempt-a",
          simulation_id: "exam-a",
          correct_count: 1,
          incorrect_count: 0,
          omitted_count: 0,
          elapsed_ms: 300_000,
          created_at: "2026-08-09T09:00:00Z",
        }],
        simulationAnswers: [{
          attempt_id: "attempt-a",
          question_id: "question-a",
          is_correct: true,
          selected_answer: "A",
        }],
        lessonProgress: [{ lesson_id: "lesson-a", last_activity_at: "2026-08-08T09:00:00Z" }],
      },
    });

    expect(result).toEqual({
      now,
      concepts: [{ id: "concept-a", title: "Concepto A", lessonId: "lesson-a", lessonTitle: "Lección A" }],
      questions: [{ id: "question-a", conceptIds: ["concept-a"] }],
      mastery: [{
        conceptId: "concept-a",
        status: "review",
        dueOn: "2026-08-12",
        lastReviewedAt: "2026-08-10T09:00:00Z",
      }],
      questionAttempts: [{
        questionId: "question-a",
        isCorrect: true,
        elapsedMs: 45_000,
        mode: "diagnostic",
        createdAt: "2026-08-11T08:00:00Z",
      }],
      reviewEvents: [{
        conceptId: "concept-a",
        sourceKind: "recall",
        questionId: null,
        rating: 2,
        occurredAt: "2026-08-10T09:00:00Z",
      }],
      simulations: [{ id: "exam-a", title: "Examen A", durationMinutes: 15, questionIds: ["question-a"] }],
      simulationAttempts: [{
        id: "attempt-a",
        simulationId: "exam-a",
        correctCount: 1,
        incorrectCount: 0,
        omittedCount: 0,
        elapsedMs: 300_000,
        createdAt: "2026-08-09T09:00:00Z",
      }],
      simulationAnswers: [{
        attemptId: "attempt-a",
        questionId: "question-a",
        isCorrect: true,
        selectedAnswer: "A",
      }],
      lessonActivity: [{ lessonId: "lesson-a", occurredAt: "2026-08-08T09:00:00Z" }],
    });
  });

  it("paginates every history table and exhausts a full first page", async () => {
    const tableRows: Record<string, unknown[]> = {
      concept_mastery: [],
      question_attempts: Array.from({ length: 501 }, (_, index) => ({
        question_id: `question-${index}`,
        is_correct: true,
        elapsed_ms: 1_000,
        mode: "practice",
        created_at: "2026-08-11T09:00:00Z",
      })),
      review_events: [],
      simulation_attempts: [],
      simulation_answers: [],
      lesson_progress: [],
    };
    const ranges = new Map<string, Array<[number, number]>>();
    const supabase = {
      from: vi.fn((table: string) => {
        const query = {
          select: vi.fn(),
          eq: vi.fn(),
          order: vi.fn(),
          range: vi.fn(async (from: number, to: number) => {
            ranges.set(table, [...(ranges.get(table) ?? []), [from, to]]);
            return { data: tableRows[table]!.slice(from, to + 1), error: null };
          }),
        };
        query.select.mockReturnValue(query);
        query.eq.mockReturnValue(query);
        query.order.mockReturnValue(query);
        return query;
      }),
    };

    const history = await readReadinessHistory(supabase as never, "user-1");

    expect(history.questionAttempts).toHaveLength(501);
    expect(ranges.get("question_attempts")).toEqual([[0, 499], [500, 999]]);
    expect([...ranges.keys()].sort()).toEqual(Object.keys(tableRows).sort());
  });

  it("wraps database failures in a typed safe readiness error", async () => {
    const databaseError = new Error("relation secret_table violates private policy");
    const supabase = {
      from: vi.fn((table: string) => {
        const query = {
          select: vi.fn(),
          eq: vi.fn(),
          order: vi.fn(),
          range: vi.fn(async () => ({
            data: table === "question_attempts" ? null : [],
            error: table === "question_attempts" ? databaseError : null,
          })),
        };
        query.select.mockReturnValue(query);
        query.eq.mockReturnValue(query);
        query.order.mockReturnValue(query);
        return query;
      }),
    };

    const promise = assembleReadinessInput(supabase as never, "user-1");

    await expect(promise).rejects.toBeInstanceOf(ReadinessUnavailableError);
    await expect(promise).rejects.not.toThrow(/secret_table|private policy/i);
  });
});
