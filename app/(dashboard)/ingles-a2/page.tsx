import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerClient } from "../../../lib/supabase/server";
import { getEnglishCurriculum, englishAttemptCauseOptions } from "../../../lib/content/english-a2-curriculum";
import { listOriginalPracticeQuestions } from "../../../lib/content/original-practice-repository";
import { toPublicPracticeQuestion } from "../../../lib/content/original-practice-public-dto";

export const dynamic = "force-dynamic";

const areaLabels = {
  grammar: "Gramática", vocabulary: "Vocabulario", signs: "Carteles y avisos",
  messages: "Mensajes y correos", situations: "Situaciones cotidianas", reading: "Comprensión lectora",
};

export default async function InglesA2Page() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const curriculum = getEnglishCurriculum();
  const questions = listOriginalPracticeQuestions({ domain: "english-a2", status: "reviewed" })
    .map(toPublicPracticeQuestion).filter((question) => question !== null);

  return (
    <section className="course-index" aria-labelledby="english-title">
      <header className="course-index__header">
        <p className="course-eyebrow">Preparación de idioma</p>
        <h1 id="english-title">Inglés A2</h1>
        <p>Gramática funcional, vocabulario cotidiano y lectura de textos breves.</p>
        <p>El progreso de inglés A2 se estudia por separado del progreso del temario oficial PNI26/01.</p>
      </header>

      <Link className="ui-button" href="/curso/ingles-a2">Estudiar teoría y vocabulario</Link>
      <p className="mt-4" role="note">No hay preguntas oficiales públicas disponibles para una sesión independiente de Inglés A2.</p>

      <section className="mt-8" aria-labelledby="a2-curriculum">
        <h2 id="a2-curriculum">Currículo A2</h2>
        <p>Programa didáctico de práctica. Los temas no expresan una frecuencia histórica de aparición en ADIF.</p>
        <div className="grid gap-4 md:grid-cols-2 mt-4">
          {curriculum.topics.map((topic) => (
            <article className="p-5 border border-rail bg-white" key={topic.id}>
              <p className="text-sm text-gray-600">{areaLabels[topic.area]}</p>
              <h3 className="font-bold text-ink">{topic.title}</h3>
              {topic.id === "railway-vocabulary" && <p>Vocabulario complementario</p>}
              <Link href={`/curso/ingles-a2?view=theory#concept-${topic.activeConceptIds[0]}`}>Repasar el concepto</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8" aria-labelledby="a2-original-practice">
        <h2 id="a2-original-practice">Preguntas originales por tema</h2>
        <p>Abre un tema y razona la respuesta. Puedes consultar su concepto en la guía de teoría.</p>
        <div className="grid gap-4 md:grid-cols-2 mt-4">
          {questions.map((question) => (
            <details className="p-5 border border-rail bg-white" key={question.id}>
              <summary className="font-bold text-ink cursor-pointer">{question.topic}</summary>
              <p className="text-sm mt-3">PRÁCTICA A2 ORIGINAL</p>
              <p className="mt-2">{question.prompt}</p>
              <ul className="mt-3 space-y-2" aria-label="Opciones">
                {question.options.map((option) => <li key={option.key}>{option.key}. {option.text}</li>)}
              </ul>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-8" aria-labelledby="a2-errors">
        <h2 id="a2-errors">Entender el error</h2>
        <p>Distingue el conocimiento evaluado —gramática, vocabulario, lectura, carteles o contexto— de la causa del fallo.</p>
        <p>Causas que puedes identificar al repasar: {englishAttemptCauseOptions.map(({ label }) => label).join(" o ")}.</p>
      </section>

      <div className="mt-10 pt-6 border-t border-rail">
        <Link href="/simulacros">Consultar exámenes oficiales publicados</Link>
      </div>
    </section>
  );
}
