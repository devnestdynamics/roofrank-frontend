# RoofRank — Frontend

Static HTML/CSS/JS for [roofrank.io](https://roofrank.io). No build step. Each page is one file.

## Layout

```
/                           static html pages (deployed to S3 + CloudFront)
  roofrank-landing.html     marketing site
  roofrank-dashboard.html   feed (conversation-first analyst)
  roofrank-deal-detail.html deal page (Pro gating)
  roofrank-analyzer.html    standalone underwriting
  roofrank-onboarding.html  signup flow
  roofrank-login.html       login / signup
  roofrank-pricing.html     standalone pricing
  roofrank-reports.html
  roofrank-watchlist.html
  brand-preview.html        brand exploration (RoofRank vs Deckers)
  deckers-mockup.html       Deckers concept applied in-product

  api.js                    auth + apiFetch with refresh-token flow
  billing.js                BillingAPI

docs/                       project docs (ARCHITECTURE, BACKLOG, RUNBOOK, etc.)
icons/                      PWA icons (TODO)
```

## Stack

- **Type**: Playfair Display (serif) + DM Sans + DM Mono — served from `fonts.bunny.net` (privacy-friendly drop-in for Google Fonts)
- **API**: `https://api.roofrank.io/api`
- **Auth**: JWT with refresh-token flow via `api.js` `Auth` + `apiFetch`
- **Billing**: Stripe via `billing.js` `BillingAPI.getSubscription()`
- **State**: localStorage for chat/watchlist/scenario; sessionStorage for deal cache + first-load animations

## Local dev

Open any `.html` directly, or:

```bash
python3 -m http.server 8000
# → http://localhost:8000/roofrank-landing.html
```

Pages talk to the live API at `api.roofrank.io`. To hit a local backend, edit the `API_URL` constant near the top of each page.

## Pro gating

Pro state is fetched from `BillingAPI.getSubscription()` and toggled with `?free=1` URL override for local testing. Locked features show an upgrade card instead of the gated content.

## Deploy

Manual today: copy modified `.html` files to S3, invalidate the CloudFront distribution. Automating in [#116 Deploy Script](docs/ROOFRANK-BACKLOG.md). CI/CD wiring tracked in [#43](docs/ROOFRANK-BACKLOG.md).

## Secrets

Never committed. Live at `~/Code/roofrank-secrets/` outside the repo:

- `google-oauth-client-secret.json` — Google OAuth client
- `roofrank-deploy_accessKeys.csv` — AWS deploy keys

Anything matching `*_secret*.json`, `*_accessKeys.csv`, `.env*`, `*.pem`, `*.key` is gitignored as a backstop.

## Sibling repos

Everything under the [`devnestdynamics`](https://github.com/devnestdynamics) GitHub account (the RoofRank LLC):

| Repo | Visibility | What |
|---|---|---|
| [`roofrank-frontend`](https://github.com/devnestdynamics/roofrank-frontend) | public | this repo — static site |
| [`roofrank-backend`](https://github.com/devnestdynamics/roofrank-backend) | private | Node/TS API, scoring, ingestion, AI chat |
| [`roofrank-infra`](https://github.com/devnestdynamics/roofrank-infra) | private | terraform, nginx, deploy workflow |

Local layout:
```
~/Code/roofrank-frontend/   ← this repo
~/Code/roofrank-backend/
~/Code/roofrank-infra/
~/Code/roofrank-secrets/    ← OAuth client secret + AWS access keys (chmod 700/600, never in any repo)
~/Code/roofrank-archive/    ← old zips, doorrank-starter, stale html snapshots
```

## See also

- [docs/ROOFRANK-BACKLOG.md](docs/ROOFRANK-BACKLOG.md) — product backlog (120+ items, MVP scope at top)
- [docs/ROOFRANK-ARCHITECTURE.md](docs/ROOFRANK-ARCHITECTURE.md) — system design
- [docs/ROOFRANK-DATA-SOURCES.md](docs/ROOFRANK-DATA-SOURCES.md) — RentCast / ATTOM / HUD
- [docs/ROOFRANK-RUNBOOK.md](docs/ROOFRANK-RUNBOOK.md) — operational playbook
- [docs/ROOFRANK-TEST-PLAN.md](docs/ROOFRANK-TEST-PLAN.md) — manual + automated test coverage
- [docs/SETUP.md](docs/SETUP.md) — env setup
