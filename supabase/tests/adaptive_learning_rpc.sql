\set ON_ERROR_STOP on

begin;

insert into auth.users (id, email)
values
  ('11111111-1111-4111-8111-111111111111', 'adaptive-rpc-owner@example.invalid'),
  ('22222222-2222-4222-8222-222222222222', 'adaptive-rpc-other@example.invalid')
on conflict (id) do nothing;

select jsonb_agg(
  jsonb_build_object('question_id', question_id, 'selected_answer', null)
  order by question_id
)::text as simulation_answers
from private.active_learning_questions
where simulation_id = 'ADIF-2025-1131'
\gset

create temporary table rpc_fixtures (answers jsonb not null);
insert into rpc_fixtures values (:'simulation_answers'::jsonb);
grant select on rpc_fixtures to authenticated;

select set_config('request.jwt.claim.sub', '11111111-1111-4111-8111-111111111111', true);
set local role authenticated;

select public.record_practice_attempt(
  'ADIF-2025-1131-Q01', 'A', 420,
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'practice'
);
select public.record_practice_attempt(
  'ADIF-2025-1131-Q01', 'A', 420,
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'practice'
);

do $$
begin
  perform public.record_practice_attempt(
    'ADIF-2025-1131-Q01', 'B', 420,
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'practice'
  );
  raise exception 'Expected changed practice payload to be rejected';
exception
  when check_violation then
    if sqlerrm not ilike '%different payload%' then raise; end if;
end;
$$;

select public.submit_simulation_attempt(
  'ADIF-2025-1131', 900, :'simulation_answers'::jsonb,
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
);
select public.submit_simulation_attempt(
  'ADIF-2025-1131', 900, :'simulation_answers'::jsonb,
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
);

do $$
begin
  perform public.submit_simulation_attempt(
    'ADIF-2025-1131', 901,
    (select answers from rpc_fixtures),
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
  );
  raise exception 'Expected changed simulation payload to be rejected';
exception
  when check_violation then
    if sqlerrm not ilike '%different payload%' then raise; end if;
end;
$$;

do $$
begin
  perform public.submit_simulation_attempt(
    'ADIF-2025-1131', 900,
    (select answers - (jsonb_array_length(answers) - 1) from rpc_fixtures),
    'd1111111-1111-4111-8111-111111111111'
  );
  raise exception 'Expected incomplete simulation payload to be rejected';
exception when check_violation then null;
end;
$$;

do $$
begin
  perform public.submit_simulation_attempt(
    'ADIF-2025-1131', 900,
    (select (answers - (jsonb_array_length(answers) - 1)) || jsonb_build_array(answers -> 0)
      from rpc_fixtures),
    'd2222222-2222-4222-8222-222222222222'
  );
  raise exception 'Expected duplicate simulation question to be rejected';
exception when check_violation then null;
end;
$$;

do $$
begin
  perform public.submit_simulation_attempt(
    'ADIF-2025-1131', 900,
    (select jsonb_set(answers, '{0,question_id}', '"ADIF-2099-0000-Q01"'::jsonb)
      from rpc_fixtures),
    'd3333333-3333-4333-8333-333333333333'
  );
  raise exception 'Expected foreign simulation question to be rejected';
exception when check_violation then null;
end;
$$;

do $$
begin
  perform public.submit_simulation_attempt(
    'ADIF-2025-1131', 900,
    (select jsonb_set(answers, '{0,selected_answer}', '"E"'::jsonb) from rpc_fixtures),
    'd4444444-4444-4444-8444-444444444444'
  );
  raise exception 'Expected invalid simulation answer to be rejected';
exception when check_violation then null;
end;
$$;

do $$
begin
  perform public.submit_simulation_attempt(
    'ADIF-2025-1131', -1, (select answers from rpc_fixtures),
    'd5555555-5555-4555-8555-555555555555'
  );
  raise exception 'Expected invalid simulation elapsed time to be rejected';
exception when check_violation then null;
end;
$$;

do $$
begin
  insert into public.question_attempts (
    user_id, question_id, selected_answer, is_correct, mode, elapsed_ms
  ) values (
    auth.uid(), 'ADIF-2025-1131-Q01', 'A', true, 'practice', 1
  );
  raise exception 'Expected direct evidence insert to be denied';
exception when insufficient_privilege then null;
end;
$$;

select public.record_daily_plan_action(
  (pg_catalog.timezone('Europe/Madrid', pg_catalog.now()))::date,
  'review:ict-concept-24', 'postpone', null
);
select public.record_daily_plan_action(
  (pg_catalog.timezone('Europe/Madrid', pg_catalog.now()))::date,
  'review:ict-concept-24', 'postpone', null
);

do $$
begin
  perform public.record_daily_plan_action(
    (pg_catalog.timezone('Europe/Madrid', pg_catalog.now()))::date,
    'review:ict-concept-24', 'replace', 'lesson:ict-rd-346-2011'
  );
  raise exception 'Expected changed daily action to be rejected';
exception when unique_violation then null;
end;
$$;

do $$
begin
  insert into public.daily_plan_actions (
    user_id, plan_date, task_key, action, replacement_task_key
  ) values (
    auth.uid(), (pg_catalog.timezone('Europe/Madrid', pg_catalog.now()))::date,
    'review:direct-write', 'postpone', null
  );
  raise exception 'Expected direct daily action insert to be denied';
exception when insufficient_privilege then null;
end;
$$;

reset role;

do $$
declare
  protected_table text;
  canonical_answers jsonb;
begin
  if has_schema_privilege('authenticated', 'private', 'usage') then
    raise exception 'authenticated unexpectedly has private schema usage';
  end if;
  foreach protected_table in array array[
    'concept_mastery', 'review_events', 'question_attempts',
    'simulation_attempts', 'simulation_answers', 'daily_plan_actions'
  ] loop
    if has_table_privilege('authenticated', 'public.' || protected_table, 'insert')
      or has_table_privilege('authenticated', 'public.' || protected_table, 'update')
      or has_table_privilege('authenticated', 'public.' || protected_table, 'delete') then
      raise exception 'authenticated unexpectedly has mutation privilege on %', protected_table;
    end if;
    if not has_table_privilege('authenticated', 'public.' || protected_table, 'select') then
      raise exception 'authenticated lacks owner read privilege on %', protected_table;
    end if;
  end loop;

  if (select count(*) from public.daily_plan_actions
      where user_id = '11111111-1111-4111-8111-111111111111') <> 1 then
    raise exception 'Daily action retry did not preserve one immutable row';
  end if;

  if (select count(*) from public.question_attempts
      where user_id = '11111111-1111-4111-8111-111111111111') <> 1 then
    raise exception 'Practice idempotency did not preserve one canonical attempt';
  end if;
  if (select request_fingerprint from public.question_attempts
      where user_id = '11111111-1111-4111-8111-111111111111')
      <> pg_catalog.md5(jsonb_build_array(
        'ADIF-2025-1131-Q01', 'A', 420, 'practice'
      )::text) then
    raise exception 'Practice fingerprint is not the canonical built-in MD5 value';
  end if;
  if (select count(*) from public.simulation_attempts
      where user_id = '11111111-1111-4111-8111-111111111111') <> 1 then
    raise exception 'Simulation idempotency did not preserve one canonical attempt';
  end if;
  select jsonb_agg(jsonb_build_array(answer.question_id, answer.selected_answer)
    order by answer.question_id)
  into canonical_answers
  from jsonb_to_recordset((select answers from rpc_fixtures))
    answer(question_id text, selected_answer text);
  if (select request_fingerprint from public.simulation_attempts
      where user_id = '11111111-1111-4111-8111-111111111111')
      <> pg_catalog.md5(jsonb_build_object(
        'simulation_id', 'ADIF-2025-1131',
        'elapsed_ms', 900,
        'answers', canonical_answers
      )::text) then
    raise exception 'Simulation fingerprint is not the canonical built-in MD5 value';
  end if;
  if (select count(*) from public.simulation_answers answer
      join public.simulation_attempts attempt on attempt.id = answer.attempt_id
      where attempt.user_id = '11111111-1111-4111-8111-111111111111') <> 18 then
    raise exception 'Simulation answers were not committed atomically';
  end if;
end;
$$;

update private.learning_concepts set active = false where concept_id = 'ict-concept-24';
select set_config('request.jwt.claim.sub', '22222222-2222-4222-8222-222222222222', true);
set local role authenticated;

do $$
begin
  perform public.record_practice_attempt(
    'ADIF-2025-1131-Q01', 'A', 1,
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'practice'
  );
  raise exception 'Expected inactive concept practice to be rejected';
exception when no_data_found then null;
end;
$$;

do $$
begin
  perform public.submit_simulation_attempt(
    'ADIF-2025-1131', 900, (select answers from rpc_fixtures),
    'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'
  );
  raise exception 'Expected inactive concept simulation to be rejected';
exception when check_violation then null;
end;
$$;

reset role;

do $$
begin
  if exists (
    select 1 from public.question_attempts
    where user_id = '22222222-2222-4222-8222-222222222222'
  ) then
    raise exception 'Rejected practice payload left a partial write';
  end if;
  if exists (
    select 1 from public.simulation_attempts
    where user_id = '22222222-2222-4222-8222-222222222222'
  ) then
    raise exception 'Rejected simulation payload left a partial write';
  end if;
end;
$$;

select 'RPC_BEHAVIOR_OK' as result;

rollback;
