import { createHash } from "node:crypto";

type FingerprintedQuestion = {
  prompt: string;
  options: readonly { key: string; text: string }[];
  answer: string;
};

/**
 * Stable SHA-256 for question content. Option text is ordered by answer key so
 * equivalent A-D records have the same fingerprint regardless of array order.
 */
export function questionContentFingerprint(question: FingerprintedQuestion): string {
  const optionTexts = [...question.options]
    .sort((left, right) => left.key.localeCompare(right.key))
    .map((option) => option.text);
  return fingerprint([
    question.prompt,
    ...optionTexts,
    question.answer,
  ]);
}

/** Identifies the stem and answer choices even if a record changes its key. */
export function questionPromptOptionsFingerprint(question: Omit<FingerprintedQuestion, "answer">): string {
  const optionTexts = [...question.options]
    .sort((left, right) => left.key.localeCompare(right.key))
    .map((option) => option.text);
  return fingerprint([question.prompt, ...optionTexts]);
}

function fingerprint(parts: readonly string[]): string {
  const payload = parts.join("\n");
  return `sha256:${createHash("sha256").update(payload, "utf8").digest("hex")}`;
}
