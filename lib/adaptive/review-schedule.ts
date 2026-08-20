export type ReviewRating = 0 | 1 | 2 | 3;

export type MasteryStatus = "new" | "learning" | "review" | "consolidated" | "at_risk";

export type ConceptMastery = {
  status: MasteryStatus;
  repetitions: number;
  easeFactor: number;
  intervalDays: number;
  dueOn: string | null;
  lastReviewedAt: string | null;
  lastEvidenceAt: string | null;
  correctEvidence: number;
  incorrectEvidence: number;
};

type EvidenceBase = {
  occurredAt: string;
  conceptActive: boolean;
};

export type RecallReviewEvidence = EvidenceBase & {
  kind: "recall";
  rating: ReviewRating;
};

export type QuestionReviewEvidence = EvidenceBase & {
  kind: "question";
  questionId: string;
  isCorrect: boolean;
  previousMatchingOccurredAt?: string | null;
};

export type ReviewEvidence = RecallReviewEvidence | QuestionReviewEvidence;

const MADRID_TIME_ZONE = "Europe/Madrid";
const DAY_KEY = /^\d{4}-\d{2}-\d{2}$/;

export function madridDayKey(instant: string | Date): string {
  const date = instant instanceof Date ? instant : new Date(instant);
  if (Number.isNaN(date.getTime())) throw new Error("Invalid review instant.");

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: MADRID_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function addDays(dayKey: string, days: number): string {
  if (!DAY_KEY.test(dayKey)) throw new Error("Invalid review day key.");
  const [year, month, day] = dayKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

function isDuplicateQuestionEvidence(evidence: QuestionReviewEvidence): boolean {
  if (!evidence.previousMatchingOccurredAt) return false;
  const occurredAt = new Date(evidence.occurredAt).getTime();
  const previousAt = new Date(evidence.previousMatchingOccurredAt).getTime();
  return Number.isFinite(occurredAt)
    && Number.isFinite(previousAt)
    && previousAt <= occurredAt
    && occurredAt - previousAt < 24 * 60 * 60 * 1_000;
}

export function applyReviewSchedule(
  current: ConceptMastery,
  evidence: ReviewEvidence,
  today: string,
): ConceptMastery | null {
  if (!evidence.conceptActive) return null;
  if (evidence.kind === "question" && isDuplicateQuestionEvidence(evidence)) return null;

  if (evidence.kind === "question" && evidence.isCorrect) {
    const latestAllowedDueOn = addDays(today, 2);
    return {
      ...current,
      status: current.status === "review" || current.status === "consolidated"
        ? current.status
        : "learning",
      dueOn: current.dueOn && current.dueOn <= latestAllowedDueOn
        ? current.dueOn
        : latestAllowedDueOn,
      lastEvidenceAt: evidence.occurredAt,
      correctEvidence: current.correctEvidence + 1,
    };
  }

  const rating: ReviewRating = evidence.kind === "question" ? 0 : evidence.rating;
  const isSuccessfulRecall = rating > 0;
  const evidenceCounts = {
    correctEvidence: current.correctEvidence + (isSuccessfulRecall ? 1 : 0),
    incorrectEvidence: current.incorrectEvidence + (isSuccessfulRecall ? 0 : 1),
  };

  if (rating === 0) {
    return {
      ...current,
      ...evidenceCounts,
      status: "at_risk",
      repetitions: 0,
      intervalDays: 1,
      dueOn: addDays(today, 1),
      lastReviewedAt: evidence.kind === "recall" ? evidence.occurredAt : current.lastReviewedAt,
      lastEvidenceAt: evidence.occurredAt,
    };
  }

  if (rating === 1) {
    return {
      ...current,
      ...evidenceCounts,
      status: "learning",
      intervalDays: 2,
      dueOn: addDays(today, 2),
      lastReviewedAt: evidence.occurredAt,
      lastEvidenceAt: evidence.occurredAt,
    };
  }

  const repetitions = current.repetitions + 1;
  const initialInterval = rating === 2 ? 3 : 7;
  const multiplier = rating === 2 ? 2 : 2.5;
  const intervalDays = Math.min(
    60,
    current.repetitions === 0 || current.intervalDays === 0
      ? initialInterval
      : Math.round(current.intervalDays * multiplier),
  );

  return {
    ...current,
    ...evidenceCounts,
    status: repetitions >= 3 && intervalDays >= 14 ? "consolidated" : "review",
    repetitions,
    intervalDays,
    dueOn: addDays(today, intervalDays),
    lastReviewedAt: evidence.occurredAt,
    lastEvidenceAt: evidence.occurredAt,
  };
}
