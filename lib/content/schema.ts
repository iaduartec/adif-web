import { z } from "zod";

import { activeTheoryConceptRegistry } from "../../content/theory-concepts";

export const contentOriginSchema = z.enum([
  "official_reference",
  "original_explanation",
]);

export const publicationStatusSchema = z.enum([
  "link_only",
  "review_pending",
  "approved_for_publication",
  "restricted",
]);

export const officialQuestionValiditySchema = z.enum([
  "current",
  "changed",
  "out_of_scope",
  "pending_review",
]);

export const officialQuestionValidityEvidenceSchema = z.object({
  sourceId: z.string().trim().min(1),
  sourceVersion: z.string().trim().min(1),
  sourceUrl: z.url().refine((url) => new URL(url).protocol === "https:"),
  locator: z.string().trim().min(1),
  reviewedAt: z.iso.date(),
}).strict();

export const correctionSourceReferenceSchema = z
  .object({
    sourceId: z.string().trim().min(1),
    sourceVersion: z.string().trim().min(1),
    sourceUrl: z.url().refine((url) => new URL(url).hostname === "www.adif.es"),
    locator: z.string().trim().min(1),
  })
  .strict();

const answerKeySchema = z.enum(["A", "B", "C", "D"]);
export const officialQuestionIdSchema = z.string().regex(
  /^ADIF-\d{4}-\d{4}-(?:(?:general|english)-)?Q\d{2}$/,
  { message: "Official question IDs must retain their form and section identity." },
);

/** Lowercase SHA-256 digest without an algorithm prefix. */
export const sha256DigestSchema = z.string().regex(/^[a-f0-9]{64}$/i, {
  message: "Expected a 64-character SHA-256 digest.",
});

export type ContentOrigin = z.infer<typeof contentOriginSchema>;

export const verificationStatusSchema = z.enum([
  "draft",
  "reviewed",
  "verified",
]);

export const verificationMetaSchema = z.object({
  status: verificationStatusSchema,
  reviewedAt: z.string().optional(),
  verifiedAt: z.string().optional(),
  reviewedBy: z.string().optional(),
  verifiedBy: z.string().optional(),
});

export const optionSchema = z.object({
  key: z.enum(["A", "B", "C", "D"]),
  text: z.string().trim().min(1),
});

export const questionSchema = z
  .object({
    id: z.string().regex(/^Q\d{4}$/),
    module: z.string().trim().min(1),
    prompt: z.string().trim().min(1),
    options: z.array(optionSchema).length(4),
    answer: z.enum(["A", "B", "C", "D"]),
    explanation: z.string().trim().min(1),
    sourceNote: z.string().trim().min(1),
    origin: contentOriginSchema,
  })
  .superRefine((question, context) => {
    const keys = question.options.map((option) => option.key);
    const requiredKeys = ["A", "B", "C", "D"] as const;

    if (
      keys.length !== requiredKeys.length ||
      new Set(keys).size !== requiredKeys.length ||
      requiredKeys.some((key) => !keys.includes(key))
    ) {
      context.addIssue({
        code: "custom",
        path: ["options"],
        message: "Questions must provide one option for each key from A through D.",
      });
    }

    if (!keys.includes(question.answer)) {
      context.addIssue({
        code: "custom",
        path: ["answer"],
        message: "The answer must reference one of the question options.",
      });
    }
  });

export const lessonReferenceSchema = z.object({
  title: z.string().trim().min(1),
  url: z.url().refine((url) => new URL(url).protocol === "https:", {
    message: "Official lesson references must use HTTPS.",
  }),
  origin: z.literal("official_reference"),
});

export const lessonSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  origin: contentOriginSchema,
  officialReferences: z.array(lessonReferenceSchema).min(1),
  verification: verificationMetaSchema,
});

export const simulationSchema = z
  .object({
    id: z.string().regex(/^SIM-(0[1-9]|[12]\d|30)$/),
    title: z.string().trim().min(1),
    questionIds: z.array(z.string().regex(/^Q\d{4}$/)).length(60),
    origin: contentOriginSchema,
  })
  .superRefine((simulation, context) => {
    if (new Set(simulation.questionIds).size !== simulation.questionIds.length) {
      context.addIssue({
        code: "custom",
        path: ["questionIds"],
        message: "Simulations must not repeat question IDs.",
      });
    }
  });

export const questionsSchema = z.array(questionSchema);
export const lessonsSchema = z.array(lessonSchema);
export const simulationsSchema = z.array(simulationSchema);

export const officialQuestionSourceSchema = z
  .object({
    kind: z.literal("official_adif_exam"),
    year: z.number().int().min(2000).max(2100),
    call: z.string().regex(/^PNI\d{2}\/\d{2}$/),
    profileCode: z.string().regex(/^\d{2}\/\d{2}PO$/),
    profileName: z.string().trim().min(1),
    examCode: z.string().regex(/^\d{4}$/),
    questionNumber: z.number().int().min(1).max(99),
    section: z.enum(["general", "english", "specific"]),
    isReserve: z.boolean(),
    documentUrl: z
      .url()
      .refine((url) => new URL(url).hostname === "www.adif.es"),
    bookletPage: z.number().int().positive(),
    answerKeyPage: z.number().int().positive(),
    verifiedAt: z.iso.date(),
    fingerprint: z.string().regex(/^sha256:[a-f0-9]{64}$/),
  })
  .strict();

const officialQuestionRecordSchema = z
  .object({
    id: officialQuestionIdSchema,
    sectionLabel: z.string().trim().min(1),
    prompt: z.string().trim().min(1),
    conceptIds: z
      .array(z.string().trim().min(1))
      .min(1)
      .refine((conceptIds) => new Set(conceptIds).size === conceptIds.length, {
        message: "Official-question concept mappings must not contain duplicates.",
      })
      .refine(
        (conceptIds) => conceptIds.every((conceptId) => activeTheoryConceptRegistry.has(conceptId)),
        { message: "Official questions may only reference active theory concepts." },
      ),
    syllabusNodeId: z.string().trim().min(1).optional(),
    commonTopicId: z.string().trim().min(1).optional(),
    currentness: z.enum(["current", "changed", "out_of_scope", "unknown"]),
    validityReason: z.string().trim().min(1),
    validityEvidence: officialQuestionValidityEvidenceSchema.nullable(),
    options: z.array(optionSchema).length(4),
    answer: answerKeySchema,
    initialAnswer: answerKeySchema.optional(),
    effectiveAnswer: answerKeySchema.nullable().optional(),
    correctionSource: correctionSourceReferenceSchema.nullable().optional(),
    replacementQuestionNumber: z.number().int().min(1).max(99).nullable().optional(),
    validity: officialQuestionValiditySchema.optional(),
    publicationStatus: publicationStatusSchema.optional(),
    origin: z.literal("official_reference"),
    source: officialQuestionSourceSchema,
  })
  .strict();

export const officialQuestionSchema = officialQuestionRecordSchema
  .transform((question) => ({
    ...question,
    initialAnswer: question.initialAnswer ?? question.answer,
    effectiveAnswer: question.effectiveAnswer ?? null,
    correctionSource: question.correctionSource ?? null,
    replacementQuestionNumber: question.replacementQuestionNumber ?? null,
    validity: question.validity ?? "pending_review" as const,
    publicationStatus: question.publicationStatus ?? "link_only" as const,
  }))
  .superRefine((question, context) => {
    const optionKeys = question.options.map((option) => option.key);
    const requiredKeys = ["A", "B", "C", "D"] as const;
    const sectionSegment = question.source.section === "specific" ? "" : `${question.source.section}-`;
    const expectedId = `ADIF-${question.source.year}-${question.source.examCode}-${sectionSegment}Q${String(
      question.source.questionNumber,
    ).padStart(2, "0")}`;

    if (
      new Set(optionKeys).size !== requiredKeys.length ||
      requiredKeys.some((key) => !optionKeys.includes(key))
    ) {
      context.addIssue({
        code: "custom",
        path: ["options"],
        message: "Official questions must provide one option for each key from A through D.",
      });
    }

    if (!optionKeys.includes(question.answer)) {
      context.addIssue({
        code: "custom",
        path: ["answer"],
        message: "The answer must reference one of the question options.",
      });
    }

    if (question.id !== expectedId) {
      context.addIssue({
        code: "custom",
        path: ["id"],
        message: "The question ID must match its official source metadata.",
      });
    }

    if (question.source.section === "english" && !question.commonTopicId) {
      context.addIssue({
        code: "custom",
        path: ["commonTopicId"],
        message: "English questions require a stable A2 topic ID.",
      });
    }
    if (question.source.section !== "english" && question.commonTopicId !== undefined) {
      context.addIssue({
        code: "custom",
        path: ["commonTopicId"],
        message: "Only English questions may carry a common A2 topic ID.",
      });
    }
    if (question.source.section !== "english" && !question.syllabusNodeId) {
      context.addIssue({
        code: "custom",
        path: ["syllabusNodeId"],
        message: "Specific and General questions require an explicit syllabus node mapping.",
      });
    }

    if (
      question.effectiveAnswer !== null &&
      question.answer !== question.effectiveAnswer
    ) {
      context.addIssue({
        code: "custom",
        path: ["answer"],
        message: "A non-null effective answer must match the question answer used for scoring.",
      });
    }
    if (question.effectiveAnswer === null && question.answer !== question.initialAnswer) {
      context.addIssue({
        code: "custom",
        path: ["answer"],
        message: "A question without a verified effective answer must retain its initial key only.",
      });
    }
    if (
      question.publicationStatus === "approved_for_publication" &&
      (question.validity !== "current" || question.effectiveAnswer === null)
    ) {
      context.addIssue({
        code: "custom",
        path: ["publicationStatus"],
        message: "A published practice question must be current and have an effective answer.",
      });
    }
    if (question.validity !== "pending_review" && question.validityEvidence === null) {
      context.addIssue({
        code: "custom",
        path: ["validityEvidence"],
        message: "A reconciled historical question requires an exact current-source review citation.",
      });
    }
    if (question.currentness === "unknown" && question.validity !== "pending_review") {
      context.addIssue({
        code: "custom",
        path: ["validity"],
        message: "A question with unknown currentness must remain pending review.",
      });
    }
    if (question.currentness !== "unknown" && question.validityEvidence === null) {
      context.addIssue({
        code: "custom",
        path: ["validityEvidence"],
        message: "A classified historical question requires its exact current-source review citation.",
      });
    }
    if (question.validity !== "pending_review" && question.validity !== question.currentness) {
      context.addIssue({
        code: "custom",
        path: ["validity"],
        message: "A reconciled question validity must match its reviewed currentness classification.",
      });
    }
  });

export const officialExamSchema = z
  .object({
    id: z.string().regex(/^ADIF-\d{4}-\d{4}$/),
    title: z.string().trim().min(1),
    source: officialQuestionSourceSchema,
    questionIds: z.array(officialQuestionIdSchema).min(1).max(99),
    durationMinutes: z.number().int().positive(),
    completeness: z.enum(["complete", "specific_part"]),
    scoring: z
      .object({
        correct: z.number().finite(),
        incorrect: z.number().finite(),
        omitted: z.number().finite(),
      })
      .strict(),
  })
  .strict()
  .superRefine((exam, context) => {
    const expectedId = `ADIF-${exam.source.year}-${exam.source.examCode}`;

    if (exam.id !== expectedId) {
      context.addIssue({
        code: "custom",
        path: ["id"],
        message: "The exam ID must match its official source metadata.",
      });
    }

    if (exam.questionIds.some((questionId) => ![
      `${exam.id}-Q`,
      `${exam.id}-general-Q`,
      `${exam.id}-english-Q`,
    ].some((prefix) => questionId.startsWith(prefix)))) {
      context.addIssue({
        code: "custom",
        path: ["questionIds"],
        message: "Official exams may only reference questions from the same exam.",
      });
    }
  });

const isCalendarDate = (value: string): boolean => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  return (
    date.getUTCFullYear() === Number(year) &&
    date.getUTCMonth() === Number(month) - 1 &&
    date.getUTCDate() === Number(day)
  );
};

export const officialCorrectionSchema = z
  .object({
    examId: z.string().regex(/^ADIF-\d{4}-\d{4}$/),
    questionNumber: z.number().int().min(1).max(99),
    initialAnswer: z.enum(["A", "B", "C", "D"]),
    finalAnswer: z.enum(["A", "B", "C", "D"]).nullable(),
    action: z.enum(["confirmed", "changed", "annulled"]),
    replacementQuestionNumber: z.number().int().min(1).max(99).nullable(),
    correctionSource: correctionSourceReferenceSchema,
  })
  .strict()
  .superRefine((correction, context) => {
    if (correction.action === "annulled") {
      if (correction.finalAnswer !== null) {
        context.addIssue({
          code: "custom",
          path: ["finalAnswer"],
          message: "An annulled question has no effective answer.",
        });
      }
      if (correction.replacementQuestionNumber === correction.questionNumber) {
        context.addIssue({
          code: "custom",
          path: ["replacementQuestionNumber"],
          message: "An annulled question cannot replace itself.",
        });
      }
      return;
    }

    if (correction.finalAnswer === null) {
      context.addIssue({
        code: "custom",
        path: ["finalAnswer"],
        message: "A confirmed or changed question must have a final answer.",
      });
    } else if (
      correction.action === "confirmed" &&
      correction.finalAnswer !== correction.initialAnswer
    ) {
      context.addIssue({
        code: "custom",
        path: ["finalAnswer"],
        message: "A confirmed answer must match the initial answer.",
      });
    } else if (
      correction.action === "changed" &&
      correction.finalAnswer === correction.initialAnswer
    ) {
      context.addIssue({
        code: "custom",
        path: ["finalAnswer"],
        message: "A changed answer must differ from the initial answer.",
      });
    }

    if (correction.replacementQuestionNumber !== null) {
      context.addIssue({
        code: "custom",
        path: ["replacementQuestionNumber"],
        message: "Only an annulled question may name a reserve replacement.",
      });
    }
  });

export const publicationReviewSchema = z
  .object({
    decisionId: z.string().trim().min(1),
    decision: z.enum(["approved", "denied", "pending"]),
    permittedUse: z.enum(["metadata_only", "public_question_text"]),
    reviewedAt: z.string().refine(isCalendarDate, {
      message: "The review date must be a real calendar date in YYYY-MM-DD format.",
    }),
    reviewerRole: z.literal("human_editor"),
    scope: z
      .object({
        examIds: z.array(z.string().regex(/^ADIF-\d{4}-\d{4}$/)).min(1),
        sections: z.array(z.enum(["psychometric", "english", "general", "specific"])).optional(),
        content: z.literal("official_question_text"),
      })
      .strict()
      .superRefine((scope, context) => {
        if (new Set(scope.examIds).size !== scope.examIds.length) {
          context.addIssue({ code: "custom", path: ["examIds"], message: "Publication review exam scope must not contain duplicates." });
        }
        if (scope.sections && new Set(scope.sections).size !== scope.sections.length) {
          context.addIssue({ code: "custom", path: ["sections"], message: "Publication review section scope must not contain duplicates." });
        }
      }),
    evidence: z
      .object({
        sourceId: z.string().trim().min(1),
        sourceVersion: z.string().trim().min(1),
        locator: z.string().trim().min(1),
        basis: z.enum(["explicit_license", "written_permission", "documented_legal_review"]),
      })
      .strict(),
    rationale: z.string().trim().min(1),
  })
  .strict();

export const officialCommonSectionNameSchema = z.enum(["psychometric", "english", "general"]);

export const englishTopicSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().trim().min(1),
    area: z.enum(["grammar", "vocabulary", "signs", "messages", "situations", "reading"]),
    activeConceptIds: z.array(z.string().trim().min(1)),
    mappingStatus: z.enum(["taxonomy_only", "linked_to_active_theory"]),
    reviewStatus: z.enum(["needs_review", "reviewed"]),
    reviewEvidence: z.object({
      sourceId: z.string().trim().min(1),
      sourceVersion: z.string().trim().min(1),
      locator: z.string().trim().min(1),
      reviewedAt: z.iso.date(),
    }).strict().nullable(),
    scopeNote: z.string().trim().min(1),
  })
  .strict()
  .superRefine((topic, context) => {
    if (new Set(topic.activeConceptIds).size !== topic.activeConceptIds.length) {
      context.addIssue({ code: "custom", path: ["activeConceptIds"], message: "English topic concept IDs must be unique." });
    }
    const unknownConceptIds = topic.activeConceptIds.filter((id) => !activeTheoryConceptRegistry.has(id));
    if (unknownConceptIds.length) {
      context.addIssue({ code: "custom", path: ["activeConceptIds"], message: `Unknown active English concept IDs: ${unknownConceptIds.join(", ")}.` });
    }
    if (topic.mappingStatus === "taxonomy_only" && topic.activeConceptIds.length > 0) {
      context.addIssue({ code: "custom", path: ["mappingStatus"], message: "Taxonomy-only topics cannot claim active theory mappings." });
    }
    if (topic.mappingStatus === "linked_to_active_theory" && topic.activeConceptIds.length === 0) {
      context.addIssue({ code: "custom", path: ["mappingStatus"], message: "A linked English topic must map to at least one active theory concept." });
    }
    if (topic.reviewStatus === "needs_review" && topic.reviewEvidence !== null) {
      context.addIssue({ code: "custom", path: ["reviewEvidence"], message: "Unreviewed English topics cannot claim review evidence." });
    }
    if (topic.reviewStatus === "reviewed" && topic.reviewEvidence === null) {
      context.addIssue({ code: "custom", path: ["reviewEvidence"], message: "Reviewed English topics require exact versioned review evidence." });
    }
  });

export const englishTopicCatalogSchema = z
  .object({
    schemaVersion: z.literal(1),
    level: z.literal("A2-practice"),
    basis: z.literal("user_requested_curriculum"),
    levelSource: z.object({
      sourceId: z.string().trim().min(1),
      sourceVersion: z.string().trim().min(1),
      locator: z.string().trim().min(1),
    }).strict(),
    note: z.string().trim().min(1),
    topics: z.array(englishTopicSchema).min(1),
  })
  .strict()
  .superRefine((catalog, context) => {
    const topicIds = catalog.topics.map((topic) => topic.id);
    if (new Set(topicIds).size !== topicIds.length) {
      context.addIssue({ code: "custom", path: ["topics"], message: "English topic IDs must be unique." });
    }
    const requiredIds = [
      "there-is-are", "present-simple", "present-continuous", "past-simple", "future", "modal-verbs",
      "comparatives", "prepositions", "quantifiers", "countable-uncountable", "simple-conditionals",
      "vocabulary", "signs-notices", "short-messages", "emails", "everyday-situations", "shops",
      "hotels", "airports", "health", "reading-comprehension", "railway-vocabulary",
    ];
    const missing = requiredIds.filter((id) => !topicIds.includes(id));
    if (missing.length) {
      context.addIssue({ code: "custom", path: ["topics"], message: `Missing requested A2 topics: ${missing.join(", ")}.` });
    }
  });

const commonSectionSourceReferenceSchema = z.object({
  sourceId: z.string().trim().min(1),
  sourceVersion: z.string().trim().min(1),
  locator: z.string().trim().min(1),
}).strict();

const questionNumberListSchema = z.array(z.number().int().min(1).max(99));
const commonQuestionMetadataSchema = z.object({
  id: z.string().regex(/^ADIF-\d{4}-\d{4}-(psychometric|english|general)-Q\d{2}$/),
  questionNumber: z.number().int().min(1).max(99),
  isReserve: z.boolean(),
}).strict();

export const officialCommonSectionSchema = z
  .object({
    id: z.string().regex(/^ADIF-\d{4}-\d{4}-(psychometric|english|general)$/),
    examId: z.string().regex(/^ADIF-\d{4}-\d{4}$/),
    year: z.number().int().min(2000).max(2100),
    call: z.string().regex(/^PNI\d{2}\/\d{2}$/),
    profileCode: z.string().regex(/^\d{2}\/\d{2}PO$/),
    profileName: z.string().trim().min(1),
    examCode: z.string().regex(/^\d{4}$/),
    session: z.object({ date: z.iso.date(), location: z.string().trim().min(1).nullable() }).strict().nullable(),
    section: officialCommonSectionNameSchema,
    questionNumbers: questionNumberListSchema.min(1),
    scoredQuestionNumbers: questionNumberListSchema.min(1),
    reserveQuestionNumbers: questionNumberListSchema.min(1),
    questionMetadata: z.array(commonQuestionMetadataSchema).min(1),
    source: commonSectionSourceReferenceSchema,
    correctionSource: commonSectionSourceReferenceSchema,
    publicationStatus: publicationStatusSchema,
    publicationReview: publicationReviewSchema.nullable(),
  })
  .strict()
  .superRefine((section, context) => {
    if (section.id !== `${section.examId}-${section.section}` || section.examId !== `ADIF-${section.year}-${section.examCode}`) {
      context.addIssue({ code: "custom", path: ["id"], message: "Common section IDs must retain exact form identity and section." });
    }
    if (new Set(section.questionNumbers).size !== section.questionNumbers.length) {
      context.addIssue({ code: "custom", path: ["questionNumbers"], message: "Common section question numbers must be unique." });
    }
    if (new Set(section.scoredQuestionNumbers).size !== section.scoredQuestionNumbers.length) {
      context.addIssue({ code: "custom", path: ["scoredQuestionNumbers"], message: "Scored question numbers must be unique." });
    }
    if (new Set(section.reserveQuestionNumbers).size !== section.reserveQuestionNumbers.length) {
      context.addIssue({ code: "custom", path: ["reserveQuestionNumbers"], message: "Reserve question numbers must be unique." });
    }
    const declared = new Set([...section.scoredQuestionNumbers, ...section.reserveQuestionNumbers]);
    if (
      declared.size !== section.questionNumbers.length ||
      section.questionNumbers.some((number) => !declared.has(number)) ||
      [...declared].some((number) => !section.questionNumbers.includes(number))
    ) {
      context.addIssue({ code: "custom", path: ["questionNumbers"], message: "Scored and reserve numbers must exactly partition the section questions." });
    }
    const metadataNumbers = section.questionMetadata.map((item) => item.questionNumber);
    if (
      new Set(metadataNumbers).size !== metadataNumbers.length ||
      !sameQuestionNumbers(metadataNumbers, section.questionNumbers) ||
      section.questionMetadata.some((item) =>
        item.id !== `${section.id}-Q${String(item.questionNumber).padStart(2, "0")}` ||
        item.isReserve !== section.reserveQuestionNumbers.includes(item.questionNumber),
      )
    ) {
      context.addIssue({ code: "custom", path: ["questionMetadata"], message: "Question metadata must enumerate the exact section numbers and reserve flags." });
    }
    if (section.section === "psychometric" && (section.publicationStatus !== "restricted" || section.publicationReview !== null)) {
      context.addIssue({ code: "custom", path: ["publicationStatus"], message: "Psychometric source material is restricted and must remain metadata-only." });
    }
    if (section.publicationStatus === "approved_for_publication" && section.publicationReview === null) {
      context.addIssue({ code: "custom", path: ["publicationReview"], message: "Approved official text requires scoped human publication review." });
    }
  });

function sameQuestionNumbers(actual: readonly number[], expected: readonly number[]): boolean {
  return actual.length === expected.length && expected.every((number) => actual.includes(number));
}

export const officialCommonSectionsSchema = z.array(officialCommonSectionSchema).min(1);

export const commonQuestionMappingSchema = z.discriminatedUnion("section", [
  z.object({
    section: z.literal("general"),
    syllabusNodeId: z.string().trim().min(1),
    conceptIds: z.array(z.string().trim().min(1)).min(1),
  }).strict(),
  z.object({
    section: z.literal("english"),
    topicId: z.string().trim().min(1),
    conceptIds: z.array(z.string().trim().min(1)).min(1),
  }).strict(),
]);

export const officialCorrectionSetSchema = z
  .object({
    year: z.number().int().min(2000).max(2100),
    call: z.string().regex(/^PNI\d{2}\/\d{2}$/),
    profileCode: z.string().regex(/^\d{2}\/\d{2}PO$/),
    profileName: z.string().trim().min(1),
    examIds: z
      .array(z.string().regex(/^ADIF-\d{4}-\d{4}$/))
      .min(1)
      .refine((examIds) => new Set(examIds).size === examIds.length, {
        message: "Correction-set exam IDs must not contain duplicates.",
      }),
    reconciliationStatus: z.enum([
      "pending",
      "verified_no_changes",
      "verified_with_changes",
    ]),
    resolutionSource: correctionSourceReferenceSchema,
    publicationStatus: publicationStatusSchema,
    publicationReview: publicationReviewSchema.nullable(),
    corrections: z.array(officialCorrectionSchema),
  })
  .strict()
  .superRefine((set, context) => {
    if (set.reconciliationStatus === "verified_no_changes" && set.corrections.length !== 0) {
      context.addIssue({
        code: "custom",
        path: ["corrections"],
        message: "A verified no-change reconciliation cannot contain corrections.",
      });
    }
    if (set.reconciliationStatus === "verified_with_changes" && set.corrections.length === 0) {
      context.addIssue({
        code: "custom",
        path: ["corrections"],
        message: "A verified changed reconciliation must contain at least one correction.",
      });
    }
    if (set.reconciliationStatus === "pending" && set.corrections.length !== 0) {
      context.addIssue({
        code: "custom",
        path: ["corrections"],
        message: "Pending corrections cannot be treated as verified tribunal outcomes.",
      });
    }
  });

export const officialQuestionsSchema = z.array(officialQuestionSchema);
export const officialExamsSchema = z.array(officialExamSchema);
export const officialCorrectionSetsSchema = z.array(officialCorrectionSetSchema);

export type Question = z.infer<typeof questionSchema>;
export type Lesson = z.infer<typeof lessonSchema>;
export type Simulation = z.infer<typeof simulationSchema>;
export type OfficialQuestionSource = z.infer<typeof officialQuestionSourceSchema>;
export type OfficialQuestion = z.infer<typeof officialQuestionSchema>;
export type OfficialExam = z.infer<typeof officialExamSchema>;
export type OfficialCorrection = z.infer<typeof officialCorrectionSchema>;
export type OfficialCorrectionSet = z.infer<typeof officialCorrectionSetSchema>;
export type PublicationStatus = z.infer<typeof publicationStatusSchema>;
export type PublicationReview = z.infer<typeof publicationReviewSchema>;
