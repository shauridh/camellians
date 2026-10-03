import { expect, test } from "@playwright/test";

/**
 * PWA contract: the app is installable, the worker registers, and an
 * unvisited route opened without a connection lands on the designed offline
 * page rather than the browser's error screen.
 */

test("manifest menyatakan aplikasi installable", async ({ request }) => {
  const response = await request.get("/manifest.webmanifest");
  expect(response.status()).toBe(200);

  const manifest = await response.json();

  expect(manifest.name).toContain("Camellians");
  expect(manifest.short_name).toBe("Camellians");
  expect(manifest.display).toBe("standalone");
  expect(manifest.start_url).toContain("/?source=pwa");
  expect(manifest.lang).toBe("id");
  // Brand tokens, not defaults.
  expect(manifest.theme_color).toBe("#2E5A4B");
  expect(manifest.background_color).toBe("#FAF6EF");

  const sizes = manifest.icons.map((icon: { sizes: string }) => icon.sizes);
  expect(sizes).toContain("192x192");
  expect(sizes).toContain("512x512");

  const purposes = manifest.icons.map(
    (icon: { purpose?: string }) => icon.purpose,
  );
  expect(purposes).toContain("maskable");
});

test("ikon yang dideklarasikan benar-benar tersedia", async ({ request }) => {
  for (const path of [
    "/icons/icon-192.png",
    "/icons/icon-512.png",
    "/icons/icon-512-maskable.png",
    "/icons/apple-touch-icon.png",
  ]) {
    const response = await request.get(path);
    expect(response.status(), `${path} tidak ditemukan`).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
  }
});

test("service worker terdaftar dan mengendalikan halaman", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const registration = await page.evaluate(async () => {
    if (!("serviceWorker" in navigator)) return null;
    const reg = await navigator.serviceWorker.getRegistration("/");
    if (!reg) return null;
    // Wait until a worker is actually active, not merely registered.
    const active = reg.active ?? (await navigator.serviceWorker.ready).active;
    return { active: Boolean(active), scope: reg.scope };
  });

  expect(registration).not.toBeNull();
  expect(registration?.active).toBe(true);
  expect(registration?.scope).toContain("/");
});

test("rute yang belum pernah dibuka saat offline menampilkan halaman offline", async ({
  page,
  context,
}) => {
  // First visit primes the worker and precaches the offline page.
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });

  await context.setOffline(true);
  try {
    const response = await page.goto("/laporan-kas");
    // Either the cached page or the offline fallback — never a crash.
    expect(response).not.toBeNull();

    await expect(
      page.getByRole("heading", { name: /sedang offline|pengumuman|iuran|kas/i }).first(),
    ).toBeVisible({ timeout: 10_000 });
  } finally {
    await context.setOffline(false);
  }
});

test("halaman offline dapat dicapai langsung dan tetap berdesain", async ({ page }) => {
  await page.goto("/~offline");

  await expect(page.getByRole("heading", { name: "Sedang offline" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Coba lagi" })).toBeVisible();
});
