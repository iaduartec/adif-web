import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerClient } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

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
        <div className="p-6 border border-rail bg-white" role="note">
          <h2 className="font-bold text-ink text-lg mb-2">
            Práctica oficial no disponible
          </h2>
          <p className="text-sm text-gray-600">
            No hay preguntas oficiales públicas disponibles: los cuadernillos psicométricos privados están excluidos.
          </p>
        </div>
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
          href="/simulacros"
        >
          Consultar exámenes oficiales publicados
        </Link>
      </div>
    </section>
  );
}
