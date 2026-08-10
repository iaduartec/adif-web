"use client";

import { useState, useTransition } from "react";
import { saveNote } from "../../app/actions/lesson";
import { Button } from "../ui/button";

export function CourseNotes({ slug, initialBody }: { slug: string; initialBody: string }) {
  const [body, setBody] = useState(initialBody);
  const [message, setMessage] = useState<string>();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(undefined);

    startTransition(async () => {
      try {
        await saveNote(slug, body);
        setMessage("Nota guardada");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "No se ha podido guardar la nota.");
      }
    });
  }

  return (
    <section className="course-notes" aria-labelledby="course-notes-title">
      <div>
        <p className="course-eyebrow">Cuaderno personal</p>
        <h2 id="course-notes-title">Tus notas</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor={`course-note-${slug}`}>Tus notas</label>
        <textarea
          id={`course-note-${slug}`}
          maxLength={5_000}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Escribe una idea, una duda o una referencia para revisar."
          rows={7}
          value={body}
        />
        <div className="course-notes__footer">
          <p aria-live="polite" className={message === "Nota guardada" ? "course-status" : "course-status course-status--error"} role={message ? "status" : undefined}>
            {message}
          </p>
          <Button disabled={isPending} type="submit">{isPending ? "Guardando…" : "Guardar nota"}</Button>
        </div>
      </form>
    </section>
  );
}
