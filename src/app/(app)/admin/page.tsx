import type { Metadata } from "next";

import { ModulSegera } from "@/components/domain/ModulSegera";

export const metadata: Metadata = { title: "Admin" };

export default function Page() {
  return (
    <ModulSegera
      eyebrow="Pengurus"
      judul="Panel Pengurus"
      keterangan="Alat kerja pengurus: verifikasi warga, kelola iuran, dan moderasi."
      rencana={["Verifikasi pendaftaran warga baru", "Buka dan tutup periode iuran", "Moderasi pengumuman dan keluhan"]}
      sementara="Data warga beserta status verifikasinya sudah siap di lapisan data."
    />
  );
}
