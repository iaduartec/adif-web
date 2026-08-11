import type {
  OfficialExam,
  OfficialQuestion,
  OfficialQuestionSource,
} from "./schema";

export type PublicOfficialQuestionSource = Omit<OfficialQuestionSource, "fingerprint">;

export type PublicOfficialQuestion = Omit<OfficialQuestion, "answer" | "source"> & {
  source: PublicOfficialQuestionSource;
};

export type PublicOfficialExam = Omit<OfficialExam, "source"> & {
  source: PublicOfficialQuestionSource;
};

function toPublicOfficialSource(source: OfficialQuestionSource): PublicOfficialQuestionSource {
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
  };
}

export function toPublicOfficialQuestion(question: OfficialQuestion): PublicOfficialQuestion {
  return {
    id: question.id,
    sectionLabel: question.sectionLabel,
    prompt: question.prompt,
    conceptIds: question.conceptIds,
    options: question.options,
    origin: question.origin,
    source: toPublicOfficialSource(question.source),
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
