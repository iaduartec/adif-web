import { NextResponse } from "next/server";
import { z } from "zod";
import { getOfficialQuestion } from "../../../lib/content/repository";
import { createServerClient } from "../../../lib/supabase/server";

const rawAttemptSchema = z.object({
  questionId: z.string().regex(/^ADIF-\d{4}-\d{4}-Q\d{2}$/),
  answer: z.enum(["A", "B", "C", "D"]).optional(),
  selectedAnswer: z.enum(["A", "B", "C", "D"]).optional(),
  mode: z.enum(["practice", "simulation"]).optional(),
  elapsedMs: z.number().finite().safe().int().min(0).max(86_400_000),
  clientEventId: z.uuid().optional(),
}).strict().superRefine((value, context) => {
  if (!value.answer && !value.selectedAnswer) {
    context.addIssue({ code: "custom", message: "An answer is required." });
  }
  if (value.answer && value.selectedAnswer && value.answer !== value.selectedAnswer) {
    context.addIssue({ code: "custom", message: "Answer aliases conflict." });
  }
}).transform((value) => ({
  questionId: value.questionId,
  selectedAnswer: value.selectedAnswer ?? value.answer!,
  mode: value.mode ?? "practice",
  elapsedMs: value.elapsedMs,
  clientEventId: value.clientEventId ?? crypto.randomUUID(),
}));

type AttemptInput = z.infer<typeof rawAttemptSchema>;

export async function POST(request: Request) {
  let input: AttemptInput;
  try {
    const body: unknown = await request.json();
    if (
      typeof body === "object"
      && body !== null
      && "questionId" in body
      && typeof body.questionId === "string"
      && /^Q\d{4}$/.test(body.questionId)
    ) {
      return NextResponse.json({ error: "La pregunta solicitada no existe." }, { status: 404 });
    }
    input = rawAttemptSchema.parse(body);
  } catch {
    return NextResponse.json({ error: "Solicitud de intento inválida." }, { status: 400 });
  }

  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Debes iniciar sesión para registrar respuestas." }, { status: 401 });

    const question = getOfficialQuestion(input.questionId);
    if (!question) return NextResponse.json({ error: "La pregunta solicitada no existe." }, { status: 404 });

    const { data, error } = await supabase.rpc("record_practice_attempt", {
      p_question_id: question.id,
      p_selected_answer: input.selectedAnswer,
      p_elapsed_ms: input.elapsedMs,
      p_client_event_id: input.clientEventId,
      p_mode: input.mode,
    });

    if (error?.code === "23514" && /idempotency key/i.test(error.message ?? "")) {
      return NextResponse.json(
        { error: "El identificador del intento ya se utilizó con otros datos." },
        { status: 409 },
      );
    }
    if (
      error
      || !data
      || typeof data !== "object"
      || Array.isArray(data)
      || typeof data.attempt_id !== "string"
      || typeof data.is_correct !== "boolean"
    ) return NextResponse.json({ error: "No se ha podido guardar el intento." }, { status: 503 });

    return NextResponse.json({
      attemptId: data.attempt_id,
      isCorrect: data.is_correct,
      correctAnswer: question.answer,
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "El servicio de práctica no está disponible." }, { status: 503 });
  }
}
