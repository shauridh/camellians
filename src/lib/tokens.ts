import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Reads the design tokens straight out of `globals.css`.
 *
 * Both the guard tests and the `/gaya` styleguide use this, so the numbers a
 * reviewer sees on screen are parsed from the same source the tests assert
 * against — they cannot drift apart. Server-side only (uses node:fs).
 */

export const GLOBALS_CSS_PATH = join(process.cwd(), "src", "app", "globals.css");

export interface ColourToken {
  /** Token name without the `--color-` prefix, e.g. `evergreen-deep`. */
  name: string;
  hex: string;
}

export interface SpacingToken {
  name: string;
  px: number;
}

/** Reads a single `--name: value;` declaration. Throws when absent. */
export function readToken(css: string, name: string): string {
  const match = css.match(new RegExp(`--${name}:\\s*([^;]+);`));
  if (!match) {
    throw new Error(`Token --${name} tidak ditemukan di globals.css`);
  }
  return match[1].trim();
}

/** Reads an optional token, returning undefined instead of throwing. */
export function readOptionalToken(css: string, name: string): string | undefined {
  const match = css.match(new RegExp(`--${name}:\\s*([^;]+);`));
  return match?.[1].trim();
}

/** All `--color-*` hex tokens declared in `@theme`. */
export function readColourTokens(css: string): ColourToken[] {
  const theme = css.slice(css.indexOf("@theme"), css.indexOf(":root"));
  const out: ColourToken[] = [];
  const pattern = /--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8});/g;
  for (const match of theme.matchAll(pattern)) {
    out.push({ name: match[1], hex: match[2] });
  }
  return out;
}

/** All `--spacing-*` px tokens declared in `@theme`, in declaration order. */
export function readSpacingTokens(css: string): SpacingToken[] {
  const theme = css.slice(css.indexOf("@theme"), css.indexOf(":root"));
  const out: SpacingToken[] = [];
  const pattern = /--spacing-([a-z0-9-]+):\s*(\d+(?:\.\d+)?)px;/g;
  for (const match of theme.matchAll(pattern)) {
    out.push({ name: match[1], px: Number.parseFloat(match[2]) });
  }
  return out;
}

/** All `--radius-*` px tokens declared in `@theme`. */
export function readRadiusTokens(css: string): SpacingToken[] {
  const theme = css.slice(css.indexOf("@theme"), css.indexOf(":root"));
  const out: SpacingToken[] = [];
  const pattern = /--radius-([a-z0-9-]+):\s*(\d+(?:\.\d+)?)px;/g;
  for (const match of theme.matchAll(pattern)) {
    out.push({ name: match[1], px: Number.parseFloat(match[2]) });
  }
  return out;
}

/** Loads and parses globals.css from disk. */
export function loadTokens() {
  const css = readFileSync(GLOBALS_CSS_PATH, "utf8");
  return {
    css,
    colours: readColourTokens(css),
    spacing: readSpacingTokens(css),
    radii: readRadiusTokens(css),
  };
}
