import type { Metadata } from "next";

import { ModulSegera } from "@/components/domain/ModulSegera";

export const metadata: Metadata = { title: "Arisan" };

export default function Page() {
  return (
    <ModulSegera
      eyebrow="Arisan"
      judul="Arisan Warga"
      keterangan="Putaran arisan, giliran penerima, dan riwayat lengkap."
      rencana={["Urutan giliran seluruh peserta", "Riwayat pemenang per putaran", "Catatan setoran tiap bulan"]}
      sementara="Giliran bulan ini sudah tampil di Beranda lewat kartu arisan."
    />
  );
}
