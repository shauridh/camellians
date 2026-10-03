import { describe, expect, it } from "vitest";

import {
  namaBulan,
  rupiah,
  selisihHari,
  tanggalID,
  tanggalSingkatID,
} from "@/lib/format";

describe("rupiah()", () => {
  it("formats zero", () => {
    expect(rupiah(0)).toBe("Rp0");
  });

  it("uses Indonesian thousands separators", () => {
    expect(rupiah(150_000)).toBe("Rp150.000");
    expect(rupiah(1_800_000)).toBe("Rp1.800.000");
    expect(rupiah(12_450_000)).toBe("Rp12.450.000");
  });

  it("never emits decimals", () => {
    expect(rupiah(150_000.75)).toBe("Rp150.000");
  });

  it("marks negatives before the symbol", () => {
    expect(rupiah(-50_000)).toBe("-Rp50.000");
  });

  it("rejects non-finite input instead of rendering NaN", () => {
    expect(() => rupiah(Number.NaN)).toThrow();
    expect(() => rupiah(Number.POSITIVE_INFINITY)).toThrow();
  });
});

describe("tanggalID()", () => {
  it("formats a date in Bahasa Indonesia", () => {
    expect(tanggalID("2026-10-03")).toBe("3 Oktober 2026");
  });

  it("handles every month boundary", () => {
    expect(tanggalID("2026-01-01")).toBe("1 Januari 2026");
    expect(tanggalID("2026-12-31")).toBe("31 Desember 2026");
  });

  it("does not drift a day in a non-UTC local timezone", () => {
    // Parsed as UTC by design, so the day never shifts.
    expect(tanggalID("2026-06-15")).toBe("15 Juni 2026");
  });

  it("rejects non-ISO input loudly", () => {
    expect(() => tanggalID("3 Oktober 2026")).toThrow();
    expect(() => tanggalID("2026/10/03")).toThrow();
  });
});

describe("tanggalSingkatID()", () => {
  it("uses the short month name", () => {
    expect(tanggalSingkatID("2026-10-03")).toBe("3 Okt 2026");
    expect(tanggalSingkatID("2026-08-17")).toBe("17 Agu 2026");
  });
});

describe("namaBulan()", () => {
  it("returns the Indonesian month name", () => {
    expect(namaBulan("2026-10-15")).toBe("Oktober");
    expect(namaBulan("2026-05-01")).toBe("Mei");
  });
});

describe("selisihHari()", () => {
  it("names today, tomorrow and yesterday in words", () => {
    expect(selisihHari("2026-10-03", "2026-10-03")).toBe("hari ini");
    expect(selisihHari("2026-10-03", "2026-10-04")).toBe("besok");
    expect(selisihHari("2026-10-03", "2026-10-02")).toBe("kemarin");
  });

  it("counts forward and backward", () => {
    expect(selisihHari("2026-10-03", "2026-10-06")).toBe("3 hari lagi");
    expect(selisihHari("2026-10-03", "2026-09-30")).toBe("3 hari lalu");
  });

  it("crosses month boundaries correctly", () => {
    expect(selisihHari("2026-10-30", "2026-11-02")).toBe("3 hari lagi");
  });
});
