"use client";

import { useState, useTransition } from "react";
import { saveLessonProgress } from "../../app/actions/lesson";
import type { Lesson, Question } from "../../lib/content/schema";
import { Button } from "../ui/button";
import { OriginLabel } from "./origin-label";

export function LessonReader({ lesson, questions, progress }: { lesson: Lesson; questions: readonly Question[]; progress: number }) {
  const [completionMessage, setCompletionMessage] = useState(progress === 100 ? "Lección completada" : "");
  const [isPending, startTransition] = useTransition();

  function markComplete() {
    setCompletionMessage("");
    startTransition(async () => {
      try {
        await saveLessonProgress(lesson.slug, 100);
        setCompletionMessage("Lección completada");
      } catch (error) {
        setCompletionMessage(error instanceof Error ? error.message : "No se ha podido completar la lección.");
      }
    });
  }

  return (
    <article className="lesson-reader">
      <header className="lesson-reader__header">
        <p className="course-eyebrow">Curso · {progress}% completado</p>
        <div className="course-origin-list"><OriginLabel origin={lesson.origin} /></div>
        <h1>{lesson.title}</h1>
        <p className="lesson-reader__summary">{lesson.summary}</p>
      </header>

      <section aria-labelledby="lesson-explanation">
        <h2 id="lesson-explanation">Explicación para el estudio</h2>
        <p>Parte de los conceptos que aparecen en la referencia, relaciona cada término con una situación práctica y vuelve a la fuente oficial antes de fijar una literalidad para examen.</p>
        <div className="lesson-example">
          <h3>Ejemplo de trabajo</h3>
          <p>Resume la idea principal en una frase, localiza su matiz en la norma y anota qué dato cambia si la pregunta plantea una excepción.</p>
        </div>
        <div className="lesson-warning" role="note">
          <OriginLabel origin={lesson.verificationNote.origin} />
          <p>{lesson.verificationNote.text}</p>
        </div>
      </section>

      <section aria-labelledby="lesson-references">
        <h2 id="lesson-references">Fuentes oficiales para cotejar</h2>
        <ul className="course-rule-list">
          {lesson.officialReferences.map((reference) => (
            <li key={reference.title}>
              <a href={`https://www.boe.es/buscar/?q=${encodeURIComponent(reference.title)}`} rel="noreferrer" target="_blank">{reference.title}</a>
              <OriginLabel origin={reference.origin} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="lesson-errors">
        <h2 id="lesson-errors">Errores frecuentes</h2>
        <ul className="course-rule-list">
          <li>Memorizar una explicación sin comprobar la formulación exacta de la referencia.</li>
          <li>Confundir una regla general con su condición o excepción.</li>
        </ul>
      </section>

      <section aria-labelledby="lesson-questions">
        <h2 id="lesson-questions">Preguntas relacionadas</h2>
        {questions.length ? (
          <ol className="related-questions">
            {questions.map((question) => <li key={question.id}><p>{question.prompt}</p><OriginLabel origin={question.origin} /></li>)}
          </ol>
        ) : <p>No hay preguntas relacionadas disponibles todavía.</p>}
      </section>

      <section className="lesson-completion" aria-labelledby="lesson-completion-title">
        <div><p className="course-eyebrow">Cierre de la lección</p><h2 id="lesson-completion-title">Marca la lección cuando hayas terminado el repaso</h2></div>
        <Button disabled={isPending || progress === 100} onClick={markComplete}>{progress === 100 ? "Lección completada" : isPending ? "Guardando…" : "Marcar como completada"}</Button>
        {completionMessage && <p aria-live="polite" className={completionMessage === "Lección completada" ? "course-status" : "course-status course-status--error"} role="status">{completionMessage}</p>}
      </section>
    </article>
  );
}
