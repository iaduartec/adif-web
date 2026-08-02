"use server";

import { getQuestion, getSimulation } from "../../lib/content/repository";
import { createServerClient } from "../../lib/supabase/server";

export type SimulationCorrection = {
  questionId: string;
  selectedAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
};

export type SimulationResult = {
  attemptId: string;
  correct: number;
  incorrect: number;
  omitted: number;
  score: number;
  elapsedMs: number;
  corrections: SimulationCorrection[];
};

export async function submitSimulation(
  simulationId: string,
  answers: Record<string, string>,
  elapsedMs: number,
): Promise<SimulationResult> {
  const simulation = getSimulation(simulationId);
  if (!simulation) throw new Error("El simulacro solicitado no existe.");

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes iniciar sesión para entregar un simulacro.");

  if (typeof elapsedMs !== "number" || elapsedMs < 0) {
    throw new Error("Tiempo transcurrido inválido.");
  }

  // Derive corrections on server
  const corrections: SimulationCorrection[] = [];
  let correct = 0;
  let incorrect = 0;
  let omitted = 0;

  for (const questionId of simulation.questionIds) {
    const question = getQuestion(questionId);
    if (!question) throw new Error(`Pregunta ${questionId} no encontrada en el contenido.`);

    const selectedAnswer = answers[questionId] ?? null;
    const isCorrect = selectedAnswer === question.answer;

    if (selectedAnswer === null) {
      omitted++;
    } else if (isCorrect) {
      correct++;
    } else {
      incorrect++;
    }

    corrections.push({
      questionId,
      selectedAnswer,
      correctAnswer: question.answer,
      isCorrect,
    });
  }

  // ADIF scoring: correct * 1 - incorrect * (1/3), omitted = 0
  const score = Math.round((correct - incorrect / 3) * 100) / 100;

  // Insert attempt
  const { data: attempt, error: attemptError } = await supabase
    .from("simulation_attempts")
    .insert({
      user_id: user.id,
      simulation_id: simulationId,
      correct_count: correct,
      incorrect_count: incorrect,
      omitted_count: omitted,
      score: Math.max(0, score),
      elapsed_ms: elapsedMs,
    })
    .select("id")
    .single();

  if (attemptError || !attempt) {
    throw new Error("No se ha podido registrar el intento del simulacro.");
  }

  // Insert individual answers
  const answerRows = corrections.map((c) => ({
    user_id: user.id,
    attempt_id: attempt.id,
    question_id: c.questionId,
    selected_answer: c.selectedAnswer as "A" | "B" | "C" | "D" | null,
    is_correct: c.isCorrect,
  }));

  const { error: answersError } = await supabase
    .from("simulation_answers")
    .insert(answerRows);

  if (answersError) {
    throw new Error("No se han podido registrar las respuestas del simulacro.");
  }

  return {
    attemptId: attempt.id,
    correct,
    incorrect,
    omitted,
    score: Math.max(0, score),
    elapsedMs,
    corrections,
  };
}
