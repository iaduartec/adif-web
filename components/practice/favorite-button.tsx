"use client";

import { useState, useTransition } from "react";
import { toggleFavorite } from "../../app/actions/favorites";

export function FavoriteButton({
  questionId,
  initialIsFavorite,
}: {
  questionId: string;
  initialIsFavorite: boolean;
}) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleToggle() {
    setError("");
    startTransition(async () => {
      try {
        const result = await toggleFavorite(questionId);
        setIsFavorite(result.isFavorite);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al guardar favorito");
      }
    });
  }

  return (
    <div className="flex flex-col items-center">
      <button
        aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
        className={`favorite-btn ${isFavorite ? "favorite-btn--active" : ""} ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={isPending}
        onClick={handleToggle}
        type="button"
      >
        <svg
          aria-hidden="true"
          fill={isFavorite ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.969 0 1.371 1.24.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.52 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.175 0l-3.97 2.883c-.783.57-1.838-.197-1.539-1.118l1.52-4.674a1 1 0 00-.364-1.118L2.05 10.1c-.783-.57-.38-1.81.588-1.81h4.908a1 1 0 00.95-.69l1.519-4.674z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {error && (
        <span className="text-xs text-red-600 mt-1" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
