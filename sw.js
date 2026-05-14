const CACHE_NAME = 'pesopulse-v1';

// The files we want to save for offline use
const urlsToCache = [
  './index.html',
  './manifest.json',
  // We can also cache the external Boxicons and Chart.js so they work offline!
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css'
];

// 1. INSTALLATION: Save files to the cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. ACTIVATION: Clean up old caches if we update the app
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
    })
  );
});

// 3. FETCHING: Serve files from cache first, then network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // If the file is in the cache, return it immediately
        if (response) {
          return response;
        }
        // Otherwise, fetch it from the internet
        return fetch(event.request);
      })
  );
});