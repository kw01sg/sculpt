# Contract: GitHub Actions CI Workflow

**File**: `.github/workflows/ci.yml`
**Trigger**: Every push to any branch; every pull request targeting `main` or `develop`
**Purpose**: Run quality gates before Railway picks up the commit for deployment

---

## Trigger Contract

```yaml
on:
  push:
    branches: ["**"]
  pull_request:
    branches: [main, develop]
```

## Jobs Contract

### Job: `backend-lint`

| Property | Value |
|---|---|
| Runner | `ubuntu-latest` |
| Working directory | `./backend` |
| Python version | `3.11` |
| Steps | Install deps → `black --check .` → `ruff check .` |
| Failure behaviour | Blocks PR merge; Railway still receives the push but deployment outcome is visible alongside CI status |

**Packages installed** (from `requirements.txt` + dev tools):
- `black`
- `ruff`

### Job: `frontend-build`

| Property | Value |
|---|---|
| Runner | `ubuntu-latest` |
| Working directory | `./frontend` |
| Node version | `18` |
| Steps | `npm ci` → `npm run build` |
| Failure behaviour | Blocks PR merge; surfaces TypeScript compile errors and missing dependencies |

---

## Status Reporting Contract

Both jobs post their pass/fail status as GitHub commit status checks. Combined with Railway's native deployment status, a PR will show:

| Check | Source | Meaning |
|---|---|---|
| `backend-lint` | GitHub Actions | Black + Ruff passed |
| `frontend-build` | GitHub Actions | TypeScript + React build succeeded |
| `Railway: backend (preview)` | Railway GitHub App | Backend deployed to preview |
| `Railway: frontend (preview)` | Railway GitHub App | Frontend deployed to preview |

A PR is considered safe to merge only when all four checks pass.

---

## Out of Scope

- Running pytest (deferred to a future CI enhancement)
- Running React Testing Library tests (deferred)
- Docker build in CI (Railway handles this natively)
- Pushing to a container registry (Railway handles this natively)
