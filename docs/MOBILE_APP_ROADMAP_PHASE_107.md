# Mobile App Roadmap — Phase 107

## 1. Почему сначала PWA

- Один codebase (Next.js) — без переписывания на React Native
- Быстрый путь к installable app на Android и iOS (Add to Home Screen)
- Проверка mobile UX на реальных пользователях до инвестиций в native wrapper
- Capacitor позже оборачивает тот же web app — минимальный дублирующий код

## 2. Почему не React Native сейчас

- Весь продукт уже на Next.js App Router
- Auth, uploads, AI, cargo, moderation — рабочие server routes
- React Native потребовал бы полный rewrite UI + API layer
- PWA + Capacitor даёт 80% native feel при 20% effort

## 3. Android через Capacitor

**Этап 2 — ✅ Phase 108 foundation:**

- Capacitor Android project в `android/`
- Remote production URL: `https://tutopt-production.up.railway.app`
- App id: `kg.vsetut.app`, name: ВсеТут
- Permissions: INTERNET only
- Icons/splash из Phase 107 PWA assets
- См. `docs/ANDROID_APP_WRAPPER_PHASE_108.md`

**Следующий шаг (Phase 109+):**

- Signed AAB build
- Android manual test on device
- Google Play assets + submission prep

**TWA alternative:** для Google Play review можно позже рассмотреть Trusted Web Activity + Digital Asset Links, если Capacitor wrapper вызовет вопросы.

**Рекомендуемые параметры (historical):**

| Параметр | Значение |
|---|---|
| app id | `kg.vsetut.app` (уточнить домен) |
| app name | ВсеТут |
| web dir | `out` или `.next` static export — решить при интеграции |

**Требования:**

- Icons 512×512, adaptive icon foreground/background
- Splash screen (1080×1920 minimum)
- `android:usesCleartextTraffic` — только если нужен dev
- Deep links для `/listings/[id]`, `/account`

## 4. iOS позже

**Этап 4:**

```text
npx cap add ios
```

- Apple Developer account ($99/year)
- App Store Connect listing
- Privacy manifest (PrivacyInfo.xcprivacy)
- Push capability через APNs + Capacitor Push plugin

## 5. Store requirements

### Google Play

- Privacy Policy URL (публичная страница)
- Terms of Service
- Account deletion mechanism (уже частично через support — нужен self-service flow)
- Data safety form
- App screenshots (phone + tablet)
- Feature graphic 1024×500
- Minimum functionality: **не пустая webview** — нужны объявления, создание, кабинет, карго

### App Store

- Privacy Policy + Terms
- Account deletion (Guideline 5.1.1)
- App Privacy labels
- Screenshots 6.7", 6.5", 5.5"
- Review notes: описать core features
- **Риск отклонения:** thin wrapper без native value

### Минимальный функционал для approval

- [x] Просмотр объявлений
- [x] Создание объявления + фото upload
- [x] Избранное
- [x] Кабинет / account
- [x] Карго-заявки
- [x] Push notifications (Android foundation — Phase 117)
- [x] Account deletion request flow (Phase 114 — manual processing)
- [x] Privacy Policy page (Phase 114 — draft, needs legal review)
- [x] Terms of Service page (Phase 114 — draft, needs legal review)

## 6. Push notifications — Phase 117 ✅ foundation

- Capacitor `@capacitor/push-notifications`
- Backend: Firebase Cloud Messaging (Android only)
- Связано с `/notifications` и in-app events
- Opt-in UX в `/account`, permission по действию пользователя
- См. `docs/ANDROID_PUSH_NOTIFICATIONS_PHASE_117.md`

## 6.1 Phase 119 — Listing leads/contact flow without native push ✅

- CTA «Связаться» + bottom drawer на `/listings/[id]`
- Duplicate guard 24h, success/duplicate feedback
- Seller in-app `NEW_LEAD` → `/account/requests` (**без push**)
- Статусы NEW / VIEWED / CLOSED, seller actions
- См. `docs/LISTING_LEADS_CONTACT_FLOW_PHASE_119.md`

## 6.2 Phase 120 — Listings search and filters ✅

- Unified search params + slug resolution
- Equipment keyword aliases, subtree category filter
- Mobile filter drawer + chips, listing card highlights
- `/market` catalog shortcuts → `/listings`
- См. `docs/LISTINGS_SEARCH_FILTERS_PHASE_120.md`

## 6.3 Phase 121 — First-run onboarding ✅

- Welcome block на mobile home (dismissible)
- Быстрый старт в `/account` с контекстом listings/company
- Hint первого объявления на `/listings/new`
- Empty states: requests, favorites, notifications
- Cargo quick guide
- Auth prompt при posting flow
- См. `docs/FIRST_RUN_ONBOARDING_PHASE_121.md`

## 6.4 Phase 122 — Mobile gestures and swipe UX ✅

- Swipe gallery + fullscreen на `/listings/[id]`
- Swipe-down bottom sheets (lead, cargo, filters)
- Horizontal scroll utility для chips
- Без PTR / destructive swipe actions
- См. `docs/MOBILE_GESTURES_PHASE_122.md`

## 6.5 Phase 123 — Mobile performance and stability ✅

- Faster mobile home SSR (trimmed queries)
- Listings skeleton + transition loading
- Memo/lazy cards, debounced category search
- Visibility-aware notification polling
- См. `docs/MOBILE_PERFORMANCE_STABILITY_PHASE_123.md`

## 6.6 Phase 124 — Listing cards and detail conversion ✅

- Mobile card polish: price, meta, chips, compact height
- Detail page mobile layout: summary → specs → description → seller
- Listing-specific 404, empty description hidden
- Sticky CTA unchanged (Phase 119)
- См. `docs/LISTING_CARDS_DETAIL_PHASE_124.md`

## 7. Privacy / terms / account deletion

Нужно подготовить до store submission:

| Asset | Статус |
|---|---|
| Privacy Policy | ⚠️ `/privacy` — draft, legal review pending |
| Terms of Service | ⚠️ `/terms` — draft, legal review pending |
| Account deletion | ✅ request-based `/account/delete`, public `/delete-account` |
| Support contact | ⚠️ `/support` — placeholder email |
| Cookie/tracking disclosure | TODO — если analytics расширятся |

## 8. Риски отклонения в App Store / Google Play

1. **Thin wrapper** — приложение только открывает сайт без offline value → отклонение
2. **Missing account deletion** — Apple 5.1.1
3. **Missing privacy policy** — оба store
4. **Broken login on launch** — тестировать auth flow в wrapper
5. **Upload/camera permissions** — объяснить в Info.plist / Android manifest
6. **UGC moderation** — описать moderation flow в review notes

## 9. Next phases

| Phase | Scope |
|---|---|
| 107 ✅ | PWA manifest, icons, metadata, offline, install prompt, mobile polish |
| 108 ✅ | Capacitor Android wrapper, production URL, icons/splash, docs |
| 109 ✅ | Debug APK build scripts, install docs, manual test checklist |
| 110 ✅ | Listing form stability: characteristics merge, draft autosave, AI guard |
| 111 ✅ | Android manual QA polish: keyboard inset, back button, sticky CTA, form guard |
| 112 ✅ | Real Android device QA prep: photo MIME fix, native Back guard; device retest pending |
| 113 ✅ | Release AAB prep: signing docs, `android:release` script, Play blockers checklist |
| 114 ✅ | Legal pages (draft), account deletion request, support, data safety notes |
| 115 ✅ | Mobile app UX upgrade: home, nav, listing flow, account, empty states |
| 116 ✅ | In-app notifications, activity block, status labels, badges |
| 117 ✅ | Android push foundation (FCM, token APIs, account opt-in) |
| 118 ✅ | Listing moderation notifications (submitted/approved/rejected) |
| 119 ✅ | Listing leads & contact flow (drawer, in-app notify, seller actions; push deferred) |
| 120 ✅ | Listings search & filters (aliases, subcategory, mobile drawer, card chips) |
| 121 ✅ | First-run onboarding (welcome, quick start, hints, empty states) |
| 122 ✅ | Mobile gestures (swipe gallery, drawer dismiss, horizontal scroll) |
| 123 ✅ | Mobile performance and stability (home trim, skeletons, polling) |
| 124 ✅ | Listing cards and detail page conversion |
| 125 | Store assets + Play Console internal testing upload |
| 126 | Production rollout (after QA + legal sign-off) |
| 127 | Capacitor iOS wrapper |

## Технические заметки для Capacitor

**Permissions (когда понадобятся):**

- Camera / Photo Library — для upload фото объявлений
- Notifications — push
- Network — default

**Не запрашивать заранее:**

- Location (если не добавляем geo search)
- Contacts
- Microphone

**Icons / splash:**

- Использовать `public/icons/icon-512.png` как базу
- Splash: белый фон + центрированный логотип (не серый складской фон)
- iOS: apple-touch-icon 180×180 уже есть

**Build note:**

Next.js App Router с SSR потребует либо:
- static export для Capacitor webDir, либо
- live URL loading (`server.url` в capacitor.config) для MVP wrapper

Рекомендация для MVP wrapper: **live URL** (`https://vsetut.kg`) — быстрее, но offline ограничен SW.

## Связанные документы

- `docs/ANDROID_REAL_DEVICE_QA_PHASE_112.md`
- `docs/ANDROID_RELEASE_AAB_PHASE_113.md`
- `docs/GOOGLE_PLAY_DATA_SAFETY_NOTES_PHASE_114.md`
- `docs/MOBILE_APP_UX_UPGRADE_PHASE_115.md`
- `docs/APP_NOTIFICATIONS_ACTIVITY_PHASE_116.md`
- `docs/ANDROID_PUSH_NOTIFICATIONS_PHASE_117.md`
- `docs/FIREBASE_PUSH_SETUP_PHASE_117.md`
- `docs/LISTING_MODERATION_NOTIFICATIONS_PHASE_118.md`
- `docs/LISTING_LEADS_CONTACT_FLOW_PHASE_119.md`
- `docs/LISTINGS_SEARCH_FILTERS_PHASE_120.md`
- `docs/FIRST_RUN_ONBOARDING_PHASE_121.md`
- `docs/MOBILE_GESTURES_PHASE_122.md`
- `docs/MOBILE_PERFORMANCE_STABILITY_PHASE_123.md`
- `docs/LISTING_CARDS_DETAIL_PHASE_124.md`
- `docs/UX_PRODUCT_AUDIT_PHASE_87.md`
- `docs/MOBILE_NAV_PHASE_64.md`
