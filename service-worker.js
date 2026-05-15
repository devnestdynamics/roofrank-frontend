// RoofRank PWA service worker — minimal app-shell cache.
// Network-first for HTML (so users see fresh deals + scores), cache-first
// for static assets (icons, manifest). Cache version bumps invalidate everything.

const VERSION = 'v2-2026-05-15';
const SHELL_CACHE = `rr-shell-${VERSION}`;
const SHELL_ASSETS = [
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-180.png',
  '/offline.html',
  '/404.html',
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

  // HTML / JS: network-first, fall back to cache, then offline.html for navigations.
  if (req.headers.get('accept')?.includes('text/html') || /\.(html|js|css)$/.test(url.pathname)) {
    e.respondWith(
      fetch(req).then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(SHELL_CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(async () => {
        const cached = await caches.match(req);
        if (cached) return cached;
        // True offline + no cached version → serve the offline shell for top-level nav,
        // and 404 page for sub-resources so the user still sees something on-brand.
        if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
          return caches.match('/offline.html');
        }
        return new Response('', { status: 504, statusText: 'Offline' });
      })
    );
  }
});

// ── PUSH NOTIFICATIONS ──────────────────────────────────────────────────
// Backend sends payload: { title, body, url?, tag?, priority?: 'high'|'normal' }
self.addEventListener('push', e => {
  let data = {};
  try { data = e.data ? e.data.json() : {}; } catch { data = { title: 'RoofRank', body: e.data ? e.data.text() : 'New alert' }; }

  const title = data.title || 'RoofRank';
  const opts = {
    body: data.body || '',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: { url: data.url || '/roofrank-dashboard.html' },
    tag: data.tag,           // dedupes; new push with same tag replaces previous
    renotify: !!data.tag,    // re-alert even on dedupe
    requireInteraction: data.priority === 'high',
    vibrate: data.priority === 'high' ? [120, 60, 120] : undefined,
  };
  e.waitUntil(self.registration.showNotification(title, opts));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || '/roofrank-dashboard.html';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      // Focus an existing tab if it matches; otherwise open new
      for (const c of clients) {
        const cu = new URL(c.url);
        if (cu.pathname === url || cu.pathname + cu.search === url) {
          return c.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});

self.addEventListener('pushsubscriptionchange', e => {
  // Browser rotated the subscription. Re-subscribe + tell the backend.
  // Backend endpoint: POST /api/notifications/resubscribe { oldEndpoint, newSub }
  e.waitUntil((async () => {
    try {
      const newSub = await self.registration.pushManager.subscribe(e.oldSubscription.options);
      await fetch('/api/notifications/resubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldEndpoint: e.oldSubscription?.endpoint, newSub: newSub.toJSON() }),
      });
    } catch (err) { /* best-effort; user can re-enable in the More sheet */ }
  })());
});
