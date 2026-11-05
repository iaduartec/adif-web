"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, useTransition } from "react";
import type { OriginalPracticeQuestionDto } from "../../lib/content/original-practice-public-dto";
import { isSafePracticeSvg } from "../../lib/content/practice-svg";
import { selectBalancedOriginalQuestions } from "../../lib/content/original-simulation-selection";
import { timerAnnouncement } from "../../lib/content/original-simulation-timer";
import { submitOriginalSimulation, type OriginalSimulationOutcome } from "../../app/actions/original-simulations";
import {
  clearOriginalSimulationRecovery,
  loadOriginalSimulationRecovery,
  saveOriginalSimulationRecovery,
  type OriginalSimulationRecoveryDraft,
} from "../../lib/content/original-simulation-recovery";
import { Button } from "../ui/button";

type AnswerKey = "A" | "B" | "C" | "D";
type Mode = "training" | "practice" | "exam";
type DeliveryState = "in_progress" | "submitting" | "submitted" | "conflict" | "submission_unknown" | "recoverable_error";
type Envelope = { body: string };
type Result = { isCorrect: boolean; correctAnswer: AnswerKey; explanation?: string };

function PracticeFigure({ svg, alt }: { svg?: string; alt?: string }) {
  if (!svg || !alt || !isSafePracticeSvg(svg)) return null;
  return <img alt={alt} className="block max-w-full h-auto my-3" src={`data:image/svg+xml,${encodeURIComponent(svg)}`} />;
}

function retryable(status: number) {
  return status === 408 || status === 425 || status === 429 || status >= 500;
}

function nowMs() {
  return Date.now();
}

type SessionProps = {
  questions: readonly OriginalPracticeQuestionDto[];
  title?: string;
  durationMinutes?: number;
  examMode?: boolean;
  recoveryScope?: string;
};

type RecoveryBootstrap = {
  storage: Storage | null;
  draft: OriginalSimulationRecoveryDraft | null;
  remainingSeconds: number | null;
  notice: string;
};

// Read and validate browser storage when React subscribes, before mounting the
// session. The cached snapshot also keeps server rendering free of browser I/O.
function createRecoveryBootstrap({ examMode, questions, recoveryScope }: SessionProps) {
  let snapshot: RecoveryBootstrap | null = examMode ? null : { storage: null, draft: null, remainingSeconds: null, notice: "" };
  return {
    getSnapshot: () => snapshot,
    getServerSnapshot: () => examMode ? null : snapshot,
    subscribe(onReady: () => void) {
      if (snapshot) return () => {};
      const recovered: RecoveryBootstrap = { storage: null, draft: null, remainingSeconds: null, notice: "" };
      if (!recoveryScope) {
        recovered.notice = "No se pudo vincular la recuperación local con la cuenta actual. El simulacro continúa, pero una recarga puede perderlo.";
      } else if (questions[0]?.domain) {
        try { recovered.storage = window.sessionStorage; } catch { /* Storage may be blocked by the browser. */ }
        if (!recovered.storage) {
          recovered.notice = "El almacenamiento de esta pestaña no está disponible. El simulacro continúa, pero una recarga puede perder el intento.";
        } else {
          const result = loadOriginalSimulationRecovery(recovered.storage, questions[0].domain, recoveryScope, questions);
          if (result.status === "ready") {
            recovered.draft = result.draft;
            recovered.remainingSeconds = result.remainingSeconds;
            recovered.notice = result.draft.deliveryState === "delivered" && result.draft.corrections
              ? "Se recuperaron los resultados de un simulacro ya entregado en esta pestaña. La recuperación es local; no sincroniza el intento con una cuenta."
              : "Se recuperó el simulacro en esta pestaña. Puedes continuar con el mismo orden y respuestas guardadas aquí. Esta recuperación es local: no incluye cambios posteriores realizados en otra pestaña ni sincroniza el intento con una cuenta.";
          } else if (result.status === "expired") {
            recovered.notice = "El borrador local superó su periodo de conservación de 24 horas y se eliminó. Inicia un simulacro nuevo.";
          } else if (result.status === "invalid") {
            recovered.notice = "El borrador local estaba dañado o las preguntas cambiaron; se eliminó para evitar una recuperación incoherente. Inicia un simulacro nuevo.";
          } else if (result.status === "unavailable") {
            recovered.storage = null;
            recovered.notice = "El almacenamiento de esta pestaña no está disponible. El simulacro continúa, pero una recarga puede perder el intento.";
          }
        }
      }
      snapshot = recovered;
      onReady();
      return () => {};
    },
  };
}

/**
 * An answer-free original-practice session. Choices stay in component state
 * until the learner finishes; the attempt API is called only at that point.
 */
export function OriginalPracticeSession(props: SessionProps) {
  const { examMode, questions, recoveryScope } = props;
  const recovery = useMemo(() => createRecoveryBootstrap({ examMode, questions, recoveryScope }), [examMode, questions, recoveryScope]);
  const snapshot = useSyncExternalStore(recovery.subscribe, recovery.getSnapshot, recovery.getServerSnapshot);
  if (!snapshot) return <p role="status">Preparando recuperación local…</p>;
  return <PracticeSession key={JSON.stringify([examMode, recoveryScope, questions])} {...props} recovery={snapshot} />;
}

function PracticeSession({
  questions,
  title = "Práctica original",
  durationMinutes,
  examMode = false,
  recoveryScope,
  recovery,
}: SessionProps & { recovery: RecoveryBootstrap }) {
  const recoveredDraft = recovery.draft;
  const recoveredDelivery = recoveredDraft?.deliveryState;
  const recoveredComplete = recoveredDelivery === "delivered" && Boolean(recoveredDraft?.corrections);
  const [mode, setMode] = useState<Mode>(examMode ? "exam" : "training");
  const [examDurationInput, setExamDurationInput] = useState("");
  const [examQuestionCount, setExamQuestionCount] = useState(questions.length);
  const [examQuestions, setExamQuestions] = useState<readonly OriginalPracticeQuestionDto[]>(() => {
    if (!recoveredDraft) return questions;
    const byId = new Map(questions.map((item) => [item.id, item]));
    return recoveredDraft.questionIds.map((id) => byId.get(id)).filter((item): item is OriginalPracticeQuestionDto => Boolean(item));
  });
  const [topicId, setTopicId] = useState("all");
  const [questionCount, setQuestionCount] = useState(Math.min(10, questions.length));
  const [started, setStarted] = useState(Boolean(recoveredDraft));
  const [index, setIndex] = useState(recoveredDraft?.currentIndex ?? 0);
  const [answers, setAnswers] = useState<Partial<Record<string, AnswerKey>>>(recoveredDraft?.answers ?? {});
  const [results, setResults] = useState<Record<string, Result>>(() => recoveredComplete ? Object.fromEntries(recoveredDraft!.corrections!.map((result) => [result.questionId, result])) : {});
  const [practiceComplete, setPracticeComplete] = useState(recoveredComplete);
  const [remainingSeconds, setRemainingSeconds] = useState(recoveredDraft ? recovery.remainingSeconds : durationMinutes ? durationMinutes * 60 : null);
  const [timerNotice, setTimerNotice] = useState("");
  const [recoveryNotice, setRecoveryNotice] = useState(recovery.notice);
  const [deliveryState, setDeliveryState] = useState<DeliveryState>(recoveredComplete ? "submitted"
    : recoveredDelivery === "submitting" ? "submission_unknown"
    : recoveredDelivery && recoveredDelivery !== "delivered" ? recoveredDelivery : "in_progress");
  const [coordinatedAttempt, setCoordinatedAttempt] = useState<string | null>(recoveredDraft?.attemptId ?? null);
  const [coordination, setCoordination] = useState<"pending" | "owner" | "blocked" | "unavailable">(() => recoveredDraft && typeof navigator.locks?.request === "function" ? "pending" : "unavailable");
  const coordinationRef = useRef(coordination);
  const storageRef = useRef<Storage | null>(recovery.storage);
  const recoveryDraftRef = useRef<OriginalSimulationRecoveryDraft | null>(recoveredDraft);
  const timerRef = useRef<number | null>(null);
  const deadlineRef = useRef<number | null>(recoveredDraft?.deadlineAt ?? null);
  const previousRemainingRef = useRef<number | null>(recovery.remainingSeconds);
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const autoSubmittedRef = useRef(Boolean(recoveredDelivery && recoveredDelivery !== "in_progress"));
  const deliveryInFlightRef = useRef(false);
  const deliveryCompleteRef = useRef(recoveredComplete);
  const examSubmission = useRef<{
    accountScope: string;
    questionIds: string[];
    answers: Record<string, AnswerKey>;
    elapsedMsByQuestion: Record<string, number>;
    clientEventIds: Record<string, string>;
  } | null>(recoveredDraft && recoveryScope && ["submitting", "submission_unknown", "conflict", "recoverable_error"].includes(recoveredDraft.deliveryState) ? {
    accountScope: recoveryScope,
    questionIds: recoveredDraft.questionIds,
    answers: recoveredDraft.answers,
    elapsedMsByQuestion: recoveredDraft.elapsedMsByQuestion,
    clientEventIds: recoveredDraft.clientEventIds,
  } : null);
  const deliveryMarkerKey = useCallback((attemptId: string) => `adif360:delivery:${recoveryScope}:${attemptId}`, [recoveryScope]);
  function markDelivery(attemptId: string, state: "submitting" | "delivered" | "conflict") {
    try { window.localStorage.setItem(deliveryMarkerKey(attemptId), JSON.stringify({ state, at: nowMs() })); }
    catch { setRecoveryNotice("No se pudo guardar el aviso compartido de entrega. Evita abrir copias del intento."); }
  }
  useEffect(() => {
    if (!coordinatedAttempt || !recoveryScope) return;
    if (!navigator.locks?.request) return;
    let cancelled = false;
    let release: (() => void) | undefined;
    // StrictMode can clean up a recovered session before lock acquisition starts.
    // Skip that cancelled request so the next setup cannot compete with it.
    void Promise.resolve().then(() => {
      if (cancelled) return;
      return navigator.locks.request(`adif360:${recoveryScope}:${coordinatedAttempt}`, { ifAvailable: true }, async (lock) => {
        if (cancelled) return;
        if (!lock) {
          coordinationRef.current = "blocked";
          setCoordination("blocked");
          return;
        }
        try {
          const marker = window.localStorage.getItem(deliveryMarkerKey(coordinatedAttempt));
          if (marker && recoveryDraftRef.current?.deliveryState === "in_progress") {
            const value = JSON.parse(marker) as { at?: number };
            if (!value.at || nowMs() - value.at < 24 * 60 * 60 * 1000) {
              coordinationRef.current = "blocked";
              setCoordination("blocked");
              return;
            }
            window.localStorage.removeItem(deliveryMarkerKey(coordinatedAttempt));
          }
        } catch {
          setRecoveryNotice("No se pudo comprobar el aviso compartido de entrega. Evita abrir copias del intento.");
        }
        coordinationRef.current = "owner";
        setCoordination("owner");
        await new Promise<void>((resolve) => { release = resolve; });
      });
    }).catch(() => {
      if (!cancelled) { coordinationRef.current = "unavailable"; setCoordination("unavailable"); }
    });
    return () => { cancelled = true; release?.(); };
  }, [coordinatedAttempt, recoveryScope, deliveryMarkerKey]);
  const [envelopes, setEnvelopes] = useState<Record<string, Envelope>>({});
  const [message, setMessage] = useState("");
  const [messageIsError, setMessageIsError] = useState(false);
  const [isPending, startTransition] = useTransition();
  const questionStartedAt = useRef<Record<string, number>>(recoveredDraft ? {
    [recoveredDraft.questionIds[recoveredDraft.currentIndex]]: recoveredDraft.currentQuestionStartedAt,
  } : {});
  const questionElapsedMs = useRef<Record<string, number>>(recoveredDraft?.elapsedMsByQuestion ?? {});
  const topics = [...new Map(questions.map((item) => [item.topicId, item.topic])).entries()]
    .sort((left, right) => left[1].localeCompare(right[1]));
  const availableQuestions = topicId === "all" ? questions : questions.filter((item) => item.topicId === topicId);
  const effectiveQuestionCount = Math.min(Math.max(1, questionCount), availableQuestions.length);
  const activeQuestions = mode === "exam" ? examQuestions : availableQuestions.slice(0, effectiveQuestionCount);
  const question = activeQuestions[index];
  const questionId = question?.id;
  const complete = mode === "training" ? Object.keys(results).length === activeQuestions.length : practiceComplete;
  const hasUnfinishedWork = started && !complete && Object.keys(answers).length > 0;
  function persistRecoveryDraft(draft: OriginalSimulationRecoveryDraft) {
    recoveryDraftRef.current = draft;
    if (!examMode || !recoveryScope || !storageRef.current) return;
    if (!saveOriginalSimulationRecovery(storageRef.current, draft, recoveryScope, questions)) {
      storageRef.current = null;
      setRecoveryNotice("No se pudo guardar la recuperación local. Puedes seguir con el simulacro, pero una recarga puede perder el intento.");
    }
  }

  useEffect(() => {
    if (questionId && !questionStartedAt.current[questionId]) questionStartedAt.current[questionId] = nowMs();
  }, [questionId]);
  useEffect(() => {
    if (!started || !questionId) return;
    questionHeadingRef.current?.focus();
  }, [questionId, started]);
  useEffect(() => {
    if (!hasUnfinishedWork) return;
    const warnOnExit = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warnOnExit);
    return () => window.removeEventListener("beforeunload", warnOnExit);
  }, [hasUnfinishedWork]);

  const allAnswered = activeQuestions.every((item) => answers[item.id] !== undefined);

  function focusQuestion(target: number) {
    if (mode === "exam" && (examSubmission.current || coordinationRef.current === "blocked" || coordinationRef.current === "pending")) return;
    const currentQuestion = activeQuestions[index];
    if (currentQuestion && questionStartedAt.current[currentQuestion.id]) {
      questionElapsedMs.current[currentQuestion.id] = (questionElapsedMs.current[currentQuestion.id] ?? 0)
        + Math.max(0, nowMs() - questionStartedAt.current[currentQuestion.id]!);
    }
    const nextQuestion = activeQuestions[target];
    const changedAt = nowMs();
    if (nextQuestion) questionStartedAt.current[nextQuestion.id] = changedAt;
    if (mode === "exam" && recoveryDraftRef.current && nextQuestion) {
      persistRecoveryDraft({
        ...recoveryDraftRef.current,
        currentIndex: target,
        elapsedMsByQuestion: { ...questionElapsedMs.current },
        currentQuestionStartedAt: changedAt,
      });
    }
    setIndex(target);
  }

  function elapsedFor(itemId: string, now: number) {
    const accumulated = questionElapsedMs.current[itemId] ?? 0;
    const activeSince = questionStartedAt.current[itemId];
    return Math.max(0, accumulated + (itemId === question?.id && activeSince ? now - activeSince : 0));
  }

  function startSession() {
    const startedAt = nowMs();
    let selectedExamQuestions = questions;
    if (mode === "exam") {
      selectedExamQuestions = selectBalancedOriginalQuestions(
        questions,
        Math.min(questions.length, Math.max(1, Math.floor(examQuestionCount))),
        crypto.randomUUID(),
      );
      setExamQuestions(selectedExamQuestions);
    }
    setIndex(0);
    setAnswers({});
    setResults({});
    setEnvelopes({});
    setPracticeComplete(false);
    autoSubmittedRef.current = false;
    deliveryInFlightRef.current = false;
    deliveryCompleteRef.current = false;
    setDeliveryState("in_progress");
    examSubmission.current = null;
    questionElapsedMs.current = {};
    questionStartedAt.current = selectedExamQuestions[0] ? { [selectedExamQuestions[0].id]: startedAt } : {};
    const selectedMinutes = Number(examDurationInput);
    const selectedDuration = mode === "exam"
      ? (Number.isInteger(selectedMinutes) && selectedMinutes > 0 ? Math.min(600, selectedMinutes) * 60 : null)
      : durationMinutes ? durationMinutes * 60 : null;
    deadlineRef.current = selectedDuration === null ? null : startedAt + selectedDuration * 1000;
    setRemainingSeconds(selectedDuration);
    previousRemainingRef.current = selectedDuration;
    setTimerNotice("");
    setMessage("");
    setStarted(true);
    if (mode === "exam" && selectedExamQuestions[0]) {
      const selectedIds = selectedExamQuestions.map((item) => item.id);
      const initialDraft: OriginalSimulationRecoveryDraft = {
        schemaVersion: 2,
        attemptId: crypto.randomUUID(),
        domain: selectedExamQuestions[0].domain,
        startedAt,
        questionIds: selectedIds,
        questionFingerprints: {},
        answers: {},
        currentIndex: 0,
        deadlineAt: deadlineRef.current,
        elapsedMsByQuestion: {},
        currentQuestionStartedAt: startedAt,
        clientEventIds: {},
        deliveryState: "in_progress",
      };
      coordinationRef.current = typeof navigator.locks?.request === "function" ? "pending" : "unavailable";
      setCoordination(coordinationRef.current);
      setCoordinatedAttempt(initialDraft.attemptId);
      persistRecoveryDraft(initialDraft);
    }
  }

  function choose(key: AnswerKey) {
    const answerAt = nowMs();
    if (mode === "exam" && recoveryDraftRef.current && question) {
      const previousStartedAt = questionStartedAt.current[question.id] ?? answerAt;
      const elapsedMsByQuestion = {
        ...questionElapsedMs.current,
        [question.id]: (questionElapsedMs.current[question.id] ?? 0) + Math.max(0, answerAt - previousStartedAt),
      };
      questionElapsedMs.current = elapsedMsByQuestion;
      questionStartedAt.current[question.id] = answerAt;
      persistRecoveryDraft({
        ...recoveryDraftRef.current,
        answers: { ...recoveryDraftRef.current.answers, [question.id]: key },
        elapsedMsByQuestion,
        currentQuestionStartedAt: answerAt,
        clientEventIds: {
          ...recoveryDraftRef.current.clientEventIds,
          [question.id]: recoveryDraftRef.current.clientEventIds[question.id] ?? crypto.randomUUID(),
        },
      });
    }
    setAnswers((current) => ({ ...current, [question.id]: key }));
    setMessage("");
    setMessageIsError(false);
  }

  function finish(explicitRetry = false) {
    if (mode === "exam") {
      if (deliveryInFlightRef.current || deliveryCompleteRef.current) return;
      if (coordinationRef.current === "pending" || coordinationRef.current === "blocked") { autoSubmittedRef.current = false; return; }
      if (examSubmission.current && !explicitRetry) return;
      const submission = examSubmission.current ?? {
        accountScope: recoveryScope ?? "",
        questionIds: activeQuestions.map((item) => item.id),
        answers: Object.fromEntries(activeQuestions.flatMap((item) => answers[item.id] ? [[item.id, answers[item.id]!]] : [])),
        elapsedMsByQuestion: Object.fromEntries(activeQuestions.map((item) => [item.id, elapsedFor(item.id, nowMs())])),
        clientEventIds: Object.fromEntries(activeQuestions.flatMap((item) => answers[item.id]
          ? [[item.id, recoveryDraftRef.current?.clientEventIds[item.id] ?? crypto.randomUUID()]]
          : [])),
      };
      examSubmission.current = submission;
      const draft = recoveryDraftRef.current;
      if (draft) {
        persistRecoveryDraft({
          ...draft,
          answers: submission.answers,
          elapsedMsByQuestion: submission.elapsedMsByQuestion,
          clientEventIds: submission.clientEventIds,
          currentIndex: index,
          currentQuestionStartedAt: draft.currentQuestionStartedAt,
          deliveryState: "submitting",
        });
      }
      deliveryInFlightRef.current = true;
      setDeliveryState("submitting");
      if (draft && !explicitRetry) markDelivery(draft.attemptId, "submitting");
      autoSubmittedRef.current = true;
      setMessage("");
      startTransition(async () => {
        let outcome: OriginalSimulationOutcome;
        try {
          let timeoutId: number | undefined;
          try {
            outcome = await Promise.race([
              submitOriginalSimulation(submission),
              new Promise<OriginalSimulationOutcome>((resolve) => { timeoutId = window.setTimeout(() => resolve({ ok: false, retryable: true, kind: "submission_unknown", error: "No se recibió confirmación a tiempo." }), 30_000); }),
            ]);
          } finally { if (timeoutId !== undefined) window.clearTimeout(timeoutId); }
        } catch (error) {
          outcome = {
            ok: false,
            error: "No se ha podido confirmar la entrega del simulacro.",
            retryable: true,
            kind: "submission_unknown",
          };
        }
        if (!outcome.ok) {
          deliveryInFlightRef.current = false;
          const nextState = outcome.kind === "conflict" ? "conflict" : outcome.retryable ? "submission_unknown" : "recoverable_error";
          if (draft && nextState === "conflict") markDelivery(draft.attemptId, "conflict");
          setDeliveryState(nextState);
          setMessageIsError(true);
          setMessage(outcome.error);
          if (recoveryDraftRef.current) persistRecoveryDraft({ ...recoveryDraftRef.current, deliveryState: nextState });
          return;
        }
        setResults(Object.fromEntries(outcome.corrections.map((result) => [result.questionId, result])));
        deliveryInFlightRef.current = false;
        deliveryCompleteRef.current = true;
        if (draft) markDelivery(draft.attemptId, "delivered");
        setDeliveryState("submitted");
        examSubmission.current = null;
        if (recoveryDraftRef.current) {
          persistRecoveryDraft({ ...recoveryDraftRef.current, deliveryState: "delivered", corrections: outcome.corrections });
        }
        setPracticeComplete(true);
      });
      return;
    }
    if (!allAnswered) {
      setMessage("Responde todas las preguntas antes de finalizar.");
      setMessageIsError(false);
      return;
    }

    const nextEnvelopes = { ...envelopes };
    const submittedAt = nowMs();
    for (const item of activeQuestions) {
      if (!nextEnvelopes[item.id]) {
        nextEnvelopes[item.id] = { body: JSON.stringify({
          questionId: item.id,
          selectedAnswer: answers[item.id],
          mode: "practice",
          elapsedMs: elapsedFor(item.id, submittedAt),
          clientEventId: crypto.randomUUID(),
        }) };
      }
    }
    setEnvelopes(nextEnvelopes);
    setMessage("");
    setMessageIsError(false);

    startTransition(async () => {
      const batchResults: Record<string, Result> = { ...results };
      const updatedEnvelopes = { ...nextEnvelopes };
      try {
        // Do not reveal any correction until every request in the block succeeds.
        for (const item of activeQuestions) {
          if (batchResults[item.id]) continue;
          const response = await fetch("/api/attempts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: updatedEnvelopes[item.id]!.body,
          });
          const payload = await response.json().catch(() => ({})) as Result & {
            error?: string;
            retryable?: boolean;
          };
          if (!response.ok) {
            if (payload.retryable === false || (payload.retryable === undefined && !retryable(response.status))) {
              delete updatedEnvelopes[item.id];
            }
            setEnvelopes(updatedEnvelopes);
            setMessageIsError(true);
            setMessage(payload.error ?? "No se ha podido guardar el bloque. Reintenta para completar la corrección.");
            return;
          }
          if (typeof payload.isCorrect !== "boolean" || !["A", "B", "C", "D"].includes(payload.correctAnswer)) {
            setEnvelopes(updatedEnvelopes);
            setMessageIsError(true);
            setMessage("El servidor no ha confirmado todas las respuestas. Reintenta el bloque.");
            return;
          }
          batchResults[item.id] = payload;
          setResults({ ...batchResults });
        }
        setEnvelopes({});
        setPracticeComplete(true);
      } catch (error) {
        setEnvelopes(updatedEnvelopes);
        setMessageIsError(true);
        setMessage(error instanceof Error ? error.message : "No se ha podido guardar el bloque.");
      }
    });
  }

  // Synchronize the timer's imperative handler after every committed render so
  // expiry always submits the latest answers without restarting the interval.
  const finishRef = useRef(finish);
  useEffect(() => { finishRef.current = finish; });
  const timedSession = started && (mode === "practice" || mode === "exam") && !practiceComplete && remainingSeconds !== null;
  const timerExpired = remainingSeconds === 0;
  useEffect(() => {
    if (!timedSession) return;
    const refreshCountdown = () => {
      const deadline = deadlineRef.current;
      if (deadline === null) return;
      const next = Math.max(0, Math.ceil((deadline - nowMs()) / 1000));
      setRemainingSeconds(next);
      const message = timerAnnouncement(previousRemainingRef.current, next);
      previousRemainingRef.current = next;
      if (message) setTimerNotice(message);
    };
    timerRef.current = window.setInterval(refreshCountdown, 1000);
    document.addEventListener("visibilitychange", refreshCountdown);
    return () => {
      document.removeEventListener("visibilitychange", refreshCountdown);
      if (timerRef.current) { window.clearInterval(timerRef.current); timerRef.current = null; }
    };
  }, [timedSession]);
  useEffect(() => {
    if (!timedSession || !timerExpired || autoSubmittedRef.current) return;
    autoSubmittedRef.current = true;
    finishRef.current();
  }, [timedSession, timerExpired, coordination, deliveryState]);

  function submitTrainingAnswer() {
    if (!answers[question.id]) {
      setMessage("Selecciona una respuesta antes de comprobar.");
      setMessageIsError(false);
      return;
    }
    const submittedAt = nowMs();
    const envelope = envelopes[question.id] ?? { body: JSON.stringify({
      questionId: question.id,
      selectedAnswer: answers[question.id],
      mode: "practice",
      elapsedMs: elapsedFor(question.id, submittedAt),
      clientEventId: crypto.randomUUID(),
    }) };
    setEnvelopes((current) => ({ ...current, [question.id]: envelope }));
    setMessage("");
    startTransition(async () => {
      try {
        const response = await fetch("/api/attempts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: envelope.body,
        });
        const payload = await response.json().catch(() => ({})) as Result & { error?: string; retryable?: boolean };
        if (!response.ok) {
          if (payload.retryable === false || (payload.retryable === undefined && !retryable(response.status))) {
            setEnvelopes((current) => { const next = { ...current }; delete next[question.id]; return next; });
          }
          setMessageIsError(true);
          setMessage(payload.error ?? "No se ha podido guardar la respuesta.");
          return;
        }
        if (typeof payload.isCorrect !== "boolean" || !["A", "B", "C", "D"].includes(payload.correctAnswer)) {
          setMessageIsError(true);
          setMessage("El servidor no ha confirmado la respuesta guardada.");
          return;
        }
        setEnvelopes((current) => { const next = { ...current }; delete next[question.id]; return next; });
        setResults((current) => ({ ...current, [question.id]: payload }));
      } catch (error) {
        setMessageIsError(true);
        setMessage(error instanceof Error ? error.message : "No se ha podido guardar la respuesta.");
      }
    });
  }

  function next() {
    if (!answers[question.id]) {
      setMessage("Selecciona una respuesta antes de continuar.");
      setMessageIsError(false);
      return;
    }
    if (index + 1 < activeQuestions.length) {
      focusQuestion(index + 1);
      setMessage("");
      setMessageIsError(false);
    }
  }

  function startNewExam() {
    const domain = questions[0]?.domain;
    if (domain && recoveryScope && storageRef.current) clearOriginalSimulationRecovery(storageRef.current, domain, recoveryScope);
    recoveryDraftRef.current = null;
    examSubmission.current = null;
    autoSubmittedRef.current = false;
    deliveryInFlightRef.current = false;
    deliveryCompleteRef.current = false;
    setDeliveryState("in_progress");
    deadlineRef.current = null;
    setCoordinatedAttempt(null);
    coordinationRef.current = "unavailable";
    setCoordination("unavailable");
    questionStartedAt.current = {};
    questionElapsedMs.current = {};
    setExamQuestions(questions);
    setAnswers({});
    setResults({});
    setIndex(0);
    setRemainingSeconds(null);
    previousRemainingRef.current = null;
    setTimerNotice("");
    setPracticeComplete(false);
    setStarted(false);
    setRecoveryNotice("");
    setMessage("");
  }

  if (!questions.length) return <p role="status">No hay preguntas originales disponibles para esta práctica.</p>;

  return (
    <section aria-labelledby="original-practice-title" className="space-y-5">
      <header>
        <p className="course-eyebrow">Banco de elaboración propia</p>
        <h2 id="original-practice-title">{title}</h2>
        <p className="text-sm text-gray-600">Preguntas originales; no constituyen una simulación oficial de ADIF.</p>
      </header>
      {examMode && recoveryNotice && <p className="border border-rail bg-white p-3 text-sm" role="status">{recoveryNotice}</p>}

      {!started && (
        <div className="p-5 border border-rail bg-white space-y-4">
          {examMode ? (
            <div className="space-y-3">
              <p><strong>Composición:</strong> {questions.length} preguntas originales revisadas disponibles. Por defecto se usa todo el banco; puedes elegir un bloque menor equilibrado por materia y sin repetición.</p>
              <label className="block font-bold text-ink" htmlFor="original-exam-question-count">Número de preguntas</label>
              <input
                className="mt-1 w-full max-w-xs border border-rail bg-white p-2"
                id="original-exam-question-count"
                min={1}
                max={questions.length}
                onChange={(event) => setExamQuestionCount(Math.min(questions.length, Math.max(1, Number(event.target.value) || 1)))}
                type="number"
                value={Math.min(questions.length, Math.max(1, examQuestionCount))}
              />
              <p className="text-sm text-gray-600">Entre 1 y {questions.length}. La selección se hace sin repetir preguntas.</p>
              <label className="block font-bold text-ink" htmlFor="original-exam-duration">Tiempo límite orientativo en minutos (opcional)</label>
              <input
                className="mt-1 w-full max-w-xs border border-rail bg-white p-2"
                id="original-exam-duration"
                min={1}
                max={600}
                onChange={(event) => setExamDurationInput(event.target.value)}
                placeholder="Sin límite"
                type="number"
                value={examDurationInput}
              />
              <p className="text-sm text-gray-600">El tiempo es una configuración de estudio elegida por ti; no representa una duración oficial.</p>
              <p className="text-sm text-gray-600">El intento se recupera localmente en esta pestaña durante 24 horas. No se sincroniza con una cuenta ni evita la manipulación del almacenamiento del navegador.</p>
            </div>
          ) : <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-bold text-ink" htmlFor="original-practice-topic">Tema</label>
              <select
                className="mt-1 w-full border border-rail bg-white p-2"
                id="original-practice-topic"
                value={topicId}
                onChange={(event) => {
                  const nextTopicId = event.target.value;
                  const nextCount = nextTopicId === "all"
                    ? questions.length
                    : questions.filter((item) => item.topicId === nextTopicId).length;
                  setTopicId(nextTopicId);
                  setQuestionCount((current) => Math.min(current, nextCount));
                }}
              >
                <option value="all">Todos los temas ({questions.length})</option>
                {topics.map(([id, label]) => (
                  <option key={id} value={id}>{label} ({questions.filter((item) => item.topicId === id).length})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-ink" htmlFor="original-practice-count">Cantidad de preguntas</label>
              <input
                className="mt-1 w-full border border-rail bg-white p-2"
                id="original-practice-count"
                max={availableQuestions.length}
                min={1}
                onChange={(event) => setQuestionCount(Math.min(availableQuestions.length, Math.max(1, Number(event.target.value) || 1)))}
                type="number"
                value={effectiveQuestionCount}
              />
              <p className="text-xs text-gray-600 mt-1">Entre 1 y {availableQuestions.length} disponibles.</p>
            </div>
          </div>}
          {!examMode && <fieldset>
            <legend className="font-bold text-ink">Modo</legend>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-5">
              <label className="flex gap-2 items-start">
                <input checked={mode === "training"} name="original-practice-mode" onChange={() => setMode("training")} type="radio" value="training" />
                <span><strong>Entrenamiento</strong><span className="block text-sm text-gray-600">Comprueba cada respuesta al momento.</span></span>
              </label>
              <label className="flex gap-2 items-start">
                <input checked={mode === "practice"} name="original-practice-mode" onChange={() => setMode("practice")} type="radio" value="practice" />
                <span><strong>Práctica</strong><span className="block text-sm text-gray-600">Responde el bloque, vuelve a cambiar elecciones y entrega al final.</span></span>
              </label>
            </div>
            <p className="text-sm text-gray-600 mt-3">En práctica, no se guarda ni se muestra ninguna solución antes de entregar el bloque.</p>
          </fieldset>}
          <Button disabled={!activeQuestions.length} onClick={startSession} type="button">{examMode ? "Iniciar simulacro original" : "Comenzar bloque"}</Button>
        </div>
      )}

      {started && mode === "exam" && coordination === "blocked" && <div role="alert" className="p-5 border border-rail bg-white space-y-3"><p>Este intento está abierto en otra pestaña o podría haberse entregado. Esta copia no puede entregar; vuelve a la pestaña activa. Si cierras la otra pestaña antes de entregar, puedes recargar esta copia, que podría no incluir sus últimos cambios.</p><Link href="/simulacros">Volver a simulacros</Link>{" "}<Button onClick={() => { if (window.confirm("Se descartará esta copia local. Algunas respuestas pueden haberse guardado. ¿Iniciar otro intento?")) startNewExam(); }} type="button">Iniciar un nuevo intento</Button></div>}
      {started && question && coordination !== "blocked" && <div className="p-5 border border-rail bg-white space-y-4">
        {mode === "exam" && coordination === "unavailable" && <p role="status">No se pudo coordinar este intento entre pestañas. Evita abrir copias; no se garantiza una entrega única.</p>}
        {!complete && <p role="note">La selección, el orden, las respuestas y el tiempo límite se guardan localmente en esta pestaña para recuperar una recarga. El simulacro completo no se sincroniza con tu cuenta; las respuestas entregadas pueden registrarse individualmente como práctica. Evita duplicar esta pestaña: las dos copias pueden entrar en conflicto al entregar.</p>}
        <p className="course-eyebrow">Pregunta {index + 1} de {activeQuestions.length} · {question.topic}</p>
        {mode === "exam" && !practiceComplete && <nav aria-label="Navegación del simulacro" className="flex flex-wrap gap-2">
          {activeQuestions.map((item, itemIndex) => <button
            aria-current={itemIndex === index ? "step" : undefined}
            aria-label={`Pregunta ${itemIndex + 1}${answers[item.id] ? ", respondida" : ", en blanco"}`}
            className={`min-h-11 min-w-11 border px-2 ${itemIndex === index ? "border-accent font-bold" : "border-rail"}`}
            disabled={coordination === "pending" || (deliveryState !== "in_progress" && deliveryState !== "submitted")}
            key={item.id}
            onClick={() => focusQuestion(itemIndex)}
            type="button"
          >{itemIndex + 1}</button>)}
        </nav>}
        {remainingSeconds !== null && (
          <p aria-live="off" className="text-sm font-mono" role="timer">
            Tiempo restante: {Math.floor(remainingSeconds / 60)}:{String(remainingSeconds % 60).padStart(2, "0")}
          </p>
        )}
        <p aria-live="polite" className="sr-only" data-testid="simulation-timer-announcement">{timerNotice || null}</p>
        <h3 className="font-bold text-ink" ref={questionHeadingRef} tabIndex={-1}>{question.prompt}</h3>
        <PracticeFigure svg={question.figure} alt={question.figureAlt} />
        {question.answerGrounding && (
          <p className="text-sm text-gray-600">
            Referencia para estudiar: {" "}
            <a className="text-accent underline" href={question.answerGrounding.url} rel="noopener noreferrer" target="_blank">
              {question.answerGrounding.sourceId} · {question.answerGrounding.locator}
            </a>
          </p>
        )}
        <fieldset disabled={isPending || practiceComplete || (mode === "exam" && (coordination === "pending" || (deliveryState !== "in_progress" && deliveryState !== "submitted"))) || (mode === "training" && (Boolean(results[question.id]) || Boolean(envelopes[question.id]))) || (mode === "practice" && Object.keys(envelopes).length > 0)}>
          <legend className="sr-only">Elige una respuesta</legend>
          <div className="space-y-2">
            {question.options.map((option) => (
              <label className="practice-option" key={option.key}>
                <input checked={answers[question.id] === option.key} name={`original-${question.id}`} onChange={() => choose(option.key)} type="radio" value={option.key} />
                <span><strong>{option.key}.</strong> {option.text}<PracticeFigure svg={option.figure} alt={option.figureAlt} /></span>
              </label>
            ))}
          </div>
        </fieldset>
        {mode === "practice" && Object.keys(envelopes).length > 0 && !practiceComplete && (
          <p role="status">La entrega ha comenzado. Las respuestas quedan bloqueadas para reintentar el mismo envío.</p>
        )}
        {mode === "exam" && !practiceComplete && ["conflict", "submission_unknown", "recoverable_error"].includes(deliveryState) && (
          <div role="status" className="space-y-2">
            {deliveryState === "conflict" ? <p>Este intento puede haberse entregado desde otra pestaña. No se volverá a enviar automáticamente.</p> : deliveryState === "submission_unknown" ? <p>No sabemos si la entrega se completó. Algunas respuestas pueden haberse guardado; el borrador permanece en esta pestaña. Un reintento explícito usa los mismos identificadores, pero la entrega completa no es atómica.</p> : <p>La entrega se ha detenido. Revisa el mensaje y conserva esta copia si necesitas volver a la cuenta inicial. Algunas respuestas podrían haberse guardado.</p>}
            {deliveryState === "submission_unknown" && <Button onClick={() => finish(true)} type="button">Reintentar el mismo envío</Button>}
            <Link href="/simulacros">Volver a simulacros</Link>{" "}
            <Button onClick={() => { if (window.confirm("Se descartará esta copia local. Algunas respuestas pueden haberse guardado; un intento nuevo puede volver a registrar preguntas como práctica. ¿Continuar?")) startNewExam(); }} type="button">Iniciar un nuevo intento</Button>
          </div>
        )}

        {!complete && !isPending && (mode !== "exam" || deliveryState === "in_progress") && (
          <div className="flex flex-wrap gap-3">
            {mode === "training" ? (
              <>
                {results[question.id] ? (
                  <>
                    {index > 0 && <Button onClick={() => focusQuestion(index - 1)} type="button">Anterior</Button>}
                    {index + 1 < activeQuestions.length && <Button onClick={next} type="button">Siguiente pregunta</Button>}
                  </>
                ) : (
                  <Button disabled={!answers[question.id]} onClick={submitTrainingAnswer} type="button">
                    {envelopes[question.id] ? "Reintentar respuesta" : "Comprobar respuesta"}
                  </Button>
                )}
              </>
            ) : (
              <>
                {index > 0 && <Button onClick={() => { focusQuestion(index - 1); setMessage(""); }} type="button">Anterior</Button>}
                {index + 1 < activeQuestions.length && <Button onClick={() => { if (mode === "exam") focusQuestion(index + 1); else next(); }} type="button">Siguiente pregunta</Button>}
                <Button disabled={(mode === "exam" && coordination === "pending") || (mode !== "exam" && !allAnswered)} onClick={() => finish()} type="button">
                  {mode === "exam" ? "Entregar simulacro" : Object.keys(results).length ? "Reintentar y entregar práctica" : "Entregar práctica y corregir"}
                </Button>
              </>
            )}
          </div>
        )}
        {isPending && <p role="status">Guardando el bloque…</p>}
        {mode === "training" && results[question.id] && (
          <div aria-live="polite" className="border-t border-rail pt-3">
            <p>{results[question.id]!.isCorrect ? "Respuesta correcta." : `Respuesta incorrecta. Respuesta correcta: ${results[question.id]!.correctAnswer}. ${question.options.find((option) => option.key === results[question.id]!.correctAnswer)?.text ?? ""}`}</p>
            {results[question.id]!.explanation && <p className="text-sm text-gray-600 mt-1">{results[question.id]!.explanation}</p>}
          </div>
        )}
        {practiceComplete && (
          <section aria-label="Corrección del bloque" className="space-y-3" aria-live="polite">
            <h3 className="font-bold text-ink">{mode === "exam" ? "Resultados del simulacro original" : "Corrección del bloque"}</h3>
            {mode === "exam" && (() => {
              const correct = activeQuestions.filter((item) => results[item.id]?.isCorrect).length;
              const incorrect = activeQuestions.filter((item) => answers[item.id] && results[item.id] && !results[item.id]!.isCorrect).length;
              const omitted = activeQuestions.length - correct - incorrect;
              const byTopic = new Map<string, { total: number; correct: number }>();
              for (const item of activeQuestions) {
                const group = byTopic.get(item.topic) ?? { total: 0, correct: 0 };
                group.total += 1;
                if (results[item.id]?.isCorrect) group.correct += 1;
                byTopic.set(item.topic, group);
              }
              const needsReview = [...byTopic].filter(([, group]) => group.correct / group.total < 0.7);
              return <div className="space-y-2">
                <p><strong>{correct}</strong> {correct === 1 ? "acierto" : "aciertos"} · <strong>{incorrect}</strong> {incorrect === 1 ? "error" : "errores"} · <strong>{omitted}</strong> {omitted === 1 ? "blanco" : "blancos"} de {activeQuestions.length}</p>
                <p>Resultado orientativo: {Math.round((correct / activeQuestions.length) * 100)}% de aciertos sobre las preguntas presentadas; no es una nota oficial.</p>
                <h4 className="font-bold">Resultado por materia</h4>
                <ul>{[...byTopic].map(([topic, group]) => <li key={topic}>{topic}: {group.correct}/{group.total} aciertos</li>)}</ul>
                <p><strong>Materias para repasar:</strong> {needsReview.length ? needsReview.map(([topic]) => topic).join(", ") : "sin materias por debajo del 70% en este recorrido"}. Umbral orientativo.</p>
              </div>;
            })()}
            {activeQuestions.map((item, itemIndex) => {
              const result = results[item.id];
              const correctAnswer = result?.correctAnswer;
              const correctText = item.options.find((option) => option.key === correctAnswer)?.text;
              return (
                <div className="border-t border-rail pt-3" key={item.id}>
                  {mode === "exam" && <p>{itemIndex + 1}. {item.prompt}</p>}
                  {mode === "exam" && <PracticeFigure alt={item.figureAlt} svg={item.figure} />}
                  {mode === "exam" ? (
                    <p>Tu respuesta: {answers[item.id] ?? "En blanco"} · {result?.isCorrect ? "Correcta" : `Respuesta correcta: ${correctAnswer}. ${correctText ?? ""}`}</p>
                  ) : (
                    <p>{itemIndex + 1}. {result?.isCorrect ? "Correcta" : `Incorrecta. Respuesta correcta: ${correctAnswer}. ${correctText ?? ""}`}</p>
                  )}
                  {mode === "exam" && <ul className="mt-2 space-y-1">{item.options.map((option) => <li key={option.key}>
                    <span>{option.key}. {option.text}{answers[item.id] === option.key ? " · Tu respuesta" : ""}{correctAnswer === option.key ? " · Correcta" : ""}</span>
                    <PracticeFigure alt={option.figureAlt} svg={option.figure} />
                  </li>)}</ul>}
                  {result?.explanation && <p className="text-sm text-gray-600 mt-1">{result.explanation}</p>}
                </div>
              );
            })}
            <p role="status">{mode === "exam" ? "Has terminado este simulacro original." : "Has terminado esta práctica original."}</p>
            {mode === "exam" && <Button onClick={startNewExam} type="button">Nuevo simulacro</Button>}
          </section>
        )}
        {mode === "training" && complete && <p role="status">Has terminado este entrenamiento.</p>}
        {message && <p aria-live={messageIsError ? "assertive" : "polite"} className={messageIsError ? "course-status course-status--error" : "course-status"} role={messageIsError ? "alert" : "status"}>{message}</p>}
      </div>}
    </section>
  );
}
