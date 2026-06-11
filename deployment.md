# Deployment Guide: Railway + Supabase

## 1. Multi-Environment Strategy

| Environment | Branch trigger | Supabase instance |
| :--- | :--- | :--- |
| Production | merge to `main` | `sculpt-prod` |
| Develop | push to `develop` | `sculpt-dev` |
| PR Preview | any PR → `main` | `sculpt-dev` (shared) |

## 2. Supabase Setup

1. Create two Supabase projects: `sculpt-prod` and `sculpt-dev`.
2. For each, go to **Project Settings → Database → Connection Pooling → Transaction mode** and copy the connection string (port 6543).
   - Format: `postgres://postgres.[USER]:[PASS]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true`
3. When creating a project, **disable** Data API, auto-expose tables, and automatic RLS — Sculpt connects directly via SQLAlchemy and does not use Supabase client libraries.

## 3. Railway Setup

### Create the project
1. railway.app → New Project → Deploy from GitHub repo → authorise Railway GitHub App → select repo.
2. Railway creates a default environment — rename it to match your target (`Production` or `Develop`) and set the branch trigger accordingly.
3. For **PR Preview environments**: Project Settings → PR Environments → Enable → base environment: `Develop`.

### Add backend service
- Source directory: `/backend`
- Health check path: `/api`
- Environment variables:

| Variable | Value |
| :--- | :--- |
| `PORT` | `8000` |
| `DATABASE_URL` | Supabase Transaction Pooler URL (port 6543) |
| `JWT_SECRET` | `openssl rand -hex 32` |
| `CORS_ORIGINS` | `https://<frontend-public-domain>` |

> Set `CORS_ORIGINS` after the frontend service is created and Railway assigns it a public domain.

### Add frontend service
- Source directory: `/frontend`
- Railway uses the `production` Docker stage (Nginx) automatically.
- Generate a public domain under **Networking → Public Domain**.
- Environment variables:

| Variable | Value |
| :--- | :--- |
| `REACT_APP_BACKEND_URL` | `https://<backend-public-domain>` |

> `REACT_APP_BACKEND_URL` is baked into the JS bundle at build time. Set it before the first deploy, or redeploy after setting it.

## 4. Known Configuration Details

### Internal networking
`nginx.conf` proxies `/api` to the backend using Railway's private network. The hostname must match the Railway service name (check **Private Networking** in the service settings):

```nginx
location /api {
    resolver 127.0.0.11 valid=30s;
    set $backend "http://<service-name>.railway.internal:8000";
    proxy_pass $backend;
}
```

The `resolver` directive is required — without it nginx resolves the hostname at startup and crashes if the backend isn't ready yet.

### Supabase pgbouncer compatibility
The transaction pooler does not support prepared statements. `statement_cache_size=0` is set in `database.py` to disable them — no action required.

### DATABASE_URL scheme
Supabase provides `postgres://` URLs. The app rewrites them to `postgresql+asyncpg://` at runtime — no action required.

## 5. Deployment Workflow

1. **Develop:** Push to `develop` → Railway deploys to Develop environment.
2. **Review:** Open a PR to `main` → Railway generates a Preview URL.
3. **Deploy:** Merge to `main` → Railway zero-downtime rolling update to Production.
