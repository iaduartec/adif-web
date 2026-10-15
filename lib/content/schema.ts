import { z } from "zod";

import { activeTheoryConceptRegistry } from "../../content/theory-concepts";

export const contentOriginSchema = z.enum([
  "official_reference",
  "original_explanation",
]);

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

export const officialQuestionSchema = z
  .object({
    id: z.string().regex(/^ADIF-\d{4}-\d{4}-Q\d{2}$/),
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
    options: z.array(optionSchema).length(4),
    answer: z.enum(["A", "B", "C", "D"]),
    origin: z.literal("official_reference"),
    source: officialQuestionSourceSchema,
  })
  .strict()
  .superRefine((question, context) => {
    const optionKeys = question.options.map((option) => option.key);
    const requiredKeys = ["A", "B", "C", "D"] as const;
    const expectedId = `ADIF-${question.source.year}-${question.source.examCode}-Q${String(
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
  });

export const officialExamSchema = z
  .object({
    id: z.string().regex(/^ADIF-\d{4}-\d{4}$/),
    title: z.string().trim().min(1),
    source: officialQuestionSourceSchema,
    questionIds: z.array(z.string().regex(/^ADIF-\d{4}-\d{4}-Q\d{2}$/)).min(1).max(99),
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

    if (exam.questionIds.some((questionId) => !questionId.startsWith(`${exam.id}-Q`))) {
      context.addIssue({
        code: "custom",
        path: ["questionIds"],
        message: "Official exams may only reference questions from the same exam.",
      });
    }
  });

export const publicationStatusSchema = z.enum([
  "link_only",
  "review_pending",
  "approved_for_publication",
  "restricted",
]);

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

export const correctionSourceReferenceSchema = z
  .object({
    sourceId: z.string().trim().min(1),
    sourceVersion: z.string().trim().min(1),
    sourceUrl: z.url().refine((url) => new URL(url).hostname === "www.adif.es"),
    locator: z.string().trim().min(1),
  })
  .strict();

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
        content: z.literal("official_question_text"),
      })
      .strict()
      .refine((scope) => new Set(scope.examIds).size === scope.examIds.length, {
        message: "Publication review exam scope must not contain duplicates.",
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
