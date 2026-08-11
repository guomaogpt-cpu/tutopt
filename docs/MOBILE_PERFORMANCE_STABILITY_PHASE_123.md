# Mobile Performance & Stability — Phase 123

Улучшение скорости, плавности и стабильности mobile/PWA/Android WebView без большого архитектурного refactor.

---

## 1. Цель

- быстрее первый экран главной на mobile;
- плавнее списки и фильтры;
- меньше layout shift и лишнего JS;
- стабильный polling уведомлений;
- безопасные fallbacks без raw errors.

---

## 2. Что проверяли

Маршруты: `/`, `/market`, `/listings`, `/listings/[id]`, `/listings/new`, `/account`, `/notifications`, `/cargo`.

Найдено: over-fetch на home mobile, отсутствие skeleton на `/listings`, Prisma runtime в card price formatter, частый keyboard inset без throttle, category search без debounce, draft writes каждые 800ms.

---

## 3. Главная

- `getHomePageData({ mobile: true })` — только latest + stats (4 запроса вместо 13)
- `isMobileUserAgentRequest()` — UA/`sec-ch-ua-mobile` heuristic для SSR trim
- Desktop discovery blocks по-прежнему грузятся полностью на desktop UA

---

## 4. Listings / search

- `src/app/listings/loading.tsx` — skeleton grid при navigation/filter change
- `ListingCardSkeleton` — 4:3 image + text placeholders
- `ListingsCatalogToolbar` — `useTransition` + `aria-busy` при смене фильтров
- Search suggest уже debounced 300ms + AbortController (без изменений)

---

## 5. Listing cards

- `React.memo` на `ListingCard`
- `loading="lazy"` на фото
- `formatListingCardPrice` без `Prisma.Decimal` runtime — `formatListingPriceAmount`
- Fixed aspect ratio 4:3 сохранён

---

## 6. Listing creation form

- Draft debounce: **800ms → 1500ms** (`LISTING_FORM_DRAFT_DEBOUNCE_MS`)
- Keyboard inset: rAF-coalesced updates в `syncMobileKeyboardInset`

---

## 7. Category picker

- Debounced search input **200ms** перед `searchCategoriesWithSynonyms`
- UI input остаётся instant; фильтрация DOM отложена

---

## 8. Notifications polling

- Pause fetch when `document.hidden`
- Interval: **30s active / 120s hidden**
- Refresh on `visibilitychange` → visible
- Single poller via `NotificationsUnreadSync` (без дублей)

---

## 9. Images / uploads

- Listing cards: lazy load + fixed aspect
- Upload previews: existing `revokeObjectURL` в `ListingImageUpload` (без изменений)
- `unoptimized` на remote listing images сохранён (CDN pipeline — future)

---

## 10. Android WebView

- Throttled `--keyboard-inset` — меньше reflow при keyboard animation
- Bottom nav / sticky submit используют CSS var без изменений API
- Swipe gallery / drawer dismiss из Phase 122 совместимы

---

## 11. Bundle hygiene

- Убран `Prisma as PrismaRuntime` из client card price path
- Server-only: prisma, OpenAI — без изменений (already isolated)

---

## 12. Error fallbacks

- `/listings/loading.tsx` — нет белого экрана при navigation
- Existing try/catch на catalog metadata и market routes сохранены
- Image `onError` fallback на карточках сохранён

---

## 13. Что осталось

- `unstable_cache` для catalog categories/cities/brands
- Dynamic import autosuggest + characteristics config on `/listings/new`
- Remove `unoptimized` when image CDN ready
- Pause notification polling on `/notifications` route specifically
- Pull-to-refresh (deferred)
- Real device perf profiling (Chrome Performance / WebView)

---

## Файлы

| File | Change |
|---|---|
| `src/lib/mobile/is-mobile-request.ts` | Mobile UA detection |
| `src/features/home/lib/home-data.ts` | Mobile-scoped fetch |
| `src/app/listings/loading.tsx` | Catalog skeleton |
| `src/components/listings/ListingCardSkeleton.tsx` | Card skeleton |
| `src/components/listings/ListingCard.tsx` | memo + lazy |
| `src/features/listings/lib/listing-display.ts` | No Prisma runtime in price |
| `src/lib/mobile/mobile-viewport.ts` | rAF keyboard inset |
| `src/components/notifications/NotificationsUnreadSync.tsx` | Visibility-aware polling |
| `src/components/listings/CategoryPicker.tsx` | Debounced search |
| `src/components/listings/ListingsCatalogToolbar.tsx` | useTransition |

---

## Связанные документы

- `docs/MOBILE_APP_UX_UPGRADE_PHASE_115.md`
- `docs/LISTINGS_SEARCH_FILTERS_PHASE_120.md`
- `docs/MOBILE_GESTURES_PHASE_122.md`
- `docs/MOBILE_APP_ROADMAP_PHASE_107.md`
