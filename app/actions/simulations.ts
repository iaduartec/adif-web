"use server";

import { getOfficialExam, getOfficialQuestion } from "../../lib/content/repository";
import { createServerClient } from "../../lib/supabase/server";
import { z } from "zod";

const ANSWER_KEYS = new Set(["A", "B", "C", "D"]);
const MAX_SIMULATION_ELAPSED_MS = 86_400_000;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const persistedSimulationSchema = z.object({
  attempt_id: z.string().min(1),
  correct_count: z.number().int().nonnegative(),
  incorrect_count: z.number().int().nonnegative(),
  omitted_count: z.number().int().nonnegative(),
  score: z.number().finite(),
  elapsed_ms: z.number().int().nonnegative().max(MAX_SIMULATION_ELAPSED_MS),
  answers: z.array(z.object({
    question_id: z.string().min(1),
    selected_answer: z.enum(["A", "B", "C", "D"]).nullable(),
    is_correct: z.boolean(),
  }).strict()),
}).strict();

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

  const answerRows = exam.questionIds.map((questionId) => ({
    question_id: questionId,
    selected_answer: answers[questionId] ?? null,
  }));

  // The RPC owns user_id through auth.uid() and writes parent plus children in one transaction.
  const { data: persistedResult, error: attemptError } = await supabase.rpc(
    "submit_simulation_attempt",
    {
      p_simulation_id: exam.id,
      p_elapsed_ms: elapsedMs,
      p_answers: answerRows,
      p_client_event_id: clientEventId,
    },
  );

  const parsedResult = persistedSimulationSchema.safeParse(persistedResult);
  if (attemptError || !parsedResult.success) {
    throw new Error("No se ha podido registrar el intento del examen.");
  }

  const persistedByQuestion = new Map(
    parsedResult.data.answers.map((answer) => [answer.question_id, answer]),
  );
  if (
    persistedByQuestion.size !== exam.questionIds.length
    || parsedResult.data.answers.length !== exam.questionIds.length
    || exam.questionIds.some((questionId) => !persistedByQuestion.has(questionId))
  ) {
    throw new Error("No se ha podido registrar el intento del examen.");
  }

  const corrections = exam.questionIds.map((questionId): SimulationCorrection => {
    const question = getOfficialQuestion(questionId);
    const persistedAnswer = persistedByQuestion.get(questionId);
    if (!question || !persistedAnswer) {
      throw new Error(`Pregunta ${questionId} no encontrada en el contenido.`);
    }
    return {
      questionId,
      selectedAnswer: persistedAnswer.selected_answer,
      correctAnswer: question.answer,
      isCorrect: persistedAnswer.is_correct,
    };
  });

  return {
    attemptId: parsedResult.data.attempt_id,
    correct: parsedResult.data.correct_count,
    incorrect: parsedResult.data.incorrect_count,
    omitted: parsedResult.data.omitted_count,
    score: parsedResult.data.score,
    elapsedMs: parsedResult.data.elapsed_ms,
    corrections,
  };
}
