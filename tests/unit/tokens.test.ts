import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { describe, expect, it } from "vitest";

import {
  AA_NON_TEXT,
  AA_TEXT,
  contrastRatio,
  roundRatio,
} from "@/lib/contrast";
import { loadTokens, readToken } from "@/lib/tokens";

const ROOT = process.cwd();
const COMPONENTS_DIR = join(ROOT, "src", "components");

function walk(dir: string): string[] {
  let out: string[] = [];
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out = out.concat(walk(full));
    } else if (/\.(tsx|ts|css)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

const { css } = loadTokens();

/** Colour tokens the design contract defines. */
const COLOURS = {
  ivory: readToken(css, "color-ivory"),
  paper: readToken(css, "color-paper"),
  ink: readToken(css, "color-ink"),
  evergreen: readToken(css, "color-evergreen"),
  evergreenDeep: readToken(css, "color-evergreen-deep"),
  sage: readToken(css, "color-sage"),
  mist: readToken(css, "color-mist"),
  camellia: readToken(css, "color-camellia"),
  blush: readToken(css, "color-blush"),
  brass: readToken(css, "color-brass"),
  stone: readToken(css, "color-stone"),
  slateMuted: readToken(css, "color-slate-muted"),
  alert: readToken(css, "color-alert"),
};

describe("WCAG 2.2 AA — SC 1.4.3 text contrast", () => {
  // Every pairing here is one the UI actually renders as body-sized text.
  const textPairs: Array<[string, string, string]> = [
    ["ink di ivory", COLOURS.ink, COLOURS.ivory],
    ["ink di paper", COLOURS.ink, COLOURS.paper],
    ["ink di mist", COLOURS.ink, COLOURS.mist],
    ["ink di blush", COLOURS.ink, COLOURS.blush],
    ["ink di brass", COLOURS.ink, COLOURS.brass],
    ["evergreen di ivory", COLOURS.evergreen, COLOURS.ivory],
    ["evergreen di paper", COLOURS.evergreen, COLOURS.paper],
    ["evergreen di mist", COLOURS.evergreen, COLOURS.mist],
    ["evergreen-deep di ivory", COLOURS.evergreenDeep, COLOURS.ivory],
    ["ivory di evergreen", COLOURS.ivory, COLOURS.evergreen],
    ["ivory di evergreen-deep", COLOURS.ivory, COLOURS.evergreenDeep],
    ["camellia di ivory", COLOURS.camellia, COLOURS.ivory],
    ["camellia di paper", COLOURS.camellia, COLOURS.paper],
    ["slate-muted di ivory", COLOURS.slateMuted, COLOURS.ivory],
    ["slate-muted di paper", COLOURS.slateMuted, COLOURS.paper],
    ["slate-muted di mist", COLOURS.slateMuted, COLOURS.mist],
    ["alert di ivory", COLOURS.alert, COLOURS.ivory],
    ["alert di paper", COLOURS.alert, COLOURS.paper],
    // Badge surfaces actually rendered by the UI.
    ["ivory di camellia (badge Penting)", COLOURS.ivory, COLOURS.camellia],
    ["evergreen-deep di mist (badge kategori)", COLOURS.evergreenDeep, COLOURS.mist],
    ["slate-muted di mist", COLOURS.slateMuted, COLOURS.mist],
    ["ink di blush", COLOURS.ink, COLOURS.blush],
    ["ivory di alert", COLOURS.ivory, COLOURS.alert],
  ];

  it.each(textPairs)("%s memenuhi 4.5:1", (_label, fg, bg) => {
    const ratio = roundRatio(contrastRatio(fg, bg));
    expect(
      ratio,
      `Rasio ${fg} di ${bg} hanya ${ratio}:1 — di bawah ${AA_TEXT}:1`,
    ).toBeGreaterThanOrEqual(AA_TEXT);
  });
});

describe("WCAG 2.2 AA — SC 1.4.11 non-text contrast", () => {
  const nonTextPairs: Array<[string, string, string]> = [
    ["sage di ivory (ikon)", COLOURS.sage, COLOURS.ivory],
    ["sage di paper (ikon)", COLOURS.sage, COLOURS.paper],
    ["evergreen di ivory (cincin fokus)", COLOURS.evergreen, COLOURS.ivory],
    ["evergreen di paper (cincin fokus)", COLOURS.evergreen, COLOURS.paper],
    ["brass di ivory (kelopak terisi)", COLOURS.brass, COLOURS.ivory],
    ["brass di paper (kelopak terisi)", COLOURS.brass, COLOURS.paper],
    ["camellia di ivory (indikator)", COLOURS.camellia, COLOURS.ivory],
    ["alert di ivory (indikator)", COLOURS.alert, COLOURS.ivory],
  ];

  it.each(nonTextPairs)("%s memenuhi 3:1", (_label, fg, bg) => {
    const ratio = roundRatio(contrastRatio(fg, bg));
    expect(
      ratio,
      `Rasio non-teks ${fg} di ${bg} hanya ${ratio}:1 — di bawah ${AA_NON_TEXT}:1`,
    ).toBeGreaterThanOrEqual(AA_NON_TEXT);
  });
});

describe("Kontrak warna: brass dilarang untuk teks normal", () => {
  it("brass gagal 4.5:1 di ivory — karena itu hanya boleh dekoratif", () => {
    const ratio = roundRatio(contrastRatio(COLOURS.brass, COLOURS.ivory));
    expect(ratio).toBeLessThan(AA_TEXT);
  });

  it("teks di atas brass tetap aman memakai ink", () => {
    const ratio = roundRatio(contrastRatio(COLOURS.ink, COLOURS.brass));
    expect(ratio).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it("brass tetap lolos ambang non-teks sehingga boleh jadi indikator", () => {
    const ratio = roundRatio(contrastRatio(COLOURS.brass, COLOURS.ivory));
    expect(ratio).toBeGreaterThanOrEqual(AA_NON_TEXT);
  });
});

describe("Skala spacing — tidak ada nilai liar", () => {
  const REQUIRED_SPACING = [
    "hair",
    "tight",
    "snug",
    "card",
    "card-lg",
    "block",
    "section",
    "section-lg",
    "gutter",
    "gutter-lg",
    "shell",
  ];

  it.each(REQUIRED_SPACING)("token --spacing-%s terdefinisi", (name) => {
    const value = readToken(css, `spacing-${name}`);
    expect(value).toMatch(/^\d+(\.\d+)?px$/);
  });

  it("semua nilai spacing adalah kelipatan 4px", () => {
    for (const name of REQUIRED_SPACING) {
      const px = Number.parseFloat(readToken(css, `spacing-${name}`));
      expect(px % 4, `--spacing-${name} = ${px}px bukan kelipatan 4px`).toBe(0);
    }
  });

  it("komponen tidak memakai utilitas spacing/radius arbitrary", () => {
    const offenders: string[] = [];
    // Matches Tailwind arbitrary values such as p-[13px] or gap-[7px].
    const arbitrary = /(?:^|[\s"'])(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|space-[xy]|w|h|size|rounded|text|leading|tracking)-\[[^\]]+\]/g;

    for (const file of walk(COMPONENTS_DIR)) {
      const source = readFileSync(file, "utf8");
      for (const match of source.match(arbitrary) ?? []) {
        offenders.push(`${relative(ROOT, file)}: ${match.trim()}`);
      }
    }

    expect(offenders, `Nilai arbitrary ditemukan:\n${offenders.join("\n")}`).toEqual([]);
  });

  it("komponen tidak menulis hex mentah — token wajib", () => {
    const offenders: string[] = [];
    for (const file of walk(COMPONENTS_DIR)) {
      if (!file.endsWith(".tsx") && !file.endsWith(".ts")) continue;
      const source = readFileSync(file, "utf8");
      for (const match of source.match(/#[0-9a-fA-F]{3,8}\b/g) ?? []) {
        offenders.push(`${relative(ROOT, file)}: ${match}`);
      }
    }
    expect(offenders, `Hex mentah ditemukan:\n${offenders.join("\n")}`).toEqual([]);
  });
});

describe("Skala radius — konsentris", () => {
  it("radius dalam = radius luar − padding cangkang", () => {
    const outer = Number.parseFloat(readToken(css, "radius-2xl"));
    const shell = Number.parseFloat(readToken(css, "spacing-shell"));
    const inner = Number.parseFloat(readToken(css, "radius-xl"));
    expect(inner).toBe(outer - shell);
  });
});
