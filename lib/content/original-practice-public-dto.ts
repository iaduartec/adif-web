import { z } from "zod";

import {
  type OriginalPracticeQuestion,
  originalPracticeOptionSchema,
  originalPracticeQuestionSchema,
} from "./original-practice-schema";
import { sourceManifest } from "./source-manifest";
import { englishKnowledgeErrorSchema, englishTopicIdSchema } from "./english-a2-curriculum";
import { psychometricAptitudeSchema } from "./psychometric-curriculum";

export const originalPracticeAnswerGroundingDtoSchema = z.object({
  sourceId: z.string().trim().min(1),
  sourceVersion: z.string().trim().min(1),
  title: z.string().trim().min(1),
  organization: z.string().trim().min(1),
  url: z.url(),
  locator: z.string().trim().min(1),
}).strict();

export const originalPracticePublicQuestionSchema = z.object({
  id: z.string().trim().min(1),
  origin: z.literal("original"),
  domain: originalPracticeQuestionSchema.shape.domain,
  topicId: z.string().trim().min(1),
  topic: z.string().trim().min(1),
  skill: z.string().trim().min(1),
  prompt: z.string().trim().min(1),
  options: z.array(originalPracticeOptionSchema).length(4),
  difficulty: z.number().int().min(1).max(3),
  tags: z.array(z.string().trim().min(1)),
  answerGrounding: originalPracticeAnswerGroundingDtoSchema.optional(),
}).strict().superRefine((question, context) => {
  if (question.domain === "english-a2") {
    if (!englishTopicIdSchema.safeParse(question.topicId).success) {
      context.addIssue({ code: "custom", path: ["topicId"], message: "Unknown stable A2 topic ID." });
    }
    if (!englishKnowledgeErrorSchema.safeParse(question.skill).success) {
      context.addIssue({ code: "custom", path: ["skill"], message: "English DTO skills must be knowledge categories." });
    }
  }
  if (question.domain === "psychometric") {
    if (!psychometricAptitudeSchema.safeParse(question.topicId).success) {
      context.addIssue({ code: "custom", path: ["topicId"], message: "Unknown psychometric aptitude ID." });
    }
    if (question.skill !== question.topicId) {
      context.addIssue({ code: "custom", path: ["skill"], message: "Psychometric DTO skills must name the aptitude tested." });
    }
  }
});

export type OriginalPracticeAnswerGroundingDto = z.infer<typeof originalPracticeAnswerGroundingDtoSchema>;
export type OriginalPracticeQuestionDto = z.infer<typeof originalPracticePublicQuestionSchema>;

function getAnswerGrounding(question: OriginalPracticeQuestion): OriginalPracticeAnswerGroundingDto | undefined {
  if (!question.sourceId || !question.sourceVersion || !question.sourceLocator) return undefined;

  const source = sourceManifest.sources.find((candidate) =>
    candidate.sourceId === question.sourceId && candidate.sourceVersion === question.sourceVersion,
  );
  if (!source) return undefined;

  return {
    sourceId: source.sourceId,
    sourceVersion: source.sourceVersion,
    title: source.title,
    organization: source.organization,
    url: source.url,
    locator: question.sourceLocator,
  };
}

/**
 * Projects a reviewed original question for delivery before submission.
 * The key and explanation stay server-side so active tests cannot reveal feedback early.
 */
export function toPublicPracticeQuestion(questionInput: unknown): OriginalPracticeQuestionDto | null {
  const parsed = originalPracticeQuestionSchema.safeParse(questionInput);
  if (!parsed.success || parsed.data.status !== "reviewed") return null;

  const answerGrounding = getAnswerGrounding(parsed.data);
  if ((parsed.data.sourceId && !answerGrounding) || (parsed.data.sourceId && !parsed.data.sourceLocator)) {
    return null;
  }

  const dto = {
    id: parsed.data.id,
    origin: parsed.data.origin,
    domain: parsed.data.domain,
    topicId: parsed.data.topicId,
    topic: parsed.data.topic,
    skill: parsed.data.skill,
    prompt: parsed.data.prompt,
    options: parsed.data.options,
    difficulty: parsed.data.difficulty,
    tags: parsed.data.tags,
    ...(answerGrounding ? { answerGrounding } : {}),
  };

  const validatedDto = originalPracticePublicQuestionSchema.safeParse(dto);
  return validatedDto.success ? validatedDto.data : null;
}
