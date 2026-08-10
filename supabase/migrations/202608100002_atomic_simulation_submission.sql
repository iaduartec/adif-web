create or replace function public.submit_simulation_attempt(
  p_simulation_id text,
  p_correct_count integer,
  p_incorrect_count integer,
  p_omitted_count integer,
  p_score numeric,
  p_elapsed_ms bigint,
  p_answers jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
declare
  v_user_id uuid := auth.uid();
  v_attempt_id uuid;
  v_correct_count integer;
  v_incorrect_count integer;
  v_omitted_count integer;
begin
  if v_user_id is null then
    raise exception 'Authentication is required to submit an exam.' using errcode = '28000';
  end if;

  if p_elapsed_ms is null or p_elapsed_ms < 0 or p_elapsed_ms > 86400000 then
    raise exception 'Elapsed time is outside the accepted range.' using errcode = '23514';
  end if;

  if p_correct_count is null or p_incorrect_count is null or p_omitted_count is null
    or p_correct_count < 0 or p_incorrect_count < 0 or p_omitted_count < 0 then
    raise exception 'Answer counts cannot be negative.' using errcode = '23514';
  end if;

  if jsonb_typeof(p_answers) is distinct from 'array'
    or jsonb_array_length(p_answers) <> p_correct_count + p_incorrect_count + p_omitted_count then
    raise exception 'Answer rows must match the attempt counts.' using errcode = '23514';
  end if;

  if exists (
    select 1
    from jsonb_to_recordset(p_answers) as answer(
      question_id text,
      selected_answer text,
      is_correct boolean
    )
    where answer.question_id is null
      or btrim(answer.question_id) = ''
      or answer.is_correct is null
      or not (answer.selected_answer is null or answer.selected_answer in ('A', 'B', 'C', 'D'))
      or (answer.selected_answer is null and answer.is_correct)
  ) then
    raise exception 'Answer rows contain invalid values.' using errcode = '23514';
  end if;

  if (
    select count(distinct answer.question_id)
    from jsonb_to_recordset(p_answers) as answer(question_id text)
  ) <> jsonb_array_length(p_answers) then
    raise exception 'Answer question identifiers must be unique.' using errcode = '23514';
  end if;

  select
    count(*) filter (where answer.is_correct),
    count(*) filter (where not answer.is_correct and answer.selected_answer is not null),
    count(*) filter (where answer.selected_answer is null)
  into v_correct_count, v_incorrect_count, v_omitted_count
  from jsonb_to_recordset(p_answers) as answer(
    selected_answer text,
    is_correct boolean
  );

  if v_correct_count <> p_correct_count
    or v_incorrect_count <> p_incorrect_count
    or v_omitted_count <> p_omitted_count then
    raise exception 'Answer rows do not match their result counts.' using errcode = '23514';
  end if;

  if p_score is distinct from round((p_correct_count - p_incorrect_count / 3.0), 2) then
    raise exception 'Score does not match the official negative-marking formula.' using errcode = '23514';
  end if;

  insert into public.simulation_attempts (
    user_id,
    simulation_id,
    correct_count,
    incorrect_count,
    omitted_count,
    score,
    elapsed_ms
  ) values (
    v_user_id,
    p_simulation_id,
    p_correct_count,
    p_incorrect_count,
    p_omitted_count,
    p_score,
    p_elapsed_ms
  )
  returning id into v_attempt_id;

  insert into public.simulation_answers (
    user_id,
    attempt_id,
    question_id,
    selected_answer,
    is_correct
  )
  select
    v_user_id,
    v_attempt_id,
    answer.question_id,
    answer.selected_answer,
    answer.is_correct
  from jsonb_to_recordset(p_answers) as answer(
    question_id text,
    selected_answer text,
    is_correct boolean
  );

  return v_attempt_id;
end;
$$;

revoke all on function public.submit_simulation_attempt(text, integer, integer, integer, numeric, bigint, jsonb) from public;
grant execute on function public.submit_simulation_attempt(text, integer, integer, integer, numeric, bigint, jsonb) to authenticated;
