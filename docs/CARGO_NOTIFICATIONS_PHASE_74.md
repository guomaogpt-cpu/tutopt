# Phase 74 — Cargo in-app notifications

## 1. When notifications are created

| Event | Type | When |
| --- | --- | --- |
| New `CargoRequest` | `NEW_CARGO_REQUEST` | After successful `POST /api/cargo/requests` |
| New `CargoResponse` | `NEW_CARGO_RESPONSE` | After successful `POST /api/cargo/requests/[id]/responses` |

Uses the existing `Notification` model and notification bell / `/notifications` page.

## 2. Who gets `NEW_CARGO_REQUEST`

1. All non-blocked **admin** users → link `/admin/cargo-requests`
2. Cargo sellers matched by `CargoSubscription` prefs (or fallback) → `/seller/cargo-requests`

### Matching (Phase 75 MVP)

- Sellers with published `vertical=CARGO` and **no** subscription → notified (fallback)
- Sellers with subscription → require `enabled` + `notifyInApp`, then soft-match `serviceTypes` / `directions` / optional from-to location lists
- Missing request `serviceType`/`direction` does not hard-block
- One notification per `userId`

Guests and buyers without cargo listings are not notified.

See `docs/CARGO_SUBSCRIPTIONS_PHASE_75.md`.

## 3. Who gets `NEW_CARGO_RESPONSE`

1. All non-blocked admins → `/admin/cargo-requests`
2. Request owner (`CargoRequest.user_id`) if present → `/buyer/cargo-requests`

Guest-created requests (no `user_id`) do not notify an owner.

## 4. How cargo company is determined (MVP)

A cargo company is a user with a seller profile that has ≥1 **published** listing with `vertical=CARGO`.

There is no separate “cargo company” role in this phase.

## 5. Deduplication

Recipients are collected in a `Map<userId, link>`:

- one notification per `userId` per event
- admin who is also a cargo seller gets **one** notification (admin link for new requests)
- request owner who is also admin gets **one** response notification (owner link wins)
- multiple CARGO listings for the same seller still yield one notification

No DB unique constraint added for this.

## 6. Links

| Audience | New request | New response |
| --- | --- | --- |
| Admin | `/admin/cargo-requests` | `/admin/cargo-requests` |
| Cargo seller | `/seller/cargo-requests` | — |
| Request owner | — | `/buyer/cargo-requests` |

Stored notification titles use RU fallback text (notification table is plain text). UI chrome uses i18n keys under `cargo.notifications.*` / `cargo.seller.*`.

## 7. Seller board UX

`/seller/cargo-requests`:

- Title block: new shipping requests
- Filters: All / New / Responded
- Toggle/filter: show only matching requests (`?matching=1`)
- Link to `/seller/cargo-settings` for subscription prefs
- Badge «Новая» / «Вы откликнулись»
- Newest first

## 8. Admin

- `/admin` overview: count of `CargoRequest` with status `NEW` + quick link
- `/admin/cargo-requests`: requests newest first, response counts, status, expand responses

## 9. Not implemented

- WhatsApp / WhatsApp Business API notifications
- Email notifications
- Exact geolocation / paid subscriptions

Preference matrix and settings UI: **Phase 75** (`CargoSubscription` / `/seller/cargo-settings`).

Telegram channel: **Phase 76** — `docs/CARGO_TELEGRAM_NOTIFICATIONS_PHASE_76.md`.

## 10. Future Phase 77

- Telegram bot webhook for automatic chatId linking
- Email notifications
- WhatsApp Business API later
- Notification delivery logs

