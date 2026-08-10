import Link from "next/link";
import { redirect } from "next/navigation";
import { LazyChartWrapper } from "../../../components/dashboard/lazy-chart-wrapper";
import { listQuestions, listLessons } from "../../../lib/content/repository";
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

  const questions = listQuestions();
  const lessons = listLessons();

  const metrics = calculateMetrics(
    questionAttempts ?? [],
    lessonProgress ?? [],
    questions,
    new Date(),
  );

  const moduleNameMap: Record<string, string> = {
    igualdad: "G1 Igualdad",
    "prevencion-riesgos-laborales": "G2 PRL",
    "estatuto-adif": "G3 Estatuto ADIF",
    "ict-rd-346-2011": "E1 ICT RD 346/2011",
    "compatibilidad-electromagnetica": "E2 Compatibilidad electromagnetica",
    "rcf-libro-1": "E3 RCF Libro 1",
    psicometria: "P Psicotecnicos",
    "ingles-a2": "I Ingles A2",
  };

  const rankedLessons = [...lessons]
    .map((lesson) => {
      const moduleLabel = moduleNameMap[lesson.slug] ?? lesson.title;
      const stats = metrics.accuracyByModule[moduleLabel];
      return {
        lesson,
        moduleLabel,
        stats,
        percent: stats ? Math.round(stats.accuracy * 100) : null,
      };
    })
    .sort((left, right) => (left.stats?.accuracy ?? Number.POSITIVE_INFINITY) - (right.stats?.accuracy ?? Number.POSITIVE_INFINITY));

  return (
    <div className="dashboard-wide statistics-page">
      <header className="course-index__header mb-8">
        <p className="course-eyebrow">Progreso & Rendimiento</p>
        <h1>Estadísticas de Estudio</h1>
        <p>
          Analiza tu rendimiento detallado por módulo, tu racha de estudio activo y la evolución de tus respuestas diarias.
        </p>
      </header>

      {/* 7-Day Performance Chart (Dynamically imported client component) */}
      <LazyChartWrapper activity={metrics.sevenDayActivity} />

      {/* Accuracy by Module Section */}
      <section aria-labelledby="accuracy-title" className="border border-rail bg-white p-6 mb-8">
        <h2 id="accuracy-title" className="text-lg font-bold mb-4">Precisión por Temas (Módulos)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-rail text-left text-sm text-gray-700">
            <thead>
              <tr>
                <th className="py-3 font-bold text-xs uppercase tracking-wider text-gray-500">Módulo</th>
                <th className="py-3 font-bold text-xs uppercase tracking-wider text-gray-500 text-center">Precisión</th>
                <th className="py-3 font-bold text-xs uppercase tracking-wider text-gray-500 text-right">Preguntas Intentadas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rail">
              {rankedLessons.map(({ lesson, moduleLabel, stats, percent }, index) => {
                return (
                  <tr key={lesson.slug}>
                    <td className="py-3 font-medium">
                      <Link href={`/curso/${lesson.slug}`} className="hover:underline text-accent-strong">
                        {lesson.title}
                      </Link>
                    </td>
                    <td className="py-3 text-center font-bold">
                      {percent !== null ? (
                        <span className={percent >= 75 ? "text-emerald-700" : percent >= 50 ? "text-amber-600" : "text-rose-600"}>
                          {percent}%
                        </span>
                      ) : (
                        <span className="text-gray-400 font-normal italic">Sin intentos</span>
                      )}
                    </td>
                    <td className="py-3 text-right font-medium text-gray-600">
                      <div className="flex items-center justify-end gap-2">
                        {stats ? stats.total : 0}
                        {index === 0 && stats && (
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                            Prioridad
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Study Plan Goal Call-to-action */}
      <div className="flex gap-4">
        <Link href="/" className="ui-button">
          Volver al Inicio
        </Link>
        <Link href="/tests" className="ui-button">
          Practicar preguntas
        </Link>
      </div>
    </div>
  );
}
