const CACHE_NAME = 'modulo-ced-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './libs/pdf.min.js',
  './libs/pdf.worker.min.js',
  './libs/jspdf.umd.min.js',
  './logo-s.png',
  './logo-w.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Se la richiesta è un caricamento di pagina (navigazione)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Se la rete fallisce (offline), usa index.html dalla cache
        return caches.match('./index.html');
      })
    );
    return;
  }

  // Per tutte le altre risorse: prima la cache, poi la rete
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});