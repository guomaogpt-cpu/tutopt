# Buyer Flow Stabilization — Phase 43

Дата: 2026-07-22  
UI freeze: без косметики. Только стабилизация buyer MVP.

## 1. Buyer route map

| Route | Status | Notes |
|-------|--------|-------|
| `/listings` | OK | Catalog + filters |
| `/listings/[id]` | OK | Public via `canViewListing` |
| `/buyer/dashboard` | OK | Auth required (any role) |
| `/favorites` | OK | Auth; list = public+notExpired |
| `/compare` | **MISSING** | No page, no UI links — не stub |
| `/notifications` | OK | Auth + ownership |
| `/login` | OK | |
| `/register` | OK | |
| `/catalog` | Redirect → `/listings` | |

## 2. Catalog / search behavior

- Params: `q`, vertical, category, city, price, sort, page.
- Empty params omitted from URL (no `undefined=`).
- Filter change resets `page` to 1.
- Public where: `PUBLISHED` + not expired.
- Header / home search → `/listings` or `/listings?q=…` (URLSearchParams encoding).

## 3. Listing detail visibility

- Guest/buyer: only `PUBLISHED` + not expired.
- Owner / admin / moderator: non-public via `canViewListing`.
- Metadata (Phase 41): no OG leak for hidden listings.
- **Phase 43:** contact phone/WhatsApp/Telegram **not** passed to client for guests.

## 4. Lead submit behavior

| Actor | Behavior |
|-------|----------|
| Guest | Login CTA / redirect `?next=` |
| Authenticated | Can submit if not owner / not restricted |
| Owner | Blocked client + API |
| Non-PUBLISHED / expired | API Forbidden |

Duplicate / rate-limit helpers in place.

## 5. Favorites behavior

- Guest → login.
- Toggle via API; list filtered with `buildPublicListingWhere()`.
- Hidden/expired favorites disappear from list (no “unavailable” row yet).

## 6. Compare behavior

- Not implemented. Document / cut in roadmap.
- Buyer dashboard has **no** compare links.

## 7. Recently viewed behavior

- Browser localStorage (`local-recently-viewed.ts`): typed parse, try/catch.
- Public card fields only (no seller PII).
- Tracker only on PUBLISHED detail.
- Dashboard panel is localStorage-based.
- DB `UserListingView` write exists; list helper unused by UI.

## 8. Saved searches behavior

- localStorage (`local-saved-searches.ts`): safe parse.
- `page` stripped; URL normalized; duplicates skipped.
- Links → `/listings…`.

## 9. Notifications behavior

- Bell + `/notifications`.
- Unread count; mark one / all read.
- Ownership enforced on APIs.

## 10. Known gaps

1. `/compare` absent — no stub in Phase 43.
2. Favorites: no “unavailable” row for archived favorites.
3. Recently viewed: dual localStorage vs DB docs mismatch.
4. Buyer dashboard open to all auth roles.
5. Dead unused `SearchBar` still mentions `/catalog`/`/search` if rewired.

## 11. Smoke later (manual)

- [ ] Guest catalog + filters URL  
- [ ] Guest listing: contacts hidden (View Source / network — no phone in HTML for guests)  
- [ ] Login → contacts visible  
- [ ] Lead guest → login; own listing blocked; expired blocked  
- [ ] Favorites add/remove  
- [ ] Saved search save/open/dedupe  
- [ ] Recently viewed panel  
- [ ] Notifications unread / mark read  
- [ ] Search empty → `/listings`; Cyrillic `q`  

## Phase 43 fixes

1. Listing detail: guest contact props → `null`.  
2. Seller storefront: `sanitizeSellerProfileForGuest` + null contact props for guests.  
3. Docs: this file + MVP audit follow-up.
