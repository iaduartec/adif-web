import Link from "next/link";
import { redirect } from "next/navigation";
import { listOfficialExams } from "../../../lib/content/repository";
import { OfficialSource } from "../../../components/practice/official-source";
import { createServerClient } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function SimulacrosPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const exams = listOfficialExams();
  const examsByYear = new Map<number, Array<(typeof exams)[number]>>();
  for (const exam of exams) {
    const yearExams = examsByYear.get(exam.source.year) ?? [];
    yearExams.push(exam);
    examsByYear.set(exam.source.year, yearExams);
  }

  // Fetch user's past attempts for each simulation
  const { data: attemptRows } = await supabase
    .from("simulation_attempts")
    .select("simulation_id, score, correct_count, incorrect_count, omitted_count, elapsed_ms, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const bestBySimulation = new Map<string, { score: number; attempts: number }>();
  const attemptCounts = new Map<string, number>();

  for (const row of attemptRows ?? []) {
    const count = (attemptCounts.get(row.simulation_id) ?? 0) + 1;
    attemptCounts.set(row.simulation_id, count);

    const existing = bestBySimulation.get(row.simulation_id);
    if (!existing || row.score > existing.score) {
      bestBySimulation.set(row.simulation_id, { score: row.score, attempts: count });
    }
  }

  // Update attempt counts in the best map
  for (const [simId, data] of bestBySimulation.entries()) {
    data.attempts = attemptCounts.get(simId) ?? 0;
  }

  return (
    <div className="dashboard-wide simulacros-page">
      <header className="course-index__header mb-8">
        <p className="course-eyebrow">Archivo ADIF</p>
        <h1>Exámenes oficiales</h1>
        <p>
          Modelos históricos publicados por ADIF. Cada examen conserva sus preguntas, duración y procedencia documental.
        </p>
      </header>

      {[...examsByYear.entries()].sort(([a], [b]) => b - a).map(([year, yearExams]) => (
        <section aria-labelledby={`exam-year-${year}`} className="mb-10" key={year}>
          <h2 className="mb-4 text-2xl font-semibold" id={`exam-year-${year}`}>{year}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {yearExams.map((exam) => {
              const best = bestBySimulation.get(exam.id);
              return (
                <article className="simulation-card" key={exam.id}>
                  <div className="simulation-card__header">
                    <span className="simulation-card__id">Modelo {exam.source.examCode}</span>
                    <h3 className="simulation-card__title">{exam.source.profileName}</h3>
                  </div>
                  <div className="simulation-card__meta">
                    <span>Parte específica</span>
                    <span>{exam.questionIds.length} preguntas</span>
                    <span>{exam.durationMinutes} min</span>
                  </div>
                  <OfficialSource source={exam.source} />
                  {best ? (
                    <div className="simulation-card__best">
                      <p className="simulation-card__score">
                        Mejor: <strong>{best.score}</strong> pts
                      </p>
                      <p className="simulation-card__attempts">
                        {best.attempts} {best.attempts === 1 ? "intento" : "intentos"}
                      </p>
                    </div>
                  ) : (
                    <p className="simulation-card__new">Sin intentar</p>
                  )}
                  <Link className="ui-button self-start" href={`/simulacros/${exam.id}`}>
                    Abrir examen
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
