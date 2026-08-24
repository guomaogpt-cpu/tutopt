# Phase 136 — Home & Header Cleanup

## 1. Цель

Упростить главную страницу и header перед релизом: убрать дубли поиска и лишний hero-контент, сделать разделы компактными, обновить логотип.

## 2. Что убрали с главной

| Элемент | Было | Стало |
|---------|------|-------|
| Второй поиск | Hero + header | Только header |
| Hero title | «Покупайте, продавайте, находите услуги» | Убран |
| Mobile subtitle | `home.appTitle` / `home.appSubtitle` | Убран |
| «Сейчас ищут» | `HomeTrendingSearchesSection` (desktop) | Убран |
| Большие карточки разделов | 140px cards с описаниями | Компактный row |
| Eyebrow «Витрина» | Над блоком товаров | Убран |

## 3. Header logo update

**Файл:** `src/components/layout/BrandLogo.tsx`

- Иконка увеличена на ~5–8 px (header variant)
- Рядом текст **ВСЁ ТУТ** как единый brand block
- Кликабельная ссылка на `/`
- Текст скрывается только на экранах < 360px (`min-[360px]:inline`)

## 4. Search duplication fix

**Файлы:** `HomepagePaperEntry.tsx`, `HeaderClient.tsx`

- Удалены `SearchWithSuggest` блоки с главной (desktop + mobile)
- Mobile header search теперь показывается и на `/` (убран guard `!isHome`)
- Поиск в header: ввод → `/listings?q=...`

## 5. Compact sections

**Файл:** `HomepagePaperEntry.tsx`

Desktop: одна строка из 4 компактных кнопок (h-12, icon + label).

Mobile: горизонтальный scroll row (h-11, min-width pill).

Маршруты:
- Объявления → `/market`
- Услуги → `/services`
- Опт → `/opt`
- Карго → `/cargo`

## 6. Popular products block

**Файлы:** `HomeListingsSection.tsx`, `dictionaries.ts`

- Заголовок: «Популярные товары» (`home.popularProducts`)
- Данные: последние опубликованные объявления (`data.latest`)
- Карточки Phase 135: фото, цена, название, meta, автор

## 7. Desktop/mobile checks

| Viewport | Проверка |
|----------|----------|
| 1440px / 1920px | Logo + ВСЁ ТУТ, один search, compact sections, grid |
| 390×844 / 430×932 | Header search, compact scroll sections, listings visible |

Routes:
- `/` — compact home
- `/market`, `/services`, `/opt`, `/cargo` — без изменений hero
- `/listings`, `/listings?q=фасовщик` — search работает

## 8. Known limitations

- Desktop-only discovery blocks (opt/services/cargo sections) остаются ниже fold — не менялись в этой фазе
- `HomeTrendingSearchesSection` компонент остаётся в codebase, но не рендерится на `/`
- Legacy hero components (`HeroSection`, `HomeMarketplaceEntry`) не удалены
- Superseded by Phase 137: section nav moved to sticky header level 2; `HomepagePaperEntry` no longer rendered
- Superseded by Phase 139: section nav removed; categories via header drawer

## Связанные документы

- `docs/LISTING_CARDS_MODALS_PROFILE_CLEANUP_PHASE_135.md`
- `docs/MOBILE_QA_FREEZE_PHASE_130.md`
- `docs/GOOGLE_PLAY_RELEASE_BLOCKERS_PHASE_113.md`
- `docs/STICKY_TWO_LEVEL_HEADER_PHASE_137.md`
- `docs/CATEGORY_DRAWER_HEADER_PHASE_139.md`
