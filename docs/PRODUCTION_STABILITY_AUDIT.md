# Production Stability Audit — Phase 45

Дата: 2026-07-22  
Цель: Railway / env / migrations / uploads / health / sitemap safety. UI freeze.

## 1. Deployment setup

| Item | Status |
|------|--------|
| Builder | Nixpacks (`railway.toml`) |
| Build | `npm run build` (Nixpacks default) |
| `postinstall` | `prisma generate` |
| Start | `npm run start` → `next start` |
| Release | `npx prisma migrate deploy` |
| Dockerfile | none |
| Local DB | migrations up to date (9 migrations) |

Push to `main` → Railway build → release migrate deploy → start.

## 2. Required env vars

| Variable | Notes |
|----------|-------|
| `DATABASE_URL` | PostgreSQL |
| `NEXT_PUBLIC_APP_URL` | Canonical site URL (HTTPS on Railway) |

## 3. Optional env vars

| Variable | Notes |
|----------|-------|
| `UPLOAD_DIR` | Production: `/app/uploads` + Volume |
| `OTP_SECRET` | Prefer set; else falls back to `DATABASE_URL` for hash salt |
| `DEMO_OTP_ENABLED` | `true` only for temporary testing — **disable before real users** |
| `SMS_PROVIDER` | Future SMS |
| `GOOGLE_CLIENT_ID` | OAuth |
| `GOOGLE_CLIENT_SECRET` | OAuth |
| `GOOGLE_REDIRECT_URI` | Must match Railway callback URL |
| `LOG_LEVEL` | default `info` |
| `NEXT_PUBLIC_GA_ID` | Analytics |
| `NEXT_PUBLIC_YANDEX_METRIKA_ID` | Analytics |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console |
| `NEXT_PUBLIC_YANDEX_VERIFICATION` | Yandex Webmaster |

Never commit real secret values.

## 4. Migration policy

- Local schema change: `npx prisma migrate dev --name …`
- Production: **only** `npx prisma migrate deploy` (also Railway `releaseCommand`)
- Do **not** on Railway: `migrate dev`, `db push`, `migrate reset`
- Phase 45: **no schema changes** → no new migration required beyond existing release command

## 5. Seed policy

- Seed only if `prisma/seed.ts` / справочники changed
- Phase 45: **seed not required**

## 6. Uploads / volume policy

- `UPLOAD_DIR` → absolute root (`getUploadRootDir`)
- Public URLs: `/api/uploads/listings/...` via `normalizeListingImageUrl`
- Archive/soft-hide does **not** delete files
- Missing file → 404 (build does not require folder to exist)
- Railway: attach Volume at `/app/uploads`, set `UPLOAD_DIR=/app/uploads`

## 7. Healthcheck

`GET /api/health` (`force-dynamic`):

```json
{
  "ok": true,
  "service": "tutopt",
  "app": "tutopt",
  "environment": "production",
  "timestamp": "...",
  "database": "ok"
}
```

DB probe: `SELECT 1` with try/catch; `503` if DB down. No secrets in body.

## 8. Sitemap / robots safety

- `sitemap.ts`: `dynamic = "force-dynamic"` + try/catch → static fallback URLs if DB fails
- `robots.ts`: uses `getAbsoluteUrl` / `NEXT_PUBLIC_APP_URL` (localhost fallback only for missing env)

## 9. Demo OTP warning

If `DEMO_OTP_ENABLED=true` on production:

- OTP may be returned in API responses
- Temporary testing only
- **Before real launch:** set `DEMO_OTP_ENABLED=false` or unset
- Phase 45: production console no longer prints OTP codes (only a warning that demo mode is on)

## 10. Known production risks

1. Demo OTP left enabled on Railway  
2. `OTP_SECRET` unset (hashing falls back to `DATABASE_URL`)  
3. Uploads Volume not mounted → images lost on redeploy  
4. `NEXT_PUBLIC_APP_URL` wrong → broken OG/sitemap/OAuth redirects  
5. Google OAuth callback mismatch with Railway URL  

## 11. Railway post-deploy checklist

1. Push `main` → wait successful deploy  
2. Confirm release `prisma migrate deploy` succeeded (or run manually if needed)  
3. Seed **only** if seed changed  
4. `GET /api/health` → `ok: true`, `database: ok`  
5. Check env: `NEXT_PUBLIC_APP_URL`, `UPLOAD_DIR`, `DEMO_OTP_ENABLED`  
6. Spot-check `/`, `/listings`, `/sitemap.xml`, `/robots.txt`  
7. Smoke later (see `PRODUCTION_CHECKLIST.md`)  

## Phase 45 code changes

- Health: add `service: "tutopt"`  
- Demo OTP: do not log OTP codes in production console  
- Docs: this file + deploy/checklist updates
