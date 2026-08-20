import Link from "next/link";
import { redirect } from "next/navigation";
import { ReviewSession } from "../../../components/reviews/review-session";
import {
  loadReviewBacklog,
  parsePlannedConceptSelection,
} from "../../../lib/adaptive/review-session";
import { createServerClient } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ReviewsPage({
  searchParams = Promise.resolve({}),
}: {
  searchParams?: Promise<{ concepts?: string | string[] }>;
}) {
  const params = await searchParams;
  const supabase = await createServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/login");
    return null;
  }

  const backlog = await loadReviewBacklog(supabase, user.id);
  const byId = new Map(backlog.map((concept) => [concept.id, concept]));
  const selection = parsePlannedConceptSelection(params.concepts, new Set(byId.keys()));

  if (selection.kind === "invalid") {
    return (
      <div className="dashboard-reading review-page">
        <section aria-labelledby="invalid-review-title" className="empty-state" role="alert">
          <p className="page-kicker">Repaso dirigido</p>
          <h1 id="invalid-review-title">No se puede iniciar este repaso</h1>
          <p>La selección planificada ya no coincide con tus conceptos activos pendientes.</p>
          <Link className="ui-button" href="/repasos">Abrir todos los repasos pendientes</Link>
        </section>
      </div>
    );
  }

  const concepts = selection.kind === "valid"
    ? selection.ids.map((conceptId) => byId.get(conceptId)!)
    : backlog;

  return (
    <div className="dashboard-reading review-page">
      <header className="page-header">
        <p className="page-kicker">Memoria a largo plazo</p>
        <h1>Repasos pendientes</h1>
        <p>Recupera cada idea antes de consultar la respuesta auditada y valora cuánto te ha costado recordarla.</p>
      </header>
      {concepts.length > 0 ? (
        <ReviewSession concepts={concepts} />
      ) : (
        <section className="empty-state" role="status">
          <p className="empty-state__title">No tienes repasos pendientes</p>
          <p>No hay conceptos activos vencidos o en riesgo en este momento.</p>
          <Link className="ui-button" href="/">Volver a tu preparación</Link>
        </section>
      )}
    </div>
  );
}
