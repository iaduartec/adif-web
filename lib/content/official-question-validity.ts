import { z } from "zod";

import correction2023 from "../../content/official-exams/corrections/2023.json";
import correction2024 from "../../content/official-exams/corrections/2024.json";
import correction2025 from "../../content/official-exams/corrections/2025.json";
import examManifestJson from "../../content/official-exams/manifest.json";
import mappingsJson from "../../content/official-exams/concept-syllabus-mappings.json";
import transcription2023_1433 from "../../content/official-exams/transcriptions/2023-1433.json";
import transcription2023_4101 from "../../content/official-exams/transcriptions/2023-4101.json";
import transcription2024_3403 from "../../content/official-exams/transcriptions/2024-3403.json";
import transcription2024_3413 from "../../content/official-exams/transcriptions/2024-3413.json";
import transcription2025_1131 from "../../content/official-exams/transcriptions/2025-1131.json";
import transcription2025_4104 from "../../content/official-exams/transcriptions/2025-4104.json";
import { activeTheoryConceptRegistry } from "../../content/theory-concepts";
import { officialItems } from "../../content/syllabus";
import { SYLLABUS_SOURCES } from "../../content/syllabus-sources";
import { officialCorrectionSetsSchema } from "./schema";
import { validateOfficialCorrectionSets, type CorrectionExamRecord, type CorrectionSourceRecord } from "./official-corrections";
import { sourceManifest } from "./source-manifest";

const mappingSchema = z.object({
  conceptId: z.string().trim().min(1),
  syllabusNodeId: z.string().trim().min(1),
}).strict();

const mappingFileSchema = z.object({
  schemaVersion: z.literal(1),
  mappings: z.array(mappingSchema).min(1),
}).strict();

const parsedMappingFile = mappingFileSchema.safeParse(mappingsJson);
const mappingRows = parsedMappingFile.success ? parsedMappingFile.data.mappings : [];

const officialSpecificNodes = new Map(
  officialItems
    .filter((item) => item.scope === "specific-26-12po")
    .flatMap((item) => item.children.map((child) => [child.id, { item, node: child }] as const)),
);

const sourceByVersion = new Map(
  sourceManifest.sources.map((source) => [`${source.sourceId}\u0000${source.sourceVersion}`, source] as const),
);

type HistoricalExamForm = {
  id: string;
  year: number;
  call: string;
  profileCode: string;
  profileName: string;
  examCode: string;
  documentUrl: string;
  documentSourceId: string;
  documentSourceVersion: string;
  expectedQuestionNumbers: number[];
  transcribedQuestionNumbers: number[];
  reserveQuestionNumbers: number[];
};

const historicalExamForms = examManifestJson as HistoricalExamForm[];
const acceptedTranscriptionConcepts = new Map<string, string[]>(
  [
    transcription2023_1433,
    transcription2023_4101,
    transcription2024_3403,
    transcription2024_3413,
    transcription2025_1131,
    transcription2025_4104,
  ].flatMap((transcription) => transcription.questions.map((row) => [
    `${transcription.examId}-Q${String(row.number).padStart(2, "0")}`,
    [...row.conceptIds].sort(),
  ] as const)),
);
const historicalCorrectionsParsed = officialCorrectionSetsSchema.safeParse([
  correction2023,
  correction2024,
  correction2025,
]);
const historicalCorrections = historicalCorrectionsParsed.success ? historicalCorrectionsParsed.data : [];
const correctionExamRecords: CorrectionExamRecord[] = historicalExamForms.map((form) => ({
  id: form.id,
  year: form.year,
  call: form.call,
  profileCode: form.profileCode,
  questionNumbers: form.expectedQuestionNumbers,
  reserveQuestionNumbers: form.reserveQuestionNumbers,
}));
const correctionSourceRecords: CorrectionSourceRecord[] = sourceManifest.sources.map((source) => ({
  sourceId: source.sourceId,
  sourceVersion: source.sourceVersion,
  url: source.url,
  sourceType: source.sourceType,
  status: source.status,
  locatorPolicy: source.locatorPolicy,
  rightsBasis: source.rightsBasis,
}));

function manifestSourceId(syllabusSourceId: string): string {
  return SYLLABUS_SOURCES[syllabusSourceId]?.manifestSourceId ?? syllabusSourceId;
}

export type HistoricalQuestionCurrentness = "current" | "changed" | "out_of_scope" | "unknown";
export type HistoricalSourceStatus = "verified" | "needs_check" | "superseded" | "unavailable";

export type HistoricalQuestionForValidity = {
  id: string;
  conceptIds: readonly string[];
};

type HistoricalQuestionSourceIdentity = {
  kind: "official_adif_exam";
  year: number;
  call: string;
  profileCode: string;
  profileName: string;
  examCode: string;
  questionNumber: number;
  section: "general" | "english" | "specific";
  isReserve: boolean;
  documentUrl: string;
};

export type StoredHistoricalQuestionForValidity = HistoricalQuestionForValidity & {
  syllabusNodeId: string;
  currentness: HistoricalQuestionCurrentness;
  validity: "current" | "changed" | "out_of_scope" | "pending_review";
  validityReason: string;
  validityEvidence: HistoricalCurrentnessEvidence | null;
  source: HistoricalQuestionSourceIdentity;
};

export type HistoricalQuestionEvidence = {
  /** Status of the exact historical booklet version, not a newer file at the same URL. */
  sourceStatus: HistoricalSourceStatus;
  /** True only when the tribunal's final resolution is verified against an exact primary source. */
  tribunalVerified: boolean;
  /** True only while ADIF's PNI26/01 scope capture itself is marked verified in the source manifest. */
  syllabusScopeVerified: boolean;
  /** Must be set after comparing the question's cited rule with the 2026 scope and current text. */
  currentness: HistoricalQuestionCurrentness;
  /** Exact, reviewed current source locator supporting a non-pending classification. */
  currentnessEvidence?: HistoricalCurrentnessEvidence | null;
};

export type HistoricalCurrentnessEvidence = {
  sourceId: string;
  sourceVersion: string;
  sourceUrl: string;
  locator: string;
  reviewedAt: string;
};

export type ClassifiedHistoricalQuestion = {
  syllabusNodeId: string | null;
  currentness: HistoricalQuestionCurrentness;
  validity: "current" | "changed" | "out_of_scope" | "pending_review";
  validityReason: string;
  validityEvidence: HistoricalCurrentnessEvidence | null;
};

function mappingErrors(): string[] {
  const errors: string[] = [];
  if (!parsedMappingFile.success) {
    errors.push(`Concept-to-syllabus mapping file is invalid: ${parsedMappingFile.error.issues.map((issue) => issue.message).join("; ")}`);
    return errors;
  }

  const rowsByConcept = new Map<string, string[]>();
  for (const row of mappingRows) {
    const targets = rowsByConcept.get(row.conceptId) ?? [];
    targets.push(row.syllabusNodeId);
    rowsByConcept.set(row.conceptId, targets);

    if (!activeTheoryConceptRegistry.has(row.conceptId)) {
      errors.push(`${row.conceptId} mapping references an inactive or unknown theory concept.`);
    }

    const target = officialSpecificNodes.get(row.syllabusNodeId);
    if (!target) {
      errors.push(`${row.conceptId} maps to ${row.syllabusNodeId}, which is not a specific 26/12PO syllabus node.`);
      continue;
    }

    const scopeSourceId = manifestSourceId(target.item.scopeSourceId);
    const scopeSource = sourceByVersion.get(`${scopeSourceId}\u0000${target.item.scopeSourceVersion}`);
    if (
      !scopeSource || scopeSource.sourceType !== "primary" ||
      scopeSource.locatorPolicy === "document-level" || new URL(scopeSource.url).hostname !== "www.adif.es"
    ) {
      errors.push(`${row.syllabusNodeId} has no precise primary ADIF source confirming its 26/12PO scope.`);
    }

    const nodeSource = sourceByVersion.get(`${target.node.sourceId}\u0000${target.node.sourceVersion}`);
    if (
      !nodeSource || nodeSource.scope !== "specific-26-12po" ||
      nodeSource.status !== "verified" || nodeSource.locatorPolicy === "document-level"
    ) {
      errors.push(`${row.syllabusNodeId} source version is not verified with a section or exact locator.`);
    }
  }

  for (const [conceptId, targets] of rowsByConcept) {
    if (targets.length > 1) errors.push(`${conceptId} has duplicate syllabus mappings.`);
  }
  return errors;
}

export function isHistoricalSyllabusScopeVerified(question: HistoricalQuestionForValidity): boolean {
  const mapped = mappedNodeForQuestion(question);
  if (!mapped.nodeId) return false;
  const target = officialSpecificNodes.get(mapped.nodeId);
  if (!target) return false;
  const sourceId = manifestSourceId(target.item.scopeSourceId);
  return sourceByVersion.get(`${sourceId}\u0000${target.item.scopeSourceVersion}`)?.status === "verified";
}

function mappedNodeForQuestion(question: HistoricalQuestionForValidity): {
  nodeId: string | null;
  error: string | null;
} {
  if (!question.conceptIds.length) {
    return { nodeId: null, error: `${question.id} has no concept mapping.` };
  }

  const nodes = new Set<string>();
  for (const conceptId of question.conceptIds) {
    const matchingRows = mappingRows.filter((row) => row.conceptId === conceptId);
    if (matchingRows.length !== 1) {
      return { nodeId: null, error: `${question.id}: ${conceptId} has no unique concept-to-syllabus mapping.` };
    }
    nodes.add(matchingRows[0]!.syllabusNodeId);
  }

  if (nodes.size !== 1) {
    return { nodeId: null, error: `${question.id} has ambiguous mappings to multiple syllabus nodes: ${[...nodes].join(", ")}.` };
  }
  const nodeId = [...nodes][0]!;
  if (!officialSpecificNodes.has(nodeId)) {
    return { nodeId: null, error: `${question.id} maps outside the official specific 26/12PO syllabus.` };
  }
  return { nodeId, error: null };
}

function currentnessEvidenceIssue(
  nodeId: string,
  evidence: HistoricalCurrentnessEvidence | null | undefined,
): string | null {
  if (!evidence) return "no exact current-source review citation is recorded";
  const target = officialSpecificNodes.get(nodeId);
  if (!target) return "the mapped syllabus node has no current source";
  const citedSource = sourceByVersion.get(`${evidence.sourceId}\u0000${evidence.sourceVersion}`);
  const nodeSource = sourceByVersion.get(`${target.node.sourceId}\u0000${target.node.sourceVersion}`);
  const allowedSourceIds = new Set([target.node.sourceId, ...target.node.materialSourceIds]);
  if (
    !citedSource || citedSource.status !== "verified" || citedSource.locatorPolicy === "document-level" ||
    !allowedSourceIds.has(citedSource.sourceId) || evidence.sourceUrl !== citedSource.url
  ) {
    return "the review citation does not match a verified, locatable source for the mapped syllabus node";
  }
  const verifiedPrimaryNorms = target.node.materialSourceIds.flatMap((sourceId) =>
    sourceManifest.sources.filter((source) =>
      source.sourceId === sourceId && source.sourceType === "primary" && source.status === "verified" &&
      source.locatorPolicy !== "document-level" && source.scope !== "historical-exam",
    ),
  );
  if (verifiedPrimaryNorms.length && !verifiedPrimaryNorms.some((source) =>
    source.sourceId === citedSource.sourceId && source.sourceVersion === citedSource.sourceVersion,
  )) {
    return "the review must cite the verified primary normative source for this syllabus node";
  }
  if (!verifiedPrimaryNorms.length && (!nodeSource || nodeSource.status !== "verified" || citedSource.sourceId !== nodeSource.sourceId || citedSource.sourceVersion !== nodeSource.sourceVersion)) {
    return "the review must cite the verified assigned source for this syllabus node";
  }
  if (!evidence.locator.trim()) return "the current-source review citation has no section locator";
  const reviewedAt = z.iso.date().safeParse(evidence.reviewedAt);
  if (!reviewedAt.success || evidence.reviewedAt > new Date().toISOString().slice(0, 10)) {
    return "the current-source review date is missing or in the future";
  }
  if (citedSource.verifiedAt && evidence.reviewedAt < citedSource.verifiedAt) {
    return "the current-source review predates verification of its cited source version";
  }
  return null;
}

export function classifyHistoricalQuestion(
  question: HistoricalQuestionForValidity,
  evidence: HistoricalQuestionEvidence,
): ClassifiedHistoricalQuestion {
  const mapped = mappedNodeForQuestion(question);
  const mappingIssue = mappingErrors().length > 0;
  if (mapped.error || mappingIssue) {
    const issue = mapped.error ?? "The concept-to-syllabus mapping manifest contains validation errors.";
    return { syllabusNodeId: mapped.nodeId, currentness: "unknown", validity: "pending_review", validityReason: issue, validityEvidence: null };
  }

  const nodeId = mapped.nodeId!;
  const currentnessEvidenceError = evidence.currentness === "unknown"
    ? null
    : currentnessEvidenceIssue(nodeId, evidence.currentnessEvidence);
  const currentness: HistoricalQuestionCurrentness =
    evidence.currentness !== "unknown" && currentnessEvidenceError === null
      ? evidence.currentness
      : "unknown";
  const currentnessEvidence = currentness === "unknown" ? null : evidence.currentnessEvidence!;
  const missingEvidence: string[] = [];
  if (evidence.sourceStatus !== "verified") missingEvidence.push("the exact historic booklet version is not verified");
  if (!evidence.tribunalVerified) missingEvidence.push("the final tribunal answer key is not verified");
  if (!evidence.syllabusScopeVerified) missingEvidence.push("the ADIF 2026 syllabus scope capture is not marked verified");
  if (currentness === "unknown") {
    missingEvidence.push(currentnessEvidenceError ?? "the question has not been reconciled with the current 2026 rule and scope");
  }

  if (missingEvidence.length || currentness === "unknown") {
    return {
      syllabusNodeId: nodeId,
      currentness,
      validity: "pending_review",
      validityReason: `Mapped to ${nodeId}; pending because ${missingEvidence.join("; ")}.`,
      validityEvidence: currentnessEvidence,
    };
  }

  const validityReason = currentness === "current"
    ? `Mapped to ${nodeId}; reviewed against the verified historic booklet, final tribunal key, and current 26/12PO scope.`
    : currentness === "changed"
      ? `Mapped to ${nodeId}; the historic question depends on content that changed and needs the current version for study.`
      : `Mapped to ${nodeId}; the historical topic is outside the current 26/12PO scope.`;

  return {
    syllabusNodeId: nodeId,
    currentness,
    validity: currentness,
    validityReason,
    validityEvidence: currentnessEvidence,
  };
}

/** Rebuild the complete historic/current-source chain before allowing a record into practice. */
export function validateStoredHistoricalQuestionValidity(
  question: StoredHistoricalQuestionForValidity,
): string[] {
  const errors: string[] = [];
  const examId = `ADIF-${question.source.year}-${question.source.examCode}`;
  const form = historicalExamForms.find((candidate) => candidate.id === examId);
  const questionNumberFromId = Number(question.id.match(/-Q(\d{2})$/)?.[1]);
  const expectedConceptIds = acceptedTranscriptionConcepts.get(question.id);
  const conceptIdsMatch = Boolean(expectedConceptIds) &&
    JSON.stringify([...question.conceptIds].sort()) === JSON.stringify(expectedConceptIds);
  if (!conceptIdsMatch) errors.push(`${question.id} concept mapping differs from its accepted transcription row.`);
  const identityMatches = Boolean(form) &&
    question.id === `${examId}-Q${String(question.source.questionNumber).padStart(2, "0")}` &&
    questionNumberFromId === question.source.questionNumber &&
    form!.year === question.source.year &&
    form!.call === question.source.call &&
    form!.profileCode === question.source.profileCode &&
    form!.profileName === question.source.profileName &&
    form!.examCode === question.source.examCode &&
    form!.documentUrl === question.source.documentUrl &&
    form!.expectedQuestionNumbers.includes(question.source.questionNumber) &&
    form!.transcribedQuestionNumbers.includes(question.source.questionNumber) &&
    question.source.section === "specific" &&
    conceptIdsMatch &&
    form!.reserveQuestionNumbers.includes(question.source.questionNumber) === question.source.isReserve;

  if (!identityMatches) errors.push(`${question.id} does not match the exact historic form identity and question metadata.`);

  const booklet = identityMatches
    ? sourceByVersion.get(`${form!.documentSourceId}\u0000${form!.documentSourceVersion}`)
    : undefined;
  const bookletMatches = Boolean(
    booklet && booklet.url === form!.documentUrl && booklet.sourceType === "primary" &&
    booklet.scope === "historical-exam",
  );
  const sourceStatus: HistoricalSourceStatus = bookletMatches ? booklet!.status : "unavailable";

  const correctionSet = historicalCorrections.find((set) => set.examIds.includes(examId));
  const setExamIds = new Set(correctionSet?.examIds ?? []);
  const setErrors = correctionSet
    ? validateOfficialCorrectionSets(
      [correctionSet],
      correctionExamRecords.filter((exam) => setExamIds.has(exam.id)),
      correctionSourceRecords,
    )
    : ["No tribunal correction set covers this form."];
  const resolution = correctionSet && sourceByVersion.get(
    `${correctionSet.resolutionSource.sourceId}\u0000${correctionSet.resolutionSource.sourceVersion}`,
  );
  const tribunalVerified = Boolean(
    correctionSet && correctionSet.reconciliationStatus !== "pending" &&
    resolution && resolution.url === correctionSet.resolutionSource.sourceUrl &&
    resolution.sourceType === "primary" && resolution.status === "verified" &&
    resolution.locatorPolicy === "exact" && resolution.scope === "historical-exam" && setErrors.length === 0,
  );

  const expected = classifyHistoricalQuestion(question, {
    sourceStatus,
    tribunalVerified,
    syllabusScopeVerified: isHistoricalSyllabusScopeVerified(question),
    currentness: question.currentness,
    currentnessEvidence: question.validityEvidence,
  });

  if (question.syllabusNodeId !== expected.syllabusNodeId) errors.push(`${question.id} has a stale or incorrect 2026 syllabus node mapping.`);
  if (question.currentness !== expected.currentness) errors.push(`${question.id} has unsupported currentness metadata.`);
  if (question.validity !== expected.validity) errors.push(`${question.id} validity does not match the exact evidence currently available.`);
  if (question.validityReason !== expected.validityReason) errors.push(`${question.id} validity reason is stale or inconsistent with its evidence.`);
  if (JSON.stringify(question.validityEvidence) !== JSON.stringify(expected.validityEvidence)) {
    errors.push(`${question.id} current-source citation does not match the validated classification evidence.`);
  }
  return errors;
}

export function validateHistoricalQuestionMappings(
  questions: readonly HistoricalQuestionForValidity[],
): string[] {
  const errors = mappingErrors();
  const seenIds = new Set<string>();
  for (const question of questions) {
    if (seenIds.has(question.id)) errors.push(`Duplicate historical question ID: ${question.id}.`);
    seenIds.add(question.id);
    const mapped = mappedNodeForQuestion(question);
    if (mapped.error) errors.push(mapped.error);
  }
  return [...new Set(errors)];
}
