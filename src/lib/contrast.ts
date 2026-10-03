/**
 * Pure WCAG 2.2 contrast helpers.
 *
 * These functions are the enforcement mechanism for SC 1.4.3 (Contrast
 * Minimum) and SC 1.4.11 (Non-text Contrast). They are deliberately free of
 * any DOM or framework dependency so the design guard tests can run them
 * against the real token values parsed out of `globals.css`.
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

/** Parses `#rgb` or `#rrggbb` into channel values. Throws on malformed input. */
export function hexToRgb(hex: string): Rgb {
  const value = hex.trim().replace(/^#/, "");

  const expanded =
    value.length === 3
      ? value
          .split("")
          .map((char) => char + char)
          .join("")
      : value;

  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) {
    throw new Error(`Bukan warna hex yang valid: ${hex}`);
  }

  return {
    r: Number.parseInt(expanded.slice(0, 2), 16),
    g: Number.parseInt(expanded.slice(2, 4), 16),
    b: Number.parseInt(expanded.slice(4, 6), 16),
  };
}

/** WCAG relative luminance. */
export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);

  const channel = (raw: number): number => {
    const c = raw / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/**
 * Contrast ratio between two colours, from 1 to 21.
 * Order of arguments does not matter.
 */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Rounds to 2 decimals for readable assertions and styleguide output. */
export function roundRatio(ratio: number): number {
  return Math.round(ratio * 100) / 100;
}

/** WCAG AA threshold for normal body text. */
export const AA_TEXT = 4.5;

/** WCAG AA threshold for large text (>= 24px, or >= 18.66px bold). */
export const AA_LARGE_TEXT = 3;

/** WCAG AA threshold for UI components and graphical objects (SC 1.4.11). */
export const AA_NON_TEXT = 3;
