import correction2023 from "../../content/official-exams/corrections/2023.json";
import correction2024 from "../../content/official-exams/corrections/2024.json";
import correction2025 from "../../content/official-exams/corrections/2025.json";
import commonSections from "../../content/official-exams/common-sections.json";
import englishTopics from "../../content/official-exams/english-topics.json";
import examManifestJson from "../../content/official-exams/manifest.json";
import { officialCorrectionSetsSchema, type OfficialExam, type OfficialQuestion, type PublicationStatus } from "./schema";
import { sourceManifest } from "./source-manifest";
import { validateStoredHistoricalQuestionValidity } from "./official-question-validity";
import { publicationReviewCoversQuestionSection, validateOfficialCorrectionSets, type CorrectionExamRecord, type CorrectionSourceRecord } from "./official-corrections";
import { isOfficialCommonQuestionMetadataConsistent, isOfficialCommonSectionTextApproved, parseOfficialCommonSectionCatalog, validateOfficialCommonQuestionMapping } from "./official-common-sections";

type ManifestForm = {
  id: string;
  year: number;
  call: string;
  profileCode: string;
  expectedQuestionNumbers: number[];
  transcribedQuestionNumbers: number[];
  reserveQuestionNumbers: number[];
};

const forms = examManifestJson as ManifestForm[];
const corrections = officialCorrectionSetsSchema.parse([
  correction2023,
  correction2024,
  correction2025,
]);
const correctionExamRecords: CorrectionExamRecord[] = forms.map((form) => ({
  id: form.id,
  year: form.year,
  call: form.call,
  profileCode: form.profileCode,
  questionNumbers: form.expectedQuestionNumbers,
  reserveQuestionNumbers: form.reserveQuestionNumbers,
}));
const correctionSources: CorrectionSourceRecord[] = sourceManifest.sources.map((source) => ({
  sourceId: source.sourceId,
  sourceVersion: source.sourceVersion,
  url: source.url,
  sourceType: source.sourceType,
  status: source.status,
  locatorPolicy: source.locatorPolicy,
  rightsBasis: source.rightsBasis,
}));
const commonSourceRecords = correctionSources.map((source) => ({
  ...source,
  url: sourceManifest.sources.find((candidate) =>
    candidate.sourceId === source.sourceId && candidate.sourceVersion === source.sourceVersion,
  )!.url,
}));
const commonCatalog = parseOfficialCommonSectionCatalog({
  commonSections,
  englishTopics,
  manifest: examManifestJson,
  sources: commonSourceRecords,
});

const publicationByExamId = new Map<string, {
  status: PublicationStatus;
  evidenceValid: boolean;
  errors: string[];
  review: (typeof corrections)[number]["publicationReview"];
}>();

for (const set of corrections) {
  const setExamIds = new Set(set.examIds);
  const errors = validateOfficialCorrectionSets(
    [set],
    correctionExamRecords.filter((exam) => setExamIds.has(exam.id)),
    correctionSources,
  );
  for (const examId of set.examIds) {
    publicationByExamId.set(examId, {
      status: set.publicationStatus,
      evidenceValid: errors.length === 0,
      errors,
      review: set.publicationReview,
    });
  }
}

export type OfficialPublicationDecision = {
  status: PublicationStatus;
  evidenceValid: boolean;
  errors: readonly string[];
  review?: (typeof corrections)[number]["publicationReview"];
};

export function getOfficialPublicationDecision(examId: string): OfficialPublicationDecision {
  return publicationByExamId.get(examId) ?? {
    status: "link_only",
    evidenceValid: false,
    errors: ["No tribunal and publication record covers this form."],
    review: null,
  };
}

export function isOfficialQuestionPracticeEligible(
  question: OfficialQuestion,
  decision: OfficialPublicationDecision = getOfficialPublicationDecision(
    `ADIF-${question.source.year}-${question.source.examCode}`,
  ),
): boolean {
  const formId = `ADIF-${question.source.year}-${question.source.examCode}`;
  const scopeIsApproved = decision.evidenceValid &&
    decision.status === "approved_for_publication" &&
    decision.review?.decision === "approved" &&
    decision.review.permittedUse === "public_question_text" &&
    publicationReviewCoversQuestionSection(decision.review, formId, question.source.section);
  const mappingErrors = question.source.section === "specific"
    ? validateStoredHistoricalQuestionValidity({
      ...question,
      syllabusNodeId: question.syllabusNodeId ?? "",
    })
    : validateOfficialCommonQuestionMapping(
      question.source.section === "general"
        ? {
          section: "general",
          syllabusNodeId: question.syllabusNodeId,
          conceptIds: question.conceptIds,
        }
        : {
          section: "english",
          topicId: question.commonTopicId,
          conceptIds: question.conceptIds,
        },
      commonCatalog.englishTopics,
      commonSourceRecords,
    );
  return (
    scopeIsApproved &&
    question.publicationStatus === "approved_for_publication" &&
    question.validity === "current" &&
    question.currentness === "current" &&
    mappingErrors.length === 0 &&
    question.effectiveAnswer !== null &&
    (question.source.section === "specific" || isOfficialCommonQuestionMetadataConsistent(
      question as Parameters<typeof isOfficialCommonQuestionMetadataConsistent>[0],
      commonCatalog.commonSections,
      sourceManifest.sources,
    )) &&
    (question.source.section === "specific" || isOfficialCommonSectionTextApproved(
      commonCatalog.commonSections.find((section) => section.id === `${formId}-${question.source.section}`),
      formId,
      question.source.section,
    ))
  );
}

export function isOfficialExamPracticeEligible(
  exam: OfficialExam,
  questionsById: ReadonlyMap<string, OfficialQuestion>,
  decision: OfficialPublicationDecision = getOfficialPublicationDecision(
    `ADIF-${exam.source.year}-${exam.source.examCode}`,
  ),
): boolean {
  const form = forms.find((candidate) => candidate.id === exam.id);
  const expectedQuestionIds = form?.transcribedQuestionNumbers.map((number) =>
    `${exam.id}-Q${String(number).padStart(2, "0")}`,
  ) ?? [];
  const questionIdsMatchManifest = expectedQuestionIds.length > 0 &&
    exam.questionIds.length === expectedQuestionIds.length &&
    exam.questionIds.every((questionId, index) => questionId === expectedQuestionIds[index]);
  return (
    decision.evidenceValid &&
    decision.status === "approved_for_publication" &&
    questionIdsMatchManifest &&
    exam.questionIds.length > 0 &&
    exam.questionIds.every((questionId) => {
      const question = questionsById.get(questionId);
      return question !== undefined && isOfficialQuestionPracticeEligible(question, decision);
    })
  );
}

export function validateOfficialPublicationData(): string[] {
  const errors: string[] = [];
  for (const set of corrections) {
    const decision = getOfficialPublicationDecision(set.examIds[0] ?? "");
    if (decision.status === "approved_for_publication" && !decision.evidenceValid) {
      errors.push(`${set.year}: approval cannot be used because its source evidence is unresolved.`);
    }
  }
  return errors;
}
