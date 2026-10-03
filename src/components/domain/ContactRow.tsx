import { Phone } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { KontakDarurat, InfoTukang } from "@/lib/types";

interface ContactRowProps {
  kontak: KontakDarurat;
}

export function ContactRow({ kontak }: ContactRowProps) {
  return (
    <Card coreClassName="flex items-center justify-between gap-snug">
      <div className="min-w-0">
        <p className="truncate font-medium">{kontak.nama}</p>
        <p className="truncate text-sm text-slate-muted">{kontak.peran}</p>
      </div>
      <a
        href={`tel:${kontak.telepon.replace(/[^0-9+]/g, "")}`}
        className="flex min-h-11 shrink-0 items-center gap-tight rounded-md bg-mist px-snug font-data text-sm text-evergreen-deep"
      >
        <Phone aria-hidden="true" size={16} strokeWidth={1.5} />
        <span>{kontak.telepon}</span>
      </a>
    </Card>
  );
}

interface TukangRowProps {
  tukang: InfoTukang;
}

/** A trusted tradesperson recommended by neighbours. */
export function TukangRow({ tukang }: TukangRowProps) {
  return (
    <Card coreClassName="space-y-snug">
      <div className="flex items-start justify-between gap-snug">
        <div className="min-w-0">
          <p className="truncate font-medium">{tukang.nama}</p>
          <p className="truncate text-sm text-slate-muted">{tukang.keahlian}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-data text-sm text-evergreen">{tukang.rating}</p>
          <p className="font-data text-xs text-slate-muted">
            {tukang.rekomendasi} rekomendasi
          </p>
        </div>
      </div>
      <a
        href={`tel:${tukang.telepon.replace(/[^0-9+]/g, "")}`}
        className="flex min-h-11 w-full items-center justify-center gap-tight rounded-md bg-evergreen px-card text-ivory"
      >
        <Phone aria-hidden="true" size={16} strokeWidth={1.5} />
        Hubungi
      </a>
    </Card>
  );
}
