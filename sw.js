/*
  sw.js — the site's service worker (registered by facet.js via
  data-service-worker="/sw.js").

  Strategy: NETWORK-FIRST for every same-origin GET. Nothing may be served
  stale while the site is in active development: every refresh loads fresh
  from the network, and the cache answers only when the network can't
  (offline). The Facet library is loaded live and cross-origin from
  facet.tanishksharma.com and is deliberately never cached, so library
  updates show up immediately — offline, the page opens but unstyled
  (accepted trade-off until a frozen /lib/v1 exists).

  Bump CACHE on strategy changes so old caches are swept on activate.
*/

const CACHE = "tokyobyrail-v2";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(["/", "/manifest.webmanifest", "/stations.json",
                                    "/icons/icon-192.png", "/icons/icon-512.png"]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== location.origin) return;

  // The query string carries view state, not different documents:
  // cache every variant of a page under its bare path.
  const cacheKey = url.origin + url.pathname;

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      // Network-first, no exceptions: fresh on every refresh, cache = offline net.
      try {
        const response = await fetch(event.request);
        if (response.ok) cache.put(cacheKey, response.clone());
        return response;
      } catch {
        const cached = await cache.match(cacheKey);
        if (cached) return cached;
        throw new Error("offline and uncached");
      }
    })
  );
});
