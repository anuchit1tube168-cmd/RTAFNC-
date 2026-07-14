const CACHE = 'agis-active-operations-v7-20260714';
const CORE_ASSETS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'icon.svg',
  'processor-console.html',
  'processor-setup.html',
  'processor-setup.css',
  'processor-setup.js',
  'processor-client.js',
  'captain-console.html',
  'captain-console-v5.css',
  'captain-console-v7.css',
  'captain-console-v4-data.js',
  'captain-console-v5.js',
  'captain-console-v5-sync.js',
  'captain-console-v7-events.js',
  'captain-console-v7.js',
  'active-operations.html',
  'rpg-operations.html',
  'pixel-library.html',
  'pixel-character-engine.js',
  'assets/pixel/pixel-assets.js',
  'assets/pixel/manifest.json',
  'assets/agis-grand-line-deck.svg',
  'assets/agis-grand-line-deck-v6.svg',
  'assets/agis-crew-sprites.svg',
  'assets/agis-crew-sprite-atlas-v6.svg',
  'assets/agis-crew-sprite-manifest-v6.json',
  'crew-operations.json',
  'loop-engine.json',
  'release.json'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const requestUrl = new URL(event.request.url);
    if (response.ok && requestUrl.origin === self.location.origin) {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy));
    }
    return response;
  })));
});