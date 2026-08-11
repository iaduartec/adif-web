import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migrationPath = resolve(
  process.cwd(),
  "supabase/migrations/202608020001_study_schema.sql",
);
const atomicSubmissionMigrationPath = resolve(
  process.cwd(),
  "supabase/migrations/202608100002_atomic_simulation_submission.sql",
);
const adaptiveLearningMigrationPath = resolve(
  process.cwd(),
  "supabase/migrations/202608110003_adaptive_learning_core.sql",
);

const requiredTables = [
  "profiles",
  "lesson_progress",
  "question_attempts",
  "simulation_attempts",
  "simulation_answers",
  "favorites",
  "notes",
  "study_goals",
];

describe("study schema contract", () => {
  it("creates every personal table with ownership, RLS, and parent-attempt integrity", () => {
    expect(existsSync(migrationPath)).toBe(true);

    const migration = readFileSync(migrationPath, "utf8");

    for (const table of requiredTables) {
      expect(migration).toMatch(
        new RegExp(`create table public\\.${table}\\s*\\(`, "i"),
      );
      expect(migration).toMatch(
        new RegExp(`alter table public\\.${table} enable row level security`, "i"),
      );
      expect(migration).toMatch(
        new RegExp(`on public\\.${table}`, "i"),
      );
    }

    expect(migration).toMatch(
      /user_id uuid not null references auth\.users\(id\) on delete cascade/i,
    );
    expect(migration).toMatch(
      /foreign key \(attempt_id, user_id\)[\s\S]*references public\.simulation_attempts \(id, user_id\)/i,
    );
    expect(migration).toMatch(/with check \(\(select auth\.uid\(\)\) = user_id\)/i);
  });

  it("persists a simulation attempt and its answers through one authenticated RPC", () => {
    expect(existsSync(atomicSubmissionMigrationPath)).toBe(true);

    const migration = readFileSync(atomicSubmissionMigrationPath, "utf8");

    expect(migration).toMatch(/function public\.submit_simulation_attempt\s*\(/i);
    expect(migration).toMatch(/v_user_id uuid[^;]*auth\.uid\(\)/i);
    expect(migration).toMatch(/insert into public\.simulation_attempts/i);
    expect(migration).toMatch(/insert into public\.simulation_answers/i);
    expect(migration).toMatch(/jsonb_to_recordset\(p_answers\)/i);
    expect(migration).toMatch(/answer\.selected_answer is null or answer\.selected_answer in \('A', 'B', 'C', 'D'\)/i);
    expect(migration).toMatch(/p_score is distinct from round\(\(p_correct_count - p_incorrect_count \/ 3\.0\)/i);
    expect(migration).toMatch(/grant execute[^;]*to authenticated/i);
    expect(migration).not.toMatch(/p_user_id/i);
  });

  it("adds the adaptive learning persistence contract with owned, indexed records", () => {
    expect(existsSync(adaptiveLearningMigrationPath)).toBe(true);

    const migration = readFileSync(adaptiveLearningMigrationPath, "utf8");

    expect(migration).toMatch(/alter table public\.study_goals[\s\S]*add column exam_date date/i);
    expect(migration).toMatch(
      /add column session_minutes integer not null default 30\s+check \(session_minutes between 20 and 120\)/i,
    );
    expect(migration).toMatch(/add column onboarding_completed_at timestamptz/i);

    expect(migration).toMatch(
      /create table public\.concept_mastery\s*\([\s\S]*primary key \(user_id, concept_id\)/i,
    );
    expect(migration).toMatch(/status text not null default 'new'\s+check \(status in \('new', 'learning', 'review', 'consolidated', 'at_risk'\)\)/i);
    expect(migration).toMatch(/ease_factor numeric\(4, 2\) not null default 2\.50\s+check \(ease_factor between 1\.30 and 3\.00\)/i);
    expect(migration).toMatch(/interval_days integer not null default 0 check \(interval_days between 0 and 60\)/i);

    expect(migration).toMatch(
      /create table public\.review_events\s*\([\s\S]*unique \(user_id, client_event_id\)/i,
    );
    expect(migration).toMatch(/rating smallint not null check \(rating between 0 and 3\)/i);
    expect(migration).toMatch(
      /check \(\s*\(source_kind = 'question' and question_id is not null\)\s+or \(source_kind = 'recall' and question_id is null\)\s*\)/i,
    );

    expect(migration).toMatch(
      /create table public\.daily_plan_actions\s*\([\s\S]*unique \(user_id, plan_date, task_key\)/i,
    );
    expect(migration).toMatch(/task_key text not null check \(char_length\(task_key\) between 1 and 200\)/i);
    expect(migration).toMatch(
      /check \(\s*\(action = 'replace' and replacement_task_key is not null and char_length\(replacement_task_key\) > 0\)\s+or \(action = 'postpone' and replacement_task_key is null\)\s*\)/i,
    );

    for (const table of ["concept_mastery", "review_events", "daily_plan_actions"]) {
      expect(migration).toMatch(
        new RegExp(`alter table public\\.${table} enable row level security`, "i"),
      );
      expect(migration).toMatch(
        new RegExp(`user_id uuid not null references auth\\.users\\(id\\) on delete cascade`, "i"),
      );
    }

    expect(migration).toMatch(/create policy concept_mastery_update_own/i);
    expect(migration).toMatch(/create policy daily_plan_actions_delete_own/i);
    expect(migration).toMatch(/create policy review_events_select_own/i);
    expect(migration).toMatch(/create policy review_events_insert_own/i);
    expect(migration).not.toMatch(/create policy review_events_update_own/i);
    expect(migration).not.toMatch(/create policy review_events_delete_own/i);

    expect(migration).toMatch(/create index concept_mastery_user_due_idx on public\.concept_mastery \(user_id, due_on\)/i);
    expect(migration).toMatch(/create index review_events_user_concept_occurred_idx on public\.review_events \(user_id, concept_id, occurred_at desc\)/i);
    expect(migration).toMatch(/create index daily_plan_actions_user_date_idx on public\.daily_plan_actions \(user_id, plan_date\)/i);
    expect(migration).toMatch(/create trigger concept_mastery_set_updated_at/i);
  });
});
