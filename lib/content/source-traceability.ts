import { z } from "zod";

import traceabilityJson from "../../content/source-traceability.json";
import { sha256DigestSchema } from "./schema";
import { sourceManifest, type SourceManifest } from "./source-manifest";

/**
 * Traceability of the *downloaded artifact* is a different state from the
 * academic validity of the claims drawn from that source. `source-manifest.json`
 * owns the academic status; this module owns artifact integrity, auxiliary
 * provenance and unresolved discrepancies. It adds checks; it never relaxes the
 * manifest validators.
 */

export const artifactIntegrityStateSchema = z.enum(["pending", "confirmed"]);

const identitySchema = z.object({
  sourceId: z.string().trim().min(1),
  sourceVersion: z.string().trim().min(1),
  hashTarget: z.enum(["downloaded-page", "downloaded-file", "local-snapshot"]),
  academicStatus: z.enum(["verified", "needs_check", "superseded", "unavailable"]),
  academicStatusAction: z.literal("unchanged"),
  note: z.string().trim().min(1),
});

const pendingEntrySchema = identitySchema
  .extend({
    artifactIntegrity: z.literal("pending"),
    manifestSha256: sha256DigestSchema,
    observedSha256: sha256DigestSchema,
    observedContentLength: z.number().int().positive(),
    observedAt: z.iso.date(),
    literalness: z.enum(["reverified", "not_rechecked"]),
    literalnessEvidence: z.string().trim().min(1).optional(),
    recheck: z
      .object({
        checkedAt: z.iso.date(),
        sha256: sha256DigestSchema,
        contentLength: z.number().int().positive(),
        deterministicFetches: z.number().int().positive(),
      })
      .strict()
      .optional(),
  })
  .strict()
  .superRefine((entry, context) => {
    if (entry.manifestSha256 === entry.observedSha256) {
      context.addIssue({
        code: "custom",
        path: ["manifestSha256"],
        message: "A pending artifact must record two different SHA-256 digests.",
      });
    }
    if (entry.literalness === "reverified" && !entry.literalnessEvidence) {
      context.addIssue({
        code: "custom",
        path: ["literalnessEvidence"],
        message: "A reverified literalness claim requires its evidence.",
      });
    }
    if (entry.literalness === "not_rechecked" && (entry.literalnessEvidence || entry.recheck)) {
      context.addIssue({
        code: "custom",
        path: ["literalness"],
        message: "An entry that was not rechecked must not carry recheck evidence.",
      });
    }
  });

const confirmedEntrySchema = identitySchema
  .extend({
    artifactIntegrity: z.literal("confirmed"),
    sha256: sha256DigestSchema,
    observedAt: z.iso.date(),
  })
  .strict();

export const artifactIntegrityEntrySchema = z.union([pendingEntrySchema, confirmedEntrySchema]);

export const auxiliaryArtifactSchema = z
  .object({
    id: z.string().trim().min(1),
    role: z.enum(["auxiliary-corroboration", "derived-text"]),
    versioned: z.literal(false),
    path: z.string().trim().min(1),
    sha256: sha256DigestSchema,
    sizeBytes: z.number().int().positive(),
    pageCount: z.number().int().positive().optional(),
    entity: z.string().trim().min(1).optional(),
    edition: z.string().trim().min(1).optional(),
    document: z.string().trim().min(1).optional(),
    pdfCreated: z.string().trim().min(1).optional(),
    provenance: z.string().trim().min(1),
    notVersionedReason: z.string().trim().min(1),
    derivedFrom: z.string().trim().min(1).optional(),
    extractor: z.string().trim().min(1).optional(),
    supersedes: z.array(z.string().trim().min(1)),
  })
  .strict();

export const openDiscrepancySchema = z
  .object({
    id: z.string().trim().min(1),
    state: z.literal("pending"),
    type: z.enum(["numeric", "textual", "identity"]),
    causeDemonstrated: z.literal(false),
    cause: z.null(),
    summary: z.string().trim().min(1),
    demonstratedFacts: z
      .array(
        z
          .object({
            document: z.string().trim().min(1),
            locator: z.string().trim().min(1),
            fact: z.string().trim().min(1),
          })
          .strict(),
      )
      .min(1),
    excludedExplanations: z.array(z.string().trim().min(1)).min(1),
    notDemonstrated: z.array(z.string().trim().min(1)).min(1),
    nextStep: z.string().trim().min(1),
  })
  .strict();

export const pendingSourceIdentitySchema = z
  .object({
    id: z.string().trim().min(1),
    state: z.literal("pending"),
    entity: z.string().trim().min(1),
    edition: z.string().trim().min(1),
    document: z.string().trim().min(1),
    artifactPath: z.string().trim().min(1),
    sha256: sha256DigestSchema,
    manifestVersion: z.string().trim().min(1),
    manifestStatus: z.enum(["verified", "needs_check", "superseded", "unavailable"]),
    reason: z.string().trim().min(1),
    notSupersededBy: z.array(z.string().trim().min(1)).min(1),
    notSupersededReason: z.string().trim().min(1),
  })
  .strict();

export const sourceTraceabilitySchema = z
  .object({
    schemaVersion: z.literal(1),
    generatedAt: z.iso.date(),
    purpose: z.string().trim().min(1),
    policy: z
      .object({
        academicStatus: z.string().trim().min(1),
        artifactIntegrity: z.string().trim().min(1),
        academicStatusAction: z.string().trim().min(1),
        literalness: z.string().trim().min(1),
      })
      .strict(),
    artifactIntegrity: z.array(artifactIntegrityEntrySchema).min(1),
    auxiliaryArtifacts: z.array(auxiliaryArtifactSchema).min(1),
    openDiscrepancies: z.array(openDiscrepancySchema).min(1),
    pendingSourceIdentities: z.array(pendingSourceIdentitySchema).min(1),
  })
  .strict()
  .superRefine((ledger, context) => {
    const identities = new Set<string>();
    ledger.artifactIntegrity.forEach((entry, index) => {
      const identity = `${entry.sourceId}\u0000${entry.sourceVersion}`;
      if (identities.has(identity)) {
        context.addIssue({
          code: "custom",
          path: ["artifactIntegrity", index, "sourceVersion"],
          message: `Duplicate artifact identity '${entry.sourceId}' / '${entry.sourceVersion}'.`,
        });
      }
      identities.add(identity);
    });

    const auxiliaryIds = new Set(ledger.auxiliaryArtifacts.map((artifact) => artifact.id));
    ledger.auxiliaryArtifacts.forEach((artifact, index) => {
      if (artifact.derivedFrom && !auxiliaryIds.has(artifact.derivedFrom)) {
        context.addIssue({
          code: "custom",
          path: ["auxiliaryArtifacts", index, "derivedFrom"],
          message: "A derived artifact must point to a recorded auxiliary artifact.",
        });
      }
    });

    ledger.pendingSourceIdentities.forEach((source, index) => {
      source.notSupersededBy.forEach((id) => {
        if (!auxiliaryIds.has(id)) {
          context.addIssue({
            code: "custom",
            path: ["pendingSourceIdentities", index, "notSupersededBy"],
            message: `Unknown auxiliary artifact '${id}'.`,
          });
        }
      });
    });
  });

export type SourceTraceability = z.infer<typeof sourceTraceabilitySchema>;
export type ArtifactIntegrityEntry = z.infer<typeof artifactIntegrityEntrySchema>;

export const sourceTraceability: SourceTraceability = sourceTraceabilitySchema.parse(traceabilityJson);

/**
 * Cross-checks the ledger against the academic manifest. Every recorded
 * artifact must exist there with the very same academic status and hash target;
 * a pending artifact must keep the manifest's hash, and a confirmed one must
 * match it. This is an additional guard: it fails when someone silently
 * downgrades `status` because of a hash mismatch, and when someone invents an
 * artifact identity.
 */
export function crossCheckTraceability(
  ledger: SourceTraceability = sourceTraceability,
  manifest: SourceManifest = sourceManifest,
): string[] {
  const errors: string[] = [];
  const manifestIndex = new Map(
    manifest.sources.map((source) => [`${source.sourceId}\u0000${source.sourceVersion}`, source]),
  );

  for (const entry of ledger.artifactIntegrity) {
    const key = `${entry.sourceId}\u0000${entry.sourceVersion}`;
    const source = manifestIndex.get(key);
    if (!source) {
      errors.push(`'${entry.sourceId}' / '${entry.sourceVersion}' is not in the source manifest.`);
      continue;
    }
    if (source.status !== entry.academicStatus) {
      errors.push(
        `Academic status drift for '${entry.sourceId}': manifest ${source.status}, ledger ${entry.academicStatus}.`,
      );
    }
    if (source.hashTarget !== entry.hashTarget) {
      errors.push(`Hash target drift for '${entry.sourceId}': ${source.hashTarget} vs ${entry.hashTarget}.`);
    }
    const expectedSha = entry.artifactIntegrity === "pending" ? entry.manifestSha256 : entry.sha256;
    if (source.sha256 !== expectedSha) {
      errors.push(`Manifest hash drift for '${entry.sourceId}'.`);
    }
  }

  return errors;
}
