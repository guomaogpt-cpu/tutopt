# Phase 81 — Unified account dashboard

## 1. Why `/account`

Buyer/seller cabinets forced a marketplace split that no longer matches the product. Users need one place for listings, requests, company profile, cargo, favorites, and notifications.

## 2. Blocks on `/account`

1. Quick actions
2. Favorites + unread notifications
3. My listings (status counts + recent)
4. My requests (leads + cargo requests summary)
5. Company profile summary / CTA
6. Cargo summary / CTA

Also: `/account/cargo-requests` for the user’s own cargo requests and responses.

## 3. Profile in mobile nav / header

- Mobile **Профиль** → `/account` (guest → `/login?next=/account`)
- Header user menu **Личный кабинет** → `/account`
- Settings drawer dashboard → `/account`
- Footer cabinet links → `/account`

Staff (ADMIN/MODERATOR) still go to `/admin`.

## 4. Old buyer/seller dashboards

Left working (no hard redirects in this phase):

- `/buyer/dashboard`
- `/seller/dashboard`
- `/seller/listings`, `/seller/leads`, `/seller/cargo-*`

Primary UX entry is `/account`.

## 5. Company + cargo on the dashboard

- Company: name, type, verification badge, edit/public links, or create CTA
- Cargo: Telegram + notification status when the user has cargo activity; otherwise “add cargo company” CTA

## 6. Unchanged

- Auth / OTP / Google
- Prisma schema (no migration)
- Listing create/moderation
- CargoRequest / CargoResponse / Telegram webhook logic
- Company verification APIs

## 7. Future

- `/account/listings` management page — **done in Phase 82** — see `docs/ACCOUNT_LISTINGS_PHASE_82.md`
- `/account/requests` unified requests page — **done in Phase 83** — see `docs/ACCOUNT_REQUESTS_PHASE_83.md`
- Account security settings
- Soft redirects from buyer/seller dashboards to `/account`
