# Camellians

Aplikasi PWA untuk Paguyuban Cluster Camellia — satu tempat untuk pengumuman,
iuran, agenda, arisan, keluhan, dan kontak warga, yang bisa dipasang di ponsel
warga dan tetap terbuka saat sinyal jelek.

**Status: prototipe visual + PWA shell (fase 1).** Seluruh tampilan dan sistem
desain sudah final dan terverifikasi; datanya masih mock dan belum ada
autentikasi. Lihat [spesifikasi desain](docs/superpowers/specs/2026-10-03-camellians-design.md)
dan [catatan pelaksanaan](docs/superpowers/plans/2026-10-03-camellians-prototype.md).

## Menjalankan

```bash
npm install
npm run dev          # http://localhost:3000
```

Service worker hanya aktif pada build produksi:

```bash
npm run build
npm run start
```

## Verifikasi

```bash
npm run verify        # lint → typecheck → unit → build → e2e (satu perintah)
```

| Perintah | Yang diperiksa |
|---|---|
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | 100 unit test — termasuk guard kontras & spacing |
| `npm run build` | Build produksi (14 rute) |
| `npm run test:e2e` | 27 test Playwright — axe 0 pelanggaran di 12 rute |
| `npm run audit:palette` | Cetak ulang rasio kontras dari token |
| `npm run test:shots` | Tangkapan layar 375 / 768 / 1440 px |

## Kontrak desain

Dua sumbu konsistensi ditegakkan oleh test yang bisa gagal — bukan diperiksa
manual.

**WCAG 2.2 AA.** Unit test menghitung rasio kontras dari token di
[globals.css](src/app/globals.css) (teks ≥ 4.5:1, non-teks ≥ 3:1), dan
memindai komponen untuk spacing liar serta hex mentah. Playwright memverifikasi
target ≥ 44×44px, fokus terlihat dan tidak tertutup, reflow 320px, text
spacing, `prefers-reduced-motion`, serta Escape pada sheet.

**Satu skala spacing.** Skala 4px dideklarasikan sebagai token `--spacing-*`,
sehingga Tailwind menghasilkan utilitas semantik (`p-card`, `gap-stack`,
`px-gutter`) dan komponen tidak punya nilai sembarang untuk dipakai.

Guard ini sudah membuktikan dirinya: ia menangkap `brass` (2.88:1) dan `sage`
(2.84:1) yang gagal ambang non-teks, dan memaksa keduanya diganti sebelum
sempat dirilis.

## Struktur

```
src/
  app/
    (app)/            # shell aplikasi: Beranda, Iuran, 8 modul stub
    gaya/             # styleguide internal — permukaan review desain
    ~offline/         # fallback offline
    globals.css       # SATU sumber kebenaran desain
  components/         # ui/ · brand/ (PetalRing) · shell/ · domain/
  lib/
    mock/             # satu-satunya sumber data; queries.ts pintu masuknya
public/sw.js          # service worker tulisan tangan
```

**Batas yang penting:** komponen tidak pernah mengimpor `mock/data.ts`
langsung — semuanya lewat `mock/queries.ts`. Mengganti isi folder `mock/`
dengan kueri Supabase adalah keseluruhan migrasi; props komponen tidak
berubah.

## Yang belum dibangun

Autentikasi dan verifikasi warga, basis data, CRUD nyata, unggah foto,
notifikasi push, dan modul penuh di balik rute stub. Tanggal masih memakai
acuan tetap (`HARI_INI`) agar render dan tangkapan layar deterministik.
