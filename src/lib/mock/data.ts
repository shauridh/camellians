import type {
  Agenda,
  InfoTukang,
  IuranBulanan,
  Keluhan,
  KontakDarurat,
  Pengumuman,
  PutaranArisan,
  Warga,
} from "@/lib/types";

/**
 * Mock data for Cluster Camellia — 18 households across blocks C and D.
 *
 * This is the ONLY place literal domain data lives. Pages read it through
 * `queries.ts`, so swapping in Supabase later touches this folder alone.
 */

export const BULAN_BERJALAN = "Oktober";
export const TAHUN_BERJALAN = 2026;
export const IURAN_BULANAN = 150_000;
export const IURAN_ARISAN = 500_000;

export const warga: Warga[] = [
  { id: "w-01", nama: "Budi Santoso", rumah: "C-01", blok: "C", telepon: "0812-1111-0001", peran: "admin", status: "aktif" },
  { id: "w-02", nama: "Siti Rahayu", rumah: "C-02", blok: "C", telepon: "0812-1111-0002", peran: "warga", status: "aktif" },
  { id: "w-03", nama: "Ahmad Hidayat", rumah: "C-03", blok: "C", telepon: "0812-1111-0003", peran: "warga", status: "aktif" },
  { id: "w-04", nama: "Dewi Lestari", rumah: "C-04", blok: "C", telepon: "0812-1111-0004", peran: "warga", status: "aktif" },
  { id: "w-05", nama: "Muhammad Rizky Ramadhan", rumah: "C-05", blok: "C", telepon: "0812-1111-0005", peran: "warga", status: "aktif" },
  { id: "w-06", nama: "Ratna Kusuma Wardani", rumah: "C-06", blok: "C", telepon: "0812-1111-0006", peran: "warga", status: "aktif" },
  { id: "w-07", nama: "Joko Prasetyo", rumah: "C-07", blok: "C", telepon: "0812-1111-0007", peran: "warga", status: "aktif" },
  { id: "w-08", nama: "Nur Aisyah", rumah: "C-08", blok: "C", telepon: "0812-1111-0008", peran: "warga", status: "aktif" },
  { id: "w-09", nama: "Agus Setiawan", rumah: "C-09", blok: "C", telepon: "0812-1111-0009", peran: "keamanan", status: "aktif" },
  { id: "w-10", nama: "Fitri Handayani", rumah: "D-01", blok: "D", telepon: "0812-1111-0010", peran: "warga", status: "aktif" },
  { id: "w-11", nama: "Hendra Gunawan", rumah: "D-02", blok: "D", telepon: "0812-1111-0011", peran: "warga", status: "aktif" },
  { id: "w-12", nama: "Indah Permata Sari", rumah: "D-03", blok: "D", telepon: "0812-1111-0012", peran: "warga", status: "menunggu" },
  { id: "w-13", nama: "Bambang Wijaya", rumah: "D-04", blok: "D", telepon: "0812-1111-0013", peran: "warga", status: "aktif" },
  { id: "w-14", nama: "Sri Wahyuni", rumah: "D-05", blok: "D", telepon: "0812-1111-0014", peran: "warga", status: "aktif" },
  { id: "w-15", nama: "Eko Nugroho", rumah: "D-06", blok: "D", telepon: "0812-1111-0015", peran: "warga", status: "menunggu" },
  { id: "w-16", nama: "Maya Anggraini", rumah: "D-07", blok: "D", telepon: "0812-1111-0016", peran: "warga", status: "aktif" },
  { id: "w-17", nama: "Rudi Hartono", rumah: "D-08", blok: "D", telepon: "0812-1111-0017", peran: "warga", status: "aktif" },
  { id: "w-18", nama: "Lina Marlina", rumah: "D-09", blok: "D", telepon: "0812-1111-0018", peran: "warga", status: "aktif" },
];

/** Warga eligible to pay dues — pending households are excluded. */
export const wargaAktif = warga.filter((w) => w.status === "aktif");

/**
 * Six months of dues, derived from the active households so the numbers
 * always agree with the resident list. Payments lag towards the current
 * month, which makes the progress ring interesting.
 */
export const iuran: IuranBulanan[] = (() => {
  const months: Array<{ bulan: string; tahun: number; jatuhTempo: string; lunasCount: number }> = [
    { bulan: "Mei", tahun: 2026, jatuhTempo: "2026-05-10", lunasCount: wargaAktif.length },
    { bulan: "Juni", tahun: 2026, jatuhTempo: "2026-06-10", lunasCount: wargaAktif.length },
    { bulan: "Juli", tahun: 2026, jatuhTempo: "2026-07-10", lunasCount: wargaAktif.length - 1 },
    { bulan: "Agustus", tahun: 2026, jatuhTempo: "2026-08-10", lunasCount: wargaAktif.length - 2 },
    { bulan: "September", tahun: 2026, jatuhTempo: "2026-09-10", lunasCount: wargaAktif.length - 4 },
    { bulan: "Oktober", tahun: 2026, jatuhTempo: "2026-10-10", lunasCount: 12 },
  ];

  const out: IuranBulanan[] = [];
  for (const m of months) {
    wargaAktif.forEach((w, index) => {
      const paid = index < m.lunasCount;
      out.push({
        id: `i-${m.tahun}-${m.bulan}-${w.id}`,
        wargaId: w.id,
        bulan: m.bulan,
        tahun: m.tahun,
        nominal: IURAN_BULANAN,
        status: paid ? "lunas" : "tertunggak",
        dibayarPada: paid ? `${m.jatuhTempo.slice(0, 8)}0${(index % 8) + 1}` : null,
        jatuhTempo: m.jatuhTempo,
      });
    });
  }
  return out;
})();

export const pengumuman: Pengumuman[] = [
  {
    id: "p-01",
    judul: "Pembersihan Saluran Air Blok C",
    isi: "Senin depan petugas akan membersihkan saluran air di Blok C. Mohon kendaraan tidak diparkir di sepanjang jalan Blok C mulai pukul 07.00 sampai 12.00.",
    kategori: "kebersihan",
    penting: true,
    penulis: "Budi Santoso",
    dipublikasikan: "2026-10-01",
  },
  {
    id: "p-02",
    judul: "Iuran Oktober Sudah Dibuka",
    isi: "Iuran bulan Oktober sebesar Rp150.000 sudah dapat dibayarkan ke pengurus. Terima kasih bagi warga yang sudah membayar lebih awal.",
    kategori: "umum",
    penting: true,
    penulis: "Budi Santoso",
    dipublikasikan: "2026-09-30",
  },
  {
    id: "p-03",
    judul: "Pos Keamanan Tambah Shift Malam",
    isi: "Mulai pekan ini pos keamanan menambah satu shift pada pukul 01.00–05.00. Warga yang melihat hal mencurigakan bisa langsung menghubungi pos.",
    kategori: "keamanan",
    penting: false,
    penulis: "Agus Setiawan",
    dipublikasikan: "2026-09-28",
  },
  {
    id: "p-04",
    judul: "Kerja Bakti Minggu Pagi",
    isi: "Kerja bakti rutin bulanan diadakan Minggu pukul 07.00 di taman tengah. Peralatan disediakan pengurus, cukup bawa sarung tangan.",
    kategori: "kegiatan",
    penting: false,
    penulis: "Siti Rahayu",
    dipublikasikan: "2026-09-25",
  },
  {
    id: "p-05",
    judul: "Pendaftaran Arisan Putaran Baru",
    isi: "Putaran arisan baru dibuka untuk 12 peserta dengan iuran Rp500.000 per bulan. Pendaftaran ditutup akhir bulan ini.",
    kategori: "umum",
    penting: false,
    penulis: "Dewi Lestari",
    dipublikasikan: "2026-09-22",
  },
];

export const keluhan: Keluhan[] = [
  {
    id: "k-01",
    judul: "Lampu jalan depan C-05 mati",
    deskripsi: "Lampu penerangan jalan depan rumah C-05 sudah mati sejak tiga hari. Jalan jadi gelap saat malam.",
    kategori: "lampu",
    status: "diproses",
    pelaporId: "w-05",
    dilaporkan: "2026-09-29",
  },
  {
    id: "k-02",
    judul: "Sampah tidak terangkut dua hari",
    deskripsi: "Tempat sampah di dekat gerbang Blok D belum diangkut sejak Selasa. Mulai menimbulkan bau.",
    kategori: "sampah",
    status: "baru",
    pelaporId: "w-11",
    dilaporkan: "2026-10-01",
  },
  {
    id: "k-03",
    judul: "Kebocoran pipa di taman",
    deskripsi: "Ada kebocoran pipa penyiraman di taman tengah, air mengalir terus ke jalan.",
    kategori: "air",
    status: "selesai",
    pelaporId: "w-08",
    dilaporkan: "2026-09-20",
  },
  {
    id: "k-04",
    judul: "Paving blok D bergelombang",
    deskripsi: "Paving di depan D-07 bergelombang dan membahayakan pengendara sepeda.",
    kategori: "jalan",
    status: "baru",
    pelaporId: "w-16",
    dilaporkan: "2026-10-02",
  },
];

export const agenda: Agenda[] = [
  {
    id: "a-01",
    judul: "Kerja Bakti Bulanan",
    deskripsi: "Bersih-bersih taman tengah dan saluran air bersama warga.",
    mulai: "2026-10-11T07:00:00+07:00",
    lokasi: "Taman Tengah",
  },
  {
    id: "a-02",
    judul: "Rapat Pengurus & Warga",
    deskripsi: "Pembahasan anggaran keamanan dan rencana renovasi pos.",
    mulai: "2026-10-18T19:30:00+07:00",
    lokasi: "Balai Warga",
  },
  {
    id: "a-03",
    judul: "Senam Sehat Bersama",
    deskripsi: "Senam pagi bersama instruktur, terbuka untuk semua usia.",
    mulai: "2026-10-25T06:30:00+07:00",
    lokasi: "Lapangan Blok C",
  },
];

export const arisan: PutaranArisan[] = [
  { id: "ar-01", putaran: 1, pemenangId: "w-02", tanggal: "2026-05-15", nominal: IURAN_ARISAN, lunas: true },
  { id: "ar-02", putaran: 2, pemenangId: "w-07", tanggal: "2026-06-15", nominal: IURAN_ARISAN, lunas: true },
  { id: "ar-03", putaran: 3, pemenangId: "w-04", tanggal: "2026-07-15", nominal: IURAN_ARISAN, lunas: true },
  { id: "ar-04", putaran: 4, pemenangId: "w-11", tanggal: "2026-08-15", nominal: IURAN_ARISAN, lunas: true },
  { id: "ar-05", putaran: 5, pemenangId: "w-16", tanggal: "2026-09-15", nominal: IURAN_ARISAN, lunas: true },
  { id: "ar-06", putaran: 6, pemenangId: "w-03", tanggal: "2026-10-15", nominal: IURAN_ARISAN, lunas: false },
];

export const kontakDarurat: KontakDarurat[] = [
  { id: "kd-01", nama: "Pos Keamanan Cluster", peran: "24 jam", telepon: "0812-9000-0001", kategori: "keamanan" },
  { id: "kd-02", nama: "Ketua Paguyuban", peran: "Budi Santoso", telepon: "0812-1111-0001", kategori: "pengurus" },
  { id: "kd-03", nama: "Sekretaris", peran: "Siti Rahayu", telepon: "0812-1111-0002", kategori: "pengurus" },
  { id: "kd-04", nama: "Ambulans / Gawat Darurat", peran: "Layanan umum", telepon: "119", kategori: "medis" },
  { id: "kd-05", nama: "Polisi Sektor", peran: "Layanan umum", telepon: "110", kategori: "keamanan" },
  { id: "kd-06", nama: "Pemadam Kebakaran", peran: "Layanan umum", telepon: "113", kategori: "keamanan" },
  { id: "kd-07", nama: "PLN Gangguan", peran: "Listrik", telepon: "123", kategori: "utilitas" },
  { id: "kd-08", nama: "PDAM Gangguan", peran: "Air bersih", telepon: "0812-9000-0002", kategori: "utilitas" },
];

export const tukang: InfoTukang[] = [
  { id: "t-01", nama: "Pak Sukron", keahlian: "Service AC & Kulkas", telepon: "0813-2222-0001", rating: 4.8, rekomendasi: 24 },
  { id: "t-02", nama: "Pak Waris", keahlian: "Ledeng & Pipa", telepon: "0813-2222-0002", rating: 4.6, rekomendasi: 19 },
  { id: "t-03", nama: "Pak Dedi", keahlian: "Listrik Rumah", telepon: "0813-2222-0003", rating: 4.7, rekomendasi: 21 },
  { id: "t-04", nama: "Bu Nanik", keahlian: "Bersih-bersih & ART", telepon: "0813-2222-0004", rating: 4.9, rekomendasi: 31 },
  { id: "t-05", nama: "Pak Tarno", keahlian: "Taman & Potong Rumput", telepon: "0813-2222-0005", rating: 4.5, rekomendasi: 15 },
  { id: "t-06", nama: "Mas Ilham", keahlian: "Kunci & Perbaikan Pintu", telepon: "0813-2222-0006", rating: 4.4, rekomendasi: 12 },
];
