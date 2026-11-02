import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerClient } from "../../../../lib/supabase/server";

const submitSchema = z.object({
  clientEventId: z.uuid(),
}).strict();

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let input: z.infer<typeof submitSchema>;
  try {
    const body: unknown = await request.json();
    input = submitSchema.parse(body);
  } catch {
    return NextResponse.json({ error: "Solicitud inválida.", retryable: false }, { status: 400 });
  }

  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autenticado.", retryable: false }, { status: 401 });

    const { data, error } = await supabase.rpc("submit_practice_session", {
      p_session_id: id,
      p_client_event_id: input.clientEventId,
    });

    if (error) {
      if (error.code === "P0002") {
        return NextResponse.json({ error: "Sesión no encontrada.", retryable: false }, { status: 404 });
      }
      if (error.code === "23514") {
        return NextResponse.json({ error: "Operación no permitida.", retryable: false }, { status: 409 });
      }
      return NextResponse.json({ error: "No se ha podido finalizar la sesión.", retryable: true }, { status: 503 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Servicio no disponible.", retryable: true }, { status: 503 });
  }
}
MD