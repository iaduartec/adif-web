import examsJson from "../../content/exams.json";
import questionsJson from "../../content/questions.json";
import { lessons } from "../../content/lessons";
import {
  type Lesson,
  type OfficialExam,
  type OfficialQuestion,
  type Question,
  lessonsSchema,
  officialExamsSchema,
  officialQuestionsSchema,
} from "./schema";

export type QuestionFilter = {
  year?: number;
  examCode?: string;
  section?: OfficialQuestion["source"]["section"];
  /** @deprecated Legacy UI filter. It matches the official section label only. */
  module?: string;
  query?: string;
  ids?: readonly string[];
};

/**
 * @deprecated Legacy UI shape during the official-bank migration. Its values are
 * derived from official section labels and the canonical document URL only.
 */
export type OfficialPracticeQuestion = Question;

export type OfficialExamQuestion = Omit<OfficialQuestion, "answer">;

export type ContentRepositoryInput = {
  lessons: unknown;
  questions: unknown;
  exams: unknown;
};

function toPracticeQuestion(question: OfficialQuestion): OfficialPracticeQuestion {
  return {
    ...question,
    module: question.sectionLabel,
    explanation: question.source.documentUrl,
    sourceNote: question.source.documentUrl,
  } as unknown as OfficialPracticeQuestion;
}

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
    const expectedPrefix = `${exam.id}-Q`;
    for (const questionId of exam.questionIds) {
      const question = questionById.get(questionId);
      if (!question) {
        throw new Error(`${exam.id} references a missing question ID: ${questionId}.`);
      }
      if (
        !questionId.startsWith(expectedPrefix)
        || question.source.year !== exam.source.year
        || question.source.examCode !== exam.source.examCode
      ) {
        throw new Error(`${exam.id} references a question from a different official model: ${questionId}.`);
      }
    }
  }

  const listOfficialQuestions = (filter?: QuestionFilter): OfficialQuestion[] => {
    if (!filter) return [...questionList];

    const query = filter.query?.trim().toLocaleLowerCase();
    const allowedIds = filter.ids ? new Set(filter.ids) : undefined;

    return questionList.filter((question) => {
      if (filter.year && question.source.year !== filter.year) return false;
      if (filter.examCode && question.source.examCode !== filter.examCode) return false;
      if (filter.section && question.source.section !== filter.section) return false;
      if (filter.module && question.sectionLabel !== filter.module) return false;
      if (allowedIds && !allowedIds.has(question.id)) return false;
      if (!query) return true;

      return [
        question.prompt,
        question.sectionLabel,
        question.source.profileName,
        question.source.examCode,
        ...question.options.map((option) => option.text),
      ].some((value) => value.toLocaleLowerCase().includes(query));
    });
  };

  return {
    getLesson(slug: string): Lesson | undefined {
      return lessonBySlug.get(slug);
    },
    listLessons(): readonly Lesson[] {
      return lessonList;
    },
    getOfficialQuestion(id: string): OfficialQuestion | undefined {
      return questionById.get(id);
    },
    listOfficialQuestions,
    getOfficialExam(id: string): OfficialExam | undefined {
      return examById.get(id);
    },
    listOfficialExams(): readonly OfficialExam[] {
      return examList;
    },
    /** @deprecated Migrate callers to getOfficialQuestion. */
    getQuestion(id: string): OfficialPracticeQuestion | undefined {
      const question = questionById.get(id);
      return question ? toPracticeQuestion(question) : undefined;
    },
    /** @deprecated Migrate callers to listOfficialQuestions. */
    listQuestions(filter?: QuestionFilter): OfficialPracticeQuestion[] {
      return listOfficialQuestions(filter).map(toPracticeQuestion);
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

export function listOfficialQuestions(filter?: QuestionFilter): OfficialQuestion[] {
  return repository.listOfficialQuestions(filter);
}

export function getOfficialExam(id: string): OfficialExam | undefined {
  return repository.getOfficialExam(id);
}

export function listOfficialExams(): readonly OfficialExam[] {
  return repository.listOfficialExams();
}

/** @deprecated Migrate callers to getOfficialQuestion. */
export function getQuestion(id: string): OfficialPracticeQuestion | undefined {
  return repository.getQuestion(id);
}

/** @deprecated Migrate callers to listOfficialQuestions. */
export function listQuestions(filter?: QuestionFilter): OfficialPracticeQuestion[] {
  return repository.listQuestions(filter);
}
