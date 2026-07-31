# Phase 74 — Cargo in-app notifications

## 1. When notifications are created

| Event | Type | When |
| --- | --- | --- |
| New `CargoRequest` | `NEW_CARGO_REQUEST` | After successful `POST /api/cargo/requests` |
| New `CargoResponse` | `NEW_CARGO_RESPONSE` | After successful `POST /api/cargo/requests/[id]/responses` |

Uses the existing `Notification` model and notification bell / `/notifications` page.

## 2. Who gets `NEW_CARGO_REQUEST`

1. All non-blocked **admin** users → link `/admin/cargo-requests`
2. Sellers/admins with at least one **published** listing `vertical=CARGO` → link `/seller/cargo-requests`
3. Optionally: active `CargoRequestSubscription` recipients (extra opt-in) if not already covered

Guests and buyers without cargo listings are not notified.

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
- Badge «Новая» / «Вы откликнулись»
- Newest first
- Optional in-app subscription toggle (extra; not required to receive listing-based notifications)

## 8. Admin

- `/admin` overview: count of `CargoRequest` with status `NEW` + quick link
- `/admin/cargo-requests`: requests newest first, response counts, status, expand responses

## 9. Not implemented

- Telegram notifications
- WhatsApp / WhatsApp Business API notifications
- Email notifications
- Full preference matrix (`notifyTelegram`, direction filters, categories)
- Real route-based subscription filters

Optional table `cargo_request_subscriptions` already exists as a simple on/off opt-in; it is **not** the full future `CargoSubscription` model.

## 10. Future Phase 75

Suggested `CargoSubscription` fields:

- `userId`
- `enabled`
- `directions` / `fromLocation` / `toLocation`
- `categories`
- `notifyInApp` / `notifyTelegram` / `notifyEmail` / `notifyWhatsApp`

Plus Telegram/email channel delivery and user preferences UI.
