import type { Metadata } from "next";

import { ModulSegera } from "@/components/domain/ModulSegera";

export const metadata: Metadata = { title: "Direktori" };

export default function Page() {
  return (
    <ModulSegera
      eyebrow="Direktori"
      judul="Warga & Kontak"
      keterangan="Kontak darurat, pengurus, dan tukang langganan warga."
      rencana={["Daftar warga per blok dengan pencarian", "Kontak darurat satu ketuk", "Info tukang dengan rating dan rekomendasi warga"]}
      sementara="Data delapan kontak darurat dan enam tukang sudah siap di lapisan data."
    />
  );
}
