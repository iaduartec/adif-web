import Link from "next/link";
import { redirect } from "next/navigation";
import { LazyChartWrapper } from "../../../components/dashboard/lazy-chart-wrapper";
import { listOfficialQuestions } from "../../../lib/content/repository";
import { calculateMetrics } from "../../../lib/progress/metrics";
import { createServerClient } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function EstadisticasPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch all question attempts
  const { data: questionAttempts } = await supabase
    .from("question_attempts")
    .select("question_id, is_correct, created_at")
    .eq("user_id", user.id);

  // Fetch all lesson progress
  const { data: lessonProgress } = await supabase
    .from("lesson_progress")
    .select("lesson_id, percent, completed, last_activity_at")
    .eq("user_id", user.id);

  const questions = listOfficialQuestions();

  const metrics = calculateMetrics(
    questionAttempts ?? [],
    lessonProgress ?? [],
    questions,
    new Date(),
  );

  const sectionLabels: Record<string, string> = {
    general: "Conocimientos generales",
    english: "Inglés",
    specific: "Conocimiento específico",
  };
  const rankedSections = Object.entries(metrics.accuracyByModule)
    .map(([section, stats]) => ({ section, stats, percent: Math.round(stats.accuracy * 100) }))
    .sort((left, right) => left.stats.accuracy - right.stats.accuracy);
  const coverage = Object.entries(metrics.coverageByExam)
    .map(([id, stats]) => ({ id, ...stats }))
    .sort((left, right) => right.year - left.year || left.examCode.localeCompare(right.examCode));

  return (
    <div className="dashboard-wide statistics-page">
      <header className="page-header">
        <p className="page-kicker">Progreso y rendimiento</p>
        <h1>Estadísticas de estudio</h1>
        <p>
          Analiza tu rendimiento detallado por módulo, tu racha de estudio activo y la evolución de tus respuestas diarias.
        </p>
      </header>

      <LazyChartWrapper activity={metrics.sevenDayActivity} />

      <section aria-labelledby="accuracy-title" className="data-panel">
        <h2 id="accuracy-title">Precisión por sección oficial</h2>
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Sección</th>
                <th>Precisión</th>
                <th>Preguntas intentadas</th>
              </tr>
            </thead>
            <tbody>
              {rankedSections.map(({ section, stats, percent }, index) => {
                return (
                  <tr key={section}>
                    <td>
                      {sectionLabels[section] ?? section}
                    </td>
                    <td>
                      {percent !== null ? (
                        <strong className={percent >= 75 ? "data-value--good" : percent >= 50 ? "data-value--warning" : "data-value--danger"}>
                          {percent}%
                        </strong>
                      ) : (
                        <span>Sin intentos</span>
                      )}
                    </td>
                    <td>
                        {stats.total}
                        {index === 0 && stats && (
                          <span className="data-priority">
                            Prioridad
                          </span>
                        )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="coverage-title" className="data-panel">
        <h2 id="coverage-title">Cobertura por año y modelo oficial</h2>
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Modelo</th>
                <th>Preguntas practicadas</th>
                <th>Cobertura</th>
              </tr>
            </thead>
            <tbody>
              {coverage.map(({ id, attempted, total }) => (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{attempted} de {total}</td>
                  <td><strong>{Math.round((attempted / total) * 100)}%</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="section-actions">
        <Link href="/" className="ui-button ui-button--secondary">
          Volver al inicio
        </Link>
        <Link href="/tests" className="ui-button">
          Practicar preguntas
        </Link>
      </div>
    </div>
  );
}
