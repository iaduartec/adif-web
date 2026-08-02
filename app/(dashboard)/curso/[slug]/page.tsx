import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonNotes } from "../../../../components/course/lesson-notes";
import { LessonReader } from "../../../../components/course/lesson-reader";
import { getLesson, listQuestions } from "../../../../lib/content/repository";
import { createServerClient } from "../../../../lib/supabase/server";

export const dynamic = "force-dynamic";

const questionModules: Record<string, string> = {
  igualdad: "G1 Igualdad",
  "prevencion-riesgos-laborales": "G2 PRL",
  "estatuto-adif": "G3 Estatuto ADIF",
  "ict-rd-346-2011": "T1 ICT",
  "compatibilidad-electromagnetica": "T2 CEM",
  "rcf-libro-1": "F1 RCF",
  psicometria: "P1 Psicometría",
  "ingles-a2": "I1 Inglés A2",
};

export default async function CourseLessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: progress }, { data: note }] = user
    ? await Promise.all([
      supabase.from("lesson_progress").select("percent").eq("user_id", user.id).eq("lesson_id", slug).maybeSingle(),
      supabase.from("notes").select("body").eq("user_id", user.id).eq("lesson_id", slug).maybeSingle(),
    ])
    : [{ data: null }, { data: null }];
  const questions = listQuestions({ module: questionModules[slug] }).slice(0, 3);

  return (
    <div className="dashboard-reading course-page">
      <nav aria-label="Migas de pan" className="course-breadcrumb"><Link href="/curso">Curso</Link><span aria-hidden="true">/</span><span aria-current="page">{lesson.title}</span></nav>
      <LessonReader lesson={lesson} progress={progress?.percent ?? 0} questions={questions} />
      <LessonNotes initialBody={note?.body ?? ""} slug={lesson.slug} />
    </div>
  );
}
