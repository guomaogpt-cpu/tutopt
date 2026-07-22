# Final Smoke Test Checklist

Дата чеклиста: 2026-07-22 (Phase 49)  
**Code checks can pass independently. Manual smoke is still required before launch.**

---

## 1. Before testing

| Item | Value / action |
|------|----------------|
| Current branch | `main` (confirm: `git rev-parse --abbrev-ref HEAD`) |
| Latest commit | confirm: `git log -1 --oneline` |
| Railway deploy | Wait until latest `main` deploy is **Success** |
| Migration needed? | **No** for Phase 49 (no schema change). Release still runs `npx prisma migrate deploy` — should be no-op if already applied |
| Seed needed? | **No** unless seed/справочники менялись отдельно |
| Required env | `DATABASE_URL`, `NEXT_PUBLIC_APP_URL`; recommend `OTP_SECRET`; `UPLOAD_DIR` if volume; Google trio if OAuth; `SMS_PROVIDER` or `DEMO_OTP_ENABLED` for OTP |
| Demo OTP status | Prefer `DEMO_OTP_ENABLED=false` for real users. If `true` — temporary testing only (OTP in API body) |
| Health baseline | `GET /api/health` → `ok: true`, `database: "ok"` |

---

## 2. Public smoke

- [ ] Open `/` — loads, no crash, no horizontal scroll break
- [ ] Open `/listings` — catalog loads
- [ ] Search from header — results / navigation works
- [ ] Filter catalog (vertical/category/city if available)
- [ ] Open a published listing `/listings/[id]`
- [ ] Open `/opt`
- [ ] Open `/market`
- [ ] Open `/services`
- [ ] Open `/cargo`
- [ ] Open `/seller/[id]` for a real seller
- [ ] Open `/sitemap.xml` — XML loads (static URLs at minimum)
- [ ] Open `/robots.txt` — Disallow private paths + sitemap URL
- [ ] Open `/api/health` — 200, `ok: true`
- [ ] Guest: non-public listing (pending/archived/rejected) → not found / noindex, not full public content

---

## 3. Auth smoke

- [ ] Register by phone
- [ ] OTP send
- [ ] OTP verify
- [ ] Login
- [ ] Logout
- [ ] Google OAuth (only if `GOOGLE_*` env configured) — skip if not configured
- [ ] Blocked account cannot login (if test user available)

---

## 4. Seller smoke

- [ ] Seller onboarding / upgrade as needed
- [ ] Create listing (`/listings/new`)
- [ ] Upload 1–3 images (JPG/PNG/WEBP)
- [ ] Submit listing → pending/published per flow
- [ ] See listing in `/seller/listings`
- [ ] Edit listing
- [ ] Archive listing
- [ ] Restore listing
- [ ] Renew listing (if published / eligible)
- [ ] Soft delete — **N/A** (no separate soft-delete; use **Archive**)
- [ ] Open `/seller/leads` (own leads only)
- [ ] Cannot edit another seller’s listing (expect 404 / forbidden)

---

## 5. Buyer smoke

- [ ] Open catalog
- [ ] Open listing detail
- [ ] Send lead
- [ ] Add favorite
- [ ] Remove favorite
- [ ] Add compare — **N/A** (`/compare` route not built; no UI links)
- [ ] Open `/compare` — **expect 404** (known gap, not launch blocker)
- [ ] Recently viewed appears (buyer dashboard / panel)
- [ ] Save search (if UI present)
- [ ] Open `/buyer/dashboard`
- [ ] Open `/notifications`
- [ ] Mark notification read
- [ ] Cannot lead on own listing

---

## 6. Admin smoke

- [ ] Open `/admin` (staff only; guest redirected to login)
- [ ] Open `/admin/users` (ADMIN; moderator may be redirected)
- [ ] Open `/admin/moderation/listings`
- [ ] Approve listing
- [ ] Reject listing
- [ ] Open `/admin/reports`
- [ ] Update report status (resolve/dismiss)
- [ ] Restrict / unrestrict test user (ADMIN)
- [ ] Open `/admin/audit` if available
- [ ] Guest `/admin` → login / no access

---

## 7. Production smoke

- [ ] Railway deploy success for latest `main`
- [ ] Release `npx prisma migrate deploy` succeeded (or no pending migrations)
- [ ] Do **not** run `migrate dev` / `db push` / reset on Railway
- [ ] Seed **only if** seed changed — otherwise skip
- [ ] `/api/health` on production URL
- [ ] Upload image after deploy (volume / `UPLOAD_DIR`)
- [ ] `/sitemap.xml` and `/robots.txt` on production host
- [ ] `NEXT_PUBLIC_APP_URL` matches production origin (canonical/OG)

---

## 8. Mobile quick smoke

- [ ] Homepage mobile — no horizontal scroll
- [ ] Catalog mobile — filters usable
- [ ] Listing detail mobile — images/title/lead form
- [ ] Create listing mobile — form/uploader usable
- [ ] Seller dashboard mobile — stack / actions wrap
- [ ] Buyer dashboard mobile — cards stack

---

## 9. Known non-blockers

- Production-grade Redis/DB rate limit later
- Real SMS provider later (`DEMO_OTP` / missing SMS is env/ops, not code crash)
- UI polish (logo size, colors, card aesthetics) after launch
- Advanced analytics later
- Advanced SEO structured data (WebSite/SearchAction) later
- `/compare` MVP later or cut from roadmap
- Separate soft-delete/trash beyond `ARCHIVED` later
- Admin mobile not phone-perfect (usable with overflow scroll)
- Duplicate report DB unique constraint later

---

## 10. Launch decision

| Blocker | Status | Owner | Notes |
|---------|--------|-------|-------|
| Production build / lint / prisma validate | Pass (code) | Eng | Re-confirm on CI/Railway |
| `/api/health` | Pass (code) | Eng | Manual confirm on prod URL |
| Public routes exist | Pass | Eng | `/compare` missing by design |
| Auth/seller/buyer/admin write guards | Pass (code) | Eng | Manual abuse cases recommended |
| Public visibility (published + not expired) | Pass (code) | Eng | Manual spot-check hidden listings |
| Sitemap build-safe | Pass (code) | Eng | try/catch + force-dynamic |
| Manual smoke (sections 2–8) | **Pending** | Launch owner | Required before “go live” |

**Decision rule:** do not mark launch Ready until sections 2–7 are manually checked on production (or staging that mirrors prod).
