"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import type { OfficialQuestion } from "../../lib/content/schema";
import { Button } from "../ui/button";
import { OfficialSource } from "./official-source";

export type PracticeQuestion = Omit<OfficialQuestion, "answer">;

type AttemptResult = {
  isCorrect: boolean;
  correctAnswer: "A" | "B" | "C" | "D";
};

export function QuestionSession({
  questions,
  mode = "practice",
  immediateCorrection = true,
}: {
  questions: readonly PracticeQuestion[];
  mode?: "practice" | "simulation";
  immediateCorrection?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<"A" | "B" | "C" | "D" | "">("");
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [message, setMessage] = useState("");
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
      return;
    }

    setMessage("");
    startTransition(async () => {
      try {
        const response = await fetch("/api/attempts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionId: question.id,
            answer,
            mode,
            elapsedMs: Math.max(0, Date.now() - startedAt.current),
          }),
        });
        const payload = await response.json() as AttemptResult & { error?: string };
        if (!response.ok) throw new Error(payload.error ?? "No se ha podido guardar la respuesta.");

        setResult(payload);
        if (!immediateCorrection) setMessage("Respuesta guardada.");
      } catch (error) {
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
        <fieldset disabled={isPending || result !== null}>
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
        {!result && <Button disabled={isPending} type="submit">{isPending ? "Guardando…" : "Comprobar respuesta"}</Button>}
      </form>

      {statusMessage && <p aria-live="polite" className="course-status" role="status">{statusMessage}</p>}
      {result && index + 1 < questions.length && <Button onClick={nextQuestion}>Siguiente pregunta</Button>}
      {result && index + 1 === questions.length && <p role="status">Has terminado esta práctica.</p>}
    </section>
  );
}
