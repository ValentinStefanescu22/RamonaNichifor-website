import { defineConfig, devices } from "@playwright/test";

// BASE_URL points the suite at a deployed preview; otherwise it builds and serves the app locally.
const port = process.env.PORT ?? "3100";
const baseURL = process.env.BASE_URL ?? `http://localhost:${port}`;

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  // the crawl tests are heavy; more workers starve a single `next start` and time out
  workers: 3,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: { baseURL, trace: "retain-on-failure" },
  webServer: process.env.BASE_URL
    ? undefined
    : { command: `npm run build && npx next start -p ${port}`, url: baseURL, reuseExistingServer: true, timeout: 240_000 },
  projects: [
    // phone = Ramona's visitors: iPhone 15 (393px) in WebKit
    { name: "phone", use: { ...devices["iPhone 15"] } },
    // laptops: her own window is under 1280px
    { name: "laptop-1024", use: { browserName: "chromium", viewport: { width: 1024, height: 768 } } },
    { name: "laptop-1180", use: { browserName: "chromium", viewport: { width: 1180, height: 800 } } },
    { name: "laptop-1440", use: { browserName: "chromium", viewport: { width: 1440, height: 900 } } },
  ],
});
