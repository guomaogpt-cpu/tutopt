# Phase 144 — Header Click Disappear Bugfix

## 1. Цель

Исправить критичный UX-баг: header пропадал или становился неинтерактивным после клика (Phase 143 glass header).

## 2. Симптом из ручного теста

- Клик по header → header «пропадает» или не реагирует
- Повторный клик / scroll up → снова работает
- Проявлялось на production desktop

## 3. Root cause

1. **Z-index collision:** header и drawer overlay оба были `z-50`. Overlay (Radix portal) рендерился поверх header и перехватывал клики — особенно во время/после close-анимации drawer.
2. **Decorative gradient layer:** glass gradient без `z-0` и content без явного `z-10` — потенциальный stacking conflict.
3. **Drawers inside `<header>`:** CategoryDrawer/SettingsDrawer были дочерними элементами header, усложняя stacking/focus context.

Auto-hide header logic **не найдена** — проблема не в scroll hide.

## 4. Что исправлено

- Header: `z-[60] isolate pointer-events-auto`
- Decorative gradient: `z-0 pointer-events-none`
- Content container: `relative z-10`
- Drawers вынесены из `<header>` (sibling fragment)
- Drawer overlay: `z-[70]` + `data-[state=closed]:pointer-events-none`
- Drawer content: `z-[71]` + closed pointer-events-none
- Dropdown menus: `z-[80]` (above header)
- Glass opacity: `bg-white/88` (чуть плотнее для стабильности blur)

## 5. Pointer-events/z-index changes

| Layer | z-index | pointer-events |
|-------|---------|----------------|
| Header | 60 | auto |
| Gradient | 0 | none |
| Header content | 10 | auto |
| Drawer overlay (open) | 70 | auto |
| Drawer overlay (closed) | 70 | none |
| Dropdown | 80 | auto |

## 6. Drawer/backdrop safety

- Closed overlay не блокирует клики (`pointer-events-none`)
- Drawers не внутри sticky header DOM
- Escape/backdrop закрывают только drawer, не header

## 7. Search regression check

- Search input clickable
- Submit → `/listings?q=...`
- `type="text"` + `inputMode="search"` сохранены
- Suggest dropdown `z-50` within header context

## 8. Mobile/desktop checks

| Viewport | Check |
|----------|-------|
| 1440 / 1920 | Header always visible & clickable |
| 390×844 / 430×932 | Sticky, drawer, search OK |

## 9. Known limitations

- При открытом drawer overlay закрывает header (expected modal behavior)
- Glass blur может иметь minor GPU flicker на старых Safari
- **Phase 145:** category side drawer replaced by mega dropdown (z-55 below header)

## Связанные документы

- `docs/LALAFO_STYLE_GLASS_HEADER_PHASE_143.md`
- `docs/MOBILE_QA_FREEZE_PHASE_130.md`
- `docs/GOOGLE_PLAY_RELEASE_BLOCKERS_PHASE_113.md`
- `docs/LALAFO_STYLE_CATEGORY_MEGA_DROPDOWN_PHASE_145.md`
