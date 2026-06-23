# RoofRank — Cost Tracking

**Last updated:** 2026-06-23
**Status:** Pre-launch. Most costs are infrastructure-fixed; per-transaction costs (Stripe, Anthropic, Resend, SMS) are negligible while idle.

This is the single source of truth for what RoofRank pays for. The old `ROOFRANK-RUNBOOK.md` cost table is stale (still listed Netlify, RentCast, Namecheap) — this doc supersedes it.

---

## 1. Quick summary

| Bucket | Active monthly | Idle monthly (with cost-reduction toggles applied) |
|---|---|---|
| **AWS infrastructure** | ~$110-140 | ~$5-15 (storage + secrets only) |
| **External APIs (ATTOM, Anthropic)** | Variable | ~$5-15 |
| **Email + SMS (Resend, SNS)** | Free tier | Free tier |
| **Payments (Stripe)** | 2.9% + $0.30 per txn | $0 if no txns |
| **Frontend + DNS (Cloudflare)** | Free | Free |
| **Domain** | ~$2/mo amortized | ~$2/mo amortized |
| **Observability (Sentry)** | Free tier | Free tier |
| **Estimated monthly total** | **~$120-160** | **~$15-30** |

Break-even at active cost: **~3-4 Pro subscribers** ($49/mo each).

---

## 2. AWS infrastructure (the bulk)

Account: `803871049071` · Region: `us-east-1` · Account tier: paid (upgraded from Free 2026-06-01)

| Service | Resource | Estimated monthly | Idle savings |
|---|---|---|---|
| **ECS Fargate** | 1 task, 0.5 vCPU / 1 GB RAM | ~$15-20 | **Scale to 0 = $0** |
| **RDS Postgres** | `db.t4g.micro` + ~20 GB storage | ~$15 compute + ~$3 storage | **Stop instance = ~$3 (storage only)** |
| **ElastiCache Redis** | `cache.t4g.micro` | ~$12 | **Delete cluster = $0** |
| **ALB** (Application Load Balancer) | 1 ALB + ~50 LCU | ~$20-25 | **Delete ALB = $0** (no longer reachable) |
| **NAT Gateway** | 1 NAT (us-east-1a) | **~$32 + data transfer** | **Delete NAT = $0** (backend can't reach internet) |
| **VPC** | Subnets, route tables, IGW | Free | — |
| **Secrets Manager** | 1 secret (`roofrank/prod/env-45qJyc`) | ~$0.40 | — |
| **CloudWatch Logs** | ~5 GB ingestion + retention | ~$2-5 | **Drop retention to 1 day = ~$0.50** |
| **ECR** (Docker registry) | ~500 MB images | ~$0.05 | — |
| **S3** (Terraform state + misc) | <1 GB | ~$0.05 | — |
| **Route 53** | Not used — DNS at Cloudflare | $0 | — |
| **Data transfer** | ECS → internet (RDS, ATTOM, Anthropic) | ~$1-5 | Drops to ~$0 when idle |
| **AWS Total — active** | | **~$100-115** | |
| **AWS Total — fully idle** | | | **~$5-10** |

### Cost-reduction toggles (in priority order)

Apply when you're not actively developing for >1 week:

1. **Scale ECS service to 0 tasks** — save ~$15/mo, restore in ~3 min
   ```bash
   aws ecs update-service --cluster roofrank --service roofrank --desired-count 0
   ```
   Backend goes dark. Frontend (Cloudflare Pages) still loads but all API calls fail. **Most-bang-for-buck idle move.**

2. **Stop RDS instance** — save ~$15/mo compute (storage continues), restore in ~5 min
   ```bash
   aws rds stop-db-instance --db-instance-identifier roofrank-postgres
   ```
   AWS auto-starts the instance after **7 days**. Set a calendar reminder to re-stop.

3. **Delete ElastiCache cluster** — save ~$12/mo, restore via Terraform in ~5 min
   Redis is only used for rate limiting + phone verify codes — both work without it (rate limiting falls back to in-process, verify codes can use DB).

4. **Delete NAT Gateway** — **save ~$32/mo** (single biggest line item after ALB). Only meaningful when ECS is also at 0 tasks (no outbound traffic needed). Restore via Terraform in ~3 min.

5. **Delete ALB** — save ~$20-25/mo. **Don't do this for short idle periods** — recreating the ALB also means updating DNS, waiting for cert validation, etc. ~30 min to restore. Only worth it for multi-month idle.

6. **Drop CloudWatch log retention** to 1 day — save ~$1-3/mo
   ```bash
   aws logs put-retention-policy --log-group-name /ecs/roofrank --retention-in-days 1
   ```

### Recommended idle posture

**For 1-2 weeks of no dev:** Apply 1 + 2 + 6 → save ~$30/mo, restore in ~10 min when you return.

**For 1+ month of no dev:** Apply 1 + 2 + 3 + 4 + 6 → save ~$75/mo, restore in ~20 min. ALB stays (DNS continuity).

**For going totally dark (>3 months, e.g. paused launch):** Apply all 6 → save ~$95/mo. Restore is ~1 hour and may need DNS update.

---

## 3. External APIs (data + AI)

| Service | Plan | Pricing model | Estimated monthly | Account/login |
|---|---|---|---|---|
| **ATTOM Data API** | Pay-as-you-go (post-trial, upgraded 2026-05-31) | Per-request | $0-50 idle (no ingestion), $50-200 active | api.developer.attomdata.com |
| **Anthropic Claude** | Pay-per-token, Sonnet 4.6 | ~$3/M input · ~$15/M output | $0-5 idle, $20-100 active depending on chat + narrative volume | console.anthropic.com |
| **Better Stack** | Not yet signed up | TBD | $0 today, planned ~$30/mo for status page + uptime monitoring | — |

**Anthropic monthly estimate:** 1 narrative = ~2k input + ~500 output tokens ≈ $0.01. 1 chat message ≈ $0.005. At 200 deals/mo + 100 chat msgs/mo ≈ $2.50/mo. Negligible until volume scales.

**ATTOM idle cost = $0** if ingestion worker isn't running. Workers run inside the API ECS process (per architecture audit) — when you scale ECS to 0, ATTOM stops being called.

---

## 4. Email + SMS

| Service | Plan | Limit | Estimated monthly | Account |
|---|---|---|---|---|
| **Resend** (transactional email) | Free tier | 3,000 emails/mo, 100/day | $0 (pre-launch) — Pro tier is $20/mo at 50k/mo | resend.com |
| **AWS End User Messaging (SNS for SMS)** | Sandbox (no production access yet) | Verified destinations only | ~$0 — pay-per-SMS, but blocked from sending until sandbox exit approved | AWS console |

**Resend** likely stays free through launch — 3k/mo covers your verification emails + Strong Buy alerts for the first ~50 users. Upgrade trigger: hitting daily 100-email limit.

**SMS:** AWS denied sandbox exit 2026-06-23; you have a soft-rejection appeal drafted. Per-SMS cost when approved: ~$0.0075 USD per US SMS. At ~20 msgs/user/month × 50 users = $7.50/mo. Negligible.

---

## 5. Payments

| Service | Plan | Pricing | Estimated monthly |
|---|---|---|---|
| **Stripe** | Standard | 2.9% + $0.30 per successful charge | $0 if no Pro signups. Per Pro signup at $49/mo: Stripe takes ~$1.72. |

Net per Pro subscriber: $49 - $1.72 = **$47.28/mo to RoofRank**.

Stripe Tax not yet enabled — if MA collects sales tax on SaaS, that's a future setup. Currently SaaS is not taxable in MA (verify before launch).

---

## 6. Frontend + DNS

| Service | Plan | Cost |
|---|---|---|
| **Cloudflare Pages** (frontend hosting) | Free | $0 — unlimited bandwidth, 500 builds/mo |
| **Cloudflare DNS** | Free | $0 |
| **Cloudflare Email Routing** (`support@roofrank.io` → `devnestdynamics@gmail.com`) | Free | $0 |
| **Cloudflare registrar** (roofrank.io domain) | Wholesale | **~$10-12/yr (~$1/mo amortized)** for .io TLD at cost |

**Migrated from Netlify** to Cloudflare Pages 2026-05-31 — Netlify was at credit cap.

---

## 7. Observability

| Service | Plan | Cost | Status |
|---|---|---|---|
| **Sentry** | Developer (free tier) | $0 — 5k errors/mo, 7-day retention | DSN configured pending |
| **AWS CloudWatch** (logs + metrics) | Included with AWS | See AWS section above | Active |

---

## 8. Renewal + payment schedule (for accountability)

| Service | Billed | Payment method | Renews |
|---|---|---|---|
| AWS (all services) | Monthly | Credit card on file | 1st of month |
| Anthropic | Monthly (postpaid) | Credit card on file | Auto on usage |
| ATTOM | Monthly (pay-as-you-go) | Credit card on file | Auto on usage |
| Resend | Monthly (postpaid, Pro tier when upgraded) | TBD | TBD |
| Stripe | Per-transaction (netted out of payouts) | n/a | Continuous |
| Cloudflare | Domain renews annually | TBD | TBD — check date |

**Action items:**
- [ ] Confirm Cloudflare domain renewal date
- [ ] Set AWS budget alert at $150/mo (catches runaway costs)
- [ ] Set Anthropic spending limit at $50/mo (console.anthropic.com → Billing → Limits)
- [ ] Set ATTOM monthly cap if their dashboard supports it

---

## 9. Actuals tracking — fill this in monthly

| Month | AWS actual | Anthropic actual | ATTOM actual | Resend | Stripe (net revenue) | Other | Total OUT | Total IN | Net |
|---|---|---|---|---|---|---|---|---|---|
| 2026-06 | $? | $? | $? | $0 | $0 | $? | $? | $0 | $? |
| 2026-07 | | | | | | | | | |
| 2026-08 (launch) | | | | | | | | | |

Pull AWS actuals from **AWS Cost Explorer** (`console.aws.amazon.com/cost-management/`). Pull Anthropic from the API dashboard. Pull Stripe net revenue from Stripe → Reports → Net volume.

---

## 10. Things NOT being paid for (yet)

To avoid the "wait, do we pay for this?" thrash later:

- **No SOC 2 / compliance tooling** (Vanta, Drata, etc.) — post-launch when first enterprise customer asks
- **No Datadog / New Relic** — Sentry + CloudWatch cover MVP needs
- **No Auth0 / Clerk** — using own JWT + magic-link auth via Resend/SNS
- **No CDN beyond Cloudflare Pages** — frontend is static, no separate CDN
- **No paid CI** — GitHub Actions free tier covers everything
- **No analytics SaaS** (PostHog, Mixpanel) — in backlog (#53) as launch-blocker-adjacent

---

## 11. Pricing model context (for ROI math)

| Tier | Price | Stripe net | Required to cover active AWS (~$110/mo) |
|---|---|---|---|
| Free (Starter) | $0 | $0 | n/a |
| Pro | $49/mo | ~$47.28 | ~3 subscribers |
| Enterprise | Contact sales | Custom | 1 contract covers months |

Worst-case break-even (active infra + ATTOM + Anthropic ≈ $160/mo): **4 Pro subscribers**.

---

## 12. Memory: when to update this doc

- After any AWS infra change (scale up/down, new service)
- After signing up for a new external service (Better Stack, etc.)
- After a pricing tier change at any vendor
- Monthly when filling in actuals (section 9)
- Before any launch / unpause decision (so spend posture is intentional)
