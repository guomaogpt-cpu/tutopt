# Phase 145 — Lalafo-Style Category Mega Dropdown

## 1. Цель

Заменить боковой category drawer на mega dropdown под header в стиле Lalafo: слева основные категории, справа подкатегории в колонках.

## 2. Почему заменили drawer

- Side drawer менее удобен на desktop
- Lalafo pattern: панель выпадает вниз от header
- Mega grid быстрее для навигации по подкатегориям
- Меньше риск overlay-багов Phase 144 (z-55 below header z-60)

## 3. Desktop mega dropdown

- Fixed panel под header (`top: headerHeight`)
- Container width aligned с site container
- Left: 320px category list с emoji + chevron
- Right: 3–4 column grid групп подкатегорий
- Hover на desktop переключает active category
- «Смотреть всё» → root category href

## 4. Mobile behavior

- Horizontal scroll chips для основных категорий
- Subcategories ниже в scroll area
- Close X в mobile header panel
- max-height: calc(100dvh - header)

## 5. Category structure

15 основных категорий: Транспорт, Недвижимость, Услуги, …, Карго, Другое.

Data: `category-mega-menu-data.ts` — maps to existing DB slugs from seed.

## 6. Routes

- Category slugs: `/listings?vertical=MARKET&category=market-…`
- Subcategory: `&subcategory=market-eq-…`
- Services → `/services` or SERVICES vertical slugs
- Cargo → `/cargo` or CARGO category slugs
- Unknown → `/listings?q=…` search fallback

## 7. Animation

- Open: opacity 1, translateY(0), 200ms ease-out
- Close: opacity 0, translateY(-12px), unmount after 200ms
- Closed: pointer-events-none

## 8. Backdrop/header safety

- Backdrop: z-55, top below header, NOT covering header
- Header: z-60 — always clickable
- Closed backdrop: pointer-events-none + opacity 0
- Body scroll lock when open, restored on close

## 9. Search compatibility

- Focus/click search closes mega menu (`onFocusCapture`)
- Search WebView fix preserved

## 10. Accessibility

- `aria-expanded` / `aria-controls` on button
- `role="dialog"` + `aria-modal`
- Escape closes menu
- Backdrop click closes

## 11. Known limitations

- MVP taxonomy — not full Lalafo depth
- Auto brands (Toyota etc.) use search query fallback
- No in-menu category search yet
- `CategoryDrawer.tsx` removed

## Связанные документы

- `docs/LALAFO_STYLE_GLASS_HEADER_PHASE_143.md`
- `docs/HEADER_CLICK_DISAPPEAR_BUGFIX_PHASE_144.md`
- `docs/CATEGORY_DRAWER_HEADER_PHASE_139.md`
- `docs/MOBILE_QA_FREEZE_PHASE_130.md`
- `docs/GOOGLE_PLAY_RELEASE_BLOCKERS_PHASE_113.md`
