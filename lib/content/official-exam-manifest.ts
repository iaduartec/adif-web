import { z } from "zod";

const questionNumberSchema = z.number().int().min(1).max(99);

export const officialExamManifestEntrySchema = z
  .object({
    id: z.string().regex(/^ADIF-\d{4}-\d{4}$/),
    year: z.number().int().min(2000).max(2100),
    call: z.string().regex(/^PNI\d{2}\/\d{2}$/),
    profileCode: z.string().regex(/^\d{2}\/\d{2}PO$/),
    profileName: z.string().trim().min(1),
    examCode: z.string().regex(/^\d{4}$/),
    documentUrl: z.url().refine((url) => new URL(url).hostname === "www.adif.es", {
      message: "Official sources must be hosted on www.adif.es.",
    }),
    documentSourceId: z.string().trim().min(1),
    documentSourceVersion: z.string().trim().min(1),
    initialAnswerKeySourceId: z.string().trim().min(1),
    initialAnswerKeySourceVersion: z.string().trim().min(1),
    initialAnswerKeyPage: z.number().int().positive(),
    finalAnswerKeySourceId: z.string().trim().min(1),
    finalAnswerKeySourceVersion: z.string().trim().min(1),
    finalAnswerKeyPage: z.number().int().positive(),
    durationMinutes: z.number().int().positive(),
    expectedQuestionNumbers: z.array(questionNumberSchema).min(1),
    reserveQuestionNumbers: z.array(questionNumberSchema),
    transcriptionStatus: z.enum(["complete", "partial", "metadata_only"]),
    completeness: z.enum(["complete", "specific_part"]),
    scoring: z
      .object({
        correct: z.number().finite(),
        incorrect: z.number().finite(),
        omitted: z.number().finite(),
      })
      .strict(),
    session: z.object({
      date: z.iso.date(),
      location: z.string().trim().min(1).nullable(),
    }).strict().nullable().optional(),
  })
  .strict()
  .superRefine((entry, context) => {
    if (entry.id !== `ADIF-${entry.year}-${entry.examCode}`) {
      context.addIssue({ code: "custom", path: ["id"], message: "The manifest exam ID must match its year and exam code." });
    }
    if (new Set(entry.expectedQuestionNumbers).size !== entry.expectedQuestionNumbers.length) {
      context.addIssue({ code: "custom", path: ["expectedQuestionNumbers"], message: "Expected question numbers must not contain duplicates." });
    }
    if (new Set(entry.reserveQuestionNumbers).size !== entry.reserveQuestionNumbers.length) {
      context.addIssue({ code: "custom", path: ["reserveQuestionNumbers"], message: "Reserve question numbers must not contain duplicates." });
    }
    if (entry.reserveQuestionNumbers.some((number) => !entry.expectedQuestionNumbers.includes(number))) {
      context.addIssue({ code: "custom", path: ["reserveQuestionNumbers"], message: "Reserve questions must be included in the declared form question numbers." });
    }
    if (entry.transcriptionStatus === "metadata_only" && entry.completeness === "complete") {
      context.addIssue({ code: "custom", path: ["transcriptionStatus"], message: "A metadata-only form cannot be treated as a complete exam transcription." });
    }
  });

export const officialExamManifestSchema = z
  .array(officialExamManifestEntrySchema)
  .min(1)
  .superRefine((forms, context) => {
    const seen = new Set<string>();
    forms.forEach((form, index) => {
      if (seen.has(form.id)) {
        context.addIssue({ code: "custom", path: [index, "id"], message: `Duplicate manifest form ID: ${form.id}.` });
      }
      seen.add(form.id);
    });
  });

export type OfficialExamManifestEntry = z.infer<typeof officialExamManifestEntrySchema>;
