"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import type { PublicOfficialQuestion } from "../../lib/content/public-dto";
import { Button } from "../ui/button";
import { OfficialSource } from "./official-source";

export type PracticeQuestion = PublicOfficialQuestion;

type AttemptResult = {
  isCorrect: boolean;
  correctAnswer: "A" | "B" | "C" | "D";
};

type AttemptEnvelope = {
  body: string;
};

function fallbackRetryableStatus(status: number): boolean {
  return status === 408 || status === 425 || status === 429 || status >= 500;
}

export function QuestionSession({
  questions,
  immediateCorrection = true,
}: {
  questions: readonly PracticeQuestion[];
  immediateCorrection?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<"A" | "B" | "C" | "D" | "">("");
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [message, setMessage] = useState("");
  const [messageIsError, setMessageIsError] = useState(false);
  const [retryEnvelope, setRetryEnvelope] = useState<AttemptEnvelope | null>(null);
  const [isPending, startTransition] = useTransition();
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const question = questions[index];

  if (!question) {
    return <p role="status">No hay preguntas disponibles para esta práctica.</p>;
  }

  function submitAnswer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!answer) {
      setMessage("Selecciona una respuesta antes de continuar.");
      setMessageIsError(false);
      return;
    }

    setMessage("");
    setMessageIsError(false);
    const envelope = retryEnvelope ?? {
      body: JSON.stringify({
        questionId: question.id,
        selectedAnswer: answer,
        mode: "practice",
        elapsedMs: Math.max(0, Date.now() - startedAt.current),
        clientEventId: crypto.randomUUID(),
      }),
    };
    if (!retryEnvelope) setRetryEnvelope(envelope);
    startTransition(async () => {
      try {
        const response = await fetch("/api/attempts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: envelope.body,
        });
        const payload = await response.json().catch(() => ({})) as AttemptResult & {
          error?: string;
          retryable?: boolean;
        };
        if (!response.ok) {
          const retryable = typeof payload.retryable === "boolean"
            ? payload.retryable
            : fallbackRetryableStatus(response.status);
          if (!retryable) setRetryEnvelope(null);
          setMessageIsError(true);
          setMessage(payload.error ?? "No se ha podido guardar la respuesta.");
          return;
        }
        if (
          typeof payload.isCorrect !== "boolean"
          || !["A", "B", "C", "D"].includes(payload.correctAnswer)
        ) {
          throw new Error("No se ha podido confirmar la respuesta guardada.");
        }

        setRetryEnvelope(null);
        setResult(payload);
        if (!immediateCorrection) setMessage("Respuesta guardada.");
      } catch (error) {
        setMessageIsError(true);
        setMessage(error instanceof Error ? error.message : "No se ha podido guardar la respuesta.");
      }
    });
  }

  function nextQuestion() {
    if (index + 1 >= questions.length) return;
    setIndex((current) => current + 1);
    setAnswer("");
    setResult(null);
    setMessage("");
    setMessageIsError(false);
    setRetryEnvelope(null);
    startedAt.current = Date.now();
  }

  const statusMessage = result && immediateCorrection
    ? `${result.isCorrect ? "Respuesta correcta." : `Respuesta incorrecta. Respuesta correcta: ${result.correctAnswer}.`}`
    : message;

  return (
    <section aria-labelledby="practice-question-title" className="practice-session">
      <p className="course-eyebrow">Pregunta {index + 1} de {questions.length}</p>
      <p className="practice-session__module">{question.sectionLabel}</p>
      <h2 id="practice-question-title">{question.prompt}</h2>
      <OfficialSource source={question.source} />
      <form onSubmit={submitAnswer}>
        <fieldset disabled={isPending || result !== null || retryEnvelope !== null}>
          <legend className="sr-only">Elige una respuesta</legend>
          {question.options.map((option) => (
            <label className="practice-option" key={option.key}>
              <input
                checked={answer === option.key}
                name={`question-${question.id}`}
                onChange={() => setAnswer(option.key)}
                type="radio"
                value={option.key}
              />
              <span><strong>{option.key}.</strong> {option.text}</span>
            </label>
          ))}
        </fieldset>
        {!result && (
          <Button disabled={isPending} type="submit">
            {isPending ? "Guardando…" : retryEnvelope ? "Reintentar respuesta" : "Comprobar respuesta"}
          </Button>
        )}
      </form>

      {statusMessage && (
        <p
          aria-live={messageIsError ? "assertive" : "polite"}
          className={`course-status${messageIsError ? " course-status--error" : ""}`}
          role={messageIsError ? "alert" : "status"}
        >
          {statusMessage}
        </p>
      )}
      {result && index + 1 < questions.length && <Button onClick={nextQuestion}>Siguiente pregunta</Button>}
      {result && index + 1 === questions.length && <p role="status">Has terminado esta práctica.</p>}
    </section>
  );
}
