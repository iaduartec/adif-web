import { notFound, redirect } from "next/navigation";
import { getSimulation, getQuestion, type LegacyPracticeQuestion } from "../../../../lib/content/repository";
import { createServerClient } from "../../../../lib/supabase/server";
import { SimulationPageClient } from "./client";

export const dynamic = "force-dynamic";

export default async function SimulationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const simulation = getSimulation(id);
  if (!simulation) notFound();

  // Strip the answer from each question so the client cannot cheat
  const questions: LegacyPracticeQuestion[] = simulation.questionIds.map((questionId) => {
    const question = getQuestion(questionId);
    if (!question) return null;
    const { answer: _answer, ...rest } = question;
    return rest;
  }).filter((q): q is LegacyPracticeQuestion => q !== null);

  return (
    <SimulationPageClient
      simulation={{ id: simulation.id, title: simulation.title }}
      questions={questions}
    />
  );
}
