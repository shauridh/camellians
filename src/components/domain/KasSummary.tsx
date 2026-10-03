import { PetalRing } from "@/components/brand/PetalRing";
import { Card } from "@/components/ui/card";
import { rupiah } from "@/lib/format";
import type { RingkasanBulan } from "@/lib/types";

interface KasSummaryProps {
  ringkasan: RingkasanBulan;
}

/**
 * "Kembang Bulan Ini" — the cluster's monthly bloom.
 *
 * The ring states how many households have paid; the figures state the money.
 * Both are text, so the ring is reinforcement rather than the only signal.
 */
export function KasSummary({ ringkasan }: KasSummaryProps) {
  const { bulan, tahun, lunas, total, terkumpul, target } = ringkasan;
  const persen = total > 0 ? Math.round((lunas / total) * 100) : 0;

  return (
    <Card coreClassName="flex flex-col items-center gap-block sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-snug">
        <p className="eyebrow">Kas {bulan} {tahun}</p>
        <h2 className="text-2xl">Kembang Bulan Ini</h2>
        <p className="text-sm text-slate-muted">
          {lunas} dari {total} rumah sudah membayar ({persen}%).
        </p>
        <dl className="grid grid-cols-2 gap-tight">
          <div>
            <dt className="font-data text-xs text-slate-muted">Terkumpul</dt>
            <dd className="font-data text-lg text-evergreen">{rupiah(terkumpul)}</dd>
          </div>
          <div>
            <dt className="font-data text-xs text-slate-muted">Target</dt>
            <dd className="font-data text-lg">{rupiah(target)}</dd>
          </div>
        </dl>
      </div>

      <PetalRing
        value={lunas}
        total={total}
        size={160}
        label={`${lunas} dari ${total} rumah sudah membayar iuran ${bulan} ${tahun}`}
      />
    </Card>
  );
}
