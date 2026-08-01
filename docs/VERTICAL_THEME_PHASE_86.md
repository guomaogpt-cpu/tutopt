# Phase 86 — Vertical color themes

## 1. Why a unified theme

Active nav, search «Найти», catalog CTAs, and landing buttons used different palettes (blue hex, indigo/teal/rose badges, orange cargo). Phase 86 introduces one map so each marketplace vertical paints chrome consistently.

## 2. Colors

| Vertical | Primary |
| --- | --- |
| OPT (`/opt`) | blue-600 / hover blue-700 |
| MARKET (`/market`) | purple-600 / hover purple-700 |
| SERVICES (`/services`) | green-600 / hover green-700 |
| CARGO (`/cargo`) | orange-500 / hover orange-600 |

Default (home, `/listings` without `vertical`) → blue (OPT theme).

## 3. Where theme applies

- Header nav active pills
- Header + page search «Найти»
- Vertical landing heroes / cargo CTAs & chips
- Catalog tabs, search, filters apply, pagination active
- `/listings/new` submit + type chooser accents
- `VerticalListingBadge`, vertical cards, card glow

Helper: `src/lib/vertical-theme.ts` → `getVerticalTheme(vertical)`  
Route resolve: `resolveThemeVertical(pathname, searchParams)` + `useRouteVerticalTheme()`.

## 4. How current vertical is resolved

1. Path `/opt|/market|/services|/cargo` (+ nested)
2. Else `/listings…` with `?vertical=`
3. Else `null` → default blue

## 5. Why no dynamic Tailwind strings

Class names must be full static literals in source so Tailwind’s scanner keeps them in CSS. Themes are objects of complete class strings, never `bg-${color}-600`.

## 6. Unchanged

- Auth / sessions
- Prisma schema
- CargoRequest / CargoResponse / Telegram / subscriptions business logic
- Listing create/edit API behavior

## 7. Future

- User-configurable accent
- Design-system tokens (CSS variables)
- Branded company pages
