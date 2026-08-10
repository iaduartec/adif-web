"use server";

import { getOfficialExam, getOfficialQuestion } from "../../lib/content/repository";
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
  examId: string,
  answers: Record<string, string>,
  elapsedMs: number,
): Promise<SimulationResult> {
  const exam = getOfficialExam(examId);
  if (!exam) throw new Error("El examen oficial solicitado no existe.");

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes iniciar sesión para entregar un examen.");

  if (typeof elapsedMs !== "number" || elapsedMs < 0) {
    throw new Error("Tiempo transcurrido inválido.");
  }

  const examQuestionIds = new Set(exam.questionIds);
  for (const questionId of Object.keys(answers)) {
    if (!examQuestionIds.has(questionId)) {
      throw new Error(`La pregunta ${questionId} no pertenece al examen oficial.`);
    }
  }

  // Derive corrections exclusively from the published model on the server.
  const corrections: SimulationCorrection[] = [];
  let correct = 0;
  let incorrect = 0;
  let omitted = 0;

  for (const questionId of exam.questionIds) {
    const question = getOfficialQuestion(questionId);
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
      simulation_id: exam.id,
      correct_count: correct,
      incorrect_count: incorrect,
      omitted_count: omitted,
      score,
      elapsed_ms: elapsedMs,
    })
    .select("id")
    .single();

  if (attemptError || !attempt) {
    throw new Error("No se ha podido registrar el intento del examen.");
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
    throw new Error("No se han podido registrar las respuestas del examen.");
  }

  return {
    attemptId: attempt.id,
    correct,
    incorrect,
    omitted,
    score,
    elapsedMs,
    corrections,
  };
}
