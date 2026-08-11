"use server";

import { getOfficialExam, getOfficialQuestion } from "../../lib/content/repository";
import { createServerClient } from "../../lib/supabase/server";

const ANSWER_KEYS = new Set(["A", "B", "C", "D"]);
const MAX_SIMULATION_ELAPSED_MS = 86_400_000;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
  clientEventId: string,
): Promise<SimulationResult> {
  const exam = getOfficialExam(examId);
  if (!exam) throw new Error("El examen oficial solicitado no existe.");

  if (
    typeof elapsedMs !== "number"
    || !Number.isFinite(elapsedMs)
    || !Number.isSafeInteger(elapsedMs)
    || elapsedMs < 0
    || elapsedMs > MAX_SIMULATION_ELAPSED_MS
  ) {
    throw new Error("Tiempo transcurrido inválido.");
  }

  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    throw new Error("Respuesta inválida en la entrega del examen.");
  }

  if (typeof clientEventId !== "string" || !UUID_PATTERN.test(clientEventId)) {
    throw new Error("Identificador de entrega inválido.");
  }

  for (const selectedAnswer of Object.values(answers)) {
    if (!ANSWER_KEYS.has(selectedAnswer)) {
      throw new Error("Respuesta inválida en la entrega del examen. Usa únicamente A, B, C o D.");
    }
  }

  const examQuestionIds = new Set(exam.questionIds);
  for (const questionId of Object.keys(answers)) {
    if (!examQuestionIds.has(questionId)) {
      throw new Error(`La pregunta ${questionId} no pertenece al examen oficial.`);
    }
  }

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes iniciar sesión para entregar un examen.");

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

  const answerRows = corrections.map((correction) => ({
    question_id: correction.questionId,
    selected_answer: correction.selectedAnswer,
  }));

  // The RPC owns user_id through auth.uid() and writes parent plus children in one transaction.
  const { data: attemptId, error: attemptError } = await supabase.rpc(
    "submit_simulation_attempt",
    {
      p_simulation_id: exam.id,
      p_elapsed_ms: elapsedMs,
      p_answers: answerRows,
      p_client_event_id: clientEventId,
    },
  );

  if (attemptError || !attemptId) {
    throw new Error("No se ha podido registrar el intento del examen.");
  }

  return {
    attemptId,
    correct,
    incorrect,
    omitted,
    score,
    elapsedMs,
    corrections,
  };
}
