import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/202608110005_daily_plan_actions_rpc.sql",
);

describe("daily plan action persistence security", () => {
  it("makes owner actions append-only and exposes only the authenticated validated RPC", () => {
    const migration = readFileSync(migrationPath, "utf8");

    expect(migration).toMatch(/revoke insert, update, delete on table public\.daily_plan_actions from anon, authenticated/i);
    expect(migration).toMatch(/revoke all on table public\.daily_plan_actions from anon, authenticated[\s\S]*grant select on table public\.daily_plan_actions to authenticated/i);
    expect(migration).toMatch(/drop policy if exists daily_plan_actions_(insert|update|delete)_own[\s\S]*drop policy if exists daily_plan_actions_(insert|update|delete)_own[\s\S]*drop policy if exists daily_plan_actions_(insert|update|delete)_own/i);
    expect(migration).toMatch(/create or replace function public\.record_daily_plan_action\([\s\S]*security definer[\s\S]*set search_path = pg_catalog, public/i);
    expect(migration).toMatch(/v_user_id uuid := auth\.uid\(\)[\s\S]*if v_user_id is null[\s\S]*p_plan_date <> \(pg_catalog\.timezone\('Europe\/Madrid', pg_catalog\.now\(\)\)\)::date/i);
    expect(migration).toMatch(/p_action not in \('postpone', 'replace'\)/i);
    expect(migration).toMatch(/on conflict \(user_id, plan_date, task_key\) do nothing/i);
    expect(migration).toMatch(/revoke all on function public\.record_daily_plan_action\(date, text, text, text\) from public, anon/i);
    expect(migration).toMatch(/grant execute on function public\.record_daily_plan_action\(date, text, text, text\) to authenticated/i);
    expect(migration).not.toMatch(/update public\.daily_plan_actions|delete from public\.daily_plan_actions/i);
  });
});
