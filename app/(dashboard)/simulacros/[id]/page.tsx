import { notFound, redirect } from "next/navigation";
import { getOfficialExam, getOfficialQuestion, type OfficialExamQuestion } from "../../../../lib/content/repository";
import { createServerClient } from "../../../../lib/supabase/server";
import { SimulationPageClient } from "./client";

export const dynamic = "force-dynamic";

export default async function SimulationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const exam = getOfficialExam(id);
  if (!exam) notFound();

  // Strip the answer from each question so the client cannot cheat
  const questions: OfficialExamQuestion[] = exam.questionIds.map((questionId) => {
    const question = getOfficialQuestion(questionId);
    if (!question) throw new Error(`Pregunta oficial ${questionId} no encontrada.`);
    const { answer: _answer, ...rest } = question;
    return rest;
  });

  return (
    <SimulationPageClient
      exam={exam}
      questions={questions}
    />
  );
}
