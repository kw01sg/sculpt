# Tasks: CI/CD Pipeline Setup

**Input**: Design documents from `/specs/002-setup-cicd/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, contracts/ ✓, quickstart.md ✓

**Organization**: Tasks are grouped by user story. US1 (Production) → US2 (Develop) → US3 (PR Previews).
Three code changes required (Phase 1); all Railway environment work done via dashboard (Phases 2-5).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on each other)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

---

## Phase 0: Human Prerequisites ⚠️ MUST BE DONE BY YOU BEFORE IMPLEMENTATION

**Purpose**: External accounts and credentials that cannot be automated. All tasks in this phase must be completed by you manually before any code changes or Railway setup can begin.

- [ ] P001 Sign up for a Supabase account at supabase.com (free tier is sufficient)
- [ ] P002 [P] Create a Supabase project named `sculpt-prod` — note the **Transaction Pooler** connection string (port 6543): Project Settings → Database → Connection Pooling → Transaction mode
- [ ] P003 [P] Create a Supabase project named `sculpt-dev` — note the **Transaction Pooler** connection string (port 6543) the same way as P002
- [ ] P004 Sign up for a Railway account at railway.app (Hobby plan required for multiple environments and PR previews — $5/month)
- [ ] P005 [P] Generate two JWT secret values (one for prod, one for dev) by running `openssl rand -hex 32` twice — store both securely (e.g. a password manager); these will be entered as `JWT_SECRET` in Railway later

**Checkpoint**: You have Railway and Supabase accounts, two Supabase connection strings, and two JWT secret values ready to paste into Railway. Hand these off before starting Phase 1.

---

## Phase 1: Setup (Code Changes)

**Purpose**: The three source file changes required before Railway can correctly build and serve the application. These must all be committed and pushed before Railway environment setup begins.

- [x] T001 Update `backend/Dockerfile` CMD to run database migrations before server start — change final `CMD` line to: `CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]`
- [x] T002 [P] Update `frontend/nginx.conf` proxy_pass from `http://backend:8000` to `http://backend.railway.internal:8000` in the `/api` location block (line 14) — keeps API traffic on Railway's internal network per research.md Decision 3
- [x] T003 [P] Create `.github/workflows/ci.yml` implementing two jobs: `backend-lint` (Python 3.11, working-dir `./backend`, runs `pip install black ruff` then `black --check .` and `ruff check .`) and `frontend-build` (Node 18, working-dir `./frontend`, runs `npm ci` then `npm run build`) — triggered on push to any branch and on PRs targeting `main` or `develop`, per contracts/ci-workflow.md

**Checkpoint**: Commit all three changes to the `002-setup-cicd` feature branch. The CI workflow will run on the next push.

---

## Phase 2: Foundational (Railway Project Initialisation)

**Purpose**: Create the Railway project and wire it to the GitHub repo. Must be complete before any environment-specific service setup.

**⚠️ CRITICAL**: No user story work can begin until Railway is connected to the GitHub repo.

- [ ] T004 Install the Railway GitHub App on the GitHub repo (railway.app → New Project → Deploy from GitHub repo → authorise app → select repo) and confirm Railway creates a default `Production` environment
- [ ] T005 Rename/confirm the default Railway environment to `Production` and set its deployment trigger to the `main` branch with auto-deploy enabled

**Checkpoint**: Railway project exists and is authorised to watch the GitHub repo. Railway can now post deployment statuses to GitHub commits.

---

## Phase 3: User Story 1 — Automated Production Deployment on Merge (Priority: P1) 🎯 MVP

**Goal**: Every merge to `main` automatically deploys both services to production. Deployment outcome is visible in GitHub without leaving the page.

**Independent Test**: Merge any commit to `main` → both services deploy in Railway Production → a deployment status check (pass or fail) appears on the GitHub commit.

- [ ] T006 [US1] Add Backend service to Railway Production environment — source directory: `/backend`, exposed port: `8000`, health check path: `/api` (Railway dashboard → Production → New Service → GitHub Repo → select `/backend`)
- [ ] T007 [P] [US1] Add Frontend service to Railway Production environment — source directory: `/frontend`, exposed port: `80` (Railway dashboard → Production → New Service → GitHub Repo → select `/frontend`)
- [ ] T008 [US1] Set Production environment variables for both services in Railway dashboard per `contracts/railway-environments.md`: `DATABASE_URL` (sculpt-prod Supabase Transaction Pooler URL, port 6543), `JWT_SECRET` (production secret value), `CORS_ORIGINS` (the Railway-generated production frontend public URL)
- [ ] T009 [US1] Merge the feature branch to `main` (or manually trigger a redeploy in Railway) and verify: (a) Railway deploys backend and frontend, (b) a deployment status check appears on the GitHub commit, (c) the production frontend URL loads the application

**Checkpoint**: User Story 1 is complete. Production deploys automatically on merge to `main` with zero manual steps. Deployment status is visible in GitHub.

---

## Phase 4: User Story 2 — Automated Development Deployment on Push (Priority: P2)

**Goal**: Every push to `develop` automatically updates the development environment. Production remains untouched.

**Independent Test**: Push any commit to `develop` → both services deploy in Railway Develop → status check appears on the GitHub commit → pushing to `main` does NOT redeploy Develop.

- [ ] T010 [US2] Create `Develop` environment in Railway project — Railway dashboard → Environments → New Environment → name: `Develop` → link to `develop` branch → enable auto-deploy
- [ ] T011 [US2] Add Backend service to Railway Develop environment — source directory: `/backend`, port: `8000`, health check path: `/api`
- [ ] T012 [P] [US2] Add Frontend service to Railway Develop environment — source directory: `/frontend`, port: `80`
- [ ] T013 [US2] Set Develop environment variables in Railway dashboard per `contracts/railway-environments.md`: `DATABASE_URL` (sculpt-dev Supabase Transaction Pooler URL, port 6543), `JWT_SECRET` (dev secret value), `CORS_ORIGINS` (Railway-generated develop frontend public URL)
- [ ] T014 [US2] Verify develop deployment: push a trivial commit to `develop`, confirm Railway Develop environment deploys both services within 10 minutes, confirm status check appears on the GitHub commit (quickstart.md Scenario 1)

**Checkpoint**: User Story 2 is complete. Pushing to `develop` triggers a development deployment automatically.

---

## Phase 5: User Story 3 — Isolated PR Preview Environments (Priority: P3)

**Goal**: Every PR targeting `main` gets its own preview environment with a unique URL. The environment is removed automatically when the PR closes.

**Independent Test**: Open a PR → Railway provisions a preview environment → unique URL appears in the PR → close the PR → Railway removes the preview environment.

- [ ] T015 [US3] Enable PR Preview Environments in Railway project settings — Railway dashboard → Project Settings → PR Environments → Enable → set base environment to `Develop` → save
- [ ] T016 [US3] Open a test pull request from a feature branch targeting `main`, wait up to 10 minutes, and verify a unique Railway preview URL appears as a check on the PR in GitHub (quickstart.md Scenario 2, steps 1-5)
- [ ] T017 [US3] Close the test PR without merging and verify the preview environment is automatically removed from the Railway dashboard within a few minutes (quickstart.md Scenario 2, steps 6-7)

**Checkpoint**: All three user stories are complete. Production, Develop, and PR preview environments all deploy automatically with zero manual steps.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: End-to-end validation and failure-mode verification.

- [ ] T018 [P] Verify CI quality gate (quickstart.md Scenario 4): create a branch with a deliberate black formatting violation in `backend/`, open a PR, confirm `backend-lint` fails in GitHub, push a fix, confirm `backend-lint` passes
- [ ] T019 [P] Verify failed-deployment rollback (quickstart.md Scenario 5): push a commit to `develop` with an invalid `DATABASE_URL` override, confirm Railway reports deployment failure in GitHub, confirm the previous develop deployment continues serving traffic
- [ ] T020 Confirm `deployment.md` reflects the implemented nginx.conf change — verify Section 3 "Internal Networking" already documents `http://backend.railway.internal:8000` (no edit required if already accurate; update if it references `http://backend:8000`)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 0 (Human Prerequisites)**: No dependencies — start immediately; P002/P003/P005 can run in parallel
- **Phase 1 (Code Changes)**: Can start in parallel with Phase 0; does not need credentials
- **Phase 2 (Railway Setup)**: Requires Phase 0 (Railway account) + Phase 1 (code committed); must complete before Phase 3
- **Phase 3 (US1)**: Depends on Phase 1 (code committed) + Phase 2 (Railway connected)
- **Phase 4 (US2)**: Depends on Phase 2; can start independently of Phase 3
- **Phase 5 (US3)**: Depends on Phase 4 (Develop environment must exist as base)
- **Phase 6 (Polish)**: Depends on all prior phases complete

### User Story Dependencies

- **US1 (P1)**: Requires Phase 1 + Phase 2 complete
- **US2 (P2)**: Requires Phase 2 complete; independent of US1
- **US3 (P3)**: Requires US2 complete (needs Develop environment as base)

### Parallel Opportunities Within Phases

- T002 and T003 can run in parallel (different files)
- T006 and T007 can run in parallel (different Railway services)
- T011 and T012 can run in parallel (different Railway services)
- T018 and T019 can run in parallel (independent verification scenarios)

---

## Parallel Example: Phase 1

```
# Run these three tasks concurrently (different files):
Task T001: Edit backend/Dockerfile
Task T002: Edit frontend/nginx.conf
Task T003: Create .github/workflows/ci.yml
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Code changes (T001–T003)
2. Complete Phase 2: Railway project setup (T004–T005)
3. Complete Phase 3: Production environment (T006–T009)
4. **STOP and VALIDATE**: Merge to `main`, confirm production deploys automatically and status appears in GitHub
5. Ship — production CI/CD is live

### Incremental Delivery

1. Phase 1 + Phase 2 → Code ready, Railway connected
2. Phase 3 (US1) → Production auto-deploys ✓ (MVP)
3. Phase 4 (US2) → Development auto-deploys ✓
4. Phase 5 (US3) → PR previews live ✓
5. Phase 6 → All failure modes verified ✓

---

## Notes

- All Railway dashboard steps reference `quickstart.md` for detailed walkthrough
- All environment variable values reference `contracts/railway-environments.md`
- No secrets are committed to version control — all secrets live in Railway's per-environment variable store
- The `backend/Dockerfile` change (T001) is critical: without it, Railway will start the server before migrations run, causing startup failures on schema changes
- The `nginx.conf` change (T002) is critical: without it, the frontend cannot reach the backend in Railway's network
