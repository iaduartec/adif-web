import type { ReadinessSnapshot } from "../../lib/adaptive/readiness";

function percent(value: number | null) {
  return value === null ? "Sin intentos" : `${value}%`;
}

export function ReadinessStatistics({ snapshot }: { snapshot: ReadinessSnapshot }) {
  return (
    <>
      <section aria-labelledby="readiness-summary-title" className="progress-summary">
        <h2 className="sr-only" id="readiness-summary-title">Resumen de preparación</h2>
        <dl className="progress-summary__row">
          <div className="progress-metric"><dt className="progress-metric__label">Racha actual</dt><dd className="progress-metric__value">{snapshot.streak} {snapshot.streak === 1 ? "día" : "días"}</dd><dd className="progress-metric__detail">Actividad en días consecutivos de Madrid</dd></div>
          <div className="progress-metric"><dt className="progress-metric__label">Precisión reciente</dt><dd className="progress-metric__value">{percent(snapshot.accuracy.recent.percentage)}</dd><dd className="progress-metric__detail">Últimos 14 días</dd></div>
          <div className="progress-metric"><dt className="progress-metric__label">Precisión histórica</dt><dd className="progress-metric__value">{percent(snapshot.accuracy.historical.percentage)}</dd><dd className="progress-metric__detail">Todo el contenido activo</dd></div>
          <div className="progress-metric"><dt className="progress-metric__label">Dominio vigente</dt><dd className="progress-metric__value">{snapshot.currentDomain.percentage}%</dd><dd className="progress-metric__detail">{snapshot.currentDomain.current}/{snapshot.currentDomain.total} conceptos</dd></div>
        </dl>
      </section>

      <section aria-labelledby="lesson-metrics-title" className="data-panel">
        <h2 id="lesson-metrics-title">Rendimiento por lección</h2>
        <div className="data-table-wrap">
          <table aria-label="Rendimiento por lección" className="data-table">
            <thead><tr><th>Lección</th><th>Dominio vigente</th><th>Precisión 14 días</th><th>Precisión histórica</th><th>Respuestas</th></tr></thead>
            <tbody>
              {snapshot.lessons.map((lesson) => (
                <tr key={lesson.lessonId}>
                  <td>{lesson.lessonTitle}</td>
                  <td>{lesson.domainPercentage}% ({lesson.currentConcepts}/{lesson.conceptCount})</td>
                  <td>{percent(lesson.recentPercentage)}</td>
                  <td>{percent(lesson.percentage)}</td>
                  <td>{lesson.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="concept-metrics-title" className="data-panel">
        <h2 id="concept-metrics-title">Rendimiento por concepto</h2>
        <div className="data-table-wrap">
          <table aria-label="Rendimiento por concepto" className="data-table">
            <thead><tr><th>Concepto</th><th>Lección</th><th>Estado</th><th>Precisión 14 días</th><th>Precisión histórica</th><th>Respuestas</th></tr></thead>
            <tbody>
              {snapshot.concepts.map((concept) => (
                <tr key={concept.conceptId}>
                  <td>{concept.conceptTitle}</td>
                  <td>{concept.lessonTitle}</td>
                  <td>{concept.current ? "Vigente" : concept.status === "at_risk" ? "En riesgo" : "Pendiente"}</td>
                  <td>{percent(concept.recentPercentage)}</td>
                  <td>{percent(concept.percentage)}</td>
                  <td>{concept.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
