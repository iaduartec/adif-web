import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  collectSourceObservations,
  compareSourceVersion,
  parseSourceUpdateReport,
  serializeSourceUpdateReport,
  sourceObservationSchema,
  type SourceObservation,
} from "../lib/content/source-update-check";
import { sourceManifest } from "../lib/content/source-manifest";

afterEach(() => vi.unstubAllGlobals());

const previous = sourceManifest.sources.find((source) => source.sourceId === "Ley 31/1995")!;

function observation(overrides: Partial<SourceObservation> = {}): SourceObservation {
  return {
    sourceId: previous.sourceId,
    sourceVersion: previous.sourceVersion,
    url: previous.url,
    httpStatus: 200,
    checkedAt: "2026-10-15T20:00:00Z",
    etag: 'W/"boe-31-1995"',
    sha256: previous.sha256 ?? undefined,
    contentLength: 12345,
    ...overrides,
  };
}

describe("official source update observations", () => {
  it("returns unchanged when the verified source hash matches", () => {
    const result = compareSourceVersion(previous, observation());
    expect(result.status).toBe("unchanged");
    expect(result).not.toHaveProperty("verified");
  });

  it("accepts a 304 only when its strong response ETag matches the verified request validator", () => {
    const etag = '"boe-31-1995"';
    const previousWithEtag = { ...previous, etag };
    const conditionalObservation = observation({
      httpStatus: 304,
      ifNoneMatch: etag,
      etag,
      sha256: undefined,
      contentLength: undefined,
    });
    expect(compareSourceVersion(previousWithEtag, conditionalObservation).status).toBe("unchanged");
    expect(
      compareSourceVersion(
        previousWithEtag,
        { ...conditionalObservation, etag: 'W/"boe-31-1995"' },
      ).status,
    ).toBe("needs_check");
    expect(
      compareSourceVersion(
        previousWithEtag,
        { ...conditionalObservation, ifNoneMatch: undefined },
      ).status,
    ).toBe("needs_check");
  });

  it("does not treat a matching ETag without a complete body hash as unchanged", () => {
    const weakEtag = 'W/"boe-31-1995"';
    const strongEtag = '"boe-31-1995"';
    expect(
      compareSourceVersion(
        { ...previous, etag: weakEtag },
        observation({ sha256: undefined, etag: weakEtag }),
      ).status,
    ).toBe("needs_check");
    expect(
      compareSourceVersion(
        { ...previous, etag: strongEtag },
        observation({ sha256: undefined, etag: strongEtag }),
      ).status,
    ).toBe("needs_check");
  });

  it("creates a candidate when bytes change at the same official URL", () => {
    const changedHash = `0${previous.sha256?.slice(1)}`;
    const result = compareSourceVersion(previous, observation({ sha256: changedHash }));
    expect(result).toMatchObject({ status: "candidate", candidateSha256: changedHash });

    const previousWithEtag = { ...previous, etag: 'W/"boe-31-1995"' };
    expect(
      compareSourceVersion(previousWithEtag, observation({ sha256: changedHash })).status,
    ).toBe("candidate");
  });

  it("leaves a forbidden response at needs_check and retains the prior manifest version", () => {
    const result = compareSourceVersion(previous, observation({ httpStatus: 403, sha256: undefined }));
    expect(result.status).toBe("needs_check");
    expect(previous.sha256).toBeDefined();
    expect(result).not.toHaveProperty("candidateSha256");
  });

  it.each(["timeout", "network"] as const)("records a %s without inventing an HTTP status", (failureKind) => {
    const report = parseSourceUpdateReport({
      schemaVersion: 1,
      generatedAt: "2026-10-15T20:00:00Z",
      observations: [observation({ httpStatus: null, failureKind, etag: undefined, sha256: undefined, contentLength: undefined })],
    });
    expect(compareSourceVersion(previous, report.observations[0]!).status).toBe("needs_check");
  });

  it("records fetch rejection as a network failure", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Promise.reject(new TypeError("network unavailable"))));

    const report = await collectSourceObservations(
      { ...sourceManifest, sources: [previous] },
      { concurrency: 1 },
    );

    expect(report.observations[0]).toMatchObject({ httpStatus: null, failureKind: "network" });
  });

  it("records an aborted request as a timeout", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_input: RequestInfo | URL, init?: RequestInit) =>
          new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener(
              "abort",
              () => reject(new DOMException("request timed out", "AbortError")),
              { once: true },
            );
          }),
      ),
    );

    const report = await collectSourceObservations(
      { ...sourceManifest, sources: [previous] },
      { concurrency: 1, timeoutMs: 10 },
    );

    expect(report.observations[0]).toMatchObject({ httpStatus: null, failureKind: "timeout" });
  });

  it("records a redirect without following its location", async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      expect(init?.redirect).toBe("manual");
      return new Response(null, {
        status: 302,
        headers: { location: "https://example.invalid/redirect-target" },
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const report = await collectSourceObservations(
      { ...sourceManifest, sources: [previous] },
      { concurrency: 1 },
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(report.observations[0]).toMatchObject({ httpStatus: 302 });
    expect(compareSourceVersion(previous, report.observations[0]!).status).toBe("needs_check");
  });

  it("requires a failure kind when no HTTP response exists and forbids one with a response", () => {
    expect(
      sourceObservationSchema.safeParse(observation({ httpStatus: null, failureKind: undefined, sha256: undefined })).success,
    ).toBe(false);
    expect(
      sourceObservationSchema.safeParse(observation({ httpStatus: 403, failureKind: "network", sha256: undefined })).success,
    ).toBe(false);
    expect(
      sourceObservationSchema.safeParse(
        observation({ httpStatus: 304, ifNoneMatch: 'W/"weak"', sha256: undefined }),
      ).success,
    ).toBe(false);
  });

  it("uses a verified strong ETag for a conditional request and records an exact 304", async () => {
    const etag = '"boe-31-1995"';
    const source = { ...previous, etag };
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      expect(new Headers(init?.headers).get("if-none-match")).toBe(etag);
      return new Response(null, { status: 304, headers: { etag } });
    });
    vi.stubGlobal("fetch", fetchMock);

    const report = await collectSourceObservations(
      { ...sourceManifest, sources: [source] },
      { concurrency: 1 },
    );
    const observed = report.observations[0]!;

    expect(observed).toMatchObject({ httpStatus: 304, ifNoneMatch: etag, etag });
    expect(compareSourceVersion(source, observed).status).toBe("unchanged");
  });

  it("leaves an interrupted body at needs_check even when its weak ETag matches", async () => {
    const weakEtag = 'W/"boe-31-1995"';
    const source = { ...previous, etag: weakEtag };
    const response = new Response(
      new ReadableStream<Uint8Array>({
        start(controller) {
          controller.error(new Error("connection reset while reading"));
        },
      }),
      { status: 200, headers: { etag: weakEtag } },
    );
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
        expect(new Headers(init?.headers).get("if-none-match")).toBeNull();
        return response;
      }),
    );

    const report = await collectSourceObservations(
      { ...sourceManifest, sources: [source] },
      { concurrency: 1 },
    );
    const observed = report.observations[0]!;

    expect(observed.sha256).toBeUndefined();
    expect(observed.etag).toBe(weakEtag);
    expect(compareSourceVersion(source, observed).status).toBe("needs_check");
  });

  it("rejects malformed observation and report dates", () => {
    expect(() => sourceObservationSchema.parse(observation({ checkedAt: "yesterday" }))).toThrow(/date|datetime/i);
    expect(() =>
      parseSourceUpdateReport({ schemaVersion: 1, generatedAt: "yesterday", observations: [] }),
    ).toThrow(/date|datetime/i);
  });

  it("serializes and validates the latest observation report without accepting unknown versions", () => {
    const report = {
      schemaVersion: 1 as const,
      generatedAt: "2026-10-15T20:00:00Z",
      observations: [observation()],
    };
    const serialized = serializeSourceUpdateReport(report);
    expect(parseSourceUpdateReport(JSON.parse(serialized))).toEqual(report);

    expect(() =>
      parseSourceUpdateReport({
        ...report,
        observations: [observation({ sourceVersion: "unknown-version" })],
      }),
    ).toThrow(/manifest|version/i);
  });

  it("loads the checked-in latest report through its schema", () => {
    const latest = JSON.parse(
      readFileSync(resolve(process.cwd(), "content/source-observations/latest.json"), "utf8"),
    ) as unknown;
    expect(parseSourceUpdateReport(latest).observations.length).toBeGreaterThan(0);
  });
});
