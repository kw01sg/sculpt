# Deployment Guide: Railway + Supabase

This guide explains how to deploy Sculpt to [Railway](https://railway.app/) using its native Docker support and [Supabase](https://supabase.com/) as the database.

## 1. Multi-Environment Strategy
Railway allows you to create separate **Environments** (e.g., `Production`, `Develop`) within a single project.

*   **Production:** Triggered by merges to `main`.
*   **Develop:** Triggered by pushes to `develop`.
*   **PR Previews:** Railway automatically creates a temporary environment for every Pull Request, allowing you to test features in isolation before merging.

## 2. Infrastructure Setup

### A. Supabase (Database)
1. Create two Supabase projects: `sculpt-prod` and `sculpt-dev`.
2. **Crucial:** Use the **Transaction Mode** connection string (port 6543) for the `DATABASE_URL`. This uses Supavisor for connection pooling, which is necessary for FastAPI's async nature.
   - Format: `postgres://postgres.[USER]:[PASS]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true`

### B. Railway (Services)
1. **Add Backend Service:**
   - Source: `/backend` folder.
   - Port: `8000`.
   - Health Check Path: `/api` (Railway waits for this to return 200 before routing traffic).
   - Variables: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS`.
2. **Add Frontend Service:**
   - Source: `/frontend` folder.
   - Port: `80`.
   - Railway will use the `production` stage in your `Dockerfile` (Nginx).

## 3. Configuration Details

### Internal Networking
By default, your frontend's `nginx.conf` proxies `/api` to `http://backend:8000`. In Railway, use the internal service name to keep traffic off the public internet:
```nginx
location /api {
    proxy_pass http://backend.railway.internal:8000;
}
```

### Environment Variables & CORS
| Variable | Value | Notes |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgres://...:6543/...` | Use Transaction Pooler |
| `CORS_ORIGINS` | `https://sculpt.up.railway.app` | Your frontend's public URL |

## 4. Deployment Workflow
1. **Develop:** Push to `develop`. Test at the development URL.
2. **Review:** Open a PR to `main`. Railway generates a **Preview URL**.
3. **Deploy:** Merge to `main`. Railway performs a zero-downtime "rolling update" to Production.
