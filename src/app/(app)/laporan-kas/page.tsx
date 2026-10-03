import type { Metadata } from "next";

import { ModulSegera } from "@/components/domain/ModulSegera";

export const metadata: Metadata = { title: "Laporan Kas" };

export default function Page() {
  return (
    <ModulSegera
      eyebrow="Keuangan"
      judul="Laporan Kas"
      keterangan="Transparansi uang warga: pemasukan, pengeluaran, dan saldo."
      rencana={["Rekap pemasukan dan pengeluaran bulanan", "Saldo kas berjalan", "Unduh laporan dalam bentuk berkas"]}
      sementara="Ringkasan kas bulan ini sudah tampil di Beranda dan halaman Iuran."
    />
  );
}
