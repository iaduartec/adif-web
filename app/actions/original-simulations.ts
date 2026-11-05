"use server";

import { z } from "zod";
import { createHash } from "node:crypto";
import { getOriginalPracticeQuestion } from "../../lib/content/original-practice-repository";
import { createServerClient } from "../../lib/supabase/server";

const answerKeySchema = z.enum(["A", "B", "C", "D"]);
const submissionSchema = z.object({
  accountScope: z.string().regex(/^[a-f0-9]{24}$/),
  questionIds: z.array(z.string().regex(/^orig-[a-z0-9-]+$/)).min(1).max(500),
  answers: z.record(z.string(), answerKeySchema),
  elapsedMsByQuestion: z.record(z.string(), z.number().int().nonnegative().max(86_400_000)),
  clientEventIds: z.record(z.string(), z.uuid()),
}).strict().superRefine((value, context) => {
  if (new Set(value.questionIds).size !== value.questionIds.length) {
    context.addIssue({ code: "custom", path: ["questionIds"], message: "Duplicate question IDs." });
  }
  const ids = new Set(value.questionIds);
  for (const key of [
    ...Object.keys(value.answers),
    ...Object.keys(value.clientEventIds),
    ...Object.keys(value.elapsedMsByQuestion),
  ]) {
    if (!ids.has(key)) context.addIssue({ code: "custom", path: ["answers"], message: "Answer does not belong to this simulation." });
  }
  if (Object.keys(value.answers).some((id) => !value.clientEventIds[id])) {
    context.addIssue({ code: "custom", path: ["clientEventIds"], message: "Answered questions require an idempotency key." });
  }
  if (Object.keys(value.answers).some((id) => value.elapsedMsByQuestion[id] === undefined)) {
    context.addIssue({ code: "custom", path: ["elapsedMsByQuestion"], message: "Answered questions require elapsed-time data." });
  }
});

export type OriginalSimulationCorrection = {
  questionId: string;
  selectedAnswer: "A" | "B" | "C" | "D" | null;
  correctAnswer: "A" | "B" | "C" | "D";
  isCorrect: boolean;
  explanation: string;
};

export type OriginalSimulationOutcome =
  | { ok: true; corrections: OriginalSimulationCorrection[] }
  | { ok: false; error: string; retryable: boolean; kind?: "conflict" | "submission_unknown" | "recoverable_error" };

export async function submitOriginalSimulation(input: unknown): Promise<OriginalSimulationOutcome> {
  const parsed = submissionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "La entrega del simulacro no es válida.", retryable: false };

  const questions = parsed.data.questionIds.map((id) => getOriginalPracticeQuestion(id));
  if (questions.some((question) => question?.status !== "reviewed")) {
    return { ok: false, error: "El simulacro contiene preguntas no disponibles.", retryable: false };
  }
  if (new Set(questions.map((question) => question!.domain)).size !== 1) {
    return { ok: false, error: "El simulacro debe contener preguntas de una sola modalidad.", retryable: false };
  }
  for (const question of questions) {
    const selected = parsed.data.answers[question!.id];
    if (selected && !question!.options.some((option) => option.key === selected)) {
      return { ok: false, error: "La entrega contiene una respuesta que no pertenece a la pregunta.", retryable: false };
    }
  }

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Debes iniciar sesión para entregar el simulacro.", retryable: false };
  if (createHash("sha256").update(user.id).digest("hex").slice(0, 24) !== parsed.data.accountScope) {
    return { ok: false, kind: "recoverable_error", error: "La cuenta ha cambiado. Vuelve a la cuenta con la que empezaste el simulacro.", retryable: false };
  }

  const corrections: OriginalSimulationCorrection[] = [];
  for (const question of questions) {
    const selectedAnswer = parsed.data.answers[question!.id] ?? null;
    if (selectedAnswer) {
      const { data, error } = await supabase.rpc("record_practice_attempt", {
        p_question_id: question!.id,
        p_selected_answer: selectedAnswer,
        p_elapsed_ms: parsed.data.elapsedMsByQuestion[question!.id] ?? 0,
        p_client_event_id: parsed.data.clientEventIds[question!.id],
        // The existing registry intentionally rejects original items in the
        // legacy simulation mode; this records item evidence as practice only.
        p_mode: "practice",
      });
      if (error?.code === "P0002") {
        return { ok: false, kind: "recoverable_error", retryable: false, error: "No se ha podido completar la entrega porque falta información en el registro de preguntas. Algunas respuestas anteriores pueden haberse guardado." };
      }
      if (error || !data || typeof data !== "object" || !("is_correct" in data) || typeof data.is_correct !== "boolean") {
        return {
          ok: false,
          kind: "submission_unknown",
          error: "No se ha podido confirmar todo el simulacro. Reintenta la entrega para recuperar la corrección.",
          // Earlier answers may already have been stored. Keep the exact payload
          // and its idempotency keys until the server confirms the whole block.
          retryable: true,
        };
      }
      const isCorrectByReviewedKey = selectedAnswer === question!.answer;
      if (data.is_correct !== isCorrectByReviewedKey) {
        return {
          ok: false,
          kind: "submission_unknown",
          error: "La corrección recibida no coincide con la clave revisada. No se mostrará una nota inconsistente; el reintento conserva la misma clave de idempotencia.",
          retryable: true,
        };
      }
      corrections.push({
        questionId: question!.id,
        selectedAnswer,
        correctAnswer: question!.answer,
        isCorrect: data.is_correct,
        explanation: question!.explanation,
      });
    } else {
      corrections.push({
        questionId: question!.id,
        selectedAnswer: null,
        correctAnswer: question!.answer,
        isCorrect: false,
        explanation: question!.explanation,
      });
    }
  }

  return { ok: true, corrections };
}
