export type DailyReviewCandidate = {
  conceptId: string;
  title: string;
  dueOn: string;
  status: "review" | "at_risk";
};

export type DailyLessonCandidate = {
  lessonId: string;
  title: string;
  remainingMinutes: number;
};

export type DailyPracticeQuestion = {
  id: string;
};

export type DailySimulationCandidate = {
  examId: string;
  title: string;
  durationMinutes: number;
  sourceYear: number;
};

export type DailySimulationAttempt = {
  examId: string;
  attemptedOn: string;
};

export type DailyPlanAction = {
  planDate: string;
  taskKey: string;
  action: "postpone" | "replace";
  replacementTaskKey: string | null;
};

type BaseTask = {
  key: string;
  title: string;
  estimatedMinutes: number;
};

export type DailyReviewTask = BaseTask & {
  kind: "review";
  conceptId: string;
  dueOn: string;
  status: "review" | "at_risk";
};

export type DailyLessonTask = BaseTask & {
  kind: "lesson";
  lessonId: string;
};

export type DailyPracticeTask = BaseTask & {
  kind: "practice";
  questionIds: string[];
  questionCount: 5 | 10;
  diagnostic: boolean;
};

export type DailySimulationTask = BaseTask & {
  kind: "simulation";
  examId: string;
};

export type DailyTask = DailyReviewTask | DailyLessonTask | DailyPracticeTask | DailySimulationTask;

export type DailyPlanInput = {
  date: string;
  availableMinutes: number;
  evidenceSufficient: boolean;
  reviews: readonly DailyReviewCandidate[];
  lessons: readonly DailyLessonCandidate[];
  practiceQuestions: readonly DailyPracticeQuestion[];
  simulations: readonly DailySimulationCandidate[];
  uniqueAttemptedQuestionIds: readonly string[];
  reviewedConceptIds: readonly string[];
  simulationAttempts: readonly DailySimulationAttempt[];
  postponedTaskKeysYesterday: readonly string[];
  actions: readonly DailyPlanAction[];
};

export type DailyPlan = {
  date: string;
  availableMinutes: number;
  initialBudgets: {
    review: number;
    lesson: number;
    practice: number;
  };
  tasks: DailyTask[];
  allocatedMinutes: number;
  unusedMinutes: number;
  evidenceSufficient: boolean;
};

const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const REVIEW_MINUTES = 3;
const LESSON_MINUTES = 10;
const MIN_LESSON_MINUTES = 5;
const PRACTICE_MINUTES = 12;
const SHORT_PRACTICE_MINUTES = 6;

function assertInput(input: DailyPlanInput) {
  if (!DAY_PATTERN.test(input.date)) throw new Error("Daily plans require an ISO Madrid date.");
  if (!Number.isInteger(input.availableMinutes) || input.availableMinutes < 0) {
    throw new Error("Daily plan minutes must be a non-negative integer.");
  }
}

function stableHash(values: readonly string[]) {
  let hash = 0x811c9dc5;
  for (const character of values.join("\u001f")) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

function compareText(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function daysBetween(from: string, to: string) {
  if (!DAY_PATTERN.test(from) || !DAY_PATTERN.test(to)) return Number.NEGATIVE_INFINITY;
  return Math.floor((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}

function sortedReviews(input: DailyPlanInput): DailyReviewCandidate[] {
  const debt = new Set(input.postponedTaskKeysYesterday);
  return [...input.reviews]
    .filter((candidate) => candidate.dueOn <= input.date)
    .sort((left, right) => {
      const leftDebt = debt.has(`review:${left.conceptId}`);
      const rightDebt = debt.has(`review:${right.conceptId}`);
      if (leftDebt !== rightDebt) return leftDebt ? -1 : 1;
      const dueOrder = compareText(left.dueOn, right.dueOn);
      if (dueOrder !== 0) return dueOrder;
      if (left.status !== right.status) return left.status === "at_risk" ? -1 : 1;
      return compareText(left.conceptId, right.conceptId);
    });
}

function reviewTask(candidate: DailyReviewCandidate): DailyReviewTask {
  return {
    kind: "review",
    key: `review:${candidate.conceptId}`,
    conceptId: candidate.conceptId,
    title: candidate.title,
    dueOn: candidate.dueOn,
    status: candidate.status,
    estimatedMinutes: REVIEW_MINUTES,
  };
}

function sortedLessons(input: DailyPlanInput): DailyLessonCandidate[] {
  return [...input.lessons]
    .filter((candidate) => Number.isFinite(candidate.remainingMinutes) && candidate.remainingMinutes >= MIN_LESSON_MINUTES)
    .sort((left, right) => compareText(left.lessonId, right.lessonId));
}

function lessonTask(
  candidate: DailyLessonCandidate,
  capacity: number,
  allowPartial = true,
): DailyLessonTask | null {
  const fullChunkMinutes = Math.min(LESSON_MINUTES, Math.floor(candidate.remainingMinutes));
  const estimatedMinutes = fullChunkMinutes <= capacity
    ? fullChunkMinutes
    : allowPartial ? capacity : 0;
  if (estimatedMinutes < MIN_LESSON_MINUTES) return null;
  return {
    kind: "lesson",
    key: `lesson:${candidate.lessonId}`,
    lessonId: candidate.lessonId,
    title: candidate.title,
    estimatedMinutes,
  };
}

function practiceTask(
  input: DailyPlanInput,
  capacity: number,
  diagnostic: boolean,
): DailyPracticeTask | null {
  const newQuestionIds = [...new Set(input.practiceQuestions.map(({ id }) => id))]
    .filter((id) => !new Set(input.uniqueAttemptedQuestionIds).has(id))
    .sort(compareText);
  const full = capacity >= PRACTICE_MINUTES && newQuestionIds.length >= 10;
  const short = capacity >= SHORT_PRACTICE_MINUTES && newQuestionIds.length >= 5;
  if (!full && !short) return null;
  const questionCount = full ? 10 : 5;
  const estimatedMinutes = full ? PRACTICE_MINUTES : SHORT_PRACTICE_MINUTES;
  const questionIds = newQuestionIds.slice(0, questionCount);
  return {
    kind: "practice",
    key: `practice:${diagnostic ? "diagnostic" : "new"}:${stableHash(questionIds)}`,
    title: diagnostic ? "Práctica diagnóstica" : "Práctica de preguntas nuevas",
    estimatedMinutes,
    questionIds,
    questionCount,
    diagnostic,
  };
}

function simulationEligible(input: DailyPlanInput) {
  const enoughEvidence = new Set(input.uniqueAttemptedQuestionIds).size >= 20
    && new Set(input.reviewedConceptIds).size >= 10;
  if (enoughEvidence) return true;
  const lastAttempt = [...input.simulationAttempts]
    .sort((left, right) => compareText(right.attemptedOn, left.attemptedOn))[0];
  return Boolean(lastAttempt && daysBetween(lastAttempt.attemptedOn, input.date) >= 7);
}

function simulationTask(input: DailyPlanInput, capacity: number): DailySimulationTask | null {
  if (!simulationEligible(input)) return null;
  const lastAttemptByExam = new Map<string, string>();
  for (const attempt of input.simulationAttempts) {
    const previous = lastAttemptByExam.get(attempt.examId);
    if (!previous || attempt.attemptedOn > previous) lastAttemptByExam.set(attempt.examId, attempt.attemptedOn);
  }
  const candidate = [...input.simulations]
    .filter((exam) => Number.isInteger(exam.durationMinutes) && exam.durationMinutes > 0 && exam.durationMinutes <= capacity)
    .sort((left, right) => {
      const leftAttempt = lastAttemptByExam.get(left.examId);
      const rightAttempt = lastAttemptByExam.get(right.examId);
      if (Boolean(leftAttempt) !== Boolean(rightAttempt)) return leftAttempt ? 1 : -1;
      if (leftAttempt && rightAttempt) {
        const attemptOrder = compareText(leftAttempt, rightAttempt);
        if (attemptOrder !== 0) return attemptOrder;
      }
      if (left.sourceYear !== right.sourceYear) return left.sourceYear - right.sourceYear;
      return compareText(left.examId, right.examId);
    })[0];
  if (!candidate) return null;
  return {
    kind: "simulation",
    key: `simulation:${candidate.examId}`,
    examId: candidate.examId,
    title: candidate.title,
    estimatedMinutes: candidate.durationMinutes,
  };
}

export function listDailyTaskCandidates(input: DailyPlanInput): DailyTask[] {
  assertInput(input);
  const tasks: DailyTask[] = [
    ...sortedReviews(input).map(reviewTask),
    ...sortedLessons(input).map((candidate) => lessonTask(candidate, LESSON_MINUTES)).filter((task): task is DailyLessonTask => Boolean(task)),
  ];
  const practice = practiceTask(input, PRACTICE_MINUTES, !input.evidenceSufficient);
  if (practice) tasks.push(practice);
  const simulation = simulationTask(input, input.availableMinutes);
  if (simulation) tasks.push(simulation);
  return tasks;
}

function applyActions(tasks: DailyTask[], input: DailyPlanInput, candidates: DailyTask[]) {
  const candidateByKey = new Map(candidates.map((task) => [task.key, task]));
  const actionByKey = new Map(
    input.actions
      .filter((action) => action.planDate === input.date)
      .sort((left, right) => compareText(left.taskKey, right.taskKey))
      .map((action) => [action.taskKey, action]),
  );
  const result: DailyTask[] = [];
  for (const task of tasks) {
    const action = actionByKey.get(task.key);
    if (!action) {
      result.push(task);
      continue;
    }
    if (action.action === "replace" && action.replacementTaskKey) {
      const replacement = candidateByKey.get(action.replacementTaskKey);
      if (replacement && replacement.estimatedMinutes <= task.estimatedMinutes) result.push(replacement);
    }
  }
  return result.filter((task, index) => result.findIndex(({ key }) => key === task.key) === index);
}

function buildInsufficientPlan(input: DailyPlanInput) {
  const tasks: DailyTask[] = [];
  let remaining = input.availableMinutes;
  const diagnostic = practiceTask(input, remaining, true);
  if (diagnostic) {
    tasks.push(diagnostic);
    remaining -= diagnostic.estimatedMinutes;
  }
  const firstLesson = sortedLessons(input)[0];
  const lesson = firstLesson ? lessonTask(firstLesson, remaining) : null;
  if (lesson) tasks.push(lesson);
  return tasks;
}

export function buildDailyPlan(input: DailyPlanInput): DailyPlan {
  assertInput(input);
  const initialBudgets = {
    review: Math.floor(input.availableMinutes * 0.4),
    lesson: Math.floor(input.availableMinutes * 0.35),
    practice: Math.floor(input.availableMinutes * 0.25),
  };
  const candidates = listDailyTaskCandidates(input);
  let selected: DailyTask[] = [];

  if (!input.evidenceSufficient) {
    selected = buildInsufficientPlan(input);
  } else {
    const reviews = sortedReviews(input);
    const lessons = sortedLessons(input);
    let reviewIndex = 0;
    let lessonIndex = 0;
    let allocated = 0;
    let reviewMinutes = 0;
    let practiceSelected = false;

    const addReviews = (capacity: number) => {
      const reviewCap = Math.floor(input.availableMinutes * 0.6);
      while (
        reviewIndex < reviews.length
        && REVIEW_MINUTES <= capacity
        && reviewMinutes + REVIEW_MINUTES <= reviewCap
      ) {
        selected.push(reviewTask(reviews[reviewIndex++]));
        allocated += REVIEW_MINUTES;
        reviewMinutes += REVIEW_MINUTES;
        capacity -= REVIEW_MINUTES;
      }
    };
    const addLessons = (capacity: number, allowPartial: boolean) => {
      while (lessonIndex < lessons.length && capacity >= MIN_LESSON_MINUTES) {
        const task = lessonTask(lessons[lessonIndex], capacity, allowPartial);
        if (!task) break;
        selected.push(task);
        lessonIndex += 1;
        allocated += task.estimatedMinutes;
        capacity -= task.estimatedMinutes;
      }
    };
    const addPractice = (capacity: number) => {
      if (practiceSelected) return;
      const simulation = simulationTask(input, capacity);
      const task = simulation ?? practiceTask(input, capacity, false);
      if (!task) return;
      selected.push(task);
      practiceSelected = true;
      allocated += task.estimatedMinutes;
    };

    addReviews(initialBudgets.review);
    addLessons(initialBudgets.lesson, false);
    addPractice(initialBudgets.practice);

    let remaining = input.availableMinutes - allocated;
    addReviews(remaining);
    remaining = input.availableMinutes - allocated;
    addLessons(remaining, true);
    remaining = input.availableMinutes - allocated;
    addPractice(remaining);
    // Retain the variable so a future category cannot silently over-allocate without this invariant.
    if (allocated > input.availableMinutes) {
      throw new Error("Daily plan allocation exceeded the available minutes.");
    }
  }

  selected = applyActions(selected, input, candidates);
  const allocatedMinutes = selected.reduce((total, task) => total + task.estimatedMinutes, 0);
  return {
    date: input.date,
    availableMinutes: input.availableMinutes,
    initialBudgets,
    tasks: selected,
    allocatedMinutes,
    unusedMinutes: input.availableMinutes - allocatedMinutes,
    evidenceSufficient: input.evidenceSufficient,
  };
}
