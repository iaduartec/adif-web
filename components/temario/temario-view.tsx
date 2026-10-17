import Link from "next/link";
import { lessonSummaries } from "../../content/lesson-summaries";
import { lessonTheories } from "../../content/lesson-theory";
import { lessons } from "../../content/lessons";
import { officialItems, type SyllabusItem, type SyllabusNode } from "../../content/syllabus";
import {
  frequencyLevel,
  frequencyLevelLabels,
  getConceptFrequency,
  getExamFrequency,
} from "../../lib/content/exam-frequency";

/**
 * Full-width study view over the whole official PNI26/01 syllabus.
 *
 * Deliberately not the three per-lesson tabs (Resumen Ejecutivo / Teoría y
 * Práctica / Temario Original): this reads as one continuous document so a
 * candidate can go through every scope without switching views.
 *
 * Exam recurrence shown here is measured from the official question bank, so it
 * only exists for the specific scope. The common scope says so explicitly rather
 * than rendering a misleading zero.
 */

type Scope = "common" | "specific-26-12po";

const scopeLabels: Record<Scope, { title: string; hint: string }> = {
  common: {
    title: "Conocimiento Común",
    hint: "Documentos comunes a todas las familias de la convocatoria.",
  },
  "specific-26-12po": {
    title: "Conocimiento Específico · 26/12PO",
    hint: "Documentos específicos del perfil de Telecomunicaciones.",
  },
};

const nodeStatusLabels: Record<SyllabusNode["status"], { label: string; tone: string }> = {
  covered: { label: "Cubierto", tone: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  partial: { label: "Parcial", tone: "bg-amber-50 text-amber-800 border-amber-200" },
  missing: { label: "Sin cubrir", tone: "bg-rose-50 text-rose-800 border-rose-200" },
  "reference-only": { label: "Referencia", tone: "bg-gray-50 text-gray-700 border-gray-200" },
  unresolved: { label: "Sin resolver", tone: "bg-gray-50 text-gray-700 border-gray-200" },
};

/**
 * Fallback module slug for syllabus items whose nodes carry no `linkedModules`.
 *
 * The CEM nodes are legitimately unlinked in the manifest (the theory does not
 * trace to the article yet) but a curated study module does exist for it, so the
 * study view would otherwise drop the document entirely. Explicit rather than
 * inferred, so a missing link stays visible in the manifest instead of being
 * silently papered over.
 */
const moduleFallbackByItem: Record<string, string> = {
  "syllabus-compatibilidad-electromagnetica": "compatibilidad-electromagnetica",
};

const scopeOrder: Scope[] = ["common", "specific-26-12po"];

function anchorFor(item: SyllabusItem): string {
  return `doc-${item.id}`;
}

/** Module slug backing a syllabus item, or `undefined` when none is curated. */
function moduleSlugFor(item: SyllabusItem): string | undefined {
  const linked = item.children.flatMap((node) => node.linkedModules);
  return linked[0] ?? moduleFallbackByItem[item.id];
}

function jumpHref(item: SyllabusItem): string {
  return `#${anchorFor(item)}`;
}

function ExamRecurrenceBadge({ conceptId }: { conceptId: string }) {
  const frequency = getConceptFrequency(conceptId);
  if (!frequency) return null;

  const level = frequencyLevel(frequency.questionCount);
  const toneByLevel = {
    none: "bg-gray-50 text-gray-600 border-gray-200",
    low: "bg-sky-50 text-sky-800 border-sky-200",
    medium: "bg-amber-50 text-amber-900 border-amber-200",
    high: "bg-rose-50 text-rose-900 border-rose-200",
  } as const;

  const callSummary = frequency.calls.map((entry) => `${entry.call} (${entry.questionCount})`).join(", ");

  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${toneByLevel[level]}`}
      data-concept-id={conceptId}
      data-frequency-level={level}
    >
      {frequencyLevelLabels[level]} · {frequency.questionCount} {frequency.questionCount === 1 ? "vez" : "veces"}
      <span className="sr-only"> en {callSummary}</span>
    </span>
  );
}

function NodeRow({ node }: { node: SyllabusNode }) {
  const status = nodeStatusLabels[node.status];
  const examCount = getExamFrequency().bySyllabusNode[node.id] ?? 0;

  return (
    <li className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-rail py-2.5 last:border-b-0">
      <span
        className={`shrink-0 border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${status.tone}`}
        data-node-status={node.status}
      >
        {status.label}
      </span>
      <span className="min-w-0 flex-1 text-sm font-medium text-ink">{node.title}</span>
      {examCount > 0 && (
        <span className="shrink-0 text-[11px] font-bold uppercase tracking-wide text-rose-800">
          {examCount} {examCount === 1 ? "pregunta oficial" : "preguntas oficiales"}
        </span>
      )}
    </li>
  );
}

function DocumentSection({ item }: { item: SyllabusItem }) {
  const slug = moduleSlugFor(item);
  const summary = slug ? lessonSummaries[slug] : undefined;
  const theory = slug ? lessonTheories[slug] : undefined;
  const scope = item.scope;
  const primaryReference = slug
    ? lessons.find((lesson) => lesson.slug === slug)?.officialReferences[0]
    : undefined;

  return (
    <article
      aria-labelledby={anchorFor(item)}
      className="space-y-6 scroll-mt-24 border border-rail bg-white p-6 shadow-sm md:p-8"
      id={anchorFor(item)}
      data-syllabus-item={item.id}
      data-scope={scope}
    >
      <header className="space-y-2 border-b border-rail pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="border border-accent bg-accent/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-accent-strong">
            {scopeLabels[scope].title}
          </span>
          <span className="text-xs font-medium text-gray-500">
            {item.children.length} {item.children.length === 1 ? "unidad" : "unidades"} · {item.sourceId}
          </span>
        </div>
        <h2 className="text-xl font-bold leading-snug text-ink md:text-2xl">{item.title}</h2>
        {primaryReference && (
          <a
            className="inline-flex items-center gap-1 text-sm font-semibold text-accent underline underline-offset-2"
            href={primaryReference.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            Fuente oficial · {primaryReference.title}
          </a>
        )}
      </header>

      {summary && (
        <section aria-label={`Lo esencial de ${item.title}`} className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-accent-strong">Lo esencial</h3>
          <p className="max-w-4xl text-[15px] leading-relaxed text-gray-800">{summary.overview}</p>
          {summary.keyFacts.length > 0 && (
            <ol className="space-y-2">
              {summary.keyFacts.map((fact, index) => (
                <li className="flex gap-3 bg-paper p-3 text-[15px] leading-relaxed text-gray-800" key={fact}>
                  <span aria-hidden="true" className="shrink-0 font-mono text-xs font-bold text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{fact}</span>
                </li>
              ))}
            </ol>
          )}
        </section>
      )}

      {theory && theory.concepts.length > 0 && (
        <section aria-label={`Conceptos clave de ${item.title}`} className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-accent-strong">Conceptos clave</h3>
          <p className="text-xs text-gray-500">
            Cada concepto indica cuántas veces ha aparecido en las preguntas oficiales transcritas cuando existe
            histórico verificado.
          </p>
          <ul className="space-y-2">
            {theory.concepts.map((concept) => (
              <li className="flex flex-wrap items-center gap-x-3 gap-y-1 border border-rail bg-gray-50/60 px-4 py-3" key={concept.id}>
                <span className="min-w-0 flex-1 text-sm font-semibold text-ink">{concept.title}</span>
                <ExamRecurrenceBadge conceptId={concept.id} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {item.children.length > 0 && (
        <section aria-label={`Unidades de ${item.title}`} className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-accent-strong">
            Unidades del temario y su cobertura
          </h3>
          <ul className="space-y-0">
            {item.children.map((node) => (
              <NodeRow node={node} key={node.id} />
            ))}
          </ul>
        </section>
      )}

      {slug && (
        <p className="text-sm">
          <Link className="font-semibold text-accent underline underline-offset-2" href={`/curso/${slug}?view=theory`}>
            Ir al módulo de estudio completo →
          </Link>
        </p>
      )}
    </article>
  );
}

export function TemarioView() {
  const report = getExamFrequency();
  const scoped = scopeOrder.map((scope) => ({
    scope,
    items: officialItems.filter((item) => item.scope === scope),
  }));

  return (
    <div className="space-y-8">
      <header className="space-y-3 border-b border-rail pb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">PNI26/01 · Itinerario 26/12PO</p>
        <h1 className="text-3xl font-bold leading-tight text-ink md:text-4xl">Temario oficial completo</h1>
        <p className="max-w-4xl text-base leading-relaxed text-gray-700">
          Los {officialItems.length} documentos que ADIF publica para la convocatoria, condensados en una sola lectura.
          Cada documento resume lo esencial, sus conceptos clave y en qué unidades se divide.
        </p>
        <dl className="flex flex-wrap gap-x-8 gap-y-3 pt-1">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-gray-500">Documentos</dt>
            <dd className="text-2xl font-bold text-ink">{officialItems.length}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-gray-500">Unidades</dt>
            <dd className="text-2xl font-bold text-ink">
              {officialItems.reduce((total, item) => total + item.children.length, 0)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-gray-500">Convocatorias analizadas</dt>
            <dd className="text-2xl font-bold text-ink">{report.calls.length}</dd>
          </div>
        </dl>
      </header>

      <nav aria-label="Índice del temario" className="sticky top-0 z-10 -mx-1 bg-white/95 py-3 backdrop-blur">
        <ul className="flex flex-wrap gap-2">
          {scoped.flatMap(({ items }) =>
            items.map((item) => (
              <li key={item.id}>
                <a
                  className="inline-block border border-rail bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-accent hover:text-accent-strong"
                  href={jumpHref(item)}
                >
                  {item.title.length > 52 ? `${item.title.slice(0, 52).trimEnd()}…` : item.title}
                </a>
              </li>
            )),
          )}
        </ul>
      </nav>

      {scoped.map(({ scope, items }) => (
        <section aria-labelledby={`scope-${scope}`} className="space-y-5" key={scope}>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-ink" id={`scope-${scope}`}>
              {scopeLabels[scope].title}
            </h2>
            <p className="max-w-3xl text-sm text-gray-600">{scopeLabels[scope].hint}</p>
          </div>

          {scope === "specific-26-12po" && (
            <p className="border-l-4 border-accent bg-paper px-4 py-3 text-sm leading-relaxed text-gray-700">
              <strong className="font-bold text-ink">Frecuencia en examen:</strong> basada en las{" "}
              {report.totalQuestions} preguntas oficiales transcritas de {report.calls.length} convocatorias (
              {report.calls.map((entry) => entry.call).join(", ")}). Se marca en cada concepto cuántas veces ha salido.
              Es un conteo medido, no una predicción.
            </p>
          )}

          {scope === "common" && (
            <p className="border-l-4 border-gray-300 bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-700">
              <strong className="font-bold text-ink">Frecuencia en examen:</strong> no hay histórico de preguntas
              oficiales transcritas para el bloque común en este repositorio, así que aquí no se marca. No se interpreta
              como «nunca ha salido»: el banco oficial cubre únicamente el conocimiento específico.
            </p>
          )}

          <div className="space-y-6">
            {items.map((item) => (
              <DocumentSection item={item} key={item.id} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
