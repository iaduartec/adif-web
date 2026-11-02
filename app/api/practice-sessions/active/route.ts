import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerClient } from "../../../lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const domain = url.searchParams.get("domain");
  const status = url.searchParams.get("status") ?? "IN_PROGRESS";

  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autenticado.", retryable: false }, { status: 401 });

    const { data, error } = await supabase
      .from("practice_sessions")
      .select("id, domain, topic_id, mode, question_count, question_ids, status, version, started_at, completed_at, total_elapsed_ms")
      .eq("user_id", user.id)
      .eq("status", status)
      .order("updated_at", { ascending: false })
      .limit(10);

    if (error) {
      return NextResponse.json({ error: "No se han podido obtener las sesiones.", retryable: true }, { status: 503 });
    }

    // Filter by domain if provided
    const sessions = domain ? (data ?? []).filter((s) => s.domain === domain) : (data ?? []);

    return NextResponse.json({ sessions });
  } catch {
    return NextResponse.json({ error: "Servicio no disponible.", retryable: true }, { status: 503 });
  }
}
MD