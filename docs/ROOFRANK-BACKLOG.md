# RoofRank Product Backlog

**Last updated:** May 16, 2026

---

## 📊 Backlog Stats

| Status | Count |
|---|---|
| ✅ Done | 30 |
| 🔴 MVP Scope | 20 |
| 🟡 Phase 2 | 57 |
| 🟢 Phase 3 / Backlog | 34 |
| ❌ Dropped (strategy change) | 6 |
| **Total** | **141** |

---

## 🚀 MVP Scope — Must Ship Before Launch

| # | Item | Status |
|---|---|---|
| 27 | Ask the Analyst — AI chat | ✅ Done — deal detail + dashboard |
| 28 | AI Deal Narrative — Analyst quality | ✅ Done — Claude-generated, cached |
| 61 | Negotiation Coach (with comps) | 🔴 MVP — promoted from Phase 2 (May 15) |
| 80 | Tax Benefits Panel (after-tax CF) | 🔴 MVP — promoted from Phase 2 (May 15) |
| 81 | Payback Period Visual | 🔴 MVP — promoted from Phase 2 (May 15) |
| 99 | Analyzer PITI Consistency Fix | ✅ Done May 15 — Option A quick form uses PITI baseline; 18-field form moved behind "tweak assumptions" expandable |
| 100 | Replace Fake Landing Page Data | ✅ Done May 14 — removed Sarah T. testimonial; hero mockup now uses real Lynn/Worcester deal styling |
| 101 | Onboarding Goal → Feed Personalization | 🔲 Todo |
| 105 | Make it Work Offer Calculator | 🟡 In Progress — replaced max-offer card |
| 116 | Deploy Script | 🔲 Todo |
| 119 | Rebuild Onboarding — 3 Steps | 🔲 Todo |
| 120 | AI Analyst Standalone Page | 🔲 Todo |
| 121 | MVP Checklist — Pre-Launch Gates | 🔲 Todo |
| 122 | SMS Alerts | 🔲 Todo |
| 123 | Brand decision (RoofRank vs Deckers) | 🔲 Deferred per user May 15 |
| 124 | Roof silhouette tier-color A/B/C pick | 🔲 Awaiting decision — see roof-options.html |
| — | Fix nightly ingestion (item 75) | 🔲 Todo |
| — | Zero console errors | 🔲 Todo |
| — | Mobile deal detail rebuild | ✅ Done May 14 |
| — | Stripe checkout tested end to end | 🔲 Todo |

---

## ✅ Completed Items

| # | Item | Date |
|---|---|---|
| 7 | PITI-Only Scoring | May 2026 |
| 27 | Ask the Analyst AI chat (deal detail + dashboard) | May 14 |
| 28 | AI Deal Narrative (Claude, cached) | May 14 |
| 32 | Landing copy "analyst" repositioning | May 13 |
| 33 | Fix ATTOM API | May 2026 |
| 56 | Open Graph Tags | May 2026 |
| 71 | "Your Analyst" narrative across copy | May 13 |
| 99 | Analyzer PITI consistency — default = PITI, advanced = opt-in | May 15 |
| 100 | Removed fake landing data (testimonial + Freeman St) | May 14 |
| 2 | "Live · Xh ago" timestamp on dashboard Brief | May 14 |
| 4 | Deal-detail browser title shows address | (existing) |
| 6 | Legal footer + privacy/terms on all pages | May 15 |
| 8 | Custom rate input on deal detail | (existing) |
| 26 | ANTHROPIC_API_KEY in Secrets Manager | (existing) |
| — | ATTOM unit count fix (use RentCast) | May 2026 |
| — | Real data Lynn (24 deals) | May 2026 |
| — | Real data Worcester (15 deals) | May 2026 |
| — | Dashboard stat tiles redesign | May 2026 |
| — | Mobile deal detail rebuild — hero score ring, signal pill, dark CF | May 14 |
| — | Conversation-first dashboard rebuild — Analyst Brief + lenses | May 14 |
| — | National positioning on landing (dropped NE-specific) | May 14 |
| — | Narrowed scope to 2–6 units (was 2–30) | May 14 |
| — | Pro gating — lens locks, long-tail blur, upgrade modal | May 14 |
| — | "How We Compare" landing section | May 14 |
| — | Bunny Fonts swap (kills iOS privacy warning) | May 15 |
| — | Landing mobile overflow + pricing-stack fix | May 15 |
| — | Project relocation to ~/Code/, docs/ tracked in git | May 15 |
| — | Repo reorg: backend + infra split, all under devnestdynamics | May 15 |
| — | PWA setup (manifest, service worker, icons) | May 15 |

---

# RoofRank — Product Backlog

**Last updated:** May 2026  
**Total items:** 60

---

## Categories
- 🏗️ **Product** — core features, UX, deal feed, scoring
- 🤖 **AI Features** — Claude-powered analysis, chat, narratives
- 📊 **Data Quality** — ingestion, rent estimates, property filtering, ATTOM
- 📱 **Mobile** — responsive design, mobile-specific UX
- ⚙️ **Infrastructure & DevOps** — CI/CD, monitoring, backups, Redis
- 🔒 **Security** — auth, IDOR, rate limiting, secrets
- 💰 **Monetization** — Stripe, plan limits, billing
- 📈 **Analytics & Conversion** — funnel tracking, session recording, events
- 🚀 **Marketing & Growth** — landing page, SEO, social, OG tags

---

## 🏗️ Product

### 1. Search & Filter on Dashboard
**Priority:** 🔴 · **Effort:** M

Address search input + filter chips for City, Signal, Units. Critical once you have 50+ real deals.

---

### ~~2. "Last Updated" Timestamp on Dashboard~~ ✅ DONE May 14
**Priority:** 🔴 · **Effort:** S

Shipped — "Live · Xh ago" badge in the Brief eyebrow on the dashboard, computed relative to the nightly 2am refresh. Updates on every page load.

---

### 3. Analyzer Defaults to Blank
**Priority:** 🔴 · **Effort:** S

Analyzer pre-fills Freeman St data. New users see someone else's deal. Default to blank or last-used values.

---

### ~~4. Deal Detail Page Title Shows Address~~ ✅ DONE
**Priority:** 🔴 · **Effort:** S

Shipped — `document.title = 'RoofRank — ' + d.address;` lands on every deal-detail load.

---

### 5. Pricing Page Error Handling
**Priority:** 🔴 · **Effort:** S

No toast, no catch block, no feedback if Stripe call fails. Add error handling and fallback message.

---

### ~~6. Footer on All Pages~~ ✅ DONE May 15
**Priority:** 🔴 · **Effort:** M

Shipped — legal footer strip injected into all 9 user-facing pages with copyright, Privacy/Terms/Contact links, and financial-advice disclaimer.

Every page is missing a footer. No privacy policy, terms of service, contact, or support. Legal exposure without it. Minimum: Privacy Policy, Terms, Contact, copyright line.

---

### ~~7. Rework Scoring to PITI-Only~~ ✅ DONE May 2026
**Priority:** 🔴 · **Effort:** M

Current scoring uses vacancy + management + maintenance which makes most deals score Pass. Switch to mortgage + tax + insurance only as base calculation. Show expenses as stress test toggle. Makes scoring reflect how real investors think.

---

### ~~8. Custom Rate Input on Deal Detail~~ ✅ DONE
**Priority:** 🟡 · **Effort:** S

Shipped — rate chip + slider on the cash-flow card (5%–9%, 0.125 step). Edits trigger live recalc of CF, scores, and metrics.

---

### 9. Price Drop Badge & Alert
**Priority:** 🔴 · **Effort:** S

When asking price drops, show "↓ $50K price drop" badge on card and rescore. A Pass deal at $800K might be a Buy at $750K. Store `previousPrice` on upsert.

---

### 10. Days on Market Badges
**Priority:** 🔴 · **Effort:** S

- 🔥 Hot — listed < 7 days
- 💰 Motivated Seller? — listed > 60 days

---

### 11. Score History & Trend Arrow
**Priority:** 🟡 · **Effort:** M

Show score delta since last week on deal card: "↑ 4 pts". Store `previousScore` before each rescore. Creates engagement loop.

---

### 12. Export to CSV / PDF
**Priority:** 🟡 · **Effort:** M

Export watchlist as CSV. Export deal detail as clean 1-page PDF. Investors share these with accountants, partners, lenders.

---

### 13. Investor Notes on Deals
**Priority:** 🟡 · **Effort:** S

Private notepad on each deal. Auto-save on blur. Shown on watchlist as preview. Keeps investors from bouncing to Notion.

---

### 14. Confirm Before Removing from Watchlist
**Priority:** 🟡 · **Effort:** S

Add "Removed — Undo" toast with 5-second window instead of instant delete.

---

### 15. Save Onboarding Progress to localStorage
**Priority:** 🟡 · **Effort:** S

Refreshing during onboarding resets to Step 1. Save step and form values to localStorage, clear on completion.

---

### 16. Deal Detail Back Button Fix
**Priority:** 🟢 · **Effort:** S

`history.back()` breaks when deal is opened directly or in new tab. Add fallback: if `history.length <= 1`, link directly to dashboard.

---

### 17. Watchlist Loading State
**Priority:** 🟢 · **Effort:** S

Watchlist shows blank until API responds. Add skeleton loader or spinner.

---

### 18. Neighborhood Comps on Deal Detail
**Priority:** 🟢 · **Effort:** M

"3 similar properties sold in this zip in last 6 months at avg $X/unit." Requires ATTOM fix first.

---

### 19. Percentile Rank Expanded
**Priority:** 🟢 · **Effort:** S

Already have percentile badge on dashboard. Expand to deal detail: "Top 15% of all Lynn deals this month."

---

### 20. Portfolio Tracker
**Priority:** 🟢 · **Effort:** L

"I own this property" — mark purchased deals, track portfolio performance over time. Stickiest long-term feature.

---

### 21. Market Trends Dashboard
**Priority:** 🟢 · **Effort:** M

Charts showing avg cap rate, avg score, new listings per week per market. Answers "is now a good time to buy in Lynn?"

---

### 22. Keyboard Shortcuts
**Priority:** 🟢 · **Effort:** S

J/K to navigate deals, W to watchlist, Enter to open. Power users love this.

---

### 23. Favicon
**Priority:** 🟢 · **Effort:** S

Browser tab shows generic icon. Add RoofRank logo as 32×32 SVG favicon.

---

### 24. Accessibility (Aria Attributes)
**Priority:** 🟢 · **Effort:** L

Zero aria attributes across all pages. Add aria-label to icon buttons, aria-live to feed, role to score rings.

---

### 25. Mockup Scores Match Real Data
**Priority:** 🟡 · **Effort:** S

Hero mockup shows Freeman St at 85 (Strong Buy) but real product shows 63 (Buy). Update mockup or label as illustrative.

---

## 🤖 AI Features

### ~~26. Claude API Key — Add to Secrets Manager~~ ✅ DONE
**Priority:** 🔴 · **Effort:** S

Shipped — ANTHROPIC_API_KEY present in roofrank/prod/env (verified via aws secretsmanager list-secrets May 15). AI chat + narrative features running on it.

---

### 27. "Ask About This Deal" — AI Chat
**Priority:** 🔴 · **Effort:** M

Chat widget on deal detail. Pass full financials as context to Claude. "What's the biggest risk?" "How does this compare to my last purchase?" Gate behind Pro plan.

---

### 28. AI Deal Narrative — Analyst Quality
**Priority:** 🔴 · **Effort:** S

Upgrade template-based narrative to Claude-generated paragraph. Cache in DB. Show "✦ AI Analysis" badge.

---

### 29. AI Deal Comparison
**Priority:** 🟡 · **Effort:** M

Select 2-3 deals from watchlist → AI side-by-side analysis. "Compare selected" button on watchlist.

---

### 30. AI Morning Digest Email
**Priority:** 🟡 · **Effort:** M

Daily Claude-generated market summary sent to Pro subscribers after nightly ingestion. Requires Resend activation first.

---

### 31. AI Offer Letter Draft
**Priority:** 🟡 · **Effort:** S

"Draft LOI" button after offer calculator. Claude generates Letter of Intent with deal terms pre-filled. Download as PDF.

---

### 32. Update Landing Page Copy for AI
**Priority:** 🟡 · **Effort:** S

- Tagline: add "AI-Assisted Analysis"
- Hero subtext: mention AI narratives
- Deal detail: "✦ AI Analysis" badge
- Pricing: add AI features to Pro tier

---

## 📊 Data Quality

### ~~33. Fix ATTOM "Invalid Parameter Combination"~~ ✅ DONE May 2026
**Priority:** 🔴 · **Effort:** M

ATTOM failing for all Lynn addresses. Scoring without neighborhood grades. Debug API call format — likely address formatting issue.

---

### 34. Fix Nightly Ingestion — Use Direct ingestMarket
**Priority:** 🔴 · **Effort:** S

Nightly 2am job calls `runIngestionNow()` which queues via BullMQ. Queue processor may not run. Switch nightly job to call `ingestMarket()` directly like `runIngestion.ts` does.

---

### 35. Unit Count from RentCast is Bedrooms not Units
**Priority:** 🟡 · **Effort:** M

Large buildings (17BR, 7BR) get wrong rent estimates. For now ignoring — 2-6 unit properties are core market. Fix when adding larger building support.

---

### 36. Interest Rate — Keep Current
**Priority:** 🔴 · **Effort:** S

Rate is hardcoded at 6.75%. Update manually when rates move > 0.5%. Add admin endpoint to update globally without redeploying. Current: 6.75% (updated May 2026).

---

### 37. Stale Listing Removal
**Priority:** 🟡 · **Effort:** M

Listings that sold or were delisted stay in feed. On each ingestion, mark listings not returned by RentCast as inactive. Filter inactive from feed.

---

### 38. Verify Seed Data Scores After PITI Change
**Priority:** 🔴 · **Effort:** S

After reworking scoring to PITI-only, re-run scoring on all 26 seed deals and all Lynn listings. Verify score distribution is realistic.

---

## 📱 Mobile

### 39. Stats Cards Cut Off on Mobile
**Priority:** 🔴 · **Effort:** S

Stats cards overflow screen. Fix: 2×2 grid on mobile.
```css
@media (max-width: 768px) { .stats-grid { grid-template-columns: 1fr 1fr; } }
```

---

### 40. Market Filter Chips — Horizontal Scroll
**Priority:** 🔴 · **Effort:** S

Market chips cut off on right. Fix: horizontal scroll container.
```css
.market-filter { overflow-x: auto; -webkit-overflow-scrolling: touch; flex-wrap: nowrap; }
```

---

### 41. Deal of the Day — DSCR Cut Off
**Priority:** 🟡 · **Effort:** S

DSCR value cut off on right edge on mobile. Constrain metric tags to wrap within card width.

---

### 42. Full Mobile Audit at 390px
**Priority:** 🟡 · **Effort:** M

Full pass on all pages at iPhone 17 Pro width. Deal cards look great — focus on headers, filters, stat blocks.

---

## ⚙️ Infrastructure & DevOps

### 43. Wire CI/CD Pipeline
**Priority:** 🔴 · **Effort:** M

`.github/workflows/deploy.yml` exists but needs 4 GitHub secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `ECR_REGISTRY`, `ECS_SERVICE`. Every push then auto-deploys and runs smoke tests.

---

### 44. Fix Redis Eviction Policy
**Priority:** 🟡 · **Effort:** S

ElastiCache showing "IMPORTANT! Eviction policy is volatile-lru. Should be noeviction." Update via AWS console: ElastiCache → Parameter Groups → `maxmemory-policy` → `noeviction`.

---

### 45. Enable RDS Automated Backups
**Priority:** 🔴 · **Effort:** S

RDS backups not enabled. AWS Console → RDS → roofrank-postgres → Modify → Backup retention: 7 days.

---

### 46. Google OAuth Callback Fix
**Priority:** 🟡 · **Effort:** M

Google OAuth callback currently set to localhost. Update `GOOGLE_CALLBACK_URL` in Secrets Manager to `https://api.roofrank.io/api/auth/google/callback`.

---

### 47. Set Up Resend Email
**Priority:** 🟡 · **Effort:** M

Resend API key is placeholder. Activate account, get real key, update Secrets Manager. Required for Strong Buy alerts and AI morning digest.

---

## 🔒 Security

### 48. Strengthen DB Password
**Priority:** 🔴 · **Effort:** S

RDS password is `TempPass123!`. Change to a strong random password. Update `DATABASE_URL` in Secrets Manager.

---

### 49. IDOR Protection Audit
**Priority:** 🟡 · **Effort:** M

Verify users cannot access other users' watchlist items or reports by guessing IDs. Test: User A's report ID accessed by User B should return 403.

---

### 50. Rate Limiting on Auth Endpoints
**Priority:** 🟡 · **Effort:** S

Verify rate limiting is active on `/auth/login`. Should return 429 after 10 failed attempts in 60 seconds.

---

## 💰 Monetization

### 51. Activate Stripe Live Keys
**Priority:** 🔴 · **Effort:** M

Stripe keys are test/placeholder. Activate live keys, update Secrets Manager. Required before charging real users.

---

### 52. Plan Limits Enforcement
**Priority:** 🟡 · **Effort:** M

Verify Starter plan limits enforced: 10 reports max, no Strong Buy alerts. Test with a non-Pro account.

---

## 📈 Analytics & Conversion

### 53. Add Posthog for Funnel Tracking
**Priority:** 🔴 · **Effort:** M

Track the full user funnel: Visit → Sign Up → First Deal Viewed → Watchlist → Upgrade. Free tier is generous. Add JS snippet to all pages.

**Key events to track:**
- `landing_page_view`
- `signup_started`
- `onboarding_step_completed` (1-4)
- `deal_viewed`
- `deal_saved`
- `report_generated`
- `upgrade_clicked`
- `payment_completed`

---

### 54. Add Microsoft Clarity for Session Recording
**Priority:** 🟡 · **Effort:** S

Free session recording — watch where real users click, scroll, and get confused. Add JS snippet to all pages. Invaluable for UX decisions.

---

### 55. User Events Table in DB
**Priority:** 🟡 · **Effort:** M

Add `user_events` table. Log: `deal_viewed`, `deal_saved`, `report_generated`, `upgrade_clicked` with user ID and timestamp. Enables internal analytics without third-party dependency.

---

## 🚀 Marketing & Growth

### ~~56. Open Graph / Social Preview Tags~~ ✅ DONE May 2026
**Priority:** 🔴 · **Effort:** S

No preview when sharing roofrank.io via iMessage, WhatsApp, LinkedIn. Add OG meta tags to all pages + create 1200×630px og-image.png.

```html
<meta property="og:title" content="RoofRank — Multifamily Deals, Ranked Daily">
<meta property="og:description" content="Every active 2–6 unit property scored on Cap Rate, Cash-on-Cash, DSCR and more.">
<meta property="og:image" content="https://roofrank.io/og-image.png">
<meta name="twitter:card" content="summary_large_image">
```

Test at: https://www.opengraph.xyz

---

### 57. Landing Page Headline — Revisit
**Priority:** 🟡 · **Effort:** S

Current: "Stop spreadsheets. Every deal, ranked for you." Options saved in memory. Revisit when inspiration strikes.

---

### 58. Fix "Not Secure" Warning (Cached)
**Priority:** 🟢 · **Effort:** S

SSL cert is provisioned. Warning is browser cache. Clears on its own. Hard refresh: Cmd+Shift+R.

---

### 59. BiggerPockets / REI Community Outreach
**Priority:** 🔴 · **Effort:** M

Post in BiggerPockets, MassREIA, North Shore REI Facebook groups. "Built this tool, here are the 17 active multifamily listings in Lynn right now, here's how they score." Not marketing — value delivery.

---

### 60. Add Social Proof to Landing Page
**Priority:** 🟡 · **Effort:** S

"Rated 4.9 by beta users" with BiggerPockets/REI Prints logos needs to be real before showing to investors. Either get real testimonials or remove until you have them.

---

## Priority Summary

| Priority | Items |
|---|---|
| 🔴 Must do soon | 1,2,3,4,5,6,7,9,10,26,27,28,33,34,36,38,39,40,43,45,48,51,53,56,59 |
| 🟡 Important | 8,11,12,13,14,15,19,29,30,31,32,35,37,41,42,44,46,47,49,50,52,54,55,57,60 |
| 🟢 Nice to have | 16,17,18,20,21,22,23,24,58 |


---

## 🤖 AI Features — Extended Roadmap

### 61. Negotiation Coach
**Priority:** 🔴 · **Effort:** M · **Category:** AI Features

On deal detail: "Help me negotiate this deal." Claude analyzes DOM, price history, score gap, market conditions and outputs a negotiation strategy with opening offer and script.

**Example output:**
> "This property has been on market 67 days — that's leverage. At $820K asking, I'd open at $760K. The seller has already dropped $30K. Here's the script..."

---

### 62. Risk Surfacing — AI Flag System
**Priority:** 🔴 · **Effort:** M · **Category:** AI Features

Claude reads between the lines and surfaces risks investors might miss. Shown as warning cards on deal detail.

**Examples:**
- "Built 1910 — budget $15-20K for deferred maintenance year 1"
- "DSCR 1.03 — one vacancy event puts you negative"
- "Relisted 3 times in 2 years — worth investigating why"
- "Price/unit is 40% above Lynn average — significant premium"

---

### 63. Monthly Market Intelligence Reports
**Priority:** 🟡 · **Effort:** M · **Category:** AI Features

Claude-generated monthly report per market. Investors share these. Builds brand as authority.

**Example:**
> "Lynn Multifamily — May 2026. 17 active listings, avg asking $847K, avg score 31. Prices up 4% YoY but rents flat. Best opportunity: 2-unit buildings under $650K on the North Side."

Delivered via email + accessible in app. Pro feature.

---

### 64. Portfolio Health Check
**Priority:** 🟡 · **Effort:** L · **Category:** AI Features

For investors who mark properties as owned — monthly Claude analysis:
> "Your 3-unit on Maple St has been owned 18 months. Comparable units renting for $2,800 vs your $2,400 — you may be leaving $400/mo on the table."

Requires Portfolio Tracker (item 20) to be built first.

---

### 65. Natural Language Deal Search
**Priority:** 🟡 · **Effort:** M · **Category:** AI Features

Type in plain English: "Show me 3-unit buildings in Lynn under $700K with DSCR above 1.1" — Claude translates to structured query and returns results. Replaces filter chips entirely for power users.

---

### 66. AI-Powered Offer Package
**Priority:** 🟡 · **Effort:** M · **Category:** AI Features

Claude generates a complete offer package after the offer calculator:
- Cover letter to seller
- Letter of Intent with terms pre-filled
- Financing contingency language
- Inspection request timeline

Investors close faster. Huge value for less experienced buyers.

---

### 67. Deal Battle Card — AI Comparison
**Priority:** 🟡 · **Effort:** S · **Category:** AI Features

Select 2-3 deals from watchlist. Claude generates structured comparison: which has better cash flow, less risk, more upside, and which one Claude would pick — and why.

---

### 68. Predictive Score — 3-Year Outlook
**Priority:** 🟢 · **Effort:** XL · **Category:** AI Features

"Given these inputs, what will this property's cap rate look like in 3 years?" Uses ATTOM historical data + market trends. Moves RoofRank from reactive to predictive. Long-term moonshot.

---

### 69. Tenant Risk Assessment
**Priority:** 🟢 · **Effort:** L · **Category:** AI Features

For markets with public eviction records, flag: "This address has 2 eviction filings in last 5 years — factor into vacancy assumptions." Reduces due diligence time.

---

### 70. Zoning & Permit Intelligence
**Priority:** 🟢 · **Effort:** L · **Category:** AI Features

Claude reads public permit records: "Building permit pulled 2019 — verify work was completed and properly permitted." Surfaces due diligence flags automatically.

---

### 71. AI Repositioning — "Your Analyst" Narrative
**Priority:** 🔴 · **Effort:** S · **Category:** AI Features / Marketing

Update all copy to position RoofRank as an AI analyst, not a scoring tool.

**New core narrative:**
> "Every serious multifamily investor has a mentor — someone who's bought 50 properties, knows every market, and can look at a deal and tell you in 30 seconds if it's worth your time. Most investors don't have that person. RoofRank is that person, available 24/7, across every active listing in your market."

Apply across: landing page, pricing page, onboarding, email subject lines.


---

### 72. Dynamic Interest Rate — Admin Endpoint
**Priority:** 🟡 · **Effort:** S · **Category:** Data Quality

Rate is hardcoded at 6.5%. Add an admin API endpoint to update the global rate without redeploying. Should update Secrets Manager or a DB config table.

```
POST /api/admin/config
{ "interestRate": 6.375 }
```

Also show the rate used on the deal detail page: "Scored at 6.5% · 30yr fixed · Updated May 2026"

---

### 73. ARM Scenarios in Analyzer & Deal Detail
**Priority:** 🟡 · **Effort:** M · **Category:** Product

Many Lynn investors use 5/1 or 7/1 ARMs to improve initial cash flow. Add ARM toggle to the Analyzer and deal detail offer calculator.

**Options to support:**
- 30yr Fixed (default)
- 5/1 ARM — lower initial rate, adjusts after 5 years
- 7/1 ARM — lower initial rate, adjusts after 7 years
- 15yr Fixed — higher payment, faster equity

**UI:** Dropdown next to the rate input. Show side-by-side: "At 6.5% fixed: $1,340/mo CF | At 5.8% ARM (5/1): $1,520/mo CF"

**Scoring:** Score using fixed rate by default. ARM shown as upside scenario only — don't inflate the base score with ARM rates.


---

### 74. Remove Seed Data Market by Market
**Priority:** 🔴 · **Effort:** S · **Category:** Data Quality

26 seed deals are fake. Remove them as real RentCast data is activated per market.

**Process per market:**
1. Activate RentCast ingestion for the city
2. Verify real listings are scored correctly
3. Delete seed deals for that city:
```sql
DELETE FROM deal_feed WHERE source = 'seed' AND city = 'Boston';
```

**Current status:**
- Lynn ✅ — real data, seed data already cleaned
- Boston, Worcester, Hartford, Providence, Manchester, New Haven, Springfield, Bridgeport, Lowell — still using seed data

**Final step:** Once all 9 markets have real data, run:
```sql
DELETE FROM deal_feed WHERE source = 'seed';
```


---

### 75. Fix Nightly Ingestion — Bypass BullMQ
**Priority:** 🔴 · **Effort:** S · **Category:** Infrastructure

Nightly 2am job queues via BullMQ but the worker that processes the queue may not run reliably. Fix: call `ingestMarket()` directly from the scheduler, same as `runIngestion.ts` does. This ensures data refreshes every night automatically without manual intervention.

**Current (broken):**
```
2am cron → adds job to BullMQ → worker picks up job (unreliable)
```

**Target:**
```
2am cron → calls ingestMarket() directly → scores all listings → done
```

---

### 76. Decouple Ingestion from Deploy
**Priority:** 🔴 · **Effort:** S · **Category:** Infrastructure

Every deploy currently requires a manual re-ingestion run. Fix: deal data should persist across deploys. Only re-ingest when scoring logic changes, not on every code push.

**Rule:** Clean + re-ingest only when:
- Scoring engine weights change
- PITI calculation changes
- Interest rate changes
- New market added

**Normal deploys** (bug fixes, UI changes, new features) should never touch deal data.


---

### 77. Closing Costs Review & Accuracy
**Priority:** 🟡 · **Effort:** S · **Category:** Data Quality

Closing costs currently hardcoded at 2% of purchase price. Too low for MA investment properties — realistic is 3-4% when including title insurance, attorney fees, transfer taxes, lender fees, pre-paids.

At 3.5% on $785K: $27,475 vs current $15,700 — $12K difference, lowers CoC ~0.5-0.7%.

Update default to 3.5% for more accurate CoC calculations.

---

### 78. Simplified Scoring — PITI Base with Optional Expense Layers
**Priority:** 🔴 · **Effort:** M · **Category:** Product

Rethink the scoring and analyzer UI around simplicity first, complexity optional.

**Default view (what every investor sees):**
- Gross Rent − PITI = Monthly Cash Flow
- That's it. Clean, honest, simple.

**Optional expense layers (expandable section):**
- [ ] Closing costs (default 3.5%, editable)
- [ ] Vacancy allowance (default 0%, editable — investor knows their tenant situation)
- [ ] Maintenance reserve (default 0%, editable)
- [ ] Property management (default 0%, editable — many self-manage)
- [ ] Utilities (default 0%, editable)
- [ ] Other expenses

**UX:** Collapsed by default with a "Add expense assumptions →" toggle. When expanded, each field is editable and the score/cash flow updates in real time.

**Why this works:**
- New investors see a clean number immediately
- Experienced investors can layer in their actual assumptions
- Product feels simple but powerful
- Avoids the problem of penalizing deals with conservative defaults that don't reflect reality

**Score impact:** Base score uses PITI only. "Stress tested score" shown when expenses are added — two numbers side by side.


---

### 79. Rent Estimate Panel with Override
**Priority:** 🔴 · **Effort:** M · **Category:** Product

Show the rent estimate used in scoring with context, and let the investor override it with their local knowledge to see a revised score.

**UI on deal detail page:**
```
Rent Estimate (HUD FMR)
─────────────────────────────────
2BR units (×2):  $2,588/mo each
Est. gross rent: $5,176/mo

[  Lynn 2BR market range: $2,500–$3,000/mo  ]

Know your market? Adjust:
[ $2,588 ] per unit  →  Recalculate score
```

**Why this is powerful:**
- HUD FMR is conservative (40th percentile)
- A savvy Lynn investor knows 2BRs are going for $2,700-2,800
- Letting them override turns a Watch into a Strong Buy
- Makes the investor feel smart, not dependent on the algorithm
- Builds trust — "this tool respects my expertise"

**Implementation:**
- Show HUD FMR estimate with bedroom breakdown
- Show market range context ("Lynn 2BR: $2,500–$3,000/mo based on recent listings")
- Editable rent per unit field
- On change: recalculate all financials and score in real time
- Show "Your estimate" vs "HUD estimate" side by side
- "Share this analysis" button with custom rent baked in

**Score display:**
```
Base score (HUD FMR):     54  Watch
Your estimate ($2,750):   71  Strong Buy  ⬆
```

This is a killer feature for experienced investors and a huge trust builder.


---

### 80. Tax Benefits Panel — Estimated Annual Tax Savings
**Priority:** 🟡 · **Effort:** M · **Category:** Product

Show the estimated annual tax benefits of owning the property as a sidebar or card on the deal detail page. Many investors buy multifamily as much for tax shelter as cash flow — this makes RoofRank feel like it understands the full investment picture.

**Key tax benefits to show:**

**1. Depreciation Shield**
Residential rental property depreciates over 27.5 years (IRS).
```
Building value (80% of purchase):  $560,000
Annual depreciation:                $560,000 / 27.5 = $20,364/yr
Tax savings (at 32% bracket):       $20,364 × 0.32 = $6,516/yr
```

**2. Mortgage Interest Deduction**
Year 1 interest on a $590K loan at 6.5%:
```
Annual interest (approx yr 1):      ~$38,350
Tax savings (at 32% bracket):       $38,350 × 0.32 = $12,272/yr
```

**3. Property Tax Deduction**
Already an expense, but worth surfacing as a tax benefit too.

**4. Total Estimated Tax Benefit**
```
Depreciation:         $6,516/yr
Mortgage interest:    $12,272/yr
─────────────────────────────────
Total est. savings:   ~$18,788/yr  ($1,566/mo)
```

**UI concept:**
Show as a green sidebar card on deal detail:

```
💰 Estimated Tax Benefits
─────────────────────────────────
Depreciation shield:    $6,516/yr
Mortgage interest:     $12,272/yr
─────────────────────────────────
Total est. savings:    $18,788/yr
                       $1,566/mo

Assumes 32% federal tax bracket.
Not tax advice — consult your CPA.
```

**Why this matters:**
A deal showing -$200/mo cash flow looks different when you add $1,566/mo in tax benefits. Effective monthly return: +$1,366/mo. This is how experienced investors actually evaluate deals.

**Important disclaimers:**
- Always show "Estimated — not tax advice"
- Let investor input their tax bracket (default 32%)
- Note: passive activity loss rules may limit deductibility
- Link to "talk to your CPA"

**Tax bracket input:**
Simple dropdown: 22%, 24%, 32%, 35%, 37%
Updates all numbers in real time.


---

### 81. Payback Period Visual — Return of Capital Timeline
**Priority:** 🟡 · **Effort:** M · **Category:** Product

Show investors how long it takes to get their initial cash investment back, with projected rent increases layered in. Savvy investors target 5-7 year payback periods.

**Calculation:**
```
Total cash invested:     $211,950 (down + closing)
Annual cash flow yr 1:   $17,256
Rent growth assumption:  3% per year (editable)

Year 1:  $17,256  →  cumulative: $17,256
Year 2:  $17,774  →  cumulative: $35,030
Year 3:  $18,307  →  cumulative: $53,337
Year 4:  $18,856  →  cumulative: $72,193
Year 5:  $19,422  →  cumulative: $91,615
Year 6:  $20,005  →  cumulative: $111,620
Year 7:  $20,605  →  cumulative: $132,225
Year 8:  $21,223  →  cumulative: $153,448  ← crosses $211,950
...
Payback period: ~10.2 years
```

**UI concept:**
Progress bar or timeline visualization on deal detail:

```
💰 Return of Capital
─────────────────────────────────────────
Total invested:  $211,950
Rent growth:     3%/yr  [ adjust ]

  Yr 1   Yr 3   Yr 5   Yr 7   Yr 10   Yr 12
  ├──────┼──────┼──────┼──────┼───────┼──────
  $17K   $53K   $92K   $132K  $194K   $232K ✅

Estimated payback: ~10.2 years

[  Savvy investors target 5–7 years  ]
```

**With optional tax benefits included:**
```
Cash flow + tax savings:  $34,044/yr
Payback period:           ~6.2 years  ✅ (in target range)
```

**Editable assumptions:**
- Rent growth % per year (default 3%)
- Tax bracket (pulls from tax benefits panel)
- Include/exclude tax benefits toggle

**Signal:**
- < 7 years: 🟢 Strong return timeline
- 7-10 years: 🟡 Acceptable
- > 10 years: 🔴 Long payback — factor into decision

**Why this matters:**
Combines cash flow + rent growth + tax benefits into one intuitive number investors already think in. "I get my money back in 6 years" is more meaningful than "CoC is 8.1%."


---

### 82. Replace "Max Offer" Calculator with "Make it Work" Card
**Priority:** 🔴 · **Effort:** S · **Category:** Product

The current "What's your maximum offer?" section on deal detail is solving the wrong problem. Showing "$170K above asking" is useless and confusing. Replace with a clean "Make it Work" card that answers the real investor question: what do I need to offer to make this deal good?

**New design:**
```
What would you need to offer?
─────────────────────────────────────────
At asking $650K:      Score 55  Watch
To reach Buy (60):    $620K  ↓ $30K  (-4.6%)
To reach Strong Buy:  $575K  ↓ $75K  (-11.5%)

[ Run my own numbers → ]
```

- No inputs required — calculated automatically from deal data
- "Run my own numbers" links to Analyzer with deal pre-filled
- Replaces the confusing target score / down payment / rate inputs
- Much cleaner, immediately actionable

**Why this is better:**
- Solves the real problem: "what do I offer?"
- No user input needed — instant value
- Gives investors a negotiation anchor
- The Analyzer handles custom scenarios for power users


---

## UX/UI Improvements — Voice Session May 2026

### 83. Search on Dashboard
**Priority:** 🔴 · **Effort:** S · **Category:** Product

No way to find a specific address on the dashboard. Critical once you have 40+ deals. Add a simple search input above the deal cards that filters by address in real time.

---

### 84. Interest Rate Fix on Deal Detail UI
**Priority:** 🔴 · **Effort:** S · **Category:** Data Quality

Deal detail page still shows 7.25% interest rate in the UI even though scoring engine uses 6.5%. Visual inconsistency that will confuse investors. Update all hardcoded rate references in the deal detail page to match the current scoring rate.

---

### 85. Share Button on Deal Detail
**Priority:** 🔴 · **Effort:** S · **Category:** Product

Investors want to send deals to their partner, spouse, or agent. Add a "Share this deal" button that copies a shareable link or generates a clean PDF summary. High usage feature — investors make decisions collaboratively.

---

### 86. Watchlist Score Delta
**Priority:** 🟡 · **Effort:** M · **Category:** Product

Watchlist currently shows saved deals with no context on how they've changed. Show score movement since saved: "Saved at 55 · Now 62 · ↑7 pts". Requires storing the score at save time. Makes watchlist genuinely useful vs just a bookmark list.

---

### 87. Onboarding Uses Real Deal
**Priority:** 🟡 · **Effort:** S · **Category:** Product

Onboarding "Score your first deal" example uses Freeman St with inflated scores that don't match the real product. Replace with a real Lynn deal (e.g. 82 Linwood St, score 68) so the first impression is accurate and honest.

---

### 88. Deal of the Day Rotation
**Priority:** 🟡 · **Effort:** S · **Category:** Product

Deal of the Day always shows the highest scoring deal. Rotate the signal daily:
- Monday: Top cash flow
- Tuesday: Best cap rate
- Wednesday: Biggest price drop
- Thursday: Most motivated seller (highest DOM)
- Friday: Best value per unit (lowest price/unit among Buy+ deals)

Creates a reason to check back every day.

---

### 89. Social Proof on Landing Page
**Priority:** 🔴 · **Effort:** S · **Category:** Marketing

No testimonials, no logos, no trust signals. Even one real quote from a beta user would help conversions significantly. Reach out to anyone who has used the product and ask for a one-sentence quote. Display below the hero.

---

### 90. Real Deal Example on Landing Page
**Priority:** 🔴 · **Effort:** S · **Category:** Marketing

Show one actual Lynn deal with real score and a snippet of AI narrative right on the landing page. Nothing converts better than showing the actual product working with real data. "82 Linwood St, Lynn — Score 68 (Buy) · $1,609/mo cash flow · Cap 7.1%"

---

### 91. Stress Test Toggle More Prominent on Analyzer
**Priority:** 🟡 · **Effort:** S · **Category:** Product

The stress test toggle is one of the most useful features on the Analyzer but it's buried and easy to miss. Move it above the fold or make it more visually prominent.

---

### 92. Narrative Upgrade — AI Quality
**Priority:** 🔴 · **Effort:** M · **Category:** AI Features

Deal detail narrative paragraph reads like a template. This is exactly where the AI upgrade (item 40) would have the most impact — first thing investors read when they open a deal. Prioritize this as the first AI feature to build.


---

### 93. AI Score Tooltip on Deal Cards (Dashboard)
**Priority:** 🟡 · **Effort:** M · **Category:** AI Features

On tap of the score ring on any deal card, show a one-line AI summary inline below the score. Cache in memory for the session so second tap is instant.

**Phase 1 (on-demand):** Call AI on first tap, cache in sessionStorage by deal ID.
**Phase 2 (pre-generated):** Store aiSummary in DB at ingest time, return with feed — zero latency.

Example:
```
68 · Buy  →  "Strong cash flow at $1,438/mo. 1905 build is the main risk."
```

Mobile: tap to show/hide. Desktop: show on hover or tap.

---

### 94. Deal of the Day — AI Brief
**Priority:** 🟡 · **Effort:** S · **Category:** AI Features

Add one AI-generated sentence to the Deal of the Day card on the dashboard. Pre-generate at ingest time (Phase 2) or generate on first load and cache (Phase 1).

Example:
```
82 Linwood St — Lynn's best deal today
"Best cash flow in the market at $1,438/mo — these go 
under contract in 7-10 days at this score. Act fast."
```

---

### 95. Market Intelligence Strip
**Priority:** 🟡 · **Effort:** M · **Category:** AI Features

Thin AI-generated banner between stat tiles and deal feed. Generated nightly at 2am alongside ingestion.

Example:
```
✦ Lynn: 3 new listings this week · avg asking up 4% · 
  1 deal upgraded to Strong Buy · 2 dropped to Watch
```

---

### 96. "Why is this a Pass?" Label on Low-Score Cards
**Priority:** 🟡 · **Effort:** M · **Category:** AI Features

Show a brief AI-generated reason on Pass deals directly on the card. Saves investors from clicking into bad deals.

Example:
```
Pass  ·  "Overpriced by ~$200K for current rents at 6.5%"
```

Generated at ingest time, stored in DB alongside score.


---

### 98. Smart Verdict Card — Real Market Averages
**Priority:** 🟡 · **Effort:** M · **Category:** Data Quality

Smart verdict card currently uses hardcoded market averages (CoC 4.8%, Cap 6.1%, DSCR 1.13, Price/Unit $280K). Replace with real averages computed from actual deals in the database per city.

**Implementation:**
- Add `/api/feed/stats/:city` endpoint that returns avg CoC, Cap Rate, DSCR, Price/Unit for that market
- Call on deal detail page load, use to populate the vs-market comparison
- Averages update automatically as new deals are ingested nightly

**Example:**
```
Cap Rate   10.1%  ↑ above Lynn avg (7.3%)   ← real data
CoC        16.3%  ↑ above Lynn avg (5.1%)   ← real data
```


---

## Critical Fixes — From Deep Review May 2026

### 99. Analyzer PITI Consistency Fix
**Priority:** 🔴 · **Effort:** S · **Category:** Product

The analyzer contradicts the feed scoring model. Feed uses PITI-only but analyzer shows vacancy, maintenance, management, utilities, CapEx fields — producing different (lower) numbers for the same deal. Destroys investor trust.

Fix: Collapse expense fields into optional "Advanced expenses" section hidden by default. Default view = PITI only, matching the feed exactly. Add note: "Default matches RoofRank scoring model."

---

### 100. Replace Fake Landing Page Data with Real Deals
**Priority:** 🔴 · **Effort:** S · **Category:** Marketing

Landing page hero shows Freeman St Boston (fake seed data), 37 Strong Buys, fake testimonial from "Sarah T." Replace with real deals:
- Show 58 Laighton St Lynn (score 87, $2,384/mo CF) or 82 Linwood St (score 68)
- Remove or replace fake testimonial
- Update deal count to reflect real data

Real data is more compelling and more honest.

---

### 101. Onboarding Goal → Feed Personalization
**Priority:** 🟡 · **Effort:** M · **Category:** Product

Onboarding step 3 collects investing goal (cash flow, equity, first investment) but does nothing with it. Broken promise.

Fix:
- "Maximize cash flow" → default feed sort by monthly CF
- "First investment" → show educational tooltips on score metrics
- "Build equity" → highlight price/unit and appreciation markets
- "Add to portfolio" → show deals in different markets than they already own

---

### 102. Watchlist Price Drop Alerts
**Priority:** 🔴 · **Effort:** M · **Category:** Product

Track asking price at time of save. When price drops, badge the deal in watchlist and send email alert. "82 Linwood St dropped $25K since you saved it." This is the feature that makes investors check the app daily.

---

### 103. AI Narrative on Deal Detail (Replace Template)
**Priority:** 🔴 · **Effort:** S · **Category:** AI Features

The narrative paragraph on deal detail is template-based — reads like a formula. Replace with Claude-generated 2-sentence summary on page load. Call AI endpoint once with "write a 2-sentence analyst summary" prompt. Cache in sessionStorage so it only generates once per session.

---

### 104. Morning Deal Brief Email
**Priority:** 🔴 · **Effort:** M · **Category:** AI Features

Daily 7am email with:
- Best new listing overnight
- Any price drops on user's watchlist
- One AI-generated sentence on market conditions
- Top 3 deals by score that day

The retention mechanic that keeps people subscribed month after month. AI already works — just wiring to email via Resend.

---

### 105. Make it Work Offer Calculator (Replace Current)
**Priority:** 🔴 · **Effort:** S · **Category:** Product

Replace broken offer calculator with clean single insight:
"What would you need to offer?"

```
At asking $650K:    Score 55 (Watch)
At $620K:           Score 60 (Buy)     ↓ $30K
At $575K:           Score 72 (Strong Buy) ↓ $75K
```

No inputs required. Calculated from deal data already loaded. Links to Analyzer for custom scenarios.


---

## Creative AI Features

### 106. Deal DNA — AI Pattern Recognition
**Priority:** 🟡 · **Effort:** L · **Category:** AI Features

Over time RoofRank will have historical data on hundreds of deals — which ones got offers, which sat, which investors bought. Train a simple pattern recognizer that identifies deal "types":

"This is a classic Lynn triple-decker cash flow play. These typically trade at $300-350K/unit, attract buy-and-hold investors, and go under contract within 14 days when priced right."

Not ML — just Claude analyzing the pattern across similar scored deals. Makes every deal feel like it has institutional research behind it.

---

### 107. Negotiation Script Generator
**Priority:** 🔴 · **Effort:** S · **Category:** AI Features

After "Ask the Analyst" surfaces a negotiation strategy, one-click generates a ready-to-send offer letter or negotiation script:

"Based on 155 days on market and a DSCR of 1.03, here's your opening offer letter..."

Outputs a professional letter the investor can hand to their agent or send directly. Saves hours of work, creates enormous perceived value.

---

### 108. Red Flag Scanner
**Priority:** 🔴 · **Effort:** S · **Category:** AI Features

AI scans every deal at ingest time for specific red flags and stores them as structured data:

- Relisted 3+ times in 18 months
- Price reduced 2+ times
- Address contains "Unit" (possible condo misclassified)
- 100+ days on market
- Bedroom count implies wrong unit mix
- Tax assessment vs asking price gap > 40%

Show as small warning badges on deal cards. "⚠ 3 price drops" or "⚠ Relisted twice." Investors see risk signals before clicking in.

---

### 109. Comp Finder — "Show Me Similar Deals"
**Priority:** 🟡 · **Effort:** M · **Category:** AI Features

On any deal, one button: "Show me similar deals." AI finds the 3 closest matches in the feed by unit count, price range, year built, and score — and presents them side by side.

"Here are 3 similar 2-unit Lynn properties. 82 Linwood scores higher at $785K. Here's why this one might still make sense..."

Helps investors make relative decisions, not just absolute ones.

---

### 110. Investor Profile Builder
**Priority:** 🟡 · **Effort:** M · **Category:** AI Features

After 30 days of usage, AI builds a private investor profile:
- Markets they browse most
- Score threshold they act on
- Price range they consider
- Property types they favor

Then surfaces insights: "You've been looking at Lynn 2-units under $700K. There are 3 new ones this week that match your pattern." 

Makes the product feel like it knows the investor. Highest retention feature possible.

---

### 111. Deal Journal — AI Memory
**Priority:** 🟡 · **Effort:** M · **Category:** AI Features

Let investors leave notes on deals ("toured this, foundation issues") and have the AI reference those notes in future conversations.

"You noted foundation issues when you toured 82 Linwood in March. The price has dropped $30K since then — worth revisiting?"

This is the feature that makes RoofRank feel like a partner, not a tool.

---

### 112. Market Shift Detector
**Priority:** 🟡 · **Effort:** M · **Category:** AI Features

Track scoring trends over time. When a market's average score drops 10+ points over 30 days, AI generates an alert:

"Lynn multifamily scores have dropped from avg 52 to avg 41 over the past 30 days. Asking prices are up 8% while rents are flat. This market is getting expensive — be selective."

Conversely: "Worcester scores improved significantly this month. 3 deals now qualify as Buy that were Pass 60 days ago."

No other consumer tool tracks market momentum this way.

---

### 113. Due Diligence Checklist — Property Specific
**Priority:** 🔴 · **Effort:** S · **Category:** AI Features

When an investor saves a deal or asks the analyst, auto-generate a due diligence checklist specific to that exact property:

```
58 Laighton St — Due Diligence Checklist
Built 1880 · Lynn · 2 Units

Essential:
□ Sewer scope (cast iron pipes likely)
□ Knob and tube wiring inspection  
□ Lead paint assessment (pre-1978)
□ Foundation inspection (settling common in Lynn triple-deckers)
□ Verify unit count with city assessor (2 units per deed)
□ Request last 3 years utility bills
□ Review rent rolls and lease terms
□ Check permit history for unpermitted work
```

Every item generated based on year built, property type, market, and score breakdown. Replaces the generic PDF checklist every investor downloads and ignores.

---

### 114. "If You Liked This" Deal Recommendations
**Priority:** 🟡 · **Effort:** M · **Category:** AI Features

Netflix-style recommendations. When an investor views or saves a deal, AI surfaces 2-3 similar deals they haven't seen:

"Since you looked at 58 Laighton St (score 87), you might like:
- 82 Linwood St — same score, $135K cheaper, 3 units
- 48 Saratoga St — similar cash flow, newer building"

Simple but powerful. Keeps investors in the product longer and surfaces deals they'd miss.

---

### 115. Seller Motivation Scorer
**Priority:** 🟡 · **Effort:** S · **Category:** AI Features

Combine DOM, price reduction history, listing description language, and asking vs assessment ratio into a "Seller Motivation Score":

🔴 High motivation (60+ DOM, 2 price drops, assessment gap)
🟡 Medium motivation (30-60 DOM, 1 price drop)  
🟢 Low motivation (fresh listing, priced at market)

Show as a badge on deal cards. "Motivated seller" is already one of our stat tiles — this makes it quantified and per-deal rather than just a DOM filter.


---

## Infrastructure & Technical Debt

### 116. Deploy Script — Automate Frontend Deployment
**Priority:** 🔴 · **Effort:** S · **Category:** Infrastructure

Current deployment is 5 manual steps per file per change. Automate:

```bash
./deploy.sh roofrank-deal-detail.html
# Fixes curly quotes
# Updates localhost → production URL  
# Copies to frontend folder
# Git adds, commits, pushes
# Done in 1 command
```

---

### 117. Migrate Frontend to React / Next.js
**Priority:** 🟡 · **Effort:** XL · **Category:** Infrastructure

Current HTML files don't scale. Issues:
- Manual deployment pain
- No component reuse
- Media queries can't fully solve mobile vs desktop UX differences
- No routing, no state management

**Trigger:** After 20 paying users and product is stable.
**Stack:** Next.js + Tailwind + existing API

---

### 118. Mobile CSS Override Layer
**Priority:** 🔴 · **Effort:** M · **Category:** Infrastructure

Before React migration, add a shared `mobile.css` that handles mobile layout properly across all pages. Reduces the media query sprawl in each individual file.


---

## MVP Scope Items

### 119. Rebuild Onboarding — 3 Steps, No Forms
**Priority:** 🔴 MVP · **Effort:** M · **Category:** Product

Rebuild onboarding from scratch. Current flow is a form that collects data it doesn't use. New flow shows value immediately.

**Step 1 — The Hook**
Show a real live deal (top scoring deal from feed) on first screen. No name/email collection (already have it from signup). One CTA: "Show me my full feed →"

**Step 2 — One Question**
```
What describes you best?
[ New investor — first deal ]
[ Active investor — growing ]
[ Agent — sharing with clients ]
```
Answer changes: feed sort, tooltip visibility, highlighted features.

**Step 3 — Markets**
```
● Lynn, MA     [Live · 24 deals]  ✓
● Worcester    [Live · 15 deals]  ✓
○ Boston       [Coming soon]
○ Lowell       [Coming soon]
```
Real counts. Honest about live vs coming soon. Tap to follow.

**Final screen:** Animate directly into dashboard — no "you're all set" screen. The transition IS the payoff.

**What gets cut:**
- Name collection (redundant)
- Email collection (redundant)
- "Score your first deal" step (fake data, confusing)
- Static "you're all set" screen

---

### 120. AI Analyst — Standalone Chat Page
**Priority:** 🔴 MVP · **Effort:** M · **Category:** AI Features

Standalone AI chat page accessible from nav bar. Not deal-specific — for market questions, education, strategy.

**Examples:**
- "What's the Lynn market like right now?"
- "Is a 1.05 DSCR acceptable for a first deal?"
- "Explain cap rate like I'm a beginner"
- "Should I be buying in this rate environment?"

**Differentiator vs ChatGPT:** Knows RoofRank data — can say "there are 3 Buy deals in Lynn right now" or "average cap rate in Worcester this week is 5.8%"

**Nav label:** "Analyst" (consistent with "Ask the Analyst" on deal detail)

**Paywall:**
- Free tier: 3 questions/month
- Pro: Unlimited

**Location:** Main nav — `Feed | Analyzer | Analyst | Watchlist`

**Backend:** New endpoint `/api/ai/analyst` — same Claude setup but with market context instead of deal context. Inject live feed stats (deal counts, avg scores, top deals) into system prompt.

**UI:** Clean full-page chat. Dark green header. Shows example questions on first load. Conversation history maintained in session.

---

### 121. MVP Checklist — Pre-Launch Gates
**Priority:** 🔴 MVP · **Effort:** — · **Category:** Product

Nothing ships until all of these pass:

**Data:**
- [ ] No fake data anywhere (landing, onboarding, dashboard)
- [ ] Nightly ingestion running automatically
- [ ] Lynn + Worcester real data verified accurate

**UX:**
- [ ] Zero console errors on all pages
- [ ] Mobile deal detail renders correctly
- [ ] Onboarding rebuilt (item 119)
- [ ] Analyzer defaults blank, pre-populates from deal correctly

**AI:**
- [ ] Ask the Analyst working on deal detail
- [ ] AI Analyst page live (item 120)
- [ ] Responses accurate and not hallucinating

**Auth + Billing:**
- [ ] Login/signup flow flawless
- [ ] Free tier limits enforced
- [ ] Stripe checkout tested end to end
- [ ] Upgrade flow works

**Performance:**
- [ ] API stays up without manual restarts
- [ ] Page load < 3 seconds on mobile
- [ ] No CORS errors in production


---

### 122. SMS Alerts — Primary Notification Channel
**Priority:** 🔴 MVP · **Effort:** M · **Category:** Product

Replace email as primary alert channel with SMS. Email for billing/receipts only.

**Provider:** Twilio (~$0.0079/text)
**Cost at 100 users × 1 text/day:** ~$24/month

**Alert types:**
1. **Strong Buy alert** — new deal hits 75+, text immediately
   ```
   RoofRank: New Strong Buy in Lynn —
   82 Linwood St scored 87.
   +$1,438/mo CF · 26 days listed
   roofrank.io/deal/[fid]
   ```

2. **Price drop on watchlist** — asking price drops since save
   ```
   RoofRank: Price drop on your watchlist —
   82 Linwood St dropped $25K (now $760K)
   roofrank.io/deal/[fid]
   ```

3. **Morning brief** — daily 7am, Pro only
   ```
   RoofRank Morning Brief · Lynn + Worcester
   Top deal: 58 Laighton St (87) +$2,384/mo
   2 new listings overnight · 1 price drop
   roofrank.io
   ```

**Paywall:** Pro feature only
**Opt-in:** Required at onboarding — "Get text alerts for Strong Buys in your markets" checkbox
**Opt-out:** Reply STOP at any time (TCPA compliance)
**Legal:** Add SMS consent language to signup and onboarding

**Implementation:**
- Add `phone` field to user profile
- Twilio SDK in backend
- `POST /api/notifications/subscribe` — save phone + preferences
- Trigger on ingestion when score ≥ 75
- Trigger on nightly price check vs saved watchlist prices

**Keep email for:**
- Welcome email (one-time)
- PDF report delivery  
- Billing receipts
- Password reset


---

## 🔄 Strategy Changes — May 15, 2026

Captured here so future reviewers understand why specific items moved.

### Promoted to MVP
- **#61 Negotiation Coach** — user identified this as essential differentiator vs. Excel/calculators. Pairs naturally with deal detail's "Make it Work" card.
- **#80 Tax Benefits Panel** — user noted serious investors evaluate deals net-of-tax. Pre-tax CF alone hides the real return. Significant trust signal for the experienced-investor segment.
- **#81 Payback Period Visual** — natural pairing with #80; combines cash flow + rent growth + tax savings into "years to get my money back," a number investors already think in.

### New MVP gates added
- **#123 Brand decision** — RoofRank refined vs Deckers, deferred for now (user thinking)
- **#124 Roof silhouette tier-color** — see `roof-options.html` for A/B/C side-by-side. Pick determines mark treatment across dashboard, deal detail, landing.

### Deferred (no longer in MVP critical path)
- **#1 Search & Filter on Dashboard** — replaced by Lenses + Ask the Analyst overlay. Address search alone may resurface later as a Cmd+K palette.
- **#21 Market Trends Dashboard** — superseded by AI Market Intelligence Strip (#95) for the conversation-first surface.
- **#25 Mockup Scores Match Real Data** — landing redesigned, no longer applicable.
- **#32 / #71 AI narrative repositioning** — done as part of landing rebuild.
- **#60 Social Proof on Landing** — user explicitly removed fake testimonials. Reintroduce only with real quotes post-launch.
- **#117 Migrate to React/Next.js** — defer trigger raised from 20 paying users to 50. Vanilla HTML + service worker is fine at current scale.

### Dropped (strategy-misaligned)
- City-filter UI on dashboard — replaced by lens system
- NE-specific positioning on landing — gone, national multifamily now
- 2–30 unit scope on landing — narrowed to 2–6 units
- "Powered by AI" badge — sparkle + first-person voice carries it

### New ops/infra items (ship-time)
| # | Item | Priority |
|---|---|---|
| 125 | gh CLI auth as devnestdynamics (or add alijsheikh as collab to private repos) | 🟡 Phase 2 |
| 126 | Rotate the `roofrank-deploy` PAT — expires Jun 9 2026 | 🟡 Phase 2 |
| 127 | Wire `AWS_*` + `ECR_*` secrets in roofrank-infra repo so deploy.yml runs | 🔴 MVP — see #43 |
| 128 | First push of roofrank-backend `.env.example` (not yet in repo) | 🟡 Phase 2 |
| 129 | Mobile-test PWA install flow on iOS + Android once live | 🟡 Phase 2 |

---

## 🆕 New MVP Ideas for Review — May 15, 2026

Surfaced during analyzer-direction conversation. All low–medium effort, high-impact. Decide which make MVP cut.

### 130. Score the property you already own
**Priority:** 🔴 MVP candidate · **Effort:** S · **Category:** Onboarding / Conversion

During onboarding ask "Do you own multifamily? Score it." Hooks the user with personal stake before they look at strangers' deals. Becomes the first watchlist item. Drives immediate aha moment we currently lack.

---

### 131. Empty-state-as-conversion
**Priority:** 🔴 MVP candidate · **Effort:** S · **Category:** Conversion

Today empty states (no Strong Buys this week, zero deals in market) are blank. Replace with conversational upsell: "There aren't any Strong Buys in Worcester this week — Pro alerts you the minute one hits." Every empty state should sell something.

---

### 132. Pro trial triggered by friction
**Priority:** 🟡 Phase 2 · **Effort:** M · **Category:** Conversion

Third time a free user hits a lens lock or long-tail blur, auto-grant 24 hours of Pro. Removes the upgrade-decision moment for the already-engaged user. Track conversion rate from auto-trial.

---

### 133. "What changed since yesterday" badge
**Priority:** 🔴 MVP candidate · **Effort:** S · **Category:** Retention

Top of dashboard on returning visit: "2 new Strong Buys, 1 price drop on your watchlist, your top-saved deal went up 4 pts." A reason to open the app every morning. Works without email/SMS.

---

### 134. Public shareable deal URLs
**Priority:** 🟡 Phase 2 · **Effort:** M · **Category:** Growth

`/share/<deal-id>` shows score + 3 key metrics + a snippet of AI narrative, no login required. Login gates the full Pro analysis. Every Pro forwarding a deal becomes organic acquisition.

---

### 135. PWA push notifications
**Priority:** 🔴 MVP candidate · **Effort:** M · **Category:** Retention · **Status:** Frontend done — awaits VAPID keys + backend

"🔔 New Strong Buy at 58 Laighton" push notifications, free, replace #122 SMS for installed users.

**Frontend shipped May 15:** `service-worker.js` has push + notificationclick + pushsubscriptionchange handlers; `push.js` exposes `window.Push.{status,subscribe,unsubscribe}`; "Enable push alerts" button wired in dashboard More sheet.

**Open dependencies:**
1. Generate VAPID keys (`npx web-push generate-vapid-keys`), save private to Secrets Manager, plug public into `window.ROOFRANK_VAPID_PUBLIC_KEY` before `push.js` loads.
2. Backend endpoints (in roofrank-backend): `POST /api/notifications/{subscribe,unsubscribe,resubscribe}` + a `pushAll(userId, payload)` helper using `web-push` npm.
3. Wire triggers: ingestion sees a Strong Buy → push to all matching subscribers; nightly watchlist diff → push price drops to owners.

iOS caveat: only fires for installed PWAs (Add to Home Screen).

---

### 136. Score explainability sheet
**Priority:** 🔴 MVP candidate · **Effort:** S · **Category:** Trust

Tap any score → modal showing each metric's contribution to the final number. Today scoring is a black box. Glass-box version cuts "how is this scored?" support load and builds trust.

---

### 137. Confidence per estimate
**Priority:** 🟡 Phase 2 · **Effort:** M · **Category:** Trust

"Very confident on Cap Rate (3 recent comp sales). Less confident on rent (HUD only, no recent local comps)." Honesty as a feature. Differentiates from black-box competitors.

---

### 138. 404 + offline pages
**Priority:** 🟡 Phase 2 · **Effort:** S · **Category:** Polish

Currently the default browser pages. Hand-craft both — 404 should be the analyst saying "I couldn't find that. Want me to check the feed?" Offline page works via service-worker fallback.

---

## 📦 Items Deferred from MVP — May 15

- **#122 SMS Alerts** — defer. PWA push notifications (#135) cover the same job at $0/mo. Revisit if PWA install rate is low post-launch.
- **roofrank-reports.html (standalone page)** — defer. Removed from nav. ReportsAPI still works server-side, surface as a tab in account settings later.
- **roofrank-watchlist.html (standalone page)** — defer. Removed from nav. WatchlistAPI still works; saved deals can surface as a dashboard tab post-launch.

## 🔄 Items Promoted from Phase 2

- **#110 Investor Profile Builder** — was Phase 2, promote attention. Pairs with #133.
- **#113 Due Diligence Checklist** — was 🔴 priority but not on MVP list. Promote into MVP discussion.

## 🔁 Analyzer Direction Change

Old form-based analyzer pre-dates the AI-analyst pivot. Killing the 18-field form as the default surface. New direction (Option A):
- Default = "Score any address" single input (address + asking price)
- Auto-fetch property data when possible
- Fall back to 5-field short form when data missing
- Existing 18-field form survives as an "advanced — tweak assumptions" expandable
- Page renamed in nav: "Analyze" → "Add a deal"

See `roofrank-analyzer.html` for the v1 iteration.

---

### 139. Social proof — watcher count / activity signal
**Priority:** 🟡 Phase 2 candidate · **Effort:** S · **Category:** Conversion / Urgency

Show "N others watching this" or "Trending in Lynn" on deal cards + detail page to create urgency. Must scale honestly from 0 users to 1000s.

**Two-stage display:**
1. **When watcher count >= 3 (threshold):** Show absolute — "3 investors watching this deal"
2. **When count < 3:** Fall back to relative — "Trending in Lynn this week" (deal is in top 20% of activity for its market)

**Layered with time-windowed activity:**
- "Saved 4 times in the last 24h" — sudden activity creates more urgency than a stale cumulative count
- Only show when delta in last window > 0

**Layered with DOM-implied scarcity:**
- "2 deals like this went under contract in Lynn last month" — works at any user scale, doesn't require crowd

**Why the threshold matters:** Showing "0 watching" reverses the urgency signal. Showing "1 watching" is worse than not showing it. We need the absolute number to land as social proof, which requires a minimum of 3+ to read as crowd.

**Implementation:**
- Backend: `GET /api/feed/:id/watch-count` returns `{ count, recentCount24h, trendingInMarket }`
- Frontend: render on dashboard deal cards + deal-detail hero. Animated pulse on the dot when recent activity is non-zero.

---

### 140. House photos
**Priority:** 🟡 Phase 2 · **Effort:** M · **Category:** Product

Eventually add property photos, but selectively. Default approach:
- **Deal-detail hero only** — full-bleed at top, slightly desaturated so listing-agent gloss doesn't overpower our "honest analyst" voice
- **No photos on dashboard cards** — keeps the feed metric-first, avoids Redfin-clone vibes
- **No photos in chat/AI surfaces** — stays text-led

Sourced from RentCast listing data; CDN-cached. Lazy-loaded.

**Why selective:** Listing photos are marketing material. They make every deal look "good" because agents picked the best angles. Wholesale adoption would work against the data-driven brand position. Use sparingly, where the user has already chosen to engage.

---

## 🔔 Notification Strategy — Master Plan (TABLED for build, May 15)

**Status:** Strategy locked in this conversation. Build paused pending decisions on tier mix and open-house data. Pieces partially shipped: PWA push end-to-end live, basic `sendMorningDigest` template exists, `user_preferences` schema staged, `morningBrief.ts` service drafted but not wired to a cron yet.

### Core principle

> **An analyst stays quiet when the market is quiet.**
>
> Real estate moves slowly. A typical market sees ~1-3 new listings/week and a Strong Buy maybe every 1-2 weeks. Daily-brief-style cadence trains users to ignore us. The retention loop isn't "open every email" — it's "trust RoofRank to tell me when something matters."

### Tier matrix

| Channel | Starter (free) | Pro ($49/mo) | Team ($249/mo) |
|---|---|---|---|
| **In-app "Since last visit" strip** | ✅ Already shipped | ✅ | ✅ |
| **Weekly summary email (Sunday)** | ✅ Default ON | ✅ | ✅ |
| **Event-triggered email** (new SB, watchlist drop, score Δ) | ❌ — capped at 1 teaser email/month | ✅ | ✅ |
| **Daily morning brief email** | ❌ | ✅ Opt-in | ✅ |
| **Weekend amplified briefs (Fri PM + Sat AM)** | ❌ | ✅ Pro-default | ✅ |
| **Open house alerts on watchlist** | ❌ | ✅ | ✅ |
| **SMS alerts (high-priority signals)** | ❌ | ✅ Opt-in at upgrade | ✅ |
| **PWA push** | Free if installed (universal, not gated) | Same | Same |

Rationale: Free users get **enough to feel value + a sense of momentum** (weekly + in-app), nothing real-time. Pro gets the **active-investor cadence**. SMS specifically reserved for Pro because it's the most premium-feeling channel and has a real per-message cost.

### Signal taxonomy + cadence

| Signal | Email | SMS (Pro) | Push (installed) | Cadence |
|---|---|---|---|---|
| New Strong Buy in user's markets | ✅ Pro · within 1hr | ✅ within 30min | ✅ within 30min | Event-triggered |
| Watchlist deal price drop ≥1% / ≥$1K | ✅ Pro · immediate | ✅ immediate | ✅ immediate | Event-triggered |
| Watchlist deal score Δ ≥5 pts | ✅ Pro · daily roll-up | — | ✅ if Δ ≥10 | Daily 7am batch |
| Watchlist deal 30/60/90 DOM milestone | ✅ Pro · day-of | — | — | Daily 7am |
| Open house on watchlist deal | ✅ Pro · 48h prior | ✅ Pro · 24h prior | ✅ 24h prior | Event |
| Open house in user's markets (Pro only, opt-in) | ✅ Pro · weekly summary | — | — | Friday brief |
| Weekly market summary | ✅ All · Sunday 8am | — | — | Cron |
| Daily morning brief (Pro opt-in) | ✅ Pro opt-in · 7am | — | — | Cron + adaptive content |
| 3 unopened emails in a row | Auto-downgrade prompt | — | — | Tracked opens |

### Weekend warming pattern (Pro)

Real estate's "rush hour" is Friday afternoon → Sunday evening. Pro users get an amplified weekend cadence:

- **Friday 4pm ET — "Weekend Brief"**: "Here's what to look at this weekend." Lists every open house on watchlist + matching markets, new listings hit in the past 48h, what would be worth touring.
- **Saturday 8am ET — "Today's Tours"**: Day-of summary of open houses + any overnight Strong Buys.
- **Sunday 8am ET — Weekly summary + "What's worth watching next week"**: This is the universal Sunday brief (also goes to Starter).

The Friday/Saturday cadence only fires when there's actual weekend activity to report — if no open houses + no new SBs, Friday email skips, Saturday skips. Sunday weekly always sends.

### Adaptive content for slow days (daily brief, Pro)

When the daily brief fires and nothing material moved, swap content tier by tier:

1. **Real news first** — new listings, price drops, score changes
2. **Aging insights** — "82 Linwood: now 23 days listed. Sellers typically discount after 30."
3. **Cross-market nudges** — "Lynn is quiet. Worcester just had 2 new Buys."
4. **Macro context** — "Treasury yields dropped 0.15% overnight. Your watched deals' DSCR just improved by ~0.03."
5. **Educational micro-content** — "Quiet morning. 90-second refresher on how I weigh DSCR vs. CoC."

Never copy yesterday's brief. Daily must always feel fresh; if we can't make it fresh, we don't send.

### Open house data — sourcing options

Data is the gating dependency for open-house alerts. Ranked by realism:

1. **RealtyMole / RentCast premium tier** — same parent as our existing listing source; ask about open-house fields in their MLS-grade data plan. Probably easiest path.
2. **HomeJunction API** — independent provider, has open houses, ~$200-500/mo.
3. **ATTOM upgrade** — they have it in higher tiers; we already integrate.
4. **MLS direct (Bridge/Trestle)** — gold standard, requires broker sponsorship. Long term.
5. **User-supplied** — when saving a deal, let them paste an open-house URL or date. Useful long tail.

For MVP-launch we say: "Open house alerts coming as data partners onboard." Don't fake it.

### Re-engagement / auto-protection

- **3 unopened daily briefs in a row** (Pro) → in-app banner: "Switch to weekly?" plus a one-click toggle in settings.
- **30 days of zero opens** (any plan) → soft pause emails, in-app strip says "I've stopped sending emails — re-enable when you're ready."
- **Bounce / complaint** → immediately mark opt-out (Resend webhook handles this).

### What's already done (don't rebuild)

- ✅ PWA push end-to-end (VAPID generated, frontend wired, backend routes deployed, table migrated in prod). #135
- ✅ `service-worker.js` push/click/rotation handlers
- ✅ Strong Buy push fanout in ingestion worker — fires on score ≥75
- ✅ Watchlist price drop push trigger — fires on ≥$1K + ≥1% drop
- ✅ "Since last visit" in-app strip on dashboard — #133
- ✅ `sendMorningDigest` email template (basic — needs personalization upgrade)
- ✅ `sendStrongBuyAlert` email template
- ✅ Resend account + API key + domain DKIM verified (SPF pending propagation as of May 15 evening)
- ✅ `user_preferences` schema designed (morningBriefEmail, strongBuyAlertEmail, priceDropAlertEmail, lastBriefSentAt) — migration generated locally as 0002_many_stranger.sql, NOT yet applied to prod
- ✅ `src/services/morningBrief.ts` drafted — builds personalized payload, cron entrypoint, per-user test path

### What needs to ship to make this real

**Phase A — Weekly + event-triggered foundation (ship first)**
1. Apply 0002_many_stranger.sql to prod DB (after roofrank-backend is redeployed with the schema change committed)
2. New email template: `sendWeeklySummary` — Sunday cadence, all opted-in users
3. Rename `morningBrief.ts` logic to support weekly mode (sendBriefToUser already has the structure)
4. Wire 3 event-triggered email senders:
   - Strong Buy detected in ingestion → `sendStrongBuyEmail` per matching user
   - Watchlist price drop → `sendPriceDropEmail` per watcher
   - Watchlist score Δ ≥5 daily roll-up → `sendWatchlistDailyEmail`
5. Cron entries (BullMQ or AWS EventBridge): Sunday 8am ET for weekly, daily 7am ET for watchlist roll-up
6. Frontend: opt-in toggles in More sheet for all 3 email types (default ON)
7. Re-add `/api/notifications/preferences` GET/PATCH endpoints
8. Unsubscribe link in every email (token-based, no login required) → respects opt-out

**Phase B — Pro tier + daily + adaptive content**
1. Plan check before each email send (Starter → only weekly, Pro → all)
2. `sendDailyBrief` email — Pro opt-in, adaptive content fallback (aging, cross-market, macro, educational)
3. Friday/Saturday weekend cadence
4. Re-engagement: track opens (Resend webhook), auto-downgrade after 3 unopened

**Phase C — SMS (Pro-only)**
1. Twilio account + verified sender number
2. `sendSmsAlert(userId, payload)` service mirroring `pushToUser` signature
3. SMS opt-in at Pro upgrade (capture phone, double opt-in via consent text)
4. Wire to Strong Buy + watchlist price drop signals (Pro accounts only)

**Phase D — Open houses**
1. Audit data partners (RealtyMole tier, HomeJunction, ATTOM)
2. Add `open_houses` table once we have a source
3. Friday weekend brief includes open houses on watchlist + matching markets
4. Push + SMS 24h prior for watchlist matches

### Open product questions

1. **Starter teaser email cap** — is 1/month right? 1/week feels like marketing spam. 1/month feels respectful.
2. **Daily brief Pro default** — opt-in OFF (user must enable) or opt-in ON (must disable)? My vote: OFF. Users opt INTO daily, opt OUT of weekly.
3. **Weekend cadence for free users** — should Starter get Saturday open house data too as an upsell signal ("3 open houses today in your markets — Pro shows them all")? Worth A/B.
4. **PWA push gating** — currently universal. Question: should we promote it more aggressively to Pro? My vote: no, keep it universal. Push is the modern equivalent of an SMS alert without the cost; gating it cheapens Pro.


---

## 🎯 Multifamily-Native Wedge — MVP Scope Candidates (May 15)

The strategic insight: **every competitor (DealCheck, BiggerPockets, Mashvisor) was built for single-family rentals and bolted on multifamily as an afterthought.** Their data models assume 1 unit = 1 rent = 1 tenant. We can be the only product that's natively multifamily, scoped tight to 2-6 units (residential financing range, the bulk of "small landlord" inventory).

These features carry the wedge. Revisit + prioritize against current MVP items.

### 141. Per-unit rent override on deal detail
**Priority:** 🔴 MVP candidate · **Effort:** M · **Category:** Product

Show HUD FMR estimate broken down by unit + bedroom count. Let investor type their actual per-unit rent and recalculate score live. Single most multifamily-native feature we could ship — competitors literally cannot do this because their data model is single-rent.

UI: deal detail page, between hero and analyst card. Default to HUD/RentCast estimate. On override, score and CF refresh inline.

### 142. Unit-mix-aware scoring
**Priority:** 🔴 MVP candidate · **Effort:** L · **Category:** Product · Scoring engine

A 4-unit with 4×1BR scores differently than 4-unit with 2×2BR + 2×3BR. Different rent per door, different vacancy risk, different exit comps. Today we treat them as the same. Multifamily investors know this matters; we should reflect it.

### 143. Owner-occupier scoring mode
**Priority:** 🔴 MVP candidate · **Effort:** M · **Category:** Product · Scoring engine

Toggle on deal detail: "I'd live in one unit." Recalc with one unit's rent zeroed out, but use FHA-friendly financing assumptions (3.5% down, lower rate). Surface effective cap rate, monthly housing cost vs renting, exit timeline (must occupy 1yr). Owner-occupier is a huge MF strategy nobody else surfaces.

### 144. Per-door price vs. market benchmark
**Priority:** 🟡 Phase 2 candidate · **Effort:** M · **Category:** Product

Already partially in scoring. Promote to a headline metric on deal detail: "$262K/door · 18% above Lynn market avg." Compares against actual recent transactions in the city + unit count band. The "are you overpaying per door" question is what experienced MF investors ask first.

### 145. Tenant-mix risk scoring
**Priority:** 🟡 Phase 2 candidate · **Effort:** S · **Category:** Scoring engine

A 2-unit loses 50% income when 1 vacates; a 6-unit loses 17%. Bake this asymmetric risk into the DSCR variance + factor it into the score. A 2-unit at marginal DSCR is meaningfully riskier than a 6-unit at the same DSCR — we should show that.

### 146. Triple-decker / vintage archetype warnings
**Priority:** 🟡 Phase 2 candidate · **Effort:** M · **Category:** Product · AI

Pre-1920 NE buildings have predictable risk patterns: cast iron pipes, knob-and-tube, lead paint, foundation settling, deferred maintenance budgets. Surface these as part of the due-diligence checklist (related to #113). The analyst voice can lead with: "1907 triple-decker. Budget $15-20K for deferred maintenance in year 1."

### 147. RentCast units bug — investigate + fix
**Priority:** 🔴 MVP · **Effort:** S · **Category:** Data quality

Suspected: RentCast doesn't always populate the `units` field for small multifamily, so we fall back to a propertyType lookup that defaults to **2 units** for unknowns and **6 units** for `Multi Family`. Both wrong for most actual listings.

**Fix path:** when units is missing or 0, derive from bedrooms (assume avg 2BR/unit) instead of defaulting blindly. OR, get ATTOM-enrichment running for every listing (#33 shipped) and use ATTOM's unit count when available. Flag listings with "unverified" unit count in the UI rather than guessing silently.

Quick investigation needed in `src/workers/ingestionWorker.ts` → `estimateUnits()` function and the upsertListing path. Add logging on every listing where units came from a fallback.


---

### 148. Founder concierge — 1:1 onboarding for first 100 Pro signups
**Priority:** 🟡 Phase 2 candidate · **Effort:** S · **Category:** Conversion / GTM / Founder-led growth

Personally onboard the first 100 Pro signups via 30-min Calendly calls. Framed as a launch motion ("I'm personally onboarding our first 100 customers"), NOT as a permanent Pro tier feature.

**Why this works in early days:**
- Highest-leverage product research possible — every call surfaces what users actually struggle with
- Strong conversion lever — "book a call with the founder" closes warm leads
- Outsized word-of-mouth in the first 6 months
- The constraint (100 spots) creates urgency
- Selection filter — people who book are higher intent
- Pricing justification without changing the pricing card

**Why it fails if framed wrong:**
- "Personal onboarding" in the Pro pricing card → you're a permanent CSM at user #800
- Mixing onboarding (UX) with investment education (content) → calls become teaching sessions that don't scale

**Three-call structure (in this order, every time):**
1. Listen to their actual use case (15 min) — best product research possible
2. Walk through the product (10 min) — show, don't tell
3. One forcing-function question (5 min) — "What would make this a $99/mo product for you?" or "If you canceled in 30 days, what would the reason be?"

**Graduation plan — write this DOWN before call #1:**
| Phase | Users | What |
|---|---|---|
| 1 | 1-100 | 1:1, founder-led, 30 min, free |
| 2 | 100-500 | Weekly group office hours, founder-led, free for all Pro |
| 3 | 500-2K | Self-serve onboarding video + AI walkthrough + "book a call" link for Team only |
| 4 | 2K+ | Concierge for Team only, full self-serve for Pro |

Without a graduation plan you'll still be doing 1:1s at user #800 wondering why you can't build product.

**Minimal infrastructure (ships in ~half a day):**
1. Calendly account + a 30-min "Founding Member Onboarding" event type
2. Pro signup success page: "Book your founding-member onboarding call" CTA → Calendly embed
3. In-app banner for first-week Pro users who haven't booked: "I'm offering 1:1 sessions to our first 100 Pro members — N spots left this week" (pull N from Calendly availability)
4. Email trigger at day 3 if no booking yet (uses Resend infra once verified)
5. **Backlog reminder to retire the offer at user #100** — forcing function so we don't drift

**Don't try to teach investment concepts on these calls.** Investment education is a content problem (blog + onboarding tooltips + standalone Analyst page), not a 1:1 problem. Personal onboarding shows them how to use RoofRank on THEIR specific deal/market. Two different products; don't conflate.

**Comparable companies:** Superhuman (3 years of founder onboarding, 90% retention), Linear (first 1000 customers founder-onboarded), Notion (founders DM'd every early user). Counter-examples: many $5-10M ARR B2B SaaS where "personal onboarding" became a permanent yoke.

---

### 149. Verify Worcester (and other city) HUD FMR numbers + add periodic re-check
**Priority:** 🟡 Phase 2 · **Effort:** S · **Category:** Data quality

The Worcester FMR table entry was hardcoded as a Lawrence proxy until May 16, 2026, when it was replaced with conservative Worcester MA Metro estimates (2BR $1694 / 3BR $2108 / 4BR $2343 — gross). These were swapped in without API access to the canonical HUD FY2026 Worcester publication.

**Verify:**
1. Pull official HUD FY2026 Worcester MA Metro FMR from huduser.gov directly (requires HUD API key registration)
2. Cross-check against Section 8 Payment Standards published by Worcester Housing Authority
3. Cross-check against landlord-collected market rents for Worcester triple-deckers observed in actual deals over Q3 2026
4. Update the table; bump `rentEstimate.version` (currently `fmr-fy26-v2`) so re-scored deals can be identified

**Add periodic check:** HUD updates FMRs every October (federal FY). Add to ops calendar as an annual task; ideally also write a smoke test that fails if values look stale (>14 months since last update).

**For other cities in the table**, run the same verification. Lynn currently uses the LHAND Payment Standards Jan 2026 (Boston metro FMR) which is at the high end — worth verifying it matches actual Lynn triple-decker rents.

---

### 150. Comp-based rent estimation as a tier 2 source
**Priority:** 🟡 Phase 2 · **Effort:** L · **Category:** Data quality

HUD FMR is what Section 8 vouchers will pay — not what landlords actually collect on the open market. For Pro users we should layer in market-comp-based rents:

1. Pull RentCast's `/avm/rent/long-term` for each scored deal (returns rent estimate + low/high range + comparable rentals)
2. Pull ATTOM's rental comps from `/property/expandedprofile` if available
3. Compute weighted median of comps, filter to same zip + bedroom tier + similar sqft
4. Surface in deal-detail UI as second signal: "HUD estimate: $X · Market comps: $Y"
5. Let user pick which to use (related to per-unit override #79)

This becomes the wedge feature that differentiates RoofRank from BiggerPockets / DealCheck — they all use HUD FMR or template assumptions.

---

## 🔑 MLS-Gated Killer Features — for review (May 16, 2026)

These features unlock once we have real MLS data (SimplyRETS / Repliers / etc. — requires broker sponsorship). Adding to backlog so we can prioritize when data partnership lands.

### 151. Distressed Deal Radar
**Priority:** 🔴 MVP candidate (once MLS lands) · **Effort:** S · **Source:** `specialListingConditions` field

1-tap filter on dashboard: "Show me only foreclosures / short sales / estates / REO." Most marketable single feature in our pipeline — value-add investors' first question on every deal. Promote as Pro-tier "Distressed Deal Alerts" with push notifications.

### 152. Real per-unit unit-mix (1BR/2BR/3BR per unit, not building total)
**Priority:** 🔴 MVP candidate · **Effort:** M · **Source:** `rooms` array with per-room dimensions (Repliers only — SimplyRETS likely too, need to verify)

Today we estimate per-unit bedrooms by dividing total by units. With MLS rooms data, we get actual per-unit unit-mix: "Unit 1: 2BR, Unit 2: 3BR, Unit 3: 2BR". Unlocks:
- Accurate per-unit rent (sum of correct FMR tiers, not weighted approximation)
- Owner-occupier scoring (you live in the smallest unit, rent the rest)
- Per-unit override feature (#79) becomes pre-filled, not blank

If Repliers exposes this well, it's a deciding factor over SimplyRETS.

### 153. Vacancy / occupancy detector
**Priority:** 🟡 Phase 2 · **Effort:** S · **Source:** `showingInstructions` text parsing

Parse showing instructions for vacancy signals: "lockbox vacant" / "vacant — go anytime" / "24hr notice — tenant occupied" / "owner occupied". Surface as a badge on deal cards. Vacant + low price = high negotiation leverage. Tenant occupied = harder close.

### 154. Listing agent direct outreach
**Priority:** 🟡 Phase 2 · **Effort:** M · **Source:** `agent.contact.{email,cell,office}` + Claude

Surface listing agent contact on deal detail. Pro-tier: "Draft a question for the agent" — Claude generates outreach email about deferred maintenance, days on market, seller motivation. Click-to-copy or send via mailto/SMS.

### 155. MLS-grade price reduction tracker
**Priority:** 🟡 Phase 2 · **Effort:** S · **Source:** `originalListPrice` + `lastStatus` history array

Today we infer price drops between ingestion runs. MLS gives us authoritative history: "Listed Jan 15 at $850K, dropped to $799K Feb 22, dropped to $749K Mar 30, current ask $725K". Pair with #102 watchlist price alerts.

### 156. Repeat listing / re-list detector
**Priority:** 🟡 Phase 2 · **Effort:** M · **Source:** `sales` history + `lastStatus`

"This building sold 2018 for $480K, relisted 2021 (expired), back on market 2026 at $825K." Strong signal for problem properties. Surface as a warning card on deal detail.

### 157. Open house aggregator
**Priority:** 🔴 MVP candidate · **Effort:** M · **Source:** `openHouses` array

Friday afternoon brief: "3 open houses in your watchlist this weekend." Day-of push notification. Saturday morning email with map. Kills BiggerPockets for actual weekend deal-hunting. Connects to push notification work already shipped (#135).

### 158. Image-based condition tagging
**Priority:** 🟡 Phase 2 · **Effort:** S · **Source:** Repliers `imageInsights` (pre-computed)

Repliers tags photos with: "kitchen-renovated", "dated-bathroom", "original-flooring", "deferred-maintenance-visible". Combined with our distress flags, gives confident "this needs $40-60K of work" pre-purchase. Cheaper than running Claude vision ourselves ($0 vs ~$0.05/deal).

### 159. Co-agent / commission signal
**Priority:** 🟢 Phase 3 · **Effort:** S · **Source:** `coAgent`, `coopCompensation`

2.5% buyer agent commission vs 3% sometimes signals motivated seller (offering less to attract bidders). Subtle but stack-able with other signals.

### 160. Fresh per-property tax data
**Priority:** 🟢 Phase 3 · **Effort:** S · **Source:** `tax.taxAnnualAmount` + `taxYear`

Currently we cache ATTOM tax annually. MLS gives fresh per-listing tax. Catches recent reassessments that ATTOM hasn't updated. Affects DSCR + cash flow accuracy.

### 161. Building systems risk surfacing
**Priority:** 🟡 Phase 2 · **Effort:** M · **Source:** `property.foundation`, `property.heating`, `property.roof`, `property.parking`, year built

"Oil heat — $8-15K to convert to gas." "Slab foundation 1880 — settling risk." "Tile roof installed 2018 — clean for 20 years." Surface as a "Building Systems" panel on deal detail. Connects to Negotiation Coach (#61) — these are the things buyers leverage in offers.

### 162. Neighborhood-level filtering
**Priority:** 🟡 Phase 2 · **Effort:** M · **Source:** `mls.area`, `geo.marketArea`, `geo.county`

Today we filter by city. MLS exposes sub-city market areas (e.g., "Worcester West" / "Lynn Highlands"). Lets users target the actual neighborhoods they want, not whole-city averages.

### 163. Showing requirements as a leverage signal
**Priority:** 🟢 Phase 3 · **Effort:** XS · **Source:** `showingInstructions`

Listings requiring 48h notice = tenants engaged = harder to flip vacant after closing. Surface as a "Closing complexity: high" flag.

### 164. Lot dimensions / subdivision potential
**Priority:** 🟢 Phase 3 · **Effort:** M · **Source:** `property.lotSize` with dimensions

Big lots = subdivision / ADU potential. Surface lot size + zoning hint on deal detail. Could partner with municipal zoning APIs for "ADU eligibility" flag per address. NE-specific demand.

### 165. Lease type / NNN signal for commercial-leaning multi
**Priority:** 🟢 Phase 3 · **Effort:** XS · **Source:** `leaseType`

Some small multifamily is set up as NNN where tenants pay expenses. Materially different scoring math (lower expense ratio, higher CoC). Catch via leaseType field.

### 166. Per-deal rate + down payment overrides
**Priority:** 🔴 MVP candidate · **Effort:** S · **Source:** New `deal_assumption_overrides` table (mirror `deal_rent_overrides`)

Investors don't typically override taxes and insurance — those come from the bill or the carrier. But they DO override the financing assumptions on every deal: *"I can lock 6.25% with my lender"* or *"I'm putting 30% down on this one, not 25%."* Mirror the rent-override pattern (#79 shipped) so deal-detail exposes two more dials:
- **Mortgage rate** — preloaded with the live Freddie Mac rate; user can type their own
- **Down payment %** — preloaded with 25%; user can drop to 20% or push to 30%+

Backend re-scores on POST and stamps `reportData.assumptions` with `source: 'user-override'` so the P&I line reads "· you said 6.25%". Re-uses the existing `recomputeWithOverride` plumbing — just extends the input schema. Explicitly skip taxes/insurance overrides for now: low value, more UI noise.

### ~~167. Home-button signs the user out (bug)~~ ✅ FIXED 2026-05-16
**Priority:** 🔴 MVP candidate · **Effort:** XS · **Source:** Reported 2026-05-16

When signed in, clicking the Home nav link logs the user out instead of routing to the dashboard. **Root cause:** wasn't actually a sign-out — `Auth.clear()` was never called. The Home/logo links across every page point at `roofrank-landing.html`, which renders the marketing CTAs ("Sign In · Start Free →") regardless of auth state, so a signed-in user landing there *feels* signed out (and the rest of the marketing page is unhelpful when they came for the dashboard). **Fix:** added a tiny boot script at the top of `roofrank-landing.html` that reads `rr_token` from localStorage and `window.location.replace('roofrank-dashboard.html')` if present. Bypass via `?marketing=1` if a logged-in account wants to share/view the marketing page.

### 168. Rotate exposed AWS deploy key
**Priority:** 🟢 Phase 3 / hygiene · **Effort:** XS · **Source:** Pasted in Claude chat 2026-05-16 then deliberately reused

The current `roofrank-deploy` IAM access key (`AKIA3WKTSYVX2QHVM554`) was pasted into a Claude conversation transcript on 2026-05-16 while wiring up the backend deploy workflow. Decision at the time was to keep using it (it lives in GitHub Secrets on roofrank-backend and in `~/.aws/credentials` locally; the conversation log is the only "leak" vector).

When time permits — or on any deploy rotation cadence — rotate this key:
1. `aws iam create-access-key --user-name roofrank-deploy`
2. Replace `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` in GitHub Secrets on `roofrank-backend`
3. Update `~/.aws/credentials` locally via `aws configure`
4. `aws iam delete-access-key --user-name roofrank-deploy --access-key-id AKIA3WKTSYVX2QHVM554`

Better long-term: migrate the workflow from long-lived access keys to GitHub OIDC + an assumable IAM role (`aws-actions/configure-aws-credentials` supports `role-to-assume`). No static creds anywhere — eliminates this category of risk entirely. Larger change, defer to post-launch.

### 169. Multi-recipient alert routing for Pro (up to 3 numbers)
**Priority:** 🟢 Phase 3 / post-MVP · **Effort:** M · **Source:** Pricing iteration 2026-05-16

Pro users can add up to **3 phone numbers** (or push targets) that receive their RoofRank alerts. Stripe + a contacts UI on the Pro settings page. Each added recipient gets the same Strong Buy / Buy / watchlist push that the primary user gets, scoped to the primary's markets and watchlist.

**Why:** Several latent personas benefit from this single feature without us building the full Agent & Team tier:
- A **light agent** can put 1–3 investor clients on alerts as a soft service offering — without needing the $249 Team plan.
- A **buying pair** (spouse, business partner) can both be notified of the same deal — no shared-account gymnastics.
- An **investor-of-record + builder/operator** combo (e.g. one person holds the deal, another runs the rehab) can both stay in the loop.

This is a "halo" feature that **bridges Pro and Agent & Team** without forcing the user to upgrade or build a full multi-seat product. It also increases Pro stickiness (now the Pro user has 2 other people relying on the alert flow they set up).

**Defer to:** Post-MVP. Revisit alongside the pricing-wall re-evaluation. Could be a "Pro Plus" add-on at $10/mo if standalone Pro stays at $49.

**Implementation notes:**
- Reuse the existing push infrastructure (item 27 done) — broadcast to N tokens instead of 1.
- Phone numbers via SMS would require Twilio (item 122 backlog) — push notifications are cheaper.
- Privacy: each recipient should be able to unsubscribe directly from any alert.

### 170. Live stats strip on landing (replaces shallow stat bar)
**Priority:** 🔴 MVP · **Effort:** S · **Source:** Strategic review's landing fix #2 + 2026-05-16 honest audit

Replace the dark `30 sec / $0` stat bar (currently filler — "30 sec" repeats the hero claim) with **live per-market deal counts** from a new public backend endpoint:

> *Lynn: 24 · Worcester: 15 · Salem: 9 · Refreshed 2h ago*

**Why:** Single biggest credibility gap on the landing today. The page makes big claims ("watching every active 2–6 unit listing in your markets") with zero numbers proving the product is alive. A skeptical investor scrolls 4 sections deep without seeing a single piece of evidence. The strategic review explicitly called out *"1,247 deals scored this week across Lynn, Worcester, Salem"* as the fix.

**Implementation:**
- Backend: add `GET /api/public/stats/markets` returning `[{ city, activeCount, lastRefreshAt }]`. No auth (counts aren't sensitive).
- Frontend: replace `.stat-bar` markup; fetch on page load, render with the same dark forest treatment.
- Fallback: if endpoint fails, show static "Watching every active 2–6 unit listing in Lynn, Worcester, Salem."

---

### 171. Compare section visual upgrade
**Priority:** 🟡 Phase 2 · **Effort:** M · **Source:** 2026-05-16 honest audit

Compare section (3 cards: vs Excel, vs DealCheck, vs Enterprise) is still text-heavy — 2-3 paragraphs per card. Reads like a feature comparison spreadsheet. The rest of the page upgraded its visual game with animations, Deckers marks, chat bubbles, verdict blocks. This section didn't.

**Direction:** distill each comparison to a 1-line claim + a side-by-side visual contrast (what THEY make you do vs. what RoofRank does in one image/icon). Cut word count by ~70%.

---

### 172. "Try it before signup" interaction on landing
**Priority:** 🟡 Phase 2 · **Effort:** M · **Source:** 2026-05-16 honest audit

Every Pinterest-quality landing has SOMETHING you can do before the auth wall — type an address, hover a sample, drag a slider. Right now ours is a brochure — read-only. One tiny interactive element ("Try the analyzer on a sample address →" with auto-fill) would change the energy from "marketing page" to "demo."

**Direction (cheapest version):** a hero-adjacent input that accepts an address, auto-completes it to one of the real Lynn deals (e.g. 58 Laighton), generates a fake fast-loading score animation, then CTA: *"Want yours? Sign up →"*.

---

### 173. Landing mobile QA sweep (proactive at 320 / 375 / 414)
**Priority:** 🔴 MVP · **Effort:** S · **Source:** 2026-05-16 honest audit

We've adjusted mobile breakpoints reactively (chip border barely visible flagged after build, layout shifts caught only at desktop testing). Need a deliberate sweep at iPhone SE (375), iPhone 14 Pro (393), Galaxy S22 (412) and the narrowest realistic device (320 / older iPhone SE). Walk every section, check:
- Hero CTA buttons not overflowing
- Stat bar / metrics chips wrap cleanly
- Brief mockup card not cramped, chat bubbles readable
- Metrics verdict + chips grid stacks correctly
- Pricing cards stack and remain scannable
- Hero phone mockup (post #178 build) hides or scales appropriately

---

### 174. Free → Pro upgrade UX (feature gating in product)
**Priority:** 🔴 MVP · **Effort:** L · **Source:** 2026-05-16 honest audit

The pricing wall is defined in copy (Starter = passive view, Pro = active engagement). But the product still shows everything to everyone. When a Free user clicks "Push alerts" or "Custom rate override," what happens?

**Required for honest launch:**
- Free users see locked badges on Pro features in the product (push alert toggle, custom rate slider, watchlist alert settings, daily email opt-in, CSV export).
- Clicking a locked feature → upgrade modal with the specific Pro benefit + price + trial CTA.
- Pricing copy promises must match product reality before public launch — otherwise we get reviews like *"They charged me $49 but everything works on Free."*

**Blocking dependency:** the actual product changes need to land before the landing copy claims are honest. Beta launch (weeks 11-12) requires this done.

---

### 175. Hero imagery audit + final treatment
**Priority:** 🟢 Phase 3 · **Effort:** S · **Source:** 2026-05-16 honest audit

After the hero deal-feed mockup gets replaced by the phone-push-notification mockup (item #178 below — done in this session), review remaining hero visuals:
- The background photo (`.hero-photo`) — does it still feel right with the decision-tool framing, or does it lean residential/aspirational in a way that conflicts?
- Overlay opacities / gradients
- Mobile hero crop behavior

Mostly a polish pass after the bigger Option C build.

---

### 176. OG image + social preview regen
**Priority:** 🔴 MVP · **Effort:** S · **Source:** 2026-05-16 honest audit

The current Open Graph image (`/og-image.png`) is from before the decision-tool reframe. When a user shares roofrank.io on LinkedIn, Slack, or Twitter, the preview probably still says *"An AI analyst for every multifamily deal"* — the old positioning we deliberately moved away from.

**Required:**
- Regen og-image.png to match new hero: `Know if a multifamily cashflows — in 30 seconds.` + Deckers mark + sage/forest brand colors.
- Update `<meta property="og:title">` and `<meta property="og:description">` on every page to match new positioning.
- Test share preview on LinkedIn/Twitter/Slack before launch.

Quiet conversion killer if missed — most traffic-driving moments (shares, link previews) flow through this asset.

### 177. Brand evaluation: DealDeckers vs RoofRank (post-MVP)
**Priority:** 🟢 Phase 3 / post-MVP · **Effort:** S (decision) + L (if executing rebrand) · **Source:** Surfaced 2026-05-16 — dealdeckers.com is available

`dealdeckers.com` is currently available. The name combines "Deal" (real estate transaction) + "Deckers" (the established brand mark) and unlocks a `.com` domain — better than the current `roofrank.io`. Worth evaluating post-MVP.

**Cheap pre-decision move (do this now, separate from the rebrand):**
Register and park the domain (~$10/yr Namecheap). Doesn't commit to a rebrand. Preserves the option in case someone else snags it. Redirect to roofrank.io for now.

**Prerequisites before any actual rebrand:**
1. **Trademark research.** Deckers Brands (UGG, Hoka — apparel) holds the "Deckers" trademark in their class. Real estate is a different class so likely OK, but Deckers Brands is large and litigious. Need a trademark attorney to clear it before commit. (Same risk noted in #123.)
2. **Migration scope assessment.** Real cost: domain swap, all OG/meta on every page, repos (`roofrank-frontend`/`-backend`/`-infra`), GitHub handle (`devnestdynamics` already owns this), IAM users (`roofrank-deploy`), CSV/secret files (`roofrank-deploy_accessKeys.csv`), bookmarks/social, any user memory. Conservatively 1-2 days of grunt work.
3. **User research signal.** Get 5-10 target users to react to both names. Don't decide on founder instinct alone.

**Decision criteria:**
- Does "Deal Deckers" feel more memorable to active investors than "RoofRank"?
- Is the trademark friction tolerable per legal opinion?
- Does the .com gain meaningfully outweigh the migration cost?

**Defer to:** Post-MVP, after we have actual users to ask. Strategic review (May 16) explicitly listed brand pivot as out-of-scope for the 90-day launch path.

Related: #123 (Brand decision RoofRank vs Deckers, deferred May 15).
