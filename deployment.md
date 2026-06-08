# Deployment Guide: Railway + Supabase

This guide explains how to deploy Sculpt to [Railway](https://railway.app/) using its native Docker support and [Supabase](https://supabase.com/) as the database.

## 1. Multi-Environment Strategy
Railway allows you to create separate **Environments** (e.g., `Production`, `Develop`) within a single project. Each environment has its own:
- **Environment Variables:** Point to different Supabase instances (e.g., `DEV_DB_URL` vs `PROD_DB_URL`).
- **Unique URLs:** For example, `sculpt.up.railway.app` (Prod) and `sculpt-dev.up.railway.app` (Dev).
- **Branch Mapping:** `main` branch deploys to Prod; `develop` branch deploys to Dev.

## 2. Infrastructure Setup

### A. Supabase (Database)
1. Create two Supabase projects: `sculpt-prod` and `sculpt-dev`.
2. For each, go to **Settings > Database** and copy the **Connection string (URI)**.
3. Ensure you replace `[YOUR-PASSWORD]` with your actual database password.

### B. Railway (Services)
1. Create a **New Project** in Railway and connect your GitHub repository.
2. **Add Backend Service:**
   - Source: `/backend` folder.
   - Port: `8000`.
   - Variables: `DATABASE_URL` (from Supabase), `JWT_SECRET`, `CORS_ORIGINS`.
3. **Add Frontend Service:**
   - Source: `/frontend` folder.
   - Port: `80`.
   - Railway will use the `production` stage in your `Dockerfile`.

## 3. Configuration Details

### Internal Networking
By default, your frontend's `nginx.conf` proxies `/api` to `http://backend:8000`. In Railway, update this to use the internal service name:
```nginx
location /api {
    proxy_pass http://backend.railway.internal:8000;
}
```

### Environment Variables
| Variable | Environment | Value |
| :--- | :--- | :--- |
| `DATABASE_URL` | Production | `postgresql://postgres:prod-pass@db-prod-host:5432/postgres` |
| `DATABASE_URL` | Develop | `postgresql://postgres:dev-pass@db-dev-host:5432/postgres` |

## 4. Deployment Workflow
1. **Develop:** Push changes to the `develop` branch. Railway builds and deploys to the `Develop` environment.
2. **Test:** Verify your changes at the `Develop` URL.
3. **Deploy:** Merge `develop` into `main`. Railway automatically redeploys the `Production` environment.
