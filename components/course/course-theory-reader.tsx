import Link from "next/link";
import { lessonSummaries } from "../../content/lesson-summaries";
import { lessonTheories } from "../../content/lesson-theory";
import { officialTexts } from "../../content/official-texts";
import { loadFullText } from "../../lib/content/full-text";
import type { Lesson } from "../../lib/content/schema";
import type { LegalReference, TheoryClaim } from "../../content/theory-types";
import { OriginLabel } from "./origin-label";
import { CourseProgressShell } from "./course-progress-shell";

export type CourseView = "summary" | "theory" | "official";

function viewHref(slug: string, view: CourseView, extras?: Record<string, string>) {
  const params = new URLSearchParams({ view, ...extras });
  return `/curso/${slug}?${params.toString()}`;
}

const verificationStatusLabels: Record<string, string> = {
  draft: "Contenido en borrador — pendiente de cotejo con la fuente oficial antes de la convocatoria.",
  reviewed: "Contenido revisado — verificación final pendiente.",
  verified: "Contenido verificado contra la fuente oficial vigente.",
};

const claimKindLabels: Record<TheoryClaim["kind"], string> = {
  normative: "Norma",
  interpretative: "Explicación",
  didactic: "Consejo de examen",
  example: "Ejemplo",
};

function ClaimWithTraceability({
  claim,
  sources,
}: {
  claim: TheoryClaim;
  sources: LegalReference[];
}) {
  const basis = claim.legalBasis
    .map((id) => sources.find((source) => source.id === id))
    .filter((source): source is LegalReference => Boolean(source));

  return (
    <div
      className="space-y-1"
      data-claim-kind={claim.kind}
      data-legal-reference-ids={claim.legalBasis.join(" ")}
    >
      {claim.kind === "normative" && basis.length > 0 ? (
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {basis.map((source) => (
            <a
              className="text-xs font-bold uppercase tracking-wider text-accent"
              href={source.sourceUrl}
              key={source.id}
              rel="noopener noreferrer"
              target="_blank"
            >
              {claimKindLabels.normative} · {source.sourceId} · {source.locator}
            </a>
          ))}
        </div>
      ) : (
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
          {claimKindLabels[claim.kind]}
        </p>
      )}
      <p className="text-sm text-gray-700 leading-relaxed">{claim.text}</p>
      {claim.kind === "interpretative" && (
        <p className="text-xs italic text-gray-500">
          Esta interpretación resume el efecto práctico del precepto.
        </p>
      )}
      {basis.length > 0 && claim.kind !== "normative" && (
        <details className="text-xs text-gray-500">
          <summary className="cursor-pointer font-bold">Ver fundamento</summary>
          <ul className="mt-1 space-y-1">
            {basis.map((source) => (
              <li key={source.id}>
                <a
                  className="text-accent underline"
                  href={source.sourceUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {source.sourceId} · {source.locator}
                </a>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

export async function CourseTheoryReader({
  lesson,
  progress,
  searchQuery = "",
  showFullDocument = false,
  view = "summary",
}: {
  lesson: Lesson;
  progress: number;
  searchQuery?: string;
  showFullDocument?: boolean;
  view?: CourseView;
}) {
  const officialNorm = officialTexts[lesson.slug];
  const theory = lessonTheories[lesson.slug];
  const summary = lessonSummaries[lesson.slug];
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  const filteredArticles = officialNorm?.articles.filter((article) =>
    !normalizedQuery || [article.number, article.title, article.content]
      .some((value) => value.toLocaleLowerCase().includes(normalizedQuery)),
  ) ?? [];
  const fullText = view === "official" && showFullDocument
    ? await loadFullText(lesson.slug)
    : undefined;

  return (
    <CourseProgressShell
      lesson={{ slug: lesson.slug, title: lesson.title, summary: lesson.summary, origin: lesson.origin }}
      progress={progress}
    >
      <nav aria-label="Vistas del tema" className="flex border-b border-rail mb-8 flex-wrap gap-2">
        {([
          ["summary", "Resumen Ejecutivo"],
          ["theory", "Teoría y Práctica"],
          ["official", "Temario Original"],
        ] as const).map(([targetView, label]) => (
          <Link
            aria-current={view === targetView ? "page" : undefined}
            className={`px-5 py-3 font-bold text-sm border-b-2 -mb-[2px] ${view === targetView ? "border-accent text-accent-strong bg-white" : "border-transparent text-gray-500"}`}
            href={viewHref(lesson.slug, targetView)}
            key={targetView}
          >
            {label}
            {targetView === "official" && officialNorm ? ` · ${officialNorm.articles.length} art.` : ""}
          </Link>
        ))}
      </nav>

      {view === "summary" ? (
        <div className="space-y-8">
          {summary ? (
            <section aria-labelledby="course-summary" className="p-8 bg-white border border-rail space-y-6 shadow-sm">
              <div className="border-b border-rail pb-4">
                <span className="text-xs uppercase font-bold tracking-wider text-accent">Resumen Clave para Oposición</span>
                <p className="text-gray-800 leading-relaxed mt-2 text-base font-medium">{summary.overview}</p>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-ink uppercase tracking-wider">Datos Esenciales de Examen</h3>
                <ul className="grid gap-2.5">
                  {summary.keyFacts.map((fact) => <li className="text-sm text-gray-800 bg-gray-50/80 p-3.5 border border-rail" key={fact}>{fact}</li>)}
                </ul>
              </div>
              <div className="space-y-6 pt-3">
                {summary.sections.map((section) => (
                  <section className="space-y-3 border-t border-rail pt-4" key={section.title}>
                    <h3 className="font-bold text-ink text-sm uppercase tracking-wider">{section.title}</h3>
                    <ul className="space-y-2.5 pl-1">
                      {section.points.map((point) => <li className="text-sm text-gray-700 leading-relaxed" key={point}>{point}</li>)}
                    </ul>
                  </section>
                ))}
              </div>
            </section>
          ) : <p className="empty-state">No hay resumen estructurado disponible para esta lección todavía.</p>}
        </div>
      ) : view === "theory" ? (
        <div className="space-y-8">
          <section aria-labelledby="course-explanation" className="p-8 bg-white border border-rail space-y-6 shadow-sm">
            <div className="border-b border-rail pb-4">
              <span className="text-xs uppercase font-bold tracking-wider text-accent">Explicación y Enfoque Didáctico</span>
              <h2 id="course-explanation" className="text-xl font-bold text-ink mt-1">Teoría y Supuestos de Examen</h2>
            </div>
            {theory ? (
              <>
                <div className="space-y-2">
                  {theory.introduction.map((claim) => (
                    <ClaimWithTraceability claim={claim} key={claim.id} sources={theory.sources} />
                  ))}
                </div>
                <div className="grid gap-4">
                  <h3 className="text-sm font-bold text-ink uppercase tracking-wider">Conceptos Fundamentales</h3>
                  {theory.concepts.map((concept) => (
                    <section className="p-4 border border-rail bg-gray-50/50" key={concept.id}>
                      <h4 className="font-bold text-ink mb-1 text-base">{concept.title}</h4>
                      <div className="space-y-1.5">
                        {concept.claims.map((claim) => (
                          <ClaimWithTraceability claim={claim} key={claim.id} sources={theory.sources} />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-ink uppercase tracking-wider">Supuestos Prácticos Tipo Test</h3>
                  {theory.examples.map((example, index) => (
                    <section className="course-example p-5 bg-paper border border-rail space-y-2" key={example.id}>
                      <h4 className="font-bold text-sm text-accent-strong">Caso Práctico #{index + 1}</h4>
                      <p className="text-sm text-ink italic">&quot;{example.situation}&quot;</p>
                      <div className="pt-2 border-t border-dashed border-rail space-y-1.5">
                        <strong className="text-sm">Aplicación en Examen:</strong>
                        {example.application.map((claim) => (
                          <ClaimWithTraceability claim={claim} key={claim.id} sources={theory.sources} />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>

                <section className="p-5 border border-rail bg-gray-50/70 space-y-3">
                  <h3 className="font-bold text-ink text-sm uppercase tracking-wider">Reglas Nemotécnicas y Tips</h3>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-2 pl-2">
                    {theory.reviewTakeaways.map((takeaway) => (
                      <li className="leading-relaxed" key={takeaway.id}>
                        <ClaimWithTraceability claim={takeaway} sources={theory.sources} />
                      </li>
                    ))}
                  </ul>
                </section>

                {theory.sources && theory.sources.length > 0 && (
                  <section className="p-5 border border-rail bg-gray-50/40 space-y-3">
                    <h3 className="font-bold text-ink text-sm uppercase tracking-wider">Fuentes Registradas</h3>
                    <ul className="space-y-2">
                      {theory.sources.map((source) => (
                        <li className="text-sm text-gray-700" key={source.id}>
                          <strong>{source.sourceId}</strong> — {source.locator}
                          {source.sourceUrl && (
                            <> · <a className="text-accent underline" href={source.sourceUrl} rel="noopener noreferrer" target="_blank">Consultar fuente</a></>
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <p>Parte de los conceptos de la referencia, relaciona cada término con una situación práctica y vuelve a la fuente oficial antes de fijar una literalidad para examen.</p>
                <div className="course-example p-4 bg-paper border border-rail">
                  <h3 className="font-bold text-sm text-accent-strong">Ejemplo de trabajo</h3>
                  <p className="text-sm text-gray-700 mt-1">Resume la idea principal en una frase, localiza su matiz en la norma y anota qué dato cambia si la pregunta plantea una excepción.</p>
                </div>
              </div>
            )}
            <div className="course-warning" role="note">
              <OriginLabel origin={lesson.origin} />
              <p>{verificationStatusLabels[lesson.verification.status] ?? verificationStatusLabels.draft}</p>
            </div>
          </section>
          <section aria-labelledby="course-references" className="p-8 bg-white border border-rail space-y-4">
            <h2 id="course-references" className="text-lg font-bold text-ink">Fuentes oficiales para cotejar</h2>
            <ul className="space-y-2">
              {lesson.officialReferences.map((reference) => (
                <li className="flex justify-between items-center gap-4 py-3 border-b border-rail flex-wrap" key={reference.title}>
                  <span className="font-bold text-sm text-ink">{reference.title}</span>
                  <Link className="ui-button px-3 py-1.5 text-xs" href={viewHref(lesson.slug, "official")}>Consultar temario original →</Link>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="course-errors" className="p-8 bg-white border border-rail space-y-4">
            <h2 id="course-errors" className="text-lg font-bold text-ink">Errores frecuentes en examen</h2>
            <ul className="course-rule-list">
              <li>Memorizar una explicación sin comprobar la formulación exacta de la referencia.</li>
              <li>Confundir una regla general con su condición o excepción.</li>
            </ul>
          </section>
        </div>
      ) : (
        <section aria-labelledby="official-text-title" className="space-y-6">
          <h2 id="official-text-title">Texto Oficial Integrado</h2>
          {officialNorm ? (
            <div className="bg-gray-50 border border-rail p-6 space-y-4">
              <h3 className="text-lg font-bold text-ink">{officialNorm.title}</h3>
              <form action={`/curso/${lesson.slug}`} className="filter-panel" method="GET">
                <input name="view" type="hidden" value="official" />
                <div className="filter-field filter-field--query">
                  <label htmlFor="norm-search">Buscar en la norma</label>
                  <input className="filter-control" defaultValue={searchQuery} id="norm-search" name="query" placeholder="Buscar artículos, títulos o palabras clave..." />
                </div>
                <button className="ui-button" type="submit">Buscar</button>
              </form>

              {showFullDocument ? (
                fullText ? (
                  <section aria-labelledby="full-doc-title" className="bg-white border border-rail p-4">
                    <h3 id="full-doc-title" className="font-bold text-sm text-ink">Documento completo</h3>
                    <pre className="max-h-[60vh] overflow-auto border border-rail bg-white text-sm text-gray-800 leading-relaxed whitespace-pre-wrap p-4 font-mono text-[13px]">{fullText}</pre>
                  </section>
                ) : <p className="empty-state">No hay documento completo integrado para esta lección.</p>
              ) : (
                <Link className="ui-button ui-button--secondary" href={viewHref(lesson.slug, "official", { full: "true" })}>Cargar documento completo</Link>
              )}

              <div className="space-y-4">
                {filteredArticles.length ? filteredArticles.map((article) => (
                  <article className="bg-white p-4 border border-rail border-l-4 border-l-accent space-y-2" key={article.number}>
                    <h3 className="font-bold text-sm text-accent-strong">{article.number}. {article.title}</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{article.content}</p>
                  </article>
                )) : <p className="empty-state">No se encontraron artículos para esta búsqueda.</p>}
              </div>
            </div>
          ) : <p className="empty-state">No hay texto oficial integrado disponible para esta lección.</p>}
        </section>
      )}
    </CourseProgressShell>
  );
}
