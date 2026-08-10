/**
 * Traceable theory content types for the ADIF study platform.
 *
 * Every claim in the theory modules must be classified and,
 * when normative or interpretative, linked to at least one
 * legal reference through its `legalBasis` array.
 */

// ---------------------------------------------------------------------------
// Verification
// ---------------------------------------------------------------------------

export type VerificationStatus = "draft" | "reviewed" | "verified";

export type VerificationMeta = {
  status: VerificationStatus;
  reviewedAt?: string;
  verifiedAt?: string;
  reviewedBy?: string;
  verifiedBy?: string;
};

// ---------------------------------------------------------------------------
// Legal references
// ---------------------------------------------------------------------------

export type LegalReference = {
  /** Stable, globally unique ID — e.g. `lo3-2007-art6-2` */
  id: string;
  sourceId: string;
  sourceTitle: string;
  sourceUrl: string;
  /** Human-readable locator — e.g. `Art. 6.2` */
  locator: string;
  excerpt?: string;
};

// ---------------------------------------------------------------------------
// Claims
// ---------------------------------------------------------------------------

export type TheoryClaimKind =
  | "normative"
  | "interpretative"
  | "didactic"
  | "example";

export type TheoryClaim = {
  id: string;
  text: string;
  kind: TheoryClaimKind;
  /** IDs of LegalReference entries in the same module's `sources` array. */
  legalBasis: string[];
};

export type TheoryConcept = {
  id: string;
  title: string;
  claims: TheoryClaim[];
};

export type TheoryExample = {
  id: string;
  situation: string;
  application: TheoryClaim[];
};

// ---------------------------------------------------------------------------
// Section (the shape exported by each theory module)
// ---------------------------------------------------------------------------

export interface TheorySection {
  introduction: TheoryClaim[];
  concepts: TheoryConcept[];
  examples: TheoryExample[];
  reviewTakeaways: TheoryClaim[];
  sources: LegalReference[];
}

// ---------------------------------------------------------------------------
// Lesson metadata (decoupled from theory content)
// ---------------------------------------------------------------------------

export type LessonMetadata = {
  slug: string;
  title: string;
  summary: string;
  verification: VerificationMeta;
};
