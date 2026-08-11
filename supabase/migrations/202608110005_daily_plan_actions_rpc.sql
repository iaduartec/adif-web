revoke insert, update, delete on table public.daily_plan_actions from anon, authenticated;
revoke all on table public.daily_plan_actions from anon, authenticated;
grant select on table public.daily_plan_actions to authenticated;

drop policy if exists daily_plan_actions_insert_own on public.daily_plan_actions;
drop policy if exists daily_plan_actions_update_own on public.daily_plan_actions;
drop policy if exists daily_plan_actions_delete_own on public.daily_plan_actions;

create or replace function public.record_daily_plan_action(
  p_plan_date date,
  p_task_key text,
  p_action text,
  p_replacement_task_key text default null
)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_user_id uuid := auth.uid();
  v_existing_action text;
  v_existing_replacement text;
begin
  if v_user_id is null then
    raise exception using errcode = '28000', message = 'Authentication required.';
  end if;
  if p_plan_date is null
    or p_plan_date <> (pg_catalog.timezone('Europe/Madrid', pg_catalog.now()))::date then
    raise exception using errcode = '23514', message = 'Plan date must be today in Europe/Madrid.';
  end if;
  if p_task_key is null or char_length(pg_catalog.btrim(p_task_key)) < 1 or char_length(p_task_key) > 200 then
    raise exception using errcode = '23514', message = 'Invalid task key.';
  end if;
  if p_action not in ('postpone', 'replace') then
    raise exception using errcode = '23514', message = 'Invalid plan action.';
  end if;
  if (
    p_action = 'postpone'
    and p_replacement_task_key is not null
  ) or (
    p_action = 'replace'
    and (
      p_replacement_task_key is null
      or char_length(pg_catalog.btrim(p_replacement_task_key)) < 1
      or char_length(p_replacement_task_key) > 200
      or p_replacement_task_key = p_task_key
    )
  ) then
    raise exception using errcode = '23514', message = 'Invalid replacement task key.';
  end if;

  insert into public.daily_plan_actions (
    user_id,
    plan_date,
    task_key,
    action,
    replacement_task_key
  ) values (
    v_user_id,
    p_plan_date,
    p_task_key,
    p_action,
    p_replacement_task_key
  )
  on conflict (user_id, plan_date, task_key) do nothing;

  if found then
    return true;
  end if;

  select action, replacement_task_key
  into v_existing_action, v_existing_replacement
  from public.daily_plan_actions
  where user_id = v_user_id
    and plan_date = p_plan_date
    and task_key = p_task_key;

  if v_existing_action = p_action
    and v_existing_replacement is not distinct from p_replacement_task_key then
    return true;
  end if;

  raise exception using errcode = '23505', message = 'A different action already exists for this task and date.';
end;
$$;

revoke all on function public.record_daily_plan_action(date, text, text, text) from public, anon;
grant execute on function public.record_daily_plan_action(date, text, text, text) to authenticated;
