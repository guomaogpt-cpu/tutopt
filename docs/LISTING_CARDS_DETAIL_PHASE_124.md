# Listing Cards & Detail Page — Phase 124

Улучшение карточек объявлений и страницы `/listings/[id]` для mobile/PWA/Android WebView — понятнее, компактнее, сильнее conversion.

---

## 1. Цель

Довести главный путь пользователя:

**Главная → поиск/раздел → список → карточка → страница объявления → связаться/заявка**

Без нового дизайна всего сайта, без чата и платежей.

---

## Phase 135 — cards/modals/profile cleanup ✅

Public listing cards simplified (no characteristics in card). Contact + cargo modals centered on desktop. Seller profile stats block removed. See `docs/LISTING_CARDS_MODALS_PROFILE_CLEANUP_PHASE_135.md`.

---

## 2. Что улучшено в карточках (Phase 124 → updated Phase 135)

| Было | Стало |
|---|---|
| Перегруженная meta-строка | Единый формат: **город · категория · дата** |
| Абсолютная дата | **Сегодня / Вчера** для свежих объявлений |
| Vertical badge на каждой карточке в каталоге | Скрыт на mobile в catalog/home |
| Seller block на mobile catalog | Только desktop (`md+`) |
| Glow shadow на mobile | Скрыт (`max-sm:hidden`) |
| min-h на title | Убран — карточки ниже |
| Пустой seller name | Fallback **«Автор объявления»** |

**Phase 135:** карточка только фото · цена · название · meta · продавец. Характеристики и MOQ убраны из карточки (остаются на detail page).

Карточка показывает: фото, бейдж раздела, цена, title, meta (город · категория · дата), seller, favorite.

Файл: `src/components/listings/ListingCard.tsx`

---

## 3. Что улучшено на detail page

Mobile layout:

1. Gallery
2. **Summary** — цена, title, город, категория, дата, MOQ
3. **Характеристики** (stored characteristics)
4. **Описание** (скрыто если пусто)
5. **Продавец**
6. Lead form / hints

Убрано на mobile:
- дублирующий `ListingMainInfo`
- второй блок «Характеристики» (direction/price/category) — остаётся на desktop

Файлы: `src/app/listings/[id]/page.tsx`, `ListingMobileSummary.tsx`

---

## 4. Фото

- Fixed **4:3** aspect ratio (без изменений)
- `object-cover`, lazy load, neutral placeholder
- Favorite button `z-[2]` — не конфликтует с overlay link

---

## 5. Характеристики

- Stored characteristics — 2-column grid, collapse на длинных списках
- Пустые значения не рендерятся
- Старые объявления без `characteristics` — блок скрыт (`return null`)

---

## 6. Sticky CTA

Без изменений API — Phase 119 lead flow:

| Viewer | Primary | Secondary |
|---|---|---|
| Guest/buyer | **Связаться** (drawer) | Favorite icon |
| Owner | **Редактировать** | **Заявки** |

`mobileStickyBottomOffset` + safe-area + keyboard inset из Phase 123.

---

## 7. Seller/company block

- Fallback **«Автор объявления»** если нет имени/компании
- Verified badge, profile link — без изменений

---

## 8. Android/WebView checks

| Check | Status |
|---|---|
| Back из detail → выдача | OK (browser history) |
| Swipe gallery (Phase 122) | OK |
| Sticky CTA не перекрывает bottom nav | OK |
| Favorite tap не открывает карточку | OK (`stopPropagation`) |
| Safe-area | OK |
| Horizontal scroll | OK |

---

## 9. Known limitations

- Lead/contact flow зависит от **Phase 119** (drawer + form)
- Нет похожих объявлений UX upgrade (SimilarListings есть, но не в scope)
- Desktop card seller block остаётся — mobile catalog компактнее
- `unoptimized` images — future CDN

---

## 10. Future

- Fullscreen gallery polish
- Похожие объявления на mobile
- Жалоба на объявление — ✅ Phase 125 (`ListingReportSection`)
- Share button / WhatsApp deep link
- Native share plugin

## 11. Phase 127 — Seller / company storefront ✅

- `ListingSellerCard`: verified company badge only when `VERIFIED`
- Company profile link from listing detail seller block
- См. `docs/SELLER_COMPANY_STOREFRONT_PHASE_127.md`

---

## Empty / error states

`src/app/listings/[id]/not-found.tsx`:

- **Объявление не найдено**
- «Оно могло быть удалено, скрыто или ещё не опубликовано.»
- CTA: Вернуться к поиску / На главную

---

## Файлы

| File | Change |
|---|---|
| `ListingCard.tsx` | Mobile card polish |
| `ListingMobileSummary.tsx` | Richer mobile header |
| `ListingDescription.tsx` | Hide empty block |
| `ListingSellerCard.tsx` | Author fallback |
| `listing-detail-data.ts` | Parent category in select |
| `listings/[id]/page.tsx` | Mobile layout reorder |
| `listings/[id]/not-found.tsx` | Safe 404 |
| `dictionaries.ts` | today/yesterday/listingAuthor keys |

---

## Routes checked

- `/`, `/market`, `/listings`, `/listings?vertical=market`
- `/listings/[id]`, `/account/listings`, `/favorites`

---

## Связанные документы

- `docs/MOBILE_APP_UX_UPGRADE_PHASE_115.md`
- `docs/LISTINGS_SEARCH_FILTERS_PHASE_120.md`
- `docs/MOBILE_GESTURES_PHASE_122.md`
- `docs/MOBILE_APP_ROADMAP_PHASE_107.md`
- `docs/MOBILE_PERFORMANCE_STABILITY_PHASE_123.md`
