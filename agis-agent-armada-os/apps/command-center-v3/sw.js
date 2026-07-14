const CACHE = 'agis-command-center-v5-3-canvas-pixel-studio-20260714';
const CORE_ASSETS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'icon.svg',
  'processor-console.html',
  'processor-client.js',
  'captain-console.html',
  'captain-console-v5.css',
  'captain-console-v4-data.js',
  'captain-console-v5.js',
  'captain-console-v5-sync.js',
  'pixel-library.html',
  'pixel-character-engine.js',
  'assets/pixel/pixel-assets.js',
  'assets/pixel/manifest.json',
  'assets/agis-grand-line-deck.svg',
  'assets/agis-crew-sprites.svg',
  'crew-operations.json',
  'loop-engine.json',
  'release.json'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        const requestUrl = new URL(event.request.url);
        if (response.ok && requestUrl.origin === self.location.origin) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
        }
        return response;
      });
    })
  );
});
