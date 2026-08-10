import Link from "next/link";
import { redirect } from "next/navigation";
import { FavoriteButton } from "../../../components/practice/favorite-button";
import { listOfficialQuestions } from "../../../lib/content/repository";
import { deriveErrorNotebook } from "../../../lib/practice/error-notebook";
import { calculateMetrics, displayModuleName } from "../../../lib/progress/metrics";
import { createServerClient } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

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

  const allQuestions = listOfficialQuestions();
  const errorQuestions = deriveErrorNotebook(allQuestions, attemptRows ?? []);
  const metrics = calculateMetrics(attemptRows ?? [], [], allQuestions, new Date());
  const weakestModuleLabel = displayModuleName(metrics.weakestModule);

  return (
    <div className="dashboard-wide errors-page">
      <header className="page-header">
        <p className="page-kicker">Repaso focalizado</p>
        <h1>Cuaderno de errores</h1>
        <p>
          Repasa y practica las preguntas que has fallado en tus intentos más recientes.
          {metrics.weakestModule && (
            <span>
              Bloque más débil detectado: <strong>{weakestModuleLabel}</strong>.
            </span>
          )}
        </p>
      </header>

      <section aria-labelledby="notebook-guide-title" className="quiet-panel notebook-guide">
        <h2 id="notebook-guide-title">Funcionamiento del cuaderno</h2>
        <ul>
          <li><strong>Estado pendiente:</strong> preguntas cuyo último intento registrado es incorrecto; aparecen listadas a continuación.</li>
          <li><strong>Estado dominado:</strong> preguntas anteriormente falladas que has vuelto a responder correctamente; se archivan y desaparecen de esta lista automáticamente.</li>
        </ul>
        <p>
          <em>El estado se deriva dinámicamente de tu historial de respuestas reales. Los intentos de preguntas retiradas se conservan, pero no se muestran porque ya no pertenecen al banco oficial activo.</em>
        </p>
      </section>

      <div className="metadata-row question-index-summary">
        <div>
          <p>
            Tienes <strong>{errorQuestions.length}</strong> preguntas pendientes de corrección.
          </p>
        </div>
        <div className="section-actions">
          {errorQuestions.length > 0 && (
            <Link
              className="ui-button"
              href="/tests?status=failed&practice=true"
            >
              Practicar errores en sesión ({Math.min(errorQuestions.length, 50)})
            </Link>
          )}
        </div>
      </div>

      {errorQuestions.length === 0 ? (
        <div className="empty-state" role="status">
          <p className="empty-state__title">Todo al día</p>
          <p>
            No tienes preguntas oficiales pendientes de corregir. Los intentos históricos de preguntas retiradas siguen guardados, pero no alteran este cuaderno.
          </p>
          <div className="section-actions">
            <Link className="ui-button ui-button--secondary" href="/simulacros">
              Ir a exámenes oficiales
            </Link>
          </div>
        </div>
      ) : (
        <div className="official-question-list">
          {errorQuestions.map((q) => {
            const isFav = favoriteIds.has(q.id);
            const latest = latestAttempts.get(q.id);
            return (
              <article
                className="official-question-card official-question-card--failed"
                key={q.id}
              >
                <div className="official-question-card__content">
                  <div className="metadata-row">
                    <strong>{q.id}</strong>
                    <span className="status-tag">
                      {q.sectionLabel}
                    </span>
                    <span className="status-tag status-tag--danger">
                      Pendiente
                    </span>
                  </div>
                  <h3>{q.prompt}</h3>
                  <div className="official-question-options">
                    {q.options.map((opt) => (
                      <div key={opt.key}>
                        <strong>{opt.key}.</strong> {opt.text}
                      </div>
                    ))}
                  </div>
                  <p className="official-question-options-note">Las opciones están disponibles en la sesión de repaso.</p>

                  {latest && (
                    <div className="answer-correction">
                      <p>
                        <strong>Tu última respuesta:</strong> {latest.selected_answer}
                      </p>
                      <p>
                        <strong>Respuesta correcta:</strong> {q.answer}
                      </p>
                    </div>
                  )}

                  <aside aria-label="Procedencia oficial" className="official-source">
                    <strong>Procedencia oficial</strong>
                    <span>
                      {q.source.profileName} · modelo {q.source.year}/{q.source.examCode} · cuadernillo, página {q.source.bookletPage}.
                    </span>
                    <a href={q.source.documentUrl} rel="noreferrer" target="_blank">
                      Consultar cuadernillo oficial de ADIF
                    </a>
                  </aside>
                </div>
                <div className="flex-shrink-0">
                  <FavoriteButton initialIsFavorite={isFav} questionId={q.id} />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
