import { redirect } from "next/navigation";
import { flashcards } from "../../../content/flashcards";
import { FlashcardDeck } from "../../../components/cards/flashcard-deck";
import { createServerClient } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function FichasPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: favRows } = await supabase
    .from("favorites")
    .select("item_id")
    .eq("user_id", user.id)
    .eq("item_type", "flashcard");

  const favoriteIds = new Set((favRows ?? []).map((r) => r.item_id));

  return (
    <section className="course-index" aria-labelledby="fichas-title">
      <header className="course-index__header">
        <p className="course-eyebrow">Fichas de repaso</p>
        <h1 id="fichas-title">Fichas</h1>
        <p>
          Repasa los conceptos clave de cada módulo con tarjetas de estudio interactivas.
          Pulsa sobre la ficha para ver la respuesta, navega entre ellas y marca tus favoritas.
        </p>
      </header>

      <FlashcardDeck cards={flashcards} favoriteIds={favoriteIds} />

      <div className="mt-10 pt-6 border-t border-rail">
        <p className="text-xs text-gray-500 text-center">
          {flashcards.length} fichas disponibles · 8 módulos · Las fichas marcadas con ★ se guardan en tu perfil.
        </p>
      </div>
    </section>
  );
}
