"use client";

import Link from "next/link";
import { useState } from "react";
import { SimulationRunner } from "../../../../components/practice/simulation-runner";
import { SimulationResults } from "../../../../components/practice/simulation-results";
import type { SimulationResult } from "../../../../app/actions/simulations";
import type { OfficialExamQuestion } from "../../../../lib/content/repository";
import type { OfficialExam } from "../../../../lib/content/schema";
import { Button } from "../../../../components/ui/button";
import { OfficialSource } from "../../../../components/practice/official-source";

export function SimulationPageClient({
  exam,
  questions,
}: {
  exam: OfficialExam;
  questions: OfficialExamQuestion[];
}) {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [started, setStarted] = useState(false);

  if (result) {
    return (
      <div className="dashboard-wide">
        <nav aria-label="Migas de pan" className="course-breadcrumb mb-6">
          <Link href="/simulacros">Exámenes oficiales</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{exam.title} — Resultados</span>
        </nav>
        <SimulationResults result={result} questions={questions} />
        <div className="mt-8 flex gap-4">
          <Link href="/simulacros" className="ui-button">
            Volver a exámenes oficiales
          </Link>
          <Button onClick={() => { setResult(null); setStarted(false); }}>
            Repetir examen
          </Button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="dashboard-wide">
        <nav aria-label="Migas de pan" className="course-breadcrumb mb-6">
          <Link href="/simulacros">Exámenes oficiales</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{exam.title}</span>
        </nav>
        <header className="course-index__header mb-8">
          <p className="course-eyebrow">Examen oficial ADIF</p>
          <h1>{exam.title}</h1>
          <p>
            {exam.source.year} · {exam.source.call} · {exam.source.profileCode} · modelo {exam.source.examCode} · Parte específica
            <br />
            {exam.questionIds.length} preguntas · {exam.durationMinutes} minutos · Corrección ADIF (acierto: +1, error: −⅓, omisión: 0).
          </p>
          <OfficialSource source={exam.source} variant="exam" />
        </header>
        <div className="p-6 border border-rail bg-white max-w-lg">
          <h2 className="text-lg font-bold mb-4">Antes de empezar</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 mb-6">
            <li>Dispondrás de <strong>{exam.durationMinutes} minutos</strong> para completar las {exam.questionIds.length} preguntas.</li>
            <li>Puedes navegar libremente entre las preguntas antes de entregar.</li>
            <li>Tus respuestas borrador se guardan en tu navegador por si necesitas recargar la página.</li>
            <li>El examen se entregará automáticamente cuando el tiempo se agote.</li>
            <li>Solo verás los resultados una vez entregado el examen.</li>
          </ul>
          <Button onClick={() => setStarted(true)}>
            Comenzar examen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wide">
      <SimulationRunner
        examId={exam.id}
        questions={questions}
        durationMinutes={exam.durationMinutes}
        onFinish={setResult}
      />
    </div>
  );
}
