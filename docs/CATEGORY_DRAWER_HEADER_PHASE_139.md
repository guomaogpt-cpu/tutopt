# Phase 139 — Category Drawer Header

## 1. Цель

Добавить навигацию по категориям в стиле Wildberries: кнопка «Категории» рядом с логотипом, боковое меню разделов и категорий, убрать дублирующий second-level nav.

## 2. Что изменилось в header

**Было (Phase 137):**
- Level 1: logo + search + actions
- Level 2: sticky section nav (Объявления / Услуги / Опт / Карго)

**Стало:**
- Single sticky row: logo + **Категории** + search + actions
- Section nav убран из header
- Разделы доступны через category drawer

**Файлы:**
- `src/components/layout/header/HeaderClient.tsx`
- `src/components/layout/header/CategoryDrawer.tsx` (new)
- `src/features/navigation/lib/category-drawer-links.ts` (new)

## 3. Category drawer

- Opens from left (`Drawer side="left"`)
- Width ~380px desktop, ~full width minus margin on mobile
- Backdrop, Escape, X close
- Scroll inside drawer (`data-drawer-scroll`)
- Closes on link click + navigates

Sections:
1. **Разделы** — 2×2 grid (Объявления, Услуги, Опт, Карго)
2. **Популярные категории**
3. **Услуги**
4. **Опт**

## 4. Category groups

Uses real DB category slugs from `prisma/seed-data/categories.ts`.

Examples:
- Оборудование → `market-oborudovanie-i-stanki`
- Электроника → `market-telefony-i-elektronika`
- Ремонт (услуги) → `services-remont-i-stroitelstvo`
- Продукты (опт) → `produkty-pitaniya`

## 5. Routes

| Link | Route |
|------|-------|
| Объявления | `/market` |
| Услуги | `/services` |
| Опт | `/opt` |
| Карго | `/cargo` |
| Category | `/listings?vertical=…&category=…` |

Catalog resolves slugs via existing `resolveCatalogCategoryFilter` — no 500 on unknown slugs (empty results).

## 6. Home cleanup

Home already clean after Phase 136–138:
- No second search, hero, section cards, or «Сейчас ищут»
- Starts with «Популярные товары»
- Categories via header button only

## 7. Почему валюту по локации не делали

- Price must stay in seller's currency
- Auto conversion would confuse buyers/sellers
- No GPS, IP geo, or schema changes in this phase

## 8. Future currency/location plan

Deferred to future phase:
- Manual region/currency preference in account
- Reference FX rate display (“≈ in your currency”)
- Manual city selection (no GPS)
- Country/city filters

Category search inside drawer (“Найти категорию”) — also future.

## 9. Desktop/mobile checks

| Viewport | Check |
|----------|-------|
| 1440px / 1920px | Categories button + text, drawer left, search wide |
| 390×844 / 430×932 | Icon-only categories btn, drawer scroll, bottom nav ok |

Routes: `/`, `/market`, `/services`, `/opt`, `/cargo`, `/listings`, `/listings?q=…`, `/listings?category=…`, `/account`

## 10. Known limitations

- `HeaderSectionNav.tsx` kept in codebase but not rendered
- Category list is static config, not live DB fetch
- No in-drawer category search yet
- Some “popular” labels map to nearest existing slug (e.g. «Склад» → biznes-i-sklad)

## Связанные документы

- `docs/STICKY_TWO_LEVEL_HEADER_PHASE_137.md`
- `docs/HOME_HEADER_CLEANUP_PHASE_136.md`
- `docs/MOBILE_QA_FREEZE_PHASE_130.md`
- `docs/GOOGLE_PLAY_RELEASE_BLOCKERS_PHASE_113.md`
