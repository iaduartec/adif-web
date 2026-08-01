import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migrationPath = resolve(
  process.cwd(),
  "supabase/migrations/202608020001_study_schema.sql",
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
});
