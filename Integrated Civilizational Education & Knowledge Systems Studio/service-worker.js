// IKS Studio Service Worker v1.0
// Developed for: Integrated Civilizational Education & Knowledge Systems Studio
// Author: Mateen Yousuf, School Education Department Kashmir

const CACHE_NAME = 'iks-studio-v1';
const OFFLINE_URLS = [
  './',
  './index.html',
  './manifest.json'
];

// ── INSTALL: Cache all core assets ──────────────────────────────────────────
self.addEventListener('install', event => {
  console.log('[IKS-SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[IKS-SW] Caching core assets');
      return cache.addAll(OFFLINE_URLS);
    }).then(() => {
      console.log('[IKS-SW] Installation complete');
      return self.skipWaiting();
    }).catch(err => {
      console.error('[IKS-SW] Cache failed:', err);
    })
  );
});

// ── ACTIVATE: Clean old caches ───────────────────────────────────────────────
self.addEventListener('activate', event => {
  console.log('[IKS-SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('[IKS-SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[IKS-SW] Activation complete — claiming clients');
      return self.clients.claim();
    })
  );
});

// ── FETCH: Cache-first strategy ──────────────────────────────────────────────
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip non-HTTP requests (chrome-extension, etc.)
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Serve from cache
        return cachedResponse;
      }

      // Not in cache — try network, then cache the response
      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
          return networkResponse;
        }
        // Cache the new response for future offline use
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return networkResponse;
      }).catch(() => {
        // Network failed and not in cache
        // Return the cached index.html as fallback
        return caches.match('./index.html');
      });
    })
  );
});

// ── MESSAGE: Handle skip-waiting from update prompts ────────────────────────
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[IKS-SW] Service worker script loaded — IKS Studio v1.0');
