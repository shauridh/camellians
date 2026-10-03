# Camellians — Rencana & Catatan Pelaksanaan Prototipe

**Spesifikasi:** [../specs/2026-10-03-camellians-design.md](../specs/2026-10-03-camellians-design.md)
**Stack:** Next.js 16.3.8 · React 19.2.8 · Tailwind CSS v4 · TypeScript 5 · Vitest 5 · Playwright 1.63 + axe-core

## Cara memverifikasi

```bash
npm run verify        # lint → typecheck → unit → build → e2e
npm run audit:palette # cetak ulang rasio kontras dari token
npm run icons         # regenerasi ikon PWA dari tanda camellia
```

## Ringkasan fase

| Task | Hasil | Status |
|---|---|---|
| 0 | Scaffold Next.js 16 + Tailwind v4 + shadcn-style primitives + git | selesai |
| 1 | Kontrak desain: token, guard WCAG + spacing, `/gaya` | selesai |
| 2 | Model domain, data mock, helper murni + test | selesai |
| 3 | Primitif UI, PetalRing, komponen domain | selesai |
| 4 | PWA: manifest, service worker, offline, install | selesai |
| 5 | App shell, navigasi, guard aksesibilitas | selesai |
| 6 | Beranda | selesai |
| 7 | Iuran | selesai |
| 8 | Rute stub berdesain (8 modul) | selesai |
| 9 | Verifikasi akhir, dokumentasi | selesai |

## Penyimpangan dari rencana awal

1. **Service worker ditulis tangan, bukan Serwist.** `@serwist/next` bekerja
   lewat webpack; Next.js 16 memakai Turbopack secara default dan build gagal.
   `public/sw.js` memberi kontrak yang sama tanpa kopling ke build tool.
2. **Dua token warna dikoreksi oleh guard, bukan oleh mata.** `brass`
   `#B98A3C` (2.88:1) → `#A68645` (3.19:1); `sage` `#7C9A8B` (2.84:1) →
   `#72977C` (3.03:1). Keduanya gagal ambang non-teks 3:1 padahal keduanya
   menggambar indikator. Guard menemukannya lebih dulu daripada review visual.
3. **Badge "Penting" diubah bentuk.** Rose di atas blush hanya 4.29:1; kini
   badge rose pekat dengan teks ivory (4.85:1). Pasangan ini masuk guard.
4. **Ukuran target dinaikkan ke 44px di seluruh aplikasi**, di atas minimum
   24px yang diminta WCAG 2.5.8, karena warga memakai aplikasi ini sambil
   berdiri di depan pos keamanan atau di dalam mobil.
5. **`tabular-nums` tidak dipakai.** IBM Plex Mono sudah monospace; angka
   Rupiah rata dengan sendirinya.

## Temuan selama pembangunan (dan perbaikannya)

| Temuan | Diperbaiki dengan |
|---|---|
| Semua kelopak menumpuk jadi satu bentuk | Rotasi (atribut SVG) dipisah dari animasi (CSS) ke dua `<g>` bersarang |
| Geometri roset membentuk kotak, bukan bunga | Geometri diturunkan dari jumlah kelopak; ditambah benang sari di pusat |
| "Lihat semua" hanya 20px tinggi | `min-h-11` + flex, jadi 44px |
| Tautan lewati konten hanya 36px saat fokus | `focus:min-h-11 focus:inline-flex` |
| `/gaya` meluber 2px pada 320px | Baris padat jadi `flex-wrap`, label menyusut |
| Dua landmark bernama sama (`Navigasi utama`) | Landmark mobile dinamai "Navigasi bawah" |
| Tanggal bayar bisa jatuh di masa depan | Pembayaran selalu H-8 dari jatuh tempo + test integritas |
| `pb-[env(safe-area-inset-bottom)]` melanggar aturan spacing | Pindah ke kelas `.pb-safe` di lapisan CSS |
| `setState` di dalam effect (cascading render) | Reveal tidak lagi menyetel state untuk reduced-motion |

## Hasil verifikasi

```
npm run lint      → 0 masalah
npm run typecheck → 0 error
npm test          → 100 lulus (5 berkas)
npm run build     → 14 rute, sukses
npm run test:e2e  → 27 lulus (axe 0 pelanggaran di 12 rute)
npm run audit:palette → semua pasangan di atas ambang
```

## Fase berikutnya

1. **Supabase**: skema Postgres (warga, iuran, pengumuman, keluhan, agenda,
   arisan) + RLS per peran, auth, storage foto. Ganti isi `src/lib/mock/`.
2. **Verifikasi warga**: daftar → menunggu persetujuan pengurus → aktif.
3. **Modul penuh** di balik rute stub, dimulai dari Direktori (kontak darurat
   + info tukang) karena datanya sudah lengkap.
4. **Keamanan & Komunitas**: jadwal ronda, buku tamu, tombol darurat;
   marketplace, galeri, polling.
5. **Notifikasi push** (VAPID) untuk pengumuman dan pengingat iuran.
