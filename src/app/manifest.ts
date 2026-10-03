import type { MetadataRoute } from "next";

/**
 * Web app manifest. Values mirror the design tokens: theme colour is
 * `--color-evergreen` and the splash background is `--color-ivory`, so the
 * install experience matches the app itself.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Camellians — Paguyuban Cluster Camellia",
    short_name: "Camellians",
    description:
      "Aplikasi warga Cluster Camellia: pengumuman, iuran, keluhan, agenda, dan arisan dalam satu tempat.",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#FAF6EF",
    theme_color: "#2E5A4B",
    lang: "id",
    dir: "ltr",
    categories: ["social", "productivity", "lifestyle"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Iuran",
        short_name: "Iuran",
        description: "Lihat status iuran bulan ini",
        url: "/iuran?source=shortcut",
      },
      {
        name: "Lapor Keluhan",
        short_name: "Lapor",
        description: "Kirim keluhan atau laporan fasilitas",
        url: "/keluhan?source=shortcut",
      },
      {
        name: "Pengumuman",
        short_name: "Info",
        description: "Baca pengumuman terbaru",
        url: "/pengumuman?source=shortcut",
      },
    ],
  };
}
