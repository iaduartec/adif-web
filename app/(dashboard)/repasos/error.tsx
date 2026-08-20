"use client";

export default function ReviewError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="dashboard-reading review-page">
      <section aria-labelledby="review-error-title" className="review-route-state" role="alert">
        <p className="page-kicker">Repasos no disponibles</p>
        <h1 id="review-error-title">No hemos podido cargar tus repasos</h1>
        <p>Tu progreso sigue guardado. Puedes volver a intentar cargar la sesión.</p>
        <button className="ui-button" onClick={reset} type="button">Reintentar</button>
      </section>
    </div>
  );
}
