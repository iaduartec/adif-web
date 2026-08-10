import { notFound, redirect } from "next/navigation";
import { getOfficialExam, getOfficialQuestion } from "../../../../lib/content/repository";
import {
  toPublicOfficialExam,
  toPublicOfficialQuestion,
  type PublicOfficialQuestion,
} from "../../../../lib/content/public-dto";
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
  const questions: PublicOfficialQuestion[] = exam.questionIds.map((questionId) => {
    const question = getOfficialQuestion(questionId);
    if (!question) throw new Error(`Pregunta oficial ${questionId} no encontrada.`);
    return toPublicOfficialQuestion(question);
  });

  return (
    <SimulationPageClient
      exam={toPublicOfficialExam(exam)}
      questions={questions}
    />
  );
}
