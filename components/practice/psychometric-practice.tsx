"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { OriginalPracticeQuestionDto } from "../../lib/content/original-practice-public-dto";
import { psychometricModes, type PsychometricMode } from "../../lib/content/psychometric-modes";

function formatElapsed(elapsedMs: number) {
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function PsychometricPractice({
  questions,
}: {
  questions: readonly OriginalPracticeQuestionDto[];
}) {
  const [mode, setMode] = useState<PsychometricMode>("training");
  const [running, setRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const startedAt = useRef(0);

  const activeMode = psychometricModes.find((candidate) => candidate.value === mode)!;
  const timed = activeMode.secondsPerQuestion !== null;

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setElapsedMs(Date.now() - startedAt.current), 1000);
    return () => clearInterval(interval);
  }, [running]);

  function selectMode(nextMode: PsychometricMode) {
    setMode(nextMode);
    setRunning(false);
    setElapsedMs(0);
  }

  const questionsByAptitude = useMemo(() => {
    const groups = new Map<string, OriginalPracticeQuestionDto[]>();
    for (const question of questions) {
      const group = groups.get(question.topic) ?? [];
      group.push(question);
      groups.set(question.topic, group);
    }
    return [...groups.entries()];
  }, [questions]);

  return (
    <section className="mt-10" aria-labelledby="psico-practice">
      <h2 id="psico-practice" className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
        Práctica original por aptitud
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Preguntas creadas desde cero para entrenar cada aptitud. La corrección y el registro de
        respuestas se conectarán al pipeline de intentos en una tarea posterior.
      </p>

      <fieldset className="p-5 border border-rail bg-white mb-6">
        <legend className="font-bold text-ink">Modo de práctica</legend>
        <div className="mt-3 space-y-2">
          {psychometricModes.map((candidate) => (
            <label className="flex gap-2 items-start text-sm" key={candidate.value}>
              <input
                type="radio"
                name="psychometric-mode"
                value={candidate.value}
                checked={mode === candidate.value}
                onChange={() => selectMode(candidate.value)}
              />
              <span>
                <strong>{candidate.label}</strong>: {candidate.description}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {timed ? (
        <div className="p-5 border border-rail bg-white mb-6" role="group" aria-label="Cronómetro">
          <p role="status">
            {running ? "Cronómetro en marcha" : "Cronómetro detenido"}: {formatElapsed(elapsedMs)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Tiempo de referencia: {activeMode.secondsPerQuestion} segundos por pregunta.
          </p>
          <button
            className="ui-button ui-button--secondary mt-3"
            type="button"
            onClick={() => {
              if (!running) startedAt.current = Date.now() - elapsedMs;
              setRunning((current) => !current);
            }}
          >
            {running ? "Pausar cronómetro" : "Iniciar cronómetro"}
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-600 mb-6">
          Entrenamiento sin cronómetro: razona el patrón antes de responder.
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {questionsByAptitude.map(([aptitude, items]) => (
          <div key={aptitude}>
            <h3 className="font-bold text-ink mb-2">{aptitude}</h3>
            <div className="space-y-2">
              {items.map((question) => (
                <details className="p-4 border border-rail bg-white" key={question.id}>
                  <summary className="font-medium text-ink cursor-pointer">{question.prompt}</summary>
                  <ul className="mt-3 space-y-2 text-sm" aria-label="Opciones">
                    {question.options.map((option) => (
                      <li key={option.key}>
                        {option.key}. {option.text}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
