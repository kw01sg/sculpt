# Quickstart: CI/CD Pipeline Setup

**Branch**: `002-setup-cicd` | **Date**: 2026-06-08

This guide walks through the end-to-end setup and verification of the CI/CD pipeline.

---

## Prerequisites

- GitHub repository: `kw01sg/sculpt` (or your fork) with `main` and `develop` branches
- Two Supabase projects created: `sculpt-prod` and `sculpt-dev` (see `deployment.md` Section 2A)
- Railway account with access to the project

---

## Step 1: Code Changes (in repository)

These file changes are implemented as part of the feature tasks:

1. **Create `.github/workflows/ci.yml`** — GitHub Actions CI workflow (linting + build check)
2. **Update `frontend/nginx.conf`** — Change proxy target to `http://backend.railway.internal:8000`
3. **Update `backend/Dockerfile` CMD** — Add `alembic upgrade head &&` before uvicorn start

---

## Step 2: Railway Project Setup (dashboard)

1. Go to [railway.app](https://railway.app) → New Project
2. Select **Deploy from GitHub repo** → authorise the Railway GitHub App → select this repo
3. Railway creates a `Production` environment linked to `main` by default

**Add a second environment:**
4. In the Railway project → Environments → **New Environment** → name it `Develop` → link to `develop` branch

**Enable PR previews:**
5. Project Settings → **PR Environments** → Enable → set base environment to `Develop`

---

## Step 3: Add Services

In each environment (Production and Develop):

**Backend service:**
1. New Service → GitHub Repo → select `/backend` root directory
2. Set Port: `8000`
3. Set Health Check Path: `/api`
4. Add environment variables (see contracts/railway-environments.md for the full list)

**Frontend service:**
1. New Service → GitHub Repo → select `/frontend` root directory
2. Set Port: `80`
3. Railway will auto-use the `production` Docker stage

---

## Step 4: Set Environment Variables

For each service in each environment, add the required variables from `contracts/railway-environments.md`.

**Critical**: Use the Supabase **Transaction Pooler** connection string (port 6543) for `DATABASE_URL`. See `deployment.md` Section 2A.

---

## Verification Scenarios

### Scenario 1: Development deployment (US2 — P2)

1. Push a trivial commit to `develop` (e.g., update a comment)
2. In Railway dashboard → Develop environment → observe backend and frontend deployments trigger
3. In GitHub → Commits → verify Railway deployment status checks appear on the commit
4. Visit the develop frontend URL → confirm the change is live

**Expected**: Both services deploy within 10 minutes. No manual steps required.

---

### Scenario 2: PR preview environment (US3 — P3)

1. Create a feature branch from `develop`: `git checkout -b test/preview-check`
2. Make a trivial change and push
3. Open a pull request targeting `main`
4. In GitHub PR → observe Railway preview environment checks appearing
5. Click the preview URL in the Railway check → confirm the app loads

**Expected**: A unique preview URL is available within 10 minutes. Backend and frontend both served.

6. Close the PR without merging
7. In Railway dashboard → confirm the preview environment has been removed

---

### Scenario 3: Production deployment (US1 — P1)

1. Merge the test PR (or any PR) to `main`
2. In Railway dashboard → Production environment → observe deployments triggering
3. In GitHub → merged PR → verify Railway production deployment status appears
4. Confirm the production URL reflects the merged changes

**Expected**: Production updates automatically. Zero manual steps. Existing production version remains live until new version passes health check.

---

### Scenario 4: CI quality check (constitution compliance)

1. Create a branch with a Python formatting violation (e.g., add a line with inconsistent spacing)
2. Open a PR
3. In GitHub PR → observe the `backend-lint` check failing
4. Fix the formatting issue and push
5. Observe `backend-lint` passing

**Expected**: Black/ruff failures are visible in GitHub without requiring a failed deployment.

---

### Scenario 5: Failed deployment rollback (FR-007)

1. Introduce a deliberate startup failure in a branch (e.g., invalid DATABASE_URL)
2. Merge to `develop`
3. Observe Railway deployment failure status in GitHub
4. Confirm the previous `develop` deployment continues to serve traffic

**Expected**: Existing version remains live. Developer is notified via GitHub status check.
