# Mobile App UX Upgrade — Phase 115

> **Статус:** mobile/PWA/Android WebView UX polish.  
> **Не в scope:** Google Play publish, release AAB, push, iOS, native camera, backend features.

---

## 1. Цель

Сделать ВсеТут более **app-like** для обычного пользователя на телефоне:
- быстрый старт с главной
- понятная навигация и подача объявления
- компактный кабинет и empty states
- комфорт при вводе с клавиатуры в Android WebView

Production URL (Capacitor): `https://tutopt-production.up.railway.app`

---

## 2. Что было неудобно

| Область | Проблема |
|---|---|
| Главная mobile | Нет поиска на первом экране; только плитки разделов |
| Bottom nav | Центральная «Подать» мало заметна; nav мешала формам при клавиатуре |
| `/listings/new` | Технические названия vertical; AI-кнопка звучала как «генератор» |
| Category picker | Нет fallback «Другое» при пустом поиске |
| Account | 9 quick actions без группировки; нет профиля/сервис-ссылок |
| Empty states | Длинные тексты, разный стиль |
| Listing detail | Нет sticky «Редактировать» для своего объявления |

---

## 3. Главная (`/`)

**Изменения:**
- Компактный заголовок: **ВсеТут** + подзаголовок «Объявления, услуги, опт и карго»
- **Поиск на mobile** (`Что ищете?`) на первом экране
- **Быстрые действия 2×2:** Подать объявление, Найти товар, Найти услугу, Карго-заявка
- Блок **«Разделы»** — 4 vertical tiles
- `HomeWhyVsetutSection` + `SellerCtaSection` скрыты на mobile (меньше скролла)

Файлы: `HomepagePaperEntry.tsx`, `MobileHomeQuickActions.tsx`, `page.tsx`

---

## 4. Bottom navigation

**Изменения:**
- Центральная FAB **крупнее** (`size-[3.25rem]`, Plus icon, shadow)
- **Active state:** pill background на табах
- **Скрытие при focus input** на `/listings/new` (keyboard не перекрывается nav)
- Safe-area-bottom сохранён

Файлы: `MobileBottomNav.tsx`, `use-hide-nav-on-form-focus.ts`

---

## 5. Создание объявления (`/listings/new`)

**Изменения:**
- Vertical chooser: **Продать товар / Предложить услугу / Оптовый товар / Карго-компанию**
- Шаги: **«Шаг N из 4»** на mobile (категория → данные → описание → проверка)
- AI-кнопка: **«Составить описание»** + подсказка без упоминания OpenAI/AI generator
- Category picker: breadcrumbs, **«Выбрать Другое»** при пустом поиске

Файлы: `CreateListingVerticalChooser.tsx`, `CreateListingSteps.tsx`, `GenerateListingDescriptionButton.tsx`, `CategoryPicker.tsx`

---

## 6. Карточки объявлений

**Без изменений schema** — `ListingCard` уже compact на home, MOQ для OPT, city/category meta.

Future: characteristic chips на card (нужны данные в `ListingCardData`).

---

## 7. Detail page (`/listings/[id]`)

**Изменения:**
- Sticky bottom **«Редактировать»** для владельца объявления (mobile)
- CTA «Связаться» offset над bottom nav (existing `mobileStickyBottomOffset`)

Файл: `ListingMobileStickyCta.tsx`

---

## 8. Кабинет (`/account`)

**Изменения:**
- **Profile card:** имя, телефон, CTA «Добавить компанию»
- Quick actions: **7 основных** (без delete/legal — в сервис-блоке)
- **Service links:** Поддержка, Privacy, Terms, Удаление аккаунта
- **Onboarding hints** (dismiss → localStorage) на mobile

Файлы: `account/page.tsx`, `AccountProfileCard.tsx`, `AccountQuickActions.tsx`, `AccountServiceLinks.tsx`, `MobileOnboardingHints.tsx`

---

## 9. Empty states

Обновлены тексты (короче, одно действие):
- `/favorites`
- `/account/listings`
- `/account/requests`
- `/notifications`
- `/listings` (filtered — без изменений, уже ok)

---

## 10. Android / WebView considerations

- Bottom nav hide on form focus
- `--keyboard-inset` + `mobileStickyBottomOffset` (Phase 111)
- `env(safe-area-inset-bottom)` на nav
- Capacitor back guard без изменений

---

## 11. Что осталось

| Item | Phase |
|---|---|
| True step-by-step wizard (one section per screen) | Future |
| Listing card characteristic chips | Future (needs card data) |
| Pull-to-refresh | Future |
| Listing lead contact drawer | Phase 119 ✅ (in-app notify; push deferred) |
| Listings search & filters | Phase 120 ✅ |
| Google Play store assets + publish | Phase 115 legal was 114; Play upload separate |
| Full real device QA retest | Pending |

---

## 12. Mobile home cleanup hotfix ✅

После Phase 115 главная на 390×844 была перегружена. Hotfix:

| Проблема | Решение |
|---|---|
| Два search bar (header + hero) | На `/` mobile: search только в hero; header — logo + bell + menu |
| PWA install banner above the fold | Banner скрыт на `/`; в Capacitor/native не показывается; card остаётся в `/account` |
| Тяжёлые quick actions | 2×2 компактнее; «Подать», «Карго»; primary accent на «Подать» |
| Яркие разделы | Mobile tiles — белые карточки, меньше высота |
| «Сейчас ищут» | Desktop: полный блок; mobile: compact chips «Популярное» под разделами |

Файлы: `HeaderClient.tsx`, `HomepagePaperEntry.tsx`, `MobileHomeQuickActions.tsx`, `HomeMobileTrendingChips.tsx`, `PwaInstallPrompt.tsx`, `native-app.ts`.

---

## 13. Phase 121 — First-run onboarding ✅

Лёгкий первый опыт без блокирующих экранов:

| Surface | Что добавлено |
|---|---|
| `/` mobile | `HomeWelcomeBlock` — dismissible welcome + CTA |
| `/account` | `AccountQuickStart` — контекстные карточки быстрого старта |
| `/listings/new` | `ListingFormFirstHint` — collapsible hint для первого объявления |
| `/account/requests` | Улучшен empty state (received + noListings) |
| `/favorites`, `/notifications` | Обновлённые empty states |
| `/cargo` | `CargoQuickGuide` — компактный guide + CTA |
| `/login` | Contextual copy при `next=/listings/new` |

Storage: `vsetut_home_welcome_dismissed_v1`, `listingFormHintDismissed`.

См. `docs/FIRST_RUN_ONBOARDING_PHASE_121.md`

---

## 14. Phase 122 — Mobile gestures and swipe UX ✅

- Swipe gallery на `/listings/[id]` + fullscreen viewer
- Swipe-down dismiss для bottom drawers (lead, cargo, filters)
- `.mobile-horizontal-scroll` для chips/tabs
- Hooks: `useSwipeGesture`, `useDrawerSwipeDismiss`
- Без swipe actions на notifications/requests и без pull-to-refresh

См. `docs/MOBILE_GESTURES_PHASE_122.md`

---

## 15. Mobile home simplification hotfix ✅

Phase 121 добавил welcome card и quick actions — mobile home снова перегрузился. Hotfix:

| Убрано с mobile `/` | Оставлено |
|---|---|
| `HomeWelcomeBlock` | Title + subtitle |
| `MobileHomeQuickActions` | Один search в hero |
| `HomeMobileTrendingChips` | Разделы 2×2 (компактнее) |
| Vertical discovery blocks (popular/opt/services/cargo) | «Новые объявления» |
| — | «Подать» в bottom nav (center FAB) |

Welcome/onboarding остаётся в `/account` (`AccountQuickStart`). Desktop home без изменений по структуре.

---

## 16. Phase 123 — Mobile performance and stability ✅

- Mobile home SSR trim (`getHomePageData({ mobile })`)
- Catalog skeleton loading + card memo/lazy
- Keyboard inset rAF throttle
- Notification polling visibility backoff
- Category search debounce, draft debounce 1500ms
- Bundle: Prisma runtime removed from card price path

См. `docs/MOBILE_PERFORMANCE_STABILITY_PHASE_123.md`

---

## 17. Phase 124 — Listing cards and detail conversion ✅

- Mobile listing cards: city · category · freshness, compact layout
- Detail page mobile: clearer summary, specs, description, seller order
- Empty description hidden; `/listings/[id]` not-found page
- Lead CTA via Phase 119 drawer (unchanged)

См. `docs/LISTING_CARDS_DETAIL_PHASE_124.md`

---

## 18. Phase 126 — Seller listing management ✅

- `/account/listings`: status hints, submit/archive/restore, leads link
- Filter empty states; dashboard stat links
- `POST /api/listings/[id]/submit`

См. `docs/SELLER_LISTING_MANAGEMENT_PHASE_126.md`

---

## Связанные документы

- `docs/MOBILE_APP_ROADMAP_PHASE_107.md`
- `docs/ANDROID_MANUAL_QA_POLISH_PHASE_111.md`
- `docs/ANDROID_REAL_DEVICE_QA_PHASE_112.md`
- `docs/PWA_FOUNDATION_PHASE_107.md`
- `docs/LISTING_LEADS_CONTACT_FLOW_PHASE_119.md`
- `docs/LISTINGS_SEARCH_FILTERS_PHASE_120.md`
- `docs/FIRST_RUN_ONBOARDING_PHASE_121.md`
- `docs/MOBILE_GESTURES_PHASE_122.md`
- `docs/MOBILE_PERFORMANCE_STABILITY_PHASE_123.md`
- `docs/LISTING_CARDS_DETAIL_PHASE_124.md`
- `docs/SELLER_LISTING_MANAGEMENT_PHASE_126.md`
