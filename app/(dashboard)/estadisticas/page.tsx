import Link from "next/link";
import { redirect } from "next/navigation";
import { LazyChartWrapper } from "../../../components/dashboard/lazy-chart-wrapper";
import { AnalyticsUnavailable } from "../../../components/dashboard/analytics-unavailable";
import { ReadinessStatistics } from "../../../components/dashboard/readiness-statistics";
import { calculateReadiness } from "../../../lib/adaptive/readiness";
import { assembleReadinessInput, ReadinessUnavailableError } from "../../../lib/adaptive/readiness-server";
import { listOfficialQuestions } from "../../../lib/content/repository";
import { listOriginalPracticeQuestions } from "../../../lib/content/original-practice-repository";
import { toPublicPracticeQuestion } from "../../../lib/content/original-practice-public-dto";
import { calculateOriginalProgress } from "../../../lib/progress/original-progress";
import { calculateMetrics } from "../../../lib/progress/metrics";
import { createServerClient } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function EstadisticasPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const now = new Date();
  let readinessInput;
  try {
    readinessInput = await assembleReadinessInput(supabase, user.id, now);
  } catch (error) {
    if (error instanceof ReadinessUnavailableError) {
      return <AnalyticsUnavailable retryHref="/estadisticas" />;
    }
    throw error;
  }
  const snapshot = calculateReadiness(readinessInput);
  const originalProgress = calculateOriginalProgress(
    listOriginalPracticeQuestions({ status: "reviewed" })
      .map(toPublicPracticeQuestion)
      .filter((question) => question !== null),
    readinessInput.questionAttempts,
  );
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
  const originalLabels: Record<string, string> = {
    "general-knowledge": "Conocimientos generales",
    telecom: "Telecomunicaciones",
    "english-a2": "Inglés A2",
    psychometric: "Psicotécnicos",
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

      <section aria-labelledby="original-progress-title" className="data-panel">
        <h2 id="original-progress-title">Práctica de preguntas originales</h2>
        <p>Intentos registrados, incluidos los repetidos. La precisión no mide dominio ni probabilidad de aprobar.</p>
        <ul aria-label="Progreso móvil por materia de preguntas originales" className="grid gap-3 md:hidden">
          {originalProgress.map((item) => (
            <li className="border border-rail p-4" key={item.domain}>
              <h3 className="font-bold">{originalLabels[item.domain] ?? item.domain}</h3>
              <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                <dt>Precisión</dt><dd>{item.attempts ? `${Math.round(item.correct * 100 / item.attempts)}% (${item.correct}/${item.attempts})` : "Sin intentos"}</dd>
                <dt>Intentos</dt><dd>{item.attempts}</dd>
                <dt>Preguntas distintas</dt><dd>{item.attemptedQuestions} de {item.totalQuestions} revisadas</dd>
                <dt>Tiempo registrado</dt><dd>{item.attempts ? `${Math.round(item.elapsedMs / 60000)} min` : "—"}</dd>
                <dt>Última práctica</dt><dd>{item.latestAt ? new Intl.DateTimeFormat("es-ES", { timeZone: "Europe/Madrid", dateStyle: "medium" }).format(new Date(item.latestAt)) : "—"}</dd>
              </dl>
            </li>
          ))}
        </ul>
        <div className="data-table-wrap hidden md:block">
          <table aria-label="Progreso por materia de preguntas originales" className="data-table">
            <thead><tr><th>Materia</th><th>Precisión</th><th>Intentos</th><th>Preguntas distintas</th><th>Tiempo registrado</th><th>Última práctica</th></tr></thead>
            <tbody>
              {originalProgress.map((item) => (
                <tr key={item.domain}>
                  <td>{originalLabels[item.domain] ?? item.domain}</td>
                  <td>{item.attempts ? `${Math.round(item.correct * 100 / item.attempts)}% (${item.correct}/${item.attempts})` : "Sin intentos"}</td>
                  <td>{item.attempts}</td>
                  <td>{item.attemptedQuestions} de {item.totalQuestions} revisadas</td>
                  <td>{item.attempts ? `${Math.round(item.elapsedMs / 60000)} min` : "—"}</td>
                  <td>{item.latestAt ? new Intl.DateTimeFormat("es-ES", { timeZone: "Europe/Madrid", dateStyle: "medium" }).format(new Date(item.latestAt)) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

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
