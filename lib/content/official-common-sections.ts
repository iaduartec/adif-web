import { z } from "zod";

import { activeTheoryConceptRegistry } from "../../content/theory-concepts";
import { officialItems } from "../../content/syllabus";
import {
  commonQuestionMappingSchema,
  englishTopicCatalogSchema,
  officialCommonSectionsSchema,
} from "./schema";
import { officialExamManifestSchema } from "./official-exam-manifest";
import { validatePublicationStatus, type CorrectionSourceRecord } from "./official-corrections";

const catalogInputSchema = z.object({
  commonSections: z.unknown(),
  englishTopics: z.unknown(),
  manifest: z.unknown(),
  sources: z.array(z.object({
    sourceId: z.string(),
    sourceVersion: z.string(),
    url: z.url(),
    sourceType: z.enum(["primary", "secondary", "didactic"]),
    status: z.enum(["verified", "needs_check", "superseded", "unavailable"]),
    locatorPolicy: z.enum(["document-level", "section", "exact"]),
    rightsBasis: z.enum(["explicit_license", "written_permission", "documented_legal_review"]).optional(),
  }).strict()),
}).strict();

const sectionsByYear = {
  2023: {
    psychometric: { questions: range(1, 18), reserves: [16, 17, 18] },
    english: { questions: range(19, 36), reserves: [34, 35, 36] },
    general: { questions: range(37, 54), reserves: [52, 53, 54] },
  },
  2024: {
    psychometric: { questions: range(1, 18), reserves: [16, 17, 18] },
    english: { questions: range(19, 36), reserves: [34, 35, 36] },
    general: { questions: range(37, 54), reserves: [52, 53, 54] },
  },
  2025: {
    psychometric: { questions: range(1, 18), reserves: [16, 17, 18] },
    english: { questions: range(19, 36), reserves: [34, 35, 36] },
    general: { questions: range(37, 54), reserves: [52, 53, 54] },
  },
} as const;

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function fail(message: string): never {
  throw new Error(`Official common-section catalog rejected: ${message}`);
}

function sameNumbers(actual: readonly number[], expected: readonly number[]): boolean {
  return actual.length === expected.length && expected.every((number) => actual.includes(number));
}

function findSource(
  sources: CorrectionSourceRecord[],
  reference: { sourceId: string; sourceVersion: string },
) {
  return sources.find((source) => source.sourceId === reference.sourceId && source.sourceVersion === reference.sourceVersion);
}

function validateReference(
  sources: CorrectionSourceRecord[],
  reference: { sourceId: string; sourceVersion: string; locator: string },
  expected: { sourceId: string; sourceVersion: string; url?: string },
  role: string,
) {
  if (reference.sourceId !== expected.sourceId || reference.sourceVersion !== expected.sourceVersion) {
    fail(`${role} must match the exact form-manifest source version.`);
  }
  const source = findSource(sources, reference);
  if (!source) fail(`${role} source version is not present in the source manifest.`);
  if (expected.url && source.url !== expected.url) fail(`${role} URL does not match the exact form-manifest source.`);
}

export function parseOfficialCommonSectionCatalog(input: unknown) {
  const parsedInput = catalogInputSchema.safeParse(input);
  if (!parsedInput.success) {
    fail(parsedInput.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(" "));
  }

  const manifest = officialExamManifestSchema.parse(parsedInput.data.manifest);
  const commonSections = officialCommonSectionsSchema.parse(parsedInput.data.commonSections);
  const englishTopics = englishTopicCatalogSchema.parse(parsedInput.data.englishTopics);
  const sources = parsedInput.data.sources as CorrectionSourceRecord[];
  const sourceForLevel = findSource(sources, englishTopics.levelSource);
  if (!sourceForLevel) fail("English A2 level reference must resolve to a source-manifest version.");

  const manifestById = new Map(manifest.map((entry) => [entry.id, entry]));
  const sectionById = new Map<string, (typeof commonSections)[number]>();
  const sectionCoordinates = new Set<string>();
  for (const section of commonSections) {
    if (sectionById.has(section.id)) fail(`Duplicate section ID ${section.id}.`);
    sectionById.set(section.id, section);
    const form = manifestById.get(section.examId);
    if (!form) fail(`${section.id} references a form missing from the exam manifest.`);
    if (
      section.year !== form.year ||
      section.call !== form.call ||
      section.profileCode !== form.profileCode ||
      section.profileName !== form.profileName ||
      section.examCode !== form.examCode ||
      JSON.stringify(section.session) !== JSON.stringify(form.session ?? null)
    ) {
      fail(`${section.id} session or form identity differs from the official exam manifest.`);
    }

    const layout = sectionsByYear[section.year as keyof typeof sectionsByYear]?.[section.section] as
      | { questions: readonly number[]; reserves: readonly number[] }
      | undefined;
    if (!layout) fail(`${section.id} has no reviewed historical section layout for ${section.year}.`);
    if (!sameNumbers(section.questionNumbers, layout.questions)) fail(`${section.id} question-number coverage differs from the official historical layout.`);
    if (!sameNumbers(section.reserveQuestionNumbers, layout.reserves)) fail(`${section.id} reserve numbers differ from the official historical layout.`);
    const scoredNumbers = layout.questions.filter((number) => !layout.reserves.includes(number));
    if (!sameNumbers(section.scoredQuestionNumbers, scoredNumbers)) fail(`${section.id} scored-number coverage differs from the official historical layout.`);

    validateReference(sources, section.source, {
      sourceId: form.documentSourceId,
      sourceVersion: form.documentSourceVersion,
      url: form.documentUrl,
    }, `${section.id} booklet`);
    validateReference(sources, section.correctionSource, {
      sourceId: form.finalAnswerKeySourceId,
      sourceVersion: form.finalAnswerKeySourceVersion,
    }, `${section.id} correction source`);

    if (section.section === "psychometric" && section.publicationStatus !== "restricted") {
      fail(`${section.id} must retain restricted psychometric status.`);
    }
    if (section.publicationReview) {
      const rightsErrors = validatePublicationStatus(section.publicationStatus, section.publicationReview, sources);
      if (rightsErrors.length) fail(`${section.id} publication review is invalid: ${rightsErrors.join("; ")}`);
      if (
        section.publicationReview.scope.examIds.length !== 1 ||
        section.publicationReview.scope.examIds[0] !== section.examId
      ) {
        fail(`${section.id} publication review must cover only its exact exam form.`);
      }
      if (
        !section.publicationReview.scope.sections ||
        section.publicationReview.scope.sections.length !== 1 ||
        section.publicationReview.scope.sections[0] !== section.section
      ) {
        fail(`${section.id} publication review must be scoped to this exact section.`);
      }
    } else if (section.publicationStatus === "approved_for_publication") {
      fail(`${section.id} cannot use an approved status without rights evidence.`);
    }

    for (const number of section.questionNumbers) {
      const coordinate = `${section.examId}:${number}`;
      if (sectionCoordinates.has(coordinate)) fail(`Question ${number} appears in multiple common sections for ${section.examId}.`);
      sectionCoordinates.add(coordinate);
    }
  }

  for (const form of manifest) {
    const expectedIds = ["psychometric", "english", "general"].map((section) => `${form.id}-${section}`);
    if (!form.commonSectionIds || !sameStringSet(form.commonSectionIds, expectedIds)) {
      fail(`${form.id} must pin exactly its three section-qualified common metadata IDs in the manifest.`);
    }
    const actualIds = commonSections.filter((section) => section.examId === form.id).map((section) => section.id);
    if (!sameStringSet(actualIds, expectedIds)) fail(`${form.id} must have exactly one metadata record per common section.`);
  }
  if (commonSections.some((section) => !manifestById.has(section.examId))) {
    fail("Common-section data contains an unlisted form.");
  }

  return { commonSections, englishTopics };
}

function sameStringSet(actual: readonly string[], expected: readonly string[]): boolean {
  return actual.length === expected.length && expected.every((value) => actual.includes(value));
}

export function validateOfficialCommonQuestionMapping(
  input: unknown,
  topicCatalog: z.infer<typeof englishTopicCatalogSchema>,
  sources: CorrectionSourceRecord[],
): string[] {
  const parsed = commonQuestionMappingSchema.safeParse(input);
  if (!parsed.success) return parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
  const mapping = parsed.data;
  const errors: string[] = [];
  if (new Set(mapping.conceptIds).size !== mapping.conceptIds.length) {
    errors.push("Common question concept IDs must not contain duplicates.");
  }
  const invalidConcepts = mapping.conceptIds.filter((id) => !activeTheoryConceptRegistry.has(id));
  if (invalidConcepts.length) errors.push(`Unknown or inactive concept IDs: ${invalidConcepts.join(", ")}.`);

  if (mapping.section === "general") {
    const nonNormativeConcepts = mapping.conceptIds.filter((id) =>
      !activeTheoryConceptRegistry.get(id)?.claims.some((claim) => claim.kind === "normative" && claim.legalBasis.length > 0),
    );
    if (nonNormativeConcepts.length) errors.push(`General questions require active normative concepts: ${nonNormativeConcepts.join(", ")}.`);
    const commonNodes = officialItems
      .filter((item) => item.scope === "common")
      .flatMap((item) => item.children);
    const node = commonNodes.find((candidate) => candidate.id === mapping.syllabusNodeId);
    if (!node) {
      errors.push("General questions must map to a current official common syllabus node.");
    } else {
      const nodeSource = findSource(sources, { sourceId: node.sourceId, sourceVersion: node.sourceVersion });
      if (!nodeSource || nodeSource.sourceType !== "primary" || nodeSource.status !== "verified" || nodeSource.locatorPolicy !== "exact") {
        errors.push("General question syllabus mapping must resolve to an exact verified current official source.");
      }
    }
  } else {
    const topic = topicCatalog.topics.find((candidate) => candidate.id === mapping.topicId);
    if (!topic || topic.mappingStatus !== "linked_to_active_theory" || topic.reviewStatus !== "reviewed" || !topic.reviewEvidence) {
      errors.push("English questions must map to a stable reviewed topic linked to active theory.");
    } else if (mapping.conceptIds.some((id) => !topic.activeConceptIds.includes(id))) {
      errors.push("English question concept IDs must be active concepts linked to its stable topic.");
    } else if (
      topic.reviewEvidence.sourceId !== topicCatalog.levelSource.sourceId ||
      topic.reviewEvidence.sourceVersion !== topicCatalog.levelSource.sourceVersion
    ) {
      errors.push("English topic review must cite the versioned A2 level source registered by the taxonomy.");
    } else {
      const reviewSource = findSource(sources, topic.reviewEvidence);
      if (!reviewSource || reviewSource.sourceType !== "primary" || reviewSource.status !== "verified" || reviewSource.locatorPolicy !== "exact") {
        errors.push("English topic review evidence must resolve to an exact verified primary source.");
      }
    }
  }
  return errors;
}

export type OfficialCommonSection = z.infer<typeof officialCommonSectionsSchema>[number];
export type EnglishTopicCatalog = z.infer<typeof englishTopicCatalogSchema>;

export type OfficialCommonQuestionCoordinates = {
  id: string;
  source: {
    year: number;
    examCode: string;
    section: "english" | "general";
    questionNumber: number;
    isReserve: boolean;
    documentUrl: string;
    fingerprint: string;
  };
};

type OfficialCommonQuestionSourceRecord = {
  sourceId: string;
  sourceVersion: string;
  url: string;
  sourceType: "primary" | "secondary" | "didactic";
  scope: string;
  status: "verified" | "needs_check" | "superseded" | "unavailable";
  locatorPolicy: "document-level" | "section" | "exact";
  sha256: string | null;
};

export function isOfficialCommonQuestionMetadataConsistent(
  question: OfficialCommonQuestionCoordinates,
  sections: readonly OfficialCommonSection[],
  sources: readonly OfficialCommonQuestionSourceRecord[],
): boolean {
  const examId = `ADIF-${question.source.year}-${question.source.examCode}`;
  const section = sections.find((candidate) => candidate.id === `${examId}-${question.source.section}`);
  const registeredBooklet = section && sources.find((source) =>
    source.sourceId === section.source.sourceId && source.sourceVersion === section.source.sourceVersion,
  );
  const bookletMatches = Boolean(
    registeredBooklet &&
    registeredBooklet.sourceType === "primary" &&
    registeredBooklet.scope === "historical-exam" &&
    registeredBooklet.status === "verified" &&
    registeredBooklet.locatorPolicy !== "document-level" &&
    registeredBooklet.sha256 !== null &&
    registeredBooklet.url === question.source.documentUrl &&
    question.source.fingerprint === `sha256:${registeredBooklet.sha256}`,
  );
  return Boolean(bookletMatches && section?.questionMetadata.some((metadata) =>
    metadata.id === question.id &&
    metadata.questionNumber === question.source.questionNumber &&
    metadata.isReserve === question.source.isReserve,
  ));
}

export function isOfficialCommonSectionTextApproved(
  section: OfficialCommonSection | undefined,
  examId: string,
  expectedSection: "psychometric" | "english" | "general",
): boolean {
  const review = section?.publicationReview;
  return Boolean(
    section &&
    section.id === `${examId}-${expectedSection}` &&
    section.examId === examId &&
    section.section === expectedSection &&
    section.publicationStatus === "approved_for_publication" &&
    review?.decision === "approved" &&
    review.permittedUse === "public_question_text" &&
    review.scope.examIds.length === 1 &&
    review.scope.examIds[0] === examId &&
    review.scope.sections?.length === 1 &&
    review.scope.sections[0] === expectedSection,
  );
}
