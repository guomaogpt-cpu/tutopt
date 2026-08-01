# Phase 84 — Cargo landing redesign

## 1. Why the form moved to a modal

The old `/cargo` page led with a large shipping form that pushed companies and directions below the fold. The form is now opened from CTAs (“Создать заявку”) in a bottom drawer so the landing can showcase search, directions, companies, and active requests first. Submit logic (`POST /api/cargo/requests`, uploads, guest/`user_id`) is unchanged.

## 2. New `/cargo` structure

1. Compact hero (CTA: create request / find company)
2. Compact search (type selector + suggest/input)
3. Directions & services grid
4. Cargo company cards (`vertical=CARGO`)
5. Active shipping requests (auth-aware)
6. Dual CTA (client vs cargo company)

## 3. Search

Selector: companies / directions / services / requests (requests only when authenticated).  
Companies use existing `SearchWithSuggest` (vertical from path). Other types filter `/listings?vertical=CARGO&q=…` or open `/seller/cargo-requests`.

## 4. Categories / directions

Static compact tiles under the hero (`CARGO_LANDING_DIRECTION_TILES`) link to cargo listings with a query. DB categories remain available on catalog/SEO routes.

## 5. Cargo companies

Published CARGO listings via `getVerticalPageData`. Cards show photo, title, category, city, verified badge, Open + Create request. Empty state → `/listings/new?vertical=cargo`. Verified filter chips stay orange/emerald.

## 6. Active requests

`getPublicRecentCargoRequests` (no phone/name/comment). Guests see anonymized preview + login CTA. Authenticated users see full public fields + status; cargo sellers get Respond → `/seller/cargo-requests`.

## 7. Hidden from guest/public

Phone, name, company, free-text comment, and other private fields stay off the public select (same as Phase 73).

## 8. Unchanged

- CargoRequest / CargoResponse models & APIs
- Telegram notifications
- Cargo subscriptions / settings
- Create company listing flow
- Auth / uploads

## 9. Future

- Richer autocomplete (directions/services)
- Route map
- Cargo company ratings
- Favorite cargo companies
- Public rate cards
