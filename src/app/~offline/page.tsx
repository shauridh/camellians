import type { Metadata } from "next";
import Link from "next/link";

import { PetalRing } from "@/components/brand/PetalRing";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sedang Offline",
  description: "Tidak ada koneksi internet.",
};

/**
 * Offline fallback. This page is precached, so it is what a resident sees
 * when they open an unvisited screen without a connection. It explains the
 * situation plainly and gives one clear action — the copy states what
 * happened rather than apologising for it.
 */
export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-block px-gutter py-section text-center">
      <PetalRing
        value={2}
        total={6}
        size={128}
        label="Ikon kelopak camellia"
      />
      <div className="space-y-tight">
        <p className="eyebrow">Tidak Ada Koneksi</p>
        <h1 className="text-3xl">Sedang offline</h1>
        <p className="text-slate-muted">
          Camellians tidak dapat memuat data terbaru. Sambungkan kembali ke
          internet, lalu coba lagi.
        </p>
      </div>
      <Card coreClassName="w-full space-y-snug text-left">
        <p className="eyebrow">Yang masih bisa dibuka</p>
        <ul className="space-y-hair text-sm text-slate-muted">
          <li>Pengumuman yang sudah pernah dibuka</li>
          <li>Halaman panduan gaya</li>
          <li>Data warga yang sudah tersimpan</li>
        </ul>
      </Card>
      <Link
        href="/"
        className="flex min-h-11 items-center justify-center rounded-md bg-evergreen px-card-lg text-base font-medium text-ivory"
      >
        Coba lagi
      </Link>
    </main>
  );
}
