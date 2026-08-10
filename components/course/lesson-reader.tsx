import Link from "next/link";
import { lessonSummaries } from "../../content/lesson-summaries";
import { lessonTheories } from "../../content/lesson-theory";
import { officialTexts } from "../../content/official-texts";
import { loadFullText } from "../../lib/content/full-text";
import type { Lesson } from "../../lib/content/schema";
import { OriginLabel } from "./origin-label";
import { LessonProgressShell } from "./lesson-progress-shell";

export type LessonView = "summary" | "theory" | "official";

function viewHref(slug: string, view: LessonView, extras?: Record<string, string>) {
  const params = new URLSearchParams({ view, ...extras });
  return `/curso/${slug}?${params.toString()}`;
}

export async function LessonReader({
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
  view?: LessonView;
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
    <LessonProgressShell
      lesson={{ slug: lesson.slug, title: lesson.title, summary: lesson.summary, origin: lesson.origin }}
      progress={progress}
    >
      <nav aria-label="Vistas de la lección" className="flex border-b border-rail mb-8 flex-wrap gap-2">
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
            <section aria-labelledby="lesson-summary" className="p-8 bg-white border border-rail space-y-6 shadow-sm">
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
          <section aria-labelledby="lesson-explanation" className="p-8 bg-white border border-rail space-y-6 shadow-sm">
            <div className="border-b border-rail pb-4">
              <span className="text-xs uppercase font-bold tracking-wider text-accent">Explicación y Enfoque Didáctico</span>
              <h2 id="lesson-explanation" className="text-xl font-bold text-ink mt-1">Teoría y Supuestos de Examen</h2>
            </div>
            {theory ? (
              <>
                <p className="text-gray-700 leading-relaxed text-base">{theory.introduction}</p>
                <div className="grid gap-4">
                  <h3 className="text-sm font-bold text-ink uppercase tracking-wider">Conceptos Fundamentales</h3>
                  {theory.concepts.map((concept) => (
                    <section className="p-4 border border-rail bg-gray-50/50" key={concept.title}>
                      <h4 className="font-bold text-ink mb-1 text-base">{concept.title}</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{concept.description}</p>
                    </section>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-ink uppercase tracking-wider">Supuestos Prácticos Tipo Test</h3>
                  {theory.examples.map((example, index) => (
                    <section className="lesson-example p-5 bg-paper border border-rail space-y-2" key={example.situation}>
                      <h4 className="font-bold text-sm text-accent-strong">Caso Práctico #{index + 1}</h4>
                      <p className="text-sm text-ink italic">&quot;{example.situation}&quot;</p>
                      <p className="pt-2 border-t border-dashed border-rail text-sm text-gray-700">
                        <strong>Aplicación en Examen:</strong> {example.application}
                      </p>
                    </section>
                  ))}
                </div>

                <section className="p-5 border border-rail bg-gray-50/70 space-y-3">
                  <h3 className="font-bold text-ink text-sm uppercase tracking-wider">Reglas Nemotécnicas y Tips</h3>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-2 pl-2">
                    {theory.reviewTakeaways.map((takeaway) => (
                      <li className="leading-relaxed" key={takeaway}>{takeaway}</li>
                    ))}
                  </ul>
                </section>
              </>
            ) : (
              <div className="space-y-4">
                <p>Parte de los conceptos de la referencia, relaciona cada término con una situación práctica y vuelve a la fuente oficial antes de fijar una literalidad para examen.</p>
                <div className="lesson-example p-4 bg-paper border border-rail">
                  <h3 className="font-bold text-sm text-accent-strong">Ejemplo de trabajo</h3>
                  <p className="text-sm text-gray-700 mt-1">Resume la idea principal en una frase, localiza su matiz en la norma y anota qué dato cambia si la pregunta plantea una excepción.</p>
                </div>
              </div>
            )}
            <div className="lesson-warning" role="note"><OriginLabel origin={lesson.verificationNote.origin} /><p>{lesson.verificationNote.text}</p></div>
          </section>
          <section aria-labelledby="lesson-references" className="p-8 bg-white border border-rail space-y-4">
            <h2 id="lesson-references" className="text-lg font-bold text-ink">Fuentes oficiales para cotejar</h2>
            <ul className="space-y-2">
              {lesson.officialReferences.map((reference) => (
                <li className="flex justify-between items-center gap-4 py-3 border-b border-rail flex-wrap" key={reference.title}>
                  <span className="font-bold text-sm text-ink">{reference.title}</span>
                  <Link className="ui-button px-3 py-1.5 text-xs" href={viewHref(lesson.slug, "official")}>Consultar temario original →</Link>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="lesson-errors" className="p-8 bg-white border border-rail space-y-4">
            <h2 id="lesson-errors" className="text-lg font-bold text-ink">Errores frecuentes en examen</h2>
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
    </LessonProgressShell>
  );
}
