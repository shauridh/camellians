/**
 * Pure formatting helpers. No DOM, no framework — so they are cheap to test
 * and safe to call from server components.
 */

const BULAN_ID = [
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
] as const;

const BULAN_SINGKAT_ID = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
] as const;

/**
 * Formats an integer amount as Indonesian Rupiah.
 *
 * `Rp150.000` — no decimals, Indonesian thousands separators. Fractions are
 * floored because rupiah has no practical subunit at this scale.
 */
export function rupiah(amount: number): string {
  if (!Number.isFinite(amount)) {
    throw new Error(`Nilai rupiah tidak valid: ${amount}`);
  }
  const rounded = Math.floor(Math.abs(amount));
  const sign = amount < 0 ? "-" : "";
  return `${sign}Rp${rounded.toLocaleString("id-ID")}`;
}

/** Formats an ISO date as `3 Oktober 2026`. */
export function tanggalID(iso: string): string {
  const date = parseIso(iso);
  return `${date.getUTCDate()} ${BULAN_ID[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** Formats an ISO date as `3 Okt 2026` for dense rows. */
export function tanggalSingkatID(iso: string): string {
  const date = parseIso(iso);
  return `${date.getUTCDate()} ${BULAN_SINGKAT_ID[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** Returns the Indonesian month name (1-indexed) for an ISO date. */
export function namaBulan(iso: string): string {
  return BULAN_ID[parseIso(iso).getUTCMonth()];
}

/** Parses `YYYY-MM-DD`, rejecting anything else so bad data fails loudly. */
function parseIso(iso: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    throw new Error(`Tanggal bukan format ISO (YYYY-MM-DD): ${iso}`);
  }
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Tanggal tidak valid: ${iso}`);
  }
  return date;
}

/**
 * Human-readable distance from `from` to `to`, in Bahasa Indonesia.
 * Used for "3 hari lagi" style hints on dues and agenda.
 */
export function selisihHari(fromIso: string, toIso: string): string {
  const MS_PER_DAY = 86_400_000;
  const diff = Math.round(
    (parseIso(toIso).getTime() - parseIso(fromIso).getTime()) / MS_PER_DAY,
  );

  if (diff === 0) return "hari ini";
  if (diff === 1) return "besok";
  if (diff === -1) return "kemarin";
  if (diff > 0) return `${diff} hari lagi`;
  return `${Math.abs(diff)} hari lalu`;
}
