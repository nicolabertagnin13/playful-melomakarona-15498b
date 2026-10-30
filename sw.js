const CACHE_NAME = 'modulo-ced-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './libs/pdf.min.js',
  './libs/pdf.worker.min.js',
  './libs/jspdf.umd.min.js',
  './logo-s.png',
  './logo-w.png',
  './icon-512.png' // Ho visto solo questa nello screenshot, aggiungi icon-192 se la crei
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
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
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});