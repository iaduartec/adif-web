import { lessonTheories } from "../../content/lesson-theory";
import { listLessons, listOfficialExams, listOfficialQuestions } from "../content/repository";
import type { createServerClient } from "../supabase/server";
import { fetchPaginatedRows } from "../supabase/paginated-query";
import type {
  ReadinessInput,
  ReadinessMastery,
  ReadinessQuestionAttempt,
  ReadinessReviewEvent,
  ReadinessSimulationAnswer,
} from "./readiness";

type ReadinessContentRows = Pick<
  ReadinessInput,
  "concepts" | "questions" | "simulations"
>;

export type ReadinessHistoryRows = {
  mastery: readonly {
    concept_id: string;
    status: ReadinessMastery["status"];
    due_on: string | null;
    last_reviewed_at: string | null;
  }[];
  questionAttempts: readonly {
    question_id: string;
    is_correct: boolean;
    elapsed_ms: number;
    mode: ReadinessQuestionAttempt["mode"];
    created_at: string;
  }[];
  reviewEvents: readonly {
    concept_id: string;
    source_kind: ReadinessReviewEvent["sourceKind"];
    question_id: string | null;
    rating: number;
    occurred_at: string;
  }[];
  simulationAttempts: readonly {
    id: string;
    simulation_id: string;
    correct_count: number;
    incorrect_count: number;
    omitted_count: number;
    elapsed_ms: number;
    created_at: string;
  }[];
  simulationAnswers: readonly {
    attempt_id: string;
    question_id: string;
    is_correct: boolean;
    selected_answer: ReadinessSimulationAnswer["selectedAnswer"];
  }[];
  lessonProgress: readonly { lesson_id: string; last_activity_at: string }[];
};

export type ReadinessAssemblyRows = {
  now: Date;
  content: ReadinessContentRows;
  rows: ReadinessHistoryRows;
};

function reviewRating(value: number): ReadinessReviewEvent["rating"] {
  if (value === 0 || value === 1 || value === 2 || value === 3) return value;
  throw new Error("El historial contiene una valoración de repaso no válida.");
}

export function assembleReadinessInputFromRows({
  now,
  content,
  rows,
}: ReadinessAssemblyRows): ReadinessInput {
  return {
    now,
    concepts: content.concepts,
    questions: content.questions,
    mastery: rows.mastery.map((entry) => ({
      conceptId: entry.concept_id,
      status: entry.status,
      dueOn: entry.due_on,
      lastReviewedAt: entry.last_reviewed_at,
    })),
    questionAttempts: rows.questionAttempts.map((attempt) => ({
      questionId: attempt.question_id,
      isCorrect: attempt.is_correct,
      elapsedMs: attempt.elapsed_ms,
      mode: attempt.mode,
      createdAt: attempt.created_at,
    })),
    reviewEvents: rows.reviewEvents.map((event) => ({
      conceptId: event.concept_id,
      sourceKind: event.source_kind,
      questionId: event.question_id,
      rating: reviewRating(event.rating),
      occurredAt: event.occurred_at,
    })),
    simulations: content.simulations,
    simulationAttempts: rows.simulationAttempts.map((attempt) => ({
      id: attempt.id,
      simulationId: attempt.simulation_id,
      correctCount: attempt.correct_count,
      incorrectCount: attempt.incorrect_count,
      omittedCount: attempt.omitted_count,
      elapsedMs: attempt.elapsed_ms,
      createdAt: attempt.created_at,
    })),
    simulationAnswers: rows.simulationAnswers.map((answer) => ({
      attemptId: answer.attempt_id,
      questionId: answer.question_id,
      isCorrect: answer.is_correct,
      selectedAnswer: answer.selected_answer,
    })),
    lessonActivity: rows.lessonProgress.map((progress) => ({
      lessonId: progress.lesson_id,
      occurredAt: progress.last_activity_at,
    })),
  };
}

function activeContent(): ReadinessContentRows {
  const lessonTitleById = new Map(listLessons().map((lesson) => [lesson.slug, lesson.title]));
  return {
    concepts: Object.entries(lessonTheories).flatMap(([lessonId, theory]) => (
      theory.concepts.map((concept) => ({
        id: concept.id,
        title: concept.title,
        lessonId,
        lessonTitle: lessonTitleById.get(lessonId) ?? lessonId,
      }))
    )),
    questions: listOfficialQuestions().map((question) => ({
      id: question.id,
      conceptIds: question.conceptIds,
    })),
    simulations: listOfficialExams().map((exam) => ({
      id: exam.id,
      title: exam.title,
      durationMinutes: exam.durationMinutes,
      questionIds: exam.questionIds,
    })),
  };
}

type SupabaseClient = Awaited<ReturnType<typeof createServerClient>>;

export class ReadinessUnavailableError extends Error {
  readonly cause: unknown;

  constructor(cause?: unknown) {
    super("No se han podido cargar los indicadores de preparación.");
    this.name = "ReadinessUnavailableError";
    this.cause = cause;
  }
}

export async function readReadinessHistory(
  supabase: SupabaseClient,
  userId: string,
): Promise<ReadinessHistoryRows> {
  const [mastery, questionAttempts, reviewEvents, simulationAttempts, simulationAnswers, lessonProgress] = await Promise.all([
    fetchPaginatedRows<ReadinessHistoryRows["mastery"][number]>(() => (
      supabase.from("concept_mastery")
        .select("concept_id,status,due_on,last_reviewed_at")
        .eq("user_id", userId)
        .order("concept_id", { ascending: true })
    )),
    fetchPaginatedRows<ReadinessHistoryRows["questionAttempts"][number]>(() => (
      supabase.from("question_attempts")
        .select("question_id,is_correct,elapsed_ms,mode,created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: true })
        .order("id", { ascending: true })
    )),
    fetchPaginatedRows<ReadinessHistoryRows["reviewEvents"][number]>(() => (
      supabase.from("review_events")
        .select("concept_id,source_kind,question_id,rating,occurred_at")
        .eq("user_id", userId)
        .order("occurred_at", { ascending: true })
        .order("id", { ascending: true })
    )),
    fetchPaginatedRows<ReadinessHistoryRows["simulationAttempts"][number]>(() => (
      supabase.from("simulation_attempts")
        .select("id,simulation_id,correct_count,incorrect_count,omitted_count,elapsed_ms,created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: true })
        .order("id", { ascending: true })
    )),
    fetchPaginatedRows<ReadinessHistoryRows["simulationAnswers"][number]>(() => (
      supabase.from("simulation_answers")
        .select("attempt_id,question_id,is_correct,selected_answer")
        .eq("user_id", userId)
        .order("id", { ascending: true })
    )),
    fetchPaginatedRows<ReadinessHistoryRows["lessonProgress"][number]>(() => (
      supabase.from("lesson_progress")
        .select("lesson_id,last_activity_at")
        .eq("user_id", userId)
        .order("lesson_id", { ascending: true })
    )),
  ]);

  return { mastery, questionAttempts, reviewEvents, simulationAttempts, simulationAnswers, lessonProgress };
}

export async function assembleReadinessInput(
  supabase: SupabaseClient,
  userId: string,
  now: Date = new Date(),
): Promise<ReadinessInput> {
  try {
    return assembleReadinessInputFromRows({
      now,
      content: activeContent(),
      rows: await readReadinessHistory(supabase, userId),
    });
  } catch (error) {
    if (error instanceof ReadinessUnavailableError) throw error;
    throw new ReadinessUnavailableError(error);
  }
}
