const CACHE_NAME = 'calculator-cache-v1';
const FILES_TO_CACHE = [
  'index.html',
  'manifest.webmanifest',
  'icon-192.png',
  'icon-512.png',
  // optional: CSS/JS-Dateien hinzufügen, z.B.:
  // 'style.css',
  // 'app.js'
];

// Install: Cache alle wichtigen Dateien
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting(); // Aktiviert SW sofort
});

// Activate: Alte Caches löschen
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim(); // Übernimmt Kontrolle sofort
});

// Fetch: Cache-First Strategie
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(resp => resp || fetch(e.request))
      .catch(() => {
        // Optional: Fallback für Offline-Seiten
        if (e.request.mode === 'navigate') {
          return caches.match('index.html');
        }
      })
  );
});
