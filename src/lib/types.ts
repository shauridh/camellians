/**
 * Domain model for Camellians.
 *
 * These types are the contract between the mock data layer and the UI. When
 * Supabase is introduced, only `src/lib/mock/` is replaced — every page and
 * component keeps working against these shapes unchanged.
 */

/** A household in the cluster. */
export interface Warga {
  id: string;
  /** Display name, e.g. "Budi Santoso". */
  nama: string;
  /** House number, e.g. "C-07". */
  rumah: string;
  blok: string;
  telepon: string;
  /** Role governs which controls the UI reveals. */
  peran: "warga" | "admin" | "keamanan";
  /** Where the household stands with the association. */
  status: "aktif" | "menunggu" | "nonaktif";
}

/** Payment state for one household in one month. */
export type StatusIuran = "lunas" | "tertunggak" | "segera";

export interface IuranBulanan {
  id: string;
  wargaId: string;
  /** Indonesian month name, e.g. "Oktober". */
  bulan: string;
  tahun: number;
  nominal: number;
  status: StatusIuran;
  /** ISO date the payment was recorded, or null when unpaid. */
  dibayarPada: string | null;
  /** ISO due date used to derive `status`. */
  jatuhTempo: string;
}

export interface Pengumuman {
  id: string;
  judul: string;
  isi: string;
  kategori: "umum" | "keamanan" | "kebersihan" | "kegiatan";
  /** Pinned announcements surface first on Beranda. */
  penting: boolean;
  penulis: string;
  dipublikasikan: string;
}

export interface Keluhan {
  id: string;
  judul: string;
  deskripsi: string;
  kategori: "lampu" | "sampah" | "air" | "jalan" | "keamanan" | "lainnya";
  status: "baru" | "diproses" | "selesai";
  pelaporId: string;
  dilaporkan: string;
}

export interface Agenda {
  id: string;
  judul: string;
  deskripsi: string;
  mulai: string;
  lokasi: string;
}

export interface PutaranArisan {
  id: string;
  /** Turn number in the rotation. */
  putaran: number;
  pemenangId: string;
  tanggal: string;
  nominal: number;
  lunas: boolean;
}

export interface KontakDarurat {
  id: string;
  nama: string;
  peran: string;
  telepon: string;
  kategori: "keamanan" | "medis" | "utilitas" | "pengurus";
}

export interface InfoTukang {
  id: string;
  nama: string;
  keahlian: string;
  telepon: string;
  /** Ratings given by neighbours, 1–5. */
  rating: number;
  rekomendasi: number;
}

/** Aggregate for the Beranda "Kembang Bulan Ini" card. */
export interface RingkasanBulan {
  bulan: string;
  tahun: number;
  lunas: number;
  total: number;
  terkumpul: number;
  target: number;
}
