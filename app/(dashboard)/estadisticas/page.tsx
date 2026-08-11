import Link from "next/link";
import { redirect } from "next/navigation";
import { LazyChartWrapper } from "../../../components/dashboard/lazy-chart-wrapper";
import { ReadinessStatistics } from "../../../components/dashboard/readiness-statistics";
import { calculateReadiness } from "../../../lib/adaptive/readiness";
import { assembleReadinessInput } from "../../../lib/adaptive/readiness-server";
import { listOfficialQuestions } from "../../../lib/content/repository";
import { calculateMetrics } from "../../../lib/progress/metrics";
import { createServerClient } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function EstadisticasPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const now = new Date();
  const readinessInput = await assembleReadinessInput(supabase, user.id, now);
  const snapshot = calculateReadiness(readinessInput);
  const questions = listOfficialQuestions();
  const metrics = calculateMetrics(
    readinessInput.questionAttempts.map((attempt) => ({
      question_id: attempt.questionId,
      is_correct: attempt.isCorrect,
      created_at: attempt.createdAt,
    })),
    readinessInput.lessonActivity.map((activity) => ({
      lesson_id: activity.lessonId,
      percent: 0,
      completed: false,
      last_activity_at: activity.occurredAt,
    })),
    questions,
    now,
  );

  const sectionLabels: Record<string, string> = {
    general: "Conocimientos generales",
    english: "Inglés",
    specific: "Conocimiento específico",
  };
  const rankedSections = Object.entries(metrics.accuracyByModule)
    .map(([section, stats]) => ({ section, stats, percentage: Math.round(stats.accuracy * 100) }))
    .sort((left, right) => left.stats.accuracy - right.stats.accuracy);
  const coverage = Object.entries(metrics.coverageByExam)
    .map(([id, stats]) => ({ id, ...stats }))
    .sort((left, right) => right.year - left.year || left.examCode.localeCompare(right.examCode));

  return (
    <div className="dashboard-wide statistics-page">
      <header className="page-header">
        <p className="page-kicker">Progreso y rendimiento</p>
        <h1>Estadísticas de estudio</h1>
        <p>Compara la actividad reciente con todo tu historial activo y localiza conceptos y lecciones que necesitan refuerzo.</p>
      </header>

      <ReadinessStatistics snapshot={snapshot} />
      <LazyChartWrapper activity={metrics.sevenDayActivity} />

      <section aria-labelledby="accuracy-title" className="data-panel">
        <h2 id="accuracy-title">Precisión por sección oficial</h2>
        {rankedSections.length > 0 ? (
          <div className="data-table-wrap">
            <table aria-label="Precisión por sección oficial" className="data-table">
              <thead><tr><th>Sección</th><th>Precisión</th><th>Preguntas intentadas</th></tr></thead>
              <tbody>
                {rankedSections.map(({ section, stats, percentage }, index) => (
                  <tr key={section}>
                    <td>{sectionLabels[section] ?? section}</td>
                    <td><strong className={percentage >= 75 ? "data-value--good" : percentage >= 50 ? "data-value--warning" : "data-value--danger"}>{percentage}%</strong></td>
                    <td>{stats.total}{index === 0 && <span className="data-priority">Prioridad</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="empty-state">Todavía no hay respuestas activas para comparar por sección.</p>}
      </section>

      <section aria-labelledby="coverage-title" className="data-panel">
        <h2 id="coverage-title">Cobertura por año y modelo oficial</h2>
        <div className="data-table-wrap">
          <table aria-label="Cobertura por año y modelo oficial" className="data-table">
            <thead><tr><th>Modelo</th><th>Preguntas practicadas</th><th>Cobertura</th></tr></thead>
            <tbody>
              {coverage.map(({ id, attempted, total }) => (
                <tr key={id}><td>{id}</td><td>{attempted} de {total}</td><td><strong>{total > 0 ? Math.round((attempted / total) * 100) : 0}%</strong></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="section-actions">
        <Link href="/" className="ui-button ui-button--secondary">Volver a preparación</Link>
        <Link href="/tests" className="ui-button">Practicar preguntas</Link>
      </div>
    </div>
  );
}
