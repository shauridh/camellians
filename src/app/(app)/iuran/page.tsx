import { DueCard } from "@/components/domain/DueCard";
import { EmptyState } from "@/components/domain/EmptyState";
import { KasSummary } from "@/components/domain/KasSummary";
import { PageHeader } from "@/components/shell/PageHeader";
import { Reveal } from "@/components/shell/Reveal";
import { Card } from "@/components/ui/card";
import { rupiah, tanggalSingkatID } from "@/lib/format";
import {
  getRingkasanBulan,
  getTagihanWarga,
  getWargaById,
  getWargaMenunggak,
  getWargaSaatIni,
  HARI_INI,
  statusIuran,
} from "@/lib/mock/queries";

export default function IuranPage() {
  const warga = getWargaSaatIni();
  const ringkasan = getRingkasanBulan();
  const riwayat = getTagihanWarga(warga.id);
  const menunggak = getWargaMenunggak(HARI_INI);

  // The household's own position for the running month, spelled out.
  const tagihan = riwayat.at(-1);
  const statusTagihan = tagihan ? statusIuran(tagihan, HARI_INI) : undefined;

  return (
    <div className="space-y-section">
      <PageHeader
        eyebrow="Iuran Warga"
        judul="Iuran & Kas"
        keterangan={`Iuran bulanan ${rupiah(150_000)} per rumah. Data per ${tanggalSingkatID(HARI_INI)}.`}
      />

      <Reveal>
        <KasSummary ringkasan={ringkasan} />
      </Reveal>

      {tagihan && statusTagihan && (
        <Reveal delay={60}>
          <Card coreClassName="space-y-snug">
            <p className="eyebrow">Tagihan Rumah {warga.rumah}</p>
            <h2 className="text-xl">
              {tagihan.bulan} {tagihan.tahun}
            </h2>
            <p className="font-data text-2xl">{rupiah(tagihan.nominal)}</p>
            <p className="text-sm">
              {statusTagihan === "lunas" ? (
                <span className="text-evergreen">
                  Lunas — dibayar {tagihan.dibayarPada ? tanggalSingkatID(tagihan.dibayarPada) : ""}
                </span>
              ) : statusTagihan === "segera" ? (
                <span className="text-slate-muted">
                  Belum dibayar. Jatuh tempo {tanggalSingkatID(tagihan.jatuhTempo)}.
                </span>
              ) : (
                <span className="text-alert">
                  Tertunggak sejak {tanggalSingkatID(tagihan.jatuhTempo)}.
                </span>
              )}
            </p>
          </Card>
        </Reveal>
      )}

      <Reveal delay={120}>
        <section aria-labelledby="riwayat" className="space-y-snug">
          <h2 id="riwayat" className="text-xl">
            Riwayat Enam Bulan
          </h2>
          {riwayat.length === 0 ? (
            <EmptyState
              judul="Belum ada tagihan tercatat"
              keterangan="Tagihan akan muncul di sini setelah pengurus membuka periode iuran."
            />
          ) : (
            <ul className="space-y-stack">
              {riwayat.map((row) => (
                <li key={row.id}>
                  <DueCard iuran={row} status={statusIuran(row, HARI_INI)} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </Reveal>

      <Reveal delay={180}>
        <section aria-labelledby="menunggak" className="space-y-snug">
          <h2 id="menunggak" className="text-xl">
            Belum Membayar Bulan Ini
          </h2>
          <p className="text-sm text-slate-muted">
            Hanya pengurus yang melihat daftar ini. Warga lain hanya melihat
            status rumahnya sendiri.
          </p>
          {menunggak.length === 0 ? (
            <EmptyState
              judul="Semua rumah sudah membayar"
              keterangan="Tidak ada tunggakan untuk bulan berjalan. Terima kasih atas ketertiban warga."
            />
          ) : (
            <ul className="space-y-stack">
              {menunggak.map((row) => {
                const tetangga = getWargaById(row.wargaId);
                return (
                  <li key={row.id}>
                    <Card coreClassName="flex items-center justify-between gap-snug">
                      <div className="min-w-0">
                        <p className="truncate">{tetangga?.nama ?? "Tidak diketahui"}</p>
                        <p className="font-data text-xs text-slate-muted">
                          Rumah {tetangga?.rumah ?? "-"}
                        </p>
                      </div>
                      <p className="shrink-0 font-data text-sm text-alert">
                        {rupiah(row.nominal)}
                      </p>
                    </Card>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </Reveal>
    </div>
  );
}
