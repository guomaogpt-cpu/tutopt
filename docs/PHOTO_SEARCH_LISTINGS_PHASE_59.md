# Photo search on /listings — Phase 59

## 1. `/listings?photoSearch=1`

When `photoSearch=1` is present:

- Catalog query/filters work as usual (`q`, `vertical`, category, city, sort, pagination)
- A prototype notice block appears above the catalog toolbar
- Empty state uses photo-search copy and CTAs
- Filter area shows a short hint that filters can be combined with photo search
- `photoSearch=1` is preserved when changing filters / sort / pagination

This is a **UI mode only**. It does not run visual matching on the listings page.

## 2. Notice block

- Title + prototype description (RU / KG / EN)
- Camera icon
- “New photo search” opens the existing `PhotoSearchButton` modal

## 3. Empty state

If the catalog has zero results while `photoSearch=1`:

- Special empty title/description
- “New photo search” (modal)
- “All listings” (`/listings` or vertical-scoped URL)

## 4. Remaining limits

- No persistent photo session / uploaded file on the listings page
- Listings shown are normal catalog results under current filters
- Backend prototype still does not do real visual similarity

## 5. Not implemented

- Real visual similarity
- Embeddings / OCR / vector DB
- Persistent photo search sessions
- Storing the uploaded photo for the catalog view
