# Phase 82 — Account listings management

## 1. Why `/account/listings`

Phase 81 added a unified `/account` dashboard. Users still managed publications on legacy `/seller/listings`. Phase 82 adds a first-class **Мои объявления** page under the account shell so marketplace, services, wholesale, and cargo company cards live in one authenticated place.

## 2. What publications are shown

Only listings owned by the current user’s `SellerProfile` (`seller_profile_id`):

- MARKET — ordinary listings
- SERVICES — services
- OPT — wholesale offers
- CARGO — cargo company cards

Guests are sent to `/login?returnUrl=/account/listings`. Users without a seller profile see an empty state (no other users’ listings).

## 3. Filters

**Status** (real `ListingStatus` / expiration filters only):

- All
- Active (`PUBLISHED`, not expired)
- Pending (`PENDING_MODERATION`)
- Rejected
- Archived
- Expired (`PUBLISHED` with `expires_at` in the past)
- Drafts (`DRAFT`) — shown because the status exists in the schema

**Type** (vertical): Market / Services / Opt / Cargo.

Chips are horizontal on mobile; no table layout.

## 4. Actions

Per card (existing owner-scoped APIs):

- Open
- Edit
- Archive
- Restore (archived)
- Renew (published)

**No hard delete** — the product has no safe delete path; archive only.

Cards also show photo, title, type, status, price (if any), city, dates, leads count (if any), and posted-as (personal vs company).

## 5. Relation to `/seller/listings`

- Legacy `/seller/listings` remains working (no hard redirect).
- Soft notice + link to `/account/listings`.
- Primary UI links (account dashboard, header/menu, create-listing cancel) point to `/account/listings`.

## 6. Unchanged

- Prisma schema (no migration)
- Moderation logic
- Uploads
- Auth / sessions / OTP / Google
- Cargo request/response flows
- Listing lifecycle API ownership checks

## 7. Future

- Bulk actions
- Listing analytics
- Promoted listings
- Richer drafts UX
- Auto-renewal
