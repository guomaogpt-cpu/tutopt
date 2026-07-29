# Photo search backend prototype — Phase 57 (compat note)

Phase 57 backend was not present as a separate commit in this repo when Phase 58 started.
Phase 58 added the prototype endpoint:

- `POST /api/search/photo`
- Validates JPG/PNG/WEBP ≤ 5 MB
- Does **not** store the file
- Returns recent published public listings (optional `vertical`)
- No AI / embeddings / OCR

See also:

- `docs/PHOTO_SEARCH_UI_PHASE_55.md`
- `docs/PHOTO_SEARCH_UX_PHASE_58.md`
