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

export type SimulationSubmissionFailure = {
  ok: false;
  error: string;
  retryable: boolean;
};

export type SimulationSubmissionOutcome = SimulationResult | SimulationSubmissionFailure;

function validationFailure(error: string): SimulationSubmissionFailure {
  return { ok: false, error, retryable: false };
}

export async function submitSimulation(
  examId: string,
  answers: Record<string, string>,
  elapsedMs: number,
  clientEventId: string,
): Promise<SimulationSubmissionOutcome> {
  const exam = getOfficialExam(examId);
  if (!exam) return validationFailure("El examen oficial solicitado no existe.");

  if (
    typeof elapsedMs !== "number"
    || !Number.isFinite(elapsedMs)
    || !Number.isSafeInteger(elapsedMs)
    || elapsedMs < 0
    || elapsedMs > MAX_SIMULATION_ELAPSED_MS
  ) {
    return validationFailure("Tiempo transcurrido inválido.");
  }

  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return validationFailure("Respuesta inválida en la entrega del examen.");
  }

  if (typeof clientEventId !== "string" || !UUID_PATTERN.test(clientEventId)) {
    return validationFailure("Identificador de entrega inválido.");
  }

  for (const selectedAnswer of Object.values(answers)) {
    if (!ANSWER_KEYS.has(selectedAnswer)) {
      return validationFailure("Respuesta inválida en la entrega del examen. Usa únicamente A, B, C o D.");
    }
  }

  const examQuestionIds = new Set(exam.questionIds);
  for (const questionId of Object.keys(answers)) {
    if (!examQuestionIds.has(questionId)) {
      return validationFailure(`La pregunta ${questionId} no pertenece al examen oficial.`);
    }
  }

  if (exam.questionIds.some((questionId) => !getOfficialQuestion(questionId))) {
    return validationFailure("El contenido del examen oficial está incompleto.");
  }

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return validationFailure("Debes iniciar sesión para entregar un examen.");

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
  if (attemptError) {
    const retryable = !["23514", "P0002", "28000"].includes(attemptError.code ?? "");
    return {
      ok: false,
      error: retryable
        ? "No se ha podido registrar el intento del examen. Puedes reintentar la entrega."
        : "La entrega contiene datos inválidos. Revisa las respuestas antes de intentarlo de nuevo.",
      retryable,
    };
  }
  if (!parsedResult.success) {
    return {
      ok: false,
      error: "No se ha podido confirmar el resultado guardado. Puedes reintentar la entrega.",
      retryable: true,
    };
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
