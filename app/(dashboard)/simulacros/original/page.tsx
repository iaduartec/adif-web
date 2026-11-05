import Link from "next/link";
import { redirect } from "next/navigation";
import { originalSimulationCatalog } from "../../../../lib/content/original-simulation-catalog";
import { listOriginalPracticeQuestions } from "../../../../lib/content/original-practice-repository";
import { createServerClient } from "../../../../lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function OriginalSimulationsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="dashboard-wide">
      <nav aria-label="Migas de pan" className="course-breadcrumb mb-6">
        <Link href="/simulacros">Simulacros</Link><span aria-hidden="true">/</span><span aria-current="page">Práctica original</span>
      </nav>
      <header className="page-header">
        <p className="page-kicker">Banco de elaboración propia</p>
        <h1>Simulacros originales</h1>
        <p>Cada recorrido usa una vez cada pregunta original revisada que está disponible en esa modalidad. No reutiliza preguntas históricas retenidas.</p>
      </header>
      <div className="simulation-grid">
        {originalSimulationCatalog.map((simulation) => {
          const count = listOriginalPracticeQuestions({ domain: simulation.domain, status: "reviewed" }).length;
          return <article className="simulation-card" key={simulation.domain}>
            <div className="simulation-card__header"><h2 className="simulation-card__title">{simulation.title}</h2></div>
            <p>{simulation.description}</p>
            <p className="simulation-card__meta"><strong>{count} preguntas originales revisadas disponibles</strong></p>
            {count > 0 ? <Link className="ui-button self-start" href={`/simulacros/original/${simulation.domain}`}>Elegir y comenzar</Link> : <p role="status">No hay preguntas suficientes para iniciar este simulacro.</p>}
          </article>;
        })}
      </div>
      <p className="mt-6" role="note">Los tiempos y porcentajes de estos recorridos son orientativos. No aplican penalizaciones ni notas oficiales.</p>
    </div>
  );
}
