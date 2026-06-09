# Contract: Railway Environment Configuration

**Configured via**: Railway dashboard (not version-controlled files)
**Reference**: `deployment.md`

---

## Environments

| Environment | Branch Trigger | Supabase Instance | Purpose |
|---|---|---|---|
| `Production` | `main` (merge) | `sculpt-prod` | Live user-facing application |
| `Develop` | `develop` (push) | `sculpt-dev` | Shared team testing environment |
| `PR Preview` | Any PR → `main` | `sculpt-dev` | Feature review before merge |

---

## Services per Environment

### Backend Service

| Property | Value |
|---|---|
| Source | `/backend` directory |
| Build | Railway auto-detects Dockerfile |
| Port | `8000` |
| Health check path | `/api` |
| Start behaviour | Migrations run before server starts (in Dockerfile CMD) |

**Required environment variables** (per environment):

| Variable | Production | Develop | PR Preview |
|---|---|---|---|
| `DATABASE_URL` | `sculpt-prod` transaction pooler URL | `sculpt-dev` transaction pooler URL | Inherited from Develop |
| `JWT_SECRET` | Production secret | Dev secret | Inherited from Develop |
| `CORS_ORIGINS` | Production frontend Railway URL | Develop frontend Railway URL | Preview frontend Railway URL (set automatically by Railway) |

### Frontend Service

| Property | Value |
|---|---|
| Source | `/frontend` directory |
| Build | Railway uses `production` Docker stage (Nginx) |
| Port | `80` |
| Health check | Default (HTTP 200 on `/`) |

**Required environment variables**: None (static file server; API calls go through Nginx proxy to backend)

---

## Internal Networking Contract

The Nginx proxy in the frontend must route `/api` traffic to the backend using Railway's internal network:

```
proxy_pass http://backend.railway.internal:8000;
```

This hostname is resolved automatically by Railway within the same environment. The same `nginx.conf` is used across all environments.

---

## PR Preview Environment Lifecycle

| Event | Railway Action |
|---|---|
| PR opened against `main` | New preview environment provisioned; backend + frontend deployed |
| Push to PR branch | Preview environment updated |
| PR merged | Preview environment deleted |
| PR closed (without merge) | Preview environment deleted |
