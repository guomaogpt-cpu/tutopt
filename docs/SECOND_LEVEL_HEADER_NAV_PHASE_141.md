# Phase 141 — Second-Level Header Nav Restored

## 1. Цель

Вернуть sticky second-level nav с 4 разделами в header, сохранив icon-only category button, category drawer и чистую главную без больших section cards.

## 2. Почему вернули второй уровень

После Phase 139–140 header стал одноуровневым — разделы были доступны только через category drawer. Пользователь попросил вернуть быстрый доступ к Объявления / Услуги / Опт / Карго прямо под header.

## 3. Header level 1

- Logo + «ВСЁ ТУТ»
- Category icon-only button → drawer
- Search (desktop inline, mobile row below)
- Actions: favorites, notifications, profile, settings

**Файл:** `HeaderClient.tsx`

## 4. Header level 2

- `HeaderSectionNav` restored inside sticky `<header>`
- Links: `/market`, `/services`, `/opt`, `/cargo`
- Height ~44–48px (h-11/h-12)
- Tinted bg `#F6F8FB`, active vertical colors
- Mobile: horizontal scroll

**Файл:** `HeaderSectionNav.tsx`

## 5. Category drawer compatibility

- Category icon unchanged (Phase 140)
- Drawer + second-level nav coexist
- Drawer = deep categories; level 2 = quick vertical switch

## 6. Home cleanup

- `HomepagePaperEntry` NOT rendered on `/`
- No large section cards, hero, duplicate search, «Сейчас ищут»
- Starts with «Популярные товары» + grid

## 7. Search regression checks

- Header search unchanged
- `/listings?q=…` works
- Android `type="text"` + `inputMode="search"` preserved

## 8. Desktop/mobile checks

| Viewport | Check |
|----------|-------|
| 1440px / 1920px | Two-level sticky, level 2 centered |
| 390×844 / 430×932 | Level 2 scroll, no page horizontal scroll |

Routes: `/`, `/market`, `/services`, `/opt`, `/cargo`, `/listings`, `/listings?q=…`, `/listings/[id]`, `/account`

Active: pathname + `/listings?vertical=…` via `isSectionNavActive`

## 9. Known limitations

- Header taller than Phase 139–140 single-level (by design)
- Home desktop sections below fold unchanged
- Category drawer list still static config
- **Phase 143:** section nav moved to top row; bottom row is categories+search

## Связанные документы

- `docs/STICKY_TWO_LEVEL_HEADER_PHASE_137.md`
- `docs/CATEGORY_DRAWER_HEADER_PHASE_139.md`
- `docs/HEADER_CATEGORY_CONTRAST_PHASE_140.md`
- `docs/MOBILE_QA_FREEZE_PHASE_130.md`
- `docs/GOOGLE_PLAY_RELEASE_BLOCKERS_PHASE_113.md`
- `docs/HEADER_CARD_DENSITY_CLEANUP_PHASE_142.md`
- `docs/LALAFO_STYLE_GLASS_HEADER_PHASE_143.md`
