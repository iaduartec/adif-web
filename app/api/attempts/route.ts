import { NextResponse } from "next/server";
import { z } from "zod";
import { getOfficialQuestion } from "../../../lib/content/repository";
import { createServerClient } from "../../../lib/supabase/server";

const attemptSchema = z.object({
  questionId: z.string().regex(/^ADIF-\d{4}-\d{4}-Q\d{2}$/),
  answer: z.enum(["A", "B", "C", "D"]),
  mode: z.enum(["practice", "simulation"]),
  elapsedMs: z.number().finite().min(0),
}).strict();

export async function POST(request: Request) {
  let input: z.infer<typeof attemptSchema>;
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
    input = attemptSchema.parse(body);
  } catch {
    return NextResponse.json({ error: "Solicitud de intento inválida." }, { status: 400 });
  }

  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Debes iniciar sesión para registrar respuestas." }, { status: 401 });

    const question = getOfficialQuestion(input.questionId);
    if (!question) return NextResponse.json({ error: "La pregunta solicitada no existe." }, { status: 404 });

    const isCorrect = question.answer === input.answer;
    const { data, error } = await supabase.from("question_attempts").insert({
      user_id: user.id,
      question_id: question.id,
      selected_answer: input.answer,
      is_correct: isCorrect,
      mode: input.mode,
      elapsed_ms: input.elapsedMs,
    }).select("id").single();

    if (error || !data) return NextResponse.json({ error: "No se ha podido guardar el intento." }, { status: 503 });

    return NextResponse.json({ attemptId: data.id, isCorrect, correctAnswer: question.answer }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "El servicio de práctica no está disponible." }, { status: 503 });
  }
}
