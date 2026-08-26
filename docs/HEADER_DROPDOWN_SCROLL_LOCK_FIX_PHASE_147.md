# Phase 147 — Header Dropdown & Scroll Lock Fix

## 1. Цель

Исправить критичные баги после Phase 143–145: profile/currency dropdowns не работали в середине страницы, category mega menu ломал header и не блокировал scroll.

## 2. Найденные баги

1. Profile/currency dropdown не открывались mid-scroll; header «ломался»
2. Category mega menu — body продолжал скроллиться
3. При открытии категорий mid-scroll верхняя строка header исчезала

## 3. Root cause

1. **`overflow: hidden` на body ломает `position: sticky`** — header терял sticky context, верхняя строка уезжала
2. **Mega menu z-[55] + sticky header** — нестабильное позиционирование при scroll lock
3. **Radix Dropdown `modal={true}`** — pointer-events на body конфликтовали с header layers
4. **Простой overflow hidden** — не блокировал touch scroll и не сохранял scroll position

## 4. Header visibility fix

- Header: `fixed inset-x-0 top-0 z-[80]` вместо sticky
- Spacer div с dynamic height под header
- CSS variable `--site-header-height`
- Header always visible, always clickable

## 5. Profile dropdown fix

- Controlled open state from HeaderClient
- `modal={false}` на Radix Dropdown
- z-[90] на DropdownContent
- Mutual exclusion: открытие profile закрывает categories/currency

## 6. Currency dropdown fix

- Аналогично profile: controlled + modal={false} + z-[90]
- Mutual exclusion с categories/profile

## 7. Category mega menu positioning

- Fixed panel `top: headerHeight` (не зависит от scrollY)
- z-[70] panel, z-[60] backdrop — ниже header z-[80]
- Header остаётся полностью видимым при open

## 8. Body scroll lock

- Hook `useBodyScrollLock`: `position: fixed` + `top: -scrollY`
- Restore scroll position on unlock
- Compensate scrollbar width
- Internal menu scroll preserved

## 9. Z-index/pointer-events policy

| Layer | z-index |
|-------|---------|
| Header | 90 |
| Header dropdowns / settings panel | 90 / 85 |
| Category mega menu | 70 |
| Category / settings backdrop | 60 / 70 |
| Decorative gradient | 0, pointer-events-none |

## 10. Desktop/mobile checks

| Test | Result |
|------|--------|
| Profile mid-scroll | Opens, header stable |
| Currency mid-scroll | Opens, header stable |
| Categories mid-scroll | Full header visible, body locked |
| Close categories | Scroll position restored |

## 11. Known limitations

- Fixed header adds spacer — height measured client-side
- ~~Settings drawer still uses Radix modal drawer (z-70)~~ → **Phase 148:** settings drawer below header via `belowHeader`

## Phase 148 follow-up

Settings/profile panel (`SettingsDrawer`) repositioned below header — см. `docs/PROFILE_PANEL_BELOW_HEADER_FIX_PHASE_148.md`.

## Связанные документы

- `docs/HEADER_CLICK_DISAPPEAR_BUGFIX_PHASE_144.md`
- `docs/LALAFO_STYLE_CATEGORY_MEGA_DROPDOWN_PHASE_145.md`
- `docs/LALAFO_STYLE_GLASS_HEADER_PHASE_143.md`
- `docs/PROFILE_PANEL_BELOW_HEADER_FIX_PHASE_148.md`
- `docs/MOBILE_QA_FREEZE_PHASE_130.md`
- `docs/GOOGLE_PLAY_RELEASE_BLOCKERS_PHASE_113.md`
