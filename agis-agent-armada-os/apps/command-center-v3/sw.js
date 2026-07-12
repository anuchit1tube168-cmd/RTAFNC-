const CACHE='agis-command-center-v5-responsive-20260712';
const ASSETS=['./','index.html','manifest.webmanifest','icon.svg','processor-console.html','processor-client.js','captain-console.html','captain-console-v5.css','captain-console-v4-data.js','captain-console-v5.js','assets/agis-grand-line-deck.svg','assets/agis-crew-sprites.svg','crew-operations.json','loop-engine.json','release.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request))));
