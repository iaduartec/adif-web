import { lessonTheories } from "../../content/lesson-theory";
import { fetchPaginatedRows } from "../supabase/paginated-query";
import type { createServerClient } from "../supabase/server";
import { madridDayKey, type MasteryStatus } from "./review-schedule";

export type ReviewConcept = {
  id: string;
  title: string;
  lessonSlug: string;
  claims: readonly string[];
  dueOn: string | null;
  status: "review" | "at_risk";
};

export type ReviewConceptCatalogEntry = Pick<ReviewConcept, "id" | "title" | "lessonSlug" | "claims">;

export type ReviewMasteryRow = {
  concept_id: string;
  due_on: string | null;
  status: MasteryStatus | string;
};

export type PlannedConceptSelection =
  | { kind: "absent" }
  | { kind: "invalid" }
  | { kind: "valid"; ids: string[] };

export function activeReviewConceptCatalog(): ReviewConceptCatalogEntry[] {
  return Object.entries(lessonTheories).flatMap(([lessonSlug, theory]) => (
    theory.concepts.map((concept) => ({
      id: concept.id,
      title: concept.title,
      lessonSlug,
      claims: concept.claims.map((claim) => claim.text),
    }))
  ));
}

function compareText(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

export function assembleReviewBacklog({
  catalog,
  rows,
  today,
}: {
  catalog: readonly ReviewConceptCatalogEntry[];
  rows: readonly ReviewMasteryRow[];
  today: string;
}): ReviewConcept[] {
  const activeById = new Map(catalog.map((concept) => [concept.id, concept]));

  return rows
    .filter((row): row is ReviewMasteryRow & { status: "review" | "at_risk" } => (
      activeById.has(row.concept_id)
      && (row.status === "review" || row.status === "at_risk")
      && (row.status === "at_risk" || (row.due_on !== null && row.due_on <= today))
    ))
    .map((row) => ({
      ...activeById.get(row.concept_id)!,
      dueOn: row.due_on,
      status: row.status,
    }))
    .sort((left, right) => (
      compareText(left.dueOn ?? "9999-12-31", right.dueOn ?? "9999-12-31")
      || Number(right.status === "at_risk") - Number(left.status === "at_risk")
      || compareText(left.id, right.id)
    ));
}

export function parsePlannedConceptSelection(
  value: string | string[] | undefined,
  backlogIds: ReadonlySet<string>,
): PlannedConceptSelection {
  if (value === undefined) return { kind: "absent" };
  if (typeof value !== "string") return { kind: "invalid" };

  const ids = value.split(",");
  if (
    ids.length < 1
    || ids.length > 87
    || ids.some((id) => id.length === 0 || !backlogIds.has(id))
    || new Set(ids).size !== ids.length
  ) return { kind: "invalid" };

  return { kind: "valid", ids };
}

type SupabaseClient = Awaited<ReturnType<typeof createServerClient>>;

export async function loadReviewBacklog(
  supabase: SupabaseClient,
  userId: string,
  now = new Date(),
  catalog: readonly ReviewConceptCatalogEntry[] = activeReviewConceptCatalog(),
): Promise<ReviewConcept[]> {
  const rows = await fetchPaginatedRows<ReviewMasteryRow>(() => (
    supabase
      .from("concept_mastery")
      .select("concept_id,due_on,status")
      .eq("user_id", userId)
      .order("concept_id", { ascending: true })
  ));

  return assembleReviewBacklog({ catalog, rows, today: madridDayKey(now) });
}
