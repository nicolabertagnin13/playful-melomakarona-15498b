// sw.js - Service Worker minimo funzionante
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Intercetta le richieste di rete (puoi lasciarlo vuoto per ora, è solo per attivare il Service Worker)
self.addEventListener('fetch', event => {
  // Per ora non fare nulla, in futuro potrai aggiungere la logica di cache
});