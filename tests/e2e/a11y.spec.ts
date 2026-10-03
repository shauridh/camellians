import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * The accessibility contract from the plan, enforced rather than documented.
 *
 * Each block names the WCAG 2.2 success criterion it pins, so a failure says
 * which promise broke rather than merely which selector moved.
 */

const ROUTES = [
  "/",
  "/iuran",
  "/pengumuman",
  "/keluhan",
  "/direktori",
  "/agenda",
  "/arisan",
  "/keamanan",
  "/laporan-kas",
  "/admin",
  "/gaya",
  "/~offline",
] as const;

test.describe("axe-core — SC 1.3.1, 4.1.2", () => {
  for (const route of ROUTES) {
    test(`tidak ada pelanggaran axe di ${route}`, async ({ page }) => {
      await page.goto(route);
      // Let fonts and the reveal animation settle before auditing.
      await page.waitForLoadState("networkidle");

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();

      expect(
        results.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => n.target.join(" ")),
        })),
      ).toEqual([]);
    });
  }
});

test.describe("SC 2.5.8 Target Size", () => {
  test("setiap kontrol minimal 44x44px", async ({ page }) => {
    await page.goto("/");

    // Anchors rendered inline inside a sentence are exempt under SC 2.5.8
    // ("Inline" exception); everything else must clear 44x44.
    const tooSmall = await page.evaluate(() => {
      const selector = "a[href], button, [role='button'], input, select, textarea";
      const offenders: Array<{ text: string; w: number; h: number }> = [];

      for (const el of Array.from(document.querySelectorAll<HTMLElement>(selector))) {
        const style = getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") continue;
        if (style.display === "inline") continue; // inline text link exception

        const rect = el.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) continue;
        // Screen-reader-only controls are clipped to ~1px until focused; they
        // are not visible targets, and their visible state is asserted
        // separately below.
        if (rect.width <= 4 || rect.height <= 4) continue;
        if (rect.width < 44 || rect.height < 44) {
          offenders.push({
            text: (el.textContent ?? el.getAttribute("aria-label") ?? "").trim().slice(0, 40),
            w: Math.round(rect.width),
            h: Math.round(rect.height),
          });
        }
      }
      return offenders;
    });

    expect(tooSmall).toEqual([]);
  });

  test("tab bar mobile tetap 44px di viewport sempit", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto("/");

    // The mobile landmark only — the desktop sidebar is display:none here and
    // would report a height of 0.
    const tabHeights = await page.evaluate(() => {
      const nav = document.querySelector("nav[aria-label='Navigasi bawah']");
      if (!nav) return [];
      return Array.from(nav.querySelectorAll("a, button"))
        .filter((el) => getComputedStyle(el).display !== "none")
        .map((el) => Math.round(el.getBoundingClientRect().height));
    });

    expect(tabHeights.length).toBeGreaterThan(0);
    for (const height of tabHeights) {
      expect(height).toBeGreaterThanOrEqual(44);
    }
  });
});

test.describe("SC 2.4.1 Bypass Blocks", () => {
  test("Tab pertama memfokuskan tautan lewati konten", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");

    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      return el ? (el.textContent ?? "").trim() : "";
    });

    expect(focused).toContain("Lewati ke konten");
  });

  test("tautan lewati konten cukup besar saat terlihat", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");

    // Once focused it becomes a real, visible target and must meet 44x44.
    const box = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return { w: Math.round(rect.width), h: Math.round(rect.height) };
    });

    expect(box).not.toBeNull();
    expect(box?.h ?? 0).toBeGreaterThanOrEqual(44);
    expect(box?.w ?? 0).toBeGreaterThanOrEqual(44);
  });
});

test.describe("SC 2.4.7 Focus Visible", () => {
  test("setiap perhentian Tab punya cincin fokus terlihat", async ({ page }) => {
    await page.goto("/");

    const seen: string[] = [];
    for (let i = 0; i < 14; i += 1) {
      await page.keyboard.press("Tab");
      const result = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        const style = getComputedStyle(el);
        const outlineWidth = Number.parseFloat(style.outlineWidth || "0");
        const hasOutline =
          style.outlineStyle !== "none" && outlineWidth >= 2;
        return {
          label:
            (el.getAttribute("aria-label") ?? el.textContent ?? el.tagName)
              .trim()
              .slice(0, 30),
          hasOutline,
        };
      });
      if (result) {
        seen.push(result.label);
        expect(result.hasOutline, `Fokus tanpa outline pada "${result.label}"`).toBe(true);
      }
    }

    expect(seen.length).toBeGreaterThan(3);
  });
});

test.describe("SC 1.4.10 Reflow", () => {
  test("tanpa gulir horizontal pada 320px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });

    for (const route of ["/", "/iuran", "/gaya"] as const) {
      await page.goto(route);
      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return {
          scrollWidth: doc.scrollWidth,
          clientWidth: doc.clientWidth,
        };
      });
      expect(
        overflow.scrollWidth,
        `${route} meluber: ${overflow.scrollWidth}px > ${overflow.clientWidth}px`,
      ).toBeLessThanOrEqual(overflow.clientWidth + 1);
    }
  });
});

test.describe("SC 1.4.12 Text Spacing", () => {
  test("teks tidak terpotong setelah spacing diperbesar", async ({ page }) => {
    await page.goto("/");

    await page.addStyleTag({
      content: `
        * {
          line-height: 1.5 !important;
          letter-spacing: 0.12em !important;
          word-spacing: 0.16em !important;
        }
        p { margin-bottom: 2em !important; }
      `,
    });

    const clipped = await page.evaluate(() => {
      const offenders: Array<{ text: string; scroll: number; client: number }> = [];
      for (const el of Array.from(
        document.querySelectorAll<HTMLElement>("p, h1, h2, h3, li"),
      )) {
        if (!el.textContent?.trim()) continue;
        const style = getComputedStyle(el);
        if (style.display === "none") continue;
        // Only flags genuine vertical clipping, not intended ellipsis.
        if (style.overflow === "hidden" && style.textOverflow === "ellipsis") continue;
        if (el.scrollHeight > el.clientHeight + 2 && el.clientHeight > 0) {
          offenders.push({
            text: (el.textContent ?? "").trim().slice(0, 30),
            scroll: el.scrollHeight,
            client: el.clientHeight,
          });
        }
      }
      return offenders;
    });

    expect(clipped).toEqual([]);
  });
});

test.describe("SC 2.3.3 Animation from Interactions", () => {
  test("reduced-motion menonaktifkan transisi dan animasi", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const durations = await page.evaluate(() => {
      const out: string[] = [];
      for (const el of Array.from(document.querySelectorAll<HTMLElement>("*")).slice(0, 80)) {
        const style = getComputedStyle(el);
        out.push(style.animationDuration, style.transitionDuration);
      }
      return out;
    });

    // globals.css collapses both to 0.01ms under reduced motion.
    for (const value of durations) {
      const seconds = Number.parseFloat(value || "0");
      expect(seconds).toBeLessThanOrEqual(0.01);
    }
  });
});

test.describe("SC 1.4.13 / 2.1.2 — menu Lainnya", () => {
  test("sheet dapat ditutup dengan Escape", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Lainnya" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("tautan sekunder di dalam sheet tetap dapat dijangkau", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Lainnya" }).click();
    await page.getByRole("link", { name: "Arisan" }).click();
    await expect(page).toHaveURL(/\/arisan$/);
  });
});
