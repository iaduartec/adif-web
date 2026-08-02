import Link from "next/link";
import { redirect } from "next/navigation";
import { listSimulations } from "../../../lib/content/repository";
import { createServerClient } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function SimulacrosPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const simulations = listSimulations();

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
        <p className="course-eyebrow">Simulacros Oficiales</p>
        <h1>Simulacros de Examen</h1>
        <p>
          30 simulacros de 60 preguntas con corrección tipo oposición ADIF: aciertos suman 1 punto, errores restan ⅓ y las omitidas no puntúan. Tiempo límite: 90 minutos.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {simulations.map((sim) => {
          const best = bestBySimulation.get(sim.id);
          return (
            <Link
              className="simulation-card"
              href={`/simulacros/${sim.id}`}
              key={sim.id}
            >
              <div className="simulation-card__header">
                <span className="simulation-card__id">{sim.id}</span>
                <h3 className="simulation-card__title">{sim.title}</h3>
              </div>
              <div className="simulation-card__meta">
                <span>60 preguntas</span>
                <span>90 min</span>
              </div>
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
            </Link>
          );
        })}
      </div>
    </div>
  );
}
