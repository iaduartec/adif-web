import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerClient } from "../../../../lib/supabase/server";

const saveSchema = z.object({
  questionId: z.string().min(1),
  selectedAnswer: z.enum(["A", "B", "C", "D"]),
  elapsedMs: z.number().int().min(0).max(86_400_000),
  clientEventId: z.uuid(),
  expectedVersion: z.number().int().min(1),
}).strict();

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let input: z.infer<typeof saveSchema>;
  try {
    const body: unknown = await request.json();
    input = saveSchema.parse(body);
  } catch {
    return NextResponse.json({ error: "Solicitud inválida.", retryable: false }, { status: 400 });
  }

  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autenticado.", retryable: false }, { status: 401 });

    const { data, error } = await supabase.rpc("save_practice_answer", {
      p_session_id: id,
      p_question_id: input.questionId,
      p_selected_answer: input.selectedAnswer,
      p_elapsed_ms: input.elapsedMs,
      p_client_event_id: input.clientEventId,
      p_expected_version: input.expectedVersion,
    });

    if (error) {
      if (error.code === "P0002") {
        return NextResponse.json({ error: "Sesión no encontrada.", retryable: false }, { status: 404 });
      }
      if (error.code === "23514") {
        return NextResponse.json({ error: "Operación no permitida.", retryable: false }, { status: 409 });
      }
      if (error.code === "40001") {
        return NextResponse.json({ error: "Conflicto de versión.", retryable: true }, { status: 409 });
      }
      return NextResponse.json({ error: "No se ha podido guardar la respuesta.", retryable: true }, { status: 503 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Servicio no disponible.", retryable: true }, { status: 503 });
  }
}
MD