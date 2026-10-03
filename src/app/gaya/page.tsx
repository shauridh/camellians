import type { Metadata } from "next";

import { PetalRing } from "@/components/brand/PetalRing";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AA_NON_TEXT, AA_TEXT, contrastRatio, roundRatio } from "@/lib/contrast";
import { loadTokens } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "Panduan Gaya",
  description: "Sistem desain Camellians — token, kontras, dan komponen.",
};

/** Ratios the palette must satisfy, rendered live so they cannot go stale. */
const TEXT_PAIRS: Array<[string, string, string]> = [
  ["ink di ivory", "ink", "ivory"],
  ["evergreen di ivory", "evergreen", "ivory"],
  ["camellia di ivory", "camellia", "ivory"],
  ["slate-muted di ivory", "slate-muted", "ivory"],
  ["alert di ivory", "alert", "ivory"],
  ["ink di brass", "ink", "brass"],
  ["ink di mist", "ink", "mist"],
  ["ivory di evergreen", "ivory", "evergreen"],
];

const NON_TEXT_PAIRS: Array<[string, string, string]> = [
  ["sage di ivory", "sage", "ivory"],
  ["brass di ivory", "brass", "ivory"],
  ["evergreen di ivory", "evergreen", "ivory"],
  ["camellia di ivory", "camellia", "ivory"],
];

export default function GayaPage() {
  const { colours, spacing, radii } = loadTokens();
  const byName = new Map(colours.map((c) => [c.name, c.hex]));
  const hex = (name: string) => byName.get(name) ?? "#000000";

  return (
    <main className="mx-auto max-w-5xl px-gutter py-section md:px-gutter-lg md:py-section-lg">
      <header className="space-y-block">
        <p className="eyebrow">Sistem Desain</p>
        <h1 className="text-4xl md:text-5xl">Evergreen Ledger</h1>
        <p className="max-w-2xl text-slate-muted">
          Buku kas lingkungan yang terawat: kertas ivory hangat, tinta
          evergreen dalam, dan aksen brass hanya untuk momen mekar. Setiap
          angka di halaman ini dihitung dari token asli di{" "}
          <code className="font-data text-sm">globals.css</code> — bukan
          ditulis manual.
        </p>
      </header>

      {/* ── Palette ─────────────────────────────────────────────────── */}
      <section className="mt-section space-y-block">
        <h2 className="text-2xl">Palet</h2>
        <ul className="grid grid-cols-2 gap-snug sm:grid-cols-3 lg:grid-cols-4">
          {colours.map((colour) => (
            <li key={colour.name}>
              <Card coreClassName="space-y-tight">
                <div
                  className="h-16 rounded-md border border-stone"
                  style={{ backgroundColor: colour.hex }}
                  aria-hidden="true"
                />
                <p className="font-data text-xs text-slate-muted">
                  --color-{colour.name}
                </p>
                <p className="font-data text-sm uppercase">{colour.hex}</p>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Contrast audit ──────────────────────────────────────────── */}
      <section className="mt-section space-y-block">
        <h2 className="text-2xl">Audit Kontras (WCAG 2.2 AA)</h2>
        <p className="text-slate-muted">
          Ambang teks {AA_TEXT}:1, ambang non-teks {AA_NON_TEXT}:1. Guard test
          gagal bila salah satu turun di bawah ambang.
        </p>
        <div className="grid gap-snug md:grid-cols-2">
          <Card coreClassName="space-y-snug">
            <h3 className="text-lg">Teks</h3>
            <ul className="space-y-tight">
              {TEXT_PAIRS.map(([label, fg, bg]) => {
                const ratio = roundRatio(contrastRatio(hex(fg), hex(bg)));
                const pass = ratio >= AA_TEXT;
                return (
                  <li
                    key={label}
                    className="flex flex-wrap items-center justify-between gap-tight"
                  >
                    <span className="min-w-0 text-sm">{label}</span>
                    <span
                      className={
                        pass
                          ? "font-data text-sm text-evergreen"
                          : "font-data text-sm text-alert"
                      }
                    >
                      {ratio}:1 {pass ? "LULUS" : "GAGAL"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Card>
          <Card coreClassName="space-y-snug">
            <h3 className="text-lg">Non-teks (ikon, indikator)</h3>
            <ul className="space-y-tight">
              {NON_TEXT_PAIRS.map(([label, fg, bg]) => {
                const ratio = roundRatio(contrastRatio(hex(fg), hex(bg)));
                const pass = ratio >= AA_NON_TEXT;
                return (
                  <li
                    key={label}
                    className="flex flex-wrap items-center justify-between gap-tight"
                  >
                    <span className="min-w-0 text-sm">{label}</span>
                    <span
                      className={
                        pass
                          ? "font-data text-sm text-evergreen"
                          : "font-data text-sm text-alert"
                      }
                    >
                      {ratio}:1 {pass ? "LULUS" : "GAGAL"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </section>

      {/* ── Typography ──────────────────────────────────────────────── */}
      <section className="mt-section space-y-block">
        <h2 className="text-2xl">Tipografi</h2>
        <Card coreClassName="space-y-block">
          <div>
            <p className="eyebrow">Display — Fraunces</p>
            <p className="font-display text-4xl">Kembang Bulan Ini</p>
          </div>
          <div>
            <p className="eyebrow">Body — Plus Jakarta Sans</p>
            <p className="text-base">
              Iuran bulan Oktober sudah terkumpul dari 12 rumah. Terima kasih
              atas ketertiban warga Cluster Camellia.
            </p>
          </div>
          <div>
            <p className="eyebrow">Data — IBM Plex Mono</p>
            <p className="font-data text-base">Rp1.800.000 · 3 Okt 2026</p>
          </div>
        </Card>
      </section>

      {/* ── Spacing scale ───────────────────────────────────────────── */}
      <section className="mt-section space-y-block">
        <h2 className="text-2xl">Skala Spacing</h2>
        <p className="text-slate-muted">
          Kelipatan 4px. Komponen dilarang memakai nilai di luar skala ini —
          guard test memindai kode untuk utilitas arbitrary.
        </p>
        <Card coreClassName="space-y-snug">
          <ul className="space-y-tight">
            {spacing.map((token) => (
              <li key={token.name} className="flex flex-wrap items-center gap-tight">
                <span className="w-28 shrink-0 font-data text-xs text-slate-muted">
                  --spacing-{token.name}
                </span>
                <span
                  className="h-3 shrink-0 rounded-sm bg-evergreen"
                  style={{ width: `${token.px}px` }}
                  aria-hidden="true"
                />
                <span className="font-data text-xs">{token.px}px</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* ── Radius scale ────────────────────────────────────────────── */}
      <section className="mt-section space-y-block">
        <h2 className="text-2xl">Skala Radius</h2>
        <p className="text-slate-muted">
          Radius dalam = radius luar − padding cangkang, sehingga lapisan
          selalu konsentris.
        </p>
        <ul className="flex flex-wrap gap-snug">
          {radii.map((token) => (
            <li key={token.name}>
              <Card coreClassName="space-y-tight text-center">
                <div
                  className="mx-auto size-20 border border-evergreen bg-mist"
                  style={{ borderRadius: `${token.px}px` }}
                  aria-hidden="true"
                />
                <p className="font-data text-xs text-slate-muted">
                  --radius-{token.name}
                </p>
                <p className="font-data text-sm">{token.px}px</p>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Buttons ─────────────────────────────────────────────────── */}
      <section className="mt-section space-y-block">
        <h2 className="text-2xl">Tombol</h2>
        <p className="text-slate-muted">
          Tinggi minimum 44px untuk kenyamanan sentuh. Semua state
          (default/hover/focus/disabled) memakai token yang sama.
        </p>
        <Card coreClassName="space-y-block">
          <div className="flex flex-wrap items-center gap-snug">
            <Button variant="primary">Bayar Iuran</Button>
            <Button variant="secondary">Lihat Riwayat</Button>
            <Button variant="outline">Unduh Laporan</Button>
            <Button variant="ghost">Batal</Button>
            <Button variant="destructive">Hapus</Button>
          </div>
          <div className="flex flex-wrap items-center gap-snug">
            <Button size="sm">Kecil</Button>
            <Button size="md">Sedang</Button>
            <Button size="lg">Besar</Button>
            <Button size="icon" aria-label="Tambah pengumuman">
              <span aria-hidden="true">+</span>
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-snug">
            <Button disabled>Nonaktif</Button>
          </div>
        </Card>
      </section>

      {/* ── Signature ───────────────────────────────────────────────── */}
      <section className="mt-section space-y-block">
        <h2 className="text-2xl">Elemen Tanda: PetalRing</h2>
        <p className="text-slate-muted">
          Satu kelopak mewakili satu unit kemajuan. Dipakai tiga kali dengan
          makna nyata: lambang aplikasi, progres iuran, dan giliran arisan.
          Jumlah selalu dinyatakan dalam teks, jadi warna bukan satu-satunya
          penanda.
        </p>
        <Card coreClassName="flex flex-wrap items-center gap-block">
          <div className="space-y-tight text-center">
            <PetalRing value={4} total={6} size={96} />
            <p className="text-sm">4 dari 6 rumah</p>
          </div>
          <div className="space-y-tight text-center">
            <PetalRing
              value={12}
              total={18}
              size={128}
              label="12 dari 18 rumah sudah membayar iuran Oktober"
            />
            <p className="text-sm">12 dari 18 rumah</p>
          </div>
          <div className="space-y-tight text-center">
            <PetalRing value={18} total={18} size={160} />
            <p className="text-sm">Semua sudah bayar</p>
          </div>
          <div className="space-y-tight text-center">
            <PetalRing value={0} total={6} size={96} />
            <p className="text-sm">Belum ada yang bayar</p>
          </div>
        </Card>
      </section>
    </main>
  );
}
