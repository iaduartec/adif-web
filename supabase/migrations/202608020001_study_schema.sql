create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 100),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  percent smallint not null default 0 check (percent between 0 and 100),
  completed boolean not null default false,
  last_activity_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table public.question_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  selected_answer text not null check (selected_answer in ('A', 'B', 'C', 'D')),
  is_correct boolean not null,
  mode text not null check (mode in ('practice', 'simulation')),
  elapsed_ms bigint not null check (elapsed_ms >= 0),
  created_at timestamptz not null default now()
);

create table public.simulation_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  simulation_id text not null,
  correct_count integer not null default 0 check (correct_count >= 0),
  incorrect_count integer not null default 0 check (incorrect_count >= 0),
  omitted_count integer not null default 0 check (omitted_count >= 0),
  score numeric(8, 2) not null default 0,
  elapsed_ms bigint not null check (elapsed_ms >= 0),
  created_at timestamptz not null default now(),
  unique (id, user_id)
);

create table public.simulation_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  attempt_id uuid not null,
  question_id text not null,
  selected_answer text check (selected_answer is null or selected_answer in ('A', 'B', 'C', 'D')),
  is_correct boolean not null,
  created_at timestamptz not null default now(),
  unique (attempt_id, question_id),
  foreign key (attempt_id, user_id)
    references public.simulation_attempts (id, user_id)
    on delete cascade
);

create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null check (item_type in ('question', 'flashcard')),
  item_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, item_type, item_id)
);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  body text not null check (char_length(body) between 1 and 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table public.study_goals (
  user_id uuid primary key references auth.users(id) on delete cascade,
  weekly_target_minutes integer not null check (weekly_target_minutes between 1 and 1680),
  preferred_days integer[] not null default '{}'::integer[]
    check (preferred_days <@ array[0, 1, 2, 3, 4, 5, 6]::integer[]),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index lesson_progress_user_activity_idx on public.lesson_progress (user_id, last_activity_at desc);
create index question_attempts_user_created_idx on public.question_attempts (user_id, created_at desc);
create index simulation_attempts_user_created_idx on public.simulation_attempts (user_id, created_at desc);
create index simulation_answers_user_attempt_idx on public.simulation_answers (user_id, attempt_id);
create index favorites_user_created_idx on public.favorites (user_id, created_at desc);
create index notes_user_updated_idx on public.notes (user_id, updated_at desc);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger lesson_progress_set_updated_at
before update on public.lesson_progress
for each row execute function public.set_updated_at();

create trigger notes_set_updated_at
before update on public.notes
for each row execute function public.set_updated_at();

create trigger study_goals_set_updated_at
before update on public.study_goals
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.question_attempts enable row level security;
alter table public.simulation_attempts enable row level security;
alter table public.simulation_answers enable row level security;
alter table public.favorites enable row level security;
alter table public.notes enable row level security;
alter table public.study_goals enable row level security;

create policy profiles_select_own on public.profiles for select using ((select auth.uid()) = user_id);
create policy profiles_insert_own on public.profiles for insert with check ((select auth.uid()) = user_id);
create policy profiles_update_own on public.profiles for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy profiles_delete_own on public.profiles for delete using ((select auth.uid()) = user_id);

create policy lesson_progress_select_own on public.lesson_progress for select using ((select auth.uid()) = user_id);
create policy lesson_progress_insert_own on public.lesson_progress for insert with check ((select auth.uid()) = user_id);
create policy lesson_progress_update_own on public.lesson_progress for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy lesson_progress_delete_own on public.lesson_progress for delete using ((select auth.uid()) = user_id);

create policy question_attempts_select_own on public.question_attempts for select using ((select auth.uid()) = user_id);
create policy question_attempts_insert_own on public.question_attempts for insert with check ((select auth.uid()) = user_id);
create policy question_attempts_update_own on public.question_attempts for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy question_attempts_delete_own on public.question_attempts for delete using ((select auth.uid()) = user_id);

create policy simulation_attempts_select_own on public.simulation_attempts for select using ((select auth.uid()) = user_id);
create policy simulation_attempts_insert_own on public.simulation_attempts for insert with check ((select auth.uid()) = user_id);
create policy simulation_attempts_update_own on public.simulation_attempts for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy simulation_attempts_delete_own on public.simulation_attempts for delete using ((select auth.uid()) = user_id);

create policy simulation_answers_select_own on public.simulation_answers for select using ((select auth.uid()) = user_id);
create policy simulation_answers_insert_own on public.simulation_answers for insert with check ((select auth.uid()) = user_id);
create policy simulation_answers_update_own on public.simulation_answers for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy simulation_answers_delete_own on public.simulation_answers for delete using ((select auth.uid()) = user_id);

create policy favorites_select_own on public.favorites for select using ((select auth.uid()) = user_id);
create policy favorites_insert_own on public.favorites for insert with check ((select auth.uid()) = user_id);
create policy favorites_update_own on public.favorites for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy favorites_delete_own on public.favorites for delete using ((select auth.uid()) = user_id);

create policy notes_select_own on public.notes for select using ((select auth.uid()) = user_id);
create policy notes_insert_own on public.notes for insert with check ((select auth.uid()) = user_id);
create policy notes_update_own on public.notes for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy notes_delete_own on public.notes for delete using ((select auth.uid()) = user_id);

create policy study_goals_select_own on public.study_goals for select using ((select auth.uid()) = user_id);
create policy study_goals_insert_own on public.study_goals for insert with check ((select auth.uid()) = user_id);
create policy study_goals_update_own on public.study_goals for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy study_goals_delete_own on public.study_goals for delete using ((select auth.uid()) = user_id);
