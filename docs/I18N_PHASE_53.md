# Interface i18n — Phase 53

## 1. Languages

| Locale | Label |
|--------|--------|
| `ru` | Russian (default) |
| `kg` | Kyrgyz |
| `en` | English |

## 2. Default locale

**`ru`** — used before mount and when localStorage is empty/invalid.

**Locale auto-detection and cookie storage added in Phase 54** — see `docs/I18N_PHASE_54_LOCALE_DETECTION.md`.

## 3. Dictionaries

| File | Role |
|------|------|
| `src/lib/i18n/dictionaries.ts` | Typed dictionary keys + `translate` / `getDictionary` |
| `src/lib/i18n/useTranslation.tsx` | `LocaleProvider` + `useTranslation()` |
| `src/components/providers/LocaleProvider.tsx` | Re-export for providers tree |
| `src/features/preferences/locale-preference.ts` | Storage key `vsetut.locale` (unchanged from Phase 51) |

Approach: dictionary-based client i18n. No URL prefixes (`/ru`, `/kg`, `/en`). No AI translation.

## 4. LocaleProvider wiring

`AppProviders` (`src/components/providers.tsx`):

```
ThemeProvider → LocaleProvider → TooltipProvider → children
```

- Reads `vsetut.locale` after mount
- `setLocale` writes localStorage and updates context
- `t(key)` returns string for current locale
- Hydration-safe: initial render uses `ru` until mounted

## 5. Language selector

In `SettingsDrawer`:

- Buttons **RU / KG / EN** call `setLocale` from `useTranslation`
- Active locale is highlighted (`aria-pressed`)
- UI strings update immediately without reload
- Storage key remains `vsetut.locale`

## 6. Translated UI zones

- Header nav (Опт / Объявления / Услуги / Карго)
- Auth actions (Войти / Регистрация / settings aria-labels / favorites)
- Header search placeholder + «Найти»
- Settings drawer (city, language, theme, sections, support, account)
- Homepage lead, direction cards, home search
- Home «Новые объявления» / «Смотреть все» / empty state
- Vertical compact heroes (market / opt / services / cargo)
- Vertical «Последние объявления» / «Все объявления» / empty messages

## 7. Not translated

- User listing `title` / `description` from DB
- Seller company names
- Category / city names from DB
- SEO metadata / sitemap by language
- Search/listing routes (no locale query or path prefix)
- Auth / uploads flows beyond shared header chrome
- Role labels and many dashboard/admin screens (still RU)

## 8. Known gaps

- **KG copy needs native review** — simple Kyrgyz UI strings; may need polish by a native speaker
- No `/ru` `/kg` `/en` routes yet
- No automatic translation of listings
- Multilingual metadata / sitemap SEO — later phase
- Mobile account drawer links (`getMobileAccountLinks`) still RU
- Footer and many server-heavy pages still RU
- Profile label in user menu may still be RU where not wired

## 9. Routes / Prisma

- Routes unchanged (`/market`, `/listings?vertical=…`, etc.)
- Prisma schema not changed
- No migration
- No seed required
