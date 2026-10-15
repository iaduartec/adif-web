import correction2023 from "../../content/official-exams/corrections/2023.json";
import correction2024 from "../../content/official-exams/corrections/2024.json";
import correction2025 from "../../content/official-exams/corrections/2025.json";
import examManifestJson from "../../content/official-exams/manifest.json";
import type {
  OfficialExam,
  OfficialQuestion,
  OfficialQuestionSource,
  PublicationStatus,
} from "./schema";
import {
  officialCorrectionSetsSchema,
} from "./schema";
import { isOfficialQuestionPracticeEligible, type OfficialPublicationDecision } from "./official-publication";
import { officialExamManifestSchema } from "./official-exam-manifest";
import { sourceManifest, type SourceVersionStatus } from "./source-manifest";

export type PublicOfficialQuestionSource = Omit<OfficialQuestionSource, "fingerprint"> & {
  sourceStatus: SourceVersionStatus | "missing";
};

type CorrectionSourceReference = NonNullable<OfficialQuestion["correctionSource"]>;

export type PublicOfficialCorrectionSource = CorrectionSourceReference & {
  sourceStatus: SourceVersionStatus | "missing";
};

export type PublicOfficialQuestionStatus = {
  id: OfficialQuestion["id"];
  sectionLabel: OfficialQuestion["sectionLabel"];
  origin: OfficialQuestion["origin"];
  validity: OfficialQuestion["validity"];
  currentness: OfficialQuestion["currentness"];
  validityReason: OfficialQuestion["validityReason"];
  validityEvidence: OfficialQuestion["validityEvidence"];
  publicationStatus: PublicationStatus;
  source: PublicOfficialQuestionSource;
  correctionSource: PublicOfficialCorrectionSource | null;
};

export type PublicOfficialQuestion = Omit<
  OfficialQuestion,
  "answer" | "initialAnswer" | "effectiveAnswer" | "correctionSource" | "replacementQuestionNumber" | "source"
> & {
  source: PublicOfficialQuestionSource;
  correctionSource: PublicOfficialCorrectionSource | null;
};

export type PublicOfficialExam = Omit<OfficialExam, "source"> & {
  source: PublicOfficialQuestionSource;
};

const forms = officialExamManifestSchema.parse(examManifestJson);
const correctionSets = officialCorrectionSetsSchema.parse([
  correction2023,
  correction2024,
  correction2025,
]);

function getSourceStatus(reference: { sourceId: string; sourceVersion: string; sourceUrl?: string }): SourceVersionStatus | "missing" {
  const source = sourceManifest.sources.find((candidate) =>
    candidate.sourceId === reference.sourceId &&
    candidate.sourceVersion === reference.sourceVersion &&
    (!reference.sourceUrl || candidate.url === reference.sourceUrl),
  );
  return source?.status ?? "missing";
}

function toPublicOfficialSource(source: OfficialQuestionSource): PublicOfficialQuestionSource {
  const form = forms.find((candidate) =>
    candidate.id === `ADIF-${source.year}-${source.examCode}` &&
    candidate.call === source.call &&
    candidate.profileCode === source.profileCode &&
    candidate.documentUrl === source.documentUrl,
  );
  const sourceStatus = form
    ? getSourceStatus({
      sourceId: form.documentSourceId,
      sourceVersion: form.documentSourceVersion,
      sourceUrl: form.documentUrl,
    })
    : "missing";

  return {
    kind: source.kind,
    year: source.year,
    call: source.call,
    profileCode: source.profileCode,
    profileName: source.profileName,
    examCode: source.examCode,
    questionNumber: source.questionNumber,
    section: source.section,
    isReserve: source.isReserve,
    documentUrl: source.documentUrl,
    bookletPage: source.bookletPage,
    answerKeyPage: source.answerKeyPage,
    verifiedAt: source.verifiedAt,
    sourceStatus,
  };
}

function toPublicCorrectionSource(
  source: CorrectionSourceReference | null,
): PublicOfficialCorrectionSource | null {
  if (!source) return null;
  return { ...source, sourceStatus: getSourceStatus(source) };
}

function getFinalCorrectionSource(question: OfficialQuestion): PublicOfficialCorrectionSource | null {
  if (question.correctionSource) return toPublicCorrectionSource(question.correctionSource);
  const examId = `ADIF-${question.source.year}-${question.source.examCode}`;
  const correctionSet = correctionSets.find((set) => set.examIds.includes(examId));
  if (!correctionSet) return null;
  const item = correctionSet.corrections.find((correction) =>
    correction.examId === examId && correction.questionNumber === question.source.questionNumber,
  );
  return toPublicCorrectionSource(item?.correctionSource ?? correctionSet.resolutionSource);
}

export function toPublicOfficialQuestionStatus(question: OfficialQuestion): PublicOfficialQuestionStatus {
  return {
    id: question.id,
    sectionLabel: question.sectionLabel,
    origin: question.origin,
    validity: question.validity,
    currentness: question.currentness,
    validityReason: question.validityReason,
    validityEvidence: question.validityEvidence,
    publicationStatus: question.publicationStatus,
    source: toPublicOfficialSource(question.source),
    correctionSource: getFinalCorrectionSource(question),
  };
}

export function toPublicOfficialQuestion(
  question: OfficialQuestion,
  decision?: OfficialPublicationDecision,
): PublicOfficialQuestion | null {
  if (!isOfficialQuestionPracticeEligible(question, decision)) return null;

  return {
    id: question.id,
    sectionLabel: question.sectionLabel,
    prompt: question.prompt,
    conceptIds: question.conceptIds,
    syllabusNodeId: question.syllabusNodeId,
    commonTopicId: question.commonTopicId,
    currentness: question.currentness,
    validity: question.validity,
    validityReason: question.validityReason,
    validityEvidence: question.validityEvidence,
    options: question.options,
    publicationStatus: question.publicationStatus,
    origin: question.origin,
    source: toPublicOfficialSource(question.source),
    correctionSource: getFinalCorrectionSource(question),
  };
}

export function toPublicOfficialExam(exam: OfficialExam): PublicOfficialExam {
  return {
    id: exam.id,
    title: exam.title,
    source: toPublicOfficialSource(exam.source),
    questionIds: exam.questionIds,
    durationMinutes: exam.durationMinutes,
    completeness: exam.completeness,
    scoring: exam.scoring,
  };
}
