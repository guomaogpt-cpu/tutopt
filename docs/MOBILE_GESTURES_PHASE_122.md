# Mobile Gestures & Swipe UX — Phase 122

Безопасные touch-жесты для mobile/PWA/Android WebView без глобального swipe-back и без тяжёлых gesture-библиотек.

---

## 1. Цель

Улучшить mobile UX там, где жесты естественны и не конфликтуют со scroll, формами и Android Back:

- листать фото объявления;
- закрывать bottom sheet свайпом вниз;
- плавно скроллить горизонтальные chips;
- сохранить tap/кнопки как fallback.

---

## 2. Какие жесты были рассмотрены

| Surface | Рассмотрено | Решение |
|---|---|---|
| `/listings/[id]` gallery | horizontal swipe, fullscreen | ✅ добавлено |
| Contact / filters / cargo drawers | swipe down | ✅ добавлено |
| Horizontal chips (home, catalog, tabs) | touch scroll | ✅ utility class |
| `/notifications` swipe actions | mark read | ❌ отложено |
| `/account/requests` swipe actions | close/in progress | ❌ отложено |
| Pull-to-refresh lists | custom PTR | ❌ отложено (риск WebView) |
| Global swipe-back | app-wide | ❌ не делали |
| `/listings/new` step swipe | navigation | ❌ не делали (риск потери данных) |

---

## 3. Что добавлено

| File | Role |
|---|---|
| `src/hooks/use-swipe-gesture.ts` | Typed swipe hook (axis lock, threshold) |
| `src/hooks/use-drawer-swipe-dismiss.ts` | Swipe-down dismiss for bottom sheets |
| `src/lib/gestures/swipe-utils.ts` | Interactive target guard |
| `src/components/listings/ListingFullscreenGallery.tsx` | Fullscreen viewer |
| `src/app/globals.css` | `.mobile-horizontal-scroll` utility |

Обновлены: `ListingGallery`, `drawer.tsx`, lead/cargo/filter drawers, horizontal chip rows.

---

## 4. Swipe gallery

**`/listings/[id]`** — `ListingGallery`:

- свайп влево/вправо **только в области фото** (не ломает scroll страницы);
- counter `1 / N` + dots при нескольких фото;
- одно фото — без counter/dots/стрелок;
- tap → `ListingFullscreenGallery` (swipe + swipe-down close + кнопки);
- desktop: стрелки prev/next, поведение contain сохранено.

---

## 5. Swipe down sheets

**`DrawerContent` (bottom):**

- drag threshold ~96px;
- закрытие через тот же close button → совместимо с Android Back (`closeTopmostOverlay`);
- scroll container: `[data-drawer-scroll]` — dismiss только когда `scrollTop === 0`;
- **`swipeDismissGuard`** блокирует dismiss при dirty form.

| Drawer | Guard |
|---|---|
| Lead contact | `!formDirty` |
| Cargo request | `!formDirty` |
| Catalog filters | always allowed (draft ephemeral) |

---

## 6. Horizontal chips/categories

Utility `.mobile-horizontal-scroll`:

- `overflow-x: auto`
- `-webkit-overflow-scrolling: touch`
- `touch-action: pan-x`
- hidden scrollbar

Применено к: trending chips, catalog filter chips, market shortcuts, account request tabs, notifications filter tabs, gallery thumbnails.

Страница остаётся с `overflow-x-clip` — без горизонтального scroll всего экрана.

---

## 7. Что не добавляли и почему

| Feature | Why not |
|---|---|
| Notifications swipe-to-read | Риск случайного действия; tap достаточен |
| Requests swipe close/in progress | Destructive; нужен confirm UX |
| Pull-to-refresh | Конфликт с browser/WebView native refresh |
| Global swipe-back | Ломает history и формы |
| Heavy gesture library | Достаточно lightweight touch handlers |
| Listing form step swipe | Риск потери draft |

---

## 8. Android / WebView risks

- Swipe dismiss вызывает тот же close path, что Back handler — без двойного закрытия
- Fullscreen gallery регистрируется в `closeTopmostOverlay` через `data-listing-fullscreen-gallery`
- Dirty forms блокируют swipe dismiss (X/Back по-прежнему работают — lead/cargo)
- `ignoreInteractive` на drawer swipe — не перехватывает input/textarea
- Нет `touch-action: none` на body

---

## 9. Accessibility fallbacks

| Gesture | Fallback |
|---|---|
| Gallery swipe | Thumbnails tap, prev/next buttons, keyboard arrows in fullscreen |
| Sheet swipe down | X button, overlay tap, Android Back |
| Horizontal chips | Tap/click on chip |

---

## 10. Future

- Controlled pull-to-refresh для `/listings`, `/notifications`, `/account/requests`
- Swipe actions for notifications (mark read) с undo
- Swipe actions for requests (non-destructive first)
- Real device QA gesture polish (Capacitor WebView)
- Optional edge gradient hint на horizontal scroll rows

---

## Связанные документы

- `docs/MOBILE_APP_UX_UPGRADE_PHASE_115.md`
- `docs/ANDROID_MANUAL_QA_POLISH_PHASE_111.md`
- `docs/ANDROID_REAL_DEVICE_QA_PHASE_112.md`
- `docs/MOBILE_APP_ROADMAP_PHASE_107.md`
- `docs/MOBILE_LISTING_DETAIL_PHASE_66.md`
