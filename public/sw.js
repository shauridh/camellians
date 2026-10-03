/*
 * Camellians service worker.
 *
 * Three behaviours, no more:
 *   1. Precache the designed offline page so it exists the first time the
 *      network drops — not only after a visit.
 *   2. Navigations go network-first so residents always see current
 *      announcements when they have signal, and fall back to the last good
 *      page (then the offline screen) when they do not.
 *   3. Static build assets and icons are cache-first: they are content
 *      hashed, so a cached copy can never be stale.
 *
 * Cache storage is versioned and pruned on activate so a deploy cannot leave
 * an old shell behind.
 */

const CACHE_NAME = "camellians-v1";
const OFFLINE_URL = "/~offline";
const MAX_PAGES = 24;

const PRECACHE_URLS = [
  OFFLINE_URL,
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Individually, so one flaky asset cannot fail the whole install.
      await Promise.all(
        PRECACHE_URLS.map((url) =>
          cache.add(new Request(url, { cache: "reload" })).catch(() => undefined),
        ),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

/** Trims cached navigations so storage cannot grow without bound. */
async function prunePages(cache) {
  const requests = await cache.keys();
  const pages = requests.filter((req) => req.mode === "navigate");
  if (pages.length <= MAX_PAGES) return;
  const excess = pages.slice(0, pages.length - MAX_PAGES);
  await Promise.all(excess.map((req) => cache.delete(req)));
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Never interfere with non-GET or cross-origin traffic.
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        try {
          const fresh = await fetch(request);
          if (fresh && fresh.ok) {
            await cache.put(request, fresh.clone());
            await prunePages(cache);
          }
          return fresh;
        } catch {
          const cached = await cache.match(request);
          if (cached) return cached;
          const offline = await cache.match(OFFLINE_URL);
          if (offline) return offline;
          return new Response("Tidak ada koneksi.", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        }
      })(),
    );
    return;
  }

  const isStaticAsset =
    url.pathname.startsWith("/_next/static/") ||
    /\.(?:png|jpe?g|svg|webp|avif|ico|woff2?|css|js)$/.test(url.pathname);

  if (!isStaticAsset) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      if (cached) return cached;
      try {
        const fresh = await fetch(request);
        // Opaque and error responses are not worth keeping.
        if (fresh && fresh.ok && fresh.type !== "opaque") {
          await cache.put(request, fresh.clone());
        }
        return fresh;
      } catch {
        return new Response("", { status: 504 });
      }
    })(),
  );
});
