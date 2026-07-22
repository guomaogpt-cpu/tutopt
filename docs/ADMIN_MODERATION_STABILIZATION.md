# Admin / Moderation Stabilization — Phase 44

Дата: 2026-07-22  
UI freeze: без косметики. Стабилизация admin/moderator MVP.

## 1. Admin route map

| Route | Status | Access |
|-------|--------|--------|
| `/admin` | OK | Staff (ADMIN \| MODERATOR) |
| `/admin/moderation` | Redirect → listings | Staff |
| `/admin/moderation/listings` | OK | Staff |
| `/admin/reports` | OK | Staff |
| `/admin/reports/[id]` | **No page** (API only) | Staff API |
| `/admin/users` | OK | ADMIN only |
| `/admin/audit` | OK | ADMIN only |
| `/admin/settings` | **MISSING** (docs only, not linked) | — |

Layout gate: `src/app/admin/layout.tsx` — guest → login, non-staff → `/`.

## 2. Access rules

| Role | Dashboard | Moderation | Reports | Users | Audit |
|------|-----------|------------|---------|-------|-------|
| Guest | login | — | — | — | — |
| BUYER/SELLER | → `/` | — | — | — | — |
| MODERATOR | yes | yes | yes | → moderation | → `/admin` |
| ADMIN | yes | yes | yes | yes | yes |

### API guards

| Endpoint | Guard |
|----------|-------|
| `PATCH /api/admin/listings/[id]/moderation` | `requireStaff` |
| `PATCH /api/admin/reports/[id]` | `requireStaff` |
| `PATCH /api/admin/users/[id]/role` | `requireAdmin` |
| `PATCH /api/admin/users/[id]/restrictions` | `requireAdmin` |

Middleware only sets `x-pathname` for `/admin/*` (auth is layout + API).

## 3. Listing moderation flow

1. Seller creates → `PENDING_MODERATION`.
2. Staff opens `/admin/moderation/listings`.
3. **Approve** → `PUBLISHED`, sets `published_at`; refreshes `expires_at` if null/expired.
4. **Reject** → `REJECTED` (no public visibility).
5. Only `PENDING_MODERATION` can be approved/rejected (cannot approve `ARCHIVED`).
6. Audit: `listing.approve` / `listing.reject` (+ `listing.expire_publish_date_set` when needed).

## 4. Status map (Prisma)

```
ListingStatus:
  DRAFT
  PENDING_MODERATION
  PUBLISHED
  REJECTED
  ARCHIVED

ReportStatus:
  OPEN
  RESOLVED
  DISMISSED

UserRole:
  BUYER | SELLER | MODERATOR | ADMIN
```

Expiration is **not** a status — field `expires_at` + `buildNotExpiredListingFilter`.

Public visibility: `PUBLISHED` + not expired.

## 5. Report handling

- List UI null-safe if listing/seller missing.
- Actions on list (no `/admin/reports/[id]` page).
- Only `OPEN` reports can be reviewed/dismissed.
- Audit: `report.review` / `report.dismiss`.

## 6. User restriction behavior

- Block / restrict listings / restrict leads — ADMIN only.
- Cannot self-block or restrict other ADMIN.
- Role change: ADMIN only; cannot promote to ADMIN; cannot change ADMIN/SELLER targets; self-change blocked.
- Blocked user cannot create listings / send leads (restriction helpers).
- Block does **not** auto-hide already `PUBLISHED` listings (MVP policy).

## 7. Audit behavior

Logged: approve/reject, report review/dismiss, user block/restrict/role_change, seller create/update/archive/restore/renew.

Labels include `listing.create` (Phase 44).

No phone/email stored in moderation audit metadata.

## 8. Public visibility after moderation

| Action | Public result |
|--------|---------------|
| Approve | Visible if not expired |
| Reject | Hidden |
| Seller archive | Hidden (`ARCHIVED`) |
| Expired `PUBLISHED` | Hidden by filter |
| Restore | → `PENDING_MODERATION` |

Surfaces: home, `/listings`, detail, verticals, storefront, similar, sitemap.

## 9. Known gaps

1. `/admin/settings` not built.
2. `/admin/reports/[id]` page not built (inline actions OK).
3. Reject does not persist `rejection_reason` field.
4. Demoted MODERATOR with seller profile → `SELLER` (cannot re-promote via API).
5. Middleware is not an auth layer (layout + API only).

## 10. Smoke later (manual)

- [ ] Guest `/admin` → login  
- [ ] BUYER `/admin` → `/`  
- [ ] MODERATOR: moderation + reports OK; users/audit redirected  
- [ ] Approve pending → appears in `/listings`  
- [ ] Reject → not public; owner can still open  
- [ ] Cannot approve archived  
- [ ] Report resolve/dismiss  
- [ ] Cannot self-block; cannot promote to ADMIN  
- [ ] Header: Жалобы for staff  

## Phase 44 fixes

1. Admin published counts = `PUBLISHED` + not expired (aligned with public visibility).  
2. Header/mobile: «Жалобы» for ADMIN/MODERATOR.  
3. Audit label `listing.create`.  
4. Docs: this file + MVP audit follow-up.
