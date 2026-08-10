import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  // Next only exposes explicitly declared variables to client modules. Playwright's
  // webServer sets this to true; normal builds inline false and therefore fail closed.
  env: {
    PLAYWRIGHT_TEST: process.env.PLAYWRIGHT_TEST === "true" ? "true" : "false",
  },
  turbopack: {
    root: path.dirname(fileURLToPath(import.meta.url)),
  },
};

export default nextConfig;
