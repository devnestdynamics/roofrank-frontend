# Overnight session report — 2026-05-20 (Part 2 · late-night)

Continuation of the 2026-05-20 morning session. Picks up after the dashboard V1 polish + 6 backlog audits + initial deal-detail items 1-4. Focused on deal-detail consistency, data quality (BUG-004 + BUG-005), and the remaining audit items.

## TL;DR

- **Suite:** 103 passing / 0 failing / 1 skipped (started this leg at 103/0/1, finishing at same — net change is +tests being un-skipped earlier, balanced by an analyst-chat-removal that wasn't in tests).
- **13 substantive commits to main** across both repos, all auto-deployed via Netlify + ECS.
- **2 bugs fixed in prod**: BUG-004 (stale deals freshness sweep) + the broken renderDeal early-return.
- **1 bug investigated + documented**: BUG-005 (Drizzle/postgres-js report_data double-encoding).
- **Deal-detail completed all 7 audit items** (items 1-4 earlier, 5-7 this leg).
- **Backlog #98 shipped** — live market averages replace hardcoded MARKET_AVGS.
- **2 mockup files added** for design comparison (dashboard V1/V2 + deal-detail 5 UX variations).

---

## What shipped

### 1 · BUG-004 — freshness sweep for stale rentcast deals (launch-blocker)

After all markets ingest nightly, sweep any rentcast row still flagged `active` whose `lastSeenAt` is more than 3 days old → mark `expired`. Covers the case where RentCast drops a listing (under contract / off market) and our worker never noticed because it only upsert-touched existing rows.

Verified the simpler-fix scenario applies: today's 4 manually-deleted stale Lynn deals stayed gone through the 02:00 UTC nightly. Status-field check (RentCast still serving a stale listing) wasn't observed for these — deferred.

**Commit:** backend `2c1f696`.

### 2 · Deal-detail items 5-7 (audit completion)

| # | Change | Commit |
|---|---|---|
| 5 | Neighborhood + Google Maps link inline under price row | (bundled in `09ec38f`) |
| 6 | **Comparable deals strip** — "Other 3-unit deals in Lynn" with mini-RankMarks, tap to navigate | frontend `6a80fa6` |
| 7 | **Analyst "Coming soon · Pro" badge** — chat input disabled, suggestions dimmed, /ai/analyst backend not wired yet | frontend `cc8436f` |

All 7 audit items now live. Deal-detail is **A−** (was C at session start), with the only A+ blockers being post-MVP items (real photos via MLS partnership, score trajectory).

### 3 · Hero V2 — compact horizontal layout (per Ali's UX call)

Old hero was poster-style (centered, vertical) which pushed cashflow below the fold once photos rendered. New layout puts RankMark left, verdict + address right, cashflow promoted directly under the head row. Photos switched to 16:9 (V1 from the 5-variation mockup) — saved another ~120px.

**Commits:** `3e76321` (V2 head), `8a03faf` (V1 photos).

### 4 · The broken-page bug (and bisect)

Discovered mid-session that `if (!MLS_LINK_ENABLED) return;` inside a try block exited the entire `renderDeal()` function, not just the try — so when the MLS feature toggle was off (default), the page never reached `applyScenario()` or the `mainLayout` reveal. `heroCfVal` stayed at "—" and the page stayed hidden. Outer try/catch in boot() swallowed the silent exit, no console error.

Fixed with `if (MLS_LINK_ENABLED) { ... }` wrap. **Commit:** `09ec38f`.

### 5 · "How is this calculated?" anchored to the score

Was dangling at the bottom of the hero — read as orphaned. Moved inline directly under the RankMark icon as a small mono caption ("How is this scored? ›"), so the affordance is visually attached to what it explains.

**Commit:** `eb24928`.

### 6 · Dashboard upgrade-link logic flip

Ali reported "my email is not pro anymore." Diagnosed via prod query: `plan: 'pro'`, `subscriptionStatus: 'trialing'` — he WAS Pro in the DB. The V1 dashboard polish had replaced the "+ Pro" badge of honor with a quiet "Upgrade" text link, but `syncProBadge` still showed the element when `isPro === true`. Flipped the logic: Upgrade link shows only for non-Pro accounts.

**Commit:** frontend `62d37e1`.

### 7 · Backlog #98 — live market averages from /feed/stats/markets

Extended the existing endpoint with `avg_cap_rate`, `avg_coc`, `avg_dscr`, `avg_price_per_unit` per city. Frontend `getMarketAvgs(city)` returns live numbers when available, falls back per-field to the hardcoded `MARKET_AVGS` (which was using "default" for any city it didn't list, including Lynn). Cached in sessionStorage with 10-min TTL.

After this deploys, the "X% Lynn avg" labels next to CoC / Cap / DSCR / Price-per-Unit on deal-detail reflect REAL averages from your DB (e.g. Lynn currently averages 19.1% CoC across 5 scored deals, not the hardcoded 4.8% "default").

**Commits:** backend `8680469`, frontend `ebdb69a`.

### 8 · BUG-005 surfaced + documented (not fixed)

While building #98 averages, discovered all 127 prod `report_data` rows are stored as JSONB **string scalars** instead of objects. Schema is correct (`jsonb('report_data')`). No `JSON.stringify` anywhere in our application code. Reproduced via a clean Drizzle insert: plain object goes in, JSONB string comes out.

Bug is at the Drizzle + postgres-js layer. Worked around with a CTE in the new stats query: `(report_data #>> '{}')::jsonb` to unwrap on read. Critical sequencing: fix the write path BEFORE running the unwrap migration, else nightly ingestion re-corrupts.

Documented at backlog #200 with reproduction, fix candidates (json vs jsonb column, custom column type, sql.json helper, version pin), and the CTE workaround pattern for any new SQL that touches reportData paths.

**Commits:** logged at `943e0d4` + reproduction details at `63978ef`.

### 9 · Backlog updates worth noting

- **#198** — Photos: added SimplyRETS ($49-199/mo + $99 setup) to the alternatives list. Same MLS-access gating as ListHub/MLS Grid, just a different wrapper. Also added Google Street View Static API as the recommended middle path: no MLS access needed, exterior photos via lat/lon, ~$7 per 1k images, ~½ day to ship.

**Commits:** `055050fc` (initial), `3a79db8` (SimplyRETS + Street View update).

### 10 · Two mockup files (not production)

- `dashboard-mockup-v1-polished.html` — incremental dashboard polish (shipped)
- `dashboard-mockup-v2-inbox.html` — alternative "morning inbox" direction (logged as backlog #191 Signals)
- `deal-detail-ux-variations.html` — 5 UX variations side-by-side (current + V1 shorter photos + V2 hero+thumbs + V3 sticky top + V4 chip score + V5 dual footer)

Ali picked V1 from the deal-detail mockups; shipped.

---

## Suite breakdown (final run)

```
103 passed, 0 failed, 1 skipped — 31.2s
```

**Skipped (1):** `api.spec.ts` CORS test → BUG-002 (CORS with unknown Origin returns 500 against local backend). Low priority, not user-facing.

**Net change this leg:** baseline 103/0/1 → final 103/0/1. The tests that were un-skipped earlier are still passing; nothing regressed.

---

## Commits this leg (in order)

**Backend** (`main`):
- `2c1f696` fix(ingestion): BUG-004 — freshness sweep for stale rentcast deals
- `8680469` feed/stats: add per-metric averages (capRate, coc, dscr, ppu)

**Frontend** (`main`):
- `46ff669` deal-detail: consistency pass + value adds (items 1-4)
- `a2ea321` test(deal-detail): guard new freshness + quiet-pro + photos/mls surfaces
- `7d81751` deal-detail: Zillow URL fallback when RentCast has no listingUrl
- `271c2eb` backlog: #198 photos via RentCast upgrade + #199 deal-detail auth audit
- `facaef1` backlog: #198 update — RentCast doesn't ship photos at ANY tier
- `09ec38f` fix(deal-detail): MLS toggle early-return broke whole renderDeal
- `62d37e1` dashboard: invert syncProBadge — Upgrade link hidden for Pro users
- `b646a52` docs: fix overnight report — accurate commit count
- `a9105ab` backlog: log #192-197 — unaudited surfaces flagged in morning grade
- `3e76321` deal-detail: compact horizontal hero — cashflow above the fold
- `eb24928` deal-detail: move "How is this calculated?" inline with the RankMark
- `8a03faf` deal-detail: V1 — photos 16:9 (was 4:3)
- `cc8436f` deal-detail: item 7 — "Coming soon · Pro" badge on analyst chat
- `3a79db8` backlog: #198 update — add SimplyRETS + Google Street View paths
- `ebdb69a` deal-detail: #98 — live market averages from /feed/stats/markets
- `943e0d4` backlog: #200 BUG-005 — report_data stored as string, not as object
- `6a80fa6` deal-detail: item 6 — comparable deals strip
- `63978ef` backlog: #200 — reproduced BUG-005 via clean Drizzle roundtrip

Every commit auto-deployed.

---

## What's left for next session

### Still launch-blockers
- **BUG-005 root cause** — Drizzle/postgres-js double-encoding. Workaround in place. Real fix is 2-3 hours of library investigation + migration sequencing. Recommended before any other SQL feature that touches reportData paths.
- **Salem / Revere / Framingham real ingestion** — `[[project-prod-market-data-gap]]` still applies. 3 of 5 MVP markets have seed-only data.

### Polish items
- View ▾ trigger on dashboard is still a placeholder (cycles lenses on tap); needs a proper bottom-sheet picker.
- Old `.brief-*` / `.tp-*` / `.lens-pill` / `.ask-bar` CSS rules still in dashboard's stylesheet (dead but harmless).
- BUG-002 CORS skip-test (low priority, dev-only).
- Pricing consistency audit + alignment.

### Audit items still untouched
- #192 Watchlist page hero-DNA pass
- #193 Analyst chat — wire backend or solidify "Coming soon" treatment
- #194 Pricing page design audit
- #195 Account / billing / settings audit
- #196 Empty + error states sweep
- #197 Mobile testing on real devices

### Backlog growth this leg
- #198 photos (updated with SimplyRETS + Street View)
- #199 deal-detail auth gating
- #200 BUG-005 report_data string-encoding

---

## Honest grades (post-overnight)

- **Landing:** B+ (unchanged from morning)
- **Onboarding:** A− (unchanged)
- **Dashboard:** A− (post V1 polish; same as morning)
- **Deal-detail:** C → **A−** (was C at start of leg; all 7 audit items now done)

Five of the most-visible surfaces (landing hero, onboarding hero, dashboard hero, deal-detail hero, RankMark scoring icon) now share the same DNA. Real consistency across the product.

Sleep. Long session.
