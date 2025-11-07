const CACHE_NAME = 'alumnos-pwa-v1';

// Archivos a cachear (rutas REALES)
const ASSETS = [
  '/',                       // raíz
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/manifest.webmanifest'
];

// -------------------- INSTALACIÓN --------------------
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        await cache.addAll(ASSETS);
        console.log('[SW] Archivos cacheados');
      } catch (err) {
        console.warn('[SW] Algunos archivos fallaron al cachearse:', err);
      }
    })
  );
  self.skipWaiting();
});

// -------------------- ACTIVACIÓN --------------------
self.addEventListener('activate', (event) => {
  console.log('[SW] Activando service worker...');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Borrando caché vieja:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// -------------------- INTERCEPTAR PETICIONES --------------------
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Si está cacheado, se sirve desde caché
        return cachedResponse;
      }

      // Si no, intenta desde la red y guarda copia
      return fetch(event.request)
        .then((networkResponse) => {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return networkResponse;
        })
        .catch(() => caches.match('/index.html'));
    })
  );
});
