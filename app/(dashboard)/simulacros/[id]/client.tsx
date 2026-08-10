"use client";

import Link from "next/link";
import { useState } from "react";
import { SimulationRunner } from "../../../../components/practice/simulation-runner";
import { SimulationResults } from "../../../../components/practice/simulation-results";
import type { SimulationResult } from "../../../../app/actions/simulations";
import type { LegacyPracticeQuestion } from "../../../../lib/content/repository";
import { Button } from "../../../../components/ui/button";

export function SimulationPageClient({
  simulation,
  questions,
}: {
  simulation: { id: string; title: string };
  questions: LegacyPracticeQuestion[];
}) {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [started, setStarted] = useState(false);

  if (result) {
    return (
      <div className="dashboard-wide">
        <nav aria-label="Migas de pan" className="course-breadcrumb mb-6">
          <Link href="/simulacros">Simulacros</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{simulation.title} — Resultados</span>
        </nav>
        <SimulationResults result={result} questions={questions} />
        <div className="mt-8 flex gap-4">
          <Link href="/simulacros" className="ui-button">
            Volver a simulacros
          </Link>
          <Button onClick={() => { setResult(null); setStarted(false); }}>
            Repetir simulacro
          </Button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="dashboard-wide">
        <nav aria-label="Migas de pan" className="course-breadcrumb mb-6">
          <Link href="/simulacros">Simulacros</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{simulation.title}</span>
        </nav>
        <header className="course-index__header mb-8">
          <p className="course-eyebrow">Simulacro Oficial</p>
          <h1>{simulation.title}</h1>
          <p>
            60 preguntas · 90 minutos · Corrección ADIF (acierto: +1, error: −⅓, omisión: 0).
          </p>
        </header>
        <div className="p-6 border border-rail bg-white max-w-lg">
          <h2 className="text-lg font-bold mb-4">Antes de empezar</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 mb-6">
            <li>Dispondrás de <strong>90 minutos</strong> para completar las 60 preguntas.</li>
            <li>Puedes navegar libremente entre las preguntas antes de entregar.</li>
            <li>Tus respuestas borrador se guardan en tu navegador por si necesitas recargar la página.</li>
            <li>El simulacro se entregará automáticamente cuando el tiempo se agote.</li>
            <li>Solo verás los resultados una vez entregado el simulacro.</li>
          </ul>
          <Button onClick={() => setStarted(true)}>
            Comenzar simulacro
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wide">
      <SimulationRunner
        simulationId={simulation.id}
        questions={questions}
        durationMinutes={90}
        onFinish={setResult}
      />
    </div>
  );
}
