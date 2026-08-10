// In-memory store for mock Supabase client during Playwright E2E runs
export interface MockQuestionAttempt {
  id: string;
  user_id: string;
  question_id: string;
  selected_answer: string;
  is_correct: boolean;
  mode: "practice" | "simulation";
  elapsed_ms: number;
  created_at: string;
}

export interface MockSimulationAttempt {
  id: string;
  user_id: string;
  simulation_id: string;
  score: number;
  correct_count: number;
  incorrect_count: number;
  omitted_count: number;
  elapsed_ms: number;
  created_at: string;
}

export interface MockSimulationAnswer {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_answer: string;
  is_correct: boolean;
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
  questionAttempts: MockQuestionAttempt[] = [];
  simulationAttempts: MockSimulationAttempt[] = [];
  simulationAnswers: MockSimulationAnswer[] = [];
  lessonProgress: MockLessonProgress[] = [];
  favorites: MockFavorite[] = [];
  notes: MockNote[] = [];
  studyGoals: MockStudyGoal[] = [
    {
      user_id: "test-user-id",
      weekly_target_minutes: 120,
      preferred_days: [1, 3, 5],
      created_at: new Date().toISOString(),
    },
  ];

  reset() {
    this.questionAttempts = [];
    this.simulationAttempts = [];
    this.simulationAnswers = [];
    this.lessonProgress = [];
    this.favorites = [];
    this.notes = [];
    this.studyGoals = [
      {
        user_id: "test-user-id",
        weekly_target_minutes: 120,
        preferred_days: [1, 3, 5],
        created_at: new Date().toISOString(),
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
