/* ============================================================
   MasterMind — Service Worker
   - Precaches the core app shell for offline / instant loads
   - HTML pages: network-first (fresh data, cache fallback offline)
   - Static assets: cache-first (fast repeat navigation)
   - API calls are NEVER cached
   ============================================================ */

const CACHE = 'mastermind-v9';

const PRECACHE = [
  '/assist/manifest.json',
  '/src/pages/login/index.html',
  '/bootstrap-5.0.2/dist/css/bootstrap.min.css',
  '/bootstrap-5.0.2/dist/js/bootstrap.bundle.min.js',
  '/src/assets/Mastermind_logo.jpeg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.pathname.startsWith('/api/')) return; // never cache API data

  // Page navigation: network first, cached page as fallback (offline).
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches.match(request).then((match) => match || caches.match('/src/pages/login/index.html'))
        )
    );
    return;
  }

  // Static assets: stale-while-revalidate — serve the cached copy instantly
  // for fast repeat navigation, then refresh it from the network in the
  // background. This way updated JS/CSS (like the redesigned edit cells)
  // propagate to all devices without needing a manual cache-version bump.
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        });
      // Serve what we have now; the network refresh updates the cache for next time.
      // If the network fails, fall back to the cached copy (or reject naturally
      // when there is nothing cached at all, so the browser shows its normal
      // network error instead of a swallowed TypeError).
      if (cached) {
        networkFetch.catch(() => {});
        return cached;
      }
      return networkFetch;
    })
  );
});
