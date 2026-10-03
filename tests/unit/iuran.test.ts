import { describe, expect, it } from "vitest";

import {
  getIuranBulanBerjalan,
  getRingkasanBulan,
  getTagihanWarga,
  getWargaMenunggak,
  statusIuran,
} from "@/lib/mock/queries";
import type { IuranBulanan } from "@/lib/types";

const base: IuranBulanan = {
  id: "test",
  wargaId: "w-01",
  bulan: "Oktober",
  tahun: 2026,
  nominal: 150_000,
  status: "tertunggak",
  dibayarPada: null,
  jatuhTempo: "2026-10-10",
};

describe("statusIuran()", () => {
  it("reports a recorded payment as lunas regardless of dates", () => {
    expect(
      statusIuran({ ...base, dibayarPada: "2026-10-01" }, "2026-12-31"),
    ).toBe("lunas");
  });

  it("reports segera before the due date", () => {
    expect(statusIuran(base, "2026-10-09")).toBe("segera");
  });

  it("treats the due date itself as still segera, not yet late", () => {
    expect(statusIuran(base, "2026-10-10")).toBe("segera");
  });

  it("reports tertunggak the day after the due date", () => {
    expect(statusIuran(base, "2026-10-11")).toBe("tertunggak");
  });

  it("never disagrees with the calendar for far-future dues", () => {
    expect(statusIuran({ ...base, jatuhTempo: "2027-01-05" }, "2026-10-03")).toBe(
      "segera",
    );
  });
});

describe("getIuranBulanBerjalan()", () => {
  it("returns only rows for the running month", () => {
    const rows = getIuranBulanBerjalan();
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      expect(row.bulan).toBe("Oktober");
      expect(row.tahun).toBe(2026);
    }
  });
});

describe("getWargaMenunggak()", () => {
  it("only lists households past the due date", () => {
    const rows = getWargaMenunggak("2026-10-20");
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      expect(row.dibayarPada).toBeNull();
      expect(row.jatuhTempo < "2026-10-20").toBe(true);
    }
  });

  it("lists nobody while the due date is still ahead", () => {
    expect(getWargaMenunggak("2026-10-01")).toEqual([]);
  });

  it("orders the worst arrears first", () => {
    const rows = getWargaMenunggak("2026-12-31");
    const dates = rows.map((r) => r.jatuhTempo);
    expect([...dates].sort()).toEqual(dates);
  });
});

describe("getRingkasanBulan()", () => {
  it("agrees with the rows it summarises", () => {
    const ringkasan = getRingkasanBulan();
    const rows = getIuranBulanBerjalan();
    const paid = rows.filter((r) => r.dibayarPada !== null).length;

    expect(ringkasan.total).toBe(rows.length);
    expect(ringkasan.lunas).toBe(paid);
    expect(ringkasan.terkumpul).toBe(paid * 150_000);
    expect(ringkasan.target).toBe(rows.length * 150_000);
  });

  it("never reports more paid than the total", () => {
    const ringkasan = getRingkasanBulan();
    expect(ringkasan.lunas).toBeLessThanOrEqual(ringkasan.total);
  });

  it("keeps collected money within the target", () => {
    const ringkasan = getRingkasanBulan();
    expect(ringkasan.terkumpul).toBeLessThanOrEqual(ringkasan.target);
  });

  it("carries the month label for the heading", () => {
    expect(getRingkasanBulan().bulan).toBe("Oktober");
    expect(getRingkasanBulan().tahun).toBe(2026);
  });
});

describe("getTagihanWarga()", () => {
  it("returns six months for one household", () => {
    expect(getTagihanWarga("w-05")).toHaveLength(6);
  });

  it("orders months chronologically", () => {
    const rows = getTagihanWarga("w-05");
    const names = rows.map((r) => `${r.tahun}-${r.bulan}`);
    // Mei .. Oktober is the recorded window.
    expect(names[0]).toBe("2026-Mei");
    expect(names[names.length - 1]).toBe("2026-Oktober");
  });

  it("returns nothing for an unknown household", () => {
    expect(getTagihanWarga("w-tidak-ada")).toEqual([]);
  });
});
