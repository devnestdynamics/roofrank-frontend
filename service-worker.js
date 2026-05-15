// RoofRank PWA service worker — minimal app-shell cache.
// Network-first for HTML (so users see fresh deals + scores), cache-first
// for static assets (icons, manifest). Cache version bumps invalidate everything.

const VERSION = 'v1-2026-05-15';
const SHELL_CACHE = `rr-shell-${VERSION}`;
const SHELL_ASSETS = [
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-180.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL_CACHE).then(c => c.addAll(SHELL_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k.startsWith('rr-shell-') && k !== SHELL_CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Skip cross-origin (fonts.bunny.net, api.roofrank.io) — let them go to network.
  if (url.origin !== self.location.origin) return;

  // Static assets: cache-first.
  if (/\.(svg|png|ico|webmanifest|json)$/.test(url.pathname) || url.pathname.startsWith('/icons/')) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        if (res.ok) caches.open(SHELL_CACHE).then(c => c.put(req, res.clone()));
        return res;
      }))
    );
    return;
  }

  // HTML / JS: network-first, fall back to cache on offline.
  if (req.headers.get('accept')?.includes('text/html') || /\.(html|js|css)$/.test(url.pathname)) {
    e.respondWith(
      fetch(req).then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(SHELL_CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match(req))
    );
  }
});
