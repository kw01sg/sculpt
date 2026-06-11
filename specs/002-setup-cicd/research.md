# Research: CI/CD Pipeline Setup

**Branch**: `002-setup-cicd` | **Date**: 2026-06-08

---

## Decision 1: Deployment Mechanism — Railway Native Integration vs GitHub Actions

**Decision**: Use Railway's native GitHub App for all CD (continuous delivery). GitHub Actions handles CI (continuous integration: quality checks only).

**Rationale**: Railway provides a first-party GitHub App that:
- Auto-deploys any branch push to the corresponding Railway environment
- Auto-provisions isolated preview environments when a PR is opened
- Auto-removes preview environments when a PR is closed or merged
- Posts deployment status checks directly to GitHub commits and PRs (satisfying FR-005)

This means no custom GitHub Actions deploy steps are needed. GitHub Actions is used exclusively for pre-deployment quality gates (linting, formatting, build check) to satisfy the constitution's code quality requirements.

**Alternatives considered**:
- **GitHub Actions + Railway CLI**: Possible but adds complexity and a Railway token secret. Railway's native integration is simpler, more reliable, and is the Railway-recommended approach.
- **GitHub Actions only (build + push Docker image to registry)**: Over-engineered; Railway's native Docker build is sufficient and removes the need for a container registry.

---

## Decision 2: CI Quality Checks — Scope

**Decision**: The GitHub Actions CI workflow will run:
1. **Backend**: `black --check` and `ruff check` on `backend/` (constitution Principle I)
2. **Frontend**: `npm run build` on `frontend/` (validates TypeScript compilation and build integrity)

Test suite execution is explicitly out of scope per the feature spec.

**Rationale**: The constitution mandates that code must pass `black` and `ruff` before merging. Pre-commit hooks enforce this locally, but CI enforces it in the shared pipeline for contributors who may skip hooks or use the GitHub web editor.

**Alternatives considered**:
- Including pytest: Out of scope per spec; deferred to a future CI enhancement.
- Including React Testing Library tests: Out of scope per spec.

---

## Decision 3: Internal Service Networking in Railway

**Decision**: Update `frontend/nginx.conf` to proxy `/api` to `http://backend.railway.internal:8000` instead of `http://backend:8000`.

**Rationale**: In Railway's environment, services communicate over Railway's internal private network using the `.railway.internal` hostname. Using the internal hostname keeps API traffic off the public internet and avoids egress charges. The hostname pattern is `<service-name>.railway.internal`.

**Alternatives considered**:
- Using the public Railway URL for the backend: Works but routes traffic through the internet unnecessarily and introduces latency and potential rate limits.

---

## Decision 4: Backend Startup Sequence for Production

**Decision**: Update the backend `Dockerfile` CMD to run Alembic migrations before starting the uvicorn server:
```
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
```

**Rationale**: Railway does not have a separate "pre-deploy" hook at the free/hobby tier. Running migrations in the Docker CMD ensures the database schema is always up-to-date before the application starts accepting traffic. Railway's health check (waiting for `/api` to return 200) naturally gates traffic until the app is ready — meaning migrations complete before any request is served.

**Alternatives considered**:
- Railway start command override in dashboard: Works but is harder to version-control and auditable than a Dockerfile CMD.
- Railway's `railway.toml` pre-deploy command: Available on Pro tier; not relied upon here for portability.

---

## Decision 5: PR Preview Environment Database

**Decision**: PR preview environments share the `sculpt-dev` Supabase instance (the development database). No per-PR database is provisioned.

**Rationale**: Per-PR isolated databases would require automation to provision/tear down Supabase instances, which is significantly more complex. The development Supabase instance is already present and accepts connections. Preview environments are for functional review, not data isolation.

**Risk mitigation**: Preview environments should use a dedicated Supabase development project (`sculpt-dev`), not the production project, so any data written during PR testing doesn't affect production data.

**Alternatives considered**:
- Per-PR Supabase branch (Supabase branching feature): More isolated but requires Supabase Pro plan and additional automation. Deferred as a future enhancement.

---

## Decision 6: Secret and Environment Variable Management

**Decision**: All secrets (`DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS`) are managed in Railway's per-environment variable store. GitHub Actions uses Railway's public metadata only (no Railway token stored in GitHub Secrets for deployment, since Railway's native integration handles auth itself).

For the CI workflow, no secrets are needed: linting and build checks run without database connectivity.

**Rationale**: This minimises the number of secret stores to manage and avoids Railway tokens leaking through GitHub Actions logs.
