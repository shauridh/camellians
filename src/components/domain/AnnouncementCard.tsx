import { Card } from "@/components/ui/card";
import { tanggalSingkatID } from "@/lib/format";
import type { Pengumuman } from "@/lib/types";

const KATEGORI_LABEL: Record<Pengumuman["kategori"], string> = {
  umum: "Umum",
  keamanan: "Keamanan",
  kebersihan: "Kebersihan",
  kegiatan: "Kegiatan",
};

interface AnnouncementCardProps {
  pengumuman: Pengumuman;
}

export function AnnouncementCard({ pengumuman }: AnnouncementCardProps) {
  const { judul, isi, kategori, penting, penulis, dipublikasikan } = pengumuman;

  return (
    <Card coreClassName="space-y-snug">
      <div className="flex flex-wrap items-center gap-tight">
        {penting && (
          <span className="rounded-sm bg-camellia px-tight py-hair font-data text-xs text-ivory">
            Penting
          </span>
        )}
        <span className="rounded-sm bg-mist px-tight py-hair font-data text-xs text-evergreen-deep">
          {KATEGORI_LABEL[kategori]}
        </span>
        <time
          dateTime={dipublikasikan}
          className="font-data text-xs text-slate-muted"
        >
          {tanggalSingkatID(dipublikasikan)}
        </time>
      </div>

      <h3 className="text-lg">{judul}</h3>
      <p className="text-sm text-slate-muted">{isi}</p>
      <p className="font-data text-xs text-slate-muted">Oleh {penulis}</p>
    </Card>
  );
}
