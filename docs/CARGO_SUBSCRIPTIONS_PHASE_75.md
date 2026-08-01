# Phase 75 — Cargo request subscriptions

## 1. What is CargoSubscription

`CargoSubscription` is a per-seller preference row (table `cargo_request_subscriptions`) that controls which shipping requests a cargo company wants to receive and how it is notified in-app.

Linked to:

- `seller_profile_id` (unique)
- `user_id` (session owner; never taken from client as “target user”)

Core fields:

- `enabled` (DB column `is_active`)
- `service_types` / `directions` / `from_locations` / `to_locations` (JSON arrays)
- `notify_in_app` (active)
- `notify_telegram` + `telegram_chat_id` / `telegram_username` / `telegram_connected_at` (Phase 76)
- `notify_email` / `notify_whatsapp` (future flags only)

Settings UI: `/seller/cargo-settings`

Telegram channel details: `docs/CARGO_TELEGRAM_NOTIFICATIONS_PHASE_76.md`.

## 2. How a cargo company chooses service types

On `/seller/cargo-settings`, sellers pick zero or more service type IDs (checkboxes), e.g. delivery from China, road freight, warehousing.

Stable IDs live in `src/features/cargo/lib/cargo-subscription-options.ts`. Empty list means “any service type” (soft MVP).

## 3. How directions are chosen

Same page: checkboxes for base routes (China → Kyrgyzstan, Guangzhou → Bishkek, …). Empty list means “any direction”.

Optional free-text from/to location lists (comma-separated) for soft substring matching against request locations.

## 4. How request matching works (MVP)

Matching is intentionally soft:

1. If `enabled` is false or `notifyInApp` is false → do not notify.
2. If preference arrays are empty → do not filter on that axis.
3. If the request is missing `serviceType` / `direction` → do not hard-block on that axis.
4. Location filters use case-insensitive substring includes.

Board filter “Show only matching requests” uses the same type/direction/location rules (without requiring notify flags).

## 5. How notifications are created

On successful `POST /api/cargo/requests`:

1. Notify all non-blocked admins → `/admin/cargo-requests`
2. Notify matched cargo sellers → `/seller/cargo-requests`
3. Deduplicate by `userId` (admins win if also sellers)
4. Exclude the actor (request author)

Matching for sellers uses `findCargoNotificationRecipients`.

## 6. Fallback when subscription is missing

If a seller has a published listing `vertical=CARGO` and **no** `CargoSubscription` row, they still receive in-app notifications (Phase 74 fallback).

If a subscription exists, prefs apply (including `enabled` / `notifyInApp`).

## 7. Not implemented in this phase

- WhatsApp / WhatsApp Business API
- Email delivery
- Exact city/route graph matching / geolocation
- Paid subscriptions
- Hard blocking when request fields are incomplete
- Telegram webhook / automatic chatId (manual Chat ID in Phase 76)

## 8. Phase 76+

Telegram in-app delivery for matching cargo requests: `docs/CARGO_TELEGRAM_NOTIFICATIONS_PHASE_76.md`.

Later:

- Email notifications
- WhatsApp Business API
- Richer route filters and exact from/to city catalogs

## Related

- Form optional fields: `CargoRequest.service_type`, `CargoRequest.direction`
- Seller board: `/seller/cargo-requests?matching=1`
- Dashboard quick link to `/seller/cargo-settings`
- Telegram: `docs/CARGO_TELEGRAM_NOTIFICATIONS_PHASE_76.md`
