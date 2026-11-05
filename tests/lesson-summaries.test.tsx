import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, it, expect } from "vitest";

import { CourseTheoryReader } from "../components/course/course-theory-reader";
import { getLesson } from "../lib/content/repository";
import { lessonTheories } from "../content/lesson-theory";
import claimReviewManifest from "../content/claim-review-manifest.json";

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


describe("course claim editorial review labels", () => {
  afterEach(cleanup);

  function claimsFor(slug: string) {
    const theory = lessonTheories[slug]!;
    return [
      ...theory.introduction,
      ...theory.concepts.flatMap((concept) => concept.claims),
      ...theory.examples.flatMap((example) => example.application),
      ...theory.reviewTakeaways,
    ];
  }

  it("shows the exact manifest-backed claim with its registered review date", async () => {
    const reviews = claimReviewManifest.reviews as Record<string, { status: string; reviewedAt?: string }>;
    const claim = claimsFor("rcf-libro-1").find((item) => (
      reviews[item.id]?.status === "reviewed"
      && reviews[item.id]?.reviewedAt
    ));
    expect(claim).toBeDefined();
    const review = reviews[claim!.id]!;
    const lesson = getLesson("rcf-libro-1")!;
    render(await CourseTheoryReader({ lesson, progress: 0, view: "theory" }));

    const renderedClaim = screen.getByText(claim!.text).closest(".course-claim");
    expect(renderedClaim).not.toBeNull();
    expect(renderedClaim).toHaveTextContent(`Revisión editorial registrada · ${review.reviewedAt}`);
  });

  it("shows pending editorial review on the exact claim", async () => {
    const lesson = getLesson("ict-rd-346-2011")!;
    const pending = claimsFor("ict-rd-346-2011").find((item) => item.review?.status === "needs_review");
    expect(pending).toBeDefined();
    render(await CourseTheoryReader({ lesson, progress: 0, view: "theory" }));
    expect(screen.getByText(pending!.text).closest(".course-claim"))
      .toHaveTextContent("Revisión editorial pendiente");
  });

  it("labels draft content distinctly", async () => {
    const lesson = getLesson("ict-rd-346-2011")!;
    const claim = claimsFor("ict-rd-346-2011").find((item) => item.review);
    expect(claim).toBeDefined();
    const originalReview = claim!.review!;
    try {
      claim!.review = { ...originalReview, status: "draft" };
      render(await CourseTheoryReader({ lesson, progress: 0, view: "theory" }));
      expect(screen.getByText(claim!.text).closest(".course-claim"))
        .toHaveTextContent("Contenido en borrador");
    } finally {
      claim!.review = originalReview;
    }
  });

  it("shows a separate state when review data is absent", async () => {
    const lesson = getLesson("ict-rd-346-2011")!;
    const claim = claimsFor("ict-rd-346-2011").find((item) => item.review);
    expect(claim).toBeDefined();
    const originalReview = claim!.review;
    try {
      delete claim!.review;
      render(await CourseTheoryReader({ lesson, progress: 0, view: "theory" }));
      expect(screen.getByText(claim!.text).closest(".course-claim"))
        .toHaveTextContent("Sin dato de revisión editorial");
    } finally {
      claim!.review = originalReview;
    }
  });
});
