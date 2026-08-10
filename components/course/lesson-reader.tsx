"use client";

import { useState, useTransition, useMemo } from "react";
import { saveLessonProgress } from "../../app/actions/lesson";
import type { Lesson, Question } from "../../lib/content/schema";
import { Button } from "../ui/button";
import { OriginLabel } from "./origin-label";
import { officialTexts } from "../../content/official-texts";
import { lessonTheories } from "../../content/lesson-theory";
import { fullTexts } from "../../content/full-texts";
import { lessonSummaries } from "../../content/lesson-summaries";

export function LessonReader({
  lesson,
  questions,
  progress,
}: {
  lesson: Lesson;
  questions: readonly Question[];
  progress: number;
}) {
  const [activeTab, setActiveTab] = useState<"summary" | "theory" | "official">("summary");
  const [searchQuery, setSearchQuery] = useState("");
  const [completionPercent, setCompletionPercent] = useState(progress);
  const [completionMessage, setCompletionMessage] = useState(
    progress === 100 ? "Lección completada" : "",
  );
  const [isPending, startTransition] = useTransition();

  function markComplete() {
    setCompletionMessage("");
    startTransition(async () => {
      try {
        await saveLessonProgress(lesson.slug, 100);
        setCompletionPercent(100);
        setCompletionMessage("Lección completada");
      } catch (error) {
        setCompletionMessage(
          error instanceof Error ? error.message : "No se ha podido completar la lección.",
        );
      }
    });
  }

  // Get official text sections for the current lesson slug
  const officialNorm = officialTexts[lesson.slug];

  // Get the full official document text for the current lesson slug
  const fullText = fullTexts[lesson.slug];

  // Get theory content for the current lesson slug
  const theory = lessonTheories[lesson.slug];

  // Get structured summary content for the current lesson slug
  const summary = lessonSummaries[lesson.slug];

  // Filter articles based on search query
  const filteredArticles = useMemo(() => {
    if (!officialNorm) return [];
    if (!searchQuery.trim()) return officialNorm.articles;
    const query = searchQuery.toLowerCase();
    return officialNorm.articles.filter(
      (art) =>
        art.number.toLowerCase().includes(query) ||
        art.title.toLowerCase().includes(query) ||
        art.content.toLowerCase().includes(query),
    );
  }, [officialNorm, searchQuery]);

  // Search within the full document: keep every line that matches the query
  const fullTextLines = useMemo(() => {
    if (!fullText) return [];
    return fullText.split("\n");
  }, [fullText]);

  const filteredFullLines = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    return fullTextLines
      .map((line, index) => ({ line, index }))
      .filter(({ line }) => line.toLowerCase().includes(query));
  }, [fullTextLines, searchQuery]);

  return (
    <article className="lesson-reader">
      <header className="lesson-reader__header">
        <p className="course-eyebrow">Curso · {completionPercent}% completado</p>
        <div className="course-origin-list">
          <OriginLabel origin={lesson.origin} />
        </div>
        <h1>{lesson.title}</h1>
        <p className="lesson-reader__summary">{lesson.summary}</p>
      </header>

      {/* Tabs navigation */}
      <div className="flex border-b border-rail mb-8 flex-wrap gap-2">
        <button
          className={`px-5 py-3 font-bold text-sm transition-all border-b-2 -mb-[2px] ${
            activeTab === "summary"
              ? "border-accent text-accent-strong bg-white"
              : "border-transparent text-gray-500 hover:text-ink hover:bg-gray-50/50"
          }`}
          onClick={() => setActiveTab("summary")}
          type="button"
        >
          Resumen Ejecutivo
        </button>
        <button
          className={`px-5 py-3 font-bold text-sm transition-all border-b-2 -mb-[2px] ${
            activeTab === "theory"
              ? "border-accent text-accent-strong bg-white"
              : "border-transparent text-gray-500 hover:text-ink hover:bg-gray-50/50"
          }`}
          onClick={() => setActiveTab("theory")}
          type="button"
        >
          Teoría y Práctica
        </button>
        <button
          className={`px-5 py-3 font-bold text-sm transition-all border-b-2 -mb-[2px] flex items-center gap-2 ${
            activeTab === "official"
              ? "border-accent text-accent-strong bg-white"
              : "border-transparent text-gray-500 hover:text-ink hover:bg-gray-50/50"
          }`}
          onClick={() => setActiveTab("official")}
          type="button"
        >
          Temario Original
          {officialNorm && (
            <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-normal">
              {officialNorm.articles.length} art.
            </span>
          )}
        </button>
      </div>

      {activeTab === "summary" ? (
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
                  {summary.keyFacts.map((fact, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-gray-800 bg-gray-50/80 p-3.5 border border-rail">
                      <span className="text-accent font-bold mt-0.5">▪</span>
                      <span className="leading-relaxed">{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6 pt-3">
                {summary.sections.map((sec, index) => (
                  <div key={index} className="space-y-3 border-t border-rail pt-4">
                    <h3 className="font-bold text-ink text-sm uppercase tracking-wider">{sec.title}</h3>
                    <ul className="space-y-2.5 pl-1">
                      {sec.points.map((pt, pIdx) => (
                        <li key={pIdx} className="text-sm text-gray-700 flex items-start gap-2.5 leading-relaxed">
                          <span className="text-accent font-bold select-none">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <div className="p-8 bg-white border border-rail text-gray-500 text-sm">
              No hay resumen estructurado disponible para esta lección todavía.
            </div>
          )}
        </div>
      ) : activeTab === "theory" ? (
        <div className="space-y-8">
          {theory ? (
            <section aria-labelledby="lesson-explanation" className="p-8 bg-white border border-rail space-y-6 shadow-sm">
              <div className="border-b border-rail pb-4">
                <span className="text-xs uppercase font-bold tracking-wider text-accent">Explicación y Enfoque Didáctico</span>
                <h2 id="lesson-explanation" className="text-xl font-bold text-ink mt-1">Teoría y Supuestos de Examen</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-base">{theory.introduction}</p>

              {/* Key Concepts Grid */}
              <div className="grid gap-4 mt-6">
                <h3 className="text-sm font-bold text-ink uppercase tracking-wider">Conceptos Fundamentales</h3>
                {theory.concepts.map((concept, index) => (
                  <div key={index} className="p-4 border border-rail bg-gray-50/50">
                    <h4 className="font-bold text-ink mb-1 text-base">{concept.title}</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{concept.description}</p>
                  </div>
                ))}
              </div>

              {/* Practical Examples */}
              <div className="space-y-4 mt-6">
                <h3 className="text-sm font-bold text-ink uppercase tracking-wider">Supuestos Prácticos Tipo Test</h3>
                {theory.examples.map((ex, index) => (
                  <div key={index} className="lesson-example p-5 bg-paper border border-rail space-y-2">
                    <h4 className="font-bold text-sm text-accent-strong">Caso Práctico #{index + 1}</h4>
                    <p className="text-sm text-ink italic">&quot;{ex.situation}&quot;</p>
                    <div className="pt-2 border-t border-dashed border-rail text-sm text-gray-700">
                      <strong>Aplicación en Examen:</strong> {ex.application}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mnemonic Rules / Key Takeaways */}
              <div className="p-5 border border-rail bg-gray-50/70 space-y-3">
                <h3 className="font-bold text-ink text-sm uppercase tracking-wider">Reglas Nemotécnicas y Tips</h3>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-2 pl-2">
                  {theory.reviewTakeaways.map((takeaway, index) => (
                    <li key={index} className="leading-relaxed">{takeaway}</li>
                  ))}
                </ul>
              </div>

              <div className="lesson-warning" role="note">
                <OriginLabel origin={lesson.verificationNote.origin} />
                <p>{lesson.verificationNote.text}</p>
              </div>
            </section>
          ) : (
            <section aria-labelledby="lesson-explanation" className="p-8 bg-white border border-rail space-y-6">
              <h2 id="lesson-explanation" className="text-xl font-bold text-ink">Explicación para el estudio</h2>
              <p className="text-gray-700 leading-relaxed">
                Parte de los conceptos que aparecen en la referencia, relaciona cada término con una situación práctica y vuelve a la fuente oficial antes de fijar una literalidad para examen.
              </p>
              <div className="lesson-example p-4 bg-paper border border-rail">
                <h3 className="font-bold text-sm text-accent-strong">Ejemplo de trabajo</h3>
                <p className="text-sm text-gray-700 mt-1">
                  Resume la idea principal en una frase, localiza su matiz en la norma y anota qué dato cambia si la pregunta plantea una excepción.
                </p>
              </div>
              <div className="lesson-warning" role="note">
                <OriginLabel origin={lesson.verificationNote.origin} />
                <p>{lesson.verificationNote.text}</p>
              </div>
            </section>
          )}

          {/* Integrated References Section without External Outbound Links */}
          <section aria-labelledby="lesson-references" className="p-8 bg-white border border-rail space-y-4">
            <h2 id="lesson-references" className="text-lg font-bold text-ink">Fuentes oficiales para cotejar (Integrado)</h2>
            <div className="space-y-3">
              <p className="text-xs text-gray-500">
                Consulta los textos completos correspondientes a continuación sin salir de la plataforma de estudio.
              </p>
              <ul className="space-y-2">
                {lesson.officialReferences.map((reference) => (
                  <li key={reference.title} className="flex justify-between items-center gap-4 py-3 border-b border-rail last:border-0 flex-wrap">
                    <span className="font-bold text-sm text-ink">{reference.title}</span>
                    <button
                      onClick={() => {
                        setActiveTab("official");
                        setSearchQuery("");
                      }}
                      className="ui-button px-3 py-1.5 text-xs font-bold"
                      type="button"
                    >
                      Consultar temario original →
                    </button>
                  </li>
                ))}
              </ul>
            </div>
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
        <div className="space-y-6">
          <section aria-labelledby="official-text-title">
            <h2 id="official-text-title" className="sr-only">
              Texto Oficial Integrado
            </h2>
            {officialNorm ? (
              <div className="bg-gray-50 border border-rail p-6 space-y-4">
                <div className="flex justify-between items-start gap-4 flex-wrap">
                  <div>
                    <h3 className="text-lg font-bold text-ink mb-1">{officialNorm.title}</h3>
                    <p className="text-xs text-gray-500">
                      Fuente original de estudio integrada para consulta literal rápida.
                    </p>
                  </div>
                </div>

                {/* Real-time search filter */}
                <div className="pt-2">
                  <label className="sr-only" htmlFor="norm-search">
                    Buscar en la norma
                  </label>
                  <input
                    className="w-full p-3 border border-rail text-sm bg-white placeholder-gray-400 focus:outline-none focus:border-accent"
                    id="norm-search"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar artículos, títulos o palabras clave en el texto oficial..."
                    type="text"
                    value={searchQuery}
                  />
                </div>

                {fullText ? (
                  <div className="space-y-4 pt-2">
                    <section aria-labelledby="full-doc-title" className="bg-white border border-rail p-4">
                      <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                        <h4 id="full-doc-title" className="font-bold text-sm text-ink">
                          Documento completo
                        </h4>
                        <span className="text-xs text-gray-500">
                          {filteredFullLines ? `${filteredFullLines.length} coincidencias` : `${fullTextLines.length} líneas`}
                        </span>
                      </div>
                      <div className="max-h-[60vh] overflow-auto border border-rail bg-white text-sm text-gray-800 leading-relaxed whitespace-pre-wrap p-4 font-mono text-[13px]">
                        {filteredFullLines
                          ? filteredFullLines.map(({ line, index }) => (
                              <div key={index} className="flex gap-3">
                                <span className="text-gray-400 select-none shrink-0 w-10 text-right">{index + 1}</span>
                                <span>{line}</span>
                              </div>
                            ))
                          : fullTextLines.map((line, index) => (
                              <div key={index} className="flex gap-3">
                                <span className="text-gray-400 select-none shrink-0 w-10 text-right">{index + 1}</span>
                                <span>{line}</span>
                              </div>
                            ))}
                      </div>
                    </section>
                  </div>
                ) : null}

                <div className="space-y-4 pt-2">
                  {filteredArticles.length > 0 ? (
                    filteredArticles.map((art) => (
                      <div
                        className="bg-white p-4 border border-rail border-l-4 border-l-accent space-y-2"
                        key={art.number}
                      >
                        <h4 className="font-bold text-sm text-accent-strong">
                          {art.number}. {art.title}
                        </h4>
                        <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                          {art.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 text-sm border border-dashed border-rail bg-white">
                      No se encontraron artículos que coincidan con la búsqueda &quot;{searchQuery}&quot;.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">No hay texto oficial integrado disponible para esta lección.</p>
            )}
          </section>
        </div>
      )}

      {/* Shared bottom panels */}
      <div className="mt-8 pt-8 border-t border-rail space-y-8">
        <section aria-labelledby="lesson-questions">
          <h2 id="lesson-questions">Preguntas relacionadas</h2>
          {questions.length ? (
            <ol className="related-questions">
              {questions.map((question) => (
                <li key={question.id}>
                  <p>{question.prompt}</p>
                  <OriginLabel origin={question.origin} />
                </li>
              ))}
            </ol>
          ) : (
            <p>No hay preguntas relacionadas disponibles todavía.</p>
          )}
        </section>

        <section className="lesson-completion" aria-labelledby="lesson-completion-title">
          <div>
            <p className="course-eyebrow">Cierre de la lección</p>
            <h2 id="lesson-completion-title">Marca la lección cuando hayas terminado el repaso</h2>
          </div>
          <Button disabled={isPending || completionPercent === 100} onClick={markComplete}>
            {completionPercent === 100
              ? "Lección completada"
              : isPending
              ? "Guardando…"
              : "Marcar como completada"}
          </Button>
          {completionMessage && (
            <p
              aria-live="polite"
              className={
                completionMessage === "Lección completada"
                  ? "course-status"
                  : "course-status course-status--error"
              }
              role="status"
            >
              {completionMessage}
            </p>
          )}
        </section>
      </div>
    </article>
  );
}
