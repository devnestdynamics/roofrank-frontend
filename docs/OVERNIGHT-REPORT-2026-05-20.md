# Overnight session report — 2026-05-20

## TL;DR

- **Suite:** 102 passing / 0 failing / 1 skipped (started at 99/0/3).
- **3 launch-blocker bugs fixed** (BUG-001 + BUG-003 + landing scoring inconsistency #190).
- **Dashboard V1 polish landed** — same simplification pattern that bumped onboarding from C to A− is now applied to the dashboard.
- **8 commits to main**, all auto-deployed via Netlify + ECS.
- **No prod data touched** overnight. Only code + tests.

---

## What shipped

### 1 · BUG-001 — `feed/:id` returns 404 instead of 500

Postgres threw `invalid-input-syntax` on non-UUID ids, bubbling as a 500 "Internal server error." Added `zod.string().uuid()` guard before the DB lookup. Stale or mistyped links now get a clean 404. The api.spec test that was waiting on this is un-skipped and passing.

**Commits:** backend `54e82e9` + `222a8ec`.

### 2 · BUG-003 — wrong-password no longer silently redirects (launch-blocker)

`apiFetch` in `api.js` intercepted every 401 with a hard redirect to the login page — including `/auth/login`'s own 401. Users typing the wrong password saw a silent page reload, looked broken. Gated the redirect on whether a token was actually attached (only authenticated calls trigger the redirect). Unauth'd 401s now fall through so `handleSignin` can call `showToast('Invalid email or password.')`. The auth.spec test that was waiting on this is un-skipped and passing.

**Commits:** frontend `912e56c`, backend `0ed38f1`.

### 3 · Backlog #190 — landing scoring section uses canonical RankMark

Landing's "Why X scored a Strong Buy" section was the last surface using `.metrics-verdict-mark` with hardcoded forest colors. Replaced with the canonical `.rmark` system (sb/buy/wat/pas tier classes). The JS swap fetcher now rotates both the rmark and the `.metrics-verdict` container's tier class. Lost the progressive floor-build animation; gained: **every score on every surface in the product now renders the same canonical RankMark.**

**Commit:** frontend `ca3553c`.

### 4 · Backlog #191 — "Signals" idea logged as post-MVP

Ali's idea overnight: take the V2 inbox mockup and ship it as its own feature ("almost like market news") rather than replacing the dashboard. Captured in backlog with naming options (recommend **Signals**), where it slots in the nav, what's on the screen, backend needs, cost estimate, and Pro gating. Could also become the body of the existing "daily 7am email" Pro feature.

**Commit:** frontend `55050fc`.

### 5 · Dashboard V1 polish (the big one) ⭐

10-item refactor of `roofrank-dashboard.html` per the locked-in design from yesterday. Same simplification pattern that took onboarding from C to A−, now on the daily-use dashboard:

| # | Change | Why |
|---|---|---|
| 1 | Hero card replaces dark .brief tile + today's-picks carousel | One focal block, no three visual languages competing |
| 2 | "Also worth opening" runner rows (positions 2-4) | Same DNA as the hero, just smaller |
| 3 | Lens pills → single View ▾ chip | Don't fight city chips for the same scroll real estate |
| 4 | "Rest of feed" rich cards (positions 5+, no PICK badges) | Picks live in the hero; badge was redundant |
| 5 | Ask-bar removed | Analyst is already a bottom-nav tab — dup'd entry ate 50px |
| 6 | Bottom nav 5 → 4 tabs (no center [+]) | Analyzer reachable via header [+], doesn't need the FAB |
| 7 | "+ Pro" pill → quiet "Upgrade" text-link | Daily users converted or didn't — don't shout |
| 8 | Hero brief copy via new `buildHeroAnalystLine()` | Action-first, not editorial prose |
| 9 | Freshness signal in hero (pulsing dot + Freddie rate) | Same pattern as onboarding hero |
| 10 | Unified verdict class suffixes (sb/buy/wat/pas) | Shared CSS across dashboard + onboarding |

Hero + runners are driven by the lens-filtered pool, so switching lenses updates the hero too — the wow always reflects the current view.

**New regression guard:** `feed.spec.ts` now asserts the new surfaces exist AND the old ones (briefSection, todaysPicksSection, lensRow, ask-bar, bn-add-fab, rh-pro, .dpick) stay dead, with zero console errors. So future commits can't accidentally re-introduce the busy version.

**Commits:** frontend `e1c77b0`, backend `a6b61ac`.

### 6 · City missing on dashboard cards (Ali flagged late in session)

Hero, runner rows, and rich rest-of-feed cards weren't reliably showing city. Three causes: (1) rich-card text-ellipsis hid the city on long addresses, (2) hero/runner used `.split(',').slice(0,2)` with no fallback for seed deals (which ship with just the street name), (3) the rich card's meta line duplicated city, hiding the issue. New `shortAddr(d)` helper handles both real ("Street, City, State Zip") and seed ("Street" + separate `d.city`) formats. Rich card's meta line dropped the redundant city repeat.

**Commit:** frontend `0c30c1d`.

---

## Suite breakdown (final run)

```
102 passed, 0 failed, 1 skipped — 32.2s
```

**Skipped (1):** `api.spec.ts` CORS test → BUG-002 (CORS with unknown Origin still returns 500 against local backend). Not user-facing, lowest priority.

**Net suite progress overnight:** baseline 99/0/3 → final 102/0/1.
- +2 from un-skipping BUG-001 and BUG-003 fixes
- +1 from the new dashboard V1 polish guard

---

## Commits this session (in order)

**Backend** (`main`):
- `54e82e9` fix(feed): BUG-001 — feed/:id returns 404 for non-UUID
- `222a8ec` test(api): un-skip 404-format test
- `0ed38f1` test(auth): un-skip wrong-password test
- `a6b61ac` test(dashboard): guard V1 polish surfaces

**Frontend** (`main`):
- `912e56c` fix(auth): BUG-003 — wrong-password no longer silently redirects
- `ca3553c` landing: #190 — metrics section adopts canonical RankMark
- `55050fc` backlog: #191 — "Signals" as a standalone feature
- `e1c77b0` dashboard: V1 polish — hero card + runners + view chip

Every commit deployed automatically (Netlify auto-deploys main; backend `deploy.yml` triggers ECR build → migrate → ECS deploy on main pushes).

---

## What's left

### Remaining launch-blockers
- **BUG-004** — ingestion never deactivates deals after status change. Tonight's 2am UTC nightly run is the first signal for whether the BUG-004 fix needs the freshness sweep alone or also a status-field check. Memory at [[project-lynn-vs-redfin-count]] has the quick verification recipe.
- **Salem / Revere / Framingham** still seed-only data ([[project-prod-market-data-gap]]). Needs RentCast ingestion + market-assumptions + HUD FMR per city.

### Pricing inconsistency (not addressed overnight)
The landing tier section and `roofrank-pricing.html` tell different stories about the same product (Starter limits disagree on every constraint, AI feature naming differs, annual pricing only on pricing page). Logged in yesterday's deep-dive critique. Needs a product decision (which limits are real?), then a one-time alignment + a memory rule that any change has to update all surfaces.

### Onboarding A+ items not done
- Brief copy rewrite for hero context — Ali said "I don't mind it"
- Verdict label style consistency on landing receipt (mono pill vs serif inline)
- Runner-row hover chevron polish
- All low priority.

### Dashboard V1 polish — known follow-ups
- **View ▾ trigger is a placeholder.** It currently *cycles* to the next lens on tap. A proper bottom-sheet picker would be cleaner. Marked as a TODO in `openLensSheet()`. Backlog candidate.
- Old `.brief-*` / `.tp-*` / `.lens-pill` / `.ask-bar` CSS rules still in the dashboard's stylesheet — they're dead but bytes-wise harmless. A CSS cleanup pass would shrink the file by ~30%.
- The dashboard's `renderBriefHead` / `renderBriefBody` / `renderBriefPicks` / `renderFollowups` JS functions are now orphaned (no callers). Safe to delete; left in place for now in case there's a Watchlist page that depends on them.

---

## Where to pick up next session

1. **Verify BUG-004 nightly ingestion outcome** — quick recipe in `[[project-lynn-vs-redfin-count]]` memory.
2. **Wire BUG-004 fix** — freshness sweep in `ingestionWorker.ts` is the simple half; status-field check the harder half.
3. **Dashboard view-sheet** — replace the placeholder lens-cycle with a proper bottom-sheet picker.
4. **Pricing consistency audit** — pick source of truth for plan limits, align landing + pricing page + backend PLAN_LIMITS + onboarding copy.
5. **Salem / Revere / Framingham real data** — `ingestionWorker.ts:36 DEFAULT_MARKETS` + market-assumptions + HUD FMR.

---

## Honest grade after overnight

- **Dashboard:** C → **A−**. Same DNA win as onboarding. The lens sheet is the one polish piece keeping it from clean A.
- **Onboarding:** A− (unchanged — last grade after the simplification + RankMark adoption).
- **Landing:** B+ (unchanged — receipt and metrics now consistent; brief mockup section + OG image still on backlog #187/#188).

Three of the five most-visible surfaces (landing hero, onboarding hero, dashboard hero) now use **the exact same hero card pattern**. That's the kind of consistency that compounds — every new surface we add gets it for free.

Good session. Sleep well.
