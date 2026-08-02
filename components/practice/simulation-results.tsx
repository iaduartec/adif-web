"use client";

import type { SimulationResult } from "../../app/actions/simulations";
import type { PracticeQuestion } from "./question-session";

export function SimulationResults({
  result,
  questions,
}: {
  result: SimulationResult;
  questions: readonly PracticeQuestion[];
}) {
  const questionMap = new Map(questions.map((q) => [q.id, q]));
  const totalMinutes = Math.floor(result.elapsedMs / 60000);
  const totalSeconds = Math.floor((result.elapsedMs % 60000) / 1000);

  return (
    <div className="simulation-results">
      <header className="simulation-results__header">
        <h2>Resultado del simulacro</h2>
      </header>

      {/* Score summary */}
      <div className="simulation-results__summary">
        <div className="simulation-results__card simulation-results__card--score">
          <p className="simulation-results__label">Puntuación</p>
          <p className="simulation-results__value">{result.score}</p>
          <p className="simulation-results__sub">de {questions.length} posibles</p>
        </div>
        <div className="simulation-results__card simulation-results__card--correct">
          <p className="simulation-results__label">Correctas</p>
          <p className="simulation-results__value">{result.correct}</p>
        </div>
        <div className="simulation-results__card simulation-results__card--incorrect">
          <p className="simulation-results__label">Incorrectas</p>
          <p className="simulation-results__value">{result.incorrect}</p>
        </div>
        <div className="simulation-results__card simulation-results__card--omitted">
          <p className="simulation-results__label">Omitidas</p>
          <p className="simulation-results__value">{result.omitted}</p>
        </div>
        <div className="simulation-results__card">
          <p className="simulation-results__label">Tiempo</p>
          <p className="simulation-results__value">{totalMinutes}:{String(totalSeconds).padStart(2, "0")}</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mt-4 mb-2">
        Fórmula ADIF: <code>correctas × 1 − incorrectas × ⅓</code>. Omitidas no restan.
      </p>

      {/* Corrections list */}
      {result.corrections.length > 0 && (
        <section className="simulation-corrections" aria-labelledby="corrections-title">
          <h3 id="corrections-title">Detalle de respuestas</h3>
          <div className="simulation-corrections__list">
            {result.corrections.map((correction) => {
              const question = questionMap.get(correction.questionId);
              return (
                <div
                  className={`simulation-correction ${correction.isCorrect ? "simulation-correction--correct" : correction.selectedAnswer === null ? "simulation-correction--omitted" : "simulation-correction--incorrect"}`}
                  key={correction.questionId}
                >
                  <div className="simulation-correction__header">
                    <span className="font-bold text-sm">{correction.questionId}</span>
                    <span className={`simulation-correction__badge ${correction.isCorrect ? "bg-green-100 text-green-800" : correction.selectedAnswer === null ? "bg-gray-100 text-gray-600" : "bg-red-100 text-red-700"}`}>
                      {correction.isCorrect ? "Correcta" : correction.selectedAnswer === null ? "Omitida" : "Incorrecta"}
                    </span>
                  </div>
                  {question && (
                    <p className="simulation-correction__prompt">{question.prompt}</p>
                  )}
                  <div className="simulation-correction__answers">
                    {correction.selectedAnswer !== null && !correction.isCorrect && (
                      <p className="text-red-700 text-sm">
                        <strong>Tu respuesta:</strong> {correction.selectedAnswer}
                      </p>
                    )}
                    <p className="text-green-800 text-sm">
                      <strong>Correcta:</strong> {correction.correctAnswer}
                    </p>
                  </div>
                  {question && (
                    <p className="simulation-correction__explanation">{question.explanation}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
