const CACHE='agis-command-center-v4-grand-line-20260712';
const ASSETS=['./','index.html','manifest.webmanifest','icon.svg','processor-console.html','processor-client.js','captain-console.html','captain-console-v4.css','captain-console-v4-extra.css','captain-console-v4-data.js','captain-console-v4-ui.js','captain-console-v4.js','assets/agis-grand-line-deck.svg','assets/agis-crew-sprites.svg','crew-operations.json','loop-engine.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x))))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request))));
