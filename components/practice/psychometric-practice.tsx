import type { OriginalPracticeQuestionDto } from "../../lib/content/original-practice-public-dto";
import { OriginalPracticeSession } from "./original-practice-session";

export function PsychometricPractice({
  questions,
}: {
  questions: readonly OriginalPracticeQuestionDto[];
}) {
  return <OriginalPracticeSession questions={questions} title="Práctica original por aptitud" />;
}
