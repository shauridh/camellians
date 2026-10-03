import Link from "next/link";

import { PetalRing } from "@/components/brand/PetalRing";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center gap-block px-gutter py-section text-center">
      <PetalRing value={6} total={6} size={128} label="Camellians" />
      <div className="space-y-tight">
        <p className="eyebrow">Paguyuban Cluster Camellia</p>
        <h1 className="text-5xl">Camellians</h1>
        <p className="max-w-md text-slate-muted">
          Sistem desain sudah siap. Halaman warga sedang dibangun.
        </p>
      </div>
      <Card coreClassName="flex flex-col items-center gap-snug">
        <p className="text-sm text-slate-muted">
          Untuk meninjau token, kontras, dan komponen:
        </p>
        <Link href="/gaya" className={cn(buttonVariants({ size: "md" }))}>
          Buka Panduan Gaya
        </Link>
      </Card>
    </main>
  );
}
