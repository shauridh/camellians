# Camellians — Spesifikasi Desain

**Tanggal:** 3 Oktober 2026
**Status:** Prototipe visual + PWA shell (fase 1, disetujui dan dibangun)

## Masalah

Paguyuban Cluster Camellia mengelola 18 rumah. Informasi warga (pengumuman,
iuran, keluhan, agenda, arisan, kontak darurat, tukang langganan) tersebar di
percakapan grup dan catatan pengurus. Tidak ada satu tempat yang bisa dibuka
warga kapan saja, dan tidak ada rekap iuran yang bisa dilihat semua pihak.

## Tujuan fase ini

Membangun prototipe yang **bisa dipasang sebagai aplikasi** di ponsel warga,
dengan sistem desain final dan dua halaman penuh berisi data sungguhan
(mock), supaya arah visual dan struktur data tervalidasi sebelum backend
dibangun.

**Bukan tujuan fase ini:** autentikasi nyata, basis data, unggah foto,
notifikasi push, verifikasi warga.

## Kontrak Desain

Dua sumbu konsistensi, masing-masing ditegakkan oleh test yang bisa gagal —
bukan sekadar diperiksa manual.

### WCAG 2.2 AA — kriteria yang diuji otomatis

| SC | Kriteria | Ditegakkan oleh |
|---|---|---|
| 1.4.3 | Contrast (Minimum) | Unit test menghitung rasio dari token; semua pasangan teks ≥ 4.5:1 |
| 1.4.11 | Non-text Contrast | Unit test rasio non-teks ≥ 3:1 (ikon, indikator petal, garis fokus) |
| 1.4.10 | Reflow | Playwright: tanpa gulir horizontal pada 320px |
| 1.4.12 | Text Spacing | Playwright: spacing diperbesar, tidak ada teks terpotong |
| 1.4.13 | Content on Hover/Focus | Playwright: sheet dapat ditutup dengan Escape |
| 1.4.1 | Use of Color | Status selalu disertai ikon + label teks, tidak pernah warna saja |
| 2.4.1 | Bypass Blocks | Playwright: Tab pertama memfokuskan "Lewati ke konten" |
| 2.4.7 | Focus Visible | Playwright: setiap perhentian Tab punya outline ≥ 2px |
| 2.5.8 | Target Size | Playwright: kontrol ≥ 44×44px (di atas minimum WCAG 24px) |
| 2.3.3 | Animation from Interactions | Playwright: `prefers-reduced-motion` → durasi ≤ 0.01ms |
| 1.3.1 / 4.1.2 | Info & Relationships / Name, Role, Value | axe-core: 0 pelanggaran di 12 rute |

### Skala spacing — satu skala, tanpa nilai liar

Skala 4px, dideklarasikan sebagai token `--spacing-*` sehingga Tailwind v4
menghasilkan utilitas semantik (`p-card`, `gap-stack`, `px-gutter`).
**Nilai di luar skala dilarang**, termasuk utilitas arbitrary seperti
`p-[13px]`.

| Token | Nilai | Dipakai untuk |
|---|---|---|
| `hair` | 4px | Jarak ikon–teks |
| `tight` | 8px | Elemen dalam satu baris |
| `snug` | 12px | Gap antar item list |
| `card` / `card-lg` | 16 / 24px | Padding kartu (mobile / ≥768px) |
| `block` | 24px | Jarak antar blok |
| `section` / `section-lg` | 32 / 48px | Jarak antar section |
| `gutter` / `gutter-lg` | 16 / 24px | Tepi halaman |
| `shell` | 8px | Padding cangkang double-bezel |
| `tabbar` | 76px | Ruang bawah agar tab bar tidak menutupi fokus |

Radius konsentris: **radius dalam = radius luar − padding cangkang**, yaitu
28 − 8 = 20px. Diuji, bukan dihitung ulang secara manual.

### Empat guard yang menjaga kontrak

| Guard | Mekanisme | Gagal bila |
|---|---|---|
| Kontras token | Vitest menghitung rasio WCAG dari `globals.css` | Ada pasangan di bawah ambang |
| Spacing liar | Vitest memindai `src/components/**` | Ada utilitas arbitrary |
| Hex mentah | Vitest memindai `src/components/**` | Ada warna literal di komponen |
| Aksesibilitas rute | Playwright + axe-core | Ada pelanggaran / target kecil / fokus tak terlihat |

## Palet — "Evergreen Ledger"

Nilai di bawah ini **dihitung** dari token, bukan diklaim. Skrip
`npm run audit:palette` mencetaknya ulang.

| Token | Hex | Peran | Rasio di ivory |
|---|---|---|---|
| `ink` | `#16241E` | Teks utama | 14.94:1 |
| `evergreen` | `#2E5A4B` | Merek, tombol, cincin fokus | 7.27:1 |
| `evergreen-deep` | `#1D3B31` | Judul, header | 11.32:1 |
| `slate-muted` | `#5B6B63` | Teks sekunder | 5.23:1 |
| `camellia` | `#B04A66` | Aksen rose (aman untuk teks) | 4.85:1 |
| `alert` | `#B3261E` | Tunggakan, destruktif | 6.07:1 |
| `brass` | `#A68645` | Aksen "mekar" | 3.19:1 — non-teks saja |
| `sage` | `#72977C` | Ikon, dekorasi | 3.03:1 — non-teks saja |
| `stone` | `#E6DFD4` | Garis tepi | dekoratif |
| `ivory` / `paper` / `mist` / `blush` | — | Permukaan | — |

**Dua koreksi terhadap rencana awal**, keduanya ditemukan oleh guard dan
bukan oleh mata:

1. `brass` awal `#B98A3C` hanya 2.88:1 — gagal ambang non-teks 3:1, padahal
   ia menggambar indikator kelopak. Diganti `#A68645` (3.19:1) yang juga
   menjaga kontras teks `ink` di atasnya (4.69:1).
2. `sage` awal `#7C9A8B` hanya 2.84:1. Diganti `#72977C` — sage paling terang
   yang masih lolos 3:1, sehingga tetap tenang.

Selain itu, badge "Penting" semula rose di atas blush (4.29:1, gagal). Bentuk
akhirnya badge rose pekat dengan teks ivory (4.85:1), dan pasangan ini
ditambahkan ke guard.

## Tipografi

- **Display — Fraunces**: judul, `letter-spacing: -0.01em`
- **Body/UI — Plus Jakarta Sans**: dirancang untuk Bahasa Indonesia, 16px, line-height 1.6
- **Data — IBM Plex Mono**: eyebrow uppercase `tracking-eyebrow`, tanggal, Rupiah

## Elemen tanda — PetalRing

Roset camellia enam hingga delapan belas kelopak. Satu kelopak = satu unit
kemajuan: satu rumah membayar iuran, atau satu putaran arisan berjalan.
Geometrinya diturunkan dari jumlah kelopak (kelopak duduk di anulus antara
`inner` dan tepi, lebarnya dibatasi ruang keliling), sehingga ring 6 kelopak
dan 16 kelopak terbaca sebagai bunga yang sama.

- Kelopak terisi = `brass`; belum = `mist` dengan garis `slate-muted`
- Pusatnya benang sari (stamen) ivory bertepi brass
- **Satu `<svg role="img">` dengan `aria-label` deskriptif** — pembaca layar
  mendengar "12 dari 16 rumah sudah membayar", bukan menghitung kelopak
- Jumlah selalu dinyatakan lagi dalam teks di sebelahnya

Catatan implementasi: rotasi berada di `<g>` luar sebagai atribut SVG,
animasi di `<g>` dalam. Bila keduanya berada di elemen yang sama, `transform`
dari keyframes menimpa atribut `rotate` dan semua kelopak menumpuk di satu
titik — bug ini sempat terjadi dan tertangkap lewat pemeriksaan visual.

## Arsitektur

```
src/
  app/
    layout.tsx            # font, metadata, viewport, registrasi service worker
    globals.css           # SATU sumber kebenaran desain (warna, spacing, radius)
    manifest.ts           # web app manifest
    (app)/                # shell aplikasi
      layout.tsx  page.tsx (Beranda)  iuran/  pengumuman/  keluhan/
      direktori/  agenda/  arisan/  keamanan/  laporan-kas/  admin/
    gaya/                 # styleguide internal — permukaan review desain
    ~offline/             # fallback offline
  components/
    ui/                   # primitif (button, card)
    brand/                # PetalRing
    shell/                # AppShell, AppNav, PageHeader, Reveal, ServiceWorkerRegister
    domain/               # kartu domain (pengumuman, iuran, kas, kontak, agenda)
  lib/
    types.ts              # model domain — kontrak dengan UI
    format.ts             # rupiah(), tanggalID(), selisihHari()
    contrast.ts           # matematika WCAG (murni, teruji)
    tokens.ts             # membaca token dari globals.css (dipakai test & styleguide)
    mock/data.ts          # satu-satunya tempat data literal
    mock/queries.ts       # satu-satunya pintu data bagi komponen
public/
  sw.js                   # service worker tulisan tangan
  icons/                  # ikon PWA hasil generate
```

**Batas yang penting:** komponen tidak pernah mengimpor `mock/data.ts`
langsung; semuanya lewat `mock/queries.ts`. Mengganti isi folder `mock/`
dengan kueri Supabase adalah keseluruhan migrasi — props komponen tidak
berubah.

### Keputusan: service worker tulisan tangan, bukan Serwist

Rencana awal memakai Serwist 9.5.12. `@serwist/next` menyisipkan dirinya ke
pipeline webpack, sedangkan Next.js 16 membangun dengan Turbopack secara
default — kombinasi keduanya **menggagalkan build** dengan pesan bahwa
konfigurasi webpack tidak didukung. Membangun ulang seluruh proyek ke
bundler lama demi satu berkas bukan pertukaran yang baik.

`public/sw.js` karena itu ditulis langsung: precache halaman offline,
navigasi network-first dengan fallback halaman terakhir lalu `/~offline`,
aset statis cache-first (nama berkas ber-hash, jadi tidak mungkin basi), cache
diberi versi dan dipangkas saat activate. Kontraknya identik dengan yang
dijanjikan rencana, tanpa kopling ke build tool. Diverifikasi oleh
`tests/e2e/pwa.spec.ts`.

### Alasan teknis lain yang perlu dicatat

- **Tanggal acuan tetap.** `HARI_INI = "2026-10-03"` dipakai alih-alih
  `new Date()` agar status iuran deterministik di setiap render dan
  screenshot. Diganti jam sebenarnya saat lapisan Supabase masuk.
- **`pb-safe` sebagai kelas CSS.** `env(safe-area-inset-bottom)` tidak bisa
  menjadi token statis, jadi ia hidup di lapisan CSS, bukan sebagai utilitas
  arbitrary di komponen.
- **Animasi reveal bersifat progressive.** Markup selalu terlihat; animasi
  hanya tambahan, sehingga konten tetap terbaca tanpa JavaScript.

## Lingkup terverifikasi

12 rute, 100 unit test, 27 test Playwright (axe 0 pelanggaran), build
produksi bersih, lint bersih, `tsc` bersih.

**Yang belum dibangun:** autentikasi dan verifikasi warga, basis data
Supabase, CRUD nyata, unggah foto, notifikasi push, dan modul penuh di balik
rute stub.
