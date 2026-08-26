# Phase 143 — Lalafo-Style Glass Header

## 1. Цель

Перед fresh AAB: header по паттерну Lalafo/Wildberries — разделы рядом с логотипом, категории+поиск в нижней строке, glassmorphism, индикатор валюты/региона без автоконвертации.

## 2. Верхняя строка header

**Слева:** logo + «ВСЁ ТУТ» + Объявления / Услуги / Опт / Карго

**Справа:** избранное, уведомления, валюта/регион, профиль, настройки, «Разместить объявление» → `/listings/new`

**Mobile:** горизонтальный scroll разделов под logo; «Подать» compact; menu drawer

**Файлы:** `HeaderClient.tsx`, `HeaderSectionNav.tsx`

## 3. Нижняя строка categories/search

**Слева:** кнопка «Категории» (icon + text) → category drawer

**Центр:** широкий search input, placeholder «Я ищу...»

**Справа:** кнопка «Поиск»

Android WebView fix сохранён: `type="text"` + `inputMode="search"`.

## 4. Glassmorphism style

- `bg-white/82 backdrop-blur-xl backdrop-saturate-150`
- subtle shadow + border
- soft gradient overlay (purple/green/orange tints)

## 5. Gradient accent by sections

Тонкая 2px линия между row 1 и row 2:

`purple → green → blue → orange` (4 цвета разделов)

## 6. Category drawer compatibility

Единственная кнопка категорий — в нижней строке. **Phase 145:** заменено на mega dropdown (`CategoryMegaDropdown`).

## 7. Currency/region indicator

**Компонент:** `CurrencyRegionIndicator.tsx`

**Storage:** `localStorage` key `vsetut_display_preferences_v1`

**Defaults:** Кыргызstan · KGS

**Dropdown:**
- Регион: KG / KZ / RU / Other
- Валюта: KGS / KZT / RUB / USD

## 8. Почему автоматическую конвертацию не включили

- Цены в БД остаются в валюте продавца
- Нет GPS / IP geolocation
- Нет exchange rates API
- Выбор в header — UI-настройка для будущей конвертации
- Disclaimer в dropdown

## 9. Desktop/mobile checks

| Viewport | Check |
|----------|-------|
| 1440 / 1920 | Inline sections, wide search row, glass header |
| 390×844 / 430×932 | Scroll sections, compact actions, search row |

Routes: `/`, `/market`, `/listings?q=фасовщик`, `/listings/new`, `/account`

## 10. Known limitations

- Currency selector не меняет отображаемые цены карточек
- Auto region detection не реализован
- Mobile sections в horizontal scroll (не drawer)
- Post button compact on mobile
- **Phase 144:** z-index/pointer-events bugfix — header click disappear
- **Phase 147:** fixed header, dropdown interaction, scroll lock

## 11. Future currency plan

1. Ручной выбор валюты отображения
2. Справочный пересчёт по курсу (read-only)
3. Определение региона без GPS (browser locale / manual)
4. Настройка валюты аккаунта
5. Фильтр по валюте

## Связанные документы

- `docs/SECOND_LEVEL_HEADER_NAV_PHASE_141.md`
- `docs/HEADER_CARD_DENSITY_CLEANUP_PHASE_142.md`
- `docs/HEADER_DROPDOWN_SCROLL_LOCK_FIX_PHASE_147.md`
- `docs/CATEGORY_DRAWER_HEADER_PHASE_139.md`
- `docs/MOBILE_QA_FREEZE_PHASE_130.md`
- `docs/GOOGLE_PLAY_RELEASE_BLOCKERS_PHASE_113.md`
- `docs/HEADER_CLICK_DISAPPEAR_BUGFIX_PHASE_144.md`
- `docs/LALAFO_STYLE_CATEGORY_MEGA_DROPDOWN_PHASE_145.md`
