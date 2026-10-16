export type {
  TheorySection,
  TheoryClaim,
  TheoryClaimKind,
  ClaimEditorialReview,
  ClaimReviewStatus,
  EditorialConfidenceLevel,
  TheoryConcept,
  TheoryExample,
  LegalReference,
  VerificationMeta,
  VerificationStatus,
  LessonMetadata,
} from "./theory-types";

import type { TheorySection } from "./theory-types";
import claimReviewManifest from "./claim-review-manifest.json";
import sourceManifestData from "./source-manifest.json";
import theorySourceLinks from "./theory-source-links.json";
import { igualdadTheory } from "./theories/igualdad";
import { prlTheory } from "./theories/prevencion-riesgos-laborales";
import { estatutoAdifTheory } from "./theories/estatuto-adif";
import { ictTheory } from "./theories/ict-rd-346-2011";
import { cemTheory } from "./theories/compatibilidad-electromagnetica";
import { rcfLibro1Theory } from "./theories/rcf-libro-1";
import { psicometriaTheory } from "./theories/psicometria";
import { declaracionRed2027Theory } from "./theories/declaracion-red-2027";
import { codigoConductaTheory } from "./theories/codigo-conducta";
import { incompatibilidadesTheory } from "./theories/incompatibilidades";
import { inglesA2Theory } from "./theories/ingles-a2";

const rawLessonTheories: Record<string, TheorySection> = {
  igualdad: igualdadTheory,
  "prevencion-riesgos-laborales": prlTheory,
  "estatuto-adif": estatutoAdifTheory,
  "ict-rd-346-2011": ictTheory,
  "compatibilidad-electromagnetica": cemTheory,
  "rcf-libro-1": rcfLibro1Theory,
  psicometria: psicometriaTheory,
  "declaracion-red-2027": declaracionRed2027Theory,
  "codigo-conducta": codigoConductaTheory,
  incompatibilidades: incompatibilidadesTheory,
  "ingles-a2": inglesA2Theory,
};

type ReviewManifest = {
  reviews: Record<string, NonNullable<TheorySection["introduction"][number]["review"]>>;
};
type TheorySourceLinks = {
  sources: Array<{ sourceId: string; sourceUrl: string; sourceVersion: string }>;
};

const reviewManifest = claimReviewManifest as ReviewManifest;
const pinnedSourceLinks = theorySourceLinks as TheorySourceLinks;

function resolveSourceVersion(source: TheorySection["sources"][number]) {
  const normalizeUrl = (value: string) => {
    try {
      return new URL(value).toString().replace(/\/$/, "");
    } catch {
      return null;
    }
  };
  const sourceUrl = normalizeUrl(source.sourceUrl);
  const link = sourceUrl
    ? pinnedSourceLinks.sources.find(
        (entry) => entry.sourceId === source.sourceId && normalizeUrl(entry.sourceUrl) === sourceUrl,
      )
    : undefined;
  const selectedVersion = source.sourceVersion ?? link?.sourceVersion;
  const selected = sourceManifestData.sources.find(
    (entry) =>
      entry.sourceId === source.sourceId &&
      entry.sourceVersion === selectedVersion &&
      sourceUrl !== null &&
      normalizeUrl(entry.url) === sourceUrl,
  );

  return {
    ...source,
    ...(selectedVersion ? { sourceVersion: selectedVersion } : {}),
    ...(selected && source.verifiedAt === undefined ? { verifiedAt: selected.verifiedAt ?? undefined } : {}),
  };
}

function withManifestEvidence(theory: TheorySection): TheorySection {
  const withReview = (claim: TheorySection["introduction"][number]) => ({
    ...claim,
    ...(claim.review || !reviewManifest.reviews[claim.id] ? {} : { review: reviewManifest.reviews[claim.id] }),
  });

  return {
    ...theory,
    sources: theory.sources.map(resolveSourceVersion),
    introduction: theory.introduction.map(withReview),
    concepts: theory.concepts.map((concept) => ({ ...concept, claims: concept.claims.map(withReview) })),
    examples: theory.examples.map((example) => ({ ...example, application: example.application.map(withReview) })),
    reviewTakeaways: theory.reviewTakeaways.map(withReview),
  };
}

/**
 * Existing module files predate per-claim provenance. Their stable IDs resolve
 * to conservative `needs_review` metadata, and their citations resolve to the
 * unique active version in the source manifest. New claims need explicit
 * review entries and exact versions rather than inheriting an approval.
 */
export const lessonTheories: Record<string, TheorySection> = Object.fromEntries(
  Object.entries(rawLessonTheories).map(([slug, theory]) => [slug, withManifestEvidence(theory)]),
);
