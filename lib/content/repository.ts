import examsJson from "../../content/exams.json";
import questionsJson from "../../content/questions.json";
import { lessons } from "../../content/lessons";
import {
  type Lesson,
  type OfficialExam,
  type OfficialQuestion,
  lessonsSchema,
  officialExamsSchema,
  officialQuestionsSchema,
} from "./schema";
import type { PublicOfficialQuestion } from "./public-dto";
import { isOfficialExamPracticeEligible, isOfficialQuestionPracticeEligible } from "./official-publication";

export type QuestionFilter = {
  year?: number;
  examCode?: string;
  section?: OfficialQuestion["source"]["section"];
  validity?: OfficialQuestion["validity"];
  query?: string;
  ids?: readonly string[];
};

export type OfficialExamQuestion = PublicOfficialQuestion;

export type ContentRepositoryInput = {
  lessons: unknown;
  questions: unknown;
  exams: unknown;
};

export function createContentRepository({
  lessons: lessonInput,
  questions: questionInput,
  exams: examInput,
}: ContentRepositoryInput) {
  const lessonList = lessonsSchema.parse(lessonInput);
  const questionList = officialQuestionsSchema.parse(questionInput);
  const examList = officialExamsSchema.parse(examInput);
  const questionById = new Map(questionList.map((question) => [question.id, question]));
  const lessonBySlug = new Map(lessonList.map((lesson) => [lesson.slug, lesson]));
  const examById = new Map(examList.map((exam) => [exam.id, exam]));

  for (const exam of examList) {
    for (const questionId of exam.questionIds) {
      const question = questionById.get(questionId);
      if (!question) {
        throw new Error(`${exam.id} references a missing question ID: ${questionId}.`);
      }
      if (
        ![
          `${exam.id}-Q`,
          `${exam.id}-general-Q`,
          `${exam.id}-english-Q`,
        ].some((prefix) => questionId.startsWith(prefix))
        || question.source.year !== exam.source.year
        || question.source.examCode !== exam.source.examCode
      ) {
        throw new Error(`${exam.id} references a question from a different official model: ${questionId}.`);
      }
    }
  }

  const listOfficialQuestionRecords = (filter?: QuestionFilter, includeQuestionText = false): OfficialQuestion[] => {
    if (!filter) return [...questionList];

    const query = filter.query?.trim().toLocaleLowerCase();
    const allowedIds = filter.ids ? new Set(filter.ids) : undefined;

    return questionList.filter((question) => {
      if (filter.year && question.source.year !== filter.year) return false;
      if (filter.examCode && question.source.examCode !== filter.examCode) return false;
      if (filter.section && question.source.section !== filter.section) return false;
      if (filter.validity && question.validity !== filter.validity) return false;
      if (allowedIds && !allowedIds.has(question.id)) return false;
      if (!query) return true;

      const searchableValues = [
        question.id,
        question.sectionLabel,
        question.source.profileName,
        question.source.call,
        question.source.examCode,
        String(question.source.year),
        question.source.section,
      ];
      if (includeQuestionText) {
        searchableValues.push(question.prompt, ...question.options.map((option) => option.text));
      }
      return searchableValues.some((value) => value.toLocaleLowerCase().includes(query));
    });
  };

  const listOfficialQuestions = (filter?: QuestionFilter): OfficialQuestion[] =>
    listOfficialQuestionRecords(filter, true).filter((question) => isOfficialQuestionPracticeEligible(question));

  const listOfficialExams = (): OfficialExam[] =>
    examList.filter((exam) => isOfficialExamPracticeEligible(exam, questionById));

  const getAvailableOfficialQuestion = (id: string): OfficialQuestion | undefined => {
    const question = questionById.get(id);
    return question && isOfficialQuestionPracticeEligible(question) ? question : undefined;
  };

  const getAvailableOfficialExam = (id: string): OfficialExam | undefined => {
    const exam = examById.get(id);
    return exam && isOfficialExamPracticeEligible(exam, questionById) ? exam : undefined;
  };

  return {
    getLesson(slug: string): Lesson | undefined {
      return lessonBySlug.get(slug);
    },
    listLessons(): readonly Lesson[] {
      return lessonList;
    },
    getOfficialQuestion(id: string): OfficialQuestion | undefined {
      return getAvailableOfficialQuestion(id);
    },
    getOfficialQuestionRecord(id: string): OfficialQuestion | undefined {
      return questionById.get(id);
    },
    listOfficialQuestions,
    listOfficialQuestionRecords(filter?: QuestionFilter): OfficialQuestion[] {
      return listOfficialQuestionRecords(filter, false);
    },
    getOfficialExam(id: string): OfficialExam | undefined {
      return getAvailableOfficialExam(id);
    },
    getOfficialExamRecord(id: string): OfficialExam | undefined {
      return examById.get(id);
    },
    listOfficialExams(): readonly OfficialExam[] {
      return listOfficialExams();
    },
    listOfficialExamRecords(): readonly OfficialExam[] {
      return examList;
    },
  };
}

const repository = createContentRepository({
  lessons,
  questions: questionsJson,
  exams: examsJson,
});

export function getLesson(slug: string): Lesson | undefined {
  return repository.getLesson(slug);
}

export function listLessons(): readonly Lesson[] {
  return repository.listLessons();
}

export function getOfficialQuestion(id: string): OfficialQuestion | undefined {
  return repository.getOfficialQuestion(id);
}

export function getOfficialQuestionRecord(id: string): OfficialQuestion | undefined {
  return repository.getOfficialQuestionRecord(id);
}

export function listOfficialQuestions(filter?: QuestionFilter): OfficialQuestion[] {
  return repository.listOfficialQuestions(filter);
}

export function listOfficialQuestionRecords(filter?: QuestionFilter): OfficialQuestion[] {
  return repository.listOfficialQuestionRecords(filter);
}

export function getOfficialExam(id: string): OfficialExam | undefined {
  return repository.getOfficialExam(id);
}

export function getOfficialExamRecord(id: string): OfficialExam | undefined {
  return repository.getOfficialExamRecord(id);
}

export function listOfficialExams(): readonly OfficialExam[] {
  return repository.listOfficialExams();
}

export function listOfficialExamRecords(): readonly OfficialExam[] {
  return repository.listOfficialExamRecords();
}
