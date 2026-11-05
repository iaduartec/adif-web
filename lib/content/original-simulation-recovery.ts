import { z } from "zod";
import type { OriginalPracticeQuestionDto } from "./original-practice-public-dto";
import type { OriginalPracticeDomain } from "./original-practice-schema";

export const ORIGINAL_SIMULATION_RECOVERY_KEY = "adif360:original-simulation:v2";
export const ORIGINAL_SIMULATION_RECOVERY_TTL_MS = 24 * 60 * 60 * 1000;

const answerSchema = z.enum(["A", "B", "C", "D"]);
const domainSchema = z.enum(["telecom", "general-knowledge", "english-a2", "psychometric"]);
const idPrefix: Record<OriginalPracticeDomain, string> = {
  telecom: "orig-tel-",
  "general-knowledge": "orig-gen-",
  "english-a2": "orig-a2-",
  psychometric: "orig-psico-",
};

const correctionSchema = z.object({
  questionId: z.string(),
  selectedAnswer: answerSchema.nullable(),
  correctAnswer: answerSchema,
  isCorrect: z.boolean(),
  explanation: z.string().min(1),
}).strict();

const recoveryDraftSchema = z.object({
  schemaVersion: z.literal(2),
  attemptId: z.uuid(),
  domain: domainSchema,
  startedAt: z.number().int().positive(),
  questionIds: z.array(z.string().regex(/^orig-[a-z0-9-]+$/)).min(1).max(500),
  questionFingerprints: z.record(z.string(), z.string().regex(/^[a-f0-9]{8}-[a-f0-9]{8}$/)),
  answers: z.record(z.string(), answerSchema),
  currentIndex: z.number().int().nonnegative(),
  deadlineAt: z.number().int().positive().nullable(),
  elapsedMsByQuestion: z.record(z.string(), z.number().int().nonnegative().max(86_400_000)),
  currentQuestionStartedAt: z.number().int().positive(),
  clientEventIds: z.record(z.string(), z.uuid()),
  deliveryState: z.enum(["in_progress", "submitting", "submission_unknown", "conflict", "recoverable_error", "delivered"]),
  corrections: z.array(correctionSchema).optional(),
}).strict().superRefine((draft, context) => {
  const ids = new Set(draft.questionIds);
  if (ids.size !== draft.questionIds.length) {
    context.addIssue({ code: "custom", path: ["questionIds"], message: "Question IDs must be unique." });
  }
  if (draft.currentIndex >= draft.questionIds.length) {
    context.addIssue({ code: "custom", path: ["currentIndex"], message: "Current index must point to a question." });
  }
  if (draft.questionIds.some((id) => !id.startsWith(idPrefix[draft.domain]))) {
    context.addIssue({ code: "custom", path: ["questionIds"], message: "Question IDs must belong to the selected original domain." });
  }
  const expectedIds = [...draft.questionIds].sort();
  for (const field of ["questionFingerprints", "answers", "elapsedMsByQuestion", "clientEventIds"] as const) {
    const keys = Object.keys(draft[field]);
    if (keys.some((id) => !ids.has(id))) {
      context.addIssue({ code: "custom", path: [field], message: "Recovery data references a question outside this attempt." });
    }
    if (field === "questionFingerprints" && (keys.length !== ids.size || [...keys].sort().some((id, index) => id !== expectedIds[index]))) {
      context.addIssue({ code: "custom", path: [field], message: "Each current question needs a stored version fingerprint." });
    }
  }
  for (const id of Object.keys(draft.answers)) {
    if (!draft.clientEventIds[id]) {
      context.addIssue({ code: "custom", path: ["clientEventIds"], message: "Answered questions require stable retry IDs." });
    }
  }
  if ((draft.deliveryState === "delivered") !== Boolean(draft.corrections)) {
    context.addIssue({ code: "custom", path: ["corrections"], message: "Only delivered attempts may store corrections." });
  }
  if (draft.corrections && (draft.corrections.length !== draft.questionIds.length ||
    draft.corrections.some((item, index) => item.questionId !== draft.questionIds[index]))) {
    context.addIssue({ code: "custom", path: ["corrections"], message: "Delivered corrections must match the original question order." });
  }
  for (const correction of draft.corrections ?? []) {
    const expectedAnswer = draft.answers[correction.questionId] ?? null;
    if (correction.selectedAnswer !== expectedAnswer ||
      correction.isCorrect !== (expectedAnswer !== null && expectedAnswer === correction.correctAnswer)) {
      context.addIssue({ code: "custom", path: ["corrections"], message: "Delivered score must match the saved answers and correction keys." });
    }
  }
});

export type OriginalSimulationRecoveryDraft = z.infer<typeof recoveryDraftSchema>;
export type OriginalSimulationRecoveryParse =
  | { status: "ready"; draft: OriginalSimulationRecoveryDraft; remainingSeconds: number | null }
  | { status: "expired" }
  | { status: "invalid" }
  | { status: "missing" }
  | { status: "unavailable" };

export function originalSimulationRecoveryStorageKey(domain: OriginalPracticeDomain, recoveryScope: string) {
  if (!/^[a-f0-9]{24}$/.test(recoveryScope)) throw new Error("Invalid local recovery scope.");
  return `${ORIGINAL_SIMULATION_RECOVERY_KEY}:${domain}:${recoveryScope}`;
}

function fingerprint(question: OriginalPracticeQuestionDto) {
  const value = JSON.stringify(question);
  let first = 0x811c9dc5;
  let second = 0x9e3779b9;
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    first = Math.imul(first ^ code, 0x01000193) >>> 0;
    second = Math.imul(second ^ (code + index), 0x85ebca6b) >>> 0;
  }
  return `${first.toString(16).padStart(8, "0")}-${second.toString(16).padStart(8, "0")}`;
}

function withQuestionFingerprints(
  input: OriginalSimulationRecoveryDraft,
  questions: readonly OriginalPracticeQuestionDto[],
): OriginalSimulationRecoveryDraft {
  const byId = new Map(questions.map((question) => [question.id, question]));
  const questionFingerprints = Object.fromEntries(input.questionIds.map((id) => {
    const question = byId.get(id);
    if (!question || question.domain !== input.domain) throw new Error("Recovery questions no longer match the active bank.");
    return [id, fingerprint(question)];
  }));
  return recoveryDraftSchema.parse({ ...input, questionFingerprints });
}

export function serializeOriginalSimulationRecoveryDraft(
  input: OriginalSimulationRecoveryDraft,
  questions: readonly OriginalPracticeQuestionDto[],
) {
  return JSON.stringify(withQuestionFingerprints(input, questions));
}

export function parseOriginalSimulationRecoveryDraft(
  serialized: string,
  questions: readonly OriginalPracticeQuestionDto[],
  now = Date.now(),
  retentionMs = ORIGINAL_SIMULATION_RECOVERY_TTL_MS,
): OriginalSimulationRecoveryParse {
  let value: unknown;
  try { value = JSON.parse(serialized); } catch { return { status: "invalid" }; }
  const parsed = recoveryDraftSchema.safeParse(value);
  if (!parsed.success || parsed.data.startedAt > now + 5 * 60 * 1000) return { status: "invalid" };
  const draft = parsed.data;
  if (now - draft.startedAt >= retentionMs) return { status: "expired" };

  const byId = new Map(questions.map((question) => [question.id, question]));
  for (const id of draft.questionIds) {
    const question = byId.get(id);
    if (!question || question.domain !== draft.domain || fingerprint(question) !== draft.questionFingerprints[id]) {
      return { status: "invalid" };
    }
    const answer = draft.answers[id];
    if (answer && !question.options.some((option) => option.key === answer)) return { status: "invalid" };
  }
  const remainingSeconds = draft.deadlineAt === null
    ? null
    : Math.max(0, Math.ceil((draft.deadlineAt - now) / 1000));
  return { status: "ready", draft, remainingSeconds };
}

export function saveOriginalSimulationRecovery(
  storage: Storage,
  draft: OriginalSimulationRecoveryDraft,
  recoveryScope: string,
  questions: readonly OriginalPracticeQuestionDto[],
) {
  try {
    storage.setItem(originalSimulationRecoveryStorageKey(draft.domain, recoveryScope), serializeOriginalSimulationRecoveryDraft(draft, questions));
    return true;
  } catch { return false; }
}

export function loadOriginalSimulationRecovery(
  storage: Storage,
  domain: OriginalPracticeDomain,
  recoveryScope: string,
  questions: readonly OriginalPracticeQuestionDto[],
  now = Date.now(),
): OriginalSimulationRecoveryParse {
  try {
    const serialized = storage.getItem(originalSimulationRecoveryStorageKey(domain, recoveryScope));
    if (!serialized) return { status: "missing" };
    const parsed = parseOriginalSimulationRecoveryDraft(serialized, questions, now);
    if (parsed.status === "expired" || parsed.status === "invalid") clearOriginalSimulationRecovery(storage, domain, recoveryScope);
    return parsed;
  } catch { return { status: "unavailable" }; }
}

export function clearOriginalSimulationRecovery(storage: Storage, domain: OriginalPracticeDomain, recoveryScope: string) {
  try { storage.removeItem(originalSimulationRecoveryStorageKey(domain, recoveryScope)); } catch { /* Storage can be blocked by browser policy. */ }
}
