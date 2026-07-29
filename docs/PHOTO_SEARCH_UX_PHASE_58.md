# Photo search UX — Phase 58

## 1. Modal states

- `idle` — no photo
- `preview` — photo selected, local preview shown
- `searching` — POST `/api/search/photo` in progress
- `success` — results shown (up to 6)
- `empty` — no matches
- `error` — validation / network / server error

Preview stays visible while searching.

## 2. Results UX

- Mini cards: image, title, price, city, vertical badge, open link
- Max 6 items in modal
- “View all results” when more than 6 (`/listings?vertical=<slug>&photoSearch=1`)
- Prototype notice in success state

## 3. Prototype mode

Backend returns recent published listings with images (optional vertical filter).
Uploaded file is validated and **not** persisted.

## 4. Remaining limits

- JPG / PNG / WEBP, max 5 MB
- No permanent upload storage
- No private seller contacts in API response

## 5. Not implemented

- Real visual similarity
- Embeddings / OCR / vector DB
- External AI APIs

## 6. Later phases

- Phase 59: `/listings?photoSearch=1` UI mode (see `PHOTO_SEARCH_LISTINGS_PHASE_59.md`)
