import type { StudyMetrics } from "../../lib/progress/metrics";
import { displayModuleName } from "../../lib/progress/metrics";

export function ProgressSummary({
  metrics,
  totalLessonsCount,
  completedLessonsCount,
}: {
  metrics: StudyMetrics;
  totalLessonsCount: number;
  completedLessonsCount: number;
}) {
  const totalAttempts = Object.values(metrics.accuracyByModule).reduce(
    (acc, m) => acc + m.total,
    0,
  );
  const totalCorrect = Object.values(metrics.accuracyByModule).reduce(
    (acc, m) => acc + m.correct,
    0,
  );
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  const courseCompletionPercent =
    totalLessonsCount > 0 ? Math.round((completedLessonsCount / totalLessonsCount) * 100) : 0;
  const weakestLabel = displayModuleName(metrics.weakestModule);

  return (
    <section aria-labelledby="progress-summary-title" className="progress-summary">
      <h2 id="progress-summary-title" className="sr-only">Resumen de progreso</h2>
      <div className="progress-summary__row">
        <div className="progress-metric">
          <p className="progress-metric__label">Lecciones completadas</p>
          <p className="progress-metric__value">{completedLessonsCount}/{totalLessonsCount}</p>
          <p className="progress-metric__detail">{courseCompletionPercent}% del temario</p>
        </div>

        <div className="progress-metric">
          <p className="progress-metric__label">Preguntas oficiales intentadas</p>
          <p className="progress-metric__value">{totalAttempts}</p>
          <p className="progress-metric__detail">Intentos registrados</p>
        </div>

        <div className="progress-metric">
          <p className="progress-metric__label">Precisión global</p>
          <p className="progress-metric__value">{totalAttempts > 0 ? `${overallAccuracy}%` : "—"}</p>
          <p className="progress-metric__detail">{totalAttempts > 0 ? "Respuestas correctas" : "Sin respuestas registradas"}</p>
        </div>

        <div className="progress-metric progress-metric--priority">
          <p className="progress-metric__label">Sección oficial prioritaria</p>
          <p className="progress-metric__value progress-metric__value--text">
            {metrics.weakestModule ? weakestLabel : "Sin datos todavía"}
          </p>
          <p className="progress-metric__detail">
            {metrics.weakestModule ? "Menor precisión registrada" : "Aparecerá tras tus primeros intentos"}
          </p>
        </div>
      </div>
    </section>
  );
}
