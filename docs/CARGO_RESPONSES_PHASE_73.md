# Phase 73 — Cargo request responses

## 1. How cargo works now

1. Client submits a shipping request on `/cargo`
2. Request appears on the seller cargo board `/seller/cargo-requests`
3. Cargo companies (sellers with a seller profile) can respond with price, timing and terms
4. Admins manage all requests/responses on `/admin/cargo-requests`
5. Logged-in request owners see responses on `/buyer/cargo-requests`
6. Site notifications for new requests and new responses (no Telegram/WhatsApp/email)

## 2. CargoRequest

Client shipping request (not a listing). Fields from Phase 72 plus status workflow (`NEW` → `IN_REVIEW` → `CONTACTED` → `CLOSED`).

## 3. CargoResponse

Seller response to a `CargoRequest`:

- `price`, `currency`, `estimated_time` (optional)
- `comment` (required)
- `contact_name`, `contact_phone` (optional)
- `status`: `NEW` | `ACCEPTED` | `REJECTED` | `WITHDRAWN`
- Unique per `(cargo_request_id, seller_profile_id)`
- `seller_profile_id` always from session, never from client input

## 4. Client flow

- Guest or authenticated user fills the form on `/cargo`
- Optional photo via cargo upload endpoint
- Authenticated user is linked via `user_id`
- Success state shown in the form
- Owner can open `/buyer/cargo-requests` to see responses

## 5. Cargo company flow

- Open `/seller/cargo-requests`
- Browse request cards (route, item, photo, sizes, comment, date, status)
- Client phone is **not** shown to sellers in this phase (admin only)
- Click **Respond** → modal → submit `POST /api/cargo/requests/[id]/responses`
- Duplicate responses blocked (unique + soft check)

## 6. Public `/cargo`

Visible:

- Hero + request form
- How it works
- Cargo company listing cards (`vertical=CARGO`)
- Anonymized latest requests (item, route, weight/dimensions/quantity, date, status)

Hidden publicly:

- phone, full name, company, comment

## 7. Admin

`/admin/cargo-requests`:

- all requests + client contacts
- response count + expand responses
- change request status
- nav link in admin panel

## 8. Seller/cargo company

- board of requests
- own responses only (other sellers’ responses not listed)
- respond via system modal
- subscription prefs on `/seller/cargo-settings` (service types, directions, in-app notify)
- optional board filter: show only matching requests

## 9. Hidden publicly

Phone, name, company, free-text comment (may contain contacts).

## 10. Not implemented

- WhatsApp broadcast
- Telegram broadcast
- email broadcast
- bidding/auction
- payment
- delivery tracking
- automatic reveal of client phone to sellers after response
- paid cargo lead packages
- exact geo route matching

See also `docs/CARGO_SUBSCRIPTIONS_PHASE_75.md` and `docs/CARGO_NOTIFICATIONS_PHASE_74.md`.

## 11. Future

- Telegram/email/WhatsApp delivery (Phase 76)
- richer route filters
- guest client dashboard via magic link/code
- accepting a best response / status ACCEPTED UX
- Unified account view of cargo requests/responses — **Phase 83** `/account/requests` — see `docs/ACCOUNT_REQUESTS_PHASE_83.md`
