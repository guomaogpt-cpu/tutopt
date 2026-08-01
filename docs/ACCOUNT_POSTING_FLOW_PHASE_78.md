# Phase 78 — Account posting flow (no hard buyer/seller UX)

## 1. Why buyer/seller was removed from signup UX

Choosing “buyer” vs “seller” at registration forced a marketplace split that does not match how users actually use the site (browse, favorite, request, then post).

Internal DB roles (`BUYER` / `SELLER`) remain for compatibility. The product UX treats everyone as an **account**.

## 2. Registration now

- `/register` has **no** role selector
- New phone/password accounts are always created as `BUYER`
- Google signup no longer needs a seller role from the register UI
- After auth: `returnUrl`/`next` if safe, otherwise account home

## 3. Who can post listings

Any authenticated user (`BUYER`, `SELLER`, `ADMIN`) can open `/listings/new`.

On first successful listing create:

- `ensureSellerProfile` soft-creates `SellerProfile` from name + verified phone
- `BUYER` is soft-promoted to `SELLER` in the DB (implementation detail)

If phone is missing/incomplete (typical Google-only account), user is sent to `/seller/onboarding` framed as **contact details for posting**, not “become a seller”.

## 4. Post types on `/listings/new`

Chooser first (unless `?vertical=` is already set):

| UI | Vertical |
| --- | --- |
| Объявление | `MARKET` |
| Услугу | `SERVICES` |
| Оптовое предложение | `OPT` |
| Карго-компанию | `CARGO` |

Deep links like `/listings/new?vertical=cargo` skip the chooser.

## 5. CargoRequest vs cargo listing

| Concept | Where | Meaning |
| --- | --- | --- |
| Cargo request | `/cargo` form | Client needs shipping |
| Cargo company listing | `/listings/new?vertical=cargo` | Carrier publishes a company card |

UI copy on `/cargo` explains the difference. Telegram/settings stay under `/seller/cargo-*`.

## 6. What did **not** change

- Core auth (sessions, OTP, Google OAuth plumbing)
- Prisma `UserRole` enum (no migration)
- Moderation / uploads / CargoRequest / CargoResponse / Telegram
- Admin-only routes

## 7. Future

- Dedicated `CompanyProfile` model
- Company verification
- Staff roles inside a company
- Unified account dashboard (merge buyer/seller cabinets)

## Related

- `getCreateListingHref` → `/listings/new` for BUYER
- `docs/CARGO_*` for cargo flows
