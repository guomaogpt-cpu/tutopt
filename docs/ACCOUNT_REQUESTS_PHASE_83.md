# Phase 83 — Account requests dashboard

## 1. Why `/account/requests`

Phase 81 unified the account home; Phase 82 moved listing management under `/account/listings`. Requests were still split across buyer dashboard, `/seller/leads`, and cargo pages. Phase 83 adds **Мои заявки** so sent leads, inbound listing leads, cargo requests, and cargo responses live in one authenticated place.

## 2. Request types shown

Scoped to the current session user only:

1. **Sent leads** — `Lead` where `buyer_id = user.id`
2. **Received leads** — `Lead` where `seller_profile_id` belongs to the user’s `SellerProfile`
3. **Cargo requests** — `CargoRequest` where `user_id = user.id`
4. **Cargo responses** — responses on those cargo requests, plus the user’s own responses as a cargo company (`CargoResponse.seller_profile_id`)

## 3. Sent vs received listing leads

| | Sent | Received |
| --- | --- | --- |
| Meaning | Requests the user sent to sellers | Requests on the user’s listings |
| Filter | `buyer_id` | `seller_profile_id` |
| Contact | Seller company name only (public) | Buyer name/phone per existing seller leads policy |

`Lead.buyer_id` is required — no schema gap for linking sent requests.

## 4. Cargo requests

Cards show item, route, weight/dimensions/quantity when present, status, date, response count, and a link to view responses (`/account/cargo-requests`).

Guest `CargoRequest` rows with `user_id = null` do **not** appear here (known gap).

## 5. Cargo responses

- Incoming: responses on the user’s cargo requests (company, price, ETA, comment, status)
- Own (as cargo company): listed under “Мои отклики…” with a soft link to `/seller/cargo-requests`

## 6. Unchanged

- Lead model / Prisma schema (no migration)
- CargoRequest / CargoResponse create APIs
- Telegram connect / webhook
- Notifications delivery
- Legacy routes: `/seller/leads`, `/seller/cargo-requests`, `/buyer/dashboard`, `/account/cargo-requests`

## 7. Known gaps

- Guest cargo request tracking (no `user_id`)
- Full CRM pipeline for leads
- Accept/reject UX for cargo responses
- Message thread between client and seller
