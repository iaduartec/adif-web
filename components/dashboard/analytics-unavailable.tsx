import Link from "next/link";

export function AnalyticsUnavailable({ retryHref }: { retryHref: "/" | "/estadisticas" }) {
  return (
    <div className="dashboard-wide analytics-unavailable">
      <section aria-labelledby="analytics-unavailable-title" className="empty-state" role="alert">
        <p className="page-kicker">Recuperación de datos</p>
        <h1 id="analytics-unavailable-title">Indicadores no disponibles</h1>
        <p>No hemos podido cargar tus indicadores ahora. Tu contenido de estudio sigue disponible.</p>
        <Link className="ui-button" href={retryHref}>Reintentar</Link>
      </section>

      <nav aria-label="Recursos de estudio" className="resource-links dashboard-section">
        <h2>Continúa estudiando</h2>
        <div className="resource-links__list">
          <Link className="resource-link" href="/curso">Temario activo</Link>
          <Link className="resource-link" href="/tests">Preguntas oficiales</Link>
          <Link className="resource-link" href="/simulacros">Simulacros oficiales</Link>
        </div>
      </nav>
    </div>
  );
}
