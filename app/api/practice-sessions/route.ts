import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerClient } from "../../../lib/supabase/server";

const createSchema = z.object({
  domain: z.string().min(1),
  topicId: z.string().nullable().optional(),
  mode: z.enum(["training", "practice"]),
  questionIds: z.array(z.string()).min(1),
  clientEventId: z.uuid(),
}).strict();

export async function POST(request: Request) {
  let input: z.infer<typeof createSchema>;
  try {
    const body: unknown = await request.json();
    input = createSchema.parse(body);
  } catch {
    return NextResponse.json({ error: "Solicitud inválida.", retryable: false }, { status: 400 });
  }

  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autenticado.", retryable: false }, { status: 401 });

    const { data, error } = await supabase.rpc("create_practice_session", {
      p_domain: input.domain,
      p_topic_id: input.topicId ?? null,
      p_mode: input.mode,
      p_question_ids: input.questionIds,
      p_client_event_id: input.clientEventId,
    });

    if (error) {
      if (error.code === "23514") {
        return NextResponse.json({ error: "Conflicto de idempotencia.", retryable: false }, { status: 409 });
      }
      return NextResponse.json({ error: "No se ha podido crear la sesión.", retryable: true }, { status: 503 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Servicio no disponible.", retryable: true }, { status: 503 });
  }
}
MD