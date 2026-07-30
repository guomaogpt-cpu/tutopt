# Photo search backend prototype — Phase 57 (updated)

Endpoint:

- `POST /api/search/photo`

Accepts multipart:

- `image` (required)
- `vertical` (optional)
- `category` (optional UUID)
- `queryHint` (optional text)

Returns public listing cards only, plus:

- `mode: "hybrid-prototype"`
- `visualSearch: false`
- `items` / `results`
- `explanation`

Does **not**:

- store the upload permanently
- run embeddings / OCR / vector search
- return seller private contacts

See `docs/PHOTO_SEARCH_REAL_VISUAL_SEARCH_PLAN.md` for the future visual search plan.
