import { Check, Clock, TriangleAlert } from "lucide-react";

import { Card } from "@/components/ui/card";
import { rupiah, tanggalSingkatID } from "@/lib/format";
import type { IuranBulanan, StatusIuran } from "@/lib/types";

/**
 * SC 1.4.1 Use of Color: status is never colour alone. Each row pairs the
 * colour with a distinct icon AND an explicit Indonesian label, so it reads
 * correctly in greyscale or for a colour-blind neighbour.
 */
const STATUS_META: Record<
  StatusIuran,
  { label: string; tone: string; Icon: typeof Check }
> = {
  lunas: { label: "Lunas", tone: "text-evergreen", Icon: Check },
  segera: { label: "Segera jatuh tempo", tone: "text-slate-muted", Icon: Clock },
  tertunggak: { label: "Tertunggak", tone: "text-alert", Icon: TriangleAlert },
};

interface DueCardProps {
  iuran: IuranBulanan;
  status: StatusIuran;
}

export function DueCard({ iuran, status }: DueCardProps) {
  const meta = STATUS_META[status];
  const { Icon } = meta;

  return (
    <Card coreClassName="flex items-center justify-between gap-snug">
      <div className="min-w-0 space-y-hair">
        <p className="font-display text-lg text-evergreen-deep">
          {iuran.bulan} {iuran.tahun}
        </p>
        <p className="truncate text-sm text-slate-muted">
          Jatuh tempo {tanggalSingkatID(iuran.jatuhTempo)}
        </p>
        <p className={`flex items-center gap-hair text-sm ${meta.tone}`}>
          <Icon aria-hidden="true" size={16} strokeWidth={1.5} />
          {meta.label}
        </p>
      </div>
      <p className="shrink-0 font-data text-base">
        {rupiah(iuran.nominal)}
      </p>
    </Card>
  );
}
