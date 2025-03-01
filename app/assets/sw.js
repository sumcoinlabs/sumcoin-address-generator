/*
 * For each new deploy, change this version
 */

const PRECACHE = '0.10';
const RUNTIME = 'sumcoin-WALLET-GENERATOR';


const urlsToCache = [
  '/',
  '/index.html',
  '/app.css',
  '/app.css.map',
  '/app.js',
  '/app.js.map',
  '/img/bg.svg',
  '/img/check.svg',
  '/img/hand.svg',
  '/img/logo.svg',
  '/img/share.svg',
  '/locales/en-US.json',
  '/locales/pt-BR.json',
  '/locales/de-DE.json',
  '/locales/pl-PL.json',
  '/locales/ru-RU.json',
  '/locales/nl-NL.json'
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(urlsToCache))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics.
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME).then(cache => {
          return fetch(event.request).then(response => {
            // Put a copy of the response in the runtime cache.
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});
