import { z } from "zod";

import sourceManifestJson from "../../content/source-manifest.json";
import { sha256DigestSchema } from "./schema";

export const sourceVersionStatusSchema = z.enum([
  "verified",
  "needs_check",
  "superseded",
  "unavailable",
]);

export const sourceManifestEntrySchema = z
  .object({
    sourceId: z.string().trim().min(1),
    sourceVersion: z.string().trim().min(1),
    sourceType: z.enum(["primary", "secondary", "didactic"]),
    sourceKind: z
      .enum([
        "legislation",
        "official-document",
        "standard",
        "syllabus-reference",
        "pedagogical",
      ])
      .optional(),
    authority: z.enum(["A", "B", "C"]),
    organization: z.string().trim().min(1),
    title: z.string().trim().min(1),
    url: z.url().refine((value) => new URL(value).protocol === "https:", {
      message: "Source URLs must use HTTPS.",
    }),
    scope: z.enum([
      "common",
      "specific-26-12po",
      "call",
      "historical-exam",
      "supplemental",
    ]),
    status: sourceVersionStatusSchema,
    downloadedAt: z.iso.date().nullable(),
    verifiedAt: z.iso.date().nullable(),
    consultedLocator: z.string().trim().min(1),
    editorialConfidence: z
      .object({
        level: z.enum(["high", "medium", "low"]),
        reason: z.string().trim().min(1),
      })
      .strict(),
    sha256: sha256DigestSchema.nullable(),
    hashTarget: z.enum(["downloaded-page", "downloaded-file", "local-snapshot"]).nullable(),
    locatorPolicy: z.enum(["document-level", "section", "exact"]),
    artifactPath: z.string().trim().min(1).optional(),
    snapshotCommit: z.string().regex(/^[a-f0-9]{7,40}$/i).optional(),
    purpose: z.string().trim().min(1).optional(),
  })
  .strict()
  .superRefine((source, context) => {
    if (source.status === "verified") {
      if (source.sha256 === null) {
        context.addIssue({ code: "custom", path: ["sha256"], message: "Verified sources require a SHA-256 hash." });
      }
      if (source.verifiedAt === null || source.downloadedAt === null) {
        context.addIssue({
          code: "custom",
          path: ["verifiedAt"],
          message: "Verified sources require download and verification dates.",
        });
      }
      if (source.hashTarget === "local-snapshot") {
        context.addIssue({
          code: "custom",
          path: ["hashTarget"],
          message: "An unchecked local snapshot cannot be marked verified.",
        });
      }
    } else if (source.status === "needs_check" || source.status === "unavailable") {
      if (source.verifiedAt !== null) {
        context.addIssue({
          code: "custom",
          path: ["verifiedAt"],
          message: "Unchecked or unavailable source versions cannot have verifiedAt set.",
        });
      }
    } else if (source.status === "superseded" && source.verifiedAt !== null && source.sha256 === null) {
      context.addIssue({
        code: "custom",
        path: ["sha256"],
        message: "A previously verified superseded version requires its SHA-256 hash.",
      });
    }

    if ((source.sha256 === null) !== (source.hashTarget === null)) {
      context.addIssue({
        code: "custom",
        path: ["hashTarget"],
        message: "A hash target must be recorded together with its SHA-256 hash.",
      });
    }

    if (source.hashTarget === "local-snapshot" && (!source.artifactPath || !source.snapshotCommit)) {
      context.addIssue({
        code: "custom",
        path: ["artifactPath"],
        message: "Local snapshot hashes require an artifact path and source commit.",
      });
    }
  });

export const sourceManifestSchema = z
  .object({
    schemaVersion: z.literal(1),
    generatedAt: z.iso.date(),
    sources: z.array(sourceManifestEntrySchema).min(1),
  })
  .strict()
  .superRefine((manifest, context) => {
    const identities = new Set<string>();
    manifest.sources.forEach((source, index) => {
      const identity = `${source.sourceId}\u0000${source.sourceVersion}`;
      if (identities.has(identity)) {
        context.addIssue({
          code: "custom",
          path: ["sources", index, "sourceVersion"],
          message: `Duplicate source version '${source.sourceId}' / '${source.sourceVersion}'.`,
        });
      }
      identities.add(identity);
    });
  });

export type SourceManifestEntry = z.infer<typeof sourceManifestEntrySchema>;
export type SourceManifest = z.infer<typeof sourceManifestSchema>;
export type SourceVersionStatus = z.infer<typeof sourceVersionStatusSchema>;

export function parseSourceManifest(value: unknown): SourceManifest {
  return sourceManifestSchema.parse(value);
}

export const sourceManifest = parseSourceManifest(sourceManifestJson);

const sourceEvidenceSchema = z
  .object({
    sourceId: z.string().trim().min(1),
    sourceVersion: z.string().trim().min(1),
    locator: z.string().trim().min(1),
  })
  .strict();

const callFactSchema = z
  .object({
    value: z.unknown(),
    status: z.enum(["confirmed", "provisional", "announced", "unverified"]),
    evidence: sourceEvidenceSchema.nullable(),
    note: z.string().trim().min(1).optional(),
  })
  .strict();

export const convocationRecordSchema = z
  .object({
    call: z.string().regex(/^PNI\d{2}\/\d{2}$/),
    profileCode: z.string().regex(/^\d{2}\/\d{2}PO$/),
    profileName: z.string().trim().min(1),
    asOf: z.iso.date(),
    notice: z
      .object({
        sourceId: z.string().trim().min(1),
        sourceVersion: z.string().trim().min(1),
        publicationDate: z.iso.date(),
      })
      .strict(),
    facts: z
      .object({
        callDate: callFactSchema,
        totalPositions: callFactSchema,
        examDate: callFactSchema,
        sites: callFactSchema,
        positionsByProfile: z.record(z.string().trim().min(1), callFactSchema),
      })
      .strict(),
  })
  .strict();

export type ConvocationRecord = z.infer<typeof convocationRecordSchema>;

function normalizedUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return url;
  }
}

export type SourceReference = {
  sourceId: string;
  sourceVersion?: string;
  sourceUrl: string;
};

export function validateSourceReference(
  reference: SourceReference,
  manifest: SourceManifest = sourceManifest,
): string[] {
  const errors: string[] = [];
  const candidates = manifest.sources.filter((source) => source.sourceId === reference.sourceId);
  if (candidates.length === 0) {
    return [`sourceId '${reference.sourceId}' has no entry in the source manifest`];
  }

  const urlMatches = candidates.filter((source) => normalizedUrl(source.url) === normalizedUrl(reference.sourceUrl));
  if (urlMatches.length === 0) {
    return [`sourceUrl for '${reference.sourceId}' does not match any manifest version`];
  }

  if (reference.sourceVersion !== undefined) {
    if (typeof reference.sourceVersion !== "string" || reference.sourceVersion.trim() === "") {
      errors.push(`sourceVersion for '${reference.sourceId}' must be a non-empty version identifier`);
      return errors;
    }
    if (!urlMatches.some((source) => source.sourceVersion === reference.sourceVersion)) {
      errors.push(
        `sourceVersion '${reference.sourceVersion}' for '${reference.sourceId}' is missing or does not match the source URL`,
      );
    }
  } else {
    const currentVersions = urlMatches.filter((source) => source.status !== "superseded");
    if (currentVersions.length === 0) {
      errors.push(`sourceId '${reference.sourceId}' has no current manifest version for this URL`);
    } else if (currentVersions.length > 1) {
    errors.push(
        `sourceId '${reference.sourceId}' resolves to multiple current manifest versions; set sourceVersion explicitly`,
    );
    }
  }
  return errors;
}

function isAdifPrimaryCallSource(source: SourceManifestEntry): boolean {
  let hostname: string;
  try {
    hostname = new URL(source.url).hostname.toLowerCase();
  } catch {
    return false;
  }
  const isAdifHost = hostname === "adif.es" || hostname.endsWith(".adif.es");
  return source.sourceType === "primary" && source.authority === "A" && source.scope === "call" && isAdifHost;
}

export function parseConvocationRecord(value: unknown, manifest: SourceManifest = sourceManifest): ConvocationRecord {
  const record = convocationRecordSchema.parse(value);
  const notice = manifest.sources.find(
    (source) =>
      source.sourceId === record.notice.sourceId && source.sourceVersion === record.notice.sourceVersion,
  );
  if (!notice || !isAdifPrimaryCallSource(notice)) {
    throw new Error("Convocation notice must resolve to a primary ADIF call source in the manifest.");
  }

  const facts = [
    record.facts.callDate,
    record.facts.totalPositions,
    record.facts.examDate,
    record.facts.sites,
    ...Object.values(record.facts.positionsByProfile),
  ];
  for (const fact of facts) {
    if (fact.status === "unverified") {
      if (fact.evidence !== null) {
        throw new Error("An unverified call fact must not claim verified source evidence.");
      }
      continue;
    }
    if (!fact.evidence) {
      throw new Error(`Call fact '${fact.status}' requires exact primary source evidence.`);
    }
    const evidence = manifest.sources.find(
      (source) =>
        source.sourceId === fact.evidence?.sourceId && source.sourceVersion === fact.evidence?.sourceVersion,
    );
    if (!evidence || !isAdifPrimaryCallSource(evidence)) {
      throw new Error("Call fact evidence must resolve to a primary ADIF call source.");
    }
    if (fact.status === "confirmed" && evidence.status !== "verified") {
      throw new Error("A confirmed call fact requires a verified primary source version.");
    }
  }
  return record;
}
