import type { Metadata } from "next";

import { ModulSegera } from "@/components/domain/ModulSegera";

export const metadata: Metadata = { title: "Keluhan" };

export default function Page() {
  return (
    <ModulSegera
      eyebrow="Keluhan"
      judul="Laporan Warga"
      keterangan="Warga melapor, pengurus menindaklanjuti, semuanya terlihat statusnya."
      rencana={["Formulir laporan dengan foto dan lokasi", "Status: baru, diproses, selesai", "Riwayat tanggapan pengurus"]}
      sementara="Empat laporan contoh sudah tersimpan di data dan menunggu tampilan penuh."
    />
  );
}
