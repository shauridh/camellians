import { MapPin } from "lucide-react";

import { Card } from "@/components/ui/card";
import { tanggalSingkatID } from "@/lib/format";
import type { Agenda } from "@/lib/types";

interface EventCardProps {
  agenda: Agenda;
}

export function EventCard({ agenda }: EventCardProps) {
  const mulai = new Date(agenda.mulai);
  const jam = Number.isNaN(mulai.getTime())
    ? null
    : `${String(mulai.getHours()).padStart(2, "0")}.${String(mulai.getMinutes()).padStart(2, "0")}`;

  return (
    <Card coreClassName="space-y-tight">
      <p className="eyebrow">Agenda</p>
      <h3 className="text-lg">{agenda.judul}</h3>
      <p className="text-sm text-slate-muted">{agenda.deskripsi}</p>
      <p className="flex flex-wrap items-center gap-tight text-sm">
        <span className="font-data">
          {tanggalSingkatID(agenda.mulai.slice(0, 10))}
          {jam ? ` · ${jam}` : ""}
        </span>
        <span className="flex items-center gap-hair text-slate-muted">
          <MapPin aria-hidden="true" size={16} strokeWidth={1.5} />
          {agenda.lokasi}
        </span>
      </p>
    </Card>
  );
}
