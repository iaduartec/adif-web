"use client";

import Link from "next/link";
import { useState, useTransition, type ReactNode } from "react";
import { saveLessonProgress } from "../../app/actions/lesson";
import type { ContentOrigin } from "../../lib/content/schema";
import { Button } from "../ui/button";
import { OriginLabel } from "./origin-label";

export function CourseProgressShell({
  children,
  lesson,
  progress,
}: {
  children: ReactNode;
  lesson: { slug: string; title: string; summary: string; origin: ContentOrigin };
  progress: number;
}) {
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

  return (
    <article className="course-reader">
      <header className="course-reader__header">
        <p className="course-eyebrow">Curso · {completionPercent}% completado</p>
        <div className="course-origin-list"><OriginLabel origin={lesson.origin} /></div>
        <h1>{lesson.title}</h1>
        <p className="course-reader__summary">{lesson.summary}</p>
      </header>

      {children}

      <div className="mt-8 pt-8 border-t border-rail space-y-8">
        <section aria-labelledby="course-questions">
          <h2 id="course-questions">Preguntas oficiales</h2>
          <p>Consulta el banco oficial completo; no se asignan preguntas a esta lección sin una clasificación publicada por ADIF.</p>
          <Link className="ui-button ui-button--secondary mt-4" href="/tests">Preguntas oficiales</Link>
        </section>

        <section className="course-completion" aria-labelledby="course-completion-title">
          <div>
            <p className="course-eyebrow">Cierre de la lección</p>
            <h2 id="course-completion-title">Marca la lección cuando hayas terminado el repaso</h2>
          </div>
          <Button disabled={isPending || completionPercent === 100} onClick={markComplete}>
            {completionPercent === 100 ? "Lección completada" : isPending ? "Guardando…" : "Marcar como completada"}
          </Button>
          {completionMessage && (
            <p
              aria-live="polite"
              className={completionMessage === "Lección completada" ? "course-status" : "course-status course-status--error"}
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
