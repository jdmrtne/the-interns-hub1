// ═══════════════════════════════════════════
//  THE INTERNS HUB — SERVICE WORKER v3.0
// ═══════════════════════════════════════════
const CACHE_NAME = 'interns-hub-v3';
const STATIC_ASSETS = [
  '/the-interns-hub1/',
  '/the-interns-hub1/index.html',
  '/the-interns-hub1/dashboard.html',
  '/the-interns-hub1/interns.html',
  '/the-interns-hub1/messages.html',
  '/the-interns-hub1/announcements.html',
  '/the-interns-hub1/admin.html',
  '/the-interns-hub1/chat.html',
  '/the-interns-hub1/notifications.js',
  '/the-interns-hub1/config.js',
  '/the-interns-hub1/style.css',
  '/the-interns-hub1/manifest.json',
  '/the-interns-hub1/icon-192.png',
  '/the-interns-hub1/icon-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.hostname.includes('supabase.co')) return;
  if (url.hostname.includes('fonts.googleapis.com')) return;
  if (url.hostname.includes('cdn.jsdelivr.net')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
        }
        return response;
      }).catch(() => caches.match('/the-interns-hub1/index.html'));
    })
  );
});
