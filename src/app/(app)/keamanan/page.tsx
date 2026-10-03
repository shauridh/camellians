import type { Metadata } from "next";

import { ModulSegera } from "@/components/domain/ModulSegera";

export const metadata: Metadata = { title: "Keamanan" };

export default function Page() {
  return (
    <ModulSegera
      eyebrow="Keamanan"
      judul="Keamanan & Tamu"
      keterangan="Jadwal ronda, buku tamu, dan tombol darurat."
      rencana={["Jadwal ronda per rumah", "Buku tamu digital di pos keamanan", "Tombol darurat yang menghubungi pos"]}
      sementara="Kontak pos keamanan tersedia di direktori kontak darurat."
    />
  );
}
