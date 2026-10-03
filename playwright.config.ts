import { defineConfig } from "@playwright/test";

// Chosen deliberately: 3000 and 3100 are commonly held by other dev servers
// on this machine, and the suite must not fight them for a port.
const PORT = 4317;

/**
 * Runs against the production build, because that is the only mode where the
 * service worker registers. Mobile-first viewport by default; individual
 * tests resize for desktop and narrow-reflow checks.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    viewport: { width: 390, height: 844 },
    trace: "off",
    video: "off",
  },
  webServer: {
    command: `npm run start -- --port ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
