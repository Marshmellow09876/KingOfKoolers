/* King of Koolers V1 — Lightweight PWA App Shell + Runtime Image Cache Service Worker */
const CACHE_NAME = 'kok-v1-shell-v2';
const IMAGE_CACHE = 'kok-v1-images-v1';

const PRECACHE_URLS = [
  './',
  './index.html',
  './customizer.html',
  './accessories.html',
  './locking-mechanism.html',
  './manifest.json',
  './favicon.svg',
  './assets/css/apple-polish.css',
  './assets/js/apple-polish.js',
  './assets/js/three.min.js',
  './assets/js/OrbitControls.js',
  './assets/images/apple-touch-icon.png',
  './assets/images/icon-192.png'
];

const BYPASS_EXT_RE = /\.(mp4|webm|3mf|obj|stl|mtl|pdf)$/i;
const SHELL_ASSET_RE = /\.(css|js|json)$/i;
const IMAGE_ASSET_RE = /\.(jpg|jpeg|webp|avif|png|gif|svg)$/i;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== IMAGE_CACHE)
          .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try {
    url = new URL(req.url);
  } catch (_) {
    return;
  }

  if (url.origin !== self.location.origin) return;
  if (req.headers.has('range') || BYPASS_EXT_RE.test(url.pathname)) return;

  // Network-First for HTML page navigations so updates appear immediately, with offline fallback
  if (req.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  // Stale-While-Revalidate for local image assets so visited photos keep rendering offline too
  if (IMAGE_ASSET_RE.test(url.pathname)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) =>
        cache.match(req).then((cached) => {
          const networkFetch = fetch(req).then((res) => {
            if (res && res.ok) cache.put(req, res.clone());
            return res;
          }).catch(() => cached);
          return cached || networkFetch;
        })
      )
    );
    return;
  }

  // Stale-While-Revalidate for lightweight local app-shell CSS/JS/JSON assets
  if (SHELL_ASSET_RE.test(url.pathname)) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(req).then((cached) => {
          const networkFetch = fetch(req).then((res) => {
            if (res && res.ok) cache.put(req, res.clone());
            return res;
          }).catch(() => cached);
          return cached || networkFetch;
        })
      )
    );
  }
});
