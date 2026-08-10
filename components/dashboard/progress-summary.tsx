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
  const remainingLessonsCount = Math.max(0, totalLessonsCount - completedLessonsCount);
  const weakestLabel = displayModuleName(metrics.weakestModule);

  return (
    <section aria-labelledby="progress-summary-title" className="mb-8">
      <h2 id="progress-summary-title" className="sr-only">Resumen de Progreso</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Streak Card */}
        <div className="simulation-results__card">
          <p className="simulation-results__label">Racha de Estudio</p>
          <p className="simulation-results__value flex items-center justify-center gap-2">
            🔥 {metrics.streak} {metrics.streak === 1 ? "día" : "días"}
          </p>
          <p className="simulation-results__sub">días consecutivos activo</p>
        </div>

        {/* Course Completion Card */}
        <div className="simulation-results__card">
          <p className="simulation-results__label">Temario Completado</p>
          <p className="simulation-results__value">
            {courseCompletionPercent}%
          </p>
          <p className="simulation-results__sub">
            {completedLessonsCount} de {totalLessonsCount} temas leídos
          </p>
        </div>

        {/* Practice Questions Card */}
        <div className="simulation-results__card">
          <p className="simulation-results__label">Preguntas Respondidas</p>
          <p className="simulation-results__value">{totalAttempts}</p>
          <p className="simulation-results__sub">en el banco de preguntas</p>
        </div>

        {/* Global Accuracy Card */}
        <div className="simulation-results__card">
          <p className="simulation-results__label">Acierto Global</p>
          <p className="simulation-results__value">{overallAccuracy}%</p>
          <p className="simulation-results__sub">de respuestas correctas</p>
        </div>

        {/* Weakest Module Card */}
        <div className="simulation-results__card">
          <p className="simulation-results__label">Bloque más débil</p>
          <p className="simulation-results__value text-base leading-tight">
            {metrics.weakestModule ? weakestLabel : "Sin datos"}
          </p>
          <p className="simulation-results__sub">
            {metrics.weakestModule ? "Prioridad para la siguiente práctica" : `${remainingLessonsCount} lecciones pendientes`}
          </p>
        </div>
      </div>
    </section>
  );
}
