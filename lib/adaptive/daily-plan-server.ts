import { lessonTheories } from "../../content/lesson-theory";
import { listLessons, listOfficialExams, listOfficialQuestions } from "../content/repository";
import { createServerClient } from "../supabase/server";
import { fetchPaginatedRows } from "../supabase/paginated-query";
import { madridDayKey } from "./review-schedule";
import { collectActiveEvidence } from "./evidence";
import { assembleReadinessInput } from "./readiness-server";
import type { ReadinessInput } from "./readiness";
import type {
  DailyPlanAction,
  DailyPlanInput,
  DailyReviewCandidate,
} from "./daily-plan";

type AssemblyContent = {
  concepts: readonly { conceptId: string; title: string; lessonId: string }[];
  lessons: readonly { lessonId: string; title: string }[];
  questions: readonly { id: string; conceptIds: readonly string[] }[];
  simulations: readonly {
    examId: string;
    title: string;
    durationMinutes: number;
    sourceYear: number;
    questionIds: readonly string[];
  }[];
};

type AssemblyHistory = {
  mastery: readonly {
    conceptId: string;
    status: string;
    dueOn: string | null;
    lastReviewedAt: string | null;
  }[];
  lessonProgress: readonly { lessonId: string; percent: number; completed: boolean }[];
  questionAttempts: readonly { questionId: string }[];
  reviewEvents: readonly {
    conceptId: string;
    sourceKind: "recall" | "question";
    questionId: string | null;
    rating: number;
  }[];
  simulationAnswers: readonly {
    attemptId: string;
    questionId: string;
    selectedAnswer: "A" | "B" | "C" | "D" | null;
  }[];
  simulationAttempts: readonly { attemptId: string; examId: string; createdAt: string }[];
  actions: readonly DailyPlanAction[];
};

export type DailyPlanAssemblyRows = {
  date: string;
  sessionMinutes: number;
  content: AssemblyContent;
  history: AssemblyHistory;
};

function compareText(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function previousDay(dayKey: string) {
  const [year, month, day] = dayKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day - 1)).toISOString().slice(0, 10);
}

export function assembleDailyPlanInputFromRows(rows: DailyPlanAssemblyRows): DailyPlanInput {
  const activeConcepts = new Map(rows.content.concepts.map((concept) => [concept.conceptId, concept]));
  const activeLessonIds = new Set(rows.content.lessons.map((lesson) => lesson.lessonId));
  const activeQuestions = rows.content.questions
    .filter((question) => question.conceptIds.some((conceptId) => activeConcepts.has(conceptId)))
    .sort((left, right) => compareText(left.id, right.id));
  const activeQuestionIds = new Set(activeQuestions.map((question) => question.id));
  const progressByLesson = new Map(rows.history.lessonProgress.map((progress) => [progress.lessonId, progress]));
  const mastery = rows.history.mastery.filter((entry) => activeConcepts.has(entry.conceptId));
  const activeSimulationById = new Map(rows.content.simulations.map((simulation) => [simulation.examId, simulation]));
  const activeSimulationAttemptById = new Map(
    rows.history.simulationAttempts
      .filter((attempt) => activeSimulationById.has(attempt.examId))
      .map((attempt) => [attempt.attemptId, attempt]),
  );
  const activeSimulationAnswers = rows.history.simulationAnswers.filter((answer) => {
    const attempt = activeSimulationAttemptById.get(answer.attemptId);
    const simulation = attempt ? activeSimulationById.get(attempt.examId) : undefined;
    return simulation?.questionIds.includes(answer.questionId) === true;
  });
  const evidence = collectActiveEvidence({
    activeConceptIds: new Set(activeConcepts.keys()),
    activeQuestionIds,
    mastery,
    questionAttempts: rows.history.questionAttempts,
    simulationAnswers: activeSimulationAnswers,
    reviewEvents: rows.history.reviewEvents,
  });
  const yesterday = previousDay(rows.date);

  const reviews = mastery
    .filter((entry): entry is typeof entry & { dueOn: string; status: "review" | "at_risk" } => (
      entry.dueOn !== null
      && entry.dueOn <= rows.date
      && (entry.status === "review" || entry.status === "at_risk")
    ))
    .map((entry): DailyReviewCandidate => ({
      conceptId: entry.conceptId,
      title: activeConcepts.get(entry.conceptId)!.title,
      dueOn: entry.dueOn,
      status: entry.status,
    }));

  const lessons = rows.content.lessons
    .filter((lesson) => activeLessonIds.has(lesson.lessonId))
    .filter((lesson) => !progressByLesson.get(lesson.lessonId)?.completed)
    .map((lesson) => {
      const percent = progressByLesson.get(lesson.lessonId)?.percent ?? 0;
      return {
        lessonId: lesson.lessonId,
        title: lesson.title,
        remainingMinutes: percent >= 95 ? 5 : 10,
      };
    })
    .sort((left, right) => compareText(left.lessonId, right.lessonId));

  return {
    date: rows.date,
    availableMinutes: rows.sessionMinutes,
    reviews,
    lessons,
    practiceQuestions: activeQuestions.map(({ id }) => ({ id })),
    simulations: [...rows.content.simulations]
      .sort((left, right) => (
        left.sourceYear - right.sourceYear || compareText(left.examId, right.examId)
      ))
      .map(({ examId, title, durationMinutes, sourceYear }) => ({
        examId,
        title,
        durationMinutes,
        sourceYear,
      })),
    uniqueAttemptedQuestionIds: evidence.uniqueAttemptedQuestionIds,
    reviewedConceptIds: evidence.reviewedConceptIds,
    simulationAttempts: rows.history.simulationAttempts
      .map((attempt) => ({ examId: attempt.examId, attemptedOn: madridDayKey(attempt.createdAt) }))
      .sort((left, right) => compareText(left.attemptedOn, right.attemptedOn) || compareText(left.examId, right.examId)),
    postponedTaskKeysYesterday: rows.history.actions
      .filter((action) => action.planDate === yesterday && action.action === "postpone")
      .map((action) => action.taskKey)
      .sort(compareText),
    actions: rows.history.actions
      .filter((action) => action.planDate === rows.date)
      .sort((left, right) => compareText(left.taskKey, right.taskKey)),
  };
}

function activeContent(): AssemblyContent {
  const concepts = Object.entries(lessonTheories).flatMap(([lessonId, theory]) => (
    theory.concepts.map((concept) => ({ conceptId: concept.id, title: concept.title, lessonId }))
  ));
  return {
    concepts,
    lessons: listLessons()
      .filter((lesson) => Object.hasOwn(lessonTheories, lesson.slug))
      .map((lesson) => ({ lessonId: lesson.slug, title: lesson.title })),
    questions: listOfficialQuestions().map((question) => ({ id: question.id, conceptIds: question.conceptIds })),
    simulations: listOfficialExams().map((exam) => ({
      examId: exam.id,
      title: exam.title,
      durationMinutes: exam.durationMinutes,
      sourceYear: exam.source.year,
      questionIds: exam.questionIds,
    })),
  };
}

type SupabaseClient = Awaited<ReturnType<typeof createServerClient>>;

async function readHistory(
  supabase: SupabaseClient,
  userId: string,
  date: string,
  readinessInput?: Promise<ReadinessInput> | ReadinessInput,
): Promise<{
  sessionMinutes: number;
  history: AssemblyHistory;
}> {
  const since = previousDay(date);
  const [goalResult, progressRows, actionRows, readiness] = await Promise.all([
    supabase.from("study_goals").select("session_minutes").eq("user_id", userId).maybeSingle(),
    fetchPaginatedRows<{ lesson_id: string; percent: number; completed: boolean }>(() => (
      supabase.from("lesson_progress")
        .select("lesson_id,percent,completed")
        .eq("user_id", userId)
        .order("lesson_id", { ascending: true })
    )),
    fetchPaginatedRows<{
      plan_date: string;
      task_key: string;
      action: DailyPlanAction["action"];
      replacement_task_key: string | null;
    }>(() => (
      supabase.from("daily_plan_actions")
        .select("plan_date,task_key,action,replacement_task_key")
        .eq("user_id", userId)
        .gte("plan_date", since)
        .order("plan_date", { ascending: true })
        .order("task_key", { ascending: true })
    )),
    readinessInput ?? assembleReadinessInput(supabase, userId, new Date(`${date}T12:00:00+02:00`)),
  ]);

  if (goalResult.error) throw new Error("No se ha podido preparar el plan diario.");
  if (!goalResult.data) throw new Error("Completa tu perfil de preparación antes de generar el plan.");

  return {
    sessionMinutes: goalResult.data.session_minutes,
    history: {
      mastery: readiness.mastery.map((row) => ({
        conceptId: row.conceptId,
        status: row.status,
        dueOn: row.dueOn,
        lastReviewedAt: row.lastReviewedAt,
      })),
      lessonProgress: progressRows.map((row) => ({
        lessonId: row.lesson_id,
        percent: row.percent,
        completed: row.completed,
      })),
      questionAttempts: readiness.questionAttempts
        .filter((attempt) => attempt.mode !== "simulation")
        .map((row) => ({ questionId: row.questionId })),
      reviewEvents: readiness.reviewEvents.map((event) => ({
        conceptId: event.conceptId,
        sourceKind: event.sourceKind,
        questionId: event.questionId ?? null,
        rating: event.rating,
      })),
      simulationAnswers: readiness.simulationAnswers.map((answer) => ({
        attemptId: answer.attemptId,
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
      })),
      simulationAttempts: readiness.simulationAttempts.map((row) => ({
        attemptId: row.id,
        examId: row.simulationId,
        createdAt: row.createdAt,
      })),
      actions: actionRows.map((row) => ({
        planDate: row.plan_date,
        taskKey: row.task_key,
        action: row.action,
        replacementTaskKey: row.replacement_task_key,
      })),
    },
  };
}

export async function assembleDailyPlanInput(
  requestedDate?: string,
  authenticated?: {
    supabase: SupabaseClient;
    userId: string;
    readinessInput?: Promise<ReadinessInput> | ReadinessInput;
  },
): Promise<DailyPlanInput> {
  const date = requestedDate ?? madridDayKey(new Date());
  const supabase = authenticated?.supabase ?? await createServerClient();
  let userId = authenticated?.userId;
  if (!userId) {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Debes iniciar sesión para consultar tu plan diario.");
    userId = user.id;
  }
  const { sessionMinutes, history } = await readHistory(
    supabase,
    userId,
    date,
    authenticated?.readinessInput,
  );
  return assembleDailyPlanInputFromRows({ date, sessionMinutes, content: activeContent(), history });
}
