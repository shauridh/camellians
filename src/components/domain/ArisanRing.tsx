import { PetalRing } from "@/components/brand/PetalRing";
import { Card } from "@/components/ui/card";
import { rupiah, tanggalSingkatID } from "@/lib/format";
import type { PutaranArisan, Warga } from "@/lib/types";

interface ArisanRingProps {
  /** Settled turns, oldest first. */
  selesai: PutaranArisan[];
  /** Every turn in the rotation, used for the ring total. */
  semua: PutaranArisan[];
  /** Household receiving the pot this turn, if any. */
  giliran?: PutaranArisan;
  wargaById: Map<string, Warga>;
}

/**
 * The arisan rotation. The ring counts elapsed turns; the card names the
 * household whose turn it is and when. Names are always text — the ring never
 * carries the meaning alone.
 */
export function ArisanRing({ selesai, semua, giliran, wargaById }: ArisanRingProps) {
  const pemenangNama = giliran
    ? (wargaById.get(giliran.pemenangId)?.nama ?? "Belum ditentukan")
    : "Semua sudah dapat";

  return (
    <Card coreClassName="flex flex-col items-center gap-block sm:flex-row sm:justify-between">
      <div className="space-y-tight">
        <p className="eyebrow">Arisan Warga</p>
        <h2 className="text-2xl">Giliran Bulan Ini</h2>
        <p className="text-base font-medium">{pemenangNama}</p>
        {giliran ? (
          <p className="text-sm text-slate-muted">
            {rupiah(giliran.nominal)} · {tanggalSingkatID(giliran.tanggal)}
          </p>
        ) : (
          <p className="text-sm text-slate-muted">
            Semua peserta sudah menerima bagiannya.
          </p>
        )}
      </div>

      <PetalRing
        value={selesai.length}
        total={semua.length}
        size={128}
        label={`${selesai.length} dari ${semua.length} putaran arisan sudah berjalan`}
      />
    </Card>
  );
}
