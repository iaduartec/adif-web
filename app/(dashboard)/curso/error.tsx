"use client";

export default function CourseError({ reset }: { error: Error; reset: () => void }) {
  return <section className="course-error" role="alert"><h1>No se ha podido cargar el curso</h1><p>Comprueba tu conexión e inténtalo de nuevo.</p><button onClick={reset} type="button">Reintentar</button></section>;
}
