"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { recordRecallReview, type RecallReviewResult } from "../../app/actions/reviews";
import type { ReviewRating } from "../../lib/adaptive/review-schedule";
import type { ReviewConcept } from "../../lib/adaptive/review-session";

const ratings: readonly { rating: ReviewRating; label: string; detail: string }[] = [
  { rating: 0, label: "No lo recordaba", detail: "Necesito volver mañana" },
  { rating: 1, label: "Me costó", detail: "Lo recuperé con esfuerzo" },
  { rating: 2, label: "Lo recordé", detail: "Respuesta correcta y segura" },
  { rating: 3, label: "Lo dominaba", detail: "Respuesta inmediata" },
];

const statusLabels = {
  new: "Nuevo",
  learning: "En aprendizaje",
  review: "En revisión",
  consolidated: "Consolidado",
  at_risk: "En riesgo",
} as const;

type ReviewPayload = {
  conceptId: string;
  rating: ReviewRating;
  clientEventId: string;
};

export function ReviewSession({ concepts }: { concepts: readonly ReviewConcept[] }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [outcome, setOutcome] = useState<RecallReviewResult | null>(null);
  const [retryPayload, setRetryPayload] = useState<ReviewPayload | null>(null);
  const [isPending, startTransition] = useTransition();
  const revealRef = useRef<HTMLButtonElement>(null);
  const firstRatingRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const concept = concepts[index];

  useEffect(() => {
    if (!concept) return;
    if (!revealed) revealRef.current?.focus();
    else if (outcome?.kind === "saved") nextRef.current?.focus();
    else if (outcome?.kind === "rejected" || outcome === null) firstRatingRef.current?.focus();
  }, [concept, index, outcome, revealed]);

  if (!concept) {
    return (
      <section className="review-complete" role="status">
        <p className="page-kicker">Sesión completada</p>
        <h2>Has terminado los repasos previstos</h2>
        <p>Tu programación se ha actualizado con la evidencia guardada.</p>
        <Link className="ui-button" href="/">Volver a tu preparación</Link>
      </section>
    );
  }

  const submit = (payload: ReviewPayload) => {
    setOutcome(null);
    startTransition(async () => {
      let result: RecallReviewResult;
      try {
        result = await recordRecallReview(payload.conceptId, payload.rating, payload.clientEventId);
      } catch {
        result = { kind: "retryable" };
      }
      setOutcome(result);
      if (result.kind === "retryable") setRetryPayload(payload);
      else if (result.kind === "rejected") setRetryPayload(null);
      else setRetryPayload(null);
    });
  };

  const chooseRating = (rating: ReviewRating) => {
    submit({ conceptId: concept.id, rating, clientEventId: crypto.randomUUID() });
  };

  const advance = () => {
    setRevealed(false);
    setOutcome(null);
    setRetryPayload(null);
    setIndex((current) => current + 1);
  };

  return (
    <section aria-labelledby="review-concept-title" className="review-session">
      <div className="review-session__sticky">
        <p aria-live="polite" className="review-session__progress">
          Concepto {index + 1} de {concepts.length}
        </p>
        <div aria-hidden="true" className="review-session__progress-track">
          <span style={{ width: `${((index + 1) / concepts.length) * 100}%` }} />
        </div>
      </div>

      <article className="review-session__card">
        <p className="metadata-label">Recuperación activa</p>
        <h2 id="review-concept-title">{concept.title}</h2>
        <p className="review-session__prompt">Explícalo con tus palabras</p>
        <Link
          className="text-link review-session__theory-link"
          href={`/curso/${concept.lessonSlug}?view=theory#concept-${concept.id}`}
        >
          Consultar la teoría de {concept.title}
        </Link>

        {!revealed ? (
          <button
            className="ui-button review-session__reveal"
            onClick={() => setRevealed(true)}
            ref={revealRef}
            type="button"
          >
            Mostrar respuesta
          </button>
        ) : (
          <>
            <section aria-labelledby="review-answer-title" className="review-session__answer" data-testid="review-answer">
              <h3 id="review-answer-title">Respuesta auditada</h3>
              <ul>
                {concept.claims.map((claim) => <li key={claim}>{claim}</li>)}
              </ul>
            </section>

            {outcome?.kind !== "saved" && outcome?.kind !== "retryable" && (
              <fieldset className="review-rating" disabled={isPending}>
                <legend>¿Cómo lo recordaste?</legend>
                <div className="review-rating__grid">
                  {ratings.map(({ detail, label, rating }, ratingIndex) => (
                    <button
                      aria-label={`${rating} · ${label}`}
                      className="review-rating-button"
                      key={rating}
                      onClick={() => chooseRating(rating)}
                      ref={ratingIndex === 0 ? firstRatingRef : undefined}
                      type="button"
                    >
                      <strong>{rating} · {label}</strong>
                      <span>{detail}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {isPending && <p aria-live="polite" className="review-session__saving">Guardando tu repaso…</p>}

            {outcome?.kind === "retryable" && retryPayload && (
              <div className="review-session__error" role="alert">
                <p>No sabemos si se guardó el repaso. Reintenta con los mismos datos para evitar duplicados.</p>
                <button className="ui-button" disabled={isPending} onClick={() => submit(retryPayload)} type="button">
                  Reintentar guardado
                </button>
              </div>
            )}

            {(outcome?.kind === "rejected" || outcome?.kind === "unauthenticated") && (
              <p className="review-session__error" role="alert">
                No se ha guardado la valoración. Comprueba tu sesión e inténtalo de nuevo.
              </p>
            )}

            {outcome?.kind === "saved" && (
              <div className="review-session__feedback" role="status">
                <p><strong>Repaso guardado.</strong> Próximo repaso: {outcome.dueOn ?? "por programar"}.</p>
                <p>Estado: {statusLabels[outcome.status]}.</p>
                <button className="ui-button" onClick={advance} ref={nextRef} type="button">
                  {index + 1 < concepts.length ? "Siguiente concepto" : "Finalizar repaso"}
                </button>
              </div>
            )}
          </>
        )}
      </article>
    </section>
  );
}
