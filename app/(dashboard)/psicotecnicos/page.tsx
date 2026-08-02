import Link from "next/link";
import { redirect } from "next/navigation";
import { listQuestions } from "../../../lib/content/repository";
import { createServerClient } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

const MODULE_KEY = "P Psicotecnicos";

const tips = [
  {
    title: "Gestión del tiempo",
    text: "No inviertas más de 30 segundos por pregunta. Si no ves la solución rápido, márcala y sigue adelante.",
  },
  {
    title: "Series numéricas",
    text: "Calcula las diferencias entre elementos consecutivos. Si no es constante, prueba las diferencias de las diferencias (segunda derivada).",
  },
  {
    title: "Razonamiento espacial",
    text: "Rota mentalmente la figura en pasos de 90°. Fíjate primero en un elemento asimétrico para descartar opciones rápidamente.",
  },
  {
    title: "Atención y concentración",
    text: "Avanza de forma lineal, sin saltar filas. La velocidad importa, pero un error de patrón resta más que una omisión.",
  },
];

export default async function PsicotecnicosPage() {
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
    <section className="course-index" aria-labelledby="psico-title">
      <header className="course-index__header">
        <p className="course-eyebrow">Módulo especializado</p>
        <h1 id="psico-title">Psicotécnicos</h1>
        <p>
          Entrenamiento de aptitudes intelectuales, razonamiento lógico, aptitud verbal y numérica,
          y concentración para las pruebas de selección de ADIF.
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
          href="/curso/psicometria"
        >
          <h2 className="font-bold text-ink text-lg mb-2 group-hover:text-accent-strong transition-colors">
            📖 Estudiar Teoría y Estrategias
          </h2>
          <p className="text-sm text-gray-600">
            Lee la guía completa de psicometría con consejos de resolución, ejemplos comentados y técnicas de examen.
          </p>
        </Link>
        <Link
          className="p-6 border border-rail bg-white hover:border-accent transition-colors group"
          href={`/tests?module=${encodeURIComponent(MODULE_KEY)}&practice=true`}
        >
          <h2 className="font-bold text-ink text-lg mb-2 group-hover:text-accent-strong transition-colors">
            🧪 Iniciar Práctica de Psicotécnicos
          </h2>
          <p className="text-sm text-gray-600">
            Practica con preguntas de razonamiento, series, aptitud verbal y numérica con corrección inmediata.
          </p>
        </Link>
      </div>

      {/* Tips */}
      <section aria-labelledby="psico-tips">
        <h2 id="psico-tips" className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
          Consejos de Resolución
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {tips.map((tip) => (
            <div key={tip.title} className="p-5 border border-rail bg-white">
              <h3 className="font-bold text-ink mb-1">{tip.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{tip.text}</p>
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
