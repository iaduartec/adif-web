import { z } from "zod";

export const contentOriginSchema = z.enum([
  "official_reference",
  "original_explanation",
  "verification_pending",
]);

export type ContentOrigin = z.infer<typeof contentOriginSchema>;

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
  origin: z.literal("official_reference"),
});

export const lessonSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  origin: contentOriginSchema,
  officialReferences: z.array(lessonReferenceSchema).min(1),
  verificationNote: z.object({
    text: z.string().trim().min(1),
    origin: z.literal("verification_pending"),
  }),
});

export const simulationSchema = z.object({
  id: z.string().regex(/^SIM-(0[1-9]|[12]\d|30)$/),
  title: z.string().trim().min(1),
  questionIds: z.array(z.string().regex(/^Q\d{4}$/)).length(60),
  origin: contentOriginSchema,
});

export const questionsSchema = z.array(questionSchema);
export const simulationsSchema = z.array(simulationSchema);

export type Question = z.infer<typeof questionSchema>;
export type Lesson = z.infer<typeof lessonSchema>;
export type Simulation = z.infer<typeof simulationSchema>;
