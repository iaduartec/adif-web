import { z } from "zod";
import catalog from "../../content/official-exams/english-topics.json";
import { lessonTheories } from "../../content/lesson-theory";
import { englishTopicCatalogSchema } from "./schema";

const englishConceptIds = new Set(lessonTheories["ingles-a2"]!.concepts.map(({ id }) => id));

/** The shared catalog remains didactic; this does not approve historical text. */
export const englishCurriculumSchema = englishTopicCatalogSchema.superRefine((value, context) => {
  value.topics.forEach((topic, index) => {
    if (topic.mappingStatus !== "linked_to_active_theory" || topic.activeConceptIds.length === 0) {
      context.addIssue({ code: "custom", path: ["topics", index, "activeConceptIds"],
        message: "Active original-practice topics require an English teaching concept." });
    }
    if (topic.activeConceptIds.some((id) => !englishConceptIds.has(id))) {
      context.addIssue({ code: "custom", path: ["topics", index, "activeConceptIds"],
        message: "A2 curriculum mappings must reference English teaching concepts." });
    }
  });
});

const curriculum = englishCurriculumSchema.parse(catalog);
const topicIds = new Set(curriculum.topics.map(({ id }) => id));

export function getEnglishCurriculum() {
  return structuredClone(curriculum);
}

export const englishTopicIdSchema = z.string().refine((id) => topicIds.has(id), {
  message: "Unknown stable A2 topic ID.",
});
export const englishKnowledgeErrorSchema = z.enum(["GRAMMAR", "VOCABULARY", "READING", "SIGN", "CONTEXT"]);
export const englishAttemptCauseSchema = z.enum(["CARELESSNESS", "TIME"]);

export const englishAttemptCauseOptions = [
  { value: "CARELESSNESS", label: "Despiste" },
  { value: "TIME", label: "Falta de tiempo" },
] as const;

/** A failed attempt can carry both the knowledge tested and a reported cause. */
export const englishErrorClassificationSchema = z.object({
  topicId: englishTopicIdSchema,
  knowledgeError: englishKnowledgeErrorSchema,
  attemptCause: englishAttemptCauseSchema.optional(),
}).strict();

export type EnglishTopicId = z.infer<typeof englishTopicIdSchema>;
export type EnglishKnowledgeError = z.infer<typeof englishKnowledgeErrorSchema>;
export type EnglishAttemptCause = z.infer<typeof englishAttemptCauseSchema>;
export type EnglishErrorClassification = z.infer<typeof englishErrorClassificationSchema>;

/** Pure aggregation contract; persistence and scheduling belong to later tasks. */
export function summarizeEnglishErrors(inputs: readonly unknown[]) {
  const byTopic: Record<string, number> = {};
  const byKnowledgeError: Partial<Record<EnglishKnowledgeError, number>> = {};
  const byAttemptCause: Partial<Record<EnglishAttemptCause, number>> = {};
  for (const input of inputs) {
    const error = englishErrorClassificationSchema.parse(input);
    byTopic[error.topicId] = (byTopic[error.topicId] ?? 0) + 1;
    byKnowledgeError[error.knowledgeError] = (byKnowledgeError[error.knowledgeError] ?? 0) + 1;
    if (error.attemptCause) byAttemptCause[error.attemptCause] = (byAttemptCause[error.attemptCause] ?? 0) + 1;
  }
  return { byTopic, byKnowledgeError, byAttemptCause };
}
