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
  /** Versioned manifest entry. Legacy references are resolved through the manifest at registry load. */
  sourceVersion?: string;
  /** Copied from the linked manifest version to make the citation self-describing. */
  verifiedAt?: string;
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

export type EditorialConfidenceLevel = "high" | "medium" | "low";
export type ClaimReviewStatus = "draft" | "needs_review" | "reviewed";

export type ClaimEditorialReview = {
  status: ClaimReviewStatus;
  confidence: {
    level: EditorialConfidenceLevel;
    reason: string;
  };
  /** Date on which this claim was actually reviewed, not its source date. */
  reviewedAt?: string;
  reviewedBy?: string;
};

export type TheoryClaim = {
  id: string;
  text: string;
  kind: TheoryClaimKind;
  /** IDs of LegalReference entries in the same module's `sources` array. */
  legalBasis: string[];
  /** Editorial state is attached from the claim review manifest for legacy claims. */
  review?: ClaimEditorialReview;
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
