# Seller leads UX — Phase 62

## 1. How sellers see requests

`/seller/leads` shows ownership-scoped lead cards for the current seller profile.

Each card includes:

- listing title + thumbnail (or unavailable fallback)
- buyer name and existing safe contacts (phone/email already exposed to seller)
- message (plain text, expandable)
- quantity when vertical config shows it
- created date, city, price when available
- status badge (`NEW` / `VIEWED` / `CLOSED`)
- actions: open listing, copy phone, WhatsApp (only if phone exists), mark as done

## 2. Ownership / security

- Guest / buyer redirected away from `/seller/leads`
- Leads loaded only by `seller_profile_id` of the authenticated user
- Status updates via `PATCH /api/seller/leads/[id]` require auth + own seller profile ownership
- Seller id is never taken from client input

## 3. Actual statuses

Existing Prisma enum (unchanged):

- `NEW` → “Новая”
- `VIEWED` → “В обработке”
- `CLOSED` → “Закрыта”

Filters in URL: `?status=new|viewed|closed` (or all).

“Отметить как обработанную” sets `CLOSED` and fills `viewed_at` when missing.
Opening a listing from a `NEW` lead soft-transitions it to `VIEWED`.

There is no separate `IN_PROGRESS` / `DONE` enum value — UI maps VIEWED≈in progress and CLOSED≈done/closed.

## 4. Archived / deleted listings

- Non-published listings still appear with an unavailable badge; open-listing CTA is hidden
- Hard-deleted listings cascade-delete leads (existing schema) — documented known behavior

## 5. Seller dashboard

- Recent leads block shows last 3 requests
- New leads count is highlighted
- Link to all requests (`/seller/leads`)
- Existing stats cards for total/new leads remain

## 6. Notifications

Existing `NEW_LEAD` notifications already link to `/seller/leads`. Phase 62 did not change notification architecture.

## 7. Unchanged

- Prisma schema / migrations
- Lead model fields
- Auth architecture
- Upload architecture

## 8. Known gaps

- Richer CRM pipeline later
- Hard unique buyer+listing constraints later
- WhatsApp only when phone already present (no new contact disclosure)
- Deeper buyer profile routes if/when product adds them
