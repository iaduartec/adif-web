import { createHash } from "node:crypto";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { OriginalPracticeSession } from "../../../../../components/practice/original-practice-session";
import { getOriginalSimulation } from "../../../../../lib/content/original-simulation-catalog";
import { toPublicPracticeQuestion } from "../../../../../lib/content/original-practice-public-dto";
import { listOriginalPracticeQuestions } from "../../../../../lib/content/original-practice-repository";
import { createServerClient } from "../../../../../lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function OriginalSimulationPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;
  const simulation = getOriginalSimulation(domain);
  if (!simulation) notFound();

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const recoveryScope = createHash("sha256").update(user.id).digest("hex").slice(0, 24);

  const questions = listOriginalPracticeQuestions({ domain: simulation.domain, status: "reviewed" })
    .map(toPublicPracticeQuestion)
    .filter((question) => question !== null);

  return (
    <div className="dashboard-wide">
      <nav aria-label="Migas de pan" className="course-breadcrumb mb-6">
        <Link href="/simulacros">Simulacros</Link><span aria-hidden="true">/</span>
        <Link href="/simulacros/original">Simulacros originales</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{simulation.title}</span>
      </nav>
      <OriginalPracticeSession examMode questions={questions} recoveryScope={recoveryScope} title={`Simulacro original: ${simulation.title}`} />
    </div>
  );
}
