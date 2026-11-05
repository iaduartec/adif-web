import { z } from "zod";

const answerSchema = z.enum(["A", "B", "C", "D"]);
const domainSchema = z.enum(["telecom", "general-knowledge", "english-a2", "psychometric"]);
const idPrefix: Record<z.infer<typeof domainSchema>, string> = {
  telecom: "orig-tel-",
  "general-knowledge": "orig-gen-",
  "english-a2": "orig-a2-",
  psychometric: "orig-psico-",
};

/**
 * Design spike only. This codec is not connected to sessionStorage or the UI.
 * A future opt-in recovery flow would store only student choices and identity
 * tokens, never answer keys, explanations, account identifiers, or source text.
 */
const recoveryDraftSchema = z.object({
  schemaVersion: z.literal(1),
  attemptId: z.uuid(),
  domain: domainSchema,
  createdAt: z.number().int().positive(),
  questionIds: z.array(z.string().regex(/^orig-[a-z0-9-]+$/)).min(1).max(500),
  answers: z.record(z.string(), answerSchema),
  currentIndex: z.number().int().nonnegative(),
  deadlineAt: z.number().int().positive().nullable(),
  clientEventIds: z.record(z.string(), z.uuid()),
}).strict().superRefine((draft, context) => {
  const questions = new Set(draft.questionIds);
  if (questions.size !== draft.questionIds.length) {
    context.addIssue({ code: "custom", path: ["questionIds"], message: "Question IDs must be unique." });
  }
  if (draft.currentIndex >= draft.questionIds.length) {
    context.addIssue({ code: "custom", path: ["currentIndex"], message: "Current index must point to a question." });
  }
  if (draft.questionIds.some((id) => !id.startsWith(idPrefix[draft.domain]))) {
    context.addIssue({ code: "custom", path: ["questionIds"], message: "Question IDs must belong to the selected original domain." });
  }
  for (const id of [...Object.keys(draft.answers), ...Object.keys(draft.clientEventIds)]) {
    if (!questions.has(id)) {
      context.addIssue({ code: "custom", path: ["answers"], message: "Recovery data references an unknown question." });
    }
  }
  for (const id of Object.keys(draft.answers)) {
    if (!draft.clientEventIds[id]) {
      context.addIssue({ code: "custom", path: ["clientEventIds"], message: "Answered questions require stable retry IDs." });
    }
  }
});

export type OriginalSimulationRecoveryDraft = z.infer<typeof recoveryDraftSchema>;
export type OriginalSimulationRecoveryParse =
  | { status: "ready"; draft: OriginalSimulationRecoveryDraft }
  | { status: "expired" }
  | { status: "invalid" };

export function serializeOriginalSimulationRecoveryDraft(input: OriginalSimulationRecoveryDraft): string {
  return JSON.stringify(recoveryDraftSchema.parse(input));
}

export function parseOriginalSimulationRecoveryDraft(
  serialized: string,
  now = Date.now(),
  retentionMs = 24 * 60 * 60 * 1000,
): OriginalSimulationRecoveryParse {
  let value: unknown;
  try {
    value = JSON.parse(serialized);
  } catch {
    return { status: "invalid" };
  }
  const parsed = recoveryDraftSchema.safeParse(value);
  if (!parsed.success || parsed.data.createdAt > now + 5 * 60 * 1000) return { status: "invalid" };
  if (now - parsed.data.createdAt >= retentionMs || (parsed.data.deadlineAt !== null && parsed.data.deadlineAt <= now)) {
    return { status: "expired" };
  }
  return { status: "ready", draft: parsed.data };
}
