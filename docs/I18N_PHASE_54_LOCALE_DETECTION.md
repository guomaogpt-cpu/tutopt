# Locale detection & persistence — Phase 54

## 1. Supported locales

| Locale | Notes |
|--------|--------|
| `ru` | Russian |
| `kg` | Kyrgyz (`ky` / `ky-KG` map here) |
| `en` | English |

## 2. Default locale

**`ru`**

- SSR / first paint before mount
- Unsupported browser languages
- Storage/cookie failures

## 3. Browser detection policy

After client mount, if **no** stored locale:

1. Read `navigator.languages`, then `navigator.language`
2. Normalize via `normalizeLocale`:
   - `ru`, `ru-RU` → `ru`
   - `ky`, `ky-KG`, `kg` → `kg`
   - `en`, `en-US`, `en-GB` → `en`
3. First match wins; otherwise `ru`
4. Persist detected value (`source=auto`) so later visits do not re-detect unless storage is cleared

If a stored locale exists (localStorage or cookie):

- Use it
- Do **not** override from the browser

## 4. localStorage key

- Locale: `vsetut.locale` (unchanged from Phase 51/53)
- Source flag: `vsetut.locale.source` (`auto` \| `manual`)

## 5. Cookie name

- Name: `vsetut.locale` (same as storage key)
- `path=/`
- `max-age` ≈ 1 year
- `SameSite=Lax`
- Value: `ru` \| `kg` \| `en` only

Cookie is written for a future server-side i18n; Phase 54 does **not** read it in middleware or translate metadata.

## 6. Manual selection priority

1. Saved choice (localStorage, then cookie)
2. Browser detection (first visit / empty storage)
3. Fallback `ru`

Settings drawer RU / KG / EN:

- Calls `setLocale` → updates React state immediately
- Writes localStorage + cookie with `source=manual`
- No page reload; active button follows `current locale`

## 7. No route prefixes

Still no:

- `/ru` `/kg` `/en`
- `?lang=`
- Locale redirects

URLs stay `/`, `/market`, `/opt`, `/services`, `/cargo`, `/listings`, …

## 8. No SEO i18n yet

- No multilingual sitemap
- No locale-aware metadata
- Middleware not changed for language

## 9. No automatic listing translation

User listing titles/descriptions and other DB content are not translated.

## Files

| File | Role |
|------|------|
| `src/lib/i18n/locale-storage.ts` | normalize / detect / get / set (LS + cookie) |
| `src/features/preferences/locale-preference.ts` | Thin compatibility API for Phase 51+ callers |
| `src/lib/i18n/useTranslation.tsx` | `LocaleProvider` uses `resolveInitialLocale` |
