# RoofRank — Complete Setup & Deployment Guide

---

## What's Already Built (No Action Needed)

- Full Node.js + TypeScript API (auth, billing, feed, reports, watchlist, waitlist)
- PostgreSQL schema with Drizzle ORM migrations
- Scoring engine: 8 weighted financial metrics (CoC, Cap Rate, DSCR, GRM, Price/Unit, NOI, CapEx, Neighborhood)
- BullMQ background workers: nightly ingestion + report generation
- Post-sweep email alerts: Strong Buy alerts + morning digest
- Stripe subscriptions + full webhook handler (idempotent)
- Google OAuth + email/password auth with JWT refresh tokens
- 9 frontend pages wired to the API via `api.js`
- Docker setup for local development
- Terraform: AWS ECS Fargate, RDS pg16, ElastiCache Redis, ALB, ACM, S3, auto-scaling
- GitHub Actions CI/CD: test → build/push ECR → migrate → deploy ECS

---

## Step 1 — API Keys You Need

Get these before anything else:

| Service | What For | URL |
|---|---|---|
| **RentCast** | Listing data (required) | https://rentcast.io/api |
| **ATTOM** | Tax records + neighborhood grades | https://api.attomdata.com |
| **Resend** | Transactional email | https://resend.com |
| **Stripe** | Billing | https://dashboard.stripe.com |
| **Google Cloud** | OAuth sign-in | https://console.cloud.google.com |
| **AWS** | Infrastructure | https://aws.amazon.com |

---

## Step 2 — Stripe Setup (~15 minutes)

### A. Create Products & Prices

Stripe Dashboard → **Products** → **Add Product** for each plan:

| Plan | Monthly Price | Annual Price | Description |
|---|---|---|---|
| Starter | $0 | — | Free — no card required |
| Essentials | $29/mo | $25/mo ($300/yr) | 3 markets, 15 reports |
| Pro | $79/mo | $69/mo ($828/yr) | All markets, 25 reports, alerts |
| Team | $199/mo | $173/mo ($2,076/yr) | All markets, unlimited reports, 5 seats |

For each paid plan, create two prices (monthly recurring + annual recurring).
Copy each **Price ID** (format: `price_xxx`).

### B. Create Webhook

Stripe Dashboard → **Developers** → **Webhooks** → **Add endpoint**:
- URL: `https://api.yourdomain.com/api/billing/webhook`
- Events: `checkout.session.completed`, `customer.subscription.created`,
  `customer.subscription.updated`, `customer.subscription.deleted`,
  `invoice.paid`, `invoice.payment_failed`

Copy the **Webhook Signing Secret** (`whsec_xxx`).

### C. Environment Variables

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ESSENTIALS_MONTHLY=price_...
STRIPE_PRICE_ESSENTIALS_ANNUAL=price_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_ANNUAL=price_...
STRIPE_PRICE_ENTERPRISE_MONTHLY=price_...
STRIPE_PRICE_ENTERPRISE_ANNUAL=price_...
```

---

## Step 3 — Google OAuth (~10 minutes)

1. Go to https://console.cloud.google.com → create project "RoofRank"
2. Enable **Google+ API** / **People API**
3. **APIs & Services** → **Credentials** → **OAuth 2.0 Client ID** → Web application
4. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback`
   - `https://api.yourdomain.com/api/auth/google/callback`
5. Copy **Client ID** and **Client Secret**

```
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx
GOOGLE_CALLBACK_URL=https://api.yourdomain.com/api/auth/google/callback
```

---

## Step 4 — Email Setup (Resend, ~5 minutes)

1. https://resend.com → sign up → **API Keys** → create key
2. Add your sending domain (or use their sandbox for testing)

```
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@yourdomain.com
```

---

## Step 5 — AWS Deployment (~30 minutes)

### A. Prerequisites

```bash
brew install awscli terraform  # Mac
# or see https://aws.amazon.com/cli and https://developer.hashicorp.com/terraform/install
aws configure  # Enter your AWS Access Key ID, Secret, region: us-east-1
```

### B. Terraform State Bucket

```bash
aws s3 mb s3://roofrank-terraform-state --region us-east-1
aws s3api put-bucket-versioning \
  --bucket roofrank-terraform-state \
  --versioning-configuration Status=Enabled
```

### C. Deploy Infrastructure

```bash
cd roofrank-infra/terraform
terraform init
terraform apply \
  -var="db_password=STRONG_PASSWORD_HERE" \
  -var="domain_name=api.yourdomain.com" \
  -var="ecr_image_uri=placeholder"
```

Note the outputs:
- `alb_dns` → point your domain's A record here
- `ecr_repo_url` → where to push Docker images
- `db_endpoint` → database hostname
- `redis_endpoint` → Redis hostname

### D. Store Secrets in AWS Secrets Manager

AWS Console → **Secrets Manager** → find `roofrank/prod/env` → edit secret:

```json
{
  "DATABASE_URL": "postgresql://roofrank:PASSWORD@DB_ENDPOINT:5432/roofrank",
  "REDIS_URL": "redis://REDIS_ENDPOINT:6379",
  "JWT_SECRET": "run: openssl rand -hex 64",
  "JWT_REFRESH_SECRET": "run: openssl rand -hex 64",
  "RENTCAST_API_KEY": "your-rentcast-key",
  "ATTOM_API_KEY": "your-attom-key",
  "STRIPE_SECRET_KEY": "sk_live_...",
  "STRIPE_WEBHOOK_SECRET": "whsec_...",
  "STRIPE_PRICE_ESSENTIALS_MONTHLY": "price_...",
  "STRIPE_PRICE_ESSENTIALS_ANNUAL": "price_...",
  "STRIPE_PRICE_PRO_MONTHLY": "price_...",
  "STRIPE_PRICE_PRO_ANNUAL": "price_...",
  "STRIPE_PRICE_ENTERPRISE_MONTHLY": "price_...",
  "STRIPE_PRICE_ENTERPRISE_ANNUAL": "price_...",
  "RESEND_API_KEY": "re_...",
  "EMAIL_FROM": "noreply@yourdomain.com",
  "GOOGLE_CLIENT_ID": "xxx.apps.googleusercontent.com",
  "GOOGLE_CLIENT_SECRET": "GOCSPX-xxx",
  "GOOGLE_CALLBACK_URL": "https://api.yourdomain.com/api/auth/google/callback",
  "CLIENT_URL": "https://app.yourdomain.com"
}
```

### E. GitHub Actions Secrets

Repo → **Settings** → **Secrets and variables** → **Actions**:

| Secret | Value |
|---|---|
| `AWS_ACCESS_KEY_ID` | Your AWS access key |
| `AWS_SECRET_ACCESS_KEY` | Your AWS secret key |
| `PRIVATE_SUBNET_IDS` | Subnet IDs from Terraform output |
| `APP_SECURITY_GROUP_ID` | Security group ID from Terraform output |

### F. First Deploy

```bash
cd roofrank-backend

# Build and push first image manually
ECR_URL=$(terraform -chdir=../roofrank-infra/terraform output -raw ecr_repo_url)
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin $ECR_URL

docker build -t $ECR_URL/roofrank:latest .
docker push $ECR_URL/roofrank:latest

# Update Terraform with real image
cd ../roofrank-infra/terraform
terraform apply -var="ecr_image_uri=$ECR_URL/roofrank:latest" ...
```

After this, every push to `main` deploys automatically.

### G. Run Database Migrations

```bash
# From the ECS cluster after first deploy
aws ecs run-task \
  --cluster roofrank \
  --task-definition roofrank \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[SUBNET_IDS],securityGroups=[SG_ID]}" \
  --overrides '{"containerOverrides":[{"name":"roofrank","command":["node","dist/db/migrate.js"]}]}'
```

### H. Trigger First Ingestion

```bash
curl -X POST https://api.yourdomain.com/api/feed/refresh \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## Step 6 — Frontend Hosting

The frontend is static HTML — host it anywhere:

**Netlify (easiest):**
1. Go to https://netlify.com → drag-and-drop the `roofrank-frontend/` folder
2. Set custom domain (e.g. `app.yourdomain.com`)
3. Done — Netlify handles HTTPS automatically

**Before deploying frontend, update `api.js`:**
```html
<!-- Add this line BEFORE <script src="api.js"></script> on every page -->
<script>window.ROOFRANK_API_URL = 'https://api.yourdomain.com/api';</script>
```

Or add this to every HTML page's `<head>` and it will just work.

---

## Running Locally

```bash
# 1. Start postgres + redis
cd roofrank-backend
docker-compose up postgres redis -d

# 2. Configure environment
cp .env.example .env
# Minimum required for local: JWT_SECRET, JWT_REFRESH_SECRET, DATABASE_URL, REDIS_URL
# Add RENTCAST_API_KEY and ATTOM_API_KEY when testing ingestion

# 3. Run migrations
npm run db:migrate

# 4. Start API
npm run dev
# → API running at http://localhost:3000

# 5. Open frontend
open roofrank-frontend/roofrank-landing.html
# Or serve with: npx serve roofrank-frontend -p 8080
```

---

## DNS Configuration

| Record | Name | Value |
|---|---|---|
| A | `api` | ALB DNS from Terraform output |
| A/CNAME | `app` | Netlify URL or CloudFront |
| CNAME | (ACM validation) | From `terraform output` |

---

## Current Interest Rate

The ingestion worker scores all deals at **7.25%** (set in `ingestionWorker.ts` as `MARKET_INTEREST_RATE_PCT`).
Update this constant when rates change materially.

---

## Plan Limits Reference

| Plan | Price | Reports/mo | Markets | Alerts | Seats |
|---|---|---|---|---|---|
| Starter | $0 | 10 | All 9 (browse) | No | 1 |
| Essentials | $29/mo | 15 | 3 | No | 1 |
| Pro | $79/mo | 25 | All 9 | Yes | 2 |
| Team | $199/mo | Unlimited | All 9 | Yes | 5 |

---

## File Structure

```
roofrank-backend/          ← Node.js/TypeScript API
  src/
    routes/                ← auth, billing, feed, orgs, reports, watchlist, waitlist
    services/              ← authService, billingService
    workers/               ← ingestionWorker (nightly), reportWorker (on-demand)
    lib/                   ← config, scoring engine, email, rentcast, attom
    db/                    ← schema, migrations

roofrank-frontend/         ← Static HTML pages
  api.js                   ← Shared API client (all pages import this)
  roofrank-landing.html
  roofrank-dashboard.html
  roofrank-deal-detail.html
  roofrank-analyzer.html
  roofrank-reports.html
  roofrank-watchlist.html
  roofrank-login.html
  roofrank-onboarding.html
  roofrank-pricing.html

roofrank-infra/
  terraform/main.tf        ← AWS infrastructure (ECS, RDS, Redis, ALB, ACM, S3)
  .github/workflows/       ← CI/CD pipeline (test → build → migrate → deploy)
  nginx/roofrank.conf      ← Nginx config
  SETUP.md                 ← This file
```
