import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, it, expect } from "vitest";

import { CourseTheoryReader } from "../components/course/course-theory-reader";
import { getLesson } from "../lib/content/repository";

describe("course lesson summaries", () => {
  afterEach(cleanup);

  const cases = [
    {
      slug: "psicometria",
      overview: /Evaluación psicométrica: qué se mide y cómo prepararlo/i,
      headingCount: 4,
    },
    {
      slug: "ingles-a2",
      overview: /Inglés A2: gramática funcional para examen/i,
      headingCount: 4,
    },
    {
      slug: "ict-rd-346-2011",
      overview: /Real Decreto 346\/2011 aprueba el Reglamento regulador de las Infraestructuras Comunes de Telecomunicación/i,
      headingCount: 4,
    },
    {
      slug: "compatibilidad-electromagnetica",
      overview: /En examen importa distinguir emisión, inmunidad, mecanismos de acoplamiento y la familia de normas EN 50121/i,
      headingCount: 4,
    },
    {
      slug: "rcf-libro-1",
      overview: /Libro Primero del Reglamento de Circulación Ferroviaria/i,
      headingCount: 4,
    },
  ] as const;

  for (const { slug, overview, headingCount } of cases) {
    it(`renders a structured summary for ${slug} instead of the fallback note`, async () => {
      render(await CourseTheoryReader({ lesson: getLesson(slug)!, progress: 0 }));

      expect(screen.queryByText(/No hay resumen estructurado disponible/i)).toBeNull();
      expect(screen.getByText(overview)).toBeVisible();
      expect(screen.getAllByRole("heading", { level: 3 }).length).toBeGreaterThanOrEqual(headingCount);
    });
  }
});
