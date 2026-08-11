create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table private.learning_concepts (
  concept_id text primary key,
  active boolean not null default true
);

create table private.learning_questions (
  question_id text primary key,
  correct_answer text not null check (correct_answer in ('A', 'B', 'C', 'D')),
  concept_ids text[] not null check (cardinality(concept_ids) > 0),
  simulation_id text not null,
  active boolean not null default true
);

revoke all on all tables in schema private from public, anon, authenticated;

-- Seeded from the audited active theory registry and official question repository.
insert into private.learning_concepts (concept_id, active)
select concept_id, true
from jsonb_array_elements_text('["igualdad-concept-1","igualdad-concept-2","igualdad-concept-3","igualdad-concept-4","igualdad-concept-5","igualdad-concept-6","igualdad-concept-7","igualdad-concept-8","igualdad-concept-9","igualdad-concept-10","igualdad-concept-11","igualdad-concept-12","igualdad-concept-13","igualdad-concept-14","igualdad-concept-15","prl-concept-1","prl-concept-2","prl-concept-3","prl-concept-4","prl-concept-5","prl-concept-6","prl-concept-7","prl-concept-8","prl-concept-9","prl-concept-10","prl-concept-11","prl-concept-12","prl-concept-13","prl-concept-14","estatuto-concept-1","estatuto-concept-2","estatuto-concept-3","estatuto-concept-4","estatuto-concept-5","estatuto-concept-6","estatuto-concept-7","estatuto-concept-8","estatuto-concept-9","estatuto-concept-10","ict-concept-1","ict-concept-2","ict-concept-3","ict-concept-4","ict-concept-5","ict-concept-6","ict-concept-7","ict-concept-8","ict-concept-9","ict-concept-10","ict-concept-11","ict-concept-12","ict-concept-13","ict-concept-14","ict-concept-15","ict-concept-16","ict-concept-17","ict-concept-18","ict-concept-19","ict-concept-20","ict-concept-21","ict-concept-22","ict-concept-23","ict-concept-24","ict-concept-25","ict-concept-26","ict-concept-27","ict-concept-28","ict-concept-29","ict-concept-30","ict-concept-31","ict-concept-32","ict-concept-33","cem-concept-1","cem-concept-2","cem-concept-3","cem-concept-4","cem-concept-5","cem-concept-6","cem-concept-7","cem-concept-8","cem-concept-9","cem-concept-10","cem-concept-11","cem-concept-12","cem-concept-13","cem-concept-14","rcf-concept-1","rcf-concept-2","rcf-concept-3","rcf-concept-4","rcf-concept-5","rcf-concept-6","rcf-concept-7","rcf-concept-8","rcf-concept-9","rcf-concept-10","rcf-concept-11","rcf-concept-12","rcf-concept-13","psico-concept-1","psico-concept-2","psico-concept-3","psico-concept-4","psico-concept-5","psico-concept-6","dr-concept-1","dr-concept-2","dr-concept-3","dr-concept-4","dr-concept-5","dr-concept-6","conducta-concept-1","conducta-concept-2","conducta-concept-3","conducta-concept-4","conducta-concept-5","incomp-concept-1","incomp-concept-2","incomp-concept-3","incomp-concept-4","incomp-concept-5","incomp-concept-6","incomp-concept-7","ingles-concept-1","ingles-concept-2","ingles-concept-3"]'::jsonb) concept_id;

insert into private.learning_questions (
  question_id,
  correct_answer,
  concept_ids,
  simulation_id,
  active
)
select
  seed.id,
  seed.answer,
  array(select jsonb_array_elements_text(seed.concepts)),
  seed.exam,
  true
from jsonb_to_recordset('[{"id":"ADIF-2023-1433-Q01","answer":"C","concepts":["rcf-concept-9"],"exam":"ADIF-2023-1433"},{"id":"ADIF-2023-1433-Q02","answer":"B","concepts":["ict-concept-5"],"exam":"ADIF-2023-1433"},{"id":"ADIF-2023-1433-Q03","answer":"B","concepts":["rcf-concept-7"],"exam":"ADIF-2023-1433"},{"id":"ADIF-2023-1433-Q04","answer":"B","concepts":["ict-concept-11"],"exam":"ADIF-2023-1433"},{"id":"ADIF-2023-1433-Q05","answer":"A","concepts":["ict-concept-12"],"exam":"ADIF-2023-1433"},{"id":"ADIF-2023-1433-Q06","answer":"A","concepts":["ict-concept-7"],"exam":"ADIF-2023-1433"},{"id":"ADIF-2023-1433-Q07","answer":"D","concepts":["rcf-concept-10"],"exam":"ADIF-2023-1433"},{"id":"ADIF-2023-1433-Q08","answer":"A","concepts":["ict-concept-13"],"exam":"ADIF-2023-1433"},{"id":"ADIF-2023-1433-Q09","answer":"C","concepts":["ict-concept-2"],"exam":"ADIF-2023-1433"},{"id":"ADIF-2023-1433-Q10","answer":"B","concepts":["ict-concept-14"],"exam":"ADIF-2023-1433"},{"id":"ADIF-2023-1433-Q11","answer":"D","concepts":["rcf-concept-8"],"exam":"ADIF-2023-1433"},{"id":"ADIF-2023-1433-Q12","answer":"A","concepts":["cem-concept-6"],"exam":"ADIF-2023-1433"},{"id":"ADIF-2023-1433-Q13","answer":"D","concepts":["cem-concept-1"],"exam":"ADIF-2023-1433"},{"id":"ADIF-2023-1433-Q14","answer":"D","concepts":["cem-concept-7"],"exam":"ADIF-2023-1433"},{"id":"ADIF-2023-1433-Q15","answer":"A","concepts":["cem-concept-1"],"exam":"ADIF-2023-1433"},{"id":"ADIF-2023-4101-Q01","answer":"D","concepts":["rcf-concept-8"],"exam":"ADIF-2023-4101"},{"id":"ADIF-2023-4101-Q02","answer":"A","concepts":["rcf-concept-7"],"exam":"ADIF-2023-4101"},{"id":"ADIF-2023-4101-Q03","answer":"C","concepts":["ict-concept-2"],"exam":"ADIF-2023-4101"},{"id":"ADIF-2023-4101-Q04","answer":"B","concepts":["ict-concept-14"],"exam":"ADIF-2023-4101"},{"id":"ADIF-2023-4101-Q05","answer":"A","concepts":["ict-concept-5"],"exam":"ADIF-2023-4101"},{"id":"ADIF-2023-4101-Q06","answer":"C","concepts":["rcf-concept-9"],"exam":"ADIF-2023-4101"},{"id":"ADIF-2023-4101-Q07","answer":"D","concepts":["ict-concept-12"],"exam":"ADIF-2023-4101"},{"id":"ADIF-2023-4101-Q08","answer":"C","concepts":["ict-concept-13"],"exam":"ADIF-2023-4101"},{"id":"ADIF-2023-4101-Q09","answer":"B","concepts":["rcf-concept-10"],"exam":"ADIF-2023-4101"},{"id":"ADIF-2023-4101-Q10","answer":"D","concepts":["ict-concept-11"],"exam":"ADIF-2023-4101"},{"id":"ADIF-2023-4101-Q11","answer":"C","concepts":["ict-concept-7"],"exam":"ADIF-2023-4101"},{"id":"ADIF-2023-4101-Q12","answer":"D","concepts":["cem-concept-1"],"exam":"ADIF-2023-4101"},{"id":"ADIF-2023-4101-Q13","answer":"C","concepts":["cem-concept-6"],"exam":"ADIF-2023-4101"},{"id":"ADIF-2023-4101-Q14","answer":"A","concepts":["cem-concept-1"],"exam":"ADIF-2023-4101"},{"id":"ADIF-2023-4101-Q15","answer":"C","concepts":["cem-concept-7"],"exam":"ADIF-2023-4101"},{"id":"ADIF-2024-3403-Q01","answer":"A","concepts":["ict-concept-15"],"exam":"ADIF-2024-3403"},{"id":"ADIF-2024-3403-Q02","answer":"B","concepts":["ict-concept-16"],"exam":"ADIF-2024-3403"},{"id":"ADIF-2024-3403-Q03","answer":"B","concepts":["ict-concept-17"],"exam":"ADIF-2024-3403"},{"id":"ADIF-2024-3403-Q04","answer":"B","concepts":["ict-concept-18"],"exam":"ADIF-2024-3403"},{"id":"ADIF-2024-3403-Q05","answer":"B","concepts":["ict-concept-19"],"exam":"ADIF-2024-3403"},{"id":"ADIF-2024-3403-Q06","answer":"A","concepts":["ict-concept-20"],"exam":"ADIF-2024-3403"},{"id":"ADIF-2024-3403-Q07","answer":"B","concepts":["ict-concept-21"],"exam":"ADIF-2024-3403"},{"id":"ADIF-2024-3403-Q08","answer":"B","concepts":["ict-concept-22"],"exam":"ADIF-2024-3403"},{"id":"ADIF-2024-3403-Q09","answer":"A","concepts":["ict-concept-23"],"exam":"ADIF-2024-3403"},{"id":"ADIF-2024-3403-Q10","answer":"B","concepts":["rcf-concept-9"],"exam":"ADIF-2024-3403"},{"id":"ADIF-2024-3403-Q11","answer":"C","concepts":["ict-concept-16"],"exam":"ADIF-2024-3403"},{"id":"ADIF-2024-3403-Q12","answer":"A","concepts":["ict-concept-7"],"exam":"ADIF-2024-3403"},{"id":"ADIF-2024-3403-Q13","answer":"C","concepts":["cem-concept-8"],"exam":"ADIF-2024-3403"},{"id":"ADIF-2024-3403-Q14","answer":"D","concepts":["cem-concept-9"],"exam":"ADIF-2024-3403"},{"id":"ADIF-2024-3403-Q15","answer":"D","concepts":["cem-concept-10"],"exam":"ADIF-2024-3403"},{"id":"ADIF-2024-3403-Q16","answer":"C","concepts":["cem-concept-11"],"exam":"ADIF-2024-3403"},{"id":"ADIF-2024-3403-Q17","answer":"B","concepts":["rcf-concept-12"],"exam":"ADIF-2024-3403"},{"id":"ADIF-2024-3403-Q18","answer":"A","concepts":["ict-concept-17"],"exam":"ADIF-2024-3403"},{"id":"ADIF-2024-3413-Q01","answer":"A","concepts":["ict-concept-20"],"exam":"ADIF-2024-3413"},{"id":"ADIF-2024-3413-Q02","answer":"B","concepts":["ict-concept-22"],"exam":"ADIF-2024-3413"},{"id":"ADIF-2024-3413-Q03","answer":"B","concepts":["ict-concept-17"],"exam":"ADIF-2024-3413"},{"id":"ADIF-2024-3413-Q04","answer":"B","concepts":["ict-concept-19"],"exam":"ADIF-2024-3413"},{"id":"ADIF-2024-3413-Q05","answer":"A","concepts":["ict-concept-15"],"exam":"ADIF-2024-3413"},{"id":"ADIF-2024-3413-Q06","answer":"A","concepts":["ict-concept-7"],"exam":"ADIF-2024-3413"},{"id":"ADIF-2024-3413-Q07","answer":"B","concepts":["ict-concept-16"],"exam":"ADIF-2024-3413"},{"id":"ADIF-2024-3413-Q08","answer":"C","concepts":["ict-concept-16"],"exam":"ADIF-2024-3413"},{"id":"ADIF-2024-3413-Q09","answer":"B","concepts":["ict-concept-21"],"exam":"ADIF-2024-3413"},{"id":"ADIF-2024-3413-Q10","answer":"B","concepts":["ict-concept-18"],"exam":"ADIF-2024-3413"},{"id":"ADIF-2024-3413-Q11","answer":"A","concepts":["ict-concept-23"],"exam":"ADIF-2024-3413"},{"id":"ADIF-2024-3413-Q12","answer":"B","concepts":["rcf-concept-9"],"exam":"ADIF-2024-3413"},{"id":"ADIF-2024-3413-Q13","answer":"D","concepts":["cem-concept-9"],"exam":"ADIF-2024-3413"},{"id":"ADIF-2024-3413-Q14","answer":"D","concepts":["cem-concept-10"],"exam":"ADIF-2024-3413"},{"id":"ADIF-2024-3413-Q15","answer":"C","concepts":["cem-concept-8"],"exam":"ADIF-2024-3413"},{"id":"ADIF-2024-3413-Q16","answer":"A","concepts":["cem-concept-11"],"exam":"ADIF-2024-3413"},{"id":"ADIF-2024-3413-Q17","answer":"D","concepts":["rcf-concept-12"],"exam":"ADIF-2024-3413"},{"id":"ADIF-2024-3413-Q18","answer":"C","concepts":["ict-concept-17"],"exam":"ADIF-2024-3413"},{"id":"ADIF-2025-1131-Q01","answer":"A","concepts":["ict-concept-24"],"exam":"ADIF-2025-1131"},{"id":"ADIF-2025-1131-Q02","answer":"A","concepts":["ict-concept-15"],"exam":"ADIF-2025-1131"},{"id":"ADIF-2025-1131-Q03","answer":"B","concepts":["ict-concept-25"],"exam":"ADIF-2025-1131"},{"id":"ADIF-2025-1131-Q04","answer":"A","concepts":["rcf-concept-11"],"exam":"ADIF-2025-1131"},{"id":"ADIF-2025-1131-Q05","answer":"A","concepts":["ict-concept-26"],"exam":"ADIF-2025-1131"},{"id":"ADIF-2025-1131-Q06","answer":"B","concepts":["ict-concept-16"],"exam":"ADIF-2025-1131"},{"id":"ADIF-2025-1131-Q07","answer":"C","concepts":["ict-concept-27"],"exam":"ADIF-2025-1131"},{"id":"ADIF-2025-1131-Q08","answer":"D","concepts":["ict-concept-28"],"exam":"ADIF-2025-1131"},{"id":"ADIF-2025-1131-Q09","answer":"A","concepts":["ict-concept-29"],"exam":"ADIF-2025-1131"},{"id":"ADIF-2025-1131-Q10","answer":"A","concepts":["ict-concept-30"],"exam":"ADIF-2025-1131"},{"id":"ADIF-2025-1131-Q11","answer":"A","concepts":["ict-concept-31"],"exam":"ADIF-2025-1131"},{"id":"ADIF-2025-1131-Q12","answer":"A","concepts":["ict-concept-32"],"exam":"ADIF-2025-1131"},{"id":"ADIF-2025-1131-Q13","answer":"D","concepts":["cem-concept-12"],"exam":"ADIF-2025-1131"},{"id":"ADIF-2025-1131-Q14","answer":"B","concepts":["cem-concept-13"],"exam":"ADIF-2025-1131"},{"id":"ADIF-2025-1131-Q15","answer":"D","concepts":["cem-concept-14"],"exam":"ADIF-2025-1131"},{"id":"ADIF-2025-1131-Q16","answer":"C","concepts":["cem-concept-12"],"exam":"ADIF-2025-1131"},{"id":"ADIF-2025-1131-Q17","answer":"D","concepts":["ict-concept-33"],"exam":"ADIF-2025-1131"},{"id":"ADIF-2025-1131-Q18","answer":"A","concepts":["rcf-concept-13"],"exam":"ADIF-2025-1131"},{"id":"ADIF-2025-4104-Q01","answer":"A","concepts":["ict-concept-15"],"exam":"ADIF-2025-4104"},{"id":"ADIF-2025-4104-Q02","answer":"B","concepts":["ict-concept-25"],"exam":"ADIF-2025-4104"},{"id":"ADIF-2025-4104-Q03","answer":"A","concepts":["ict-concept-26"],"exam":"ADIF-2025-4104"},{"id":"ADIF-2025-4104-Q04","answer":"D","concepts":["ict-concept-28"],"exam":"ADIF-2025-4104"},{"id":"ADIF-2025-4104-Q05","answer":"A","concepts":["ict-concept-29"],"exam":"ADIF-2025-4104"},{"id":"ADIF-2025-4104-Q06","answer":"A","concepts":["ict-concept-31"],"exam":"ADIF-2025-4104"},{"id":"ADIF-2025-4104-Q07","answer":"C","concepts":["ict-concept-27"],"exam":"ADIF-2025-4104"},{"id":"ADIF-2025-4104-Q08","answer":"A","concepts":["rcf-concept-11"],"exam":"ADIF-2025-4104"},{"id":"ADIF-2025-4104-Q09","answer":"B","concepts":["ict-concept-16"],"exam":"ADIF-2025-4104"},{"id":"ADIF-2025-4104-Q10","answer":"A","concepts":["ict-concept-32"],"exam":"ADIF-2025-4104"},{"id":"ADIF-2025-4104-Q11","answer":"A","concepts":["ict-concept-30"],"exam":"ADIF-2025-4104"},{"id":"ADIF-2025-4104-Q12","answer":"A","concepts":["ict-concept-24"],"exam":"ADIF-2025-4104"},{"id":"ADIF-2025-4104-Q13","answer":"B","concepts":["cem-concept-13"],"exam":"ADIF-2025-4104"},{"id":"ADIF-2025-4104-Q14","answer":"D","concepts":["cem-concept-14"],"exam":"ADIF-2025-4104"},{"id":"ADIF-2025-4104-Q15","answer":"D","concepts":["cem-concept-12"],"exam":"ADIF-2025-4104"},{"id":"ADIF-2025-4104-Q16","answer":"D","concepts":["cem-concept-12"],"exam":"ADIF-2025-4104"},{"id":"ADIF-2025-4104-Q17","answer":"C","concepts":["ict-concept-33"],"exam":"ADIF-2025-4104"},{"id":"ADIF-2025-4104-Q18","answer":"B","concepts":["rcf-concept-13"],"exam":"ADIF-2025-4104"}]'::jsonb)
  as seed(id text, answer text, concepts jsonb, exam text);

create view private.active_learning_questions as
select question.*
from private.learning_questions question
where question.active
  and not exists (
    select 1
    from unnest(question.concept_ids) as mapped(concept_id)
    left join private.learning_concepts concept on concept.concept_id = mapped.concept_id
    where concept.concept_id is null or not concept.active
  );

revoke all on table private.active_learning_questions from public, anon, authenticated;

alter table public.question_attempts add column client_event_id uuid;
alter table public.question_attempts add column request_fingerprint text;
alter table public.question_attempts
  add constraint question_attempts_user_client_event_key unique (user_id, client_event_id);

alter table public.simulation_attempts add column client_event_id uuid;
alter table public.simulation_attempts add column request_fingerprint text;
alter table public.simulation_attempts
  add constraint simulation_attempts_user_client_event_key unique (user_id, client_event_id);

create or replace function private.derived_event_id(
  p_client_event_id uuid,
  p_question_id text,
  p_concept_id text
)
returns uuid
language sql
immutable
strict
set search_path = pg_catalog
as $$
  select (
    substr(v_hash, 1, 8) || '-' || substr(v_hash, 9, 4) || '-' ||
    substr(v_hash, 13, 4) || '-' || substr(v_hash, 17, 4) || '-' ||
    substr(v_hash, 21, 12)
  )::uuid
  from (select md5(p_client_event_id::text || ':' || p_question_id || ':' || p_concept_id) as v_hash) hashed;
$$;

create or replace function private.record_review_evidence(
  p_user_id uuid,
  p_concept_id text,
  p_source_kind text,
  p_question_id text,
  p_rating smallint,
  p_client_event_id uuid,
  p_occurred_at timestamptz,
  p_today date
)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_mastery public.concept_mastery%rowtype;
  v_event_id uuid;
  v_interval_days integer;
  v_repetitions integer;
  v_status text;
begin
  insert into public.concept_mastery (user_id, concept_id)
  values (p_user_id, p_concept_id)
  on conflict (user_id, concept_id) do nothing;

  select *
  into strict v_mastery
  from public.concept_mastery
  where user_id = p_user_id and concept_id = p_concept_id
  for update;

  if p_source_kind = 'question' and exists (
    select 1
    from public.review_events re
    where re.user_id = p_user_id
      and re.source_kind = 'question'
      and re.question_id = p_question_id
      and re.concept_id = p_concept_id
      and re.occurred_at > p_occurred_at - interval '24 hours'
      and re.occurred_at <= p_occurred_at
  ) then
    return false;
  end if;

  insert into public.review_events (
    user_id,
    concept_id,
    source_kind,
    question_id,
    rating,
    client_event_id,
    occurred_at
  ) values (
    p_user_id,
    p_concept_id,
    p_source_kind,
    p_question_id,
    p_rating,
    p_client_event_id,
    p_occurred_at
  )
  on conflict (user_id, client_event_id) do nothing
  returning id into v_event_id;

  if v_event_id is null then
    return false;
  end if;

  if p_source_kind = 'question' and p_rating > 0 then
    update public.concept_mastery
    set status = case
          when v_mastery.status in ('review', 'consolidated') then v_mastery.status
          else 'learning'
        end,
        due_on = least(coalesce(v_mastery.due_on, p_today + 2), p_today + 2),
        last_evidence_at = p_occurred_at,
        correct_evidence = v_mastery.correct_evidence + 1
    where user_id = p_user_id and concept_id = p_concept_id;
    return true;
  end if;

  if p_rating = 0 then
    update public.concept_mastery
    set status = 'at_risk',
        repetitions = 0,
        interval_days = 1,
        due_on = p_today + 1,
        last_reviewed_at = case when p_source_kind = 'recall' then p_occurred_at else v_mastery.last_reviewed_at end,
        last_evidence_at = p_occurred_at,
        incorrect_evidence = v_mastery.incorrect_evidence + 1
    where user_id = p_user_id and concept_id = p_concept_id;
    return true;
  end if;

  if p_rating = 1 then
    update public.concept_mastery
    set status = 'learning',
        interval_days = 2,
        due_on = p_today + 2,
        last_reviewed_at = p_occurred_at,
        last_evidence_at = p_occurred_at,
        correct_evidence = v_mastery.correct_evidence + 1
    where user_id = p_user_id and concept_id = p_concept_id;
    return true;
  end if;

  v_repetitions := v_mastery.repetitions + 1;
  v_interval_days := least(
    60,
    case
      when v_mastery.repetitions = 0 or v_mastery.interval_days = 0
        then case when p_rating = 2 then 3 else 7 end
      when p_rating = 2 then round(v_mastery.interval_days * 2.0)::integer
      else round(v_mastery.interval_days * 2.5)::integer
    end
  );
  v_status := case
    when v_repetitions >= 3 and v_interval_days >= 14 then 'consolidated'
    else 'review'
  end;

  update public.concept_mastery
  set status = v_status,
      repetitions = v_repetitions,
      interval_days = v_interval_days,
      due_on = p_today + v_interval_days,
      last_reviewed_at = p_occurred_at,
      last_evidence_at = p_occurred_at,
      correct_evidence = v_mastery.correct_evidence + 1
  where user_id = p_user_id and concept_id = p_concept_id;

  return true;
end;
$$;

revoke all on function private.derived_event_id(uuid, text, text) from public, anon, authenticated;
revoke all on function private.record_review_evidence(uuid, text, text, text, smallint, uuid, timestamptz, date) from public, anon, authenticated;

create function public.record_practice_attempt(
  p_question_id text,
  p_selected_answer text,
  p_elapsed_ms bigint,
  p_client_event_id uuid,
  p_mode text default 'practice'
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_user_id uuid := auth.uid();
  v_question private.learning_questions%rowtype;
  v_attempt public.question_attempts%rowtype;
  v_concept_id text;
  v_is_correct boolean;
  v_request_fingerprint text;
  v_now timestamptz := statement_timestamp();
  v_today date := (statement_timestamp() at time zone 'Europe/Madrid')::date;
begin
  if v_user_id is null then
    raise exception 'Authentication is required to submit practice.' using errcode = '28000';
  end if;
  if p_client_event_id is null then
    raise exception 'An idempotency key is required.' using errcode = '23514';
  end if;
  if p_selected_answer is null or p_selected_answer not in ('A', 'B', 'C', 'D') then
    raise exception 'The selected answer is invalid.' using errcode = '23514';
  end if;
  if p_mode is null or p_mode not in ('practice', 'simulation') then
    raise exception 'The attempt mode is invalid.' using errcode = '23514';
  end if;
  if p_elapsed_ms is null or p_elapsed_ms < 0 or p_elapsed_ms > 86400000 then
    raise exception 'Elapsed time is outside the accepted range.' using errcode = '23514';
  end if;

  select * into v_question
  from private.active_learning_questions
  where question_id = p_question_id;
  if not found then
    raise exception 'The active question does not exist.' using errcode = 'P0002';
  end if;

  v_is_correct := p_selected_answer = v_question.correct_answer;
  v_request_fingerprint := pg_catalog.md5(
    jsonb_build_array(p_question_id, p_selected_answer, p_elapsed_ms, p_mode)::text
  );
  insert into public.question_attempts (
    user_id, question_id, selected_answer, is_correct, mode, elapsed_ms, client_event_id, request_fingerprint
  ) values (
    v_user_id, p_question_id, p_selected_answer, v_is_correct, p_mode, p_elapsed_ms,
    p_client_event_id, v_request_fingerprint
  )
  on conflict (user_id, client_event_id) do nothing
  returning * into v_attempt;

  if v_attempt.id is null then
    select * into strict v_attempt
    from public.question_attempts
    where user_id = v_user_id and client_event_id = p_client_event_id;
    if v_attempt.request_fingerprint is distinct from v_request_fingerprint then
      raise exception 'Idempotency key was already used with a different payload.' using errcode = '23514';
    end if;
    return jsonb_build_object('attempt_id', v_attempt.id, 'is_correct', v_attempt.is_correct);
  end if;

  for v_concept_id in
    select concept_id
    from unnest(v_question.concept_ids) concept_id
    order by concept_id
  loop
    perform private.record_review_evidence(
      v_user_id,
      v_concept_id,
      'question',
      p_question_id,
      (case when v_is_correct then 2 else 0 end)::smallint,
      private.derived_event_id(p_client_event_id, p_question_id, v_concept_id),
      v_now,
      v_today
    );
  end loop;

  return jsonb_build_object('attempt_id', v_attempt.id, 'is_correct', v_attempt.is_correct);
end;
$$;

revoke all on function public.record_practice_attempt(text, text, bigint, uuid, text) from public, anon;
grant execute on function public.record_practice_attempt(text, text, bigint, uuid, text) to authenticated;
comment on function public.record_practice_attempt(text, text, bigint, uuid, text)
  is 'Atomically persists an idempotent practice attempt and server-derived mastery evidence.';

create function public.record_recall_review(
  p_concept_id text,
  p_rating smallint,
  p_client_event_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_user_id uuid := auth.uid();
  v_existing_event public.review_events%rowtype;
  v_recorded boolean;
  v_now timestamptz := statement_timestamp();
  v_today date := (statement_timestamp() at time zone 'Europe/Madrid')::date;
begin
  if v_user_id is null then
    raise exception 'Authentication is required to submit review.' using errcode = '28000';
  end if;
  if p_rating is null or p_rating < 0 or p_rating > 3 then
    raise exception 'The review rating is invalid.' using errcode = '23514';
  end if;
  if p_client_event_id is null then
    raise exception 'An idempotency key is required.' using errcode = '23514';
  end if;
  select * into v_existing_event
  from public.review_events
  where user_id = v_user_id and client_event_id = p_client_event_id;
  if found then
    if v_existing_event.source_kind <> 'recall'
      or v_existing_event.concept_id <> p_concept_id
      or v_existing_event.rating <> p_rating
      or v_existing_event.question_id is not null then
      raise exception 'Idempotency key was already used with a different payload.' using errcode = '23514';
    end if;
    return true;
  end if;
  if not exists (
    select 1 from private.learning_concepts where concept_id = p_concept_id and active
  ) then
    raise exception 'The active concept does not exist.' using errcode = 'P0002';
  end if;

  v_recorded := private.record_review_evidence(
    v_user_id,
    p_concept_id,
    'recall',
    null,
    p_rating,
    p_client_event_id,
    v_now,
    v_today
  );
  if v_recorded then
    return true;
  end if;

  select * into strict v_existing_event
  from public.review_events
  where user_id = v_user_id and client_event_id = p_client_event_id;
  if v_existing_event.source_kind <> 'recall'
    or v_existing_event.concept_id <> p_concept_id
    or v_existing_event.rating <> p_rating
    or v_existing_event.question_id is not null then
    raise exception 'Idempotency key was already used with a different payload.' using errcode = '23514';
  end if;
  return true;
end;
$$;

revoke all on function public.record_recall_review(text, smallint, uuid) from public, anon;
grant execute on function public.record_recall_review(text, smallint, uuid) to authenticated;

drop function public.submit_simulation_attempt(text, integer, integer, integer, numeric, bigint, jsonb);

create function private.simulation_attempt_result(
  p_user_id uuid,
  p_attempt_id uuid
)
returns jsonb
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select jsonb_build_object(
    'attempt_id', attempt.id,
    'correct_count', attempt.correct_count,
    'incorrect_count', attempt.incorrect_count,
    'omitted_count', attempt.omitted_count,
    'score', attempt.score,
    'elapsed_ms', attempt.elapsed_ms,
    'answers', coalesce((
      select jsonb_agg(jsonb_build_object(
        'question_id', answer.question_id,
        'selected_answer', answer.selected_answer,
        'is_correct', answer.is_correct
      ) order by answer.question_id)
      from public.simulation_answers answer
      where answer.user_id = p_user_id and answer.attempt_id = p_attempt_id
    ), '[]'::jsonb)
  )
  from public.simulation_attempts attempt
  where attempt.user_id = p_user_id and attempt.id = p_attempt_id;
$$;

revoke all on function private.simulation_attempt_result(uuid, uuid) from public, anon, authenticated;

create function public.submit_simulation_attempt(
  p_simulation_id text,
  p_elapsed_ms bigint,
  p_answers jsonb,
  p_client_event_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_user_id uuid := auth.uid();
  v_attempt public.simulation_attempts%rowtype;
  v_expected_count integer;
  v_active_count integer;
  v_correct_count integer;
  v_incorrect_count integer;
  v_omitted_count integer;
  v_score numeric;
  v_canonical_answers jsonb;
  v_request_fingerprint text;
  v_evidence record;
  v_now timestamptz := statement_timestamp();
  v_today date := (statement_timestamp() at time zone 'Europe/Madrid')::date;
begin
  if v_user_id is null then
    raise exception 'Authentication is required to submit an exam.' using errcode = '28000';
  end if;
  if p_client_event_id is null then
    raise exception 'An idempotency key is required.' using errcode = '23514';
  end if;
  if p_elapsed_ms is null or p_elapsed_ms < 0 or p_elapsed_ms > 86400000 then
    raise exception 'Elapsed time is outside the accepted range.' using errcode = '23514';
  end if;
  if jsonb_typeof(p_answers) is distinct from 'array' then
    raise exception 'Answers must be an array.' using errcode = '23514';
  end if;

  select count(*), count(active_question.question_id)
  into v_expected_count, v_active_count
  from private.learning_questions question
  left join private.active_learning_questions active_question
    on active_question.question_id = question.question_id
  where question.simulation_id = p_simulation_id and question.active;
  if v_expected_count = 0
    or v_active_count <> v_expected_count
    or jsonb_array_length(p_answers) <> v_expected_count then
    raise exception 'Answers must match the active simulation.' using errcode = '23514';
  end if;
  if exists (
    select 1
    from jsonb_to_recordset(p_answers) answer(question_id text, selected_answer text)
    left join private.active_learning_questions question
      on question.question_id = answer.question_id
      and question.simulation_id = p_simulation_id
    where question.question_id is null
      or not (answer.selected_answer is null or answer.selected_answer in ('A', 'B', 'C', 'D'))
  ) or (
    select count(distinct answer.question_id)
    from jsonb_to_recordset(p_answers) answer(question_id text)
  ) <> v_expected_count then
    raise exception 'Answer rows contain invalid or duplicate questions.' using errcode = '23514';
  end if;

  select coalesce(
    jsonb_agg(jsonb_build_array(answer.question_id, answer.selected_answer) order by answer.question_id),
    '[]'::jsonb
  )
  into v_canonical_answers
  from jsonb_to_recordset(p_answers) answer(question_id text, selected_answer text);
  v_request_fingerprint := pg_catalog.md5(
    jsonb_build_object(
      'simulation_id', p_simulation_id,
      'elapsed_ms', p_elapsed_ms,
      'answers', v_canonical_answers
    )::text
  );

  select
    count(*) filter (where answer.selected_answer = question.correct_answer),
    count(*) filter (where answer.selected_answer is not null and answer.selected_answer <> question.correct_answer),
    count(*) filter (where answer.selected_answer is null)
  into v_correct_count, v_incorrect_count, v_omitted_count
  from jsonb_to_recordset(p_answers) answer(question_id text, selected_answer text)
  join private.active_learning_questions question on question.question_id = answer.question_id;
  v_score := round((v_correct_count - v_incorrect_count / 3.0), 2);

  insert into public.simulation_attempts (
    user_id, simulation_id, correct_count, incorrect_count, omitted_count, score, elapsed_ms,
    client_event_id, request_fingerprint
  ) values (
    v_user_id, p_simulation_id, v_correct_count, v_incorrect_count, v_omitted_count, v_score, p_elapsed_ms,
    p_client_event_id, v_request_fingerprint
  )
  on conflict (user_id, client_event_id) do nothing
  returning * into v_attempt;

  if v_attempt.id is null then
    select * into strict v_attempt
    from public.simulation_attempts
    where user_id = v_user_id and client_event_id = p_client_event_id;
    if v_attempt.request_fingerprint is distinct from v_request_fingerprint then
      raise exception 'Idempotency key was already used with a different payload.' using errcode = '23514';
    end if;
    return private.simulation_attempt_result(v_user_id, v_attempt.id);
  end if;

  insert into public.simulation_answers (
    user_id, attempt_id, question_id, selected_answer, is_correct
  )
  select
    v_user_id,
    v_attempt.id,
    answer.question_id,
    answer.selected_answer,
    coalesce(answer.selected_answer = question.correct_answer, false)
  from jsonb_to_recordset(p_answers) answer(question_id text, selected_answer text)
  join private.active_learning_questions question on question.question_id = answer.question_id;

  for v_evidence in
    select
      answer.question_id,
      concept_id,
      answer.selected_answer = question.correct_answer as is_correct
    from jsonb_to_recordset(p_answers) answer(question_id text, selected_answer text)
    join private.active_learning_questions question on question.question_id = answer.question_id
    cross join lateral unnest(question.concept_ids) concept_id
    where answer.selected_answer is not null
    order by concept_id, answer.question_id
  loop
    perform private.record_review_evidence(
      v_user_id,
      v_evidence.concept_id,
      'question',
      v_evidence.question_id,
      (case when v_evidence.is_correct then 2 else 0 end)::smallint,
      private.derived_event_id(p_client_event_id, v_evidence.question_id, v_evidence.concept_id),
      v_now,
      v_today
    );
  end loop;

  return private.simulation_attempt_result(v_user_id, v_attempt.id);
end;
$$;

revoke all on function public.submit_simulation_attempt(text, bigint, jsonb, uuid) from public, anon;
grant execute on function public.submit_simulation_attempt(text, bigint, jsonb, uuid) to authenticated;
comment on function public.submit_simulation_attempt(text, bigint, jsonb, uuid)
  is 'Atomically persists an idempotent simulation, derives scoring from private keys, and records mastery evidence.';

-- Learning evidence is append-only through the controlled RPCs above. Owner
-- reads remain governed by the existing SELECT policies.
drop policy concept_mastery_insert_own on public.concept_mastery;
drop policy if exists concept_mastery_update_own on public.concept_mastery;
drop policy if exists concept_mastery_delete_own on public.concept_mastery;
drop policy review_events_insert_own on public.review_events;
drop policy if exists review_events_update_own on public.review_events;
drop policy if exists review_events_delete_own on public.review_events;
drop policy question_attempts_insert_own on public.question_attempts;
drop policy if exists question_attempts_update_own on public.question_attempts;
drop policy if exists question_attempts_delete_own on public.question_attempts;
drop policy simulation_attempts_insert_own on public.simulation_attempts;
drop policy if exists simulation_attempts_update_own on public.simulation_attempts;
drop policy if exists simulation_attempts_delete_own on public.simulation_attempts;
drop policy simulation_answers_insert_own on public.simulation_answers;
drop policy if exists simulation_answers_update_own on public.simulation_answers;
drop policy if exists simulation_answers_delete_own on public.simulation_answers;

revoke insert, update, delete on table public.concept_mastery from public, anon, authenticated;
revoke insert, update, delete on table public.review_events from public, anon, authenticated;
revoke insert, update, delete on table public.question_attempts from public, anon, authenticated;
revoke insert, update, delete on table public.simulation_attempts from public, anon, authenticated;
revoke insert, update, delete on table public.simulation_answers from public, anon, authenticated;

grant select on table public.concept_mastery to authenticated;
grant select on table public.review_events to authenticated;
grant select on table public.question_attempts to authenticated;
grant select on table public.simulation_attempts to authenticated;
grant select on table public.simulation_answers to authenticated;
