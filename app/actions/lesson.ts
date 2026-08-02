"use server";

import { getLesson } from "../../lib/content/repository";
import { createServerClient } from "../../lib/supabase/server";

const unauthenticatedMessage = "Debes iniciar sesión para guardar tu progreso.";

async function getAuthenticatedLesson(slug: string) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(unauthenticatedMessage);
  }

  if (!getLesson(slug)) {
    throw new Error("La lección solicitada no existe.");
  }

  return { supabase, user };
}

export async function saveLessonProgress(slug: string, percent: number) {
  if (!Number.isInteger(percent) || percent < 0 || percent > 100) {
    throw new Error("El progreso debe ser un número entero entre 0 y 100.");
  }

  const { supabase, user } = await getAuthenticatedLesson(slug);
  const { error } = await supabase.from("lesson_progress").upsert(
    {
      user_id: user.id,
      lesson_id: slug,
      percent,
      completed: percent === 100,
      last_activity_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id" },
  );

  if (error) {
    throw new Error("No se ha podido guardar el progreso. Inténtalo de nuevo.");
  }

  return { ok: true } as const;
}

export async function saveNote(slug: string, body: string) {
  const trimmedBody = body.trim();

  if (trimmedBody.length < 1 || trimmedBody.length > 5_000) {
    throw new Error("La nota debe tener entre 1 y 5000 caracteres.");
  }

  const { supabase, user } = await getAuthenticatedLesson(slug);
  const { error } = await supabase.from("notes").upsert(
    { user_id: user.id, lesson_id: slug, body: trimmedBody },
    { onConflict: "user_id,lesson_id" },
  );

  if (error) {
    throw new Error("No se ha podido guardar la nota. Inténtalo de nuevo.");
  }

  return { ok: true } as const;
}
