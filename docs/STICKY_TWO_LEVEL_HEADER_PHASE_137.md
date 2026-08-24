# Phase 137 — Sticky Two-Level Header

## 1. Цель

Довести header до двухуровневого sticky-блока: brand + search + actions сверху, разделы снизу; улучшить логотип и поиск; убрать дубли разделов на главной.

## 2. Что было неправильно

| Проблема | Где |
|----------|-----|
| Nav разделов в верхней строке рядом с логотипом | `HeaderClient` level 1 |
| Разделы дублировались на главной | `HomepagePaperEntry` |
| Search input с лишним padding справа (camera) | `SearchWithSuggest` header variant |
| Логотип с большим gap и nav-like шрифтом | `BrandLogo` |

## 3. Новая структура header

```
┌─────────────────────────────────────────────────┐
│ Level 1: [logo ВСЁ ТУТ] [search] [actions]      │
│ Mobile:  [logo] [actions] + search row          │
├─────────────────────────────────────────────────┤
│ Level 2: Объявления · Услуги · Опт · Карго      │
└─────────────────────────────────────────────────┘
sticky top-0, оба уровня в одном `<header>`
```

**Файлы:**
- `src/components/layout/header/HeaderClient.tsx`
- `src/components/layout/header/HeaderSectionNav.tsx` (new)
- `src/features/navigation/lib/header-nav.ts` — `isSectionNavActive()`

## 4. Brand/logo update

- Иконка + «ВСЁ ТУТ», gap **4px** (`gap-1`)
- `font-black`, `leading-none`, `tracking-[0.035em]`, `#111827`
- Иконка увеличена (~48–80px по breakpoints)

## 5. Search update

- Input **h-11 / h-12** (desktop), `text-base`
- Кнопка «Найти» **font-semibold**, h-11/h-12
- Camera icon **right-1**, input **pr-10** (без лишнего pr-20)
- Clear button **right-9** когда есть текст (рядом с camera)
- Max-width search: **560px** на desktop

## 6. Section nav second level

- Порядок: Объявления → Услуги → Опт → Карго
- Compact pills с иконками, h-9/h-10
- Active: vertical theme colors (purple/green/blue/orange)
- Active на `/listings?vertical=MARKET` и т.п.
- Mobile: horizontal scroll

## 7. Home cleanup after sticky header

- Убран `HomepagePaperEntry` с `/`
- Остаётся: «Популярные товары» + grid
- Разделы только в header level 2

## 8. Desktop/mobile checks

| Viewport | Check |
|----------|-------|
| 1440px / 1920px | Two-level sticky, search centered, no top nav dupes |
| 390×844 / 430×932 | Mobile search row, scrollable section nav |

Routes: `/`, `/market`, `/services`, `/opt`, `/cargo`, `/listings`, `/listings?q=…`, `/listings/[id]`, `/account`

## 9. Known limitations

- `HomepagePaperEntry.tsx` остаётся в codebase (unused)
- Header высота на mobile больше из-за search row + section nav — ожидаемо
- `/` не подсвечивает активный раздел (нет false positive на OPT)

## Связанные документы

- `docs/HOME_HEADER_CLEANUP_PHASE_136.md`
- `docs/MOBILE_QA_FREEZE_PHASE_130.md`
- `docs/GOOGLE_PLAY_RELEASE_BLOCKERS_PHASE_113.md`
