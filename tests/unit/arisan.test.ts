import { describe, expect, it } from "vitest";

import {
  getArisan,
  getWargaById,
  giliranArisan,
  giliranArisanBerikutnya,
  pemenangArisan,
} from "@/lib/mock/queries";

describe("getArisan()", () => {
  it("orders turns ascending", () => {
    const putaran = getArisan().map((p) => p.putaran);
    expect(putaran).toEqual([...putaran].sort((a, b) => a - b));
  });

  it("numbers turns from 1 without gaps", () => {
    getArisan().forEach((p, index) => {
      expect(p.putaran).toBe(index + 1);
    });
  });

  it("never lets the same household win twice in one cycle", () => {
    const winners = getArisan().map((p) => p.pemenangId);
    expect(new Set(winners).size).toBe(winners.length);
  });

  it("only awards the pot to real households", () => {
    for (const putaran of getArisan()) {
      expect(getWargaById(putaran.pemenangId)).toBeDefined();
    }
  });
});

describe("giliranArisan()", () => {
  it("returns the earliest turn that has not been paid out", () => {
    const current = giliranArisan();
    expect(current).toBeDefined();
    expect(current?.lunas).toBe(false);
    // Everything before it must already be settled.
    const before = getArisan().filter((p) => p.putaran < (current?.putaran ?? 0));
    for (const putaran of before) {
      expect(putaran.lunas).toBe(true);
    }
  });

  it("agrees with the winner list", () => {
    const settled = pemenangArisan();
    const all = getArisan();
    expect(settled).toHaveLength(all.length - 1);
  });
});

describe("giliranArisanBerikutnya()", () => {
  it("previews the next pending turn, and nothing when it is the last", () => {
    const pending = getArisan().filter((p) => !p.lunas);
    const next = giliranArisanBerikutnya();

    if (pending.length < 2) {
      // Only one turn left: there is nobody after it.
      expect(next).toBeUndefined();
      return;
    }

    expect(next).toBeDefined();
    expect(next?.putaran).toBeGreaterThan(pending[0].putaran);
    expect(next?.lunas).toBe(false);
  });

  it("never previews a household that already won", () => {
    const next = giliranArisanBerikutnya();
    if (!next) return;
    const alreadyWon = new Set(pemenangArisan().map((p) => p.pemenangId));
    expect(alreadyWon.has(next.pemenangId)).toBe(false);
  });
});

describe("pemenangArisan()", () => {
  it("only contains settled turns", () => {
    for (const putaran of pemenangArisan()) {
      expect(putaran.lunas).toBe(true);
    }
  });

  it("splits the ledger cleanly between settled and pending", () => {
    const settled = pemenangArisan().length;
    const pending = getArisan().filter((p) => !p.lunas).length;
    expect(settled + pending).toBe(getArisan().length);
  });
});
