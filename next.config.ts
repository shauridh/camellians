import type { NextConfig } from "next";

/**
 * The service worker lives at `public/sw.js` as a hand-written static file.
 *
 * Why not Serwist: `@serwist/next` hooks into the webpack pipeline, and
 * Next.js 16 builds with Turbopack by default — combining them fails the
 * build outright. Rather than pin the whole project to a legacy bundler for
 * one file, the worker is written directly. It gives the same contract
 * (precached offline page, network-first navigations, cache-first assets)
 * with no build-time coupling.
 */
const nextConfig: NextConfig = {
  /* Do not advertise the framework in production responses. */
  poweredByHeader: false,
};

export default nextConfig;
