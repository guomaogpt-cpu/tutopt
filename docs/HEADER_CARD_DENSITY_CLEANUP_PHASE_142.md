# Phase 142 — Header & Card Density Cleanup

## 1. Цель

Финальная полировка перед fresh AAB: цельный header, плотнее карточки, шире desktop container, убрать продавца из публичных cards.

## 2. Header visual cleanup

- Header: solid white `#FFFFFF`, один `border-b`, лёгкая shadow
- Убран backdrop-blur и полупрозрачный фон
- Level 2: white фон (не серо-голубой блок), `border-t border-slate-100`
- Компактнее: h-10/h-11 вместо h-11/h-14

**Файлы:** `HeaderClient.tsx`, `HeaderSectionNav.tsx`

## 3. Public card changes

Структура:
```
Фото
Цена
Название (1 строка)
────────────
Город · Категория · Дата
```

## 4. Removed seller from cards

- Убрана нижняя строка Akyl / Tilek Admin / company name
- Detail page `/listings/[id]` — без изменений
- Account management cards — без изменений

## 5. One-line titles

- `truncate` + `leading-tight`
- Не `line-clamp-2`

## 6. Separator line

- `border-t border-slate-100` между title и meta
- margin ~6px (`mt-1.5 pt-1.5`)

## 7. Text size/density

| Element | Size |
|---------|------|
| Price | xs / 13px |
| Title | 11px / xs |
| Meta | 9px / 10px |
| Padding | px-2, pt-1.5 |

## 8. Wider desktop container

**Файл:** `container.tsx`

- `lg`: max-w `[100rem]` (1600px), было 1280px
- `xl`: max-w `[110rem]` (1760px)
- Desktop padding: `lg:px-6` вместо `lg:px-8`

**Grid:** 5 cols @ lg, 6 @ xl, 6–7 @ 2xl

## 9. Desktop/mobile checks

| Viewport | Check |
|----------|-------|
| 1440px / 1920px | Wider grid, unified white header |
| 390×844 / 430×932 | 2-col cards, compact text |

Routes: `/`, `/market`, `/listings`, `/favorites`, `/seller/[id]`, `/listings/[id]`

## 10. Known limitations

- Seller removed from cards only (Pinduoduo-style later)
- Container widen affects all `size="lg"` pages
- Detail page full title unchanged
- **Phase 143:** header layout replaced — sections in top row, glass style

## Связанные документы

- `docs/COMPACT_MARKETPLACE_CARDS_PHASE_138.md`
- `docs/SECOND_LEVEL_HEADER_NAV_PHASE_141.md`
- `docs/MOBILE_QA_FREEZE_PHASE_130.md`
- `docs/GOOGLE_PLAY_RELEASE_BLOCKERS_PHASE_113.md`
- `docs/LALAFO_STYLE_GLASS_HEADER_PHASE_143.md`
