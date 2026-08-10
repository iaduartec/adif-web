import Link from "next/link";
import { listLessons } from "../../../lib/content/repository";
import { createServerClient } from "../../../lib/supabase/server";
import { OriginLabel } from "../../../components/course/origin-label";

export const dynamic = "force-dynamic";

const courseBlocks = [
  {
    title: "Bloque común",
    description: "Normativa básica institucional, igualdad y prevención de riesgos laborales obligatorias para el personal de ADIF.",
    slugs: ["igualdad", "prevencion-riesgos-laborales", "estatuto-adif", "codigo-conducta", "incompatibilidades"],
    minutes: [18, 20, 16, 14, 15]
  },
  {
    title: "Telecomunicaciones",
    description: "Infraestructuras comunes de telecomunicación (ICT) en edificios y compatibilidad electromagnética aplicada al entorno ferroviario.",
    slugs: ["ict-rd-346-2011", "compatibilidad-electromagnetica"],
    minutes: [22, 18]
  },
  {
    title: "Entorno ferroviario y pruebas",
    description: "Reglamento de Circulación Ferroviaria (RCF), declaración sobre la red, psicotécnicos y nivel de inglés técnico.",
    slugs: ["rcf-libro-1", "declaracion-red-2027", "psicometria", "ingles-a2"],
    minutes: [25, 18, 15, 14]
  },
] as const;

export default async function CourseIndexPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: progressRows } = user
    ? await supabase.from("lesson_progress").select("lesson_id, percent").eq("user_id", user.id)
    : { data: [] };
  const progressByLesson = new Map((progressRows ?? []).map((item) => [item.lesson_id, item.percent]));
  const lessonsBySlug = new Map(listLessons().map((lesson) => [lesson.slug, lesson]));

  return (
    <section className="course-index" aria-labelledby="course-title">
      <header className="course-index__header">
        <p className="course-eyebrow">Itinerario de estudio</p>
        <h1 id="course-title">Curso ADIF Telecomunicaciones</h1>
        <p>Once lecciones para estudiar con una lectura ordenada, referencias para cotejar y un registro personal de avance.</p>
      </header>
      {courseBlocks.map((block) => (
        <section className="course-block" key={block.title} aria-labelledby={`block-${block.title}`}>
          <div className="space-y-1 mb-4">
            <h2 id={`block-${block.title}`}>{block.title}</h2>
            <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">{block.description}</p>
          </div>
          <ol className="course-rule-list course-lesson-list">
            {block.slugs.map((slug, index) => {
              const lesson = lessonsBySlug.get(slug);
              if (!lesson) return null;
              const percent = progressByLesson.get(slug) ?? 0;

              return <li key={slug}>
                <div className="course-lesson-list__main">
                  <Link href={`/curso/${lesson.slug}`}>{lesson.title}</Link>
                  <p>{lesson.summary}</p>
                  <div className="course-origin-list"><OriginLabel origin={lesson.origin} /><span>{block.minutes[index]} min de lectura</span></div>
                </div>
                <p className="course-progress" aria-label={`${lesson.title}: ${percent}% completado`}>{percent}%</p>
              </li>;
            })}
          </ol>
        </section>
      ))}
    </section>
  );
}
