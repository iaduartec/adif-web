import Link from "next/link";
import { redirect } from "next/navigation";
import { listOfficialExams } from "../../../lib/content/repository";
import { listOfficialExamCatalog } from "../../../lib/content/official-exam-catalog";
import { createServerClient } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function SimulacrosPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const playableExamIds = new Set(listOfficialExams().map((exam) => exam.id));
  const catalog = listOfficialExamCatalog();
  const examsByYear = new Map<number, Array<(typeof catalog)[number]>>();
  for (const form of catalog) {
    const yearExams = examsByYear.get(form.year) ?? [];
    yearExams.push(form);
    examsByYear.set(form.year, yearExams);
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
      <header className="page-header">
        <p className="page-kicker">Archivo ADIF</p>
        <h1>Exámenes oficiales</h1>
        <p>
          Consulta los formularios históricos y sus documentos. La práctica se habilita cuando la fuente, la vigencia y los derechos de uso están verificados.
        </p>
      </header>

      {[...examsByYear.entries()].sort(([a], [b]) => b - a).map(([year, yearExams]) => (
        <section aria-labelledby={`exam-year-${year}`} className="simulation-year" key={year}>
          <h2 id={`exam-year-${year}`}>{year}</h2>
          <div className="simulation-grid">
            {yearExams.map((form) => {
              const playable = playableExamIds.has(form.id);
              const best = bestBySimulation.get(form.id);
              return (
                <article className="simulation-card" key={form.id}>
                  <div className="simulation-card__header">
                    <span className="simulation-card__id">Formulario {form.examCode}</span>
                    <h3 className="simulation-card__title">{form.profileName}</h3>
                  </div>
                  <div className="simulation-card__meta">
                    <span>{form.call} · {form.profileCode}</span>
                    <span>{form.expectedQuestionNumbers.length} preguntas declaradas, incluidas reservas</span>
                    <span>{form.durationMinutes} min históricos</span>
                  </div>
                  {form.session && (
                    <p className="simulation-card__new">
                      Sesión: {form.session.date}{form.session.location ? ` · ${form.session.location}` : ""}
                    </p>
                  )}
                  <div className="simulation-card__meta">
                    <span>Fuente: {form.documentSourceStatus === "verified" ? "verificada" : "pendiente de verificación"}</span>
                    <span>{playable ? "Texto disponible para práctica" : "Texto retenido"}</span>
                    <span>
                      {form.transcriptionStatus === "metadata_only"
                        ? "Registro de metadatos"
                        : form.transcriptionStatus === "partial" ? "Transcripción parcial" : "Transcripción registrada"}
                    </span>
                  </div>
                  <a href={form.documentUrl} rel="noreferrer" target="_blank">
                    Consultar documento ADIF
                  </a>
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
                  {playable ? (
                    <Link className="ui-button self-start" href={`/simulacros/${form.id}`}>
                      Abrir examen
                    </Link>
                  ) : (
                    <span aria-disabled="true" className="ui-button ui-button--secondary self-start">
                      Pendiente de verificación
                    </span>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
