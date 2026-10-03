import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";

import { ServiceWorkerRegister } from "@/components/shell/ServiceWorkerRegister";

import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  applicationName: "Camellians",
  title: {
    default: "Camellians — Paguyuban Cluster Camellia",
    template: "%s · Camellians",
  },
  description:
    "Aplikasi warga Cluster Camellia: pengumuman, iuran, keluhan, agenda, dan arisan dalam satu tempat.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Camellians",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/icons/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#2E5A4B",
  width: "device-width",
  initialScale: 1,
  // Zoom is never disabled — SC 1.4.4 Resize Text.
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={`${fraunces.variable} ${jakarta.variable} ${plexMono.variable} h-full`}
    >
      <body className="min-h-full">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
