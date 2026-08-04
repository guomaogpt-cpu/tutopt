# Phase 79 — Company profile flow

## 1. Why a company profile

After Phase 78, every account can browse, favorite, request, and post. Business users still need a distinct public identity: store, supplier, service firm, or cargo company — without forcing a buyer/seller choice at signup.

Company profile is a **layer on top of the personal account**, not a second login.

## 2. Account vs company

| Layer | Meaning |
| --- | --- |
| Account | Registered user (auth, favorites, requests, personal posts) |
| Company profile | Public business card (`SellerProfile` + `company_type`) |

Technical base: existing `SellerProfile` (no separate `CompanyProfile` table). Soft-created profiles (phone/name only) are **not** company profiles until `company_type` is set.

## 3. How to create a company profile

1. Open `/account/company` (login required; phone must be confirmed)
2. Fill name, type, city, phone, description, optional website/logo
3. Save → `SellerProfile.company_type` is set; public URL `/companies/[id|slug]`

## 4. Post as personal vs company

On `/listings/new`:

- **Личный аккаунт** → `Listing.posted_as_company = false` (cards show user name)
- **Компания** → only if profile is configured; server checks ownership via session user → their `SellerProfile`

Client cannot pass another user’s company id. Listing always uses `seller_profile_id` from the authenticated user.

## 5. Display on listings

When `posted_as_company` and `company_type` are set:

- Card: company badge + company name
- Detail: company badge, link to `/companies/...`

Otherwise: personal name fallback.

## 6. Cargo company vs CargoRequest

Unchanged split:

- Cargo **request** → `/cargo`
- Cargo **company listing** → `/listings/new?vertical=cargo`
- Company profile (type CARGO) → extras: cargo requests, cargo settings, Telegram (still user-bound)

## 7. Not implemented

- Team members / staff roles
- Company legal documents UI
- Paid company plans
- Subscriptions per company (still per user / seller profile)

Company verification: see `docs/COMPANY_VERIFICATION_PHASE_80.md` (Phase 80).

## 8. Future

- Dedicated `CompanyProfile` if multi-company per user is needed
- Company analytics
- Cargo subscription scoped to company
- Document-based verification / trust score
- Unified cabinet: see Phase 81 `/account` (`docs/UNIFIED_ACCOUNT_DASHBOARD_PHASE_81.md`)

## Schema

Migration `20260801140000_company_profile_fields`:

- `CompanyType` enum
- `seller_profiles.company_type`
- `listings.posted_as_company`

## Phase 101 company profiles MVP

See `docs/COMPANY_PROFILES_MVP_PHASE_101.md`.

Polished account/public company UX, company-only listings on `/companies/[id]`, ListingCard company link, public verified-only badge policy, and safer empty/not-found states. Ready for company profile testing.
