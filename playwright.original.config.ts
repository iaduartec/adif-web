import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "original-practice.spec.ts",
  workers: 1,
  reporter: "line",
  use: { baseURL: "http://127.0.0.1:3107", trace: "on-first-retry" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "PLAYWRIGHT_TEST=true pnpm exec next dev -H 127.0.0.1 -p 3107",
    url: "http://127.0.0.1:3107",
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
