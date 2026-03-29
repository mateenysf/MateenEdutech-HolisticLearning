/**
 * DebateMind – Service Worker
 * Offline caching for PWA functionality
 * Author: Mateen Yousuf, Teacher – School Education Department, J&K
 * Aligned with NEP 2020 & NCF 2023
 */

const CACHE_NAME = 'debatemind-v1.0.0';

// Files to cache for offline use
const CACHE_FILES = [
  './',
  './index.html',
  './manifest.json',
  './author.jpg',
];

// ── INSTALL EVENT: Cache all essential files ──
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Installing DebateMind cache...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(CACHE_FILES);
      })
      .then(() => self.skipWaiting())
      .catch(err => console.log('[ServiceWorker] Cache error:', err))
  );
});

// ── ACTIVATE EVENT: Clean old caches ──
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('[ServiceWorker] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// ── FETCH EVENT: Serve from cache, fallback to network ──
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response if found
        if (cachedResponse) {
          return cachedResponse;
        }
        // Otherwise fetch from network
        return fetch(event.request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // Clone and cache the new response
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseToCache));
            return response;
          })
          .catch(() => {
            // If both cache and network fail, return offline page
            return caches.match('./index.html');
          });
      })
  );
});
