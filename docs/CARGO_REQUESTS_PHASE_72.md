# Phase 72 — Cargo requests MVP

## 1. What is CargoRequest

`CargoRequest` is a client shipping request — not a listing.

Customers describe cargo, route and contacts on `/cargo`. Cargo companies and admins review requests in the seller cabinet. Listing verticals (market, services, wholesale, cargo company ads) stay separate.

## 2. Fields

| Field | Required | Notes |
| --- | --- | --- |
| `name` | yes | Contact name |
| `phone` | yes | Contact phone |
| `company` | no | Company name |
| `from_location` | yes | Origin |
| `to_location` | yes | Destination |
| `item_name` | yes | What to ship |
| `description` | no | Extra item text |
| `item_photo_url` | no | Uploaded image URL |
| `quantity` | no | Number of pieces |
| `weight` | no | Weight as text |
| `dimensions` | no | Dimensions as text |
| `urgency` | no | Reserved for later UI |
| `comment` | no | Extra conditions |
| `status` | auto | `NEW` / `IN_REVIEW` / `CONTACTED` / `CLOSED` |
| `user_id` | optional | Bound from session when logged in |

Prisma model: `CargoRequest` → table `cargo_requests`.

## 3. How a user submits a request

1. Open `/cargo`
2. Fill the request form (contacts, route, item, optional photo/comment)
3. Optional photo uploads via `POST /api/uploads/cargo-request-images` (guest-allowed, IP rate-limited; separate from listing uploads)
4. Submit → `POST /api/cargo/requests`
5. Server validates, trims, rate-limits, stores row, attaches `user_id` from session if present
6. Success state is shown in the form

## 4. Who sees requests

| Role | Access |
| --- | --- |
| Guest / public `/cargo` | Anonymized recent cards only (no phone/name) |
| Seller | `/seller/cargo-requests` with full contact |
| Admin | Same page + all requests; site notification |

Notifications (`NEW_CARGO_REQUEST`) go to admins and sellers who have at least one published CARGO listing.

Cargo notifications added in Phase 74. See `docs/CARGO_NOTIFICATIONS_PHASE_74.md`.

## 5. What is public

Public cards show:

- item name
- from → to
- weight / dimensions / quantity (if set)
- date

Hidden publicly: phone, name, company, comment, photo URL list contact block.

## 6. Cargo company cards

Below the form, `/cargo` shows published listings with `vertical=CARGO` via existing `ListingCard`.

Empty state uses `cargo.noCompaniesTitle` / `cargo.noCompaniesDescription`.

## 7. Not implemented in this phase

- Telegram broadcast
- WhatsApp broadcast
- Email broadcast
- Cargo company responses / replies
- Bidding / quotes
- Status change UI for sellers (status field exists, default `NEW`)
- Dedicated “cargo company” role (sellers with CARGO listings are used for notifications)

## 8. Future Phase 73

- Cargo company responses on a request
- Richer notifications for cargo operators
- Telegram bot / email integration
- Optional status workflow (IN_REVIEW → CONTACTED → CLOSED) in the seller UI

## 9. Unchanged

- Market / Opt / Services flows
- Listing create / lead APIs
- Listing image upload auth (`/api/uploads/listing-images` remains seller/admin only)
- Existing Lead model
