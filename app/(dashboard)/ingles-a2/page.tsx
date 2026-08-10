import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerClient } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

const grammarTopics = [
  { title: "Present Perfect vs Past Simple", hint: "'I have visited' (sin tiempo) vs 'I visited yesterday' (tiempo acabado)." },
  { title: "Comparatives & Superlatives", hint: "Short adj: -er / -est. Long adj: more / the most." },
  { title: "Modal verbs: must / have to / should", hint: "Must = obligación interna. Have to = obligación externa. Should = consejo." },
  { title: "Conditionals (Zero & First)", hint: "Zero: If + present, present (hechos). First: If + present, will + inf (futuro probable)." },
  { title: "Prepositions of time & place", hint: "In (meses/años), On (días/fechas), At (horas/lugares concretos)." },
  { title: "Quantifiers", hint: "Some (afirmativas), Any (negativas/interrogativas), Much/Many, A lot of, Few/Little." },
];

export default async function InglesA2Page() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <section className="course-index" aria-labelledby="english-title">
      <header className="course-index__header">
        <p className="course-eyebrow">Módulo especializado</p>
        <h1 id="english-title">Inglés A2</h1>
        <p>
          Preparación de vocabulario, gramática y comprensión lectora para la prueba de idioma
          correspondiente al nivel A2 del Marco Común Europeo de Referencia.
        </p>
      </header>

      {/* Actions */}
      <div className="grid gap-4 md:grid-cols-2 mb-10">
        <Link
          className="p-6 border border-rail bg-white hover:border-accent transition-colors group"
          href="/curso/ingles-a2"
        >
          <h2 className="font-bold text-ink text-lg mb-2 group-hover:text-accent-strong transition-colors">
            📖 Estudiar Teoría y Vocabulario
          </h2>
          <p className="text-sm text-gray-600">
            Lee la guía completa de gramática A2, expresiones frecuentes, vocabulario ferroviario y técnicas de comprensión lectora.
          </p>
        </Link>
        <div className="p-6 border border-rail bg-white" role="note">
          <h2 className="font-bold text-ink text-lg mb-2">
            Práctica oficial no disponible
          </h2>
          <p className="text-sm text-gray-600">
            No hay preguntas oficiales públicas disponibles para una sesión independiente de Inglés A2.
          </p>
        </div>
      </div>

      {/* Grammar Quick Reference */}
      <section aria-labelledby="grammar-ref">
        <h2 id="grammar-ref" className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
          Referencia Rápida de Gramática A2
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {grammarTopics.map((topic) => (
            <div key={topic.title} className="p-5 border border-rail bg-white">
              <h3 className="font-bold text-ink mb-1">{topic.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-mono">{topic.hint}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick access to full bank */}
      <div className="mt-10 pt-6 border-t border-rail flex justify-center">
        <Link
          className="ui-button bg-transparent border border-accent text-accent-strong hover:bg-accent-strong hover:text-paper font-bold px-8"
          href="/simulacros"
        >
          Consultar exámenes oficiales publicados
        </Link>
      </div>
    </section>
  );
}
