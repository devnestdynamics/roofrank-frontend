// RoofRank push-notifications client helpers.
// Pair with /service-worker.js + a backend that exposes:
//   POST /api/notifications/subscribe   { endpoint, keys: { p256dh, auth } }
//   POST /api/notifications/unsubscribe { endpoint }
//
// Generate VAPID keys once:
//   npx web-push generate-vapid-keys
// Then set window.ROOFRANK_VAPID_PUBLIC_KEY = '<public key>' before this script,
// or replace the placeholder below.

const VAPID_PUBLIC_KEY =
  window.ROOFRANK_VAPID_PUBLIC_KEY ||
  // Placeholder — replace with real VAPID public key before launching push.
  'REPLACE_ME_WITH_VAPID_PUBLIC_KEY';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

const Push = {
  // Returns one of: 'unsupported' | 'denied' | 'granted-subscribed' | 'granted-not-subscribed' | 'default'
  async status() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
      return 'unsupported';
    }
    if (Notification.permission === 'denied') return 'denied';
    if (Notification.permission === 'default') return 'default';
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    return sub ? 'granted-subscribed' : 'granted-not-subscribed';
  },

  async subscribe() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      throw new Error('Push notifications are not supported on this device.');
    }
    if (VAPID_PUBLIC_KEY === 'REPLACE_ME_WITH_VAPID_PUBLIC_KEY') {
      throw new Error('VAPID key not configured. Set window.ROOFRANK_VAPID_PUBLIC_KEY.');
    }
    let perm = Notification.permission;
    if (perm === 'default') perm = await Notification.requestPermission();
    if (perm !== 'granted') throw new Error('Notification permission was not granted.');

    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }
    // Always tell the server about this subscription. If the server-side record
    // doesn't exist (e.g., user re-subscribes after we lost the row, or this is
    // a fresh device), the upsert at /subscribe will create it.
    const body = JSON.stringify(sub.toJSON());
    let ok = false;
    try {
      if (typeof apiFetch === 'function') {
        await apiFetch('/notifications/subscribe', { method: 'POST', body });
      } else {
        const res = await fetch((window.ROOFRANK_API_URL || 'https://api.roofrank.io/api') + '/notifications/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        });
        if (!res.ok) throw new Error('subscribe failed: HTTP ' + res.status);
      }
      ok = true;
    } catch (err) {
      // Server-side subscribe failed — undo the local subscription so we don't
      // end up with the browser thinking it's subscribed while the server has
      // no record. Next attempt is then a clean slate.
      try { await sub.unsubscribe(); } catch {}
      throw err;
    }
    return sub;
  },

  // Belt-and-suspenders: if the browser has a sub but the server claims none,
  // re-subscribe transparently. Called by callers that hit "0 devices subscribed".
  async resync() {
    if (!('serviceWorker' in navigator)) return null;
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (!sub) return null;
    const body = JSON.stringify(sub.toJSON());
    try {
      if (typeof apiFetch === 'function') {
        await apiFetch('/notifications/subscribe', { method: 'POST', body });
      } else {
        await fetch((window.ROOFRANK_API_URL || 'https://api.roofrank.io/api') + '/notifications/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        });
      }
      return sub;
    } catch {
      return null;
    }
  },

  async unsubscribe() {
    if (!('serviceWorker' in navigator)) return;
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (!sub) return;
    const body = JSON.stringify({ endpoint: sub.endpoint });
    try {
      if (typeof apiFetch === 'function') {
        await apiFetch('/notifications/unsubscribe', { method: 'POST', body });
      } else {
        await fetch('/api/notifications/unsubscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
      }
    } catch { /* best-effort */ }
    await sub.unsubscribe();
  },
};

window.Push = Push;
