import type { Metadata } from "next";

import { ModulSegera } from "@/components/domain/ModulSegera";

export const metadata: Metadata = { title: "Pengumuman" };

export default function Page() {
  return (
    <ModulSegera
      eyebrow="Pengumuman"
      judul="Papan Informasi"
      keterangan="Semua kabar dari pengurus, dikelompokkan dan bisa dibaca offline."
      rencana={["Pengumuman yang dipin penting", "Filter per kategori: umum, keamanan, kebersihan, kegiatan", "Tanda sudah dibaca per rumah"]}
      sementara="Tiga pengumuman terbaru sudah tampil di Beranda."
    />
  );
}
