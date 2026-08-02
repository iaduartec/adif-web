"use server";

import { getQuestion } from "../../lib/content/repository";
import { createServerClient } from "../../lib/supabase/server";

export async function toggleFavorite(questionId: string) {
  if (!/^Q\d{4}$/.test(questionId) || !getQuestion(questionId)) {
    throw new Error("La pregunta solicitada no existe.");
  }

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes iniciar sesión para guardar favoritos.");

  const { data: favorite, error: lookupError } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("item_type", "question")
    .eq("item_id", questionId)
    .maybeSingle();

  if (lookupError) throw new Error("No se ha podido actualizar el favorito.");

  if (favorite) {
    const { error } = await supabase.from("favorites").delete().eq("id", favorite.id).eq("user_id", user.id);
    if (error) throw new Error("No se ha podido actualizar el favorito.");
    return { isFavorite: false } as const;
  }

  const { error } = await supabase.from("favorites").insert({
    user_id: user.id,
    item_type: "question",
    item_id: questionId,
  });
  if (error) throw new Error("No se ha podido actualizar el favorito.");

  return { isFavorite: true } as const;
}
