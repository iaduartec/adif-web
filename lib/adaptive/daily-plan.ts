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

export type DailyPracticeQuestion = { id: string };

export type DailySimulationCandidate = {
  examId: string;
  title: string;
  durationMinutes: number;
  sourceYear: number;
};

export type DailySimulationAttempt = { examId: string; attemptedOn: string };

export type DailyPlanAction = {
  planDate: string;
  taskKey: string;
  action: "postpone" | "replace";
  replacementTaskKey: string | null;
};

type BaseTask = { key: string; title: string; estimatedMinutes: number };

export type DailyReviewTask = BaseTask & {
  kind: "review";
  conceptId: string;
  dueOn: string;
  status: "review" | "at_risk";
};

export type DailyLessonTask = BaseTask & {
  kind: "lesson";
  lessonId: string;
  block: number;
};

export type DailyPracticeTask = BaseTask & {
  kind: "practice";
  block: number;
  questionIds: string[];
  questionCount: 5 | 10;
  diagnostic: boolean;
};

export type DailySimulationTask = BaseTask & { kind: "simulation"; examId: string };

export type DailyTask = DailyReviewTask | DailyLessonTask | DailyPracticeTask | DailySimulationTask;

export type DailyPlanInput = {
  date: string;
  availableMinutes: number;
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
  initialBudgets: { review: number; lesson: number; practice: number };
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

export function isCalendarDay(dayKey: string) {
  if (!DAY_PATTERN.test(dayKey)) return false;
  const [year, month, day] = dayKey.split("-").map(Number);
  const roundTrip = new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0, 10);
  return roundTrip === dayKey;
}

function assertInput(input: DailyPlanInput) {
  if (!isCalendarDay(input.date)) throw new Error("Daily plans require a real ISO Madrid date.");
  if (!Number.isInteger(input.availableMinutes) || input.availableMinutes < 0) {
    throw new Error("Daily plan minutes must be a non-negative integer.");
  }
}

function compareText(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function stableHash(values: readonly string[]) {
  let hash = 0x811c9dc5;
  for (const character of values.join("\u001f")) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

function daysBetween(from: string, to: string) {
  if (!isCalendarDay(from) || !isCalendarDay(to)) return Number.NEGATIVE_INFINITY;
  return Math.floor((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}

function hasSufficientEvidence(input: DailyPlanInput) {
  return new Set(input.uniqueAttemptedQuestionIds).size >= 20
    && new Set(input.reviewedConceptIds).size >= 10;
}

function isDebt(task: DailyTask, debt: ReadonlySet<string>) {
  return debt.has(task.key);
}

function debtFirst<T extends DailyTask>(tasks: T[], debt: ReadonlySet<string>) {
  return tasks.sort((left, right) => {
    const leftDebt = isDebt(left, debt);
    const rightDebt = isDebt(right, debt);
    return leftDebt === rightDebt ? 0 : leftDebt ? -1 : 1;
  });
}

function reviewTasks(input: DailyPlanInput, debt: ReadonlySet<string>): DailyReviewTask[] {
  return debtFirst(
    [...input.reviews]
      .filter((candidate) => candidate.dueOn <= input.date && isCalendarDay(candidate.dueOn))
      .sort((left, right) => {
        const dueOrder = compareText(left.dueOn, right.dueOn);
        if (dueOrder !== 0) return dueOrder;
        if (left.status !== right.status) return left.status === "at_risk" ? -1 : 1;
        return compareText(left.conceptId, right.conceptId);
      })
      .map((candidate) => ({
        kind: "review" as const,
        key: `review:${candidate.conceptId}`,
        conceptId: candidate.conceptId,
        title: candidate.title,
        dueOn: candidate.dueOn,
        status: candidate.status,
        estimatedMinutes: REVIEW_MINUTES,
      })),
    debt,
  );
}

function lessonTasks(input: DailyPlanInput, debt: ReadonlySet<string>): DailyLessonTask[] {
  const tasks = [...input.lessons]
    .filter((candidate) => Number.isFinite(candidate.remainingMinutes) && candidate.remainingMinutes >= MIN_LESSON_MINUTES)
    .sort((left, right) => compareText(left.lessonId, right.lessonId))
    .flatMap((candidate) => {
      const tasksForLesson: DailyLessonTask[] = [];
      let remaining = Math.floor(candidate.remainingMinutes);
      let block = 0;
      while (remaining >= MIN_LESSON_MINUTES) {
        const estimatedMinutes = Math.min(LESSON_MINUTES, remaining);
        tasksForLesson.push({
          kind: "lesson",
          key: block === 0 ? `lesson:${candidate.lessonId}` : `lesson:${candidate.lessonId}:block:${block}`,
          lessonId: candidate.lessonId,
          block,
          title: candidate.title,
          estimatedMinutes,
        });
        remaining -= estimatedMinutes;
        block += 1;
      }
      return tasksForLesson;
    });
  return debtFirst(tasks, debt);
}

function practiceTasks(
  input: DailyPlanInput,
  debt: ReadonlySet<string>,
  evidenceSufficient: boolean,
): DailyPracticeTask[] {
  const attempted = new Set(input.uniqueAttemptedQuestionIds);
  const ids = [...new Set(input.practiceQuestions.map(({ id }) => id))]
    .filter((id) => !attempted.has(id))
    .sort(compareText);
  const tasks: DailyPracticeTask[] = [];
  const preferShortBlocks = evidenceSufficient && Math.floor(input.availableMinutes * 0.25) < PRACTICE_MINUTES;
  let offset = 0;
  let block = 0;
  while (ids.length - offset >= 5) {
    const questionCount = !preferShortBlocks && ids.length - offset >= 10 ? 10 : 5;
    const questionIds = ids.slice(offset, offset + questionCount);
    const diagnostic = !evidenceSufficient && block === 0;
    tasks.push({
      kind: "practice",
      key: `practice:${diagnostic ? "diagnostic" : "new"}:block:${block}:${stableHash(questionIds)}`,
      title: diagnostic ? "Práctica diagnóstica" : "Práctica de preguntas nuevas",
      estimatedMinutes: questionCount === 10 ? PRACTICE_MINUTES : SHORT_PRACTICE_MINUTES,
      block,
      questionIds,
      questionCount,
      diagnostic,
    });
    offset += questionCount;
    block += 1;
  }
  return debtFirst(tasks, debt);
}

function simulationEligible(input: DailyPlanInput, evidenceSufficient: boolean) {
  if (evidenceSufficient) return true;
  const lastAttempt = [...input.simulationAttempts]
    .filter((attempt) => isCalendarDay(attempt.attemptedOn))
    .sort((left, right) => compareText(right.attemptedOn, left.attemptedOn))[0];
  return Boolean(lastAttempt && daysBetween(lastAttempt.attemptedOn, input.date) >= 7);
}

function simulationTasks(
  input: DailyPlanInput,
  debt: ReadonlySet<string>,
  evidenceSufficient: boolean,
): DailySimulationTask[] {
  if (!simulationEligible(input, evidenceSufficient)) return [];
  const lastAttemptByExam = new Map<string, string>();
  for (const attempt of input.simulationAttempts) {
    const previous = lastAttemptByExam.get(attempt.examId);
    if (!previous || attempt.attemptedOn > previous) lastAttemptByExam.set(attempt.examId, attempt.attemptedOn);
  }
  const tasks = [...input.simulations]
    .filter((exam) => Number.isInteger(exam.durationMinutes) && exam.durationMinutes > 0 && exam.durationMinutes <= input.availableMinutes)
    .sort((left, right) => {
      const leftAttempt = lastAttemptByExam.get(left.examId);
      const rightAttempt = lastAttemptByExam.get(right.examId);
      if (Boolean(leftAttempt) !== Boolean(rightAttempt)) return leftAttempt ? 1 : -1;
      if (leftAttempt && rightAttempt) {
        const attemptOrder = compareText(leftAttempt, rightAttempt);
        if (attemptOrder !== 0) return attemptOrder;
      }
      return left.sourceYear - right.sourceYear || compareText(left.examId, right.examId);
    })
    .map((exam) => ({
      kind: "simulation" as const,
      key: `simulation:${exam.examId}`,
      examId: exam.examId,
      title: exam.title,
      estimatedMinutes: exam.durationMinutes,
    }));
  return debtFirst(tasks, debt);
}

type CandidatePools = {
  review: DailyReviewTask[];
  lesson: DailyLessonTask[];
  practice: Array<DailySimulationTask | DailyPracticeTask>;
};

function buildCandidatePools(input: DailyPlanInput): CandidatePools {
  const debt = new Set(input.postponedTaskKeysYesterday);
  const evidenceSufficient = hasSufficientEvidence(input);
  const simulations = simulationTasks(input, debt, evidenceSufficient);
  const practice = practiceTasks(input, debt, evidenceSufficient);
  return {
    review: reviewTasks(input, debt),
    lesson: lessonTasks(input, debt),
    practice: debtFirst([...simulations, ...practice], debt),
  };
}

export function listDailyTaskCandidates(input: DailyPlanInput): DailyTask[] {
  assertInput(input);
  const pools = buildCandidatePools(input);
  return [...pools.review, ...pools.lesson, ...pools.practice];
}

function applyActions(tasks: DailyTask[], input: DailyPlanInput, candidates: DailyTask[]) {
  const candidateByKey = new Map(candidates.map((task) => [task.key, task]));
  const actions = input.actions
    .filter((action) => action.planDate === input.date)
    .sort((left, right) => compareText(left.taskKey, right.taskKey));
  const actionByKey = new Map(actions.map((action) => [action.taskKey, action]));
  const actedKeys = new Set(actions.map((action) => action.taskKey));
  const targetCounts = new Map<string, number>();
  for (const action of actions) {
    if (action.replacementTaskKey) {
      targetCounts.set(action.replacementTaskKey, (targetCounts.get(action.replacementTaskKey) ?? 0) + 1);
    }
  }
  const originallySelected = new Set(tasks.map((task) => task.key));
  const result: DailyTask[] = [];

  for (const task of tasks) {
    const action = actionByKey.get(task.key);
    if (!action) {
      if (canAppendTask(result, task, input)) result.push(task);
      continue;
    }
    if (action.action === "postpone") continue;
    const targetKey = action.replacementTaskKey;
    const replacement = targetKey ? candidateByKey.get(targetKey) : undefined;
    const replacementValid = Boolean(
      targetKey
      && targetKey !== task.key
      && replacement
      && replacement.estimatedMinutes <= task.estimatedMinutes
      && !originallySelected.has(targetKey)
      && !actedKeys.has(targetKey)
      && targetCounts.get(targetKey) === 1,
    );
    if (replacementValid && canAppendTask(result, replacement!, input)) {
      result.push(replacement!);
    } else if (canAppendTask(result, task, input)) {
      result.push(task);
    }
  }
  return result;
}

function takeFirstFitting<T extends DailyTask>(
  pool: T[],
  selected: Set<string>,
  capacity: number,
  predicate: (task: T) => boolean = () => true,
) {
  return pool.find((task) => !selected.has(task.key) && task.estimatedMinutes <= capacity && predicate(task));
}

function lessonReady(task: DailyLessonTask, selected: ReadonlySet<string>) {
  if (task.block === 0) return true;
  const previousKey = task.block === 1
    ? `lesson:${task.lessonId}`
    : `lesson:${task.lessonId}:block:${task.block - 1}`;
  return selected.has(previousKey);
}

function canAppendTask(tasks: readonly DailyTask[], task: DailyTask, input: DailyPlanInput) {
  if (tasks.some((selected) => selected.key === task.key)) return false;
  const allocatedMinutes = tasks.reduce((total, selected) => total + selected.estimatedMinutes, 0);
  if (allocatedMinutes + task.estimatedMinutes > input.availableMinutes) return false;
  if (task.kind === "review") {
    const reviewMinutes = tasks
      .filter((selected) => selected.kind === "review")
      .reduce((total, selected) => total + selected.estimatedMinutes, 0);
    if (reviewMinutes + task.estimatedMinutes > Math.floor(input.availableMinutes * 0.6)) return false;
  }
  if (task.kind === "simulation" && tasks.some((selected) => selected.kind === "simulation")) return false;
  if (task.kind === "lesson" && !lessonReady(task, new Set(tasks.map((selected) => selected.key)))) return false;
  return true;
}

function selectSufficient(input: DailyPlanInput, pools: CandidatePools, budgets: DailyPlan["initialBudgets"]) {
  const tasks: DailyTask[] = [];
  const selected = new Set<string>();
  let allocated = 0;
  let reviewMinutes = 0;
  const reviewCap = Math.floor(input.availableMinutes * 0.6);

  const add = (task: DailyTask) => {
    tasks.push(task);
    selected.add(task.key);
    allocated += task.estimatedMinutes;
    if (task.kind === "review") reviewMinutes += task.estimatedMinutes;
  };
  const fillCategory = (
    pool: DailyTask[],
    budget: number,
    review = false,
    predicate: (task: DailyTask) => boolean = () => true,
  ) => {
    let categoryMinutes = 0;
    while (true) {
      const task = takeFirstFitting(pool, selected, budget - categoryMinutes, (candidate) => (
        predicate(candidate)
        && canAppendTask(tasks, candidate, input)
        && (!review || reviewMinutes + candidate.estimatedMinutes <= reviewCap)
      ));
      if (!task) break;
      add(task);
      categoryMinutes += task.estimatedMinutes;
    }
  };

  fillCategory(pools.review, budgets.review, true);
  fillCategory(pools.lesson, budgets.lesson, false, (task) => (
    task.kind !== "lesson" || lessonReady(task, selected)
  ));
  fillCategory(pools.practice, budgets.practice);

  while (allocated < input.availableMinutes) {
    const capacity = input.availableMinutes - allocated;
    const exactLesson = takeFirstFitting(pools.lesson, selected, capacity, (task) => lessonReady(task, selected));
    const partialLesson = exactLesson ?? pools.lesson.find((task) => (
      !selected.has(task.key)
      && lessonReady(task, selected)
      && task.estimatedMinutes > capacity
      && capacity >= MIN_LESSON_MINUTES
    ));
    const options = [
      takeFirstFitting(pools.review, selected, capacity, (task) => reviewMinutes + task.estimatedMinutes <= reviewCap),
      partialLesson && partialLesson.estimatedMinutes > capacity
        ? { ...partialLesson, estimatedMinutes: capacity }
        : partialLesson,
      takeFirstFitting(pools.practice, selected, capacity, (task) => canAppendTask(tasks, task, input)),
    ]
      .filter((task): task is DailyTask => Boolean(task))
      .filter((task) => canAppendTask(tasks, task, input));
    if (options.length === 0) break;
    const debt = new Set(input.postponedTaskKeysYesterday);
    options.sort((left, right) => {
      const leftDebt = isDebt(left, debt);
      const rightDebt = isDebt(right, debt);
      if (leftDebt !== rightDebt) return leftDebt ? -1 : 1;
      const priority = { review: 0, lesson: 1, simulation: 2, practice: 2 } as const;
      return priority[left.kind] - priority[right.kind];
    });
    add(options[0]);
  }
  return tasks;
}

function selectInsufficient(input: DailyPlanInput, pools: CandidatePools) {
  const tasks: DailyTask[] = [];
  const selected = new Set<string>();
  let allocated = 0;
  const add = (task: DailyTask) => {
    tasks.push(task);
    selected.add(task.key);
    allocated += task.estimatedMinutes;
  };
  const diagnostic = pools.practice.find((task) => task.kind === "practice" && task.diagnostic);
  if (diagnostic && canAppendTask(tasks, diagnostic, input)) add(diagnostic);
  const firstLesson = pools.lesson.find((task) => lessonReady(task, selected));
  if (firstLesson) {
    const capacity = input.availableMinutes - allocated;
    if (firstLesson.estimatedMinutes <= capacity) add(firstLesson);
    else if (capacity >= MIN_LESSON_MINUTES) add({ ...firstLesson, estimatedMinutes: capacity });
  }

  while (allocated < input.availableMinutes) {
    const capacity = input.availableMinutes - allocated;
    const practice = takeFirstFitting(pools.practice, selected, capacity, (task) => canAppendTask(tasks, task, input));
    const lesson = takeFirstFitting(pools.lesson, selected, capacity, (task) => lessonReady(task, selected));
    const next = practice ?? lesson;
    if (next) {
      add(next);
      continue;
    }
    const partialLesson = pools.lesson.find((task) => (
      !selected.has(task.key)
      && lessonReady(task, selected)
      && task.estimatedMinutes > capacity
      && capacity >= MIN_LESSON_MINUTES
    ));
    if (!partialLesson) break;
    add({ ...partialLesson, estimatedMinutes: capacity });
  }
  return tasks;
}

export function buildDailyPlan(input: DailyPlanInput): DailyPlan {
  assertInput(input);
  const evidenceSufficient = hasSufficientEvidence(input);
  const initialBudgets = {
    review: Math.floor(input.availableMinutes * 0.4),
    lesson: Math.floor(input.availableMinutes * 0.35),
    practice: Math.floor(input.availableMinutes * 0.25),
  };
  const pools = buildCandidatePools(input);
  const candidates = [...pools.review, ...pools.lesson, ...pools.practice];
  const selected = evidenceSufficient
    ? selectSufficient(input, pools, initialBudgets)
    : selectInsufficient(input, pools);
  const tasks = applyActions(selected, input, candidates);
  const allocatedMinutes = tasks.reduce((total, task) => total + task.estimatedMinutes, 0);
  return {
    date: input.date,
    availableMinutes: input.availableMinutes,
    initialBudgets,
    tasks,
    allocatedMinutes,
    unusedMinutes: input.availableMinutes - allocatedMinutes,
    evidenceSufficient,
  };
}
