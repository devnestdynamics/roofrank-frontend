# RoofRank — Automated Test Suite

Built with [Playwright](https://playwright.dev). Tests run against production at `https://roofrank.io`.

---

## Setup

```bash
cd tests
npm install
npx playwright install chromium
```

Set environment variables:
```bash
export BASE_URL=https://roofrank.io
export API_URL=https://api.roofrank.io/api
export TEST_TOKEN=  # Optional — tests generate their own tokens
```

---

## Running Tests

```bash
# All tests
npm test

# Smoke tests only (run after every deploy — ~60 seconds)
npx playwright test tests/smoke.spec.ts

# Scoring accuracy tests (most critical)
npx playwright test tests/scoring.spec.ts

# Auth tests
npx playwright test tests/auth.spec.ts

# Feed + UI tests
npx playwright test tests/feed.spec.ts

# API contract tests
npx playwright test tests/api.spec.ts

# Run with browser visible (for debugging)
npm run test:headed

# View HTML test report
npx playwright show-report
```

---

## Test Files

| File | What it tests | Priority |
|---|---|---|
| `smoke.spec.ts` | API health, login, feed has data, scores valid | 🔴 Run on every deploy |
| `scoring.spec.ts` | Score accuracy, financial math, signal thresholds | 🔴 Run daily |
| `auth.spec.ts` | Login, JWT, protected routes | 🟡 Run on auth changes |
| `feed.spec.ts` | Feed sorting, filtering, UI rendering, deal detail | 🟡 Run on feed changes |
| `api.spec.ts` | Response format, CORS, latency, watchlist | 🟡 Run on API changes |

---

## CI/CD Integration

Add to `.github/workflows/deploy.yml` after deploy step:

```yaml
- name: Run smoke tests
  run: |
    cd tests
    npm install
    npx playwright install chromium --with-deps
    npm test -- tests/smoke.spec.ts
  env:
    BASE_URL: https://roofrank.io
    API_URL: https://api.roofrank.io/api
```

---

## Key Test: Scoring Accuracy

The most important test is `scoring.spec.ts`. It verifies:

1. **Freeman St (Boston)** — should score 55–75, signal = Buy
2. **88 Park Ave (Worcester)** — should score 40–55, signal = Watch  
3. **302 Atwells Ave (Providence)** — should score 25–45, signal = Pass
4. **All scores** are between 0–100
5. **Signal matches score** — score ≥ 75 = Strong Buy, etc.
6. **Financial math** — cap rate, DSCR, GRM verified against formula
7. **Score is deterministic** — same deal scored twice gives same result

If any of these fail after a deploy, **do not promote to production**.

---

## What's Not Automated Yet

- Email delivery (Strong Buy alerts)
- Stripe checkout flow (requires test cards)
- Nightly ingestion trigger
- PDF export
- Google OAuth flow

These require additional setup (Stripe test mode, email sandbox) and should be added as the product matures.
