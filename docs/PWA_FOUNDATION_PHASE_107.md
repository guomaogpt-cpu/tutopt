# PWA Foundation — Phase 107

## 1. Цель

Подготовить сайт ВсеТут как installable PWA и mobile app foundation без React Native и без Capacitor на этом этапе. Пользователь на телефоне должен получить ощущение приложения: иконка, название, нижняя навигация, safe areas, offline fallback и возможность установки на главный экран.

## 2. Что добавлено

- Web App Manifest (`src/app/manifest.ts`)
- PWA icons 192/512/maskable/apple-touch-icon из существующего логотипа
- Mobile metadata: `themeColor`, `appleWebApp`, `viewport-fit=cover`
- Минимальный service worker (`public/sw.js`) с offline fallback
- Страница `/offline` с кнопкой «Повторить»
- Install prompt: banner после 2+ просмотров страниц + карточка в `/account`
- Обновлена mobile bottom nav: Уведомления вместо Избранного, «Кабинет» вместо «Профиль»
- Унифицирован offset sticky CTA на `/listings/[id]` (5rem)
- Global `overflow-x-clip` на `html`/`body`

## 3. Manifest

| Поле | Значение |
|---|---|
| name / short_name | ВсеТут |
| description | Объявления, услуги, опт и карго в Кыргызстане. |
| start_url | `/` |
| display | standalone |
| theme_color | `#2563eb` |
| background_color | `#ffffff` |
| lang | ru |
| orientation | portrait |
| scope | `/` |
| categories | shopping, business, productivity |

Файл: `src/app/manifest.ts` → served as `/manifest.webmanifest`.

## 4. Icons

Сгенерированы из `public/logos/vsetut-logo-new.png` (без нового дизайна):

- `public/icons/icon-192.png`
- `public/icons/icon-512.png`
- `public/icons/icon-maskable-512.png`
- `public/icons/apple-touch-icon.png` (180×180)

**Gap:** maskable icon — техническая версия на базе логотипа; финальная бренд-иконка с safe zone для maskable — отдельная задача.

## 5. Mobile metadata

Обновлён `src/app/layout.tsx`:

- `themeColor` light/dark
- `appleWebApp.capable`, `appleWebApp.title`
- `formatDetection.telephone: false`
- PWA icons в metadata
- `viewportFit: cover` (было ранее)

## 6. Offline fallback

**Service worker:** `public/sw.js`

- Precache: `/offline`, icons
- Navigation: network-first, fallback `/offline`
- Cache `_next/static/` и `/icons/` on demand
- **Не кэширует:** `/api/*`, `/account/*`, `/admin/*`, `/login`, `/register`, `/notifications`, `/uploads/*`, `/seller/*`, `/buyer/*`

**Страница:** `/offline` — «Нет подключения», кнопка «Повторить».

Регистрация SW: `PwaServiceWorkerRegister` в `AppProviders`.

## 7. Install prompt

**Компоненты:**

- `PwaInstallPrompt` — floating banner (mobile, после 2 page views)
- `PwaInstallCard` — карточка в `/account`

**Android:** `beforeinstallprompt` → кнопка «Установить».

**iOS:** инструкция «Поделиться → На экран Домой» (нет programmatic install).

**Dismiss:** `localStorage` key `vsetut-pwa-install-dismissed` — не спамит после закрытия.

## 8. Bottom navigation

| Tab | Route | Label |
|---|---|---|
| Главная | `/` | mobileNav.home |
| Поиск | `/listings` | mobileNav.search |
| Подать | `/listings/new` | mobileNav.post (center FAB) |
| Уведомления | `/notifications` | mobileNav.notifications (badge unread) |
| Кабинет | `/account` | mobileNav.profile |

Файлы: `MobileBottomNav.tsx`, `mobile-nav.ts`.

Active state: `/account/requests` → tab «Уведомления».

## 9. Mobile UX audit

| Route | Статус | Заметки |
|---|---|---|
| `/` | OK | overflow-x-clip, bottom nav padding |
| `/market` | OK | compact hero, horizontal chips scroll contained |
| `/listings` | OK | filters toolbar scroll, safe padding |
| `/listings/new` | OK | sticky submit at 5rem, category search, characteristics |
| `/listings/[id]` | OK | sticky CTA offset fixed to 5rem |
| `/cargo` | OK | modal form safe-area, compact hero |
| `/account` | OK | install card, quick actions grid |
| `/services`, `/opt` | OK | same vertical landing patterns |
| `/login`, `/register` | OK | overflow-x-clip |
| `/favorites` | OK | accessible via account, not in bottom nav |

**Исправлено в Phase 107:**

- Sticky CTA offset 4rem → 5rem (согласовано с root layout)
- Global horizontal scroll prevention
- Bottom nav: notifications + cabinet labels

## 10. Ограничения

- Нет полноценного offline marketplace
- SW не кэширует динамические listing pages агрессивно
- iOS install только через manual «Add to Home Screen»
- Maskable icon — техническая, не финальный бренд
- Capacitor не установлен
- Push notifications не реализованы

## 11. Что осталось для native app

См. `docs/MOBILE_APP_ROADMAP_PHASE_107.md`:

- Android wrapper (Capacitor)
- iOS wrapper
- Push notifications
- Store assets (privacy, terms, account deletion, screenshots)
- Final brand icons / splash screens

## Связанные файлы

- `src/app/manifest.ts`
- `src/app/layout.tsx`
- `public/sw.js`
- `public/icons/*`
- `src/components/pwa/*`
- `src/lib/pwa/install-prompt.ts`
- `src/components/layout/mobile/MobileBottomNav.tsx`
- `src/features/navigation/lib/mobile-nav.ts`
