import {
  collectSourceObservations,
  compareSourceVersion,
  writeLatestSourceObservations,
  type SourceUpdateStatus,
} from "../lib/content/source-update-check";
import { sourceManifest } from "../lib/content/source-manifest";

async function main(): Promise<void> {
  const report = await collectSourceObservations();
  await writeLatestSourceObservations(report);

  const totals = report.observations.reduce<Record<SourceUpdateStatus, number>>(
    (counts, observation) => {
      const source = sourceManifest.sources.find(
        (entry) => entry.sourceId === observation.sourceId && entry.sourceVersion === observation.sourceVersion,
      );
      const result = source ? compareSourceVersion(source, observation) : null;
      if (result) counts[result.status] += 1;
      return counts;
    },
    { unchanged: 0, candidate: 0, needs_check: 0 },
  );

  console.log(
    `Saved ${report.observations.length} observations; unchanged=${totals.unchanged}, candidate=${totals.candidate}, needs_check=${totals.needs_check}. Accepted source versions were not modified.`,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
