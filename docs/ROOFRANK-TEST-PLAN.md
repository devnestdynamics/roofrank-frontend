# RoofRank — Test Plan

**Last updated:** May 2026  
**Version:** 1.0  
**Scope:** End-to-end functional testing, data accuracy, scoring engine validation, API contract testing, and user flow testing.

The most critical area for RoofRank is **data accuracy**. An investor making a $500K–$2M decision based on a score that is wrong is not a minor bug — it is a product failure. Every financial calculation must be verified against known inputs.

---

## Table of Contents

1. [Scoring Engine Accuracy](#1-scoring-engine-accuracy)
2. [Financial Calculation Accuracy](#2-financial-calculation-accuracy)
3. [Deal Feed Integrity](#3-deal-feed-integrity)
4. [Ingestion Pipeline](#4-ingestion-pipeline)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [API Contract Tests](#6-api-contract-tests)
7. [Frontend User Flows](#7-frontend-user-flows)
8. [Deal Detail Page](#8-deal-detail-page)
9. [Analyzer Accuracy](#9-analyzer-accuracy)
10. [Watchlist & Reports](#10-watchlist--reports)
11. [Billing & Subscriptions](#11-billing--subscriptions)
12. [Edge Cases & Boundary Conditions](#12-edge-cases--boundary-conditions)
13. [Performance](#13-performance)
14. [Security](#14-security)

---

## 1. Scoring Engine Accuracy

The scoring engine is the core of the product. These tests verify that the math is correct.

### 1.1 Known-Input Score Verification

Use these hand-calculated reference cases. The score produced by the engine must match within ±1 point.

#### Reference Deal A — Strong Buy (expected score: ~78)
```
Asking price:     $750,000
Units:            4
Gross annual rent: $96,000
Operating expenses (annual):
  - Property tax:   $8,500
  - Insurance:      $3,200
  - Maintenance:    $6,400
  - Management (8%): $7,680
  - Vacancy (5%):   $4,800
  Total expenses:  $30,580
Interest rate:    7.25%
Down payment:     25% = $187,500
Loan amount:      $562,500
Year built:       1992
Neighborhood:     B+
```

**Expected calculations:**
```
NOI = $96,000 × 0.95 − $30,580 = $91,200 − $30,580 = $60,620
Cap Rate = $60,620 / $750,000 = 8.08%
Monthly payment (30yr, 7.25%) = $3,838
Annual debt service = $46,056
DSCR = $60,620 / $46,056 = 1.32
Annual cash flow = $60,620 − $46,056 = $14,564
Total cash invested = $187,500 + $187,500×0.014 (closing) = $190,125
CoC = $14,564 / $190,125 = 7.66%
GRM = $750,000 / $96,000 = 7.81×
Price/Unit = $750,000 / 4 = $187,500
```

**Expected score breakdown:**
| Metric | Raw value | Score /100 | Weight | Contribution |
|---|---|---|---|---|
| CoC | 7.66% | 64 | 25% | 16.0 |
| Cap Rate | 8.08% | 95 | 20% | 19.0 |
| DSCR | 1.32 | 65 | 20% | 13.0 |
| GRM | 7.81× | 90 | 10% | 9.0 |
| Price/Unit | $187.5K | 80 | 10% | 8.0 |
| NOI | $60,620 | 40 | 5% | 2.0 |
| CapEx | 1992 build | 70 | 5% | 3.5 |
| Neighborhood | B+ | 75 | 5% | 3.75 |
| **Total** | | | | **74.3 → ~78** |

**Pass criteria:** Score ≥ 70, Signal = "Strong Buy" or "Buy"

---

#### Reference Deal B — Pass (expected score: ~38)
```
Asking price:     $1,200,000
Units:            3
Gross annual rent: $72,000
Operating expenses: $28,000
Interest rate:    7.25%
Down payment:     25%
Year built:       1910
Neighborhood:     C
```

**Expected calculations:**
```
NOI = $72,000 × 0.95 − $28,000 = $40,400
Cap Rate = $40,400 / $1,200,000 = 3.37%
Monthly payment (30yr, 7.25%) = $6,149
Annual debt service = $73,788
DSCR = $40,400 / $73,788 = 0.55  ← cannot service debt
CoC = ($40,400 − $73,788) / $318,000 = −10.5%  ← negative
GRM = $1,200,000 / $72,000 = 16.7×
Price/Unit = $400,000
```

**Pass criteria:** Score ≤ 45, Signal = "Pass"

---

#### Reference Deal C — Watch (expected score: ~48)
```
Asking price:     $550,000
Units:            3
Gross annual rent: $54,000
Operating expenses: $18,000
Interest rate:    7.25%
Down payment:     25%
Year built:       1965
Neighborhood:     B
```

**Pass criteria:** Score 45–59, Signal = "Watch"

---

### 1.2 Score Normalization Tests

Each metric is scored 0–100 before weighting. Verify normalization is correct:

| Test | Input | Expected raw score |
|---|---|---|
| CoC at exactly 8% | CoC = 8.0% | Should be exactly 67 (2/3 of max) or the threshold value |
| CoC at 12% (above target) | CoC = 12.0% | Should be 100 or capped at 100 |
| CoC at 0% | CoC = 0% | Should be 0 |
| CoC negative (−5%) | CoC = −5.0% | Should be 0, not negative |
| Cap Rate at threshold (6.5%) | Cap = 6.5% | Should match defined threshold score |
| DSCR below 1.0 | DSCR = 0.85 | Should score very low (< 20) |
| DSCR above 1.5 | DSCR = 1.5 | Should score high (> 85) |
| GRM above 15× | GRM = 16 | Should be 0 or near 0 |
| GRM below 6× | GRM = 5 | Should be 100 |

---

### 1.3 Signal Threshold Tests

| Score | Expected signal |
|---|---|
| 75 | Strong Buy |
| 74 | Buy |
| 60 | Buy |
| 59 | Watch |
| 45 | Watch |
| 44 | Pass |
| 0 | Pass |
| 100 | Strong Buy |

---

### 1.4 Scoring Consistency

**Test:** Score the same deal 10 times in rapid succession.
**Expected:** All 10 scores are identical — scoring is deterministic.

**Test:** Score the same deal at two different times (no input changes).
**Expected:** Score does not drift. Scoring must not use random components.

---

## 2. Financial Calculation Accuracy

### 2.1 Mortgage Payment Calculation

The standard amortization formula: `P × r(1+r)^n / ((1+r)^n − 1)`

| Loan | Rate | Term | Expected payment |
|---|---|---|---|
| $500,000 | 7.25% | 30yr | $3,412/mo |
| $750,000 | 7.25% | 30yr | $5,118/mo |
| $1,000,000 | 7.25% | 30yr | $6,824/mo |
| $500,000 | 8.00% | 30yr | $3,669/mo |
| $500,000 | 6.00% | 30yr | $2,998/mo |

**Verify** the engine's payment calculations match these within $1.

---

### 2.2 NOI Calculation

```
NOI = (Gross Rent × (1 − vacancy%)) − Operating Expenses
```

| Gross Rent | Vacancy | Expenses | Expected NOI |
|---|---|---|---|
| $120,000 | 5% | $35,000 | $79,000 |
| $60,000 | 5% | $20,000 | $37,000 |
| $96,000 | 0% | $30,000 | $66,000 |
| $96,000 | 10% | $30,000 | $56,400 |

---

### 2.3 DSCR Boundary Cases

| NOI | Annual Debt Service | Expected DSCR | Lending status |
|---|---|---|---|
| $60,000 | $48,000 | 1.25 | Exactly at minimum |
| $60,000 | $60,000 | 1.00 | Break-even, lender will decline |
| $60,000 | $80,000 | 0.75 | Property loses money |
| $80,000 | $48,000 | 1.67 | Healthy |

---

### 2.4 Cash-on-Cash Calculation

```
CoC = (NOI − Annual Debt Service) / Total Cash Invested × 100
```

Total Cash Invested = Down Payment + Closing Costs (1.4% of purchase price)

| Purchase | Down% | NOI | Debt Service | Expected CoC |
|---|---|---|---|---|
| $800,000 | 25% | $60,000 | $48,000 | ($60K−$48K) / ($200K+$11.2K) = 5.68% |
| $600,000 | 25% | $48,000 | $36,720 | $11,280 / $158,400 = 7.12% |

---

### 2.5 GRM Calculation

```
GRM = Asking Price / Annual Gross Rent
```

| Price | Rent | Expected GRM |
|---|---|---|
| $800,000 | $96,000 | 8.33× |
| $500,000 | $60,000 | 8.33× |
| $1,200,000 | $72,000 | 16.67× |

---

### 2.6 Edge Cases in Financial Math

| Test | Input | Expected behavior |
|---|---|---|
| Zero units | units = 0 | Error or null score, not divide-by-zero crash |
| Zero rent | grossRent = 0 | Score = 0, Signal = Pass |
| Zero asking price | askingPrice = 0 | Error or null score |
| Negative cash flow | CoC = −15% | CoC score = 0, not negative |
| Very low interest rate | rate = 1% | Score should be high — DSCR well above 1.25 |
| Very high interest rate | rate = 15% | Score should be low — most deals fail DSCR |

---

## 3. Deal Feed Integrity

### 3.1 Feed Sorting

**Test:** Request the feed without sort parameter.
**Expected:** Deals returned in descending score order (highest first).

```bash
curl https://api.roofrank.io/api/feed \
  -H "Authorization: Bearer TOKEN" | \
  python3 -c "import json,sys; f=json.load(sys.stdin)['data']; 
  scores=[d['rankScore'] for d in f]; 
  print('SORTED' if scores == sorted(scores, reverse=True) else 'NOT SORTED', scores[:5])"
```

**Test:** Sort by `cap_rate` descending.
**Expected:** Each deal's capRate ≥ the next deal's capRate.

**Test:** Sort by `days_on_market` ascending.
**Expected:** Freshest listings first.

---

### 3.2 Feed Filtering

| Filter | Expected result |
|---|---|
| `?city=Boston` | All returned deals have city = "Boston" |
| `?signal=strong_buy` | All returned deals have score ≥ 75 |
| `?signal=pass` | All returned deals have score < 45 |
| `?units_min=3` | All returned deals have units ≥ 3 |
| `?units_max=4` | All returned deals have units ≤ 4 |
| `?price_max=500000` | All returned deals have askingPrice ≤ 500000 |
| `?city=Boston&signal=buy` | All deals are in Boston AND score 60–74 |

---

### 3.3 Feed Data Completeness

For every deal returned, verify these fields are present and non-null:

```
id, address, city, state, zipCode, units, propertyType,
yearBuilt, askingPrice, rankScore, reportData.signal,
reportData.financials.capRate, reportData.financials.cashOnCashReturn,
reportData.financials.dscr, reportData.financials.grm,
reportData.financials.noi, reportData.financials.pricePerUnit
```

**Test:** Request 26 seed deals and check all have complete financial data.

---

### 3.4 Feed Score Distribution

After seeding or ingestion, verify the score distribution is realistic:

| Signal | Expected % of deals | Too suspicious if... |
|---|---|---|
| Strong Buy | 5–20% | > 50% (scores inflated) or 0% (scores deflated) |
| Buy | 15–30% | |
| Watch | 20–35% | |
| Pass | 30–50% | > 80% (scoring too strict) |

---

### 3.5 Market Stats Endpoint

```bash
curl https://api.roofrank.io/api/feed/stats/markets \
  -H "Authorization: Bearer TOKEN"
```

**Expected:** Returns object with all 9 markets. Each market has:
- `totalDeals` — integer > 0
- `avgScore` — float between 0–100
- `strongBuys` — integer ≥ 0
- `avgCapRate` — float between 3–12

**Test:** `avgScore` for all markets is between 25–75. Outliers (< 10 or > 90) indicate a scoring bug.

---

## 4. Ingestion Pipeline

### 4.1 RentCast Data Ingestion (when activated)

**Test:** Trigger a manual ingestion run. Verify:

1. Log shows `[Ingestion] Starting nightly sweep...`
2. Log shows each market being fetched
3. Log shows total listings fetched per market
4. Log shows `[Ingestion] Scored X deals` with X > 0
5. DB row count in `listings` table increases
6. All new listings have `last_scored_at` within the last 5 minutes

**Verify data quality from RentCast:**
```sql
-- Check for nulls in critical fields
SELECT COUNT(*) FROM listings WHERE asking_price IS NULL;
SELECT COUNT(*) FROM listings WHERE rank_score IS NULL;
SELECT COUNT(*) FROM listings WHERE units IS NULL;

-- Check for unrealistic values
SELECT * FROM listings WHERE asking_price < 50000;
SELECT * FROM listings WHERE asking_price > 10000000;
SELECT * FROM listings WHERE units > 20;
SELECT * FROM listings WHERE rank_score > 100 OR rank_score < 0;
```

---

### 4.2 Score Recalculation on Re-ingestion

**Test:** Run ingestion twice on the same listing (same `fid`).
**Expected:** 
- DB record is updated (upsert), not duplicated
- Score is recalculated, not cached from first run
- `last_scored_at` is updated to the newer timestamp

---

### 4.3 Market Coverage

After ingestion, verify all 9 markets have listings:

```sql
SELECT city, COUNT(*) as deals, AVG(rank_score) as avg_score
FROM listings
GROUP BY city
ORDER BY city;
```

**Expected:** All 9 cities appear with at least 1 deal each.

---

### 4.4 Stale Listing Removal

**Test:** A listing that was active last week but is no longer returned by RentCast (sold or delisted).
**Expected:** The listing should be marked inactive or removed from the feed, not left stale.

Check: Is there a `status` or `active` field? Is it being set to inactive on re-ingestion?

---

## 5. Authentication & Authorization

### 5.1 Registration

| Test | Input | Expected |
|---|---|---|
| Valid registration | name, email, password | 201, access + refresh tokens returned |
| Duplicate email | existing email | 409 Conflict |
| Invalid email format | `notanemail` | 400 Bad Request |
| Weak password | `abc` | 400 Bad Request |
| Missing fields | no email | 400 Bad Request |
| SQL injection attempt | `'; DROP TABLE users; --` | 400, no DB error |
| XSS in name field | `<script>alert(1)</script>` | Stored safely, not executed |

---

### 5.2 Login

| Test | Input | Expected |
|---|---|---|
| Valid credentials | correct email + password | 200, tokens returned |
| Wrong password | correct email, wrong password | 401 Unauthorized |
| Non-existent email | unknown@test.com | 401 (do not reveal user existence) |
| Empty password | correct email, no password | 400 |
| Rate limiting | 10 failed logins in a row | 429 Too Many Requests |

---

### 5.3 JWT Token Handling

| Test | Expected |
|---|---|
| Access token expires after 15 min | 401 on next request |
| Refresh token still valid after access expires | `/auth/refresh` returns new access token |
| Refresh token used twice | Second use returns 401 (token rotation) |
| Manipulated JWT (altered payload) | 401 Unauthorized |
| No Authorization header | 401 Unauthorized |
| Malformed token `Bearer notajwt` | 401 Unauthorized |

---

### 5.4 Authorization (Plan-gating)

| Test | User plan | Endpoint | Expected |
|---|---|---|---|
| Free user accesses all markets | Starter | GET /feed?city=Providence | 200 (browse only) |
| Free user generates > 10 reports | Starter | POST /reports/generate | 403 after 10th |
| Pro user accesses all markets | Pro | GET /feed | 200 all 9 markets |
| Pro user receives Strong Buy alerts | Pro | (email) | Alert email sent |
| Starter user tries to access another org's data | Starter | GET /orgs/:otherId | 403 Forbidden |

---

## 6. API Contract Tests

### 6.1 GET /api/feed

```bash
curl -s https://api.roofrank.io/api/feed \
  -H "Authorization: Bearer TOKEN" | \
  python3 -c "
import json, sys
data = json.load(sys.stdin)
assert 'data' in data, 'Missing data key'
assert 'total' in data, 'Missing total key'
assert isinstance(data['data'], list), 'data not array'
if data['data']:
    d = data['data'][0]
    required = ['id','address','city','state','units','askingPrice','rankScore','reportData']
    for f in required:
        assert f in d, f'Missing field: {f}'
    assert 'signal' in d['reportData'], 'Missing signal'
    assert 'financials' in d['reportData'], 'Missing financials'
    fin = d['reportData']['financials']
    for f in ['capRate','cashOnCashReturn','dscr','grm','noi','pricePerUnit']:
        assert f in fin, f'Missing financial field: {f}'
print('PASS — all fields present')
"
```

---

### 6.2 GET /api/feed/:id

| Test | Expected |
|---|---|
| Valid UUID | 200, full deal object |
| Non-existent UUID | 404 Not Found |
| Malformed UUID | 400 or 404 |
| Valid UUID, no auth | 401 |

---

### 6.3 Response Time SLA

| Endpoint | Max acceptable response time |
|---|---|
| GET /health | < 100ms |
| GET /api/feed | < 500ms (cached), < 2000ms (cold) |
| GET /api/feed/:id | < 300ms |
| POST /api/auth/login | < 800ms |
| POST /api/reports/generate | < 5000ms |

**Test:** Run each endpoint 10 times and verify p95 latency is within SLA.

---

### 6.4 Error Response Format

All errors must return consistent JSON:
```json
{
  "error": "Human readable message",
  "code": "MACHINE_READABLE_CODE"
}
```

**Test:** Trigger a 404, 400, 401, 403, and 500. Verify all return this format, not raw Express error messages.

---

## 7. Frontend User Flows

### 7.1 Onboarding Flow

| Step | Action | Expected |
|---|---|---|
| Step 1 | Enter name and click Next | Proceeds to Step 2 |
| Step 1 | Click Next with empty name | Error shown, does not proceed |
| Step 2 | Click "Try a Boston example" | Freeman St pre-fills, score animation runs |
| Step 2 | Enter own address, press Enter | runScore() called, result card appears |
| Step 2 | Click "Skip, show me the feed" | Navigates directly to dashboard |
| Step 2 score | Score ring animates from 0 | Ring fills to correct score over ~1.2s |
| Step 2 result | Feed count shows | "We found X deals that score higher" |
| Step 3 | Select investing goal | Card highlights, can proceed |
| Step 4 | Click "Go to my feed" | Navigates to dashboard |
| Full flow | Complete all 4 steps | User is saved, org is saved, redirected to dashboard |

---

### 7.2 Dashboard

| Test | Expected |
|---|---|
| Page load | Deal cards appear, scores visible |
| Cards sorted by score | Highest score at top |
| "Deal of the Day" | Top-scoring deal shown in elevated card at top |
| Pulse dots | Green dot on listings ≤ 2 days old, amber ≤ 5 days |
| "New since last visit" | Divider appears between new and previously seen deals |
| Percentile badge | Shown on deals in top 30% of scores |
| Click a deal card | Navigates to deal detail with correct `?fid=` param |
| sessionStorage | Deal data stored as `rr_deal_{fid}` on card click |
| Market filter | Only selected city's deals shown |
| Search | Matching address deals shown |

---

### 7.3 Login / Auth

| Test | Expected |
|---|---|
| Login with valid credentials | Redirects to dashboard |
| Login with wrong password | Error message shown |
| Login redirects if already logged in | Already on dashboard, not shown login |
| Token expiry during session | Silent refresh, user not logged out |
| Logout | Tokens cleared, redirected to login |
| Create account | Redirects to onboarding |

---

## 8. Deal Detail Page

### 8.1 Data Accuracy on Detail Page

This is the most investor-critical page. Every number must match the scoring engine output.

| Field | Verification method |
|---|---|
| Score ring number | Must match `rankScore` in API response |
| Signal badge | Must match `reportData.signal` |
| CoC tile | Must match `reportData.financials.cashOnCashReturn` |
| Cap Rate tile | Must match `reportData.financials.capRate` |
| DSCR tile | Must match `reportData.financials.dscr` |
| GRM tile | Must match `reportData.financials.grm` |
| Ask Price | Must match `askingPrice` in API response |
| Down Payment | Must be exactly 25% of askingPrice |
| Monthly Gross Rent | Must be `grossRentalIncome / 12` |
| Annual Gross Rent | Must match `grossRentalIncome` |
| NOI | Must match `reportData.financials.noi` |
| Monthly Cash Flow | Must match `monthlyCashFlow` |

**Test:** Open 5 different deals. For each, manually verify every financial figure against the API response using DevTools Network tab.

---

### 8.2 Narrative Accuracy

| Test | Input | Expected narrative |
|---|---|---|
| Below-market PPU | PPU < market avg | "paying below market average" |
| Above-market PPU | PPU > market avg | "at market rate" or "above market" |
| Above-market cap rate | Cap > avg | "X% above the [city] average" (green) |
| Below-market cap rate | Cap < avg | "X% below the [city] average" (red) |
| Pre-1940 building | yearBuilt < 1940 | CapEx warning shown |
| Post-1990 building | yearBuilt > 1990 | No CapEx warning |
| DSCR < 1.1 | dscr = 1.05 | DSCR warning: "tight — lenders require 1.25" |
| DSCR > 1.35 | dscr = 1.42 | DSCR positive: "solid cushion" |

---

### 8.3 Market Comparison Table

For a Boston deal, the comparison averages used must be:
```
Cap Rate avg: 5.8%
CoC avg:      4.2%
PPU avg:      $380K
DSCR avg:     1.12
```

**Test:** Verify win/lose coloring is correct:
- Green if this deal beats the average
- Red if this deal is worse than the average
- Cap Rate, CoC, DSCR: higher is better
- Price/Unit: lower is better (buying cheap)

---

### 8.4 "What Would Make This a Strong Buy?" Card

| Test | Expected |
|---|---|
| Deal already scores ≥ 75 | Card says "Already a Strong Buy" |
| Deal scores < 75 | Shows target price and reduction needed |
| Target price calculation | NOI / 0.08 = max price for Strong Buy cap rate |
| Reduction % | `(askingPrice − targetPrice) / askingPrice × 100` |

**Verify math:** For a deal with NOI = $48,000 and asking price = $800,000:
- Target price = $48,000 / 0.08 = $600,000
- Reduction needed = $200,000 (25%)

---

### 8.5 Make An Offer Calculator

| Test | Input | Expected |
|---|---|---|
| Default inputs | target=75, down=25%, rate=7.25% | Max offer calculated correctly |
| Change target to 80 | target=80 | Max offer decreases (harder to hit) |
| Change down to 30% | down=30% | Max offer changes, CoC changes |
| Change rate to 8% | rate=8% | DSCR and CoC drop, max offer drops |
| Projected CoC | at max offer | Should be near target CoC |
| Projected DSCR | at max offer | Should be ≥ 1.25 |
| vs. asking price | max < asking | Shows "below asking" in green |
| vs. asking price | max > asking | Shows "above asking" in amber |

---

## 9. Analyzer Accuracy

### 9.1 Live Calculation Verification

Enter these known inputs and verify output:

```
Purchase price:  $650,000
Gross rent/mo:   $6,500
Annual expenses: $22,000
Interest rate:   7.25%
Down payment:    25%
```

**Expected outputs:**
```
Annual rent:         $78,000
Vacancy loss (5%):   $3,900
Effective gross:     $74,100
NOI:                 $74,100 − $22,000 = $52,100
Monthly payment:     $3,329
Annual debt service: $39,948
Annual cash flow:    $52,100 − $39,948 = $12,152
Monthly cash flow:   $1,013
Total cash in:       $162,500 + $9,100 (closing) = $171,600
CoC:                 $12,152 / $171,600 = 7.08%
Cap Rate:            $52,100 / $650,000 = 8.02%
DSCR:                $52,100 / $39,948 = 1.30×
GRM:                 $650,000 / $78,000 = 8.33×
```

**Pass criteria:** All figures match within 1%.

---

### 9.2 Stress Test Toggle

**Test:** With base rate 7.25%, toggle "What if rates hit 8%?"
**Expected:** 
- Monthly payment increases
- DSCR decreases
- CoC decreases
- Score decreases (not increases)
- The delta shown is directionally correct

**Test:** Rate stress to 9%.
**Expected:** For the reference deal above — DSCR drops from 1.30 to ~1.15 at 9%.

---

### 9.3 Scenario Comparison

**Test:** Run base scenario, then change price −10% in negotiated scenario.
**Expected:** 
- Negotiated CoC > Base CoC
- Negotiated DSCR > Base DSCR
- Negotiated Cap Rate > Base Cap Rate (same NOI, lower price)
- Negotiated score > Base score

---

## 10. Watchlist & Reports

### 10.1 Watchlist

| Test | Expected |
|---|---|
| Save a deal | Deal appears in watchlist |
| Save same deal twice | Only one entry (idempotent) |
| Unsave a deal | Deal removed from watchlist |
| Watchlist persists on refresh | Saved state maintained |
| Different user sees different watchlist | User A's saves not visible to User B |
| Watchlist deal detail | Clicking opens correct deal |

---

### 10.2 Reports

| Test | Expected |
|---|---|
| Generate report | Report saved, appears in list |
| Report contains all financial data | No null fields |
| Report timestamp | `created_at` is within last minute |
| Free user hits 10-report limit | 403 on 11th generation |
| Report for non-existent deal | 404 |
| Two reports for same deal | Both saved separately |

---

## 11. Billing & Subscriptions

### 11.1 Stripe Checkout (when live)

| Test | Expected |
|---|---|
| Click "Upgrade to Pro" | Redirects to Stripe Checkout |
| Complete payment (test card 4242...) | Webhook fires, plan upgrades to Pro |
| Fail payment (test card 4000...0002) | Plan remains on Starter |
| Cancel checkout | Returns to pricing page, no change |

---

### 11.2 Plan Limits

| Test | Plan | Expected |
|---|---|---|
| 11th report | Starter | 403 with upgrade prompt |
| Strong Buy email | Pro | Email received |
| Strong Buy email | Starter | Email NOT received |
| 6th market access | Essentials (3 markets) | 403 |

---

## 12. Edge Cases & Boundary Conditions

### 12.1 Unusual Property Data

| Scenario | Expected behavior |
|---|---|
| 1-unit property (not a multifamily) | Still scored, marked as single family |
| 10-unit building | Scored correctly, PPU reflects 10 units |
| Brand new building (built this year) | High CapEx score (no deferred maintenance) |
| Very old building (built 1880) | CapEx score very low, warning in narrative |
| Zero days on market | Pulse dot, no division by zero |
| 999 days on market | No pulse dot, shown as stale |
| Missing zip code | Deal shown without zip, no crash |
| Non-NE market (e.g. Miami, FL) | Scored correctly even without NE market avg |

---

### 12.2 Extreme Prices

| Scenario | Expected |
|---|---|
| $50,000 property | Scored normally, PPU very low → high score |
| $5,000,000 property | Scored normally, PPU very high → low score |
| $0 asking price | Error handled gracefully, not shown in feed |

---

### 12.3 Concurrent Requests

**Test:** Send 50 simultaneous requests to `GET /api/feed`.
**Expected:** All return 200 with correct data. No race conditions on Redis cache.

---

### 12.4 Session Handling

| Test | Expected |
|---|---|
| Navigate back from deal detail | Dashboard state preserved (scroll position) |
| sessionStorage missing (direct URL access) | Falls back to API call |
| sessionStorage stale (deal re-scored) | Old data shown, not critical but noted |
| Open deal in new tab (no sessionStorage) | API fetch, correct data shown |

---

## 13. Performance

### 13.1 Feed Load Time

**Baseline:** Measure with 26 seed deals.
**Target:** GET /api/feed < 200ms (cache hit), < 1500ms (cold).

```bash
for i in {1..10}; do
  time curl -s https://api.roofrank.io/api/feed \
    -H "Authorization: Bearer TOKEN" > /dev/null
done
```

---

### 13.2 Deal Detail Load Time

**Target:** GET /api/feed/:id < 200ms.

---

### 13.3 Scoring Engine Performance

**Target:** Score a single deal in < 50ms.
**Target:** Score 100 deals (full ingestion sweep) in < 30 seconds.

---

### 13.4 Dashboard Render Time

**Test:** Open dashboard with Chrome DevTools → Performance tab.
**Target:** Time to First Contentful Paint < 1.5s on a standard connection.

---

## 14. Security

### 14.1 IDOR (Insecure Direct Object Reference)

**Test:** User A saves a deal (gets watchlist item ID). User B uses that ID in `/api/watchlist/{id}`.
**Expected:** 403 Forbidden — users cannot access other users' data.

**Test:** User A generates a report (gets report ID). User B GETs `/api/reports/{id}`.
**Expected:** 403 Forbidden.

---

### 14.2 Injection

| Test | Expected |
|---|---|
| SQL injection in search: `' OR 1=1 --` | 400 or empty results, no DB error |
| XSS in address field | Stored as text, not executed in browser |
| Very long string (10KB) in any text field | 400 or truncated, no crash |

---

### 14.3 Authentication Bypass

| Test | Expected |
|---|---|
| Access /api/feed with no token | 401 |
| Access /api/feed with expired token | 401 |
| Access /api/feed with another user's valid token | 200 but only their data |
| Modify JWT payload (change userId) | 401 — signature invalid |

---

### 14.4 Rate Limiting

**Test:** Send 200 requests to `/api/auth/login` in 60 seconds.
**Expected:** 429 responses after the rate limit threshold is hit.

---

## Test Execution Checklist

### Before Every Deploy
- [ ] Run Reference Deal A through scoring engine — score within ±1 of expected
- [ ] Run Reference Deal B through scoring engine — score < 45
- [ ] Verify `GET /health` returns 200
- [ ] Verify `GET /api/feed` returns data with correct field structure
- [ ] Verify login flow works end-to-end

### After Every Ingestion Run (when RentCast activated)
- [ ] Check log: no ERROR lines
- [ ] Verify deal count increased in DB
- [ ] Verify score distribution is within expected ranges
- [ ] Check for null scores or impossible values (score > 100, negative prices)
- [ ] Verify all 9 markets have new listings

### Weekly
- [ ] Open 5 random deals on production, manually verify every financial figure
- [ ] Check CloudWatch for any 5xx errors
- [ ] Verify nightly job ran at 2am (check CloudWatch logs)
- [ ] Check that no deal has a score that changed by > 10 points without a price change

---

## Known Data Quality Risks

| Risk | Severity | Mitigation |
|---|---|---|
| RentCast returns incorrect rent estimates | High | Cross-check against ATTOM rent comps. Flag deals where rent estimate > 150% of market median. |
| ATTOM neighborhood grade is stale | Medium | Grades are updated quarterly. Show grade age in deal detail. |
| Asking price changes after scoring | High | Re-score on each ingestion. Show "score updated X hours ago". |
| Interest rate hardcoded at 7.25% | High | Update manually when rates move > 0.5%. Add admin endpoint to update globally. |
| Vacancy rate hardcoded at 5% | Medium | May not reflect local market. Consider market-specific vacancy rates. |
| CapEx scoring is age-based only | Medium | Ignores recent renovations. Eventually source from ATTOM permit data. |
| Seed data has no real market comparables | Medium | Once RentCast is live, market averages in deal narrative will need to be dynamically computed, not hardcoded. |

