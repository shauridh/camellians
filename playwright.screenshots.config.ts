import { defineConfig } from "@playwright/test";

const PORT = 4317;

/**
 * Artefact generation, deliberately kept out of the assertion suite: the main
 * config points `testDir` at `tests/e2e`, so these capture runs only happen
 * when asked for via `npm run test:shots`.
 */
export default defineConfig({
  testDir: "./tests/screenshots",
  timeout: 60_000,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "off",
  },
  webServer: {
    command: `npm run start -- --port ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
