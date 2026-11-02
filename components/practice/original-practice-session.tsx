"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import type { OriginalPracticeQuestionDto } from "../../lib/content/original-practice-public-dto";
import { Button } from "../ui/button";

type AnswerKey = "A" | "B" | "C" | "D";
type Mode = "training" | "practice";
export type OriginalPracticeSessionPreset = {
  mode: Mode;
  questionCount: number;
  autoStart?: boolean;
  hideConfiguration?: boolean;
};
type Envelope = { body: string };
type Result = { isCorrect: boolean; correctAnswer: AnswerKey; explanation?: string };

function retryable(status: number) {
  return status === 408 || status === 425 || status === 429 || status >= 500;
}

function nowMs() {
  return Date.now();
}

/**
 * An answer-free original-practice session. Choices stay in component state
 * until the learner finishes; the attempt API is called only at that point.
 */
export function OriginalPracticeSession({
  questions,
  title = "Práctica original",
  preset,
}: {
  questions: readonly OriginalPracticeQuestionDto[];
  title?: string;
  preset?: OriginalPracticeSessionPreset;
}) {
  const [mode, setMode] = useState<Mode>(preset?.mode ?? "training");
  const [topicId, setTopicId] = useState("all");
  const initialQuestionCount = preset?.questionCount ?? Math.min(10, questions.length);
  const [questionCount, setQuestionCount] = useState(Math.min(Math.max(1, initialQuestionCount), Math.max(1, questions.length)));
  const [started, setStarted] = useState(Boolean(preset?.autoStart && questions.length > 0));
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<string, AnswerKey>>>({});
  const [results, setResults] = useState<Record<string, Result>>({});
  const [practiceComplete, setPracticeComplete] = useState(false);
  const [envelopes, setEnvelopes] = useState<Record<string, Envelope>>({});
  const [message, setMessage] = useState("");
  const [messageIsError, setMessageIsError] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [now, setNow] = useState(nowMs());
  const questionStartedAt = useRef<Record<string, number>>({});
  const questionElapsedMs = useRef<Record<string, number>>({});
  const topics = [...new Map(questions.map((item) => [item.topicId, item.topic])).entries()]
    .sort((left, right) => left[1].localeCompare(right[1]));
  const availableQuestions = topicId === "all" ? questions : questions.filter((item) => item.topicId === topicId);
  const effectiveQuestionCount = Math.min(Math.max(1, questionCount), availableQuestions.length);
  const activeQuestions = availableQuestions.slice(0, effectiveQuestionCount);
  const question = activeQuestions[index];
  const questionId = question?.id;
  const complete = mode === "training" ? Object.keys(results).length === activeQuestions.length : practiceComplete;
  const hasUnfinishedWork = started && !complete && Object.keys(answers).length > 0;
  const showConfiguration = !started && (!preset?.hideConfiguration || !preset.autoStart);
  useEffect(() => {
    if (questionId) questionStartedAt.current[questionId] = nowMs();
  }, [questionId]);
  useEffect(() => {
    if (!hasUnfinishedWork) return;
    const warnOnExit = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warnOnExit);
    return () => window.removeEventListener("beforeunload", warnOnExit);
  }, [hasUnfinishedWork]);

  useEffect(() => {
    if (!started || complete) return;
    const timer = setInterval(() => setNow(nowMs()), 1000);
    return () => clearInterval(timer);
  }, [started, complete]);

  if (!questions.length) return <p role="status">No hay preguntas originales disponibles para esta práctica.</p>;

  const allAnswered = activeQuestions.every((item) => answers[item.id] !== undefined);

  function focusQuestion(target: number) {
    const currentQuestion = activeQuestions[index];
    if (currentQuestion && questionStartedAt.current[currentQuestion.id]) {
      questionElapsedMs.current[currentQuestion.id] = (questionElapsedMs.current[currentQuestion.id] ?? 0)
        + Math.max(0, nowMs() - questionStartedAt.current[currentQuestion.id]!);
    }
    const nextQuestion = activeQuestions[target];
    if (nextQuestion) questionStartedAt.current[nextQuestion.id] = nowMs();
    setIndex(target);
  }

  function elapsedFor(itemId: string, now: number) {
    const accumulated = questionElapsedMs.current[itemId] ?? 0;
    const activeSince = questionStartedAt.current[itemId];
    return Math.max(0, accumulated + (itemId === question?.id && activeSince ? now - activeSince : 0));
  }

  function startSession() {
    setIndex(0);
    setAnswers({});
    setResults({});
    setEnvelopes({});
    setPracticeComplete(false);
    setMessage("");
    setStarted(true);
  }

  function choose(key: AnswerKey) {
    setAnswers((current) => ({ ...current, [question.id]: key }));
    setMessage("");
    setMessageIsError(false);
  }

  function finish() {
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

  return (
    <section aria-labelledby="original-practice-title" className="space-y-5">
      <header>
        <p className="course-eyebrow">Banco de elaboración propia</p>
        <h2 id="original-practice-title">{title}</h2>
        <p className="text-sm text-gray-600">Preguntas originales; no constituyen una simulación oficial de ADIF.</p>
      </header>

      {showConfiguration && (
        <div className="p-5 border border-rail bg-white space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
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
          </div>
          <fieldset>
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
          </fieldset>
          <Button disabled={!activeQuestions.length} onClick={startSession} type="button">Comenzar bloque</Button>
        </div>
      )}

      {started && question && <div className="p-5 border border-rail bg-white space-y-4">
        {!complete && <p role="note">Al recargar o salir se pierde el bloque en curso. Los intentos ya confirmados siguen guardados; la sesión no se reanuda automáticamente.</p>}
        <p className="course-eyebrow">Pregunta {index + 1} de {activeQuestions.length} · {question.topic} · Tiempo: {Math.round(elapsedFor(question.id, now) / 1000)}s</p>
        <h3 className="font-bold text-ink">{question.prompt}</h3>
        {question.answerGrounding && (
          <p className="text-sm text-gray-600">
            Referencia para estudiar: {" "}
            <a className="text-accent underline" href={question.answerGrounding.url} rel="noopener noreferrer" target="_blank">
              {question.answerGrounding.sourceId} · {question.answerGrounding.locator}
            </a>
          </p>
        )}
        <fieldset disabled={isPending || (mode === "training" && (Boolean(results[question.id]) || Boolean(envelopes[question.id]))) || (mode === "practice" && (practiceComplete || Object.keys(envelopes).length > 0))}>
          <legend className="sr-only">Elige una respuesta</legend>
          <div className="space-y-2">
            {question.options.map((option) => (
              <label className="practice-option" key={option.key}>
                <input checked={answers[question.id] === option.key} name={`original-${question.id}`} onChange={() => choose(option.key)} type="radio" value={option.key} />
                <span><strong>{option.key}.</strong> {option.text}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {mode === "practice" && Object.keys(envelopes).length > 0 && !practiceComplete && (
          <p role="status">La entrega ha comenzado. Las respuestas quedan bloqueadas para reintentar el mismo envío.</p>
        )}

        {!complete && !isPending && (
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
                {index + 1 < activeQuestions.length && <Button onClick={next} type="button">Siguiente pregunta</Button>}
                <Button disabled={!allAnswered} onClick={finish} type="button">
                  {Object.keys(results).length ? "Reintentar y entregar práctica" : "Entregar práctica y corregir"}
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
            <h3 className="font-bold text-ink">Corrección del bloque</h3>
            {activeQuestions.map((item, itemIndex) => {
              const result = results[item.id]!;
              const correctText = item.options.find((option) => option.key === result.correctAnswer)?.text;
              return (
                <div className="border-t border-rail pt-3" key={item.id}>
                  <p>{itemIndex + 1}. {result.isCorrect ? "Correcta" : `Incorrecta. Respuesta correcta: ${result.correctAnswer}. ${correctText ?? ""}`}</p>
                  {result.explanation && <p className="text-sm text-gray-600 mt-1">{result.explanation}</p>}
                </div>
              );
            })}
            <p role="status">Has terminado esta práctica original.</p>
          </section>
        )}
        {mode === "training" && complete && <p role="status">Has terminado este entrenamiento.</p>}
        {message && <p aria-live={messageIsError ? "assertive" : "polite"} className={messageIsError ? "course-status course-status--error" : "course-status"} role={messageIsError ? "alert" : "status"}>{message}</p>}
      </div>}
    </section>
  );
}
