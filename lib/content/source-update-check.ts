import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { z } from "zod";

import { sha256DigestSchema } from "./schema";
import {
  sourceManifest,
  type SourceManifest,
  type SourceManifestEntry,
} from "./source-manifest";

function isStrongEntityTag(value: string | undefined): value is string {
  return value !== undefined && /^"[\x21\x23-\x7E\x80-\u00FF]*"$/.test(value);
}

export const sourceObservationSchema = z
  .object({
    sourceId: z.string().trim().min(1),
    sourceVersion: z.string().trim().min(1),
    url: z.url().refine((value) => new URL(value).protocol === "https:", {
      message: "Observed source URLs must use HTTPS.",
    }),
    httpStatus: z.number().int().min(100).max(599).nullable(),
    failureKind: z.enum(["timeout", "network"]).optional(),
    checkedAt: z.iso.datetime(),
    etag: z.string().trim().min(1).optional(),
    ifNoneMatch: z
      .string()
      .regex(/^"[\x21\x23-\x7E\x80-\u00FF]*"$/, "If-None-Match must contain a strong entity tag.")
      .optional(),
    lastModified: z.string().trim().min(1).optional(),
    contentLength: z.number().int().nonnegative().optional(),
    sha256: sha256DigestSchema.optional(),
  })
  .strict()
  .superRefine((observation, context) => {
    if (observation.httpStatus === null) {
      if (!observation.failureKind) {
        context.addIssue({
          code: "custom",
          path: ["failureKind"],
          message: "A missing HTTP response requires a timeout or network failure kind.",
        });
      }
      if (
        observation.etag !== undefined ||
        observation.lastModified !== undefined ||
        observation.contentLength !== undefined ||
        observation.sha256 !== undefined
      ) {
        context.addIssue({
          code: "custom",
          path: ["httpStatus"],
          message: "Transport failures cannot carry HTTP response metadata or a body hash.",
        });
      }
    } else {
      if (observation.failureKind !== undefined) {
        context.addIssue({
          code: "custom",
          path: ["failureKind"],
          message: "An HTTP response cannot also be classified as a transport failure.",
        });
      }
      if (observation.httpStatus !== 200 && observation.sha256 !== undefined) {
        context.addIssue({
          code: "custom",
          path: ["sha256"],
          message: "Only a successful HTTP 200 source response may be hashed as a source version.",
        });
      }
    }
  });

export const sourceUpdateReportSchema = z
  .object({
    schemaVersion: z.literal(1),
    generatedAt: z.iso.datetime(),
    observations: z.array(sourceObservationSchema),
  })
  .strict()
  .superRefine((report, context) => {
    const seen = new Set<string>();
    report.observations.forEach((observation, index) => {
      const key = `${observation.sourceId}\u0000${observation.sourceVersion}`;
      if (seen.has(key)) {
        context.addIssue({
          code: "custom",
          path: ["observations", index],
          message: `Duplicate observation for '${observation.sourceId}' / '${observation.sourceVersion}'.`,
        });
      }
      seen.add(key);
    });
  });

export type SourceObservation = z.infer<typeof sourceObservationSchema>;
export type SourceUpdateReport = z.infer<typeof sourceUpdateReportSchema>;
export type SourceUpdateStatus = "unchanged" | "candidate" | "needs_check";

export type SourceUpdateResult = {
  sourceId: string;
  sourceVersion: string;
  status: SourceUpdateStatus;
  reason: string;
  candidateSha256?: string;
};

export function parseSourceUpdateReport(
  value: unknown,
  manifest: SourceManifest = sourceManifest,
): SourceUpdateReport {
  const report = sourceUpdateReportSchema.parse(value);
  for (const [index, observation] of report.observations.entries()) {
    const source = manifest.sources.find(
      (entry) =>
        entry.sourceId === observation.sourceId && entry.sourceVersion === observation.sourceVersion,
    );
    if (!source || source.status === "superseded" || source.status === "unavailable") {
      throw new Error(
        `Observation ${index} refers to an unknown or inactive manifest source version '${observation.sourceId}' / '${observation.sourceVersion}'.`,
      );
    }
    if (normalizeUrl(source.url) !== normalizeUrl(observation.url)) {
      throw new Error(
        `Observation ${index} URL does not match manifest source '${observation.sourceId}' / '${observation.sourceVersion}'.`,
      );
    }
  }
  return report;
}

export function serializeSourceUpdateReport(
  value: unknown,
  manifest: SourceManifest = sourceManifest,
): string {
  return `${JSON.stringify(parseSourceUpdateReport(value, manifest), null, 2)}\n`;
}

export function compareSourceVersion(
  previous: SourceManifestEntry,
  observed: SourceObservation,
): SourceUpdateResult {
  const base = { sourceId: previous.sourceId, sourceVersion: previous.sourceVersion };
  if (
    observed.sourceId !== previous.sourceId ||
    observed.sourceVersion !== previous.sourceVersion ||
    normalizeUrl(observed.url) !== normalizeUrl(previous.url)
  ) {
    return { ...base, status: "needs_check", reason: "Observation identity does not match the manifest version." };
  }

  if (observed.httpStatus === null) {
    return {
      ...base,
      status: "needs_check",
      reason: `No HTTP response was received (${observed.failureKind}).`,
    };
  }
  if (observed.httpStatus === 304) {
    if (
      previous.status === "verified" &&
      previous.sha256 !== null &&
      isStrongEntityTag(previous.etag) &&
      observed.ifNoneMatch === previous.etag &&
      observed.etag === previous.etag
    ) {
      return {
        ...base,
        status: "unchanged",
        reason: "A conditional GET returned the exact previously verified strong ETag.",
      };
    }
    return {
      ...base,
      status: "needs_check",
      reason: "HTTP 304 did not prove an exact match to a verified strong ETag.",
    };
  }
  if (observed.httpStatus !== 200) {
    return {
      ...base,
      status: "needs_check",
      reason: `Source returned HTTP ${observed.httpStatus}; the accepted version is retained.`,
    };
  }

  if (observed.sha256 !== undefined) {
    if (previous.sha256 !== null && observed.sha256 === previous.sha256) {
      if (previous.status === "verified") {
        return {
          ...base,
          status: "unchanged",
          reason: "Downloaded SHA-256 matches the verified manifest version.",
        };
      }
      return {
        ...base,
        status: "needs_check",
        reason: "The observation matches the local snapshot, but the accepted manifest version is not verified.",
      };
    }
    return {
      ...base,
      status: "candidate",
      reason: "Downloaded bytes differ from the accepted manifest version and require review.",
      candidateSha256: observed.sha256,
    };
  }

  return {
    ...base,
    status: "needs_check",
    reason: "The source returned HTTP 200 but its body was not fully hashed.",
  };
}

function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return url;
  }
}

async function observeSource(source: SourceManifestEntry, timeoutMs: number): Promise<SourceObservation> {
  const checkedAt = new Date().toISOString();
  const ifNoneMatch = source.status === "verified" && isStrongEntityTag(source.etag) ? source.etag : undefined;
  const requestMetadata = ifNoneMatch ? { ifNoneMatch } : {};
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let response: Response;
  try {
    response = await fetch(source.url, {
      method: "GET",
      // A redirect is recorded as an HTTP response for review. Do not silently
      // hash content served from a host other than the authority in the manifest.
      redirect: "manual",
      signal: controller.signal,
      headers: {
        "user-agent": "ADIF source version checker/1.0",
        ...(ifNoneMatch ? { "if-none-match": ifNoneMatch } : {}),
      },
    });
  } catch {
    clearTimeout(timer);
    const failureKind = controller.signal.aborted ? "timeout" : "network";
    return sourceObservationSchema.parse({
      sourceId: source.sourceId,
      sourceVersion: source.sourceVersion,
      url: source.url,
      httpStatus: null,
      failureKind,
      checkedAt,
      ...requestMetadata,
    });
  }

  const etag = response.headers.get("etag") ?? undefined;
  const lastModified = response.headers.get("last-modified") ?? undefined;
  const declaredLength = response.headers.get("content-length");
  const metadata = {
    sourceId: source.sourceId,
    sourceVersion: source.sourceVersion,
    url: source.url,
    httpStatus: response.status,
    checkedAt,
    ...requestMetadata,
    ...(etag ? { etag } : {}),
    ...(lastModified ? { lastModified } : {}),
  };
  if (response.status !== 200) {
    clearTimeout(timer);
    await response.body?.cancel().catch(() => undefined);
    return sourceObservationSchema.parse({
      ...metadata,
      ...(declaredLength && /^\d+$/.test(declaredLength) ? { contentLength: Number(declaredLength) } : {}),
    });
  }

  const hash = createHash("sha256");
  let contentLength = 0;
  try {
    const reader = response.body?.getReader();
    if (!reader) throw new Error("Successful source response had no body stream.");
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      hash.update(value);
      contentLength += value.byteLength;
    }
    return sourceObservationSchema.parse({
      ...metadata,
      contentLength,
      sha256: hash.digest("hex"),
    });
  } catch {
    return sourceObservationSchema.parse({
      ...metadata,
      ...(declaredLength && /^\d+$/.test(declaredLength) ? { contentLength: Number(declaredLength) } : {}),
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function collectSourceObservations(
  manifest: SourceManifest = sourceManifest,
  options: { timeoutMs?: number; concurrency?: number } = {},
): Promise<SourceUpdateReport> {
  const timeoutMs = options.timeoutMs ?? 15_000;
  const concurrency = Math.max(1, Math.min(options.concurrency ?? 3, 8));
  const sources = manifest.sources.filter(
    (source) =>
      (source.sourceType === "primary" ||
        source.scope === "common" ||
        source.scope === "specific-26-12po") &&
      source.status !== "superseded" &&
      source.status !== "unavailable",
  );
  const observations: SourceObservation[] = new Array(sources.length);
  let cursor = 0;
  const worker = async () => {
    while (cursor < sources.length) {
      const index = cursor++;
      const source = sources[index];
      if (source) observations[index] = await observeSource(source, timeoutMs);
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, sources.length) }, worker));
  return parseSourceUpdateReport({ schemaVersion: 1, generatedAt: new Date().toISOString(), observations }, manifest);
}

export async function writeLatestSourceObservations(
  report: unknown,
  targetPath = resolve(process.cwd(), "content/source-observations/latest.json"),
): Promise<void> {
  const serialized = serializeSourceUpdateReport(report);
  await mkdir(dirname(targetPath), { recursive: true });
  await writeFile(targetPath, serialized, "utf8");
}

export async function readSourceUpdateReport(
  reportPath = resolve(process.cwd(), "content/source-observations/latest.json"),
  manifest: SourceManifest = sourceManifest,
): Promise<SourceUpdateReport> {
  return parseSourceUpdateReport(JSON.parse(await readFile(reportPath, "utf8")) as unknown, manifest);
}
