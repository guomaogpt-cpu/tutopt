# Launch Readiness Summary

Дата: 2026-07-24 (Phase 50)

## Current status

**Code-level checks are expected to pass.**  
**Manual smoke test is still required before launch.**

Не считать продукт полностью готовым к публичному запуску, пока не пройден
`docs/FINAL_SMOKE_TEST_CHECKLIST.md` на production (или staging = prod).

---

## Completed stabilization phases

| Phase | Focus | Doc |
|-------|--------|-----|
| **41** | MVP audit | `docs/MVP_AUDIT_PHASE_41.md` |
| **42** | Seller flow | `docs/SELLER_FLOW_STABILIZATION.md` |
| **43** | Buyer flow | `docs/BUYER_FLOW_STABILIZATION.md` |
| **44** | Admin / moderation | `docs/ADMIN_MODERATION_STABILIZATION.md` |
| **45** | Production / Railway | `docs/PRODUCTION_STABILITY_AUDIT.md` |
| **46** | Mobile / responsive | `docs/MOBILE_RESPONSIVE_STABILIZATION.md` |
| **47** | SEO / indexing | `docs/SEO_INDEXING_STABILIZATION.md` |
| **48** | Security / anti-spam | `docs/SECURITY_ANTISPAM_STABILIZATION.md` |
| **49** | Final smoke checklist | `docs/FINAL_SMOKE_TEST_CHECKLIST.md`, `docs/LAUNCH_BLOCKERS.md` |
| **50** | Final cleanup | this file |

---

## What is ready

- Public pages (`/`, catalog, verticals, listing detail, seller profile)
- Seller flow (onboarding, create/edit, archive/restore/renew, leads)
- Buyer flow (leads, favorites, dashboard, notifications)
- Admin / moderation (listings, reports, users/restrictions, audit)
- Production deployment docs (`DEPLOY_WORKFLOW`, `PRODUCTION_CHECKLIST`, Railway `migrate deploy`)
- Security baseline (auth/owner/role, rate limits, upload MIME checks)
- SEO baseline (metadata, robots, safe sitemap)
- Mobile baseline (critical overflow/wrap fixes)
- Brand consistency in active UI/metadata: **ВсеТут**; market = **Объявления**; wholesale product name **ТутОпт** where vertical-specific

---

## What must be checked manually

- Auth (register / OTP / login / logout; Google if configured)
- Seller listing create / edit / upload
- Buyer lead submit + favorites
- Admin approve / reject + reports
- Railway deploy success
- Uploads on production volume (`UPLOAD_DIR=/app/uploads`)
- `/sitemap.xml` and `/robots.txt`
- `/api/health`
- Mobile quick smoke (home / catalog / detail / forms)
- `DEMO_OTP_ENABLED=false` (or unset) before real users

Full boxes: `docs/FINAL_SMOKE_TEST_CHECKLIST.md`.

---

## Known non-blockers

- UI polish after launch
- Production-grade Redis/DB rate limiting later
- Real SMS provider later
- Advanced analytics later
- Advanced structured SEO (WebSite/SearchAction) later
- Deeper automated tests later
- `/compare` route not built
- Soft-delete/trash beyond `ARCHIVED` later
- Historical strategy docs may still say «Tutopt» / «ТутМаркет» (legacy product docs; not runtime)

---

## Production launch steps

1. Push `main` (already continuous)
2. Wait for Railway deploy success
3. Run `npx prisma migrate deploy` **only if** a new migration exists (releaseCommand usually does this)
4. Run seed **only if** seed/справочники changed
5. Check `/api/health`
6. Run manual smoke checklist (`docs/FINAL_SMOKE_TEST_CHECKLIST.md`)
7. Confirm env: `NEXT_PUBLIC_APP_URL`, `UPLOAD_DIR`, `DEMO_OTP_ENABLED=false`, `OTP_SECRET`

**Never on Railway production:** `prisma migrate dev`, `db push`, `migrate reset`, destructive seed without a plan.
