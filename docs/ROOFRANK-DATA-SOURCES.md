# RoofRank — Data Sources

**Last updated:** May 2026

---

## Overview

RoofRank combines three data sources to score every multifamily listing. Each source contributes different data points to the scoring engine.

```
RentCast          →  Active listings, asking price, property type, days on market
HUD FMR           →  Rent estimates (utility-adjusted, by city + bedroom count)
ATTOM             →  Annual taxes, year built, neighborhood grade, owner info
Scoring Engine    →  PITI cash flow, cap rate, DSCR, GRM, CoC, price/unit
```

---

## 1. RentCast (Active Listings)

**Purpose:** Source of active for-sale listings  
**Plan:** Foundation ($74/mo, 1,000 calls/month)  
**API Key:** `efa8f38b08f84c68856ae07459ba6df7`  
**Endpoint:** `GET https://api.rentcast.io/v1/listings/sale`

**What we pull:**
| Field | RentCast field | Notes |
|---|---|---|
| Address | `formattedAddress` | Full address including city/state/zip |
| Asking price | `price` | Listed sale price |
| Property type | `propertyType` | We filter to `Multi-Family` only |
| Bedrooms | `bedrooms` | Total building bedrooms (not per unit) |
| Units | `units` | Number of units — preferred over ATTOM |
| Year built | `yearBuilt` | Used if ATTOM doesn't have it |
| Square footage | `squareFootage` | Used for price/SF calculation |
| Days on market | `daysOnMarket` | Used for pulse dots and badges |
| Latitude/Longitude | `latitude`, `longitude` | Used for ATTOM neighborhood lookup |
| MLS number | `mlsNumber` | Stored for reference |

**What we don't use from RentCast:**
- Rent estimates — replaced by HUD FMR (more accurate for NE working-class markets)
- Neighborhood data — from ATTOM instead

**Filtering logic:**
```typescript
// Only true multifamily — RentCast returns SFH and condos despite the filter
const ALLOWED_TYPES = ['multi-family', 'multi family', 'multifamily', 'duplex', 'triplex', 'quadruplex'];
// Also exclude unit addresses (condos): "Unit X", "Apt X", "#X", "Ste X"
```

**Current markets:** Lynn, MA (active). All other markets use seed data.  
**Call volume:** ~1 call per market per night = ~30 calls/month at 9 markets  
**Remaining calls:** ~970/month

---

## 2. HUD Fair Market Rents (Rent Estimates)

**Purpose:** Rent estimates per unit, by city and bedroom count  
**Cost:** Free — public government data  
**Source:** HUD FY2025/2026 Fair Market Rents + LHAND Payment Standards  
**File:** `src/lib/hud-fmr.ts` (hardcoded, no API call)

**What we use:**
| Field | Calculation | Notes |
|---|---|---|
| Monthly rent per unit | `FMR × 0.88` | 0.88 strips ~12% for utilities |
| Gross monthly rent | `rent per unit × units` | Total building rent |

**Why HUD FMR instead of RentCast rent estimates:**
- RentCast overestimates Lynn rents by ~30% ($3,400 vs $2,588 for 2BR)
- HUD FMR is set at 40th percentile — conservative but realistic
- FMR reflects actual achievable rents in working-class NE markets
- Free — saves ~17 API calls per ingestion run
- Updated annually each October

**Current FMR data (net of utilities, monthly per unit):**

| Market | Studio | 1BR | 2BR | 3BR | 4BR | Source |
|---|---|---|---|---|---|---|
| Lynn / Boston | $2,076 | $2,179 | $2,588 | $3,103 | $3,427 | LHAND 2026 |
| Worcester | $1,267 | $1,400 | $1,838 | $2,203 | $2,434 | HUD FY2026 |
| Lowell | $1,377 | $1,522 | $1,998 | $2,395 | $2,645 | HUD FY2026 |
| Manchester NH | $1,235 | $1,366 | $1,793 | $2,149 | $2,373 | HUD FY2026 |
| Providence RI | $1,192 | $1,292 | $1,565 | $1,891 | $2,343 | HUD FY2025 |
| Hartford CT | $1,132 | $1,300 | $1,641 | $1,968 | $2,233 | HUD FY2026 |
| New Haven CT | $1,207 | $1,400 | $1,733 | $2,141 | $2,527 | HUD FY2026 |
| Bridgeport CT | $1,584 | $1,716 | $2,024 | $2,464 | $2,816 | HUD FY2025 |
| Springfield MA | $836 | $924 | $1,188 | $1,452 | $1,672 | HUD FY2025 |

**Update schedule:** Annually in October when HUD publishes new FMRs.  
**Utility factor:** 0.88 (strips ~12% for heat, electric, water)

---

## 3. ATTOM (Property Enrichment)

**Purpose:** Tax data, year built confirmation, neighborhood grade  
**Plan:** Check attomdata.com for current plan  
**API Key:** `44e756f9c8939be4ee0cbcce4dcac7e1`  
**Endpoint:** `GET https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/basicprofile`

**Correct API format (confirmed working May 2026):**
```
address1 = street only (e.g. "105 Lawton Ave")
address2 = "City, State" (e.g. "Lynn, MA")
NO postalcode parameter
```

**What we pull:**
| Field | ATTOM field | Notes |
|---|---|---|
| Annual taxes | `assessment.tax.taxAmt` | Real tax amount (e.g. $6,699 for 105 Lawton) |
| Year built | `summary.yearBuilt` | Used for CapEx score |
| Neighborhood grade | `area.neighborhoodGrade` | A/B/C/D — currently returning B for all Lynn |
| Owner name | `assessment.owner.owner1.fullName` | Stored for reference |
| Assessed value | `assessment.assessed.assdTtlValue` | Stored for reference |

**What we DON'T use from ATTOM:**
- Unit count — ATTOM returns 1 for most multifamily. We use RentCast units instead.
- Square footage — sometimes inaccurate, use RentCast squareFootage
- Rent estimates — not available on our plan

**Fallbacks when ATTOM fails:**
```typescript
annualTaxes      = attom?.annualTaxes || listing.price × 0.012
yearBuilt        = attom?.yearBuilt   || listing.yearBuilt || 1980
neighborhoodGrade = attom?.neighborhoodGrade ?? 'B'
```

**Known issues:**
- Some addresses return "SuccessWithoutResult" — property not in ATTOM database (rare)
- Neighborhood grades all returning B for Lynn — may need different ATTOM endpoint
- ATTOM unit count unreliable for multifamily — do not use

**Call volume:** 1 call per listing per ingestion = ~16 calls per Lynn run

---

## 4. Scoring Engine (Internal)

**Purpose:** Computes all financial metrics and scores  
**File:** `src/lib/scoringEngine.ts`  
**Model:** PITI-only (mortgage + tax + insurance, no vacancy/maintenance)

**Computed metrics:**
| Metric | Formula | Weight |
|---|---|---|
| Cash-on-Cash | (Annual CF / Total Cash In) × 100 | 25% |
| Cap Rate | (NOI / Asking Price) × 100 | 20% |
| DSCR | NOI / Annual Debt Service | 20% |
| GRM | Asking Price / Annual Gross Rent | 10% |
| Price/Unit | Asking Price / Units | 10% |
| NOI | Gross Rent − Taxes − Insurance | 5% |
| CapEx Score | Based on year built (age) | 5% |
| Neighborhood | A/B/C/D from ATTOM | 5% |

**Current assumptions:**
- Interest rate: **6.5%** (updated May 2026 — update when rates move >0.5%)
- Down payment: **25%**
- Amortization: **30 years**
- Closing costs: **2%** (todo: update to 3.5% — backlog item 77)
- Vacancy: **0%** (PITI model — no vacancy deduction)

**Score signals:**
- ≥ 75: Strong Buy
- ≥ 60: Buy
- ≥ 45: Watch
- < 45: Pass

---

## 5. Data Flow Summary

```
Nightly at 2am (or manual trigger):
┌─────────────────────────────────────────────────────────┐
│ 1. RentCast API                                         │
│    → Fetch active Multi-Family listings by city         │
│    → Filter: propertyType must be Multi-Family variant  │
│    → Filter: no Unit/Apt/Ste in address                 │
│                                                         │
│ 2. HUD FMR (local lookup)                              │
│    → Get net rent per unit by city + bedrooms           │
│    → Multiply by RentCast unit count = gross rent       │
│                                                         │
│ 3. ATTOM API                                            │
│    → Get annual taxes, year built, neighborhood grade   │
│    → Falls back to estimates if ATTOM fails             │
│                                                         │
│ 4. Scoring Engine                                       │
│    → Compute PITI cash flow, cap rate, DSCR, etc.      │
│    → Score 0-100, assign signal                         │
│                                                         │
│ 5. Database upsert                                      │
│    → Insert new listings, update existing               │
│    → Score stored in reportData JSON column             │
└─────────────────────────────────────────────────────────┘
```

---

## 6. Known Data Quality Issues

| Issue | Impact | Status |
|---|---|---|
| ATTOM neighborhood grades all returning B for Lynn | Minor — all deals treated equally | Investigating |
| Large buildings (8+ units) get wrong bedroom/unit ratio | Scores inaccurate for big buildings | Accepted — not core market |
| RentCast returns SFH and condos under Multi-Family filter | Fixed — client-side filtering | ✅ Fixed |
| ATTOM unit count returns 1 for multifamily | Fixed — using RentCast units | ✅ Fixed |
| Interest rate hardcoded | Needs manual update when rates move | Backlog item 72 |
| Closing costs at 2% (too low for MA) | CoC slightly overstated | Backlog item 77 |

