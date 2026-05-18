# RoofRank · Onboarding Backend Coordination (Phase 1)

**Date:** 2026-05-17
**Audience:** Backend lead (and future Ali)
**Purpose:** Spec the backend work needed before the new onboarding flow (locked design in `mockups/onboarding-final-mockup.html`) can ship to production.

---

## TL;DR

The locked onboarding design is **value-before-auth** (5 screens: market picker → live feed with W8 engine + W7 analyst voice → magic-link wall → check inbox → waitlist fallback). To ship it, backend needs to expose 3 new endpoints, batch-generate analyst notes nightly, and confirm market coverage for 3 new cities. Estimated backend effort: **1-2 weeks**.

---

## Endpoints needed

### Critical for launch

#### 1. `GET /feed/public?market=X`

**Purpose:** Pre-auth deal feed shown on Screen 2 of onboarding.

**Why it must exist:** The whole value-before-auth pivot is built on showing real deals to anonymous visitors. Without this, the user has nothing to look at until they sign up — defeating the strategic flip.

**Request:**
```
GET /feed/public?market=lynn&limit=4
```

Query params:
- `market` (required): one of `lynn`, `worcester`, `salem`, `revere`, `framingham`, `all`
- `limit` (optional, default 4): max 10

**Response:**
```json
{
  "market": { "city": "Lynn", "state": "MA", "region": "North Shore", "activeCount": 18 },
  "brief": "4 worth opening. 58 Laighton leads — 11.4% CoC, per-unit rents 8% below market.",
  "deals": [
    {
      "id": "deal_abc123",
      "address": "58 Laighton St, Lynn",
      "verdict": "Strong Buy",
      "score": 87,
      "monthlyCashflow": 2180,
      "cocPercent": 11.4,
      "units": 4,
      "price": 645000,
      "daysListed": 8,
      "isFeatured": true,
      "analystNote": "Top deal in Lynn — pricing leverage at $610K",
      "scoringData": {
        "freddieRate": 6.83,
        "freddieWeek": "2026-05-13",
        "attomTaxYearly": 7820,
        "hudRentMonthly": 2100,
        "hudBedrooms": 2,
        "hudZip": "01902"
      }
    }
  ]
}
```

**Auth:** None. Public endpoint.

**Rate limiting:** Yes. 60 requests/hour per IP. Cache-friendly (Cache-Control: public, max-age=300).

**Edge cases:**
- Market with zero active listings → return empty `deals` array + meaningful `brief` ("Quiet week in Salem — 0 worth opening today")
- Invalid market name → 404 with hint at valid markets
- `market=all` → return top deals across all 5 cities

---

#### 2. `POST /auth/magic-link/request`

**Purpose:** Send a sign-in email with a magic link. Replaces password-first signup.

**Request:**
```json
POST /auth/magic-link/request
Content-Type: application/json

{
  "email": "user@example.com",
  "returnTo": "/feed?market=lynn"
}
```

**Response (200):**
```json
{
  "ok": true,
  "expiresAt": "2026-05-17T22:30:00Z"
}
```

**Always returns 200** even if email doesn't exist (don't reveal account existence — prevents email enumeration).

**Email body must include:**
- One-tap sign-in link: `https://roofrank.io/auth/magic.html?token=XYZ&returnTo=/feed?market=lynn`
- Expires in 15 minutes
- "If you didn't request this, ignore this email"

**Rate limiting:** 5 requests/hour per email + IP. Prevents spam to others' inboxes.

**Email service:** Resend, Postmark, or AWS SES. Whichever is easiest to wire.

---

#### 3. `GET /auth/magic-link/verify?token=X`

**Purpose:** User clicks the link in their email. Validates token, issues access + refresh tokens, signs them in.

**Request:**
```
GET /auth/magic-link/verify?token=XYZ
```

**Response (200):**
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": { "id": "u_abc", "email": "user@example.com" },
  "returnTo": "/feed?market=lynn"
}
```

**Response (410 Gone):** Token expired or already used.

**Behavior:**
- Token is one-time-use (delete after validation)
- Token expires 15 min after generation
- On success: create user if doesn't exist, mark email as verified
- Issue same access/refresh token pair format as existing `/auth/login`

**Frontend page that calls this:** new `roofrank-magic.html` — minimal HTML that pulls the token from URL params, calls verify, stores tokens, redirects to `returnTo`.

---

### Already exists (verify schema only)

#### 4. `POST /waitlist`

Already in `api.js:159` as `WaitlistAPI.join(email, city, state)`. Confirm the request shape matches the mockup's Screen 5 form:

```json
POST /waitlist
{ "email": "user@example.com", "city": "Brookline", "state": "MA" }
```

If the existing schema differs, either update the frontend mockup or the backend endpoint to align.

---

### Nice to have (can hardcode for MVP)

#### 5. `GET /listings/markets`

**Purpose:** Powers the market picker on Screen 1 with live active-count per city.

**Response:**
```json
[
  { "city": "Lynn", "state": "MA", "region": "North Shore", "activeCount": 18 },
  { "city": "Salem", "state": "MA", "region": "North Shore", "activeCount": 9 },
  { "city": "Revere", "state": "MA", "region": "North Shore", "activeCount": 11 },
  { "city": "Worcester", "state": "MA", "region": "Central MA", "activeCount": 12 },
  { "city": "Framingham", "state": "MA", "region": "MetroWest", "activeCount": 7 }
]
```

**MVP fallback:** Frontend hardcodes the 5 cities and queries actual counts via `GET /feed/public?market=X&limit=0` instead. Defer this endpoint to v1.1.

---

## Wedge-critical: analyst notes batch job

The W7 + W8 wedge depends on per-deal analyst notes. These appear as the final step in the engine animation ("Analyst take → 'Top deal in Lynn — pricing leverage at $610K'") and in the `analystNote` field on `/feed/public`.

### How it works

1. Scoring engine runs overnight (existing)
2. **NEW:** After scoring completes, for each new deal: call Claude (Sonnet 4.6) with deal context → generate 1-sentence analyst note
3. Store note on the deal record
4. Served via `/feed/public` and `/feed/:id`

### Prompt (draft)

```
You are RoofRank's senior real estate analyst. You score 2-6 unit multifamily
properties in Massachusetts. Given the deal data below, write ONE sentence
(max 18 words) of plain-spoken analyst commentary for the investor. Tone:
sharp, action-oriented, honest about both opportunity and risk.

Deal: {address}
Verdict: {verdict} ({score}/100)
Cashflow: ${monthlyCashflow}/mo · {cocPercent}% CoC
Units: {units} · Price: ${price}
Listed: {daysListed} days ago
Market median CoC this week: {marketMedianCoc}%

Examples of good notes:
- "Top deal in Lynn — pricing leverage at $610K"
- "Don't sleep — priced right despite 12 days"
- "Sellers motivated — start $580K, walk above $625K"
- "Tight margins — pass unless $50K below ask"

Write the note for {address}:
```

### Cost estimate

- ~30 new listings/week across 5 markets
- ~200-300 output tokens per call
- Sonnet 4.6 pricing: **~$5-15/month** at full launch volume
- Negligible

### Failure mode

If Claude call fails for a deal:
- Store `analystNote: null`
- Frontend falls back to last-step label: "Computing 8 metrics" or "Comparing to market"
- Logged for retry on next batch run

---

## Backend coverage: 3 new cities

Per [[mvp-launch-markets]] (memory) and backlog #179, MVP launches with 5 MA cities. Currently 2 are live in scoring (Lynn, Worcester). Three need backend onboarding:

| City | RentCast coverage | ATTOM coverage | Scoring engine ready | Notes |
|---|---|---|---|---|
| Salem | ? | ? | ❌ | Verify RentCast has 2-6 unit listing flow |
| Revere | ? | ? | ❌ | Dense triple-decker inventory expected |
| Framingham | ? | ? | ❌ | Suburban, smaller MF inventory |

**Per-city work estimate:** ~1-2 days each (data validation + scoring warmup + manual QA on first 5 listings).

---

## Dependency graph

```
Phase 1 (this doc)
  │
  ├─ /feed/public ────────┐
  ├─ /auth/magic-link/* ──┤
  ├─ Analyst notes batch ─┤
  ├─ 3 new cities scoring ┤
  │                       │
  └─ Phase 3 (frontend) ──┴─→ Phase 4 (ship)
```

Phase 3 (production build of new onboarding pages) is **fully blocked** on Phase 1 completion. Don't start Phase 3 until at least `/feed/public` + magic-link endpoints exist in a working dev environment.

---

## Open questions for backend lead

1. **Email service:** Resend, Postmark, AWS SES — which do we prefer? (Resend has the easiest DX for magic links specifically)
2. **Token storage:** Redis, DB, or stateless JWT? (Redis is fastest, DB simplest, JWT means stateless but harder to revoke)
3. **Token lifetime:** 15 min standard. Confirm this works for typical user inbox-switch latency.
4. **Are Salem/Revere/Framingham in RentCast's coverage?** If gaps exist, we may need to swap one of the 3 for a covered city pre-launch.
5. **Where does the analyst notes Claude call run?** New cron job, append to existing scoring pipeline, or scheduled Lambda?
6. **Rate limiting:** Need both per-IP (for `/feed/public`) and per-email (for `/auth/magic-link/request`). Use existing middleware or build new?

---

## Suggested timeline

| Week | Work |
|---|---|
| **W1** | Backend lead reviews this doc. Sync call to answer open questions. Lock endpoint contracts. |
| **W1-W2** | Build `/feed/public` + `/auth/magic-link/*` endpoints. Wire email service. |
| **W2** | Analyst notes Claude batch job. Start scoring engine warmup for Salem/Revere/Framingham. |
| **W2-W3** | Dev environment ready with all endpoints. Frontend starts Phase 3. |
| **W3-W4** | Frontend builds production pages from `mockups/onboarding-final-mockup.html`. Integration testing. |
| **W4** | End-to-end QA, mobile testing, ship. |

---

## Related references

- Locked design: `mockups/onboarding-final-mockup.html`
- Feed-only reference: `mockups/feed-simplified-mockup.html`
- Strategic backlog: `docs/ROOFRANK-BACKLOG.md` items #178, #179, #180, #181
- Memory: `mvp-launch-markets.md`, `feedback-positioning-decision-tool.md`
