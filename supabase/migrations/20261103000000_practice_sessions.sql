-- Migration: practice_sessions and practice_session_answers
-- Date: 2026-11-02
-- Purpose: Secure persistence of practice sessions with RLS and idempotency

-- ============================================================
-- 1. practice_sessions table
-- ============================================================
CREATE TABLE public.practice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  topic_id TEXT,
  mode TEXT NOT NULL CHECK (mode IN ('training', 'practice')),
  question_count INTEGER NOT NULL CHECK (question_count > 0),
  question_ids TEXT[] NOT NULL,
  status TEXT NOT NULL DEFAULT 'CREATED' CHECK (status IN ('CREATED', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETED', 'ABANDONED')),
  version INTEGER NOT NULL DEFAULT 1,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  total_elapsed_ms INTEGER DEFAULT 0 CHECK (total_elapsed_ms >= 0),
  client_event_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Composite unique for FK from answers
ALTER TABLE public.practice_sessions ADD CONSTRAINT uq_practice_sessions_id_user UNIQUE (id, user_id);

-- Indexes
CREATE INDEX idx_practice_sessions_user ON public.practice_sessions(user_id);
CREATE INDEX idx_practice_sessions_status ON public.practice_sessions(status);
CREATE UNIQUE INDEX idx_practice_sessions_client_event ON public.practice_sessions(client_event_id);

-- RLS
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "practice_sessions_select_own"
  ON public.practice_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "practice_sessions_insert_own"
  ON public.practice_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- No direct UPDATE/DELETE from client (only via RPC)
-- (No policies for UPDATE/DELETE = denied by default with RLS enabled)

-- Permissions: anon has no access, authenticated can SELECT/INSERT only
REVOKE ALL ON public.practice_sessions FROM anon;
GRANT SELECT, INSERT ON public.practice_sessions TO authenticated;

-- ============================================================
-- 2. practice_session_answers table
-- ============================================================
CREATE TABLE public.practice_session_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  selected_answer TEXT NOT NULL CHECK (selected_answer IN ('A', 'B', 'C', 'D')),
  elapsed_ms INTEGER CHECK (elapsed_ms >= 0),
  client_event_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Composite FK: ensures session_id and user_id belong together
  FOREIGN KEY (session_id, user_id) REFERENCES public.practice_sessions(id, user_id) ON DELETE CASCADE,
  UNIQUE(session_id, question_id)
);

-- Indexes
CREATE INDEX idx_session_answers_session ON public.practice_session_answers(session_id);
CREATE INDEX idx_session_answers_user ON public.practice_session_answers(user_id);
CREATE UNIQUE INDEX idx_session_answers_client_event ON public.practice_session_answers(client_event_id);

-- RLS
ALTER TABLE public.practice_session_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "practice_session_answers_select_own"
  ON public.practice_session_answers FOR SELECT
  USING (auth.uid() = user_id);

-- No direct INSERT/UPDATE/DELETE from client (only via RPC)
-- (No policies for INSERT/UPDATE/DELETE = denied by default with RLS enabled)

-- Permissions: anon has no access, authenticated can SELECT only
REVOKE ALL ON public.practice_session_answers FROM anon;
GRANT SELECT ON public.practice_session_answers TO authenticated;

-- ============================================================
-- 3. Idempotency log (persistent)
-- ============================================================
CREATE TABLE public.practice_session_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_event_id UUID NOT NULL,
  operation TEXT NOT NULL,
  payload_fingerprint TEXT NOT NULL,
  result JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, client_event_id)
);

ALTER TABLE public.practice_session_events ENABLE ROW LEVEL SECURITY;

-- No client access at all (only via RPC with SECURITY DEFINER)
REVOKE ALL ON public.practice_session_events FROM anon, authenticated;

-- ============================================================
-- 4. RPC: create_practice_session
-- ============================================================
CREATE OR REPLACE FUNCTION public.create_practice_session(
  p_domain TEXT,
  p_topic_id TEXT,
  p_mode TEXT,
  p_question_ids TEXT[],
  p_client_event_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'pg_catalog', 'public', 'private'
AS $function$
declare
  v_user_id uuid := auth.uid();
  v_session public.practice_sessions%rowtype;
  v_fingerprint text;
  v_event public.practice_session_events%rowtype;
begin
  if v_user_id is null then
    raise exception 'Authentication is required.' using errcode = '28000';
  end if;
  if p_client_event_id is null then
    raise exception 'Idempotency key is required.' using errcode = '23514';
  end if;
  if p_domain is null or p_domain = '' then
    raise exception 'Domain is required.' using errcode = '23514';
  end if;
  if p_mode not in ('training', 'practice') then
    raise exception 'Invalid mode.' using errcode = '23514';
  end if;
  if p_question_ids is null or array_length(p_question_ids, 1) is null or array_length(p_question_ids, 1) = 0 then
    raise exception 'Question IDs are required.' using errcode = '23514';
  end if;

  v_fingerprint := md5(jsonb_build_array(p_domain, p_topic_id, p_mode, p_question_ids)::text);

  -- Check idempotency
  select * into v_event
  from public.practice_session_events
  where user_id = v_user_id and client_event_id = p_client_event_id;

  if found then
    if v_event.payload_fingerprint is distinct from v_fingerprint then
      raise exception 'Idempotency key was already used with a different payload.' using errcode = '23514';
    end if;
    -- Return existing session
    select * into v_session from public.practice_sessions where client_event_id = p_client_event_id and user_id = v_user_id;
    return jsonb_build_object('sessionId', v_session.id, 'status', v_session.status, 'created', false);
  end if;

  -- Create session
  insert into public.practice_sessions (user_id, domain, topic_id, mode, question_count, question_ids, client_event_id)
  values (v_user_id, p_domain, p_topic_id, p_mode, array_length(p_question_ids, 1), p_question_ids, p_client_event_id)
  returning * into v_session;

  -- Record event
  insert into public.practice_session_events (user_id, client_event_id, operation, payload_fingerprint, result)
  values (v_user_id, p_client_event_id, 'create_session', v_fingerprint, jsonb_build_object('sessionId', v_session.id));

  return jsonb_build_object('sessionId', v_session.id, 'status', v_session.status, 'created', true);
end;
$function$;

-- ============================================================
-- 5. RPC: get_practice_session
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_practice_session(p_session_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'pg_catalog', 'public'
AS $function$
declare
  v_user_id uuid := auth.uid();
  v_session public.practice_sessions%rowtype;
  v_answers jsonb;
begin
  if v_user_id is null then
    raise exception 'Authentication is required.' using errcode = '28000';
  end if;

  select * into v_session
  from public.practice_sessions
  where id = p_session_id and user_id = v_user_id;

  if not found then
    raise exception 'Session not found.' using errcode = 'P0002';
  end if;

  select coalesce(jsonb_object_agg(question_id, selected_answer), '{}'::jsonb) into v_answers
  from public.practice_session_answers
  where session_id = p_session_id and user_id = v_user_id;

  return jsonb_build_object(
    'id', v_session.id,
    'domain', v_session.domain,
    'topicId', v_session.topic_id,
    'mode', v_session.mode,
    'questionCount', v_session.question_count,
    'questionIds', v_session.question_ids,
    'status', v_session.status,
    'version', v_session.version,
    'startedAt', v_session.started_at,
    'completedAt', v_session.completed_at,
    'totalElapsedMs', v_session.total_elapsed_ms,
    'answers', v_answers
  );
end;
$function$;

-- ============================================================
-- 6. RPC: save_practice_answer
-- ============================================================
CREATE OR REPLACE FUNCTION public.save_practice_answer(
  p_session_id UUID,
  p_question_id TEXT,
  p_selected_answer TEXT,
  p_elapsed_ms INTEGER,
  p_client_event_id UUID,
  p_expected_version INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'pg_catalog', 'public'
AS $function$
declare
  v_user_id uuid := auth.uid();
  v_session public.practice_sessions%rowtype;
  v_fingerprint text;
  v_event public.practice_session_events%rowtype;
  v_answer public.practice_session_answers%rowtype;
begin
  if v_user_id is null then
    raise exception 'Authentication is required.' using errcode = '28000';
  end if;
  if p_client_event_id is null then
    raise exception 'Idempotency key is required.' using errcode = '23514';
  end if;
  if p_selected_answer not in ('A', 'B', 'C', 'D') then
    raise exception 'Invalid answer.' using errcode = '23514';
  end if;
  if p_elapsed_ms is not null and (p_elapsed_ms < 0 or p_elapsed_ms > 86400000) then
    raise exception 'Elapsed time outside range.' using errcode = '23514';
  end if;

  -- Lock session row for update
  select * into v_session
  from public.practice_sessions
  where id = p_session_id and user_id = v_user_id
  for update;

  if not found then
    raise exception 'Session not found.' using errcode = 'P0002';
  end if;

  -- Check session not finalized
  if v_session.status in ('COMPLETED', 'ABANDONED', 'SUBMITTED') then
    raise exception 'Session is finalized.' using errcode = '23514';
  end if;

  -- Optimistic concurrency check
  if p_expected_version is not null and v_session.version is distinct from p_expected_version then
    raise exception 'Version conflict.' using errcode = '40001';
  end if;

  -- Validate question is in session
  if not (p_question_id = ANY(v_session.question_ids)) then
    raise exception 'Question not in session.' using errcode = '23514';
  end if;

  v_fingerprint := md5(jsonb_build_array(p_session_id, p_question_id, p_selected_answer, p_elapsed_ms)::text);

  -- Check idempotency
  select * into v_event
  from public.practice_session_events
  where user_id = v_user_id and client_event_id = p_client_event_id;

  if found then
    if v_event.payload_fingerprint is distinct from v_fingerprint then
      raise exception 'Idempotency key was already used with a different payload.' using errcode = '23514';
    end if;
    return jsonb_build_object('saved', true, 'idempotent', true, 'version', v_session.version);
  end if;

  -- Upsert answer
  insert into public.practice_session_answers (session_id, user_id, question_id, selected_answer, elapsed_ms, client_event_id)
  values (v_session.id, v_user_id, p_question_id, p_selected_answer, p_elapsed_ms, p_client_event_id)
  on conflict (session_id, question_id) do update
  set selected_answer = excluded.selected_answer,
      elapsed_ms = excluded.elapsed_ms,
      updated_at = now()
  returning * into v_answer;

  -- Update session status and version
  update public.practice_sessions
  set status = 'IN_PROGRESS',
      version = version + 1,
      updated_at = now()
  where id = v_session.id;

  -- Record event
  insert into public.practice_session_events (user_id, client_event_id, operation, payload_fingerprint, result)
  values (v_user_id, p_client_event_id, 'save_answer', v_fingerprint, jsonb_build_object('answerId', v_answer.id));

  return jsonb_build_object('saved', true, 'idempotent', false, 'version', v_session.version + 1);
end;
$function$;

-- ============================================================
-- 7. RPC: submit_practice_session (atomic finalization)
-- ============================================================
CREATE OR REPLACE FUNCTION public.submit_practice_session(
  p_session_id UUID,
  p_client_event_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'pg_catalog', 'public', 'private'
AS $function$
declare
  v_user_id uuid := auth.uid();
  v_session public.practice_sessions%rowtype;
  v_answer record;
  v_question record;
  v_is_correct boolean;
  v_score_correct integer := 0;
  v_score_total integer := 0;
  v_results jsonb := '{}'::jsonb;
  v_fingerprint text;
  v_event public.practice_session_events%rowtype;
  v_elapsed_sum integer := 0;
begin
  if v_user_id is null then
    raise exception 'Authentication is required.' using errcode = '28000';
  end if;
  if p_client_event_id is null then
    raise exception 'Idempotency key is required.' using errcode = '23514';
  end if;

  v_fingerprint := md5(jsonb_build_array(p_session_id)::text);

  -- Check idempotency
  select * into v_event
  from public.practice_session_events
  where user_id = v_user_id and client_event_id = p_client_event_id;

  if found then
    if v_event.payload_fingerprint is distinct from v_fingerprint then
      raise exception 'Idempotency key was already used with a different payload.' using errcode = '23514';
    end if;
    -- Return existing result
    select * into v_session from public.practice_sessions where id = p_session_id and user_id = v_user_id;
    return jsonb_build_object('status', v_session.status, 'idempotent', true);
  end if;

  -- Lock session
  select * into v_session
  from public.practice_sessions
  where id = p_session_id and user_id = v_user_id
  for update;

  if not found then
    raise exception 'Session not found.' using errcode = 'P0002';
  end if;

  -- Check if already completed
  if v_session.status = 'COMPLETED' then
    return jsonb_build_object('status', 'COMPLETED', 'idempotent', true);
  end if;

  if v_session.status not in ('CREATED', 'IN_PROGRESS') then
    raise exception 'Session cannot be submitted in current state.' using errcode = '23514';
  end if;

  -- Process each answer
  for v_answer in
    select * from public.practice_session_answers
    where session_id = p_session_id and user_id = v_user_id
  loop
    -- Get question from authorized bank (via private schema or inline)
    select * into v_question
    from private.active_learning_questions
    where question_id = v_answer.question_id;

    -- If not found in learning_questions, try original practice
    if not found then
      -- For original practice questions, we'll handle separately
      -- For now, skip if not found
      continue;
    end if;

    v_is_correct := v_answer.selected_answer = v_question.correct_answer;
    if v_is_correct then v_score_correct := v_score_correct + 1; end if;
    v_score_total := v_score_total + 1;
    v_elapsed_sum := v_elapsed_sum + coalesce(v_answer.elapsed_ms, 0);

    v_results := v_results || jsonb_build_object(
      v_answer.question_id,
      jsonb_build_object('isCorrect', v_is_correct, 'selectedAnswer', v_answer.selected_answer)
    );
  end loop;

  -- Update session to COMPLETED
  update public.practice_sessions
  set status = 'COMPLETED',
      completed_at = now(),
      total_elapsed_ms = v_elapsed_sum,
      version = version + 1,
      updated_at = now()
  where id = v_session.id;

  -- Record event
  insert into public.practice_session_events (user_id, client_event_id, operation, payload_fingerprint, result)
  values (v_user_id, p_client_event_id, 'submit_session', v_fingerprint,
    jsonb_build_object('scoreCorrect', v_score_correct, 'scoreTotal', v_score_total));

  return jsonb_build_object(
    'status', 'COMPLETED',
    'scoreCorrect', v_score_correct,
    'scoreTotal', v_score_total,
    'results', v_results,
    'idempotent', false
  );
end;
$function$;

-- ============================================================
-- 8. RPC: abandon_practice_session
-- ============================================================
CREATE OR REPLACE FUNCTION public.abandon_practice_session(
  p_session_id UUID,
  p_client_event_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'pg_catalog', 'public'
AS $function$
declare
  v_user_id uuid := auth.uid();
  v_session public.practice_sessions%rowtype;
begin
  if v_user_id is null then
    raise exception 'Authentication is required.' using errcode = '28000';
  end if;

  select * into v_session
  from public.practice_sessions
  where id = p_session_id and user_id = v_user_id
  for update;

  if not found then
    raise exception 'Session not found.' using errcode = 'P0002';
  end if;

  if v_session.status in ('COMPLETED', 'ABANDONED') then
    return jsonb_build_object('status', v_session.status, 'idempotent', true);
  end if;

  update public.practice_sessions
  set status = 'ABANDONED',
      version = version + 1,
      updated_at = now()
  where id = v_session.id;

  return jsonb_build_object('status', 'ABANDONED', 'idempotent', false);
end;
$function$;

-- ============================================================
-- 9. Grants for RPC functions
-- ============================================================
GRANT EXECUTE ON FUNCTION public.create_practice_session TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_practice_session TO authenticated;
GRANT EXECUTE ON FUNCTION public.save_practice_answer TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_practice_session TO authenticated;
GRANT EXECUTE ON FUNCTION public.abandon_practice_session TO authenticated;

-- ============================================================
-- 10. Updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_practice_sessions_updated_at
  BEFORE UPDATE ON public.practice_sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_practice_session_answers_updated_at
  BEFORE UPDATE ON public.practice_session_answers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
MD
echo "done"