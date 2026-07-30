# Photo search UX — Phase 58 (updated)

## Modal states

- `idle` / `preview` / `searching` / `success` / `empty` / `error`

## Hybrid prototype behavior

- Upload is validated and discarded
- Optional `queryHint` (“What is in the photo?”)
- Optional `vertical` / `category`
- Ranking uses text + section + listings with photos
- API returns `mode: "hybrid-prototype"` and `visualSearch: false`

## Not implemented

- Real visual similarity
- Embeddings / OCR / vector DB
- External AI APIs

See also:

- `docs/PHOTO_SEARCH_REAL_VISUAL_SEARCH_PLAN.md`
- `docs/PHOTO_SEARCH_LISTINGS_PHASE_59.md`
