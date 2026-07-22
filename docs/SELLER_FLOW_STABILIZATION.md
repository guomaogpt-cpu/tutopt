# Seller Flow Stabilization — Phase 42

Дата: 2026-07-22  
UI freeze: без косметики. Только стабилизация seller MVP.

## 1. Seller route map

| Route | Guard | Notes |
|-------|-------|-------|
| `/seller/onboarding` | Auth → BUYER→buyer dashboard → non-SELLER→`/` | OTP + SellerProfile |
| `/seller/dashboard` | Auth → BUYER→upgrade → incomplete SELLER→onboarding → SELLER\|ADMIN | Stats, quick actions, leads |
| `/seller/listings` | same | Filters + lifecycle actions |
| `/seller/leads` | same | Own leads only |
| `/listings/new` | Auth → BUYER→upgrade → incomplete→onboarding → SELLER\|ADMIN | Create form |
| `/listings/[id]/edit` | Auth → SELLER\|ADMIN + owner | Prefill + update |
| `/listings/[id]` | Public via `canViewListing` | Owner sees non-public |
| `/seller/[id]` | Public | Only PUBLISHED + not expired |

## 2. Onboarding behavior

- `needsSellerOnboarding`: role `SELLER` + phone incomplete (null / placeholder `+996000000000` / invalid KG).
- Google SELLER without phone → onboarding before create/dashboard.
- After onboarding → `/seller/dashboard` or `next`.
- **Phase 42:** `ensureSellerProfile` / create API use `isSellerPhoneComplete` (aligned with pages).

## 3. Create listing flow

1. Guest → login  
2. BUYER → seller upgrade  
3. Incomplete SELLER → onboarding  
4. Restricted/blocked → forbidden  
5. Create → `PENDING_MODERATION`, images required, vertical↔category match  
6. Audit: `listing.create`

## 4. Edit listing flow

- Owner only (`sellerProfile.user_id === user.id`).
- Roles: `SELLER` or `ADMIN` (aligned with create).
- PUBLISHED / REJECTED edits → back to `PENDING_MODERATION` (existing policy).
- Audit: `listing.update`.

## 5. Lifecycle actions

| Action | Behavior |
|--------|----------|
| archive | → `ARCHIVED`; no physical delete; images/leads/reports kept |
| restore | → `PENDING_MODERATION` |
| soft delete | **нет отдельного API** — архив = soft hide |
| renew | Owner; expired PUBLISHED → moderation; audit `listing.renew` |

Public never shows ARCHIVED / non-PUBLISHED / expired.

## 6. Renew behavior

- Helper: `canOwnerRenewListing` (SELLER \| ADMIN owner).
- UI: renew on published cards; API also allows pending.

## 7. Seller leads

- Filtered by `seller_profile_id`.
- Survives archive (listing row remains).
- No public visibility requirement on lead list.

## 8. Seller visibility rules

| Surface | Rule |
|---------|------|
| Catalog / home / vertical / storefront | `PUBLISHED` + not expired |
| Seller listings | All own statuses; `expired` filter = PUBLISHED + `expires_at < now` |
| Detail | `canViewListing` |

## 9. Known gaps

1. Нет отдельного soft-delete status (`DELETED`) — только `ARCHIVED`.
2. Password login не форсит onboarding URL напрямую (pages re-guard).
3. `/compare` отсутствует (Phase 41).
4. Seller dashboard не редизайнили (намеренно).

## 10. Smoke later (manual)

- [ ] Google SELLER без phone → onboarding → dashboard  
- [ ] Create listing + photos → pending  
- [ ] Edit own → pending when published  
- [ ] Archive / restore  
- [ ] Renew active + expired  
- [ ] Leads remain after archive  
- [ ] `/seller/[id]` only public listings  
- [ ] Menu: Мои объявления → `/seller/listings`  
- [ ] Blocked seller cannot create  

## Phase 42 fixes

1. ADMIN aligned on edit / PATCH / lifecycle / renew (owner check).  
2. Create API phone/onboarding parity via `isSellerPhoneComplete`.  
3. `listing.create` audit log.  
4. Seller nav: «Мои объявления» → `/seller/listings`.  
5. Expired filter scoped to `PUBLISHED`.  
6. `isSellerPhoneComplete` type predicate.
