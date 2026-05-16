# RoofRank — Data Flow

**Last updated:** May 16, 2026

How a deal becomes a scored entry in the feed, where every field comes from, what's cached, and what we refresh nightly.

---

## TL;DR — One paragraph

Every night at 2 AM ET, an ingestion job pulls active multi-family for-sale listings from **RentCast** for each of our markets. For every new or updated listing, we look up the property's official classification from **ATTOM** (`/property/detail` → `summary.proptype` → DUPLEX/TRIPLEX/QUADRUPLEX gives us the unit count), enrich it with year built, square footage, and neighborhood grade, and use **HUD Fair Market Rents** to estimate per-unit gross rent. We run those inputs through our scoring engine and store the score + signal in Postgres. ATTOM enrichment is cached per-deal for 30 days. The dashboard reads from Postgres — RentCast / ATTOM / HUD are never hit by the frontend.

---

## The data sources

| Source | What we get | Endpoint | Cost basis | Cache TTL |
|---|---|---|---|---|
| **RentCast** | Active sale listings: address, price, propertyType, daysOnMarket, listing status | `/v1/listings/sale` | Per-call; tier-based monthly quota | None — refreshed every ingestion run |
| **RentCast** | Property details: bedrooms, bathrooms, sqft, yearBuilt, lotSize, lastSale | `/v1/properties` | Same | Currently unused — wired but not called in ingestion (candidate for future cross-validation) |
| **ATTOM** | `summary.proptype` (DUPLEX/TRIPLEX/etc.), `assessment.tax.taxAmt`, `summary.yearBuilt`, `building.size.universalSize`, `building.unitCount.bldgUnitCnt` | `/propertyapi/v1.0.0/property/detail` | Per-call; quota-based | **30 days** (cached in `deal_feed.report_data.attom`) |
| **ATTOM** | Sales comps for the property | `/property/expandedprofile` | Same | 30 days (bundled with above cache) |
| **ATTOM** | Neighborhood profile → letter grade (A/B/C/D) | `/areaapi/areaprofile` | Same | 30 days (bundled) |
| **HUD FMR** | Fair Market Rent by city + bedroom count | Local static table in `src/lib/hud-fmr.ts` | $0 — federal data | Updated annually (October release) |
| **Anthropic Claude** | AI deal narratives + "Ask the Analyst" chat | Anthropic API | Per-token | Per-conversation in sessionStorage; narratives cached per-deal |

---

## The ingestion sequence

For one deal in one market, the steps:

```
                                ┌─────────────────────────┐
   nightly cron 2am ET   ───►   │  ingestMarket(market)   │
                                └────────┬────────────────┘
                                         │
                                         ▼
                              ┌─────────────────────┐
                              │  RentCast /listings │  ← only "Active" status, only our property types
                              │  pages of 50 each   │
                              └────────┬────────────┘
                                       │ filter to multifamily 2-6 unit
                                       ▼
                              ┌─────────────────────────┐
                              │  upsertListing(listing) │
                              └────────┬────────────────┘
                                       │
                       ┌───────────────┴───────────────┐
                       │ NEW (insert)              UPDATED (price/DOM change)
                       │                                │
                       ▼                                ▼
                ┌──────────────┐                 ┌──────────────┐
                │ Insert row   │                 │ Update price │
                │ units = null │                 │ + DOM + seen │
                └──────┬───────┘                 └──────┬───────┘
                       │                                │
                       └────────────────┬───────────────┘
                                        ▼
                              ┌─────────────────────────────────────┐
                              │  scoreListing(listing)              │
                              │                                     │
                              │  ┌──────────────────────────────┐   │
                              │  │  Read deal_feed.report_data  │   │
                              │  │  for cached attom + age      │   │
                              │  └─────────┬────────────────────┘   │
                              │            │                        │
                              │     ┌──────┴──────┐                 │
                              │   ≥30d           <30d               │
                              │     │              │                 │
                              │     ▼              ▼                 │
                              │  ATTOM API     cache hit             │
                              │  3 endpoints   (0 API calls)         │
                              │     │              │                 │
                              │     └──────┬───────┘                 │
                              │            ▼                         │
                              │  ┌──────────────────────────┐        │
                              │  │ enrichment.units?         │       │
                              │  │  yes → score              │       │
                              │  │  no  → skip listing       │       │
                              │  └─────────┬────────────────┘       │
                              │            ▼                         │
                              │  ┌──────────────────────────┐        │
                              │  │ HUD FMR by city + bd     │ ← bedroom-per-unit clamped [1,5]
                              │  │ → monthly rent per unit  │        │
                              │  └─────────┬────────────────┘       │
                              │            ▼                         │
                              │  ┌──────────────────────────┐        │
                              │  │ scoreProperty(input)     │ ← internal scoring math
                              │  │ → score, signal, metrics │        │
                              │  └─────────┬────────────────┘       │
                              │            ▼                         │
                              │  Write deal_feed row:                │
                              │    rank_score, units, year_built,    │
                              │    report_data { attom, ... }        │
                              └──────────────────────────────────────┘
                                        │
                                        ▼
                              ┌─────────────────────┐
                              │  notify watchers    │  ← push + email (per backlog)
                              │  if Strong Buy or   │
                              │  price drop         │
                              └─────────────────────┘
```

---

## What's cached vs. fetched fresh, per ingestion run

| Field | Per-run behavior | Why |
|---|---|---|
| `address`, `city`, `state`, `propertyType` | RentCast (fresh) | These come with the listing — cheap |
| `asking_price`, `days_on_market`, `status` (active/removed) | RentCast (fresh) | These change daily; fresh every run is the point |
| `units`, `proptype` | **ATTOM, 30d cached** | Building unit count doesn't change month-to-month |
| `year_built`, `square_feet` | **ATTOM, 30d cached** | Physically immutable |
| `neighborhood_grade` | **ATTOM, 30d cached** | Updates over years, not days |
| `annual_taxes` | **ATTOM, 30d cached** | Reassessed annually; 30d cache is conservative |
| `monthly_rent_per_unit` | HUD FMR (local table) | Federal data, refreshed annually |
| `rank_score`, all financials | Computed every run | Cheap; reflects any source-data change |
| AI narrative | Cached per session (frontend) | Anthropic API cost |

---

## Coverage today (May 16)

Across Lynn + Worcester (89 active multi-family listings):

| Bucket | Count | Why |
|---|---|---|
| Successfully scored (DUPLEX/TRIPLEX/QUADRUPLEX) | ~50 | ATTOM classified the property |
| Skipped — `APARTMENT` (5+ units, generic) | ~20 | Out of our 2-6 unit scope (likely correct) |
| Skipped — `OFFICE & RESIDENTIAL` / `RETAIL TRADE` / `VACANT` | ~5 | Mixed-use or non-residential |
| Skipped — `proptype = null` (ATTOM has no record) | ~15 | New construction or address-match miss |

**Open question:** are the `APARTMENT` deals all 5+ units (correctly skipped) or do some have 2-4 actual units that ATTOM mis-classified? Worth a sample audit — backlog item.

---

## Frontend → backend → data sources: the read path

The dashboard NEVER calls RentCast / ATTOM / HUD directly. It reads from Postgres via our API:

```
[Mobile/Web Frontend]
        │
        ▼
GET /api/feed
        │ JWT auth
        ▼
[Express backend]
        │
        ▼
SELECT * FROM deal_feed
WHERE status='active'
        │
        ▼
[Postgres — already-ingested + scored data]
```

The frontend only sees what the ingestion job has already computed. That means:
- Adding a new market = backend market-config change + manual ingest trigger
- Re-scoring with a new formula = redeploy backend + re-ingest
- A user-visible bug in "wrong score" almost always traces to ingestion data, not the API

---

## What we maintain / refresh

| What | Cadence | Mechanism | Operational ownership |
|---|---|---|---|
| Active listings | Nightly 2am ET | RentCast `/listings/sale` via BullMQ scheduled job | Auto |
| Listing prices, DOM | Nightly | Same path; upsertListing diffs against existing | Auto |
| Strong Buy email/push alerts | Triggered on detection in ingestion | `dispatchAlerts()` | Auto |
| Watchlist price-drop alerts | Triggered when price drops ≥$1K + ≥1% | Inside `upsertListing` | Auto |
| Building data (ATTOM) per deal | Every 30 days | Cache miss inside `scoreListing` | Auto |
| HUD FMR table | Annual (October) | Manual update to `src/lib/hud-fmr.ts` | Manual — calendar task |
| Adding a new market | One-time | Add row to `markets` table, manually trigger first ingest | Manual |
| Removing stale seed data per market | Per-market | `cleanSeedData.ts` script after real data validated | Manual |

---

## Known gaps + planned improvements

1. **"Skipped-no-cache" leak.** When ATTOM returns a result but we can't derive units (APARTMENT, OFFICE), we don't cache the negative result. Same address gets re-fetched every nightly run. Fix: cache the no-result too, with a shorter TTL (7d) so they get retried periodically without burning quota daily.

2. **RentCast `/properties` endpoint not in ingestion.** We have the function (`getPropertyDetails`) but don't call it. Could give us bedroom counts that don't suffer the absurd-99-bedrooms problem. Backlog candidate.

3. **APARTMENT-classified deals.** We're losing ~20% of inventory to ATTOM's generic "APARTMENT" label. Worth investigating whether ATTOM has the actual unit count in a different field, or whether these are genuinely 5+ units (out of scope).

4. **Address-match failures.** ~15% of listings hit `proptype=null` because ATTOM can't match the address format. Cases like `273 And 273r Euclid Ave` need normalization before the lookup.

5. **No price history.** When asking price drops, we update the current value but don't keep a price-history table. A `deal_price_history` table would unlock the "this deal has been listed 3 times" + price-aging UI.

6. **No primary photos.** RentCast strips them. We need a separate source (Google Street View, Mapbox static maps, or MLS partnership) per backlog #140.

7. **HUD FMR has gaps** for some smaller cities. We fall back to county-level or skip. Could be supplemented with private rent data per-market once volume justifies.

---

## File map

| File | What |
|---|---|
| `src/workers/ingestionWorker.ts` | The ingestion pipeline; `ingestMarket()`, `scoreListing()`, `upsertListing()` |
| `src/lib/rentcast.ts` | RentCast API wrapper — `getForSaleListings()`, `getPropertyDetails()`, `getMarketStats()` |
| `src/lib/attom.ts` | ATTOM API wrapper — `getPropertyDetail()`, `enrichListing()`, `unitsFromProptype()` |
| `src/lib/hud-fmr.ts` | Local HUD FMR lookup table |
| `src/lib/scoringEngine.ts` | The math: `scoreProperty(input)` |
| `src/scripts/auditUnits.ts` | Diagnostic — distribution of stored unit counts |
| `src/scripts/auditUnitsAttom.ts` | Diagnostic — what ATTOM data we've stored per deal |
| `src/scripts/reingestAll.ts` | One-shot — re-ingest every market currently in the feed |
| `src/db/schema.ts` | `deal_feed` table definition |

---

## Quick references for ops

**Run a one-off ingestion (after a scoring change):**
```bash
# locally with dev env
npx tsx src/scripts/reingestAll.ts

# in prod via ECS one-shot task
aws ecs run-task --cluster roofrank \
  --task-definition roofrank \
  --launch-type FARGATE \
  --network-configuration '...' \
  --overrides '{"containerOverrides":[{"name":"roofrank","command":["node","dist/scripts/reingestAll.js"]}]}'
```

**Audit current data quality:**
```bash
node dist/scripts/auditUnits.js         # unit-count distribution
node dist/scripts/auditUnitsAttom.js    # ATTOM coverage per deal
```

**Reset a market's data after a major schema change:**
```sql
-- careful: irreversible
DELETE FROM deal_feed WHERE source = 'rentcast' AND city = 'Worcester';
-- then run the ingestion script for Worcester
```
