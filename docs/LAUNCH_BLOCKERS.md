# Launch Blockers

Дата: 2026-07-22 (Phase 49)

## Current status

**Unknown until manual smoke** — with code-level readiness:

> **Code checks passed. Manual smoke test is still required.**

Do **not** treat the product as fully launch-ready until `docs/FINAL_SMOKE_TEST_CHECKLIST.md` sections 2–7 are executed on the deployed environment.

---

## Critical blockers found by code audit

**None** that meet the Phase 49 launch-blocker definition.

Audited and OK at code level:

| Area | Result |
|------|--------|
| Key routes present | All critical routes exist except `/compare` (intentional gap) |
| `/api/health` | Present, DB ping, safe JSON, 503 if DB down |
| Sitemap | `force-dynamic` + try/catch → static fallback; should not break build |
| Robots | No DB dependency |
| Public listing visibility | Homepage, catalog, detail (`canViewListing`), vertical SEO, seller profile, sitemap use PUBLISHED + not-expired |
| Write API auth | Session-based `requireAuth` / `requireAdmin` / `requireStaff` + owner checks |
| Admin layout | Staff gate; guest redirected |
| Soft delete | Not a separate feature — **Archive** is the archival path (documented, not a blocker) |
| Railway | `releaseCommand = npx prisma migrate deploy`; start `npm run start` |

---

## Fixed in Phase 49

No code launch-blocker fixes were required.

Deliverables:

- `docs/FINAL_SMOKE_TEST_CHECKLIST.md` — manual launch checklist
- `docs/LAUNCH_BLOCKERS.md` — this status doc
- Roadmap note in `docs/MVP_AUDIT_PHASE_41.md`

## Phase 50 cleanup note

Final pre-launch cleanup (dead mock components, unused temp images, brand ВсеТут in active UI/copy, safer API error messages, quieter upload 404 logs).  
See `docs/LAUNCH_READINESS_SUMMARY.md`. No schema/migration. Manual smoke still required.

---

## Remaining manual checks

After Railway deploy of latest `main`:

1. `/api/health` on production
2. Guest: `/`, `/listings`, listing detail, verticals, `/sitemap.xml`, `/robots.txt`
3. Register → OTP → login → logout
4. Seller: create + upload + edit + archive/restore/renew + leads
5. Buyer: lead + favorites + dashboard + notifications
6. Admin: moderation approve/reject + reports + restriction
7. Mobile quick smoke (homepage/catalog/detail/forms)
8. Uploads persist on volume after restart (if applicable)
9. Confirm `DEMO_OTP_ENABLED` policy for real traffic

Full boxes: `docs/FINAL_SMOKE_TEST_CHECKLIST.md`.

---

## Not blockers

- `/compare` missing (no UI links; robots Disallow only)
- Redis/DB-backed rate limit
- Real SMS provider
- UI/logo/spacing polish
- Advanced analytics / SEO JSON-LD WebSite layer
- Soft-delete/trash beyond `ARCHIVED`
- Admin imperfect on small phones
- In-memory rate limits (multi-instance caveat)

---

## Phase 49 policy

- No redesign / logo / header / card / color changes
- No Prisma schema / migration
- No auth/uploads architecture changes
- No automated browser/smoke/dev verification in this phase
