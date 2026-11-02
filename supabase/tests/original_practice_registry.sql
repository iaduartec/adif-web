begin;

do $$
declare
  v_original_count integer;
  v_allowlist_count integer;
  v_blocked boolean := false;
begin
  select count(*) into v_original_count
  from private.learning_questions
  where question_id like 'orig-%' and active;
  if v_original_count <> 158 then
    raise exception 'Expected 158 active reviewed original questions, found %.', v_original_count;
  end if;

  if exists (
    select 1
    from private.learning_questions question
    left join private.active_learning_questions active_question using (question_id)
    where question.question_id like 'orig-%'
      and question.active
      and active_question.question_id is null
  ) then
    raise exception 'An active original question is missing an active concept mapping.';
  end if;

  select count(*) into v_allowlist_count from private.official_simulation_allowlist;
  if v_allowlist_count <> 8 then
    raise exception 'The official simulation allowlist changed unexpectedly (expected 8, got %).', v_allowlist_count;
  end if;
  if not exists (
    select 1 from private.official_simulation_allowlist
    where simulation_id = 'ADIF-2025-1131' and expected_question_count = 18
  ) then
    raise exception 'The real official form allowlist entry was lost.';
  end if;

  begin
    insert into public.simulation_attempts (user_id, simulation_id, elapsed_ms)
    values ('00000000-0000-0000-0000-000000000001', 'practice:original:english-a2', 1);
  exception when check_violation then
    v_blocked := true;
  end;
  if not v_blocked then
    raise exception 'An original practice bucket was accepted by the legacy full-form simulation pipeline.';
  end if;
end;
$$;

insert into auth.users (id, email)
values ('33333333-3333-4333-8333-333333333333', 'original-mode@example.invalid')
on conflict (id) do nothing;
select set_config('request.jwt.claim.sub', '33333333-3333-4333-8333-333333333333', true);
set local role authenticated;
do $$
declare
  v_blocked boolean := false;
begin
  begin
    perform public.record_practice_attempt(
      'orig-a2-there-is-are-001', 'B', 10,
      '44444444-4444-4444-8444-444444444444', 'simulation'
    );
  exception when check_violation then
    if sqlerrm not ilike '%Original practice questions cannot be submitted in simulation mode%' then
      raise;
    end if;
    v_blocked := true;
  end;
  if not v_blocked then
    raise exception 'The RPC accepted an original question in simulation mode.';
  end if;
end;
$$;
reset role;

set local role authenticated;
do $$
declare
  v_blocked boolean := false;
begin
  begin
    perform correct_answer from private.learning_questions limit 1;
  exception when insufficient_privilege then
    v_blocked := true;
  end;
  if not v_blocked then
    raise exception 'Authenticated users can read private answer keys.';
  end if;
end;
$$;
reset role;

-- Re-export must not override an explicit question deactivation either.
update private.learning_questions
set active = false
where question_id = 'orig-a2-present-simple-001';
\ir ../migrations/202610150004_original_practice_registry.sql
do $$
begin
  if (select active from private.learning_concepts where concept_id = 'ingles-topic-present-simple') is distinct from true then
    raise exception 'The explicit-deactivation fixture concept was unexpectedly inactive.';
  end if;
  if (select active from private.learning_questions where question_id = 'orig-a2-present-simple-001') is distinct from false then
    raise exception 'Registry export reactivated an explicitly disabled original question.';
  end if;
end;
$$;

-- Reapplying the generated registry must preserve a retired concept and disable its item.
update private.learning_concepts
set active = false
where concept_id = 'ingles-topic-there-is-are';
\ir ../migrations/202610150004_original_practice_registry.sql
do $$
begin
  if (select active from private.learning_concepts where concept_id = 'ingles-topic-there-is-are') is distinct from false then
    raise exception 'Registry export reactivated a retired learning concept.';
  end if;
  if (select active from private.learning_questions where question_id = 'orig-a2-there-is-are-001') is distinct from false then
    raise exception 'Registry export enabled a question mapped to a retired concept.';
  end if;
  if exists (
    select 1 from private.active_learning_questions
    where question_id = 'orig-a2-there-is-are-001'
  ) then
    raise exception 'A question mapped to a retired concept remains eligible.';
  end if;
end;
$$;

rollback;
