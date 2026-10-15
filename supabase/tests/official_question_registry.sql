\set ON_ERROR_STOP on

begin;

do $$
declare
  v_form_ids text[];
  v_bad_count integer;
begin
  select array_agg(simulation_id order by simulation_id)
  into v_form_ids
  from private.official_simulation_allowlist;

  if v_form_ids is distinct from array[
    'ADIF-2023-1433', 'ADIF-2023-4101',
    'ADIF-2024-1044', 'ADIF-2024-2442', 'ADIF-2024-3403', 'ADIF-2024-3413',
    'ADIF-2025-1131', 'ADIF-2025-4104'
  ]::text[] then
    raise exception 'The private simulation allowlist must contain exactly the eight Telecom forms';
  end if;

  select count(*) into v_bad_count
  from private.official_simulation_allowlist
  where expected_question_count <> case simulation_id
    when 'ADIF-2023-1433' then 15
    when 'ADIF-2023-4101' then 15
    when 'ADIF-2024-1044' then 0
    when 'ADIF-2024-2442' then 0
    when 'ADIF-2024-3403' then 18
    when 'ADIF-2024-3413' then 18
    when 'ADIF-2025-1131' then 18
    when 'ADIF-2025-4104' then 18
  end;
  if v_bad_count <> 0 then
    raise exception 'The private allowlist does not match the accepted question inventories';
  end if;

  if exists (
    select 1
    from private.learning_questions
    where question_id ~ '^ADIF-202[345]-[0-9]{4}-(general-|english-)?Q[0-9]{2}$'
      and active
  ) then
    raise exception 'Uncleared official answer keys must remain inactive';
  end if;
end;
$$;

insert into auth.users (id, email)
values ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'official-registry@example.invalid')
on conflict (id) do nothing;

-- Synthetic rows exercise trigger readiness only; none are source-derived, and this test rolls back.
insert into private.learning_questions (question_id, correct_answer, concept_ids, simulation_id, active)
select
  'ADIF-2025-1131-Q' || lpad(generated.question_number::text, 2, '0'),
  'A',
  array['ict-concept-24'],
  'ADIF-2025-1131',
  true
from generate_series(1, 18) as generated(question_number)
on conflict (question_id) do update
set correct_answer = excluded.correct_answer,
    concept_ids = excluded.concept_ids,
    simulation_id = excluded.simulation_id,
    active = true;

-- A synthetic common-section row can be used by one-question practice only.
insert into private.learning_questions (question_id, correct_answer, concept_ids, simulation_id, active)
values (
  'ADIF-2025-1131-general-Q37',
  'A',
  array['ict-concept-24'],
  'practice:official-common:general',
  true
)
on conflict (question_id) do update
set correct_answer = excluded.correct_answer,
    concept_ids = excluded.concept_ids,
    simulation_id = excluded.simulation_id,
    active = true;

create temporary table official_registry_rpc_fixtures (
  full_answers jsonb not null,
  partial_answers jsonb not null,
  common_answers jsonb not null
);

update private.learning_questions
set active = true
where simulation_id = 'ADIF-2025-1131';

insert into official_registry_rpc_fixtures (full_answers, partial_answers, common_answers)
select
  (
    select jsonb_agg(jsonb_build_object('question_id', question_id, 'selected_answer', null) order by question_id)
    from private.active_learning_questions
    where simulation_id = 'ADIF-2025-1131'
  ),
  '[]'::jsonb,
  jsonb_build_array(jsonb_build_object(
    'question_id', 'ADIF-2025-1131-general-Q37',
    'selected_answer', null
  ));
grant select on official_registry_rpc_fixtures to authenticated;

select set_config('request.jwt.claim.sub', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', true);
set local role authenticated;

select public.submit_simulation_attempt(
  'ADIF-2025-1131',
  900,
  (select full_answers from official_registry_rpc_fixtures),
  'dddddddd-dddd-4ddd-8ddd-dddddddddddd'
);

do $$
begin
  begin
    perform public.submit_simulation_attempt(
      'practice:official-common:general',
      900,
      (select common_answers from official_registry_rpc_fixtures),
      'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'
    );
    raise exception 'A common practice bucket must not start a full-form attempt';
  exception
    when check_violation then
      if sqlerrm not ilike '%Common-section practice buckets cannot start an official form-specific attempt%' then
        raise;
      end if;
  end;
end;
$$;

reset role;

do $$
begin
  if not exists (
    select 1 from public.simulation_attempts
    where user_id = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'
      and simulation_id = 'ADIF-2025-1131'
      and client_event_id = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd'
  ) then
    raise exception 'A completely cleared form must persist its attempt';
  end if;
end;
$$;

update private.learning_questions
set active = false
where question_id = 'ADIF-2025-1131-Q18';

update official_registry_rpc_fixtures
set partial_answers = (
  select jsonb_agg(jsonb_build_object('question_id', question_id, 'selected_answer', null) order by question_id)
  from private.active_learning_questions
  where simulation_id = 'ADIF-2025-1131'
);

select set_config('request.jwt.claim.sub', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', true);
set local role authenticated;

do $$
begin
  begin
    perform public.submit_simulation_attempt(
      'ADIF-2025-1131',
      900,
      (select partial_answers from official_registry_rpc_fixtures),
      'ffffffff-ffff-4fff-8fff-ffffffffffff'
    );
    raise exception 'A form with one inactive question must not start';
  exception
    when check_violation then
      if sqlerrm not ilike '%Official form is not ready%' then
        raise;
      end if;
  end;
end;
$$;

reset role;

do $$
begin
  if not exists (
    select 1 from public.simulation_attempts
    where user_id = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'
      and simulation_id = 'ADIF-2025-1131'
      and client_event_id = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd'
  ) then
    raise exception 'Blocking a changed form must retain the prior attempt';
  end if;
end;
$$;

rollback;
