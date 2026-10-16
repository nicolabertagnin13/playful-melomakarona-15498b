self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// La chiave sta in questa riga: deve esserci un'azione di risposta, anche minima
self.addEventListener('fetch', event => {
  // Anche se non fai nulla, questa "risposta" vuota è sufficiente
  return; 
});