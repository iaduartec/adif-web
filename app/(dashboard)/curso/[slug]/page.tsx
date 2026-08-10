import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseNotes } from "../../../../components/course/course-notes";
import { CourseTheoryReader, type CourseView } from "../../../../components/course/course-theory-reader";
import { getLesson } from "../../../../lib/content/repository";
import { createServerClient } from "../../../../lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function CourseLessonPage({ params, searchParams = Promise.resolve({}) }: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ view?: string; full?: string; query?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
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
  const view: CourseView = query.view === "theory" || query.view === "official" ? query.view : "summary";
  const reader = await CourseTheoryReader({
    lesson,
    progress: progress?.percent ?? 0,
    view,
    showFullDocument: query.full === "true",
    searchQuery: query.query ?? "",
  });

  return (
    <div className="dashboard-reading course-page">
      <nav aria-label="Migas de pan" className="course-breadcrumb"><Link href="/curso">Curso</Link><span aria-hidden="true">/</span><span aria-current="page">{lesson.title}</span></nav>
      {reader}
      <CourseNotes initialBody={note?.body ?? ""} slug={lesson.slug} />
    </div>
  );
}
