\set ON_ERROR_STOP on

begin;

do $$
begin
  if not exists (
    select 1
    from private.learning_questions
    where question_id = 'ADIF-2025-1131-Q01'
  ) then
    raise exception 'The historical answer registry row must be retained';
  end if;

  if exists (
    select 1
    from private.learning_questions
    where question_id ~ '^ADIF-202[345]-[0-9]{4}-Q[0-9]{2}$'
      and active
  ) then
    raise exception 'Uncleared historical answer keys must be inactive';
  end if;
end;
$$;

insert into auth.users (id, email)
values ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'publication-gate@example.invalid')
on conflict (id) do nothing;

insert into public.question_attempts (
  id, user_id, question_id, selected_answer, is_correct, mode, elapsed_ms
) values (
  'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
  'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  'ADIF-2025-1131-Q01', 'A', true, 'practice', 900
);

-- Model a legacy attempt that predates the fail-closed official-form trigger.
-- The transaction rolls this local fixture back after the retention assertion.
alter table public.simulation_attempts disable trigger simulation_attempts_official_allowlist;

insert into public.simulation_attempts (
  id, user_id, simulation_id, correct_count, incorrect_count, omitted_count, score, elapsed_ms
) values (
  'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
  'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  'ADIF-2025-1131', 1, 0, 0, 1, 900
);

alter table public.simulation_attempts enable trigger simulation_attempts_official_allowlist;

insert into public.simulation_answers (
  user_id, attempt_id, question_id, selected_answer, is_correct
) values (
  'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
  'ADIF-2025-1131-Q01', 'A', true
);

do $$
begin
  if not exists (
    select 1 from public.question_attempts
    where id = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd'
  ) or not exists (
    select 1 from public.simulation_answers
    where attempt_id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'
      and question_id = 'ADIF-2025-1131-Q01'
  ) then
    raise exception 'Deactivating a key must not delete question or simulation history';
  end if;
end;
$$;

rollback;
