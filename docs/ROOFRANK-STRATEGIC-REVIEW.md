# RoofRank · Strategic Review

**Date:** 2026-05-16
**Author:** Claude (Opus 4.7), reviewing the live state of the codebase
**Audience:** Ali
**Launch target:** 90 days from today (~2026-08-14)

> This is a deep audit of where RoofRank stands, what's working, what isn't, and what to ship vs. cut. Read it slowly. Push back on anything that feels wrong — this is opinion grounded in evidence, not gospel.

---

## TL;DR · Letter Grades

| Dimension | Grade | One-line |
|---|---|---|
| **Thesis (the product idea)** | **B** | Right wedge, wrong primary output. You're selling a *score*; investors want a *decision*. |
| **Positioning / value prop** | **B+** | "AI analyst" framing is good but you're behaving like a feed reader. Mismatch is fixable. |
| **Landing page** | **B** | Copy is sharp. CTA promises something the onboarding doesn't deliver. |
| **Signup → first wow moment** | **C** | Onboarding asks 3 questions before showing value. The wow is buried. |
| **Daily UX (returning user)** | **B-** | Dashboard is information-rich but doesn't ritualize. No hook to open it tomorrow. |
| **Deal-detail (moment of truth)** | **B+** | Strong layout, just-shipped provenance hints raise it to B+. Still answers "what's the score?" not "what do I do?" |
| **Data accuracy / credibility** | **B+** | 24 hours ago this was a D. Today it's B+ and on a path to A. |
| **Technical foundation** | **B** | Ingestion is solid. Auto-deploy is broken. No tests. Auth bug just surfaced. |
| **Monetization clarity** | **C+** | 3 plans exist, but the *free → paid* trigger isn't pegged to a "I can't live without this" moment. |
| **Competitive differentiation** | **B-** | "AI" is doing too much work. DealCheck ($14-29/mo) is in the same ZIP. What's *only RoofRank*? |
| **Scope discipline** | **D** | 131 backlog items. 16 marked "MVP." You're not shipping an MVP; you're shipping a roadmap. |
| **Mobile experience** | **B** | Recent rebuild looks good. Untested at every size after the 2026-05-16 rebrand. |

**Overall: B-** with a clear path to A- in ~90 days of focused cuts.

---

## The Thesis · Is the Product Right?

The bet: *Individual investors looking at 2-6 unit multifamily are underserved by tools — DealCheck is generic, ARGUS is enterprise, Excel is exhausting. An AI that reads every listing, scores it, and writes them a morning brief is the analyst they can't afford to hire.*

**Where the thesis is strong:**
- 2-6 unit multifamily is genuinely underserved. ARGUS/Yardi don't show up. DealCheck is glorified Excel.
- Investors who buy 2-6 units have analyst budget but no analyst access.
- "Morning brief written by your analyst" is editorial. That's rare in proptech. Differentiated.

**Where the thesis is weak:**
- **You're selling a score; investors buy decisions.** A 87/100 doesn't tell me whether to offer $510K or walk. The actual job-to-be-done is "tell me what to *do*."
- **The market is small.** Individual 2-6 unit buyers do 1-3 deals/year. SaaS LTV from a single buyer is maybe $300-700. You need a *lot* of them, or a different buyer.
- **"Every listing in your markets"** is a feed. Feeds are passive. Investors want *alerts*, not feeds.

**The 360 question worth sitting with:**

> *Are you a tool for individual investors, or a tool for brokers/agents who serve investors?*

A broker with 20 active investor clients pays $500/mo for the right toolset and never churns. An individual investor balks at $29 and churns after they close. Same code, same data, **10× LTV**. Worth a serious thought — not for today, but for Q3.

---

## The First-Touch Walk-Through

### 1. Landing page

> **"An AI analyst for every multifamily deal."**
> Skip the Excel models. Move on the right deals first.
> **[Rank My First Deal Free →]**

**What's good:** Sharp headline. "Skip the Excel models" is a great unlock phrase. The product card preview is well-designed.

**What's broken:**
- The CTA says **"Rank My First Deal Free"** — but the actual flow is "Sign up → onboarding asks your markets → see ranked feed." The user never *ranks* a deal themselves first. The promise is "type your address, get a score." The reality is "sign up, give us 3 pieces of info, then look at a feed." **This is a small bait-and-switch and it'll hurt conversion.**
- No social proof. You correctly removed the fake testimonial. Replace it with truth: *"1,247 deals scored this week across Lynn, Worcester, Salem."* Numbers > made-up names.
- No "How it works" in 3 visual steps. The "8 metrics one score" section is good copy but text-heavy.

### 2. Signup → onboarding

3 steps: name → markets → goals.

**The problem:** Step 1 (name) is friction with no payoff. Step 2 (markets) is fine. Step 3 (goals) is *theater* — your feed isn't actually personalized by the goal selection. If it isn't, you're lying to the user about agency. If it is, the personalization is invisible.

**The bigger problem:** *None of those 3 steps deliver a wow moment.* The wow comes at step 4 when they finally see the feed. You're rationing the dopamine.

**What an Apple-grade onboarding would do:**

> **Step 1:** "Where do you invest?" → Lynn ✓
> **Step 2 (immediate):** "Here are 3 Strong Buys in Lynn this morning. The standout's 58 Laighton — 11.4% CoC."
> **Step 3 (optional):** "Want a daily brief? Drop your email."

The signup is *the reward*, not the gate. Skip-able email. The user is already inside before they've created an account.

### 3. The dashboard (the returning user)

Structure: Brief eyebrow → brief body → Today's Picks carousel → lens pills → main deal list → Show More (Pro-gated).

**What's good:**
- The brief is the right wedge. "I'm watching 2 Strong Buys in Lynn right now. The standout's 58 Laighton — 11.4% CoC." This is *the* voice that differentiates you. **Protect this at all costs.**

**What's broken:**
- **Too many sections for a phone.** Brief, picks carousel, lens pills, deal list, show-more, footer.
- **No "continue where you left off."** A returning user wants: "You opened 12 Howard yesterday. Still thinking about it? Here's an update."
- **Pro gating via blur is risky.** Free users see blurred deals and either upgrade or rage-quit.

### 4. The deal-detail page

**What's good:**
- The hero score block is iconic now (108px Deckers mark + tier-colored roof).
- Cash-flow legend has provenance hints (· actual / · city est / · Freddie X.XX%) — analyst-grade.
- Per-unit rent override is *world-class* for this segment. DealCheck doesn't have this.

**What's broken:**
- **No verbal verdict at the top.** The score is 87. So what? "**Strong Buy — best deal in Lynn this week**" should be H1. The number should be subtext.
- **No primary action on the page.** What do I do with this information? Make an offer? Tour? Save? Information-rich, action-poor.
- **AI narrative is long.** Lead with a 1-sentence verdict.
- **No "you said X" panel.** If I override rents and score jumps 71→87, show "Was 71. Now 87 with your numbers."
- **No sensitivity widget.** *"If rents drop 8%, this becomes a Watch."* That's what real analysts do.

### 5. Pricing

**What's broken:**
- The free → paid trigger isn't pegged to a "can't live without this" moment.
- Top recommendation should be opinionated.
- No money-back guarantee. For $29, refund risk = near zero, conversion lift = real.

---

## The 5 Biggest Blind Spots

### #1: You're building a feed, but the wedge is editorial

The brief is the moat. Treat the brief as the front page (WSJ-style), with the feed as supporting evidence. Right now it's reversed.

### #2: There's no track record

Investors will ask: *"You scored 58 Laighton as a Strong Buy. Did it actually cash flow?"* Build the audit trail NOW so 6 months from now you can publish outcomes. **This is the moat DealCheck doesn't have.**

### #3: The active-buyer problem

Active buyers = <5% of users. The other 95% are learning or waiting. You need a passive-mode value (market pulse, weekly digest, free newsletter) to keep them around between deals.

### #4: Scoring transparency

The 87 is opaque. Show the 8 metric grades inline on the score block. SB ✓ on CoC, SB ✓ on Cap, Watch on DSCR, Pass on Year Built. Audit-in-3-seconds = trust.

### #5: No referral / network effect

Investors are deeply social. No share-deal-with-partner, no group watchlist, no co-buyer. One share button per deal can seed virality.

---

## The 5 Strengths to Double Down On

1. **The brief voice** — editorial, specific, human. Don't dilute.
2. **The Deckers mark** — distinctive, scales from favicon to billboard. Trademark it.
3. **Provenance hints** on the cash-flow legend — no competitor does this.
4. **Per-unit rent override** — wedge feature. Brokers will pay for this.
5. **Speed/freshness** — "Live · 4h ago" + push notifications + 2am refresh is legitimately differentiated.

---

## The Cut List · What's NOT in v1

- ❌ AI Analyst chat (gated to Pro? defer to v1.1)
- ❌ Tax Benefits Panel (#80) — investor-known math
- ❌ Payback Period Visual (#81) — vanity metric
- ❌ Negotiation Coach (#61) — needs comp data depth you don't have
- ❌ Make-it-Work Offer Calculator (#105) — finish for v1.1
- ❌ SMS Alerts (#122) — push is enough
- ❌ All 15 MLS-gated features (#151-165) — pending broker sponsorship
- ❌ Stripe checkout testing — until pricing tiers are validated with 5 real users

**Replace the cut list with:** *a single-sentence verbal verdict on every deal-card and deal-detail*. "Strong Buy because rents 18% below market." That sentence is the wedge.

---

## Apple-Style Moves

1. **Kill the score number as the lede.** "Strong Buy. The number is 87."
2. **One CTA per page.** Dashboard: "Open today's pick." Deal-detail: "Add to watchlist" *or* "Calculate my offer."
3. **Hide the 8 metrics until asked.** Lead with cash flow ($/mo).
4. **Single-purpose pages.** Cut tabs/filters from primary surfaces.
5. **Animation as a tool, not decoration.** Keep tier-color shift. Kill scroll fades.

---

## Netflix-Style Moves

1. **Daily ritual hook.** "7 days in a row → streak badge."
2. **Continuation.** "You looked at 12 Howard yesterday. Price dropped $15K overnight."
3. **Personalized headline.** "Ali, I have one for you in Lynn this morning."
4. **Auto-play next.** Dismiss a deal → next deal auto-loads in the same slot.
5. **Because-you-looked-at recommendations.** Rooted in behavior.

---

## The 360 Questions Worth Sitting With

### Q1: Is the buyer a broker, not an investor?

Brokers manage portfolios of investor clients. Higher willingness-to-pay ($500-2000/mo), lower churn, multiplier effect. Add "share deal report" + "client folder" and you've doubled your TAM.

### Q2: Is "scoring" the wrong primary verb?

If you reframed RoofRank as *"the offer recommender"* — "Offer $510K, walk above $545K" — you're doing what Excel can't. Score becomes invisible plumbing.

### Q3: Should the daily product be a newsletter, not a webapp?

20× larger top-of-funnel. 1/10th the engineering. Investors get 10 newsletters/day; yours is one. Webapp becomes the upsell.

### Q4: Is "every listing" too commodity?

Zillow has every listing. Your edge isn't catalog, it's curation. Show 5 deals/day, not 50.

### Q5: Should the AI be a *character*, not a feature?

Keep RoofRank as the company. Give the analyst inside a name. "Verdict from your analyst, Reva." Personality is unforkable.

---

## The 90-Day Launch Path

A target you can hit without burning out. Each "week" assumes 10-15 hours of focused work; pad as needed for life.

### Weeks 1-2 · Foundation (Days 1-14)
- Fix #167 home-button signs user out
- Manual QA of Deckers rebrand on every page (every screen size)
- Confirm FRED rate fetch worked in prod (or fix the URL)
- Fix auto-deploy pipeline (multi-repo checkout in infra workflow)
- Zero console errors target

### Weeks 3-4 · The Verdict Layer (Days 15-28)
- Add 1-sentence "verdict reason" to every deal card and deal-detail (via Claude in the existing narrative pipeline)
- Move verbal verdict (Strong Buy / Buy / Watch / Pass) to H1 on deal-detail. Demote the number.
- Add 8-metric inline grade strip (CoC ✓ Cap ✓ DSCR ! Year ✗) to score block
- "You said X" panel when user overrides rents — show "Was 71 → Now 87"

### Weeks 5-6 · Onboarding Rebuild (Days 29-42)
- Cut the name step. Sign-in collects name.
- Step 1: "Where do you invest?" (single market)
- Step 2 (immediate): Show 3 picks from that market — before any email/account
- Step 3 (optional): Email for daily brief, skip-able
- Goal step deleted unless it actually drives personalization (it probably doesn't)

### Weeks 7-8 · Retention Loop (Days 43-56)
- "What changed since you last visited" — already partially built, finish
- "You looked at X yesterday" continuation row above the brief
- Streak counter on the brief eyebrow
- Named-analyst persona: "Reva says..." in the brief (use existing Claude pipeline, give signature voice)

### Weeks 9-10 · Trust & Track Record (Days 57-70)
- Public "Our scoring track record" page: every Strong Buy from May onward + current status (listed/closed/withdrawn/cash-flowing)
- Backend: persist deal status changes so the audit trail builds passively
- "What our scoring missed" — call out false positives honestly
- Stats strip on landing page: "Lynn: 24 · Worcester: 15 · Salem: 9 · Updated 4h ago"

### Weeks 11-12 · Polish & Beta (Days 71-84)
- Soft beta with 5-10 invited users from RE communities
- Gather usage signal: what's the most-clicked, most-shared, most-shrugged-at?
- Iterate on the verdict copy + onboarding based on behavior
- Pricing decision: lock free vs. paid based on actual upgrade requests

### Week 13 · Public Soft Launch (Days 85-90)
- 2 RE Facebook groups + 1 Reddit post + LinkedIn announcement
- Don't optimize pricing until first 50 users — observe what they actually pay for
- Have a "Why this score?" track-record link ready
- One pinned bug-report form. Triage daily.

### Out of scope for 90 days
- Per-deal rate/down-payment overrides (#166) — post-launch
- AI Analyst chat (currently Pro-gated) — defer to v1.1
- Stripe checkout polish — until pricing is validated
- All MLS-gated features (#151-165) — blocked on broker sponsorship
- Brand pivot (Birddog/etc.) — locked at RoofRank
- Auto-deploy is fine to fix in weeks 1-2 or punt to post-launch — manual works for low volume

---

## The Honest One-Liner Verdict

> *RoofRank is a B-grade product with an A-grade voice trapped inside an unfocused MVP. Cut 80% of the backlog, lead with the verbal verdict not the number, ship the brief as the hero (not the feed), and you have a $30M business inside 18 months. Keep adding, and you have a feature-rich app no one finishes onboarding for.*

You have something real. The brief voice, the Deckers mark, the per-unit rent override, the provenance hints — those are *not* generic. Those are the moats. Everything else is detail.

---

## Glossary (for future you)

- **Provenance hint** — the small gray suffix beside a financial line on the deal-detail page that tells the user where the number came from. Examples:
  - "Property Taxes $1,234/mo `· actual`" → ATTOM assessor (authoritative)
  - "Property Taxes $1,234/mo `· city est`" → city-calibrated lookup (e.g., Worcester 1.55%)
  - "Property Taxes $1,234/mo `· state est`" → state-average fallback
  - "Property Taxes $1,234/mo `· est`" → national default (last resort)
  - "Mortgage P&I $2,100/mo `· Freddie 6.83% · wk May 9`" → live Freddie Mac PMMS rate
  - "Mortgage P&I $2,100/mo `· est 6.5%`" → fallback constant when the live source failed
- **Verdict** — the four-tier signal (Strong Buy / Buy / Watch / Pass) plus a one-sentence reason. Currently the tier exists; the one-sentence reason doesn't (item for weeks 3-4).
- **Brief / Analyst's Brief** — the editorial dashboard header that summarizes the day in 2-3 sentences. The wedge.
- **Wedge** — a feature so differentiated that competitors can't copy it without re-architecting. Currently: brief voice, per-unit rent override, provenance hints, the Deckers mark.
- **Deckers mark** — the brand SVG: sage roof + 3 horizontal floor bars. Roof color shifts with tier in score contexts; stays sage in brand-lockup contexts.
