# Photo search UI placeholder — Phase 55

## 1. Where the camera button was added

Shared search component `SearchWithSuggest` (covers):

- Header search
- Homepage search
- Vertical hero / phrase search (`/market`, `/opt`, `/services`, `/cargo`)

Also wired in `HeaderSearch` Suspense fallback (`syncDisabled`).

Component: `src/components/search/PhotoSearchButton.tsx`

## 2. What the modal did in Phase 55

- Opens on camera click (`type="button"`, does not submit text search)
- Local file pick: JPG / PNG / WEBP, max 5 MB
- Local preview via `URL.createObjectURL`
- Client-side type/size validation + remove
- “Find similar” showed inline “coming soon” message
- i18n RU / KG / EN keys under `search.photo.*`
- Dark mode styles on modal / upload zone

## 3. Not implemented in Phase 55

- No upload to server
- No AI / embeddings / OCR
- No image search backend
- No Prisma / uploads architecture changes

## 4. Limits

- Formats: JPEG, PNG, WEBP
- Max size: 5 MB
- Preview: local only

## 5. Later phases

- Phase 57: backend prototype `POST /api/search/photo` (see `PHOTO_SEARCH_BACKEND_PHASE_57.md`)
- Phase 58: results UX in modal (see `PHOTO_SEARCH_UX_PHASE_58.md`)
- Phase 59: `/listings?photoSearch=1` UI mode (see `PHOTO_SEARCH_LISTINGS_PHASE_59.md`)
