# Mobile listing cards — Phase 65

## 1. Card changes

The shared `ListingCard` remains the single buyer-facing card for the home page,
catalog, vertical sections, similar listings, and favorites.

- the full card opens the listing;
- the favorite control remains a separate touch target and does not open the card;
- titles are clamped to two lines;
- mobile spacing and typography are denser;
- seller details are hidden on mobile and remain visible on larger screens;
- vertical badges are compact and translated;
- dark-mode borders, backgrounds, placeholders, and active states are preserved.

## 2. Mobile grid

Buyer-facing grids use two columns on normal phone widths and fall back to one
column below 340 px. Catalog grids expand to three columns on tablets and retain
the existing four-to-six-column desktop layouts.

The `/market`, `/opt`, `/services`, and `/cargo` latest-listing grids now use the
same mobile density as `/`, `/listings`, and `/favorites`.

## 3. Missing or broken images

Images keep a `4:3` container and use `object-cover`. URLs continue to pass
through `normalizeListingImageUrl`.

When no image exists, or when an image fails to load, the card switches to a
vertical-aware placeholder. The placeholder includes translated “No image” text
and dark-mode colors.

## 4. Price, city, and badge

- valid prices remain prominent and include currency;
- units remain a smaller suffix where applicable;
- missing or non-positive prices display the translated
  `listingCard.priceOnRequest`;
- city and publication date remain compact metadata;
- MARKET, OPT, SERVICES, and CARGO badges use translated `vertical.*` labels.

## 5. `/listings` on mobile

- search input and submit icon stay on one compact row;
- the existing mobile filter drawer is retained;
- sort and filter controls use larger touch targets;
- the filter button exposes translated open/close labels;
- active filters remain compact removable chips;
- result count uses the `listings.found` translation;
- numbered pagination remains server-driven and now has larger mobile controls.

The compact vertical heroes use less minimum height on phones while retaining
their existing 300 px desktop layout and category drawers.

## 6. Unchanged

- Prisma schema and migrations;
- upload storage and URL normalization;
- favorites API and optimistic update logic;
- text search, photo search, filtering, sorting, and backend pagination;
- desktop card grids and header/navigation behavior.

## 7. Known gaps

- advanced mobile filters later;
- infinite scroll later;
- personalized recommendations later.
