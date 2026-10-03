import {
  arisan,
  agenda,
  BULAN_BERJALAN,
  IURAN_BULANAN,
  iuran,
  keluhan,
  kontakDarurat,
  pengumuman,
  TAHUN_BERJALAN,
  tukang,
  warga,
} from "@/lib/mock/data";
import type {
  Agenda,
  InfoTukang,
  IuranBulanan,
  Keluhan,
  KontakDarurat,
  Pengumuman,
  PutaranArisan,
  RingkasanBulan,
  StatusIuran,
  Warga,
} from "@/lib/types";

/**
 * The single door between the UI and the data.
 *
 * Pages never import `data.ts` directly. Swapping this file's body for
 * Supabase queries is the entire migration; component props stay identical.
 */

/** The month the app currently considers "current". */
export const bulanBerjalan = { bulan: BULAN_BERJALAN, tahun: TAHUN_BERJALAN };

/**
 * The reference date for the prototype. Fixed rather than `new Date()` so the
 * rendered dues statuses are deterministic — a page that says "tertunggak"
 * must say the same thing on every render and in every screenshot.
 * Replace this with the real clock when the Supabase layer lands.
 */
export const HARI_INI = "2026-10-03";

export function getWarga(): Warga[] {
  return warga;
}

export function getWargaById(id: string): Warga | undefined {
  return warga.find((w) => w.id === id);
}

/** The signed-in resident for the prototype: the household at C-05. */
export function getWargaSaatIni(): Warga {
  const current = warga.find((w) => w.id === "w-05");
  if (!current) throw new Error("Warga contoh tidak ditemukan");
  return current;
}

export function getPengumuman(): Pengumuman[] {
  // Pinned first, then newest.
  return [...pengumuman].sort((a, b) => {
    if (a.penting !== b.penting) return a.penting ? -1 : 1;
    return b.dipublikasikan.localeCompare(a.dipublikasikan);
  });
}

export function getPengumumanTerbaru(limit = 3): Pengumuman[] {
  return getPengumuman().slice(0, limit);
}

export function getKeluhan(): Keluhan[] {
  return [...keluhan].sort((a, b) => b.dilaporkan.localeCompare(a.dilaporkan));
}

export function getAgenda(): Agenda[] {
  return [...agenda].sort((a, b) => a.mulai.localeCompare(b.mulai));
}

export function getAgendaTerdekat(limit = 2): Agenda[] {
  return getAgenda().slice(0, limit);
}

export function getKontakDarurat(): KontakDarurat[] {
  return kontakDarurat;
}

export function getTukang(): InfoTukang[] {
  return [...tukang].sort((a, b) => b.rating - a.rating);
}

export function getArisan(): PutaranArisan[] {
  return [...arisan].sort((a, b) => a.putaran - b.putaran);
}

/** Dues rows for one household, across every recorded month. */
export function getTagihanWarga(wargaId: string): IuranBulanan[] {
  return iuran
    .filter((row) => row.wargaId === wargaId)
    .sort((a, b) => monthKey(a).localeCompare(monthKey(b)));
}

/** Dues rows for the running month. */
export function getIuranBulanBerjalan(): IuranBulanan[] {
  return iuran.filter(
    (row) => row.bulan === BULAN_BERJALAN && row.tahun === TAHUN_BERJALAN,
  );
}

/**
 * Derives the display status for a dues row as of a reference date.
 *
 * A recorded payment is always `lunas`. Otherwise the row is `segera` while
 * the due date is still ahead (or is today), and `tertunggak` once it has
 * passed — so the status never disagrees with the calendar.
 */
export function statusIuran(row: IuranBulanan, hariIni: string): StatusIuran {
  if (row.dibayarPada) return "lunas";
  return row.jatuhTempo >= hariIni ? "segera" : "tertunggak";
}

/** Households that have not paid the running month, worst first. */
export function getWargaMenunggak(hariIni: string): IuranBulanan[] {
  return getIuranBulanBerjalan()
    .filter((row) => statusIuran(row, hariIni) === "tertunggak")
    .sort((a, b) => a.jatuhTempo.localeCompare(b.jatuhTempo));
}

/** Aggregate shown on the Beranda "Kembang Bulan Ini" card. */
export function getRingkasanBulan(
  bulan = BULAN_BERJALAN,
  tahun = TAHUN_BERJALAN,
): RingkasanBulan {
  const rows = iuran.filter((row) => row.bulan === bulan && row.tahun === tahun);
  const lunas = rows.filter((row) => row.dibayarPada !== null).length;
  return {
    bulan,
    tahun,
    lunas,
    total: rows.length,
    terkumpul: lunas * IURAN_BULANAN,
    target: rows.length * IURAN_BULANAN,
  };
}

/**
 * The household whose turn it is to receive the arisan pot: the first
 * rotation still unpaid. Returns undefined once everyone has received.
 */
export function giliranArisan(): PutaranArisan | undefined {
  return getArisan().find((putaran) => !putaran.lunas);
}

/**
 * The next household in line *after* the current turn — used to preview who
 * receives next, honouring the same "unpaid first" ordering.
 */
export function giliranArisanBerikutnya(): PutaranArisan | undefined {
  const sisa = getArisan().filter((putaran) => !putaran.lunas);
  return sisa[1];
}

/** Households that have already received the pot. */
export function pemenangArisan(): PutaranArisan[] {
  return getArisan().filter((putaran) => putaran.lunas);
}

/** Sort key for month ordering, e.g. `2026-10`. */
function monthKey(row: IuranBulanan): string {
  const index = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ].indexOf(row.bulan);
  return `${row.tahun}-${String(index + 1).padStart(2, "0")}`;
}
