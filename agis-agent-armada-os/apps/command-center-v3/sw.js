const CACHE = 'agis-command-center-v6-3-project-forge-20260714';
const CORE_ASSETS = [
  './','index.html','manifest.webmanifest','icon.svg',
  'processor-console.html','processor-setup.html','processor-setup.css','processor-setup.js','processor-client.js',
  'captain-console.html','captain-console-v5.css','captain-console-v6.css','captain-console-v4-data.js','captain-console-v5.js','captain-console-v5-sync.js','captain-console-v6.js',
  'project-forge.html','project-forge.css','project-forge.js','project-forge-core.js','project-forge-ui.js','project-forge-app.js',
  'pixel-library.html','pixel-character-engine.js','assets/pixel/pixel-assets.js','assets/pixel/manifest.json',
  'assets/agis-grand-line-deck.svg','assets/agis-grand-line-deck-v6.svg','assets/agis-crew-sprites.svg','assets/agis-crew-sprite-atlas-v6.svg','assets/agis-crew-sprite-manifest-v6.json',
  'crew-operations.json','loop-engine.json','release.json'
];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE_ASSETS))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))));
self.addEventListener('fetch',event=>event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request))));
