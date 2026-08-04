# Phase 80 — Company verification trust badges

## 1. Why verification

Users need a simple trust signal for businesses on the marketplace. Verification is a **basic trust layer**, not legal KYC.

## 2. Statuses

Stored on `SellerProfile.verification_status`:

| Status | Meaning |
| --- | --- |
| `UNVERIFIED` | Default / not submitted |
| `PENDING` | Owner submitted for review |
| `VERIFIED` | Admin approved (`is_verified=true`) |
| `REJECTED` | Admin rejected (owner only; no public “rejected” badge) |

Also: `verified_at`, `verified_by_id`, `verification_note` (admin-only).

Legacy `is_verified` is kept in sync with `VERIFIED`.

## 3. Owner flow

1. Create/edit company at `/account/company`
2. Click **Отправить компанию на проверку** → `PENDING`
3. Wait for admin decision

## 4. Admin flow

`/admin/companies` (ADMIN only):

- list configured companies
- verify / reject / reset
- optional admin note (not public)

## 5. Where badges show

- Public company page + trust block
- Listing cards when posted as company + VERIFIED
- Listing detail company/seller block
- `/cargo` company cards (cargo-specific verified label)
- Owner cabinet status badges

## 6. What “verified company” means

Admin reviewed the company profile fields (name, type, contacts, description). It does **not** mean passport KYC, license check, or paid badge.

## 7. Not implemented

- Document upload
- Legal KYC
- Paid verification
- Staff roles
- Public verification history
- Verified filter on `/listings` / `/companies` index (gap; `/cargo?verified=1` works)

## 8. Future

- Document checklist
- Trust score
- Reviews / complaints history
- Auto-priority for verified cargo companies

## Migration

`20260801150000_company_verification_status`

## Phase 101 company profiles MVP

See `docs/COMPANY_PROFILES_MVP_PHASE_101.md`.

Public surfaces now highlight only VERIFIED companies. PENDING/REJECTED remain owner/admin-visible. Trust block on the public company page no longer exposes pending/rejected labels to guests.
