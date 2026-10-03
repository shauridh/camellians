import { describe, expect, it } from "vitest";

import {
  AA_LARGE_TEXT,
  AA_NON_TEXT,
  AA_TEXT,
  contrastRatio,
  hexToRgb,
  relativeLuminance,
  roundRatio,
} from "@/lib/contrast";

/**
 * These tests pin the behaviour of the contrast maths itself, using the
 * published WCAG reference values. If this file is green, every ratio the
 * design guard reports can be trusted.
 */
describe("contrast maths", () => {
  it("parses shorthand and longhand hex", () => {
    expect(hexToRgb("#fff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb("#2E5A4B")).toEqual({ r: 46, g: 90, b: 75 });
    expect(hexToRgb("2e5a4b")).toEqual({ r: 46, g: 90, b: 75 });
  });

  it("rejects malformed hex instead of silently returning black", () => {
    expect(() => hexToRgb("#12345")).toThrow();
    expect(() => hexToRgb("not-a-colour")).toThrow();
    expect(() => hexToRgb("#gggggg")).toThrow();
  });

  it("computes the known luminance of black and white", () => {
    expect(relativeLuminance("#000000")).toBe(0);
    expect(relativeLuminance("#ffffff")).toBeCloseTo(1, 10);
  });

  it("gives the maximum ratio of 21 for black on white", () => {
    expect(roundRatio(contrastRatio("#000000", "#ffffff"))).toBe(21);
  });

  it("gives a ratio of 1 for a colour against itself", () => {
    expect(roundRatio(contrastRatio("#2E5A4B", "#2E5A4B"))).toBe(1);
  });

  it("is symmetric in argument order", () => {
    expect(contrastRatio("#16241E", "#FAF6EF")).toBeCloseTo(
      contrastRatio("#FAF6EF", "#16241E"),
      10,
    );
  });

  it("matches the WCAG reference ratio for #777777 on #ffffff", () => {
    // Published reference value: 4.48:1.
    expect(roundRatio(contrastRatio("#777777", "#ffffff"))).toBeCloseTo(4.48, 2);
  });

  it("matches the WCAG reference ratio for #767676 on #ffffff", () => {
    // #767676 is the canonical lightest passing grey on white: 4.54:1.
    const ratio = roundRatio(contrastRatio("#767676", "#ffffff"));
    expect(ratio).toBeGreaterThanOrEqual(AA_TEXT);
    expect(ratio).toBeCloseTo(4.54, 2);
  });

  it("exposes the AA thresholds the design contract depends on", () => {
    expect(AA_TEXT).toBe(4.5);
    expect(AA_LARGE_TEXT).toBe(3);
    expect(AA_NON_TEXT).toBe(3);
  });
});