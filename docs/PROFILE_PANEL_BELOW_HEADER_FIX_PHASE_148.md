# Phase 148 — Profile Panel Below Header Fix

## 1. Цель

Панель профиля/настроек (`SettingsDrawer`) должна открываться **ниже** полного sticky header, не перекрывая logo, search и categories.

## 2. Проблема

После Phase 147 dropdown и category menu работали корректно, но `SettingsDrawer` использовал generic `Drawer` с:

- `fixed inset-0` backdrop — затемнение всего viewport, включая область header
- `inset-y-0 h-full` panel — панель от верхнего края экрана

Header полупрозрачный (`bg-white/88`), поэтому тёмный overlay «просвечивал» сквозь шапку. Визуально казалось, что панель и backdrop перекрывают header/search.

## 3. Root cause

`src/components/ui/drawer.tsx` — right-side drawer и overlay позиционировались от `top: 0` без учёта `--site-header-height`, в отличие от `CategoryMegaDropdown`, который уже использует `top = headerHeight`.

## 4. Header height handling

Единый источник правды — CSS variable `--site-header-height`, выставляется в `useSiteHeaderHeight` при mount/resize header.

Fallback: `128px`.

## 5. Panel positioning

`DrawerContent` получил prop `belowHeader`:

- `top: var(--site-header-height, 128px)`
- `height: calc(100dvh - var(--site-header-height, 128px))`
- `right: 0`, `bottom: 0`
- fixed относительно viewport — не зависит от scrollY

`SettingsDrawer` передаёт `belowHeader`.

## 6. Backdrop positioning

При `belowHeader`:

- overlay `inset-x-0 bottom-0` + `top: var(--site-header-height)`
- не затемняет header
- клики по header остаются доступны (header выше overlay)

## 7. Z-index policy

| Layer | z-index |
|-------|---------|
| Header | 90 |
| Header dropdowns (profile/currency) | 90 |
| Settings panel | 85 |
| Settings backdrop | 70 |
| Category mega menu | 70 |
| Category backdrop | 60 |

## 8. Scroll lock

`SettingsDrawer` использует shared `useBodyScrollLock(open)` + `modal={false}` на Radix Drawer, чтобы:

- сохранять scroll position при открытии
- восстанавливать после закрытия
- не конфликтовать с Radix body lock

Внутренний scroll панели — `overflow-y-auto` в content area.

## 9. Desktop/mobile checks

| Viewport | Expected |
|----------|----------|
| 1440 / 1920 | Panel ~380px справа, ниже header |
| 390 / 430 | Panel full width (до max), ниже header |
| Mid-scroll | Panel top = header bottom, no jump |

## 10. Known limitations

- Header height измеряется client-side (краткий flash spacer до measure)
- Settings drawer всё ещё Radix Dialog portal — не кастомный sheet
- Profile dropdown (`UserMenu`) — отдельный popover, не затронут

## Файлы

| File | Change |
|------|--------|
| `src/components/ui/drawer.tsx` | `belowHeader` prop, offset overlay/panel |
| `src/components/layout/header/SettingsDrawer.tsx` | `belowHeader`, scroll lock, `modal={false}` |
| `src/components/layout/header/HeaderClient.tsx` | header z-[90], close overlays on mobile menu toggle |

## Migration

Нет.

## Связанные документы

- `docs/HEADER_DROPDOWN_SCROLL_LOCK_FIX_PHASE_147.md`
- `docs/LALAFO_STYLE_GLASS_HEADER_PHASE_143.md`
- `docs/MOBILE_QA_FREEZE_PHASE_130.md`
- `docs/GOOGLE_PLAY_RELEASE_BLOCKERS_PHASE_113.md`
