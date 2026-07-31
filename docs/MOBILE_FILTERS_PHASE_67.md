# Mobile catalog filters — Phase 67

## 1. Mobile filter changes

The shared catalog toolbar and `CatalogFiltersPanel` were improved for phones:

- compact search field with short placeholder and camera button (`type="button"`)
- Filters button opens a bottom drawer on mobile
- active filters appear as removable chips with horizontal scroll
- sort labels are translated
- empty filtered state uses clear reset / all-listings actions

Desktop keeps the dropdown filter panel and toolbar sort control.

## 2. Filter drawer

On viewports ≤767px the drawer includes:

- section / vertical
- sort
- category
- city
- brand when relevant to the selected vertical
- price from / to with non-negative client sanitizing and range validation
- with photos only
- sticky footer actions: Reset + Show results

The drawer sits above the Phase 64 bottom navigation via the existing modal overlay (`z-50`).

## 3. Query params

URL remains the source of truth through existing helpers:

- `q`
- `vertical`
- `category`
- `city`
- `brand`
- `priceFrom` / `priceTo` (aliases `priceMin` / `priceMax` still accepted when parsing)
- `withPhoto`
- `sort`
- `page`
- `photoSearch`

Applying filters updates the URL, reloads preserve state, and browser back/forward continue to work.

## 4. Active chips

Chips are built from the current query and can clear:

- search query
- section
- category
- city
- brand
- price range
- with photos
- non-default sort

A Clear all control resets to `/listings`.

## 5. Unchanged

- Prisma schema / migrations
- search backend / catalog where-clause logic
- photo search backend
- uploads
- desktop filter architecture beyond shared i18n and sort labels

## 6. Known gaps

- later: saved searches UI expansion
- later: advanced category filters
- later: geolocation search
- later: analytics-based sorting
