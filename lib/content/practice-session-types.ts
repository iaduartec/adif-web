export type PracticeSessionStatus = "CREATED" | "IN_PROGRESS" | "SUBMITTED" | "COMPLETED" | "ABANDONED";

export type PracticeSessionMode = "training" | "practice";

export type PracticeSession = {
  id: string;
  domain: string;
  topicId: string | null;
  mode: PracticeSessionMode;
  questionCount: number;
  questionIds: string[];
  status: PracticeSessionStatus;
  version: number;
  startedAt: string;
  completedAt: string | null;
  totalElapsedMs: number;
  answers: Record<string, "A" | "B" | "C" | "D">;
};

export type CreatePracticeSessionInput = {
  domain: string;
  topicId: string | null;
  mode: PracticeSessionMode;
  questionIds: string[];
  clientEventId: string;
};

export type SavePracticeAnswerInput = {
  sessionId: string;
  questionId: string;
  selectedAnswer: "A" | "B" | "C" | "D";
  elapsedMs: number;
  clientEventId: string;
  expectedVersion: number;
};

export type SubmitPracticeSessionInput = {
  sessionId: string;
  clientEventId: string;
};

export type AbandonPracticeSessionInput = {
  sessionId: string;
  clientEventId: string;
};