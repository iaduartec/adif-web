import path from "node:path";
import { fileURLToPath } from "node:url";

export const retiredCourseImporterMessage =
  "The synthetic course importer has been retired. Run `pnpm content:import-official` to import the verified ADIF exam bank.";

export async function importCourseContent(): Promise<never> {
  throw new Error(retiredCourseImporterMessage);
}

const executedAsScript = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (executedAsScript) {
  importCourseContent().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
