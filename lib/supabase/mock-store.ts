// In-memory store for mock Supabase client during Playwright E2E runs
export interface MockQuestionAttempt {
  id: string;
  client_event_id: string | null;
  user_id: string;
  question_id: string;
  request_fingerprint: string | null;
  selected_answer: string;
  is_correct: boolean;
  mode: "practice" | "simulation";
  elapsed_ms: number;
  created_at: string;
}

export interface MockSimulationAttempt {
  id: string;
  client_event_id: string | null;
  user_id: string;
  simulation_id: string;
  score: number;
  correct_count: number;
  incorrect_count: number;
  omitted_count: number;
  request_fingerprint: string | null;
  elapsed_ms: number;
  created_at: string;
}

export interface MockSimulationAnswer {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_answer: string | null;
  is_correct: boolean;
  created_at: string;
  user_id: string;
}

export interface MockLessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  percent: number;
  completed: boolean;
  created_at: string;
  updated_at: string;
  last_activity_at: string;
}

export interface MockFavorite {
  id: string;
  user_id: string;
  item_id: string;
  item_type: string;
  created_at: string;
}

export interface MockStudyGoal {
  user_id: string;
  weekly_target_minutes: number;
  preferred_days: number[];
  created_at: string;
  updated_at: string;
  exam_date: string | null;
  session_minutes: number;
  onboarding_completed_at: string | null;
}

export interface MockConceptMastery {
  user_id: string;
  concept_id: string;
  status: "new" | "learning" | "review" | "consolidated" | "at_risk";
  repetitions: number;
  ease_factor: number;
  interval_days: number;
  due_on: string | null;
  last_reviewed_at: string | null;
  last_evidence_at: string | null;
  correct_evidence: number;
  incorrect_evidence: number;
  created_at: string;
  updated_at: string;
}

export interface MockReviewEvent {
  id: string;
  user_id: string;
  concept_id: string;
  source_kind: "recall" | "question";
  question_id: string | null;
  rating: number;
  client_event_id: string;
  occurred_at: string;
  created_at: string;
}

export interface MockDailyPlanAction {
  id: string;
  user_id: string;
  plan_date: string;
  task_key: string;
  action: "postpone" | "replace";
  replacement_task_key: string | null;
  created_at: string;
}

export interface MockNote {
  id: string;
  user_id: string;
  lesson_id: string;
  body: string;
  created_at: string;
  updated_at: string;
}

class MockStore {
  reviewRpcFailure: "uncertain" | "definitive" | null = null;
  questionAttempts: MockQuestionAttempt[] = [];
  simulationAttempts: MockSimulationAttempt[] = [];
  simulationAnswers: MockSimulationAnswer[] = [];
  lessonProgress: MockLessonProgress[] = [];
  favorites: MockFavorite[] = [];
  notes: MockNote[] = [];
  conceptMastery: MockConceptMastery[] = [];
  reviewEvents: MockReviewEvent[] = [];
  dailyPlanActions: MockDailyPlanAction[] = [];
  studyGoals: MockStudyGoal[] = [
    {
      user_id: "test-user-id",
      weekly_target_minutes: 120,
      preferred_days: [1, 3, 5],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      exam_date: null,
      session_minutes: 30,
      onboarding_completed_at: "2026-08-11T00:00:00.000Z",
    },
  ];

  reset() {
    this.reviewRpcFailure = null;
    this.questionAttempts = [];
    this.simulationAttempts = [];
    this.simulationAnswers = [];
    this.lessonProgress = [];
    this.favorites = [];
    this.notes = [];
    this.conceptMastery = [];
    this.reviewEvents = [];
    this.dailyPlanActions = [];
    this.studyGoals = [
      {
        user_id: "test-user-id",
        weekly_target_minutes: 120,
        preferred_days: [1, 3, 5],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        exam_date: null,
        session_minutes: 30,
        onboarding_completed_at: "2026-08-11T00:00:00.000Z",
      },
    ];
  }
}

export const MOCK_USER = {
  id: "test-user-id",
  email: "test@example.com",
  user_metadata: {
    full_name: "Usuario de Pruebas",
    avatar_url: "https://avatar.example.com/test.png",
  },
};

export function getMockStore(): MockStore {
  // Created lazily so importing production Supabase adapters cannot activate test identity state.
  const globalVal = globalThis as unknown as { __mock_supabase_store__?: MockStore };
  if (!globalVal.__mock_supabase_store__) {
    globalVal.__mock_supabase_store__ = new MockStore();
  }
  return globalVal.__mock_supabase_store__;
}
