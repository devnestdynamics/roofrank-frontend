# RoofRank · Testing Strategy

**Last updated:** 2026-05-17
**Owner:** Ali

This is the single source of truth for how RoofRank is tested. It defines layers, ownership, tooling, and how to add new cases.

---

## TL;DR — the testing pyramid

```
                    ┌───────────────┐
                    │   E2E (≈5%)   │   Real browser, real backend, real DB
                    │   Playwright  │   Slowest, highest signal, brittlest
                    └───────────────┘
              ┌─────────────────────────┐
              │   Integration (≈25%)    │   API + DB, no browser
              │   Playwright APIRequest │   Fast, deterministic, contract guard
              └─────────────────────────┘
        ┌─────────────────────────────────────┐
        │        Unit (≈70%)                  │   Pure functions, fast
        │   Node built-in test runner         │   Cheap, run on every save
        └─────────────────────────────────────┘
```

**Bias toward integration tests** for this project. The frontend is vanilla HTML with no build step (hard to unit-test), and the wedge — scoring engine + data pipeline — is best validated via API calls against a real DB.

---

## Where tests live

| Layer | Repo | Path | Runner |
|---|---|---|---|
| **Unit (backend)** | `roofrank-backend` | `src/**/__tests__/*.test.ts` *(planned)* | `node --test` via tsx |
| **Integration (API + DB)** | `roofrank-backend/tests` | `tests/*.spec.ts` | Playwright (`@playwright/test`) |
| **E2E (browser)** | `roofrank-backend/tests` | `tests/*.spec.ts` (uses `page` fixture) | Playwright (`@playwright/test`) |
| **Manual / exploratory** | `docs/ROOFRANK-TEST-PLAN.md` | — | Human |

**Why backend owns the test repo:** the test suite is a separate npm package with Playwright dependencies. Keeping it in `roofrank-backend/tests/` means CI can run all tests with one checkout. Frontend tests are still Playwright pointed at frontend URLs.

---

## Running tests

### Prerequisites

```bash
# DB + Redis (must be running)
cd ~/Code/roofrank-backend && docker-compose up -d

# Backend (must be running for integration + E2E)
cd ~/Code/roofrank-backend && npm run dev

# Frontend static server (must be running for E2E)
cd ~/Code/roofrank-frontend && python3 -m http.server 8765
```

### Run all tests

```bash
cd ~/Code/roofrank-backend/tests
BASE_URL=http://localhost:8765 API_URL=http://localhost:3000/api npx playwright test
```

### Run a specific spec

```bash
npx playwright test onboarding-flow.spec.ts
```

### Run with a different target environment

```bash
# Against prod (default — see playwright.config.ts)
npx playwright test

# Against staging
BASE_URL=https://staging.roofrank.io API_URL=https://api-staging.roofrank.io/api npx playwright test
```

### Generate test report

```bash
# After running, generates HTML report at test-results/
npx playwright show-report
```

---

## Coverage map — what's tested where

### Existing (before 2026-05-17)

| Area | Spec | Layer |
|---|---|---|
| API health check | `smoke.spec.ts` | Integration |
| Landing page loads | `smoke.spec.ts` | E2E |
| Login form rendering | `smoke.spec.ts`, `auth.spec.ts` | E2E |
| Login flow (success + bad password) | `auth.spec.ts` | E2E |
| Feed page rendering | `feed.spec.ts` | E2E |
| Scoring engine math (8 metrics) | `scoring.spec.ts` | Unit-ish (via API) |
| API contract for `/api/feed` | `api.spec.ts` | Integration |

### Added 2026-05-17 (onboarding rebuild)

| Area | Spec | Layer |
|---|---|---|
| `GET /api/feed/public` — happy path | `public-feed.spec.ts` | Integration |
| `GET /api/feed/public` — bad market, missing market, empty market | `public-feed.spec.ts` | Integration |
| `POST /api/auth/magic-link/request` — token row created | `magic-link.spec.ts` | Integration + DB |
| `GET /api/auth/magic-link/verify` — new user, existing user, replay, bogus, expired | `magic-link.spec.ts` | Integration + DB |
| Full onboarding flow: landing → market picker → feed → magic link → verify | `onboarding-flow.spec.ts` | E2E |
| Back-to-deals button visibility (Panels 3 + 4) | `onboarding-flow.spec.ts` | E2E |
| W8 engine animation completes (all 4 steps reach `done`) | `onboarding-flow.spec.ts` | E2E |
| Small card "↻ how was this scored" inline expand | `onboarding-flow.spec.ts` | E2E |
| Waitlist path | `onboarding-flow.spec.ts` | E2E |

### Not yet covered (gaps to track)

- Dashboard authenticated routes — feed.spec.ts has a stub but no full coverage
- Stripe checkout flow
- Push notification delivery
- Deal-detail "Ask the analyst" chat
- Per-unit rent override
- Analyzer page (manual deal entry)
- Mobile-specific layouts at small viewports

Each gap below is a future spec to add.

---

## How to add a new test case

1. **Pick the layer.** Pure function? Unit. Calls DB? Integration. Renders UI? E2E.
2. **Pick the spec file.** New feature → new file. Adding a case to existing area → existing file.
3. **Follow the patterns in `tests/tests/`:**
   - Import: `import { test, expect } from '@playwright/test';`
   - Constants: `const API = process.env.API_URL || 'https://api.roofrank.io/api';`
   - Always test happy path AND ≥1 negative path
4. **Run it locally** with `BASE_URL=http://localhost:8765 API_URL=http://localhost:3000/api npx playwright test <yourspec>`
5. **Update this doc's coverage map** with the new case.
6. **Commit the spec + doc update in the same PR.**

---

## Test report

After every run, two artifacts:

1. **Playwright HTML report** — `test-results/` (auto-generated, view with `npx playwright show-report`)
2. **Markdown summary** — `tests/reports/REPORT-<timestamp>.md` (committed for change-over-time visibility)

The markdown report is generated by `scripts/test-report.sh` (planned). For now, save by hand after each run:

```bash
mkdir -p tests/reports
date > tests/reports/REPORT-$(date +%Y%m%d-%H%M).md
npx playwright test 2>&1 | tee -a tests/reports/REPORT-$(date +%Y%m%d-%H%M).md
```

---

## Things we DON'T test (and why)

- **Visual regression / pixel-perfect diffs** — too brittle for a fast-iterating product. Re-evaluate after launch.
- **Cross-browser** — Chrome only for now (Playwright config). Add Firefox + Safari before launch.
- **Load testing** — premature at MVP traffic levels. Re-evaluate at 100+ DAU.
- **Accessibility automated audits** — manual VoiceOver pass before launch. axe-core integration is a v1.1 add.

---

## Anti-patterns to avoid

- **Tests that depend on prior test state.** Each test must seed/clean its own data.
- **Hardcoded user emails.** Use timestamped emails per run (`e2e-test-${Date.now()}@example.com`) to avoid collisions.
- **Skipping the negative path.** "It works on the happy path" doesn't prove the error handling exists.
- **`page.waitForTimeout()` instead of `page.waitForSelector()`.** Timeouts make tests slow AND flaky. Wait for state, not time.
- **Asserting on DOM internals (class names, IDs).** Brittle. Assert on user-visible behavior (text, role, visibility) where possible.

---

## Real bugs surfaced by tests so far

Tracked here so we have a record of what testing has caught:

| Date | Found by | Bug | Status |
|---|---|---|---|
| 2026-05-17 | E2E onboarding | After magic-link verify, dashboard hardcodes prod API URL → 401 in dev | Fixing |

---

## References

- Backend manual test plan: `roofrank-backend/docs/TEST-PLAN.md` — comprehensive list of WHAT to verify
- This doc: HOW the tests are organized and run
- Playwright docs: https://playwright.dev/
