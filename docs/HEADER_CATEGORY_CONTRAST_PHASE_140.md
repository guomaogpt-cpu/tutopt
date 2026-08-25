# Phase 140 — Header Category Icon & Contrast

## 1. Цель

Сделать кнопку категорий icon-only (как Wildberries menu) и улучшить визуальный контраст главной, карточек и category drawer без полного redesign.

## 2. Category button icon-only

**Было:** иконка + текст «Категории»

**Стало:**
- Только `LayoutGrid` icon
- `size-10` mobile / `size-11` desktop (~44–48px)
- `aria-label` + `title` = «Категории»
- Tinted bg `slate-50`, subtle shadow
- Открывает тот же `CategoryDrawer`

**Файл:** `src/components/layout/header/HeaderClient.tsx`

## 3. Header spacing

- Logo + icon button в одной группе с `gap-1.5`
- Убраны две версии кнопки (text / icon-only)
- Search получает больше места без широкой text-кнопки

## 4. Home contrast

- Page background: `#F6F8FB`
- Sections: white / `#EEF2F6` alternating (muted tone)
- Section borders: `border-t border-slate-200/70`
- Titles: `text-lg font-bold`
- «Смотреть все»: blue-700, border-blue-200, shadow-sm

**Файлы:** `src/app/page.tsx`, `HomeListingsSection.tsx`

## 5. Card contrast

- Border: `border-slate-200` (full opacity)
- Shadow: `0 2px 8px` → hover `0 6px 16px`
- Image area: `#E8EDF3` + inset ring
- Meta: `text-slate-500` (was 400)
- Seller: `text-slate-600` (was 500)

**Файл:** `ListingCard.tsx` — compact layout unchanged

## 6. Category drawer contrast

- Drawer bg: `#F8FAFC`
- Vertical buttons: tinted (purple/green/blue/orange)
- Category lists: white card with borders
- Section dividers between groups
- Stronger hover on links

**Файл:** `CategoryDrawer.tsx`

## 7. Mobile/desktop checks

| Viewport | Check |
|----------|-------|
| 1440px / 1920px | Icon-only categories, search wide, cards readable |
| 390×844 / 430×932 | 40px icon button, drawer scroll, no horizontal scroll |

Routes: `/`, `/market`, `/services`, `/opt`, `/cargo`, `/listings`, `/listings?q=…`, `/account`

## 8. Known limitations

- Category drawer list still static config (Phase 139)
- Contrast tuned for light mode primarily
- No category search in drawer (future)
- **Phase 141:** second-level section nav restored alongside icon-only category button

## Связанные документы

- `docs/CATEGORY_DRAWER_HEADER_PHASE_139.md`
- `docs/COMPACT_MARKETPLACE_CARDS_PHASE_138.md`
- `docs/MOBILE_QA_FREEZE_PHASE_130.md`
- `docs/GOOGLE_PLAY_RELEASE_BLOCKERS_PHASE_113.md`
- `docs/SECOND_LEVEL_HEADER_NAV_PHASE_141.md`
