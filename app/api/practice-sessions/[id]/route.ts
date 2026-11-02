import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerClient } from "../../../../lib/supabase/server";

const uuidSchema = z.string().uuid();

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) {
    return NextResponse.json({ error: "ID inválido.", retryable: false }, { status: 400 });
  }

  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autenticado.", retryable: false }, { status: 401 });

    const { data, error } = await supabase.rpc("get_practice_session", {
      p_session_id: id,
    });

    if (error) {
      if (error.code === "P0002") {
        return NextResponse.json({ error: "Sesión no encontrada.", retryable: false }, { status: 404 });
      }
      return NextResponse.json({ error: "No se ha podido obtener la sesión.", retryable: true }, { status: 503 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Servicio no disponible.", retryable: true }, { status: 503 });
  }
}
MD