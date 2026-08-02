import Link from "next/link";
import { redirect } from "next/navigation";
import { listQuestions } from "../../../lib/content/repository";
import { createServerClient } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

const MODULE_KEY = "I Ingles A2";

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

  const allQuestions = listQuestions();
  const moduleQuestions = allQuestions.filter((q) => q.module === MODULE_KEY);

  const { data: attemptRows } = await supabase
    .from("question_attempts")
    .select("question_id, is_correct")
    .eq("user_id", user.id);

  const attemptedIds = new Set((attemptRows ?? []).map((r) => r.question_id));
  const answeredInModule = moduleQuestions.filter((q) => attemptedIds.has(q.id)).length;
  const correctInModule = (attemptRows ?? []).filter(
    (r) => r.is_correct && moduleQuestions.some((q) => q.id === r.question_id),
  ).length;
  const accuracy = answeredInModule > 0 ? Math.round((correctInModule / answeredInModule) * 100) : null;

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

      {/* Stats summary */}
      <div className="grid gap-4 md:grid-cols-3 mb-10">
        <div className="p-5 border border-rail bg-white">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Preguntas disponibles</p>
          <p className="text-3xl font-bold text-accent-strong">{moduleQuestions.length}</p>
        </div>
        <div className="p-5 border border-rail bg-white">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Respondidas</p>
          <p className="text-3xl font-bold text-ink">{answeredInModule}</p>
        </div>
        <div className="p-5 border border-rail bg-white">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Precisión</p>
          <p className="text-3xl font-bold text-ink">{accuracy !== null ? `${accuracy}%` : "—"}</p>
        </div>
      </div>

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
        <Link
          className="p-6 border border-rail bg-white hover:border-accent transition-colors group"
          href={`/tests?module=${encodeURIComponent(MODULE_KEY)}&practice=true`}
        >
          <h2 className="font-bold text-ink text-lg mb-2 group-hover:text-accent-strong transition-colors">
            🧪 Iniciar Práctica de Inglés A2
          </h2>
          <p className="text-sm text-gray-600">
            Practica preguntas de gramática, vocabulario y reading comprehension con corrección inmediata.
          </p>
        </Link>
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
          href={`/tests?module=${encodeURIComponent(MODULE_KEY)}`}
        >
          Explorar banco completo ({moduleQuestions.length} preguntas)
        </Link>
      </div>
    </section>
  );
}
