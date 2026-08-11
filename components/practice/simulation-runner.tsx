"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { OfficialExamQuestion } from "../../lib/content/repository";
import { submitSimulation, type SimulationResult } from "../../app/actions/simulations";
import { Button } from "../ui/button";
import { useModalFocus } from "../ui/use-modal-focus";

type AnswerKey = "A" | "B" | "C" | "D";

const STORAGE_PREFIX = "adif-exam-draft-";

type SubmissionEnvelope = {
  examId: string;
  answers: Record<string, AnswerKey>;
  elapsedMs: number;
  clientEventId: string;
};

function getStorageKey(examId: string): string {
  return `${STORAGE_PREFIX}${examId}`;
}

function loadDraft(examId: string): Record<string, AnswerKey> {
  try {
    const raw = sessionStorage.getItem(getStorageKey(examId));
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, AnswerKey>;
  } catch {
    return {};
  }
}

function saveDraft(examId: string, answers: Record<string, AnswerKey>): void {
  try {
    sessionStorage.setItem(getStorageKey(examId), JSON.stringify(answers));
  } catch {
    // sessionStorage full or unavailable — silent fail
  }
}

function clearDraft(examId: string): void {
  try {
    sessionStorage.removeItem(getStorageKey(examId));
  } catch {
    // silent fail
  }
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function SimulationRunner({
  examId,
  questions,
  durationMinutes,
  onFinish,
}: {
  examId: string;
  questions: readonly OfficialExamQuestion[];
  durationMinutes: number;
  onFinish: (result: SimulationResult) => void;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerKey>>(() => loadDraft(examId));
  const [remainingSeconds, setRemainingSeconds] = useState(durationMinutes * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [retryPending, setRetryPending] = useState(false);
  const startedAt = useRef(0);
  const delivered = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const reviewButtonRef = useRef<HTMLButtonElement>(null);
  const deliverButtonRef = useRef<HTMLButtonElement>(null);
  const submissionEnvelope = useRef<SubmissionEnvelope | null>(null);

  const closeConfirm = useCallback(() => setShowConfirm(false), []);
  const handleDialogKeyDown = useModalFocus({
    dialogRef,
    initialFocusRef: reviewButtonRef,
    isOpen: showConfirm,
    onDismiss: closeConfirm,
    returnFocusRef: deliverButtonRef,
  });

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const doSubmit = useCallback(async () => {
    if (delivered.current) return;
    delivered.current = true;
    setIsSubmitting(true);
    setError("");
    const envelope = submissionEnvelope.current ?? {
      examId,
      answers: { ...answers },
      elapsedMs: Math.max(0, Date.now() - startedAt.current),
      clientEventId: crypto.randomUUID(),
    };
    submissionEnvelope.current = envelope;
    try {
      const outcome = await submitSimulation(
        envelope.examId,
        envelope.answers,
        envelope.elapsedMs,
        envelope.clientEventId,
      );
      if ("ok" in outcome) {
        delivered.current = false;
        setIsSubmitting(false);
        setError(outcome.error);
        if (outcome.retryable) {
          setRetryPending(true);
        } else {
          submissionEnvelope.current = null;
          setRetryPending(false);
        }
        return;
      }
      submissionEnvelope.current = null;
      setRetryPending(false);
      clearDraft(examId);
      onFinish(outcome);
    } catch (err) {
      delivered.current = false;
      setIsSubmitting(false);
      setRetryPending(true);
      setError(err instanceof Error ? err.message : "Error al entregar el examen.");
    }
  }, [answers, examId, onFinish]);

  // Auto-deliver when timer expires
  useEffect(() => {
    if (remainingSeconds <= 0 && !delivered.current && !retryPending) {
      doSubmit();
    }
  }, [remainingSeconds, retryPending, doSubmit]);

  const question = questions[index];
  if (!question) return null;

  const answeredCount = Object.keys(answers).length;
  const isUrgent = remainingSeconds <= 300;

  function selectAnswer(key: AnswerKey) {
    const next = { ...answers, [question.id]: key };
    setAnswers(next);
    saveDraft(examId, next);
  }

  function goToQuestion(targetIndex: number) {
    if (targetIndex >= 0 && targetIndex < questions.length) {
      setIndex(targetIndex);
    }
  }

  return (
    <div className="simulation-runner">
      <div
        aria-hidden={showConfirm ? "true" : undefined}
        className="simulation-runner__content"
        inert={showConfirm ? true : undefined}
      >
      {/* Top bar: timer + progress */}
      <div className="simulation-topbar">
        <div className={`simulation-timer ${isUrgent ? "simulation-timer--urgent" : ""}`}>
          <svg aria-hidden="true" fill="none" height="18" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="18">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span aria-live="polite" role="timer">
            {formatTime(remainingSeconds)}
          </span>
        </div>
        <p className="simulation-progress-text">
          Pregunta {index + 1} de {questions.length} · {answeredCount} respondidas
        </p>
      </div>

      {/* Question navigator grid */}
      <div className="simulation-navigator" role="navigation" aria-label="Navegador de preguntas">
        {questions.map((q, i) => {
          const isAnswered = q.id in answers;
          const isCurrent = i === index;
          return (
            <button
              aria-current={isCurrent ? "step" : undefined}
              aria-label={`Pregunta ${i + 1}${isAnswered ? " (respondida)" : ""}`}
              className={`simulation-nav-dot ${isAnswered ? "simulation-nav-dot--answered" : ""} ${isCurrent ? "simulation-nav-dot--current" : ""}`}
              key={q.id}
              onClick={() => goToQuestion(i)}
              type="button"
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Question card */}
      <section aria-labelledby="sim-question-title" className="simulation-question">
        <p className="course-eyebrow">Pregunta {index + 1} de {questions.length}</p>
        <h2 id="sim-question-title">{question.prompt}</h2>
        <fieldset disabled={isSubmitting || retryPending}>
          <legend className="sr-only">Elige una respuesta</legend>
          {question.options.map((option) => (
            <label className="practice-option" key={option.key}>
              <input
                checked={answers[question.id] === option.key}
                name={`sim-${question.id}`}
                onChange={() => selectAnswer(option.key)}
                type="radio"
                value={option.key}
              />
              <span><strong>{option.key}.</strong> {option.text}</span>
            </label>
          ))}
        </fieldset>
      </section>

      {/* Navigation buttons */}
      <div className="simulation-actions">
        <Button
          disabled={index === 0}
          onClick={() => goToQuestion(index - 1)}
        >
          Anterior
        </Button>
        {index < questions.length - 1 ? (
          <Button onClick={() => goToQuestion(index + 1)}>
            Siguiente
          </Button>
        ) : null}
        <Button
          className="simulation-deliver-btn"
          disabled={isSubmitting || retryPending}
          onClick={() => setShowConfirm(true)}
          ref={deliverButtonRef}
        >
          {isSubmitting ? "Entregando…" : "Entregar examen"}
        </Button>
      </div>

      {error && (
        <div className="course-status course-status--error">
          <p aria-live="assertive" role="alert">{error}</p>
          {retryPending && (
            <Button disabled={isSubmitting} onClick={doSubmit}>
              {isSubmitting ? "Reintentando…" : "Reintentar entrega"}
            </Button>
          )}
        </div>
      )}
      </div>

      {/* Confirmation dialog */}
      {showConfirm && (
        <div
          aria-labelledby="simulation-confirm-title"
          aria-modal="true"
          className="simulation-confirm-overlay"
          onKeyDown={handleDialogKeyDown}
          ref={dialogRef}
          role="dialog"
        >
          <div className="simulation-confirm-dialog">
            <h3 id="simulation-confirm-title">Confirmar entrega</h3>
            <p>
              Has respondido {answeredCount} de {questions.length} preguntas.
              {questions.length - answeredCount > 0 && (
                <> Quedan <strong>{questions.length - answeredCount}</strong> sin responder (se contarán como omitidas).</>
              )}
            </p>
            <div className="simulation-confirm-actions">
              <Button onClick={closeConfirm} ref={reviewButtonRef}>Seguir revisando</Button>
              <Button disabled={isSubmitting} onClick={() => { setShowConfirm(false); doSubmit(); }}>
                Confirmar entrega
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
