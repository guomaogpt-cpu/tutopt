# Phase 74 — Cargo request site notifications & subscriptions

## 1. Goal

Cargo companies can opt in to site notifications for new `CargoRequest` items and notice new requests faster on the seller board.

No Telegram / WhatsApp / email in this phase.

## 2. CargoRequestSubscription

Table `cargo_request_subscriptions`:

| Field | Notes |
| --- | --- |
| `seller_profile_id` | unique — one row per seller profile |
| `user_id` | recipient for notifications |
| `is_active` | toggle on/off without deleting the row |

## 3. Who gets `NEW_CARGO_REQUEST` notifications

1. All non-blocked admins  
2. Users with an **active** cargo request subscription  

Previous Phase 72 behavior (auto-notify every seller with a published CARGO listing) was replaced by explicit subscription so unsubscribe is meaningful.

## 4. Seller UX

On `/seller/cargo-requests`:

- Subscription card (subscribe / unsubscribe)
- Status chips including **Новые**
- `NEW` request cards highlighted with rose border

API: `POST /api/seller/cargo-subscriptions` with `{ "active": true | false }`  
`seller_profile_id` / `user_id` come from session only.

## 5. Unchanged

- Cargo request / response models and flows  
- Listing uploads / auth  
- Market / services / wholesale  

## 6. Not implemented

- Telegram broadcast  
- WhatsApp / WhatsApp Business API  
- Email broadcast  
- Route-based subscriptions (from→to filters)  
- Guest magic-link client dashboard  

## 7. Future

- External channels on top of the same subscription flag  
- Optional route/direction filters  
- Auto-suggest subscribe when publishing a CARGO listing  
