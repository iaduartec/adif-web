import Link from "next/link";
import { redirect } from "next/navigation";
import { FavoriteButton } from "../../../components/practice/favorite-button";
import { listQuestions } from "../../../lib/content/repository";
import { deriveErrorNotebook } from "../../../lib/practice/error-notebook";
import { calculateMetrics, displayModuleName, lessonSlugForModule } from "../../../lib/progress/metrics";
import { createServerClient } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

const moduleToSlug: Record<string, string> = {
  "G1 Igualdad": "igualdad",
  "G2 PRL": "prevencion-riesgos-laborales",
  "G3 Estatuto ADIF": "estatuto-adif",
  "E1 ICT RD 346/2011": "ict-rd-346-2011",
  "E2 Compatibilidad electromagnetica": "compatibilidad-electromagnetica",
  "E3 RCF Libro 1": "rcf-libro-1",
  "P Psicotecnicos": "psicometria",
  "I Ingles A2": "ingles-a2",
};

export default async function ErrorNotebookPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch all user attempts chronologically
  const { data: attemptRows } = await supabase
    .from("question_attempts")
    .select("question_id, selected_answer, is_correct, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const latestAttempts = new Map<string, { selected_answer: string; is_correct: boolean }>();
  for (const attempt of attemptRows ?? []) {
    latestAttempts.set(attempt.question_id, {
      selected_answer: attempt.selected_answer,
      is_correct: attempt.is_correct,
    });
  }

  // Fetch favorites
  const { data: favRows } = await supabase
    .from("favorites")
    .select("item_id")
    .eq("user_id", user.id)
    .eq("item_type", "question");
  const favoriteIds = new Set((favRows ?? []).map((r) => r.item_id));

  const allQuestions = listQuestions();
  const errorQuestions = deriveErrorNotebook(allQuestions, attemptRows ?? []);
  const metrics = calculateMetrics(attemptRows ?? [], [], allQuestions, new Date());
  const weakestModuleSlug = lessonSlugForModule(metrics.weakestModule);
  const weakestModuleLabel = displayModuleName(metrics.weakestModule);

  return (
    <div className="dashboard-wide errors-page">
      <header className="course-index__header mb-8">
        <p className="course-eyebrow">Repaso Focalizado</p>
        <h1>Cuaderno de Errores</h1>
        <p>
          Repasa y practica las preguntas que has fallado en tus intentos más recientes.
          {metrics.weakestModule && (
            <span className="block mt-1 text-sm text-gray-600">
              Bloque más débil detectado: <strong>{weakestModuleLabel}</strong>.
            </span>
          )}
        </p>
      </header>

      {/* Limitation / Documentation */}
      <div className="p-4 bg-gray-50 border border-rail text-xs text-gray-600 mb-8 max-w-4xl">
        <h2 className="font-bold text-ink uppercase tracking-wider mb-2">Funcionamiento del Cuaderno</h2>
        <p className="mb-2">
          • <strong>Estado Pendiente:</strong> Preguntas cuyo último intento registrado es incorrecto (aparecen listadas a continuación).
        </p>
        <p className="mb-2">
          • <strong>Estado Dominado:</strong> Preguntas anteriormente falladas que has vuelto a responder correctamente (se archivan y desaparecen de esta lista automáticamente).
        </p>
        <p>
          <em>* Nota: El estado se deriva dinámicamente de tu historial de respuestas reales. No se persiste ningún estado artificial en el servidor.</em>
        </p>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <p className="text-sm text-gray-600">
            Tienes <strong>{errorQuestions.length}</strong> preguntas pendientes de corrección.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {errorQuestions.length > 0 && (
            <Link
              className="ui-button px-6 font-bold"
              href="/tests?status=failed&practice=true"
            >
              Practicar errores en sesión ({Math.min(errorQuestions.length, 50)})
            </Link>
          )}
          {weakestModuleSlug && (
            <Link
              className="ui-button bg-transparent border border-accent text-accent-strong hover:bg-accent-strong hover:text-paper px-6 font-bold"
              href={`/tests?module=${encodeURIComponent(metrics.weakestModule ?? "")}&practice=true`}
            >
              Practicar bloque más débil
            </Link>
          )}
        </div>
      </div>

      {errorQuestions.length === 0 ? (
        <div className="py-12 text-center text-gray-500 border border-dashed border-rail bg-white" role="status">
          <p className="font-medium text-lg text-accent-strong mb-1">¡Todo al día!</p>
          <p className="text-sm mb-4">
            No tienes preguntas pendientes de corregir. El siguiente paso recomendado es volver al bloque más débil o cerrar una vuelta con un simulacro.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {weakestModuleSlug ? (
              <Link
                className="ui-button"
                href={`/tests?module=${encodeURIComponent(metrics.weakestModule ?? "")}&practice=true`}
              >
                Repasar {weakestModuleLabel}
              </Link>
            ) : null}
            <Link className="ui-button bg-transparent border border-accent text-accent-strong hover:bg-accent-strong hover:text-paper" href="/simulacros">
              Ir a simulacros
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {errorQuestions.map((q) => {
            const isFav = favoriteIds.has(q.id);
            const latest = latestAttempts.get(q.id);
            const lessonSlug = moduleToSlug[q.module];

            return (
              <div
                className="p-6 border border-rail bg-white flex justify-between gap-4 border-l-4 border-l-red-500"
                key={q.id}
              >
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-bold text-sm text-accent-strong">{q.id}</span>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                      {q.module}
                    </span>
                    {lessonSlug && (
                      <Link
                        className="text-xs text-accent-strong hover:underline font-medium"
                        href={`/curso/${lessonSlug}`}
                      >
                        Ir a la lección
                      </Link>
                    )}
                    <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded font-semibold">
                      Pendiente
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-ink mb-4">{q.prompt}</h3>
                  <div className="grid md:grid-cols-2 gap-2 pl-4 border-l border-rail mb-4">
                    {q.options.map((opt) => (
                      <div className="text-sm text-gray-700" key={opt.key}>
                        <strong>{opt.key}.</strong> {opt.text}
                      </div>
                    ))}
                  </div>

                  {latest && (
                    <div className="p-3 bg-red-50/50 border border-red-100 text-sm mb-4">
                      <p className="text-red-800">
                        <strong>Tu última respuesta:</strong> {latest.selected_answer}
                      </p>
                      <p className="text-green-800 mt-1">
                        <strong>Respuesta correcta:</strong> {q.answer}
                      </p>
                    </div>
                  )}

                  <div className="p-3 bg-gray-50 border border-rail text-sm">
                    <p className="text-gray-700 font-medium">Explicación:</p>
                    <p className="text-gray-600 mt-1">{q.explanation}</p>
                    <p className="text-xs text-gray-500 mt-2 font-mono">Procedencia: {q.sourceNote}</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <FavoriteButton initialIsFavorite={isFav} questionId={q.id} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
