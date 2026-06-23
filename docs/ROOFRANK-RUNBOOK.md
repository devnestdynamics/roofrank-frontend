# RoofRank — Operations Runbook

**Last updated:** May 2026  
This document covers day-to-day operations: deployments, debugging, database tasks, and common fixes.

---

## Quick Reference

| Thing | Value |
|---|---|
| Frontend URL | https://roofrank.io |
| API URL | https://api.roofrank.io |
| Health check | https://api.roofrank.io/health |
| AWS Account | 803871049071 |
| AWS Region | us-east-1 |
| ECS Cluster | roofrank |
| ECS Service | roofrank |
| ECR Repo | 803871049071.dkr.ecr.us-east-1.amazonaws.com/roofrank |
| RDS Endpoint | roofrank-postgres.cyhagq2emrdi.us-east-1.rds.amazonaws.com:5432 |
| Redis Endpoint | roofrank-redis.92vzdl.0001.use1.cache.amazonaws.com:6379 |
| Secrets ARN | arn:aws:secretsmanager:us-east-1:803871049071:secret:roofrank/prod/env-45qJyc |
| Terraform State | s3://roofrank-terraform-state-803871049071 |
| GitHub Backend | https://github.com/devnestdynamics/roofrank-backend |
| GitHub Frontend | https://github.com/devnestdynamics/roofrank-frontend |
| Netlify Site | sparkling-dodol-e197c1.netlify.app |
| Admin Email | ali@roofrank.io |
| Private Subnet 0 | subnet-05335f1633521ac90 |
| App Security Group | sg-0a18f2953a7d0caae |

---

## Deploying the Backend

### Full Deploy (code change)

```bash
cd ~/roofrank

# 1. Build for linux/amd64 (required — Mac is ARM64)
docker buildx build --platform linux/amd64 -t roofrank:latest .

# 2. Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  803871049071.dkr.ecr.us-east-1.amazonaws.com

# 3. Tag and push
docker tag roofrank:latest \
  803871049071.dkr.ecr.us-east-1.amazonaws.com/roofrank:latest
docker push 803871049071.dkr.ecr.us-east-1.amazonaws.com/roofrank:latest

# 4. Force new ECS deployment
aws ecs update-service \
  --cluster roofrank \
  --service roofrank \
  --region us-east-1 \
  --force-new-deployment

# 5. Watch deployment
aws ecs describe-services \
  --cluster roofrank \
  --service roofrank \
  --region us-east-1 \
  --query 'services[0].deployments'
```

### Verify Deploy Succeeded

```bash
# Check running tasks (should show 1-2)
aws ecs list-tasks --cluster roofrank --region us-east-1

# Check health
curl https://api.roofrank.io/health
```

---

## Deploying the Frontend

Frontend auto-deploys on every push to `main` branch of `devnestdynamics/roofrank-frontend`.

```bash
cd ~/Downloads/roofrank-frontend/frontend

# Make your changes, then:
git add .
git commit -m "Your change description"
git push
# Netlify deploys in ~30 seconds
```

To verify: https://roofrank.io/roofrank-landing.html

---

## Running Database Migrations

```bash
aws ecs run-task \
  --cluster roofrank \
  --task-definition roofrank \
  --launch-type FARGATE \
  --region us-east-1 \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-05335f1633521ac90],securityGroups=[sg-0a18f2953a7d0caae],assignPublicIp=DISABLED}" \
  --overrides '{"containerOverrides":[{"name":"roofrank","command":["node","dist/db/migrate.js"]}]}'
```

Check logs after ~60 seconds:
```bash
aws logs get-log-events \
  --log-group-name /ecs/roofrank \
  --region us-east-1 \
  --log-stream-name $(aws logs describe-log-streams \
    --log-group-name /ecs/roofrank \
    --region us-east-1 \
    --order-by LastEventTime \
    --descending \
    --query 'logStreams[0].logStreamName' \
    --output text) \
  --limit 20 \
  --query 'events[*].message' \
  --output text
```

Expected output: `Running migrations... Migrations complete.`

---

## Running the Seed Script

Only needed for fresh environments.

```bash
aws ecs run-task \
  --cluster roofrank \
  --task-definition roofrank \
  --launch-type FARGATE \
  --region us-east-1 \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-05335f1633521ac90],securityGroups=[sg-0a18f2953a7d0caae],assignPublicIp=DISABLED}" \
  --overrides '{"containerOverrides":[{"name":"roofrank","command":["node","dist/db/seed.js"]}]}'
```

Expected output: `✅ Seeded 26 deals`

---

## Updating Secrets

```bash
# Edit the secrets file
cat > /tmp/secrets.json << 'SECRETS'
{
  "DATABASE_URL": "postgresql://roofrank:PASSWORD@roofrank-postgres.cyhagq2emrdi.us-east-1.rds.amazonaws.com:5432/roofrank?sslmode=require",
  "REDIS_URL": "redis://roofrank-redis.92vzdl.0001.use1.cache.amazonaws.com:6379",
  "JWT_SECRET": "...",
  "JWT_REFRESH_SECRET": "...",
  "RENTCAST_API_KEY": "...",
  "ATTOM_API_KEY": "...",
  "GOOGLE_CLIENT_ID": "...",
  "GOOGLE_CLIENT_SECRET": "...",
  "GOOGLE_CALLBACK_URL": "https://api.roofrank.io/api/auth/google/callback",
  "STRIPE_SECRET_KEY": "...",
  "STRIPE_WEBHOOK_SECRET": "...",
  "RESEND_API_KEY": "...",
  "EMAIL_FROM": "noreply@roofrank.io",
  "CLIENT_URL": "https://roofrank.io"
}
SECRETS

aws secretsmanager put-secret-value \
  --secret-id 'roofrank/prod/env' \
  --region us-east-1 \
  --secret-string file:///tmp/secrets.json

# Force redeploy to pick up new secrets
aws ecs update-service \
  --cluster roofrank \
  --service roofrank \
  --region us-east-1 \
  --force-new-deployment
```

---

## Viewing Logs

### Latest logs (quick)
```bash
aws logs get-log-events \
  --log-group-name /ecs/roofrank \
  --region us-east-1 \
  --log-stream-name $(aws logs describe-log-streams \
    --log-group-name /ecs/roofrank \
    --region us-east-1 \
    --order-by LastEventTime \
    --descending \
    --query 'logStreams[0].logStreamName' \
    --output text) \
  --limit 50 \
  --query 'events[*].message' \
  --output text
```

### List recent log streams
```bash
aws logs describe-log-streams \
  --log-group-name /ecs/roofrank \
  --region us-east-1 \
  --order-by LastEventTime \
  --descending \
  --query 'logStreams[:5].logStreamName' \
  --output text
```

### View a specific stream
```bash
aws logs get-log-events \
  --log-group-name /ecs/roofrank \
  --region us-east-1 \
  --log-stream-name ecs/roofrank/STREAM_NAME \
  --limit 50 \
  --query 'events[*].message' \
  --output text
```

---

## Checking ECS Status

```bash
# Running tasks
aws ecs list-tasks --cluster roofrank --region us-east-1

# Service health
aws ecs describe-services \
  --cluster roofrank \
  --service roofrank \
  --region us-east-1 \
  --query 'services[0].{desired:desiredCount,running:runningCount,pending:pendingCount,events:events[:3]}'
```

---

## Infrastructure Changes (Terraform)

```bash
cd ~/roofrank/roofrank-infra-work/terraform

# Preview changes
terraform plan \
  -var 'db_password=TempPass123!' \
  -var 'domain_name=roofrank.io' \
  -var 'ecr_image_uri=803871049071.dkr.ecr.us-east-1.amazonaws.com/roofrank:latest'

# Apply changes
terraform apply \
  -var 'db_password=TempPass123!' \
  -var 'domain_name=roofrank.io' \
  -var 'ecr_image_uri=803871049071.dkr.ecr.us-east-1.amazonaws.com/roofrank:latest'
```

---

## Common Issues & Fixes

### API returns 401 on login
- Check user exists in DB
- Verify password hash is correct
- Check JWT_SECRET in Secrets Manager matches what's deployed

### Container won't start (logs show error)
```bash
# Check recent events
aws ecs describe-services \
  --cluster roofrank \
  --service roofrank \
  --region us-east-1 \
  --query 'services[0].events[:5]'
```
Common causes:
- Missing/wrong secret value → update Secrets Manager, redeploy
- Build for wrong platform (must be linux/amd64) → rebuild with `--platform linux/amd64`
- TypeScript compile error → run `npm run build` locally first

### RDS connection error (`no encryption`)
DATABASE_URL must include `?sslmode=require`:
```
postgresql://roofrank:PASSWORD@HOST:5432/roofrank?sslmode=require
```

### Frontend not updating after push
- Check Netlify deploy status: https://app.netlify.com/projects/sparkling-dodol-e197c1
- Hard refresh: `Cmd + Shift + R`
- Check GitHub push was to `main` branch

### DNS not resolving
```bash
# Check propagation
dig api.roofrank.io +short
dig roofrank.io +short

# Flush local DNS cache (Mac)
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

---

## Local Development

```bash
# Start dependencies
cd ~/roofrank
docker-compose up postgres redis -d

# Run API
npm run dev
# → http://localhost:3000

# Serve frontend (must use python3, not npx serve)
cd ~/Downloads/roofrank-frontend/frontend
python3 -m http.server 8080
# → http://localhost:8080/roofrank-dashboard.html

# IMPORTANT: Frontend HTML files have localhost API URL hardcoded:
# <script>window.ROOFRANK_API_URL="http://localhost:3000/api";</script>
# Production files use https://api.roofrank.io/api
```

### Local credentials
- Email: `ali@roofrank.io`
- Password: `Password123!`

---

## Costs (Estimated Monthly)

**Full breakdown moved to [ROOFRANK-COST-TRACKING.md](./ROOFRANK-COST-TRACKING.md).** That doc supersedes this table — it covers AWS line items, external APIs (ATTOM, Anthropic), Stripe, Cloudflare, idle-mode cost-reduction toggles, and a monthly actuals tracker.

Quick reference:

| State | Estimated total |
|---|---|
| **Active (dev + light traffic)** | ~$120-160/mo |
| **Idle (recommended toggles applied)** | ~$15-30/mo |
| **Break-even at active cost** | ~3-4 Pro subscribers ($49/mo each) |

If you're going idle for >1 week, see [section 2 of the cost-tracking doc](./ROOFRANK-COST-TRACKING.md#cost-reduction-toggles-in-priority-order) — scale ECS to 0, stop RDS, drop log retention → saves ~$30/mo with ~10-min restore. Bigger savings if going dark for >1 month.

