self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  // Chrome Android richiede che questo gestore esista e restituisca qualcosa.
  // Anche una semplice return è sufficiente per superare il controllo.
  return;
});