import { z } from "zod";

import englishTopicCatalog from "../../content/official-exams/english-topics.json";
import questionsJson from "../../content/questions.json";
import { lessonTheories } from "../../content/lesson-theory";
import { activeTheoryConceptRegistry } from "../../content/theory-concepts";
import { officialItems } from "../../content/syllabus";
import { officialQuestionIdSchema, officialQuestionsSchema } from "./schema";
import {
  questionContentFingerprint,
  questionPromptOptionsFingerprint,
} from "./question-content-fingerprint";
import { sourceManifest } from "./source-manifest";

export const originalPracticeDomainSchema = z.enum([
  "general-knowledge",
  "english-a2",
  "psychometric",
  "telecom",
]);

export const originalPracticeStatusSchema = z.enum(["draft", "reviewed"]);
export const originalPracticeProvenanceSchema = z.literal("original");
export const originalPracticeAnswerKeySchema = z.enum(["A", "B", "C", "D"]);

export const originalPracticeOptionSchema = z.object({
  key: originalPracticeAnswerKeySchema,
  text: z.string().trim().min(1),
}).strict();

export const originalPsychometricTopicIds = [
  "verbal",
  "synonym-antonym",
  "numerical",
  "calculation",
  "series",
  "logic",
  "matrices",
  "abstract-patterns",
  "attention",
  "difference-detection",
  "memory",
  "sequences",
  "perceptual-speed",
] as const;

const englishTopicIds = new Set(englishTopicCatalog.topics.map((topic) => topic.id));
const psychometricTopicIds = new Set<string>(originalPsychometricTopicIds);
const parsedOfficialQuestions = officialQuestionsSchema.parse(questionsJson);
const officialQuestionFingerprints = new Set(parsedOfficialQuestions.flatMap((question) => {
  const answers = new Set([
    question.answer,
    question.initialAnswer,
    question.effectiveAnswer,
  ].filter((answer): answer is "A" | "B" | "C" | "D" => answer !== null));

  return [
    question.source.fingerprint,
    ...[...answers].map((answer) => questionContentFingerprint({
      prompt: question.prompt,
      options: question.options,
      answer,
    })),
  ];
}));
const officialQuestionPromptOptionFingerprints = new Set(
  parsedOfficialQuestions.map((question) => questionPromptOptionsFingerprint(question)),
);
const syllabusNodeById = new Map(
  officialItems.flatMap((item) => item.children.map((node) => [
    node.id,
    { scope: item.scope, materialSourceIds: node.materialSourceIds, linkedModules: node.linkedModules },
  ] as const)),
);

function hasExactConceptCitation(
  question: Pick<OriginalPracticeQuestion, "conceptIds" | "sourceId" | "sourceVersion" | "sourceLocator" | "syllabusNodeId">,
) {
  const node = question.syllabusNodeId ? syllabusNodeById.get(question.syllabusNodeId) : undefined;
  if (!node || !question.sourceId || !question.sourceVersion || !question.sourceLocator) return false;

  return node.linkedModules.some((moduleId) => {
    const theory = lessonTheories[moduleId];
    if (!theory) return false;

    const matchingReference = theory.sources.find((source) =>
      source.sourceId === question.sourceId &&
      source.sourceVersion === question.sourceVersion &&
      source.locator === question.sourceLocator,
    );
    if (!matchingReference) return false;

    if (question.conceptIds.length === 0) return true;
    return theory.concepts.some((concept) =>
      question.conceptIds.includes(concept.id) &&
      concept.claims.some((claim) => claim.legalBasis.includes(matchingReference.id)),
    );
  });
}

const questionSourceFields = {
  sourceId: z.string().trim().min(1).optional(),
  sourceVersion: z.string().trim().min(1).optional(),
  sourceLocator: z.string().trim().min(1).optional(),
};

export const originalPracticeQuestionSchema = z.object({
  id: z.string().trim().min(1).refine(
    (id) => !officialQuestionIdSchema.safeParse(id).success,
    { message: "Original question IDs cannot use an official ADIF question ID." },
  ),
  domain: originalPracticeDomainSchema,
  topicId: z.string().trim().min(1),
  topic: z.string().trim().min(1),
  skill: z.string().trim().min(1),
  prompt: z.string().trim().min(1),
  options: z.array(originalPracticeOptionSchema).length(4),
  answer: originalPracticeAnswerKeySchema,
  explanation: z.string().trim().min(1),
  difficulty: z.number().int().min(1).max(3),
  tags: z.array(z.string().trim().min(1)),
  conceptIds: z.array(z.string().trim().min(1)),
  errorCategory: z.string().trim().min(1).optional(),
  syllabusNodeId: z.string().trim().min(1).optional(),
  ...questionSourceFields,
  status: originalPracticeStatusSchema,
  reviewedAt: z.iso.date().optional(),
  origin: originalPracticeProvenanceSchema,
}).strict().superRefine((question, context) => {
  const optionKeys = question.options.map((option) => option.key);
  if (new Set(optionKeys).size !== 4 || ["A", "B", "C", "D"].some((key) => !optionKeys.includes(key as typeof optionKeys[number]))) {
    context.addIssue({
      code: "custom",
      path: ["options"],
      message: "Original questions must provide one option for each key from A through D.",
    });
  }
  const normalizedOptionTexts = question.options.map((option) =>
    option.text.normalize("NFKC").replace(/\s+/g, " ").toLocaleLowerCase(),
  );
  if (new Set(normalizedOptionTexts).size !== 4) {
    context.addIssue({
      code: "custom",
      path: ["options"],
      message: "Original question option texts must be unique after whitespace and case normalization.",
    });
  }
  if (!optionKeys.includes(question.answer)) {
    context.addIssue({
      code: "custom",
      path: ["answer"],
      message: "The answer must reference one of the four original question options.",
    });
  }

  if (
    officialQuestionFingerprints.has(questionContentFingerprint(question)) ||
    officialQuestionPromptOptionFingerprints.has(questionPromptOptionsFingerprint(question))
  ) {
    context.addIssue({
      code: "custom",
      path: ["prompt"],
      message: "Original question content matches an official ADIF question and cannot be registered as original practice.",
    });
  }

  if (new Set(question.conceptIds).size !== question.conceptIds.length) {
    context.addIssue({
      code: "custom",
      path: ["conceptIds"],
      message: "Concept mappings must not contain duplicates.",
    });
  }

  if (question.errorCategory && ["CARELESSNESS", "TIME"].includes(question.errorCategory.toUpperCase())) {
    context.addIssue({
      code: "custom",
      path: ["errorCategory"],
      message: "CARELESSNESS and TIME are learner-reported attempt causes, not question attributes.",
    });
  }

  if (question.domain === "english-a2" && !englishTopicIds.has(question.topicId)) {
    context.addIssue({
      code: "custom",
      path: ["topicId"],
      message: "English A2 topicId must exist in the shared A2 taxonomy.",
    });
  }
  if (question.domain === "psychometric" && !psychometricTopicIds.has(question.topicId)) {
    context.addIssue({
      code: "custom",
      path: ["topicId"],
      message: "Psychometric topicId must use a controlled original aptitude identifier.",
    });
  }
  if (question.domain === "general-knowledge" || question.domain === "telecom") {
    const expectedScope = question.domain === "general-knowledge" ? "common" : "specific-26-12po";
    const syllabusNode = question.syllabusNodeId
      ? syllabusNodeById.get(question.syllabusNodeId)
      : undefined;
    if (!question.syllabusNodeId || !syllabusNode || syllabusNode.scope !== expectedScope || question.topicId !== question.syllabusNodeId) {
      context.addIssue({
        code: "custom",
        path: ["syllabusNodeId"],
        message: "Normative topicId and syllabusNodeId must match an official node in the domain's ADIF scope.",
      });
    }
  } else if (question.syllabusNodeId !== undefined) {
    context.addIssue({
      code: "custom",
      path: ["syllabusNodeId"],
      message: "A2 and psychometric questions cannot claim an official normative syllabus node.",
    });
  }

  const sourceParts = [question.sourceId, question.sourceVersion, question.sourceLocator];
  const hasAnySourcePart = sourceParts.some((part) => part !== undefined);
  const hasEverySourcePart = sourceParts.every((part) => part !== undefined);
  const manifestSource = question.sourceId && question.sourceVersion
    ? sourceManifest.sources.find((source) =>
        source.sourceId === question.sourceId && source.sourceVersion === question.sourceVersion,
      )
    : undefined;

  if (hasAnySourcePart && !hasEverySourcePart) {
    context.addIssue({
      code: "custom",
      path: ["sourceId"],
      message: "Source ID, version and exact locator must be supplied together.",
    });
  } else if (hasEverySourcePart && !manifestSource) {
    context.addIssue({
      code: "custom",
      path: ["sourceId"],
      message: "Question source ID and version must resolve to the source manifest.",
    });
  }

  if (
    (question.domain === "general-knowledge" || question.domain === "telecom") &&
    question.sourceId &&
    !syllabusNodeById.get(question.syllabusNodeId ?? "")?.materialSourceIds.includes(question.sourceId)
  ) {
    context.addIssue({
      code: "custom",
      path: ["sourceId"],
      message: "Normative question source must be listed among the material sources for its syllabus node.",
    });
  }

  if (
    (question.domain === "general-knowledge" || question.domain === "telecom") &&
    question.sourceId && question.sourceVersion && question.sourceLocator &&
    !hasExactConceptCitation(question)
  ) {
    context.addIssue({
      code: "custom",
      path: ["sourceLocator"],
      message: "Normative question locator must match an exact source reference linked to its syllabus node and mapped concept.",
    });
  }

  if (question.status === "reviewed") {
    if (!question.reviewedAt) {
      context.addIssue({
        code: "custom",
        path: ["reviewedAt"],
        message: "Reviewed original questions require a review date.",
      });
    }
    if (question.conceptIds.length === 0 || question.conceptIds.some((id) => !activeTheoryConceptRegistry.has(id))) {
      context.addIssue({
        code: "custom",
        path: ["conceptIds"],
        message: "Reviewed original questions require at least one active learning concept.",
      });
    }
    if ((question.domain === "general-knowledge" || question.domain === "telecom") && (
      !manifestSource ||
      manifestSource.sourceType !== "primary" ||
      manifestSource.authority !== "A" ||
      manifestSource.status !== "verified" ||
      manifestSource.locatorPolicy !== "exact"
    )) {
      context.addIssue({
        code: "custom",
        path: ["sourceId"],
        message: "Reviewed normative questions require an exact locator in a verified primary source.",
      });
    }
  }
});

export const originalPracticeQuestionsSchema = z.array(originalPracticeQuestionSchema).superRefine((questions, context) => {
  const firstIndexById = new Map<string, number>();
  const firstIndexByFingerprint = new Map<string, number>();
  questions.forEach((question, index) => {
    const firstIndex = firstIndexById.get(question.id);
    if (firstIndex !== undefined) {
      context.addIssue({
        code: "custom",
        path: [index, "id"],
        message: `Duplicate original question ID '${question.id}' (first used at index ${firstIndex}).`,
      });
    } else {
      firstIndexById.set(question.id, index);
    }

    const fingerprint = questionPromptOptionsFingerprint(question);
    const firstFingerprintIndex = firstIndexByFingerprint.get(fingerprint);
    if (firstFingerprintIndex !== undefined) {
      context.addIssue({
        code: "custom",
        path: [index, "prompt"],
        message: `Duplicate original question prompt and options fingerprint (first used at index ${firstFingerprintIndex}).`,
      });
    } else {
      firstIndexByFingerprint.set(fingerprint, index);
    }
  });
});

export type OriginalPracticeDomain = z.infer<typeof originalPracticeDomainSchema>;
export type OriginalPracticeStatus = z.infer<typeof originalPracticeStatusSchema>;
export type OriginalPracticeOption = z.infer<typeof originalPracticeOptionSchema>;
export type OriginalPracticeAnswerKey = z.infer<typeof originalPracticeAnswerKeySchema>;
export type OriginalPracticeQuestion = z.infer<typeof originalPracticeQuestionSchema>;
