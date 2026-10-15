import correction2023 from "../../content/official-exams/corrections/2023.json";
import correction2024 from "../../content/official-exams/corrections/2024.json";
import correction2025 from "../../content/official-exams/corrections/2025.json";
import examManifestJson from "../../content/official-exams/manifest.json";
import { officialCorrectionSetsSchema, type OfficialExam, type OfficialQuestion, type PublicationStatus } from "./schema";
import { sourceManifest } from "./source-manifest";
import { validateStoredHistoricalQuestionValidity } from "./official-question-validity";
import { validateOfficialCorrectionSets, type CorrectionExamRecord, type CorrectionSourceRecord } from "./official-corrections";

type ManifestForm = {
  id: string;
  year: number;
  call: string;
  profileCode: string;
  expectedQuestionNumbers: number[];
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

const publicationByExamId = new Map<string, {
  status: PublicationStatus;
  evidenceValid: boolean;
  errors: string[];
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
    });
  }
}

export type OfficialPublicationDecision = {
  status: PublicationStatus;
  evidenceValid: boolean;
  errors: readonly string[];
};

export function getOfficialPublicationDecision(examId: string): OfficialPublicationDecision {
  return publicationByExamId.get(examId) ?? {
    status: "link_only",
    evidenceValid: false,
    errors: ["No tribunal and publication record covers this form."],
  };
}

export function isOfficialQuestionPracticeEligible(
  question: OfficialQuestion,
  decision: OfficialPublicationDecision = getOfficialPublicationDecision(
    `ADIF-${question.source.year}-${question.source.examCode}`,
  ),
): boolean {
  return (
    decision.evidenceValid &&
    decision.status === "approved_for_publication" &&
    question.publicationStatus === "approved_for_publication" &&
    question.validity === "current" &&
    question.currentness === "current" &&
    validateStoredHistoricalQuestionValidity(question).length === 0 &&
    question.effectiveAnswer !== null
  );
}

export function isOfficialExamPracticeEligible(
  exam: OfficialExam,
  questionsById: ReadonlyMap<string, OfficialQuestion>,
): boolean {
  const decision = getOfficialPublicationDecision(
    `ADIF-${exam.source.year}-${exam.source.examCode}`,
  );
  return (
    decision.evidenceValid &&
    decision.status === "approved_for_publication" &&
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
