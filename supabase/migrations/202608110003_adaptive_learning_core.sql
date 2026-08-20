alter table public.study_goals
  add column exam_date date,
  add column session_minutes integer not null default 30
    check (session_minutes between 20 and 120),
  add column onboarding_completed_at timestamptz;

create table public.concept_mastery (
  user_id uuid not null references auth.users(id) on delete cascade,
  concept_id text not null,
  status text not null default 'new'
    check (status in ('new', 'learning', 'review', 'consolidated', 'at_risk')),
  repetitions integer not null default 0 check (repetitions >= 0),
  ease_factor numeric(4, 2) not null default 2.50
    check (ease_factor between 1.30 and 3.00),
  interval_days integer not null default 0 check (interval_days between 0 and 60),
  due_on date,
  last_reviewed_at timestamptz,
  last_evidence_at timestamptz,
  correct_evidence integer not null default 0 check (correct_evidence >= 0),
  incorrect_evidence integer not null default 0 check (incorrect_evidence >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, concept_id)
);

create table public.review_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  concept_id text not null,
  source_kind text not null check (source_kind in ('recall', 'question')),
  question_id text,
  rating smallint not null check (rating between 0 and 3),
  client_event_id uuid not null,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  check (
    (source_kind = 'question' and question_id is not null)
    or (source_kind = 'recall' and question_id is null)
  ),
  unique (user_id, client_event_id)
);

create table public.daily_plan_actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_date date not null,
  task_key text not null check (char_length(task_key) between 1 and 200),
  action text not null check (action in ('postpone', 'replace')),
  replacement_task_key text,
  created_at timestamptz not null default now(),
  check (
    (action = 'replace' and replacement_task_key is not null and char_length(replacement_task_key) > 0)
    or (action = 'postpone' and replacement_task_key is null)
  ),
  unique (user_id, plan_date, task_key)
);

create index concept_mastery_user_due_idx on public.concept_mastery (user_id, due_on);
create index review_events_user_concept_occurred_idx on public.review_events (user_id, concept_id, occurred_at desc);
create index daily_plan_actions_user_date_idx on public.daily_plan_actions (user_id, plan_date);

create trigger concept_mastery_set_updated_at
before update on public.concept_mastery
for each row execute function public.set_updated_at();

alter table public.concept_mastery enable row level security;
alter table public.review_events enable row level security;
alter table public.daily_plan_actions enable row level security;

create policy concept_mastery_select_own on public.concept_mastery for select using ((select auth.uid()) = user_id);
create policy concept_mastery_insert_own on public.concept_mastery for insert with check ((select auth.uid()) = user_id);
create policy concept_mastery_update_own on public.concept_mastery for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy concept_mastery_delete_own on public.concept_mastery for delete using ((select auth.uid()) = user_id);

create policy review_events_select_own on public.review_events for select using ((select auth.uid()) = user_id);
create policy review_events_insert_own on public.review_events for insert with check ((select auth.uid()) = user_id);

create policy daily_plan_actions_select_own on public.daily_plan_actions for select using ((select auth.uid()) = user_id);
create policy daily_plan_actions_insert_own on public.daily_plan_actions for insert with check ((select auth.uid()) = user_id);
create policy daily_plan_actions_update_own on public.daily_plan_actions for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy daily_plan_actions_delete_own on public.daily_plan_actions for delete using ((select auth.uid()) = user_id);
