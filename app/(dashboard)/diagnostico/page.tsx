import { OriginalPracticeSession } from "../../../components/practice/original-practice-session";
import { toPublicPracticeQuestion } from "../../../lib/content/original-practice-public-dto";
import { listOriginalPracticeQuestions } from "../../../lib/content/original-practice-repository";
import {
  ORIGINAL_DIAGNOSTIC_QUESTION_COUNT,
  selectBalancedOriginalDiagnosticQuestions,
} from "../../../lib/onboarding-diagnostic";

export const dynamic = "force-dynamic";

export default function DiagnosticPage() {
  const eligibleQuestions = listOriginalPracticeQuestions({ status: "reviewed" })
    .map(toPublicPracticeQuestion)
    .filter((question) => question !== null);
  const questions = selectBalancedOriginalDiagnosticQuestions(
    eligibleQuestions,
    ORIGINAL_DIAGNOSTIC_QUESTION_COUNT,
  );

  return (
    <section className="dashboard-wide space-y-6" aria-labelledby="diagnostic-title">
      <header className="page-header">
        <p className="page-kicker">Línea de base personal</p>
        <h1 id="diagnostic-title">Diagnóstico inicial</h1>
        <p>
          Este es un diagnóstico formativo de preguntas originales, no equivalente a un examen oficial.
          Reparte 15 preguntas entre conocimientos generales, telecomunicaciones, inglés y psicotécnicos.
        </p>
      </header>

      {questions.length < ORIGINAL_DIAGNOSTIC_QUESTION_COUNT ? (
        <section className="empty-state" role="status" aria-labelledby="diagnostic-unavailable-title">
          <h2 id="diagnostic-unavailable-title">Diagnóstico no disponible todavía</h2>
          <p>
            Hay {questions.length} preguntas originales elegibles; se necesitan {ORIGINAL_DIAGNOSTIC_QUESTION_COUNT} para iniciar este diagnóstico.
            No se añadirán preguntas oficiales históricas para completar el conjunto.
          </p>
        </section>
      ) : (
        <section aria-labelledby="diagnostic-session-title" className="quiet-panel">
          <h2 id="diagnostic-session-title">15 preguntas originales</h2>
          <p className="mb-5 text-sm text-gray-600">
            Responde las 15 preguntas y entrega el bloque para guardar tus resultados y ver las explicaciones.
          </p>
          <OriginalPracticeSession
            questions={questions}
            title="Diagnóstico inicial"
            preset={{
              mode: "practice",
              questionCount: ORIGINAL_DIAGNOSTIC_QUESTION_COUNT,
              autoStart: true,
              hideConfiguration: true,
            }}
          />
        </section>
      )}
    </section>
  );
}
