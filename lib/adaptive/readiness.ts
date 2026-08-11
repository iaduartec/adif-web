import { madridDayKey, type MasteryStatus, type ReviewRating } from "./review-schedule";

export type ReadinessLevel = "insufficient" | "building" | "consolidating" | "on_track";
export type ReadinessCriterionKey = "evidence" | "coverage" | "domain" | "retention" | "simulations" | "speed";

export type ReadinessConcept = {
  id: string;
  title: string;
  lessonId: string;
  lessonTitle: string;
};

export type ReadinessQuestion = { id: string; conceptIds: readonly string[] };

export type ReadinessMastery = {
  conceptId: string;
  status: MasteryStatus;
  dueOn: string | null;
  lastReviewedAt: string | null;
};

export type ReadinessQuestionAttempt = {
  questionId: string;
  isCorrect: boolean;
  elapsedMs: number;
  mode: "practice" | "diagnostic" | "simulation";
  createdAt: string;
};

export type ReadinessReviewEvent = {
  conceptId: string;
  sourceKind: "recall" | "question";
  questionId?: string | null;
  rating: ReviewRating;
  occurredAt: string;
};

export type ReadinessSimulation = {
  id: string;
  title: string;
  durationMinutes: number;
  questionIds: readonly string[];
};

export type ReadinessSimulationAttempt = {
  id: string;
  simulationId: string;
  correctCount: number;
  incorrectCount: number;
  omittedCount: number;
  elapsedMs: number;
  createdAt: string;
};

export type ReadinessSimulationAnswer = {
  attemptId: string;
  questionId: string;
  isCorrect: boolean;
  selectedAnswer: "A" | "B" | "C" | "D" | null;
};

export type ReadinessLessonActivity = { lessonId: string; occurredAt: string };

export type ReadinessInput = {
  now: Date;
  concepts: readonly ReadinessConcept[];
  questions: readonly ReadinessQuestion[];
  mastery: readonly ReadinessMastery[];
  questionAttempts: readonly ReadinessQuestionAttempt[];
  reviewEvents: readonly ReadinessReviewEvent[];
  simulations: readonly ReadinessSimulation[];
  simulationAttempts: readonly ReadinessSimulationAttempt[];
  simulationAnswers: readonly ReadinessSimulationAnswer[];
  lessonActivity: readonly ReadinessLessonActivity[];
};

export type RateMetric = { correct: number; total: number; percentage: number | null };
export type ReadinessCriterion = {
  key: ReadinessCriterionKey;
  label: string;
  met: boolean;
  explanation: string;
};

export type ConceptReadinessMetric = {
  conceptId: string;
  conceptTitle: string;
  lessonId: string;
  lessonTitle: string;
  status: MasteryStatus;
  dueOn: string | null;
  current: boolean;
  correct: number;
  total: number;
  percentage: number | null;
  recentCorrect: number;
  recentTotal: number;
  recentPercentage: number | null;
};

export type LessonReadinessMetric = {
  lessonId: string;
  lessonTitle: string;
  currentConcepts: number;
  conceptCount: number;
  domainPercentage: number;
  correct: number;
  total: number;
  percentage: number | null;
  recentCorrect: number;
  recentTotal: number;
  recentPercentage: number | null;
};

export type SimulationScore = {
  attemptId: string;
  examId: string;
  examTitle: string;
  netScore: number;
  normalizedPercentage: number;
  totalQuestions: number;
};

export type ReadinessSnapshot = {
  level: ReadinessLevel;
  label: string;
  sample: { uniqueAttemptedQuestions: number; reviewedConcepts: number };
  coverage: { attempted: number; total: number; percentage: number };
  currentDomain: { current: number; total: number; percentage: number };
  accuracy: { recent: RateMetric; historical: RateMetric };
  deferredRetention: { retained: number; eligible: number; percentage: number | null };
  recentSimulations: number;
  speed: { timely: number; total: number; percentage: number | null };
  streak: number;
  simulationScores: SimulationScore[];
  concepts: ConceptReadinessMetric[];
  lessons: LessonReadinessMetric[];
  criteria: ReadinessCriterion[];
  mainObstacle: ReadinessCriterion | null;
};

type AnswerObservation = {
  questionId: string;
  isCorrect: boolean;
  occurredAt: string;
};

const DAY_MS = 86_400_000;

function shiftDay(dayKey: string, days: number) {
  const [year, month, day] = dayKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days, 12)).toISOString().slice(0, 10);
}

function roundPercentage(numerator: number, denominator: number): number | null {
  if (denominator === 0) return null;
  return Math.round((numerator / denominator) * 10_000) / 100;
}

function rate(observations: readonly AnswerObservation[]): RateMetric {
  const correct = observations.filter((observation) => observation.isCorrect).length;
  return { correct, total: observations.length, percentage: roundPercentage(correct, observations.length) };
}

function withinWindow(instant: string, fromDay: string, throughDay: string) {
  try {
    const day = madridDayKey(instant);
    return day >= fromDay && day <= throughDay;
  } catch {
    return false;
  }
}

function levelLabel(level: ReadinessLevel) {
  switch (level) {
    case "insufficient": return "Evidencia insuficiente";
    case "building": return "Base en construcción";
    case "consolidating": return "Consolidando";
    case "on_track": return "Preparación en objetivos";
  }
}

export function calculateReadiness(input: ReadinessInput): ReadinessSnapshot {
  const today = madridDayKey(input.now);
  const readinessFrom = shiftDay(today, -29);
  const accuracyFrom = shiftDay(today, -13);
  const activeConceptIds = new Set(input.concepts.map((concept) => concept.id));
  const activeQuestionById = new Map(input.questions.map((question) => [question.id, question]));
  const activeLessonIds = new Set(input.concepts.map((concept) => concept.lessonId));
  const masteryByConcept = new Map(
    input.mastery
      .filter((entry) => activeConceptIds.has(entry.conceptId))
      .map((entry) => [entry.conceptId, entry]),
  );
  const activeEvents = input.reviewEvents.filter((event) => activeConceptIds.has(event.conceptId));
  const activeSimulationById = new Map(input.simulations.map((simulation) => [simulation.id, simulation]));
  const activeSimulationAttempts = input.simulationAttempts.filter((attempt) => (
    activeSimulationById.has(attempt.simulationId)
  ));
  const simulationAttemptById = new Map(activeSimulationAttempts.map((attempt) => [attempt.id, attempt]));
  const answersBySimulationAttempt = new Map<string, ReadinessSimulationAnswer[]>();

  for (const answer of input.simulationAnswers) {
    const attempt = simulationAttemptById.get(answer.attemptId);
    const simulation = attempt ? activeSimulationById.get(attempt.simulationId) : undefined;
    if (
      !attempt
      || !simulation
      || !activeQuestionById.has(answer.questionId)
      || !simulation.questionIds.includes(answer.questionId)
    ) continue;
    const answers = answersBySimulationAttempt.get(answer.attemptId) ?? [];
    answers.push(answer);
    answersBySimulationAttempt.set(answer.attemptId, answers);
  }

  const practiceAttempts = input.questionAttempts.filter((attempt) => (
    attempt.mode !== "simulation" && activeQuestionById.has(attempt.questionId)
  ));
  const observations: AnswerObservation[] = practiceAttempts.map((attempt) => ({
    questionId: attempt.questionId,
    isCorrect: attempt.isCorrect,
    occurredAt: attempt.createdAt,
  }));
  for (const attempt of activeSimulationAttempts) {
    for (const answer of answersBySimulationAttempt.get(attempt.id) ?? []) {
      if (answer.selectedAnswer === null) continue;
      observations.push({
        questionId: answer.questionId,
        isCorrect: answer.isCorrect,
        occurredAt: attempt.createdAt,
      });
    }
  }

  const attemptedQuestionIds = new Set(observations.map((observation) => observation.questionId));
  const reviewedConceptIds = new Set<string>();
  for (const event of activeEvents) {
    if (event.sourceKind === "recall") reviewedConceptIds.add(event.conceptId);
  }
  for (const entry of masteryByConcept.values()) {
    if (entry.lastReviewedAt !== null) reviewedConceptIds.add(entry.conceptId);
  }

  const currentConceptIds = new Set<string>();
  for (const [conceptId, entry] of masteryByConcept) {
    if (
      (entry.status === "review" || entry.status === "consolidated")
      && (entry.dueOn === null || entry.dueOn >= today)
    ) currentConceptIds.add(conceptId);
  }

  const coveragePercentage = roundPercentage(attemptedQuestionIds.size, input.questions.length) ?? 0;
  const domainPercentage = roundPercentage(currentConceptIds.size, input.concepts.length) ?? 0;
  const recentObservations = observations.filter((observation) => (
    withinWindow(observation.occurredAt, accuracyFrom, today)
  ));

  const eligibleRecalls = activeEvents.filter((event) => {
    if (event.sourceKind !== "recall" || !withinWindow(event.occurredAt, readinessFrom, today)) return false;
    const eventTime = new Date(event.occurredAt).getTime();
    if (!Number.isFinite(eventTime)) return false;
    return activeEvents.some((previous) => (
      previous.conceptId === event.conceptId
      && new Date(previous.occurredAt).getTime() <= eventTime - DAY_MS
    ));
  });
  const retainedRecalls = eligibleRecalls.filter((event) => event.rating >= 2).length;

  const recentSimulationAttempts = activeSimulationAttempts.filter((attempt) => (
    withinWindow(attempt.createdAt, readinessFrom, today)
  ));
  const recentPracticeAttempts = practiceAttempts.filter((attempt) => (
    withinWindow(attempt.createdAt, readinessFrom, today)
  ));
  let timely = recentPracticeAttempts.filter((attempt) => attempt.elapsedMs <= 90_000).length;
  let speedTotal = recentPracticeAttempts.length;
  for (const attempt of recentSimulationAttempts) {
    const simulation = activeSimulationById.get(attempt.simulationId)!;
    const activeExamQuestionIds = new Set(
      simulation.questionIds.filter((questionId) => activeQuestionById.has(questionId)),
    );
    speedTotal += activeExamQuestionIds.size;
    if (attempt.elapsedMs <= simulation.durationMinutes * 60_000) {
      timely += new Set(
        (answersBySimulationAttempt.get(attempt.id) ?? [])
          .filter((answer) => answer.selectedAnswer !== null && activeExamQuestionIds.has(answer.questionId))
          .map((answer) => answer.questionId),
      ).size;
    }
  }

  const activityDays = new Set<string>();
  const addActivity = (instant: string) => {
    try {
      activityDays.add(madridDayKey(instant));
    } catch {
      // Ignore malformed historical rows instead of corrupting the dashboard.
    }
  };
  practiceAttempts.forEach((attempt) => addActivity(attempt.createdAt));
  activeEvents.forEach((event) => addActivity(event.occurredAt));
  activeSimulationAttempts.forEach((attempt) => addActivity(attempt.createdAt));
  input.lessonActivity
    .filter((activity) => activeLessonIds.has(activity.lessonId))
    .forEach((activity) => addActivity(activity.occurredAt));
  let streak = 0;
  let streakDay = activityDays.has(today)
    ? today
    : activityDays.has(shiftDay(today, -1)) ? shiftDay(today, -1) : null;
  while (streakDay && activityDays.has(streakDay)) {
    streak += 1;
    streakDay = shiftDay(streakDay, -1);
  }

  const concepts = input.concepts.map((concept): ConceptReadinessMetric => {
    const conceptObservations = observations.filter((observation) => (
      activeQuestionById.get(observation.questionId)?.conceptIds.includes(concept.id)
    ));
    const recentConceptObservations = conceptObservations.filter((observation) => (
      withinWindow(observation.occurredAt, accuracyFrom, today)
    ));
    const entry = masteryByConcept.get(concept.id);
    const historical = rate(conceptObservations);
    const recent = rate(recentConceptObservations);
    return {
      conceptId: concept.id,
      conceptTitle: concept.title,
      lessonId: concept.lessonId,
      lessonTitle: concept.lessonTitle,
      status: entry?.status ?? "new",
      dueOn: entry?.dueOn ?? null,
      current: currentConceptIds.has(concept.id),
      correct: historical.correct,
      total: historical.total,
      percentage: historical.percentage,
      recentCorrect: recent.correct,
      recentTotal: recent.total,
      recentPercentage: recent.percentage,
    };
  });

  const lessonCatalog = new Map<string, string>();
  for (const concept of input.concepts) {
    if (!lessonCatalog.has(concept.lessonId)) lessonCatalog.set(concept.lessonId, concept.lessonTitle);
  }
  const lessons = [...lessonCatalog].map(([lessonId, lessonTitle]): LessonReadinessMetric => {
    const lessonConceptIds = new Set(
      input.concepts.filter((concept) => concept.lessonId === lessonId).map((concept) => concept.id),
    );
    const lessonObservations = observations.filter((observation) => (
      activeQuestionById.get(observation.questionId)?.conceptIds.some((conceptId) => lessonConceptIds.has(conceptId))
    ));
    const recentLessonObservations = lessonObservations.filter((observation) => (
      withinWindow(observation.occurredAt, accuracyFrom, today)
    ));
    const historical = rate(lessonObservations);
    const recent = rate(recentLessonObservations);
    const currentConcepts = [...lessonConceptIds].filter((conceptId) => currentConceptIds.has(conceptId)).length;
    return {
      lessonId,
      lessonTitle,
      currentConcepts,
      conceptCount: lessonConceptIds.size,
      domainPercentage: roundPercentage(currentConcepts, lessonConceptIds.size) ?? 0,
      correct: historical.correct,
      total: historical.total,
      percentage: historical.percentage,
      recentCorrect: recent.correct,
      recentTotal: recent.total,
      recentPercentage: recent.percentage,
    };
  });

  const simulationScores = [...activeSimulationAttempts]
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt) || left.id.localeCompare(right.id))
    .map((attempt): SimulationScore => {
      const exam = activeSimulationById.get(attempt.simulationId)!;
      const totalQuestions = exam.questionIds.filter((questionId) => activeQuestionById.has(questionId)).length;
      const netScore = Math.round((attempt.correctCount - attempt.incorrectCount / 3) * 100) / 100;
      return {
        attemptId: attempt.id,
        examId: exam.id,
        examTitle: exam.title,
        netScore,
        normalizedPercentage: roundPercentage(netScore, totalQuestions) ?? 0,
        totalQuestions,
      };
    });

  const sample = {
    uniqueAttemptedQuestions: attemptedQuestionIds.size,
    reviewedConcepts: reviewedConceptIds.size,
  };
  const deferredRetention = {
    retained: retainedRecalls,
    eligible: eligibleRecalls.length,
    percentage: roundPercentage(retainedRecalls, eligibleRecalls.length),
  };
  const speed = { timely, total: speedTotal, percentage: roundPercentage(timely, speedTotal) };
  const evidenceSufficient = sample.uniqueAttemptedQuestions >= 20 && sample.reviewedConcepts >= 10;
  const criteria: ReadinessCriterion[] = [
    {
      key: "evidence",
      label: "Evidencia",
      met: evidenceSufficient,
      explanation: `${sample.uniqueAttemptedQuestions}/20 preguntas activas distintas y ${sample.reviewedConcepts}/10 conceptos revisados.`,
    },
    {
      key: "coverage",
      label: "Cobertura",
      met: coveragePercentage >= 80,
      explanation: `${coveragePercentage}% de preguntas activas cubiertas; objetivo 80%.`,
    },
    {
      key: "domain",
      label: "Dominio vigente",
      met: domainPercentage >= 75,
      explanation: `${domainPercentage}% de conceptos en revisión o consolidados y no vencidos; objetivo 75%.`,
    },
    {
      key: "retention",
      label: "Retención diferida",
      met: deferredRetention.percentage !== null && deferredRetention.percentage >= 70,
      explanation: deferredRetention.percentage === null
        ? "Aún no hay repasos diferidos comparables; objetivo 70%."
        : `${deferredRetention.percentage}% de recuerdos diferidos retenidos; objetivo 70%.`,
    },
    {
      key: "simulations",
      label: "Simulacros recientes",
      met: recentSimulationAttempts.length >= 3,
      explanation: `${recentSimulationAttempts.length}/3 simulacros completados en los últimos 30 días de Madrid.`,
    },
    {
      key: "speed",
      label: "Ritmo",
      met: speed.percentage !== null && speed.percentage >= 85,
      explanation: speed.percentage === null
        ? "Aún no hay respuestas recientes para medir el ritmo; objetivo 85%."
        : `${speed.percentage}% de respuestas recientes dentro del tiempo; objetivo 85%.`,
    },
  ];

  let level: ReadinessLevel;
  if (!evidenceSufficient) level = "insufficient";
  else if (coveragePercentage < 60 || domainPercentage < 50) level = "building";
  else if (criteria.slice(1).every((criterion) => criterion.met)) level = "on_track";
  else level = "consolidating";

  return {
    level,
    label: levelLabel(level),
    sample,
    coverage: { attempted: attemptedQuestionIds.size, total: input.questions.length, percentage: coveragePercentage },
    currentDomain: { current: currentConceptIds.size, total: input.concepts.length, percentage: domainPercentage },
    accuracy: { recent: rate(recentObservations), historical: rate(observations) },
    deferredRetention,
    recentSimulations: recentSimulationAttempts.length,
    speed,
    streak,
    simulationScores,
    concepts,
    lessons,
    criteria,
    mainObstacle: criteria.find((criterion) => !criterion.met) ?? null,
  };
}
