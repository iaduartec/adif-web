\set ON_ERROR_STOP on
begin;
insert into auth.users (id, email)
values ('99999999-9999-4999-8999-999999999999', 'ict-history@example.invalid');
insert into public.question_attempts (user_id, question_id, selected_answer, is_correct, mode, elapsed_ms)
values ('99999999-9999-4999-8999-999999999999', 'orig-tel-ict-006', 'B', true, 'practice', 100);
\ir ../migrations/20261102084809_fix_ict_original_registry.sql
do $$
begin
  if (select count(*) from private.learning_questions where question_id in ('orig-tel-ict-006', 'orig-tel-ict-017') and not active) <> 2 then
    raise exception 'Previous ICT question must remain inactive';
  end if;
  if not exists (select 1 from private.active_learning_questions where question_id = 'orig-tel-ict-006-v2' and correct_answer = 'B') then
    raise exception 'Corrected ICT question must have an active private key';
  end if;
  if not exists (select 1 from private.active_learning_questions where question_id = 'orig-tel-ict-017-v2' and correct_answer = 'A') then
    raise exception 'Corrected earthing question must have an active private key';
  end if;
  if not exists (select 1 from public.question_attempts where user_id = '99999999-9999-4999-8999-999999999999' and question_id = 'orig-tel-ict-006' and selected_answer = 'B' and is_correct) then
    raise exception 'Historical answer to previous wording changed';
  end if;
end $$;
rollback;
