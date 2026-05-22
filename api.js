// ── RoofRank API Client ──────────────────────────────────────────────────────
// Set window.ROOFRANK_API_URL before loading this script for production:
//   <script>window.ROOFRANK_API_URL = 'https://api.roofrank.io/api';</script>

const BASE_URL = window.ROOFRANK_API_URL || 'https://api.roofrank.io/api';

// ── Sentry frontend loader ─────────────────────────────────────────────────
// Loads the Sentry browser bundle from CDN when window.SENTRY_DSN is set
// on the page. Local dev leaves it undefined so Sentry stays quiet.
// We tag the user from localStorage so errors come with the user ID
// attached — support triage becomes one click instead of a timestamp hunt.
(function loadSentry() {
  if (!window.SENTRY_DSN || window.__sentryLoaded) return;
  window.__sentryLoaded = true;
  const s = document.createElement('script');
  s.src = 'https://browser.sentry-cdn.com/8.55.0/bundle.tracing.min.js';
  s.crossOrigin = 'anonymous';
  s.async = true;
  s.onload = function () {
    if (!window.Sentry) return;
    window.Sentry.init({
      dsn: window.SENTRY_DSN,
      environment: window.ROOFRANK_ENV || (location.hostname === 'localhost' ? 'development' : 'production'),
      release: window.ROOFRANK_RELEASE || 'unknown',
      tracesSampleRate: 0.05,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0.1,
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'Non-Error promise rejection captured',
        'Failed to fetch',
      ],
    });
    try {
      const uid = localStorage.getItem('rr_user_id');
      if (uid) window.Sentry.setUser({ id: uid });
    } catch {}
  };
  document.head.appendChild(s);
})();

const Auth = {
  getToken:   ()  => localStorage.getItem('rr_token'),
  setToken:   (t) => localStorage.setItem('rr_token', t),
  getRefresh: ()  => localStorage.getItem('rr_refresh'),
  setRefresh: (t) => localStorage.setItem('rr_refresh', t),
  clear:      ()  => { localStorage.removeItem('rr_token'); localStorage.removeItem('rr_refresh'); },
  isLoggedIn: ()  => !!localStorage.getItem('rr_token'),
};

let _refreshPromise = null;

// Public (no-auth) fetch — used by pre-auth onboarding endpoints
// (/feed/public, /auth/magic-link/*). Skips the auth header + refresh-on-401
// retry logic so anonymous traffic doesn't trigger a redirect to login.
async function publicFetch(path, opts = {}) {
  const res = await fetch(BASE_URL + path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || data.message || `Request failed: ${res.status}`);
    err.status = res.status; err.code = data.code; err.data = data;
    throw err;
  }
  return data;
}

async function apiFetch(path, opts = {}, retry = true) {
  const token = Auth.getToken();
  const res = await fetch(BASE_URL + path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });

  // The 401-redirect interceptor only applies when we attached a token —
  // i.e. an authenticated call whose token was rejected. For unauth'd
  // calls (no token attached, e.g. /auth/login on the login page), let
  // the 401 fall through to the normal error throw so the caller can
  // surface its own message (BUG-003: wrong-password silent redirect).
  if (res.status === 401 && retry && token) {
    const refreshToken = Auth.getRefresh();
    if (refreshToken) {
      if (!_refreshPromise) {
        _refreshPromise = apiFetch('/auth/refresh', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        }, false).then(data => {
          Auth.setToken(data.accessToken);
          _refreshPromise = null;
          return data.accessToken;
        }).catch(() => { Auth.clear(); window.location.href = 'roofrank-login.html'; });
      }
      await _refreshPromise;
      return apiFetch(path, opts, false);
    }
    Auth.clear();
    window.location.href = 'roofrank-login.html';
    return;
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || `Request failed: ${res.status}`);
    err.status = res.status; err.code = data.code; err.data = data;
    throw err;
  }
  return data;
}

function requireAuth() {
  if (!Auth.isLoggedIn()) window.location.href = 'roofrank-login.html';
}

const AuthAPI = {
  async login(email, password) {
    const data = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    Auth.setToken(data.accessToken);
    if (data.refreshToken) Auth.setRefresh(data.refreshToken);
    return data;
  },
  async register(email, password, name, orgName) {
    const data = await apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name, orgName }) });
    Auth.setToken(data.accessToken);
    if (data.refreshToken) Auth.setRefresh(data.refreshToken);
    return data;
  },
  me()                        { return apiFetch('/auth/me'); },
  forgotPassword(email)       { return apiFetch('/auth/forgot-password', { method:'POST', body: JSON.stringify({ email }) }); },
  resetPassword(token, pw)    { return apiFetch('/auth/reset-password',  { method:'POST', body: JSON.stringify({ token, password: pw }) }); },
  verifyEmail(token)          { return apiFetch('/auth/verify-email',    { method:'POST', body: JSON.stringify({ token }) }); },
  // Magic link (passwordless) — public endpoints, no auth header.
  requestMagicLink(email, returnTo) {
    return publicFetch('/auth/magic-link/request', {
      method: 'POST',
      body: JSON.stringify({ email, ...(returnTo && { returnTo }) }),
    });
  },
  async verifyMagicLink(token) {
    const data = await publicFetch(`/auth/magic-link/verify?token=${encodeURIComponent(token)}`);
    Auth.setToken(data.accessToken);
    if (data.refreshToken) Auth.setRefresh(data.refreshToken);
    return data;
  },
  logout() {
    const r = Auth.getRefresh();
    if (r) apiFetch('/auth/logout', { method:'POST', body: JSON.stringify({ refreshToken: r }) }).catch(()=>{});
    Auth.clear();
    window.location.href = 'roofrank-login.html';
  },
};

const FeedAPI = {
  list({ page=1, limit=20, minScore=0, city, state, sort }={}) {
    const p = new URLSearchParams({ page, limit, ...(minScore>0&&{minScore}), ...(city&&{city}), ...(state&&{state}), ...(sort&&{sort}) });
    return apiFetch(`/feed?${p}`);
  },
  get(id)            { return apiFetch(`/feed/${id}`); },
  marketStats()      { return apiFetch('/feed/stats/markets'); },
  saveMarket(c,s)    { return apiFetch('/feed/markets', { method:'POST', body: JSON.stringify({city:c,state:s}) }); },
  triggerRefresh()   { return apiFetch('/feed/refresh', { method:'POST' }); },
  // Pre-auth deal feed for the new onboarding flow (no auth header).
  public(market, limit=4) {
    const p = new URLSearchParams({ market, limit: String(limit) });
    return publicFetch(`/feed/public?${p}`);
  },
};

const ReportsAPI = {
  list({ page=1, limit=20 }={}) { return apiFetch(`/reports?page=${page}&limit=${limit}`); },
  get(id)                       { return apiFetch(`/reports/${id}`); },
  delete(id)                    { return apiFetch(`/reports/${id}`, { method:'DELETE' }); },
  async create(address, propertyData) {
    const report = await apiFetch('/reports', { method:'POST', body: JSON.stringify({ address, propertyData }) });
    return ReportsAPI.poll(report.id);
  },
  async poll(id, maxMs=60000) {
    const start = Date.now();
    while (Date.now()-start < maxMs) {
      const r = await ReportsAPI.get(id);
      if (r.status==='done' || r.status==='failed') return r;
      await new Promise(res=>setTimeout(res,1500));
    }
    throw new Error('Report timed out');
  },
};

const WatchlistAPI = {
  _ids: null,
  async loadIds() {
    try {
      const ids = await apiFetch('/watchlist/ids');
      this._ids = new Set(ids);
      localStorage.setItem('rr_watch', JSON.stringify([...this._ids]));
    } catch {
      this._ids = new Set(JSON.parse(localStorage.getItem('rr_watch')||'[]'));
    }
    return this._ids;
  },
  has(id)   { return (this._ids || new Set(JSON.parse(localStorage.getItem('rr_watch')||'[]'))).has(id); },
  count()   { return (this._ids || new Set(JSON.parse(localStorage.getItem('rr_watch')||'[]'))).size; },
  // Returns the NEW saved-state (true = now saved) on success.
  // Throws on server error so callers can show the right message —
  // critically the WATCHLIST_LIMIT_EXCEEDED 402 from the free-tier
  // cap, which should surface as an upgrade prompt, not silent no-op.
  // Local cache is reverted on failure so UI state stays consistent.
  async toggle(dealFeedId) {
    const was = this.has(dealFeedId);
    if (!this._ids) this._ids = new Set(JSON.parse(localStorage.getItem('rr_watch')||'[]'));
    // Optimistic local update first so UI feels instant.
    was ? this._ids.delete(dealFeedId) : this._ids.add(dealFeedId);
    localStorage.setItem('rr_watch', JSON.stringify([...this._ids]));
    try {
      was
        ? await apiFetch(`/watchlist/${dealFeedId}`, { method:'DELETE' })
        : await apiFetch('/watchlist', { method:'POST', body: JSON.stringify({ dealFeedId }) });
      return !was;
    } catch (err) {
      // Revert local cache and re-throw so caller can show the
      // upgrade prompt (or whatever error path is appropriate).
      was ? this._ids.add(dealFeedId) : this._ids.delete(dealFeedId);
      localStorage.setItem('rr_watch', JSON.stringify([...this._ids]));
      throw err;
    }
  },
};

const BillingAPI = {
  getSubscription()   { return apiFetch('/billing/subscription'); },
  async checkout(priceId) { const {url}=await apiFetch('/billing/checkout',{method:'POST',body:JSON.stringify({priceId})}); window.location.href=url; },
  async portal()          { const {url}=await apiFetch('/billing/portal',{method:'POST'}); window.location.href=url; },
};

const OrgAPI = {
  me()                      { return apiFetch('/orgs/me'); },
  saveOnboarding(markets)   { return apiFetch('/orgs/onboarding', { method:'POST', body: JSON.stringify({ selectedMarkets: markets }) }); },
  invite(email, role='member') { return apiFetch('/orgs/invites', { method:'POST', body: JSON.stringify({ email, role }) }); },
};

const WaitlistAPI = {
  join(email, city, state) { return apiFetch('/waitlist', { method:'POST', body: JSON.stringify({ email, city, state }) }); },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function showToast(message, type='success', duration=3500) {
  const bg = type==='error'?'#a03030':type==='warning'?'#a06a00':'#1c4a35';
  const t = document.createElement('div');
  t.style.cssText = `position:fixed;bottom:1.5rem;right:1.5rem;background:${bg};color:#fff;padding:.65rem 1.1rem;border-radius:8px;font-size:.78rem;font-family:'DM Sans',system-ui,sans-serif;box-shadow:0 4px 16px rgba(28,31,28,.25);z-index:9999;max-width:340px;line-height:1.55`;
  t.innerHTML = message;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), duration);
}

function fmtPrice(n) {
  if (!n&&n!==0) return '—';
  if (n>=1e6) return '$'+(n/1e6).toFixed(2)+'M';
  if (n>=1e3) return '$'+(n/1e3).toFixed(0)+'K';
  return '$'+n;
}

function scoreSignal(s) { return s>=75?'Strong Buy':s>=60?'Buy':s>=45?'Watch':'Pass'; }
function scoreClass(s)  { return s>=75?'sb':s>=60?'buy':s>=45?'wat':'pas'; }
function scoreColor(s)  { return s>=75?'#1c4a35':s>=60?'#3e8160':s>=45?'#a06a00':'#a03030'; }
