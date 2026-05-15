# RoofRank — System Architecture

**Last updated:** May 2026  
**Version:** 1.0 — Production

---

## Overview

RoofRank is a B2B SaaS platform for multifamily real estate investors. It scores every active 2–6 unit property listing on 8 weighted financial metrics, ranks them daily, and surfaces the best deals to subscribers via a web dashboard and email alerts.

The system has three layers:

1. **Frontend** — Static HTML/CSS/JS served via Netlify CDN
2. **Backend API** — Node.js/TypeScript REST API running on AWS ECS Fargate
3. **Data layer** — PostgreSQL (RDS) + Redis (ElastiCache)

---

## High-Level Architecture

<svg width="100%" viewBox="0 0 680 520" role="img">
<title>RoofRank system architecture</title>
<desc>Shows the full system from user browser through Netlify frontend and AWS backend to database and third-party services</desc>
<defs>
<marker id="a1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</marker>
</defs>
<rect x="20" y="28" width="100" height="44" rx="8" fill="#f1efe8" stroke="#888780" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="13" font-weight="500" x="70" y="52" text-anchor="middle" dominant-baseline="central" fill="#2c2c2a">Browser</text>
<line x1="120" y1="50" x2="175" y2="50" stroke="#888780" stroke-width="1" marker-end="url(#a1)"/>
<text font-family="system-ui,sans-serif" font-size="11" x="148" y="43" text-anchor="middle" fill="#5f5e5a">HTTPS</text>
<rect x="177" y="18" width="130" height="60" rx="8" fill="#e1f5ee" stroke="#0f6e56" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="13" font-weight="500" x="242" y="40" text-anchor="middle" dominant-baseline="central" fill="#04342c">Netlify CDN</text>
<text font-family="system-ui,sans-serif" font-size="11" x="242" y="60" text-anchor="middle" dominant-baseline="central" fill="#0f6e56">roofrank.io</text>
<line x1="120" y1="68" x2="158" y2="114" stroke="#888780" stroke-width="1" marker-end="url(#a1)"/>
<text font-family="system-ui,sans-serif" font-size="11" x="128" y="103" fill="#5f5e5a">API calls</text>
<rect x="177" y="106" width="130" height="60" rx="8" fill="#e6f1fb" stroke="#185fa5" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="13" font-weight="500" x="242" y="128" text-anchor="middle" dominant-baseline="central" fill="#042c53">AWS ALB</text>
<text font-family="system-ui,sans-serif" font-size="11" x="242" y="148" text-anchor="middle" dominant-baseline="central" fill="#185fa5">api.roofrank.io</text>
<line x1="307" y1="136" x2="345" y2="136" stroke="#888780" stroke-width="1" marker-end="url(#a1)"/>
<rect x="347" y="96" width="160" height="80" rx="8" fill="#e1f5ee" stroke="#0f6e56" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="13" font-weight="500" x="427" y="120" text-anchor="middle" dominant-baseline="central" fill="#04342c">ECS Fargate</text>
<text font-family="system-ui,sans-serif" font-size="11" x="427" y="140" text-anchor="middle" dominant-baseline="central" fill="#0f6e56">Node.js API</text>
<text font-family="system-ui,sans-serif" font-size="11" x="427" y="158" text-anchor="middle" dominant-baseline="central" fill="#0f6e56">1–4 tasks · port 3000</text>
<line x1="427" y1="176" x2="347" y2="244" stroke="#888780" stroke-width="1" marker-end="url(#a1)"/>
<line x1="427" y1="176" x2="427" y2="244" stroke="#888780" stroke-width="1" marker-end="url(#a1)"/>
<line x1="427" y1="176" x2="507" y2="244" stroke="#888780" stroke-width="1" marker-end="url(#a1)"/>
<rect x="257" y="246" width="120" height="56" rx="8" fill="#eeedfe" stroke="#534ab7" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="13" font-weight="500" x="317" y="268" text-anchor="middle" dominant-baseline="central" fill="#26215c">RDS Postgres</text>
<text font-family="system-ui,sans-serif" font-size="11" x="317" y="286" text-anchor="middle" dominant-baseline="central" fill="#534ab7">db.t4g.micro</text>
<rect x="387" y="246" width="120" height="56" rx="8" fill="#faeeda" stroke="#854f0b" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="13" font-weight="500" x="447" y="268" text-anchor="middle" dominant-baseline="central" fill="#412402">ElastiCache</text>
<text font-family="system-ui,sans-serif" font-size="11" x="447" y="286" text-anchor="middle" dominant-baseline="central" fill="#854f0b">Redis 7.0</text>
<rect x="517" y="246" width="100" height="56" rx="8" fill="#f1efe8" stroke="#888780" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="13" font-weight="500" x="567" y="268" text-anchor="middle" dominant-baseline="central" fill="#2c2c2a">S3</text>
<text font-family="system-ui,sans-serif" font-size="11" x="567" y="286" text-anchor="middle" dominant-baseline="central" fill="#5f5e5a">uploads</text>
<rect x="37" y="355" width="600" height="130" rx="12" fill="none" stroke="#b4b2a9" stroke-width="0.5" stroke-dasharray="4 3"/>
<text font-family="system-ui,sans-serif" font-size="11" x="57" y="373" dominant-baseline="central" fill="#5f5e5a">Third-party services</text>
<rect x="57" y="385" width="90" height="44" rx="8" fill="#faece7" stroke="#993c1d" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="102" y="407" text-anchor="middle" dominant-baseline="central" fill="#4a1b0c">RentCast</text>
<rect x="157" y="385" width="80" height="44" rx="8" fill="#faece7" stroke="#993c1d" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="197" y="407" text-anchor="middle" dominant-baseline="central" fill="#4a1b0c">ATTOM</text>
<rect x="247" y="385" width="80" height="44" rx="8" fill="#faece7" stroke="#993c1d" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="287" y="407" text-anchor="middle" dominant-baseline="central" fill="#4a1b0c">Stripe</text>
<rect x="337" y="385" width="80" height="44" rx="8" fill="#faece7" stroke="#993c1d" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="377" y="407" text-anchor="middle" dominant-baseline="central" fill="#4a1b0c">Resend</text>
<rect x="427" y="385" width="110" height="44" rx="8" fill="#faece7" stroke="#993c1d" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="482" y="407" text-anchor="middle" dominant-baseline="central" fill="#4a1b0c">Google OAuth</text>
<line x1="427" y1="176" x2="197" y2="383" stroke="#b4b2a9" stroke-width="0.8" stroke-dasharray="3 3" marker-end="url(#a1)"/>
<line x1="427" y1="176" x2="287" y2="383" stroke="#b4b2a9" stroke-width="0.8" stroke-dasharray="3 3" marker-end="url(#a1)"/>
<line x1="427" y1="176" x2="377" y2="383" stroke="#b4b2a9" stroke-width="0.8" stroke-dasharray="3 3" marker-end="url(#a1)"/>
<text font-family="system-ui,sans-serif" font-size="11" x="340" y="498" text-anchor="middle" fill="#5f5e5a">Dashed = outbound API calls · Solid = internal traffic</text>
</svg>

```
User Browser
     │
     ├── roofrank.io ──────────────────► Netlify CDN
     │   (static HTML/JS/CSS)                │
     │                                        │
     └── api.roofrank.io ──────────────► AWS ALB (HTTPS:443)
                                              │
                                    ┌─────────┴─────────┐
                                    │   ECS Fargate      │
                                    │   (2 tasks)        │
                                    │   Node.js API      │
                                    │   Port 3000        │
                                    └─────────┬─────────┘
                                              │
                              ┌───────────────┼───────────────┐
                              │               │               │
                         RDS Postgres    ElastiCache      S3 Bucket
                         (roofrank DB)   Redis 7.0        (uploads)
```

---

## Frontend Architecture

### Technology
- Pure static HTML, CSS, JavaScript — no framework, no build step
- Hosted on Netlify (free tier) with automatic GitHub deployment
- Custom domain: `roofrank.io` → Netlify via A record `75.2.60.5`

### Pages

| File | Route | Purpose |
|---|---|---|
| `index.html` | `/` | Redirect to landing page |
| `roofrank-landing.html` | `/roofrank-landing.html` | Marketing landing page |
| `roofrank-login.html` | `/roofrank-login.html` | Auth — sign in / create account |
| `roofrank-onboarding.html` | `/roofrank-onboarding.html` | 4-step onboarding flow |
| `roofrank-dashboard.html` | `/roofrank-dashboard.html` | Main deal feed |
| `roofrank-deal-detail.html` | `/roofrank-deal-detail.html?fid=UUID` | Individual deal scoring page |
| `roofrank-analyzer.html` | `/roofrank-analyzer.html` | Manual deal analyzer |
| `roofrank-watchlist.html` | `/roofrank-watchlist.html` | Saved deals |
| `roofrank-reports.html` | `/roofrank-reports.html` | Generated reports |
| `roofrank-pricing.html` | `/roofrank-pricing.html` | Pricing / upgrade |

### Shared API Client
`api.js` is imported by every page. It contains:
- `AuthAPI` — login, register, refresh, logout, Google OAuth
- `FeedAPI` — get deals, get single deal, stats
- `WatchlistAPI` — toggle saved, load watchlist
- `ReportsAPI` — generate, list, download
- `BillingAPI` — create checkout, portal, subscription status
- `OrgAPI` — onboarding, settings
- `WaitlistAPI` — waitlist join

All API calls hit `window.ROOFRANK_API_URL` which is set in each HTML file's `<head>`:
```html
<script>window.ROOFRANK_API_URL="https://api.roofrank.io/api";</script>
```

### Deal Detail Data Flow
The dashboard sets `sessionStorage['rr_deal_' + fid]` when a user clicks a deal card. The deal detail page reads from sessionStorage first, falls back to `FeedAPI.get(fid)` if not found. This avoids an extra API call on navigation.

### Design System
```css
--cream: #f7f4ef        /* page background */
--forest: #1c4a35       /* primary green */
--forest-2: #2d6448     /* hover green */
--forest-3: #3e8160     /* light green */
--amber: #a06a00        /* warning */
--rose: #a03030         /* danger */
--serif: 'Playfair Display'
--sans: 'DM Sans'
--mono: 'DM Mono'
```

Score signals:
- **Strong Buy** ≥ 75 — forest green
- **Buy** ≥ 60 — forest-3
- **Watch** ≥ 45 — amber
- **Pass** < 45 — rose

---

## Backend Architecture

### Technology
- **Runtime:** Node.js 20 + TypeScript
- **Framework:** Express.js
- **ORM:** Drizzle ORM
- **Database:** PostgreSQL 16
- **Cache / Queue:** Redis 7 + BullMQ
- **Auth:** JWT (access + refresh tokens) + Google OAuth 2.0
- **Email:** Resend
- **Payments:** Stripe
- **Container:** Docker (linux/amd64) on ECS Fargate

### Directory Structure

```
src/
├── index.ts                    ← Express app entry point
├── db/
│   ├── index.ts               ← Drizzle DB connection
│   ├── schema.ts              ← All table definitions
│   ├── migrate.ts             ← Run migrations
│   └── seed.ts                ← Seed 26 deals for development
├── lib/
│   ├── config.ts              ← Environment variable validation
│   ├── scoringEngine.ts       ← 8-metric scoring algorithm
│   ├── rentcast.ts            ← RentCast API client
│   ├── attom.ts               ← ATTOM API client
│   ├── redis.ts               ← Redis connection
│   ├── jwt.ts                 ← JWT helpers
│   └── email.ts               ← Resend email client
├── middleware/
│   ├── auth.ts                ← JWT verification middleware
│   └── errorHandler.ts        ← Global error handler
├── routes/
│   ├── auth.ts                ← /api/auth/*
│   ├── feed.ts                ← /api/feed/*
│   ├── watchlist.ts           ← /api/watchlist/*
│   ├── reports.ts             ← /api/reports/*
│   ├── billing.ts             ← /api/billing/*
│   ├── orgs.ts                ← /api/orgs/*
│   └── waitlist.ts            ← /api/waitlist/*
├── services/
│   ├── authService.ts         ← User creation, token management
│   └── billingService.ts      ← Stripe subscription management
└── workers/
    ├── ingestionWorker.ts     ← Nightly deal ingestion (2am)
    └── reportWorker.ts        ← On-demand report generation
```

### API Routes

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Email/password login |
| POST | `/api/auth/refresh` | No | Refresh access token |
| POST | `/api/auth/logout` | Yes | Invalidate tokens |
| GET | `/api/auth/google` | No | Google OAuth redirect |
| GET | `/api/auth/google/callback` | No | Google OAuth callback |
| GET | `/api/feed` | Yes | Get ranked deals (with filters) |
| GET | `/api/feed/stats/markets` | Yes | Market stats |
| GET | `/api/feed/:id` | Yes | Get single deal |
| GET | `/api/watchlist` | Yes | Get saved deals |
| POST | `/api/watchlist/:id` | Yes | Toggle save |
| GET | `/api/reports` | Yes | List reports |
| POST | `/api/reports/generate` | Yes | Generate report |
| POST | `/api/billing/checkout` | Yes | Create Stripe checkout |
| POST | `/api/billing/portal` | Yes | Stripe customer portal |
| POST | `/api/billing/webhook` | No | Stripe webhook |
| GET | `/api/orgs/me` | Yes | Get org/user profile |
| POST | `/api/orgs/onboarding` | Yes | Save onboarding prefs |
| GET | `/health` | No | Health check |

### Authentication Flow

```
1. User submits email + password
2. authService verifies password hash (bcrypt)
3. Returns: accessToken (15min) + refreshToken (7 days)
4. Frontend stores both in localStorage
5. All API calls send: Authorization: Bearer {accessToken}
6. On 401, frontend calls /api/auth/refresh with refreshToken
7. Gets new accessToken, retries original request
```

---

## Scoring Engine

The core of the product.

<svg width="100%" viewBox="0 0 680 540" role="img">
<title>RoofRank scoring engine</title>
<desc>Inputs flow through financial metric calculations to a weighted sum producing a 0-100 score and signal</desc>
<defs>
<marker id="a3" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</marker>
</defs>
<text font-family="system-ui,sans-serif" font-size="11" x="80" y="28" text-anchor="middle" fill="#5f5e5a">Inputs</text>
<text font-family="system-ui,sans-serif" font-size="11" x="225" y="28" text-anchor="middle" fill="#5f5e5a">Financial metrics</text>
<text font-family="system-ui,sans-serif" font-size="11" x="440" y="28" text-anchor="middle" fill="#5f5e5a">Weighted score</text>
<text font-family="system-ui,sans-serif" font-size="11" x="610" y="28" text-anchor="middle" fill="#5f5e5a">Signal</text>
<rect x="20" y="48" width="120" height="38" rx="6" fill="#f1efe8" stroke="#888780" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" x="80" y="67" text-anchor="middle" dominant-baseline="central" fill="#2c2c2a">Asking price</text>
<rect x="20" y="96" width="120" height="38" rx="6" fill="#f1efe8" stroke="#888780" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" x="80" y="115" text-anchor="middle" dominant-baseline="central" fill="#2c2c2a">Gross rent</text>
<rect x="20" y="144" width="120" height="38" rx="6" fill="#f1efe8" stroke="#888780" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" x="80" y="163" text-anchor="middle" dominant-baseline="central" fill="#2c2c2a">Expenses</text>
<rect x="20" y="192" width="120" height="38" rx="6" fill="#f1efe8" stroke="#888780" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" x="80" y="211" text-anchor="middle" dominant-baseline="central" fill="#2c2c2a">Units</text>
<rect x="20" y="240" width="120" height="38" rx="6" fill="#f1efe8" stroke="#888780" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" x="80" y="259" text-anchor="middle" dominant-baseline="central" fill="#2c2c2a">Year built</text>
<rect x="20" y="288" width="120" height="38" rx="6" fill="#f1efe8" stroke="#888780" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" x="80" y="307" text-anchor="middle" dominant-baseline="central" fill="#2c2c2a">Rate 7.25%</text>
<rect x="20" y="336" width="120" height="38" rx="6" fill="#f1efe8" stroke="#888780" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" x="80" y="355" text-anchor="middle" dominant-baseline="central" fill="#2c2c2a">Down 25%</text>
<rect x="20" y="384" width="120" height="38" rx="6" fill="#f1efe8" stroke="#888780" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" x="80" y="403" text-anchor="middle" dominant-baseline="central" fill="#2c2c2a">Neighborhood</text>
<line x1="140" y1="220" x2="158" y2="220" stroke="#888780" stroke-width="1" marker-end="url(#a3)"/>
<rect x="160" y="48" width="130" height="38" rx="6" fill="#e1f5ee" stroke="#0f6e56" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" x="225" y="67" text-anchor="middle" dominant-baseline="central" fill="#04342c">Cash-on-Cash</text>
<rect x="160" y="96" width="130" height="38" rx="6" fill="#e1f5ee" stroke="#0f6e56" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" x="225" y="115" text-anchor="middle" dominant-baseline="central" fill="#04342c">Cap Rate</text>
<rect x="160" y="144" width="130" height="38" rx="6" fill="#e1f5ee" stroke="#0f6e56" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" x="225" y="163" text-anchor="middle" dominant-baseline="central" fill="#04342c">DSCR</text>
<rect x="160" y="192" width="130" height="38" rx="6" fill="#e1f5ee" stroke="#0f6e56" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" x="225" y="211" text-anchor="middle" dominant-baseline="central" fill="#04342c">GRM</text>
<rect x="160" y="240" width="130" height="38" rx="6" fill="#e1f5ee" stroke="#0f6e56" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" x="225" y="259" text-anchor="middle" dominant-baseline="central" fill="#04342c">Price / Unit</text>
<rect x="160" y="288" width="130" height="38" rx="6" fill="#e1f5ee" stroke="#0f6e56" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" x="225" y="307" text-anchor="middle" dominant-baseline="central" fill="#04342c">NOI</text>
<rect x="160" y="336" width="130" height="38" rx="6" fill="#e1f5ee" stroke="#0f6e56" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" x="225" y="355" text-anchor="middle" dominant-baseline="central" fill="#04342c">CapEx reserve</text>
<rect x="160" y="384" width="130" height="38" rx="6" fill="#e1f5ee" stroke="#0f6e56" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" x="225" y="403" text-anchor="middle" dominant-baseline="central" fill="#04342c">Neighborhood</text>
<line x1="290" y1="67"  x2="355" y2="200" stroke="#888780" stroke-width="0.8" marker-end="url(#a3)"/>
<line x1="290" y1="115" x2="355" y2="212" stroke="#888780" stroke-width="0.8" marker-end="url(#a3)"/>
<line x1="290" y1="163" x2="355" y2="224" stroke="#888780" stroke-width="0.8" marker-end="url(#a3)"/>
<line x1="290" y1="211" x2="355" y2="234" stroke="#888780" stroke-width="0.8" marker-end="url(#a3)"/>
<line x1="290" y1="259" x2="355" y2="244" stroke="#888780" stroke-width="0.8" marker-end="url(#a3)"/>
<line x1="290" y1="307" x2="355" y2="254" stroke="#888780" stroke-width="0.8" marker-end="url(#a3)"/>
<line x1="290" y1="355" x2="355" y2="264" stroke="#888780" stroke-width="0.8" marker-end="url(#a3)"/>
<line x1="290" y1="403" x2="355" y2="274" stroke="#888780" stroke-width="0.8" marker-end="url(#a3)"/>
<rect x="357" y="148" width="160" height="160" rx="10" fill="#eeedfe" stroke="#534ab7" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="13" font-weight="500" x="437" y="176" text-anchor="middle" dominant-baseline="central" fill="#26215c">Weighted sum</text>
<text font-family="system-ui,sans-serif" font-size="11" x="437" y="200" text-anchor="middle" fill="#534ab7">CoC     25%</text>
<text font-family="system-ui,sans-serif" font-size="11" x="437" y="218" text-anchor="middle" fill="#534ab7">Cap Rate 20%</text>
<text font-family="system-ui,sans-serif" font-size="11" x="437" y="236" text-anchor="middle" fill="#534ab7">DSCR    20%</text>
<text font-family="system-ui,sans-serif" font-size="11" x="437" y="254" text-anchor="middle" fill="#534ab7">GRM     10%</text>
<text font-family="system-ui,sans-serif" font-size="11" x="437" y="272" text-anchor="middle" fill="#534ab7">PPU/NOI/CapEx/Nbhd 25%</text>
<text font-family="system-ui,sans-serif" font-size="13" font-weight="500" x="437" y="296" text-anchor="middle" dominant-baseline="central" fill="#26215c">= Score 0–100</text>
<line x1="517" y1="228" x2="555" y2="228" stroke="#888780" stroke-width="1" marker-end="url(#a3)"/>
<rect x="557" y="78" width="100" height="40" rx="8" fill="#eaf3de" stroke="#3b6d11" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="607" y="98" text-anchor="middle" dominant-baseline="central" fill="#173404">Strong Buy</text>
<text font-family="system-ui,sans-serif" font-size="11" x="607" y="126" text-anchor="middle" fill="#3b6d11">≥ 75</text>
<rect x="557" y="146" width="100" height="40" rx="8" fill="#e1f5ee" stroke="#0f6e56" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="607" y="166" text-anchor="middle" dominant-baseline="central" fill="#04342c">Buy</text>
<text font-family="system-ui,sans-serif" font-size="11" x="607" y="194" text-anchor="middle" fill="#0f6e56">≥ 60</text>
<rect x="557" y="214" width="100" height="40" rx="8" fill="#faeeda" stroke="#854f0b" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="607" y="234" text-anchor="middle" dominant-baseline="central" fill="#412402">Watch</text>
<text font-family="system-ui,sans-serif" font-size="11" x="607" y="262" text-anchor="middle" fill="#854f0b">≥ 45</text>
<rect x="557" y="282" width="100" height="40" rx="8" fill="#fcebeb" stroke="#a32d2d" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="607" y="302" text-anchor="middle" dominant-baseline="central" fill="#501313">Pass</text>
<text font-family="system-ui,sans-serif" font-size="11" x="607" y="330" text-anchor="middle" fill="#a32d2d">below 45</text>
<line x1="517" y1="208" x2="553" y2="98" stroke="#3b6d11" stroke-width="0.8" marker-end="url(#a3)"/>
<line x1="517" y1="218" x2="553" y2="166" stroke="#0f6e56" stroke-width="0.8" marker-end="url(#a3)"/>
<line x1="517" y1="240" x2="553" y2="282" stroke="#854f0b" stroke-width="0.8" marker-end="url(#a3)"/>
<line x1="517" y1="250" x2="553" y2="302" stroke="#a32d2d" stroke-width="0.8" marker-end="url(#a3)"/>
<text font-family="system-ui,sans-serif" font-size="11" x="340" y="510" text-anchor="middle" fill="#5f5e5a">Score = Σ (metric score 0–100 × weight). Each metric normalized against its Strong Buy threshold.</text>
</svg> Located in `src/lib/scoringEngine.ts`.

### Inputs
- `askingPrice` — listing price
- `grossRentalIncome` — annual rent (all units)
- `expenses` — operating expenses object
- `interestRate` — current market rate (default 7.25%)
- `downPaymentPct` — default 25%
- `yearBuilt` — for CapEx scoring
- `neighborhoodGrade` — from ATTOM (A through D)

### Financial Calculations

| Metric | Formula |
|---|---|
| NOI | Gross Rent × (1 − vacancy%) − Operating Expenses |
| Cap Rate | NOI / Asking Price × 100 |
| Monthly Payment | Standard mortgage amortization (30yr) |
| Annual Debt Service | Monthly Payment × 12 |
| DSCR | NOI / Annual Debt Service |
| Cash-on-Cash | (NOI − Debt Service) / Total Cash Invested × 100 |
| GRM | Asking Price / Annual Gross Rent |
| Price/Unit | Asking Price / Number of Units |

### Scoring Weights

| Metric | Weight | Strong Buy Threshold |
|---|---|---|
| Cash-on-Cash Return | 25% | ≥ 8% |
| Cap Rate | 20% | ≥ 7.5% |
| DSCR | 20% | ≥ 1.35 |
| Gross Rent Multiplier | 10% | ≤ 8× |
| Price per Unit | 10% | Market dependent |
| Net Operating Income | 5% | ≥ $100K |
| CapEx Reserve | 5% | Age dependent |
| Neighborhood Grade | 5% | A or B |

Each metric is scored 0–100, then weighted and summed. Final score: 0–100.

### Signals
- **Strong Buy** ≥ 75
- **Buy** ≥ 60
- **Watch** ≥ 45
- **Pass** < 45

---

## Data Architecture

### Database Schema (PostgreSQL)

**users**
```sql
id uuid PRIMARY KEY
email text UNIQUE NOT NULL
password_hash text
first_name text
last_name text
role text DEFAULT 'user'
created_at timestamp
```

**organizations**
```sql
id uuid PRIMARY KEY
name text NOT NULL
slug text UNIQUE NOT NULL
plan text DEFAULT 'starter'    -- starter|essentials|pro|team
stripe_customer_id text
stripe_subscription_id text
subscription_status text
created_at timestamp
```

**org_members**
```sql
org_id uuid → organizations
user_id uuid → users
role text    -- owner|admin|member
```

**listings** (the deal feed)
```sql
id uuid PRIMARY KEY
fid text UNIQUE              -- RentCast foreign ID
address text
city text
state text
zip_code text
units integer
property_type text
year_built integer
sq_ft integer
asking_price numeric
days_on_market integer
rank_score integer            -- 0-100
report_data jsonb            -- full financial breakdown
last_scored_at timestamp
created_at timestamp
```

**watchlist_items**
```sql
org_id uuid → organizations
listing_id uuid → listings
created_at timestamp
```

**reports**
```sql
id uuid PRIMARY KEY
org_id uuid → organizations
listing_id uuid → listings
generated_by uuid → users
report_data jsonb
created_at timestamp
```

### Redis Usage
- JWT refresh token blacklist
- API response caching (feed, stats)
- BullMQ job queues (ingestion, reports)

---

## Background Workers

<svg width="100%" viewBox="0 0 680 520" role="img">
<title>RoofRank data flows</title>
<desc>Two swimlanes: nightly ingestion from RentCast through scoring to DB and alerts, and user login through JWT to ranked feed</desc>
<defs>
<marker id="a4" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</marker>
</defs>
<rect x="20" y="20" width="640" height="218" rx="10" fill="none" stroke="#0f6e56" stroke-width="0.5" stroke-dasharray="4 3"/>
<text font-family="system-ui,sans-serif" font-size="11" x="36" y="36" dominant-baseline="central" fill="#0f6e56">Nightly ingestion — 2:00 AM daily</text>
<rect x="40" y="50" width="100" height="44" rx="8" fill="#f1efe8" stroke="#888780" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="90" y="72" text-anchor="middle" dominant-baseline="central" fill="#2c2c2a">Scheduler</text>
<line x1="140" y1="72" x2="168" y2="72" stroke="#888780" stroke-width="1" marker-end="url(#a4)"/>
<rect x="170" y="50" width="100" height="44" rx="8" fill="#faece7" stroke="#993c1d" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="220" y="64" text-anchor="middle" dominant-baseline="central" fill="#4a1b0c">RentCast</text>
<text font-family="system-ui,sans-serif" font-size="11" x="220" y="84" text-anchor="middle" dominant-baseline="central" fill="#993c1d">Active listings</text>
<line x1="270" y1="72" x2="298" y2="72" stroke="#888780" stroke-width="1" marker-end="url(#a4)"/>
<rect x="300" y="50" width="100" height="44" rx="8" fill="#faece7" stroke="#993c1d" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="350" y="64" text-anchor="middle" dominant-baseline="central" fill="#4a1b0c">ATTOM</text>
<text font-family="system-ui,sans-serif" font-size="11" x="350" y="84" text-anchor="middle" dominant-baseline="central" fill="#993c1d">Tax + grades</text>
<line x1="400" y1="72" x2="428" y2="72" stroke="#888780" stroke-width="1" marker-end="url(#a4)"/>
<rect x="430" y="50" width="100" height="44" rx="8" fill="#e1f5ee" stroke="#0f6e56" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="480" y="64" text-anchor="middle" dominant-baseline="central" fill="#04342c">Scoring</text>
<text font-family="system-ui,sans-serif" font-size="11" x="480" y="84" text-anchor="middle" dominant-baseline="central" fill="#0f6e56">8 metrics</text>
<line x1="530" y1="72" x2="558" y2="72" stroke="#888780" stroke-width="1" marker-end="url(#a4)"/>
<rect x="560" y="50" width="80" height="44" rx="8" fill="#eeedfe" stroke="#534ab7" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="600" y="72" text-anchor="middle" dominant-baseline="central" fill="#26215c">Upsert DB</text>
<rect x="40" y="126" width="130" height="44" rx="8" fill="#e1f5ee" stroke="#0f6e56" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="105" y="148" text-anchor="middle" dominant-baseline="central" fill="#04342c">Alert worker</text>
<line x1="600" y1="94" x2="600" y2="114" stroke="#b4b2a9" stroke-width="0.8" stroke-dasharray="2 2"/>
<line x1="600" y1="114" x2="175" y2="114" stroke="#b4b2a9" stroke-width="0.8" stroke-dasharray="2 2"/>
<line x1="175" y1="114" x2="175" y2="124" stroke="#b4b2a9" stroke-width="0.8" stroke-dasharray="2 2" marker-end="url(#a4)"/>
<rect x="200" y="126" width="100" height="44" rx="8" fill="#faece7" stroke="#993c1d" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="250" y="148" text-anchor="middle" dominant-baseline="central" fill="#4a1b0c">Resend email</text>
<line x1="170" y1="148" x2="198" y2="148" stroke="#888780" stroke-width="1" marker-end="url(#a4)"/>
<rect x="320" y="126" width="140" height="44" rx="8" fill="#e1f5ee" stroke="#0f6e56" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="390" y="142" text-anchor="middle" dominant-baseline="central" fill="#04342c">Strong Buy alert</text>
<text font-family="system-ui,sans-serif" font-size="11" x="390" y="160" text-anchor="middle" dominant-baseline="central" fill="#0f6e56">Pro / Team users</text>
<line x1="300" y1="148" x2="318" y2="148" stroke="#888780" stroke-width="1" marker-end="url(#a4)"/>
<rect x="20" y="258" width="640" height="230" rx="10" fill="none" stroke="#185fa5" stroke-width="0.5" stroke-dasharray="4 3"/>
<text font-family="system-ui,sans-serif" font-size="11" x="36" y="274" dominant-baseline="central" fill="#185fa5">User request lifecycle — login through dashboard</text>
<rect x="40" y="290" width="90" height="44" rx="8" fill="#f1efe8" stroke="#888780" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="85" y="312" text-anchor="middle" dominant-baseline="central" fill="#2c2c2a">Browser</text>
<line x1="130" y1="312" x2="158" y2="312" stroke="#888780" stroke-width="1" marker-end="url(#a4)"/>
<text font-family="system-ui,sans-serif" font-size="10" x="144" y="306" text-anchor="middle" fill="#5f5e5a">POST login</text>
<rect x="160" y="290" width="90" height="44" rx="8" fill="#e6f1fb" stroke="#185fa5" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="205" y="312" text-anchor="middle" dominant-baseline="central" fill="#042c53">Auth route</text>
<line x1="250" y1="312" x2="278" y2="312" stroke="#888780" stroke-width="1" marker-end="url(#a4)"/>
<rect x="280" y="290" width="80" height="44" rx="8" fill="#eeedfe" stroke="#534ab7" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="320" y="312" text-anchor="middle" dominant-baseline="central" fill="#26215c">DB lookup</text>
<line x1="360" y1="312" x2="388" y2="312" stroke="#888780" stroke-width="1" marker-end="url(#a4)"/>
<text font-family="system-ui,sans-serif" font-size="10" x="374" y="306" text-anchor="middle" fill="#5f5e5a">JWT</text>
<rect x="390" y="290" width="110" height="44" rx="8" fill="#e1f5ee" stroke="#0f6e56" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="445" y="312" text-anchor="middle" dominant-baseline="central" fill="#04342c">Access token</text>
<line x1="500" y1="312" x2="528" y2="312" stroke="#888780" stroke-width="1" marker-end="url(#a4)"/>
<rect x="530" y="290" width="100" height="44" rx="8" fill="#f1efe8" stroke="#888780" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="580" y="312" text-anchor="middle" dominant-baseline="central" fill="#2c2c2a">Browser</text>
<line x1="85" y1="334" x2="85" y2="378" stroke="#b4b2a9" stroke-width="0.8" stroke-dasharray="2 2"/>
<line x1="85" y1="378" x2="158" y2="378" stroke="#888780" stroke-width="1" marker-end="url(#a4)"/>
<text font-family="system-ui,sans-serif" font-size="10" x="85" y="366" fill="#5f5e5a">GET /feed + JWT</text>
<rect x="160" y="358" width="90" height="44" rx="8" fill="#e6f1fb" stroke="#185fa5" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="205" y="380" text-anchor="middle" dominant-baseline="central" fill="#042c53">Feed route</text>
<line x1="250" y1="380" x2="278" y2="380" stroke="#888780" stroke-width="1" marker-end="url(#a4)"/>
<rect x="280" y="358" width="90" height="44" rx="8" fill="#faeeda" stroke="#854f0b" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="325" y="380" text-anchor="middle" dominant-baseline="central" fill="#412402">Redis cache</text>
<line x1="370" y1="380" x2="398" y2="380" stroke="#888780" stroke-width="1" marker-end="url(#a4)"/>
<text font-family="system-ui,sans-serif" font-size="10" x="384" y="374" text-anchor="middle" fill="#5f5e5a">miss</text>
<rect x="400" y="358" width="80" height="44" rx="8" fill="#eeedfe" stroke="#534ab7" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="440" y="380" text-anchor="middle" dominant-baseline="central" fill="#26215c">DB query</text>
<line x1="480" y1="380" x2="528" y2="380" stroke="#888780" stroke-width="1" marker-end="url(#a4)"/>
<rect x="530" y="358" width="100" height="44" rx="8" fill="#e1f5ee" stroke="#0f6e56" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="580" y="370" text-anchor="middle" dominant-baseline="central" fill="#04342c">Ranked deals</text>
<text font-family="system-ui,sans-serif" font-size="11" x="580" y="390" text-anchor="middle" dominant-baseline="central" fill="#0f6e56">JSON</text>
<text font-family="system-ui,sans-serif" font-size="11" x="340" y="500" text-anchor="middle" fill="#5f5e5a">Cache hit returns immediately · Miss queries Postgres, caches result in Redis</text>
</svg>

### Ingestion Worker (`ingestionWorker.ts`)
**Schedule:** 2:00 AM daily (cron)

**Flow:**
1. Fetch active 2–6 unit listings from RentCast API across all 9 markets
2. Enrich with ATTOM tax/neighborhood data
3. Run scoring engine on each listing
4. Upsert to `listings` table (update if exists, insert if new)
5. Send Strong Buy alerts to Pro/Team subscribers
6. Log summary: total deals, strong buys, markets covered

**Markets:** Boston MA, Providence RI, Hartford CT, Worcester MA, Manchester NH, New Haven CT, Springfield MA, Bridgeport CT, Lowell MA

### Report Worker (`reportWorker.ts`)
**Trigger:** On-demand via API call

**Flow:**
1. Pull listing data from DB
2. Run full financial model
3. Generate narrative + market comparison
4. Store in `reports` table
5. Return report ID to client

---

## Infrastructure (AWS)

### Resources

| Resource | Type | Spec | Purpose |
|---|---|---|---|
| ECS Cluster | Fargate | 512 CPU / 1024 MB | Run API containers |
| ECS Service | — | 1–4 tasks | Auto-scaling |
| ALB | Application | — | HTTPS termination, routing |
| ACM Certificate | — | `*.roofrank.io` | SSL/TLS |
| RDS | PostgreSQL 16 | db.t4g.micro | Primary database |
| ElastiCache | Redis 7.0 | cache.t4g.micro | Cache + queues |
| ECR | — | — | Docker image registry |
| S3 | — | `roofrank-uploads-prod` | File storage |
| Secrets Manager | — | `roofrank/prod/env` | Environment secrets |
| CloudWatch | Log Group | 30 day retention | Container logs |

### Networking

<svg width="100%" viewBox="0 0 680 500" role="img">
<title>RoofRank AWS VPC networking diagram</title>
<desc>VPC structure with public and private subnets, ALB, ECS, RDS, Redis, NAT gateway</desc>
<defs>
<marker id="a2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</marker>
</defs>
<rect x="20" y="20" width="640" height="450" rx="16" fill="none" stroke="#378add" stroke-width="0.8" stroke-dasharray="5 3"/>
<text font-family="system-ui,sans-serif" font-size="13" font-weight="500" x="40" y="42" dominant-baseline="central" fill="#185fa5">VPC  10.0.0.0/16</text>
<rect x="40" y="58" width="290" height="180" rx="10" fill="none" stroke="#1d9e75" stroke-width="0.5" stroke-dasharray="3 2"/>
<text font-family="system-ui,sans-serif" font-size="11" x="56" y="74" dominant-baseline="central" fill="#0f6e56">Public subnets · 10.0.0.0/24 · 10.0.1.0/24</text>
<rect x="60" y="96" width="120" height="52" rx="8" fill="#e6f1fb" stroke="#185fa5" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="13" font-weight="500" x="120" y="116" text-anchor="middle" dominant-baseline="central" fill="#042c53">ALB</text>
<text font-family="system-ui,sans-serif" font-size="11" x="120" y="136" text-anchor="middle" dominant-baseline="central" fill="#185fa5">HTTPS :443</text>
<rect x="200" y="96" width="110" height="52" rx="8" fill="#e1f5ee" stroke="#0f6e56" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="255" y="116" text-anchor="middle" dominant-baseline="central" fill="#04342c">NAT Gateway</text>
<text font-family="system-ui,sans-serif" font-size="11" x="255" y="136" text-anchor="middle" dominant-baseline="central" fill="#0f6e56">Elastic IP</text>
<rect x="40" y="258" width="290" height="190" rx="10" fill="none" stroke="#ba7517" stroke-width="0.5" stroke-dasharray="3 2"/>
<text font-family="system-ui,sans-serif" font-size="11" x="56" y="274" dominant-baseline="central" fill="#854f0b">Private subnets · 10.0.10.0/24 · 10.0.11.0/24</text>
<rect x="60" y="296" width="120" height="52" rx="8" fill="#e1f5ee" stroke="#0f6e56" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="120" y="316" text-anchor="middle" dominant-baseline="central" fill="#04342c">ECS Fargate</text>
<text font-family="system-ui,sans-serif" font-size="11" x="120" y="334" text-anchor="middle" dominant-baseline="central" fill="#0f6e56">sg: roofrank-app</text>
<rect x="60" y="364" width="110" height="52" rx="8" fill="#eeedfe" stroke="#534ab7" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="115" y="384" text-anchor="middle" dominant-baseline="central" fill="#26215c">RDS Postgres</text>
<text font-family="system-ui,sans-serif" font-size="11" x="115" y="402" text-anchor="middle" dominant-baseline="central" fill="#534ab7">sg: roofrank-db</text>
<rect x="190" y="364" width="120" height="52" rx="8" fill="#faeeda" stroke="#854f0b" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="250" y="384" text-anchor="middle" dominant-baseline="central" fill="#412402">ElastiCache</text>
<text font-family="system-ui,sans-serif" font-size="11" x="250" y="402" text-anchor="middle" dominant-baseline="central" fill="#854f0b">sg: roofrank-redis</text>
<rect x="350" y="58" width="290" height="390" rx="10" fill="none" stroke="#b4b2a9" stroke-width="0.5" stroke-dasharray="3 2"/>
<text font-family="system-ui,sans-serif" font-size="11" x="366" y="74" dominant-baseline="central" fill="#5f5e5a">AWS managed services</text>
<rect x="370" y="90" width="120" height="52" rx="8" fill="#f1efe8" stroke="#888780" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="430" y="116" text-anchor="middle" dominant-baseline="central" fill="#2c2c2a">ECR</text>
<rect x="510" y="90" width="110" height="52" rx="8" fill="#f1efe8" stroke="#888780" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="565" y="116" text-anchor="middle" dominant-baseline="central" fill="#2c2c2a">Secrets Mgr</text>
<rect x="370" y="162" width="110" height="52" rx="8" fill="#f1efe8" stroke="#888780" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="425" y="188" text-anchor="middle" dominant-baseline="central" fill="#2c2c2a">CloudWatch</text>
<rect x="500" y="162" width="120" height="52" rx="8" fill="#f1efe8" stroke="#888780" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="560" y="188" text-anchor="middle" dominant-baseline="central" fill="#2c2c2a">S3 Bucket</text>
<rect x="370" y="234" width="110" height="52" rx="8" fill="#f1efe8" stroke="#888780" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="425" y="260" text-anchor="middle" dominant-baseline="central" fill="#2c2c2a">ACM Cert</text>
<rect x="370" y="306" width="250" height="52" rx="8" fill="#f1efe8" stroke="#888780" stroke-width="0.5"/>
<text font-family="system-ui,sans-serif" font-size="12" font-weight="500" x="495" y="332" text-anchor="middle" dominant-baseline="central" fill="#2c2c2a">IAM · ecs-task-execution</text>
<line x1="120" y1="148" x2="120" y2="294" stroke="#888780" stroke-width="1" marker-end="url(#a2)"/>
<line x1="120" y1="148" x2="255" y2="256" stroke="#888780" stroke-width="0.8" stroke-dasharray="3 2" marker-end="url(#a2)"/>
<line x1="120" y1="350" x2="115" y2="362" stroke="#888780" stroke-width="1" marker-end="url(#a2)"/>
<line x1="120" y1="350" x2="245" y2="362" stroke="#888780" stroke-width="1" marker-end="url(#a2)"/>
<text font-family="system-ui,sans-serif" font-size="11" x="340" y="476" text-anchor="middle" fill="#5f5e5a">Dashed = outbound-only · Solid = bidirectional</text>
</svg>

```
VPC: 10.0.0.0/16
├── Public Subnets (ALB)
│   ├── 10.0.0.0/24  us-east-1a
│   └── 10.0.1.0/24  us-east-1b
├── Private Subnets (ECS, RDS, Redis)
│   ├── 10.0.10.0/24 us-east-1a
│   └── 10.0.11.0/24 us-east-1b
└── NAT Gateway → Internet (for ECS outbound)
```

### Security Groups

| SG | Inbound | Outbound |
|---|---|---|
| `roofrank-alb` | 80, 443 from 0.0.0.0/0 | All |
| `roofrank-app` | 3000 from ALB SG only | All |
| `roofrank-db` | 5432 from App SG only | None |
| `roofrank-redis` | 6379 from App SG only | None |

### Auto-scaling
- Min: 1 task, Max: 4 tasks
- Scale up when CPU > 70%

### DNS

| Record | Type | Value |
|---|---|---|
| `roofrank.io` | A | `75.2.60.5` (Netlify) |
| `www.roofrank.io` | CNAME | `apex-loadbalancer.netlify.com` |
| `api.roofrank.io` | CNAME | ALB DNS name |
| `_9636260...` | CNAME | ACM validation record |

---

## Deployment Pipeline

### Current State
Manual deployment via CLI commands.

### Deployment Steps (manual)

```bash
# 1. Build image for linux/amd64 (required for ECS)
docker buildx build --platform linux/amd64 -t roofrank:latest .

# 2. Push to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin 803871049071.dkr.ecr.us-east-1.amazonaws.com

docker tag roofrank:latest \
  803871049071.dkr.ecr.us-east-1.amazonaws.com/roofrank:latest

docker push 803871049071.dkr.ecr.us-east-1.amazonaws.com/roofrank:latest

# 3. Deploy new version
aws ecs update-service \
  --cluster roofrank \
  --service roofrank \
  --region us-east-1 \
  --force-new-deployment
```

### Frontend Deployment
Auto-deploys on every push to `main` branch of `devnestdynamics/roofrank-frontend`.

### Future: GitHub Actions CI/CD
Pipeline defined in `roofrank-infra-work/.github/workflows/deploy.yml`:
1. Run tests
2. Build Docker image (linux/amd64)
3. Push to ECR
4. Run DB migrations
5. Update ECS service

---

## Third-Party Integrations

| Service | Purpose | Status | Cost |
|---|---|---|---|
| RentCast | Listing data ingestion | Key configured, Foundation plan needed | $74/mo |
| ATTOM | Tax records, neighborhood grades | Key configured | Usage-based |
| Stripe | Billing, subscriptions | Placeholder keys, not live | % of revenue |
| Resend | Transactional email | Placeholder key | Usage-based |
| Google OAuth | Social login | Configured (localhost only) | Free |
| Netlify | Frontend hosting | Live | Free |
| AWS | Infrastructure | Live | ~$50-80/mo |
| Namecheap | Domain | Live | $34.98/yr |

---

## Environment Variables

All secrets stored in AWS Secrets Manager at `roofrank/prod/env`.

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string with `?sslmode=require` |
| `REDIS_URL` | Yes | Redis connection string |
| `JWT_SECRET` | Yes | 64-char hex string for access tokens |
| `JWT_REFRESH_SECRET` | Yes | 64-char hex string for refresh tokens |
| `RENTCAST_API_KEY` | Yes | RentCast API key |
| `ATTOM_API_KEY` | Yes | ATTOM Data API key |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |
| `GOOGLE_CALLBACK_URL` | Yes | `https://api.roofrank.io/api/auth/google/callback` |
| `STRIPE_SECRET_KEY` | No | Stripe secret key (sk_live_...) |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook signing secret |
| `RESEND_API_KEY` | No | Resend email API key |
| `EMAIL_FROM` | No | Sender address (noreply@roofrank.io) |
| `CLIENT_URL` | Yes | Frontend URL (https://roofrank.io) |

---

## Monitoring & Logs

### CloudWatch Logs
- Log group: `/ecs/roofrank`
- Retention: 30 days
- View latest: 
```bash
aws logs get-log-events \
  --log-group-name /ecs/roofrank \
  --region us-east-1 \
  --log-stream-name $(aws logs describe-log-streams \
    --log-group-name /ecs/roofrank \
    --region us-east-1 \
    --order-by LastEventTime \
    --descending \
    --query 'logStreams[0].logStreamName' \
    --output text) \
  --limit 50 \
  --query 'events[*].message' \
  --output text
```

### Health Check
```bash
curl https://api.roofrank.io/health
# → {"status":"ok","env":"production","ts":"..."}
```

### ECS Service Status
```bash
aws ecs describe-services \
  --cluster roofrank \
  --service roofrank \
  --region us-east-1 \
  --query 'services[0].{desired:desiredCount,running:runningCount,pending:pendingCount}'
```

---

## Key Numbers

| Metric | Value |
|---|---|
| Markets | 9 (Boston, Providence, Hartford, Worcester, Manchester, New Haven, Springfield, Bridgeport, Lowell) |
| Seed deals | 26 |
| Scoring metrics | 8 |
| Interest rate (scoring) | 7.25% |
| Down payment (scoring) | 25% |
| Vacancy rate (scoring) | 5% |
| Strong Buy threshold | ≥ 75 |
| Ingestion schedule | 2:00 AM daily |
| API response cache | Redis, TTL varies |
| DB backup | Disabled (free tier) |
| ECS min/max tasks | 1/4 |

