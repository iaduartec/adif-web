import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  resolve(process.cwd(), "supabase/migrations/202608110004_atomic_review_persistence.sql"),
  "utf8",
);
const behaviorSqlPath = resolve(process.cwd(), "supabase/tests/adaptive_learning_rpc.sql");
const setupDocsPath = resolve(process.cwd(), "docs/supabase-setup.md");

describe("atomic review persistence migration", () => {
  it("keeps answer keys and concept mappings outside the exposed public schema", () => {
    expect(migration).toMatch(/create schema if not exists private/i);
    expect(migration).toMatch(/create table private\.learning_questions/i);
    expect(migration).toMatch(/correct_answer text not null/i);
    expect(migration).toMatch(/concept_ids text\[\] not null/i);
    expect(migration).toMatch(/revoke all on schema private from public, anon, authenticated/i);
  });

  it("records practice from client-safe inputs and derives identity and evidence in one RPC", () => {
    const practice = migration.match(
      /create function public\.record_practice_attempt[\s\S]+?comment on function public\.record_practice_attempt/i,
    )?.[0] ?? "";

    expect(practice).toMatch(/p_question_id text[\s\S]*p_selected_answer text[\s\S]*p_elapsed_ms bigint[\s\S]*p_client_event_id uuid/i);
    expect(practice).not.toMatch(/p_user_id|p_is_correct|p_correct_answer|p_concept_ids|p_rating|p_mastery/i);
    expect(practice).toMatch(/auth\.uid\(\)/i);
    expect(practice).toMatch(/from private\.active_learning_questions/i);
    expect(practice).toMatch(/v_is_correct := p_selected_answer = v_question\.correct_answer/i);
    expect(practice).toMatch(/insert into public\.question_attempts/i);
    expect(practice).toMatch(/on conflict \(user_id, client_event_id\) do nothing/i);
    expect(practice).toMatch(/perform private\.record_review_evidence/i);
    expect(migration).toMatch(/select \*[\s\S]*from public\.concept_mastery[\s\S]*for update/i);
    expect(migration).toMatch(/insert into public\.review_events/i);
    expect(migration).toMatch(/update public\.concept_mastery/i);
  });

  it("persists duplicate attempts but suppresses question mastery evidence for 24 hours", () => {
    expect(migration).toMatch(/re\.question_id = p_question_id/i);
    expect(migration).toMatch(/re\.concept_id = p_concept_id/i);
    expect(migration).toMatch(/re\.occurred_at > p_occurred_at - interval '24 hours'/i);
    expect(migration).toMatch(/return false;/i);
  });

  it("makes practice and simulation submissions retry-safe by authenticated owner and request UUID", () => {
    expect(migration).toMatch(/add column client_event_id uuid/i);
    expect(migration).toMatch(/unique \(user_id, client_event_id\)/i);
    expect(migration).toMatch(/security definer/i);
    expect(migration).toMatch(/revoke all on function public\.record_practice_attempt[^;]+ from public, anon/i);
    expect(migration).toMatch(/grant execute on function public\.record_practice_attempt[^;]+ to authenticated/i);
    expect(migration).toMatch(/add column request_fingerprint text/i);
    expect(migration).toMatch(/request_fingerprint is distinct from v_request_fingerprint/i);
    expect(migration).toMatch(/Idempotency key was already used with a different payload/i);
    expect(migration).not.toMatch(/\bdigest\s*\(/i);
    expect(migration.match(/pg_catalog\.md5\s*\(/gi)?.length).toBeGreaterThanOrEqual(2);
  });

  it("removes direct client mutation privileges while preserving authenticated owner reads", () => {
    for (const table of [
      "concept_mastery",
      "review_events",
      "question_attempts",
      "simulation_attempts",
      "simulation_answers",
    ]) {
      expect(migration).toMatch(new RegExp(`revoke insert, update, delete on table public\\.${table}`, "i"));
      expect(migration).toMatch(new RegExp(`grant select on table public\\.${table} to authenticated`, "i"));
    }
    expect(migration).toMatch(/drop policy concept_mastery_insert_own/i);
    expect(migration).toMatch(/drop policy review_events_insert_own/i);
    expect(migration).toMatch(/drop policy question_attempts_insert_own/i);
  });

  it("requires every question concept to remain active in practice and simulations", () => {
    expect(migration).toMatch(/create view private\.active_learning_questions/i);
    expect(migration).toMatch(/join private\.learning_concepts[\s\S]*concept\.active/i);
    expect(migration.match(/private\.active_learning_questions/gi)?.length).toBeGreaterThanOrEqual(6);
  });

  it("replaces the simulation RPC with a server-derived answer-key and mastery transaction", () => {
    const simulation = migration.match(
      /create function public\.submit_simulation_attempt[\s\S]+?comment on function public\.submit_simulation_attempt/i,
    )?.[0] ?? "";

    expect(migration).toMatch(/drop function public\.submit_simulation_attempt\(text, integer, integer, integer, numeric, bigint, jsonb\)/i);
    expect(simulation).toMatch(/p_simulation_id text[\s\S]*p_elapsed_ms bigint[\s\S]*p_answers jsonb[\s\S]*p_client_event_id uuid/i);
    expect(simulation).not.toMatch(/p_correct_count|p_incorrect_count|p_omitted_count|p_score|p_is_correct|p_correct_answer|p_user_id/i);
    expect(simulation).toMatch(/join private\.active_learning_questions/i);
    expect(simulation).toMatch(/answer\.selected_answer = question\.correct_answer/i);
    expect(simulation).toMatch(/insert into public\.simulation_attempts/i);
    expect(simulation).toMatch(/insert into public\.simulation_answers/i);
    expect(simulation).toMatch(/perform private\.record_review_evidence/i);
    expect(simulation).toMatch(/private\.simulation_attempt_result/i);
    expect(migration).toMatch(/insert into public\.review_events/i);
    expect(migration).toMatch(/update public\.concept_mastery/i);
  });

  it("uses Madrid dates and explicit locking for mastery scheduling", () => {
    expect(migration).toMatch(/at time zone 'Europe\/Madrid'/i);
    expect(migration).toMatch(/order by concept_id/i);
    expect(migration).toMatch(/from public\.concept_mastery[\s\S]*for update/i);
  });

  it("ships a repeatable PostgreSQL behavioral regression and documents its command", () => {
    const behaviorSql = readFileSync(behaviorSqlPath, "utf8");
    const setupDocs = readFileSync(setupDocsPath, "utf8");

    expect(behaviorSql).toMatch(/begin;/i);
    expect(behaviorSql).toMatch(/rollback;/i);
    expect(behaviorSql).toMatch(/RPC_BEHAVIOR_OK/i);
    expect(behaviorSql).toMatch(/has_schema_privilege\('authenticated', 'private', 'usage'\)/i);
    expect(behaviorSql).toMatch(/different payload/i);
    expect(setupDocs).toContain("supabase/tests/adaptive_learning_rpc.sql");
    expect(setupDocs).toContain("psql");
  });
});
