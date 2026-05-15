# RoofRank Product Backlog

**Last updated:** May 15, 2026

---

## 📊 Backlog Stats

| Status | Count |
|---|---|
| ✅ Done | 22 |
| 🔴 MVP Scope | 16 |
| 🟡 Phase 2 | 55 |
| 🟢 Phase 3 / Backlog | 32 |
| ❌ Dropped (strategy change) | 6 |
| **Total** | **131** |

---

## 🚀 MVP Scope — Must Ship Before Launch

| # | Item | Status |
|---|---|---|
| 27 | Ask the Analyst — AI chat | ✅ Done — deal detail + dashboard |
| 28 | AI Deal Narrative — Analyst quality | ✅ Done — Claude-generated, cached |
| 61 | Negotiation Coach (with comps) | 🔴 MVP — promoted from Phase 2 (May 15) |
| 80 | Tax Benefits Panel (after-tax CF) | 🔴 MVP — promoted from Phase 2 (May 15) |
| 81 | Payback Period Visual | 🔴 MVP — promoted from Phase 2 (May 15) |
| 99 | Analyzer PITI Consistency Fix | 🔲 Todo |
| 100 | Replace Fake Landing Page Data | 🔲 Todo |
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

### 2. "Last Updated" Timestamp on Dashboard
**Priority:** 🔴 · **Effort:** S

Show "Updated X hours ago" below the feed header. Critical trust signal — investors need to know data is fresh.

---

### 3. Analyzer Defaults to Blank
**Priority:** 🔴 · **Effort:** S

Analyzer pre-fills Freeman St data. New users see someone else's deal. Default to blank or last-used values.

---

### 4. Deal Detail Page Title Shows Address
**Priority:** 🔴 · **Effort:** S

Browser tab shows "RoofRank — Deal Detail" for every deal. Should say "RoofRank — 88 Park Ave" so bookmarks are meaningful.

---

### 5. Pricing Page Error Handling
**Priority:** 🔴 · **Effort:** S

No toast, no catch block, no feedback if Stripe call fails. Add error handling and fallback message.

---

### 6. Footer on All Pages
**Priority:** 🔴 · **Effort:** M

Every page is missing a footer. No privacy policy, terms of service, contact, or support. Legal exposure without it. Minimum: Privacy Policy, Terms, Contact, copyright line.

---

### ~~7. Rework Scoring to PITI-Only~~ ✅ DONE May 2026
**Priority:** 🔴 · **Effort:** M

Current scoring uses vacancy + management + maintenance which makes most deals score Pass. Switch to mortgage + tax + insurance only as base calculation. Show expenses as stress test toggle. Makes scoring reflect how real investors think.

---

### 8. Custom Rate Input on Deal Detail
**Priority:** 🟡 · **Effort:** S

Let investors input their actual rate. "My lender quoted 6.5%" — recalculate everything instantly. Already built in Analyzer — surface on deal detail.

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

### 26. Claude API Key — Add to Secrets Manager
**Priority:** 🔴 · **Effort:** S

Required before any AI feature. console.anthropic.com → API Keys → add to AWS Secrets Manager as `ANTHROPIC_API_KEY`.

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
