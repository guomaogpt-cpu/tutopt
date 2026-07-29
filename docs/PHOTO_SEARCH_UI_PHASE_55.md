# Photo search UI placeholder — Phase 55

## 1. Where the camera button was added

Shared search component `SearchWithSuggest` (covers):

- Header search
- Homepage search
- Vertical hero / phrase search (`/market`, `/opt`, `/services`, `/cargo`)

Also wired in `HeaderSearch` Suspense fallback (`syncDisabled`).

Component: `src/components/search/PhotoSearchButton.tsx`

## 2. What the modal does now

- Opens on camera click (`type="button"`, does not submit text search)
- Local file pick: JPG / PNG / WEBP, max 5 MB
- Local preview via `URL.createObjectURL`
- Client-side type/size validation + remove
- “Find similar” shows inline “coming soon” message
- i18n RU / KG / EN keys under `search.photo.*`
- Dark mode styles on modal / upload zone

## 3. Not implemented

- No upload to server
- No AI / embeddings / OCR
- No image search backend
- No Prisma / uploads architecture changes

## 4. Limits

- Formats: JPEG, PNG, WEBP
- Max size: 5 MB
- Preview: local only

## 5. Future Phase 56

Backend prototype for photo similarity search (upload + matching), without changing this UI contract more than needed.
