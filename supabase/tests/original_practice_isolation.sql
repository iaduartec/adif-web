\set ON_ERROR_STOP on
begin;

insert into auth.users (id, email) values
  ('10000000-0000-4000-8000-000000000001', 'student-a@example.invalid'),
  ('20000000-0000-4000-8000-000000000002', 'student-b@example.invalid');

select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000001', true);
set local role authenticated;
do $$
declare
  first_result jsonb;
  retry_result jsonb;
  rejected boolean := false;
begin
  first_result := public.record_practice_attempt('orig-a2-there-is-are-001', 'B', 100, '11111111-1111-4111-8111-111111111111', 'practice');
  retry_result := public.record_practice_attempt('orig-a2-there-is-are-001', 'B', 100, '11111111-1111-4111-8111-111111111111', 'practice');
  if first_result->>'attempt_id' is distinct from retry_result->>'attempt_id' or first_result->>'is_correct' <> 'true' then
    raise exception 'Correct grading or idempotent replay failed';
  end if;
  begin
    perform public.record_practice_attempt('orig-a2-there-is-are-001', 'A', 100, '11111111-1111-4111-8111-111111111111', 'practice');
  exception when check_violation then rejected := true;
  end;
  if not rejected then raise exception 'Changed retry was accepted'; end if;
  if (select count(*) from public.question_attempts) <> 1 then raise exception 'Expected one owner attempt'; end if;
end $$;

select set_config('request.jwt.claim.sub', '20000000-0000-4000-8000-000000000002', true);
do $$
declare
  result jsonb;
  rejected boolean := false;
begin
  if (select count(*) from public.question_attempts) <> 0 then raise exception 'User B can see user A attempts'; end if;
  result := public.record_practice_attempt('orig-psico-memory-001', 'A', 250, '22222222-2222-4222-8222-222222222222', 'practice');
  if result->>'is_correct' <> 'false' then raise exception 'Incorrect answer was not graded by the server'; end if;
  if (select count(*) from public.question_attempts) <> 1 then raise exception 'User B cannot see their own attempt'; end if;
  begin
    insert into public.question_attempts (user_id, question_id, selected_answer, is_correct, mode, elapsed_ms)
    values ('10000000-0000-4000-8000-000000000001', 'orig-psico-memory-001', 'A', true, 'practice', 0);
  exception when insufficient_privilege then rejected := true;
  end;
  if not rejected then raise exception 'Direct cross-user write was accepted'; end if;
end $$;

select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000001', true);
do $$
begin
  if (select count(*) from public.question_attempts) <> 1 then raise exception 'User A can see user B attempts'; end if;
  if exists (select 1 from public.question_attempts where question_id = 'orig-psico-memory-001') then
    raise exception 'User B question leaked to user A';
  end if;
end $$;
reset role;
rollback;
