# Mobile listing detail — Phase 66

## 1. Mobile detail changes

The listing detail page (`/listings/[id]`) keeps one shared implementation with responsive
ordering instead of a separate mobile page.

On phones:

1. Gallery
2. Price + title + badge/city
3. Compact “Overview” parameters
4. Sticky CTA (request + favorite, optional call)
5. Seller card
6. Description
7. Characteristics (collapsible when long)
8. Lead/request form
9. Other seller listings / similar listings when present

Desktop keeps the existing title header, two-column layout, and sticky sidebar
contact/seller cards.

## 2. Mobile CTA

`ListingMobileStickyCta` is fixed above the Phase 64 bottom navigation:

- `bottom: calc(4rem + env(safe-area-inset-bottom))`
- hidden from `md:` and up
- primary action scrolls to the lead form for signed-in buyers
- guests are sent to login with the current return path
- favorite remains a separate touch target
- phone button appears only when contacts are already allowed for the signed-in user
- owners do not see the sticky CTA

Extra page padding keeps content clear of both sticky CTA and bottom nav.

## 3. Bottom navigation conflict

Sticky CTA sits above the bottom nav rather than replacing it. Layout bottom padding
from Phase 64 remains; the detail page adds its own mobile padding for the CTA bar.

## 4. Unchanged

- Prisma schema / migrations
- Upload architecture
- Lead/request business logic and API
- Auth architecture
- Public listing visibility rules
- Desktop sidebar contact card behavior

## 5. Known gaps

- later: full-screen image viewer
- later: swipe gallery
- later: native share button
- later: stronger seller trust profile
