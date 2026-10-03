import type { Metadata } from "next";

import { ModulSegera } from "@/components/domain/ModulSegera";

export const metadata: Metadata = { title: "Agenda" };

export default function Page() {
  return (
    <ModulSegera
      eyebrow="Agenda"
      judul="Kegiatan Cluster"
      keterangan="Jadwal kerja bakti, rapat, dan kegiatan bersama."
      rencana={["Kalender bulanan kegiatan", "Konfirmasi hadir per rumah", "Pengingat satu hari sebelum acara"]}
      sementara="Dua agenda terdekat sudah tampil di Beranda."
    />
  );
}
