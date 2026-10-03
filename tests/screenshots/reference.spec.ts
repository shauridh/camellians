import { test } from "@playwright/test";

/**
 * Captures reference screenshots at the three breakpoints the plan names.
 *
 * Not an assertion suite: it produces the artefacts a reviewer looks at so the
 * design can be judged rather than inferred. Run with `npm run test:e2e`.
 */

const BREAKPOINTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
] as const;

const PAGES = [
  { name: "beranda", path: "/" },
  { name: "iuran", path: "/iuran" },
  { name: "offline", path: "/~offline" },
  { name: "gaya", path: "/gaya" },
] as const;

for (const bp of BREAKPOINTS) {
  for (const target of PAGES) {
    test(`screenshot ${target.name} @ ${bp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto(target.path);
      await page.waitForLoadState("networkidle");
      // Let fonts settle so type is measured, not the fallback face.
      await page.waitForTimeout(400);

      await page.screenshot({
        path: `public/screenshots/${target.name}-${bp.name}.png`,
        fullPage: false,
      });
    });
  }
}
