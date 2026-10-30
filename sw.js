const CACHE_NAME = 'modulo-ced-v2'; // Ho cambiato la versione per forzare l'aggiornamento

// Elenco di tutti i file necessari per il funzionamento offline
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

// 1. INSTALLAZIONE: Salva i file nella cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Apertura cache e salvataggio file...');
        // addAll fallisce se anche solo un file non viene trovato.
        // Se hai problemi, assicurati che TUTTI i file elencati sopra esistano.
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        // Forza l'attivazione immediata del Service Worker
        return self.skipWaiting();
      })
  );
});

// 2. ATTIVAZIONE: Elimina le vecchie cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Rimozione vecchia cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Prende il controllo delle pagine immediatamente
      return self.clients.claim();
    })
  );
});

// 3. FETCH: Intercetta le richieste
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        // Se non è in cache (es. prima installazione online), scarica dalla rete
        return fetch(event.request).catch(() => {
          // Se anche la rete fallisce, mostriamo un messaggio di errore offline
          return new Response(
            '<h1>Sei offline</h1><p>Impossibile caricare l\'applicazione. Riprova quando sei connesso.</p>', 
            { headers: { 'Content-Type': 'text/html' } }
          );
        });
      })
    );
    return;
  }

  // B. GESTIONE ALTRE RISORSE (Immagini, JS, CSS, PDF)
  // Usa la strategia "Cache First" (prima la cache, poi la rete)
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Se il file è in cache, restituiscilo
      if (response) {
        return response;
      }
      
      // Se non è in cache, scaricalo dalla rete
      return fetch(event.request).then((networkResponse) => {
        return networkResponse;
      }).catch(() => {
        // Se la rete fallisce e non c'è in cache, fallisce silenziosamente
        console.log('Risorsa non trovata offline:', event.request.url);
      });
    })
  );
});