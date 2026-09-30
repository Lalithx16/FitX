/**
 * Minimal hand-rolled service worker (no Workbox dependency).
 *
 * Strategy:
 *  - Precache the app shell routes, manifest, icons and all exercise
 *    thumbnails on install, so the app opens and every workout screen
 *    renders fully even with zero connectivity (e.g. a gym basement).
 *  - Stale-while-revalidate for everything same-origin at runtime: serve
 *    from cache instantly when available while updating the cache in the
 *    background, so hashed Next.js JS/CSS chunks get cached lazily as
 *    they're requested without needing to know their build-time filenames
 *    in advance.
 *  - Bump CACHE_VERSION whenever you want to force clients to drop old
 *    cached assets after a deploy.
 */

const CACHE_VERSION = "leanfit-cache-v1";

const PRECACHE_URLS = [
  "/",
  "/workouts",
  "/workouts/day1",
  "/workouts/day2",
  "/workouts/day3",
  "/workouts/day4",
  "/fuel",
  "/progress",
  "/guide",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512.png",
  "/icons/apple-touch-icon.png",
  "/exercises/cable_curl.webp",
  "/exercises/cable_fly.webp",
  "/exercises/calf_raise.webp",
  "/exercises/chest_supported_row.webp",
  "/exercises/db_shoulder_press.webp",
  "/exercises/flat_db_press.webp",
  "/exercises/goblet_squat.webp",
  "/exercises/hammer_curl.webp",
  "/exercises/hanging_knee_raise.webp",
  "/exercises/hip_thrust.webp",
  "/exercises/incline_db_curl.webp",
  "/exercises/incline_db_press.webp",
  "/exercises/lat_pulldown.webp",
  "/exercises/lateral_raise.webp",
  "/exercises/leg_extension.webp",
  "/exercises/leg_press.webp",
  "/exercises/light_cardio.webp",
  "/exercises/machine_shoulder_press.webp",
  "/exercises/oh_triceps_ext.webp",
  "/exercises/pullup.webp",
  "/exercises/rdl.webp",
  "/exercises/rear_delt_fly.webp",
  "/exercises/rest_walk.webp",
  "/exercises/seated_cable_row.webp",
  "/exercises/seated_leg_curl.webp",
  "/exercises/triceps_pushdown.webp",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch(() => {
        /* best-effort precache — a failed asset shouldn't block install */
      })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      const networkFetch = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached || caches.match("/"));
      return cached || networkFetch;
    })
  );
});
