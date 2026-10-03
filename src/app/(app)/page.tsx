import Link from "next/link";
import { CalendarDays, MessageSquareWarning, HandCoins } from "lucide-react";

import { AnnouncementCard } from "@/components/domain/AnnouncementCard";
import { ArisanRing } from "@/components/domain/ArisanRing";
import { EventCard } from "@/components/domain/EventCard";
import { KasSummary } from "@/components/domain/KasSummary";
import { PageHeader } from "@/components/shell/PageHeader";
import { Reveal } from "@/components/shell/Reveal";
import { Card } from "@/components/ui/card";
import { rupiah, tanggalSingkatID } from "@/lib/format";
import {
  getAgendaTerdekat,
  getArisan,
  getPengumumanTerbaru,
  getRingkasanBulan,
  getTagihanWarga,
  getWargaById,
  getWargaSaatIni,
  giliranArisan,
  HARI_INI,
  pemenangArisan,
  statusIuran,
} from "@/lib/mock/queries";

const AKSI_CEPAT = [
  { href: "/iuran", label: "Bayar Iuran", Icon: HandCoins },
  { href: "/keluhan", label: "Lapor Keluhan", Icon: MessageSquareWarning },
  { href: "/agenda", label: "Lihat Agenda", Icon: CalendarDays },
] as const;

export default function BerandaPage() {
  const warga = getWargaSaatIni();
  const ringkasan = getRingkasanBulan();
  const pengumuman = getPengumumanTerbaru(3);
  const agenda = getAgendaTerdekat(2);
  const semuaArisan = getArisan();
  const giliran = giliranArisan();
  const wargaById = new Map(
    semuaArisan
      .map((p) => getWargaById(p.pemenangId))
      .filter((w): w is NonNullable<typeof w> => Boolean(w))
      .map((w) => [w.id, w] as const),
  );

  // This household's own bill for the running month.
  const tagihan = getTagihanWarga(warga.id).at(-1);
  const statusTagihan = tagihan ? statusIuran(tagihan, HARI_INI) : undefined;

  return (
    <div className="space-y-section">
      <PageHeader
        eyebrow={`Rumah ${warga.rumah}`}
        judul={`Selamat pagi, ${warga.nama.split(" ")[0]}`}
        keterangan={`Ringkasan Cluster Camellia · ${tanggalSingkatID(HARI_INI)}`}
      />

      <Reveal>
        <KasSummary ringkasan={ringkasan} />
      </Reveal>

      {/* The household's own bill, stated in text as well as colour. */}
      {tagihan && statusTagihan && (
        <Reveal delay={60}>
          <Card coreClassName="flex flex-wrap items-center justify-between gap-snug">
            <div className="space-y-hair">
              <p className="eyebrow">Tagihan Saya</p>
              <p className="text-base">
                {tagihan.bulan} {tagihan.tahun} · {rupiah(tagihan.nominal)}
              </p>
              <p className="text-sm text-slate-muted">
                {statusTagihan === "lunas"
                  ? "Sudah dibayar. Terima kasih."
                  : statusTagihan === "segera"
                    ? `Jatuh tempo ${tanggalSingkatID(tagihan.jatuhTempo)}.`
                    : `Melewati jatuh tempo ${tanggalSingkatID(tagihan.jatuhTempo)}.`}
              </p>
            </div>
            <Link
              href="/iuran"
              className="flex min-h-11 items-center rounded-md bg-evergreen px-card text-ivory"
            >
              Lihat Iuran
            </Link>
          </Card>
        </Reveal>
      )}

      {/* Quick actions. */}
      <Reveal delay={120}>
        <section aria-labelledby="aksi-cepat" className="space-y-snug">
          <h2 id="aksi-cepat" className="text-xl">
            Aksi Cepat
          </h2>
          <ul className="grid grid-cols-3 gap-snug">
            {AKSI_CEPAT.map(({ href, label, Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex min-h-24 flex-col items-center justify-center gap-tight rounded-lg border border-stone bg-paper px-tight py-card text-center text-sm hover:bg-mist"
                >
                  <Icon aria-hidden="true" size={24} strokeWidth={1.5} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal delay={180}>
        <ArisanRing
          selesai={pemenangArisan()}
          semua={semuaArisan}
          giliran={giliran}
          wargaById={wargaById}
        />
      </Reveal>

      <Reveal delay={240}>
        <section aria-labelledby="pengumuman" className="space-y-snug">
          <div className="flex items-baseline justify-between gap-snug">
            <h2 id="pengumuman" className="text-xl">
              Pengumuman
            </h2>
            <Link
              href="/pengumuman"
              className="flex min-h-11 items-center text-sm text-evergreen underline"
            >
              Lihat semua
            </Link>
          </div>
          <ul className="space-y-stack">
            {pengumuman.map((item) => (
              <li key={item.id}>
                <AnnouncementCard pengumuman={item} />
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal delay={300}>
        <section aria-labelledby="agenda" className="space-y-snug">
          <div className="flex items-baseline justify-between gap-snug">
            <h2 id="agenda" className="text-xl">
              Agenda Terdekat
            </h2>
            <Link
              href="/agenda"
              className="flex min-h-11 items-center text-sm text-evergreen underline"
            >
              Lihat semua
            </Link>
          </div>
          <ul className="space-y-stack">
            {agenda.map((item) => (
              <li key={item.id}>
                <EventCard agenda={item} />
              </li>
            ))}
          </ul>
        </section>
      </Reveal>
    </div>
  );
}
