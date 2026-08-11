export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      concept_mastery: {
        Row: {
          concept_id: string;
          correct_evidence: number;
          created_at: string;
          due_on: string | null;
          ease_factor: number;
          incorrect_evidence: number;
          interval_days: number;
          last_evidence_at: string | null;
          last_reviewed_at: string | null;
          repetitions: number;
          status: "new" | "learning" | "review" | "consolidated" | "at_risk";
          updated_at: string;
          user_id: string;
        };
        Insert: {
          concept_id: string;
          correct_evidence?: number;
          created_at?: string;
          due_on?: string | null;
          ease_factor?: number;
          incorrect_evidence?: number;
          interval_days?: number;
          last_evidence_at?: string | null;
          last_reviewed_at?: string | null;
          repetitions?: number;
          status?: "new" | "learning" | "review" | "consolidated" | "at_risk";
          updated_at?: string;
          user_id: string;
        };
        Update: {
          concept_id?: string;
          correct_evidence?: number;
          created_at?: string;
          due_on?: string | null;
          ease_factor?: number;
          incorrect_evidence?: number;
          interval_days?: number;
          last_evidence_at?: string | null;
          last_reviewed_at?: string | null;
          repetitions?: number;
          status?: "new" | "learning" | "review" | "consolidated" | "at_risk";
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      daily_plan_actions: {
        Row: {
          action: "postpone" | "replace";
          created_at: string;
          id: string;
          plan_date: string;
          replacement_task_key: string | null;
          task_key: string;
          user_id: string;
        };
        Insert: {
          action: "postpone" | "replace";
          created_at?: string;
          id?: string;
          plan_date: string;
          replacement_task_key?: string | null;
          task_key: string;
          user_id: string;
        };
        Update: {
          action?: "postpone" | "replace";
          created_at?: string;
          id?: string;
          plan_date?: string;
          replacement_task_key?: string | null;
          task_key?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      favorites: {
        Row: {
          created_at: string;
          id: string;
          item_id: string;
          item_type: "question" | "flashcard";
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          item_id: string;
          item_type: "question" | "flashcard";
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          item_id?: string;
          item_type?: "question" | "flashcard";
          user_id?: string;
        };
        Relationships: [];
      };
      lesson_progress: {
        Row: {
          completed: boolean;
          created_at: string;
          id: string;
          last_activity_at: string;
          lesson_id: string;
          percent: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          completed?: boolean;
          created_at?: string;
          id?: string;
          last_activity_at?: string;
          lesson_id: string;
          percent?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          completed?: boolean;
          created_at?: string;
          id?: string;
          last_activity_at?: string;
          lesson_id?: string;
          percent?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      notes: {
        Row: {
          body: string;
          created_at: string;
          id: string;
          lesson_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          body: string;
          created_at?: string;
          id?: string;
          lesson_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          body?: string;
          created_at?: string;
          id?: string;
          lesson_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          display_name: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          display_name: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      question_attempts: {
        Row: {
          created_at: string;
          elapsed_ms: number;
          id: string;
          is_correct: boolean;
          mode: "practice" | "simulation";
          question_id: string;
          selected_answer: "A" | "B" | "C" | "D";
          user_id: string;
        };
        Insert: {
          created_at?: string;
          elapsed_ms: number;
          id?: string;
          is_correct: boolean;
          mode: "practice" | "simulation";
          question_id: string;
          selected_answer: "A" | "B" | "C" | "D";
          user_id: string;
        };
        Update: {
          created_at?: string;
          elapsed_ms?: number;
          id?: string;
          is_correct?: boolean;
          mode?: "practice" | "simulation";
          question_id?: string;
          selected_answer?: "A" | "B" | "C" | "D";
          user_id?: string;
        };
        Relationships: [];
      };
      review_events: {
        Row: {
          client_event_id: string;
          concept_id: string;
          created_at: string;
          id: string;
          occurred_at: string;
          question_id: string | null;
          rating: number;
          source_kind: "recall" | "question";
          user_id: string;
        };
        Insert: {
          client_event_id: string;
          concept_id: string;
          created_at?: string;
          id?: string;
          occurred_at?: string;
          question_id?: string | null;
          rating: number;
          source_kind: "recall" | "question";
          user_id: string;
        };
        Update: {
          client_event_id?: string;
          concept_id?: string;
          created_at?: string;
          id?: string;
          occurred_at?: string;
          question_id?: string | null;
          rating?: number;
          source_kind?: "recall" | "question";
          user_id?: string;
        };
        Relationships: [];
      };
      simulation_answers: {
        Row: {
          attempt_id: string;
          created_at: string;
          id: string;
          is_correct: boolean;
          question_id: string;
          selected_answer: "A" | "B" | "C" | "D" | null;
          user_id: string;
        };
        Insert: {
          attempt_id: string;
          created_at?: string;
          id?: string;
          is_correct: boolean;
          question_id: string;
          selected_answer?: "A" | "B" | "C" | "D" | null;
          user_id: string;
        };
        Update: {
          attempt_id?: string;
          created_at?: string;
          id?: string;
          is_correct?: boolean;
          question_id?: string;
          selected_answer?: "A" | "B" | "C" | "D" | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "simulation_answers_attempt_id_user_id_fkey";
            columns: ["attempt_id", "user_id"];
            isOneToOne: false;
            referencedRelation: "simulation_attempts";
            referencedColumns: ["id", "user_id"];
          },
        ];
      };
      simulation_attempts: {
        Row: {
          correct_count: number;
          created_at: string;
          elapsed_ms: number;
          id: string;
          incorrect_count: number;
          omitted_count: number;
          score: number;
          simulation_id: string;
          user_id: string;
        };
        Insert: {
          correct_count?: number;
          created_at?: string;
          elapsed_ms: number;
          id?: string;
          incorrect_count?: number;
          omitted_count?: number;
          score?: number;
          simulation_id: string;
          user_id: string;
        };
        Update: {
          correct_count?: number;
          created_at?: string;
          elapsed_ms?: number;
          id?: string;
          incorrect_count?: number;
          omitted_count?: number;
          score?: number;
          simulation_id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      study_goals: {
        Row: {
          created_at: string;
          exam_date: string | null;
          onboarding_completed_at: string | null;
          preferred_days: number[];
          session_minutes: number;
          updated_at: string;
          user_id: string;
          weekly_target_minutes: number;
        };
        Insert: {
          created_at?: string;
          exam_date?: string | null;
          onboarding_completed_at?: string | null;
          preferred_days?: number[];
          session_minutes?: number;
          updated_at?: string;
          user_id: string;
          weekly_target_minutes: number;
        };
        Update: {
          created_at?: string;
          exam_date?: string | null;
          onboarding_completed_at?: string | null;
          preferred_days?: number[];
          session_minutes?: number;
          updated_at?: string;
          user_id?: string;
          weekly_target_minutes?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      submit_simulation_attempt: {
        Args: {
          p_answers: Json;
          p_correct_count: number;
          p_elapsed_ms: number;
          p_incorrect_count: number;
          p_omitted_count: number;
          p_score: number;
          p_simulation_id: string;
        };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<
  TableName extends keyof Database["public"]["Tables"],
> = Database["public"]["Tables"][TableName]["Row"];

export type TablesInsert<
  TableName extends keyof Database["public"]["Tables"],
> = Database["public"]["Tables"][TableName]["Insert"];

export type TablesUpdate<
  TableName extends keyof Database["public"]["Tables"],
> = Database["public"]["Tables"][TableName]["Update"];
