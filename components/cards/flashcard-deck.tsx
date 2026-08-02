"use client";

import { useState, useCallback, useTransition } from "react";
import type { Flashcard } from "../../content/flashcards";
import { toggleFavoriteFlashcard } from "../../app/actions/favorites";

const MODULES = [
  "Todos",
  "G1 Igualdad",
  "G2 PRL",
  "G3 Estatuto ADIF",
  "E1 ICT RD 346/2011",
  "E2 Compatibilidad electromagnetica",
  "E3 RCF Libro 1",
  "P Psicotecnicos",
  "I Ingles A2",
];

export function FlashcardDeck({
  cards,
  favoriteIds,
}: {
  cards: readonly Flashcard[];
  favoriteIds: Set<string>;
}) {
  const [selectedModule, setSelectedModule] = useState("Todos");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [favSet, setFavSet] = useState(favoriteIds);
  const [isPending, startTransition] = useTransition();

  const filtered = selectedModule === "Todos"
    ? cards
    : cards.filter((c) => c.module === selectedModule);

  const safeIndex = Math.min(index, Math.max(0, filtered.length - 1));
  const card = filtered[safeIndex];

  const goNext = useCallback(() => {
    setFlipped(false);
    setIndex((i) => Math.min(i + 1, filtered.length - 1));
  }, [filtered.length]);

  const goPrev = useCallback(() => {
    setFlipped(false);
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  const handleModuleChange = useCallback((mod: string) => {
    setSelectedModule(mod);
    setIndex(0);
    setFlipped(false);
  }, []);

  const handleFavorite = useCallback(() => {
    if (!card) return;
    startTransition(async () => {
      try {
        const result = await toggleFavoriteFlashcard(card.id);
        setFavSet((prev) => {
          const next = new Set(prev);
          if (result.isFavorite) {
            next.add(card.id);
          } else {
            next.delete(card.id);
          }
          return next;
        });
      } catch {
        // silently ignore
      }
    });
  }, [card]);

  if (filtered.length === 0) {
    return (
      <div className="space-y-6">
        <ModuleFilter modules={MODULES} selected={selectedModule} onChange={handleModuleChange} />
        <div className="py-16 text-center border border-dashed border-rail text-gray-500">
          No hay fichas para este módulo.
        </div>
      </div>
    );
  }

  const isFav = card ? favSet.has(card.id) : false;

  return (
    <div className="space-y-6">
      <ModuleFilter modules={MODULES} selected={selectedModule} onChange={handleModuleChange} />

      {/* Card */}
      <div className="flashcard-perspective" style={{ perspective: "1200px" }}>
        <button
          aria-label={flipped ? "Mostrar pregunta" : "Mostrar respuesta"}
          className="flashcard-container"
          onClick={() => setFlipped((f) => !f)}
          style={{
            display: "block",
            width: "100%",
            minHeight: "280px",
            position: "relative",
            transformStyle: "preserve-3d",
            transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            cursor: "pointer",
            background: "none",
            border: "none",
            padding: 0,
          }}
          type="button"
        >
          {/* Front */}
          <div
            className="flashcard-face"
            style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "2rem",
              border: "1px solid var(--rail)",
              background: "white",
              textAlign: "center",
            }}
          >
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              {card?.module}
            </p>
            <p className="text-lg font-bold text-ink leading-relaxed">
              {card?.front}
            </p>
            <p className="text-xs text-gray-400 mt-6">Pulsa para ver la respuesta</p>
          </div>

          {/* Back */}
          <div
            className="flashcard-face"
            style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "2rem",
              border: "2px solid var(--accent)",
              background: "var(--paper)",
              textAlign: "center",
            }}
          >
            <p className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Respuesta</p>
            <p className="text-base text-ink leading-relaxed whitespace-pre-line">
              {card?.back}
            </p>
            <p className="text-xs text-gray-400 mt-6">Pulsa para volver a la pregunta</p>
          </div>
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          className="ui-button bg-transparent border border-accent text-accent-strong hover:bg-accent-strong hover:text-paper font-bold px-6"
          disabled={safeIndex <= 0}
          onClick={goPrev}
          type="button"
        >
          ← Anterior
        </button>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 font-bold">
            {safeIndex + 1} / {filtered.length}
          </span>
          <button
            aria-label={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
            className={`text-xl transition-transform hover:scale-110 ${isPending ? "opacity-50" : ""}`}
            disabled={isPending}
            onClick={handleFavorite}
            type="button"
          >
            {isFav ? "★" : "☆"}
          </button>
        </div>

        <button
          className="ui-button bg-transparent border border-accent text-accent-strong hover:bg-accent-strong hover:text-paper font-bold px-6"
          disabled={safeIndex >= filtered.length - 1}
          onClick={goNext}
          type="button"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}

function ModuleFilter({
  modules,
  selected,
  onChange,
}: {
  modules: string[];
  selected: string;
  onChange: (mod: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {modules.map((mod) => (
        <button
          className={`px-3 py-1.5 text-xs font-bold border transition-colors ${
            selected === mod
              ? "border-accent bg-accent-strong text-paper"
              : "border-rail bg-white text-gray-600 hover:border-accent hover:text-accent-strong"
          }`}
          key={mod}
          onClick={() => onChange(mod)}
          type="button"
        >
          {mod}
        </button>
      ))}
    </div>
  );
}
