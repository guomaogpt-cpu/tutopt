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
- [ ] Push notifications (later)
- [ ] Account deletion self-service (later)
- [ ] Privacy Policy page (later)
- [ ] Terms of Service page (later)

## 6. Push notifications later

**Этап 3:**

- Capacitor `@capacitor/push-notifications`
- Backend: Firebase Cloud Messaging (Android) + APNs (iOS)
- Связать с существующим `/notifications` и unread count
- Opt-in UX, не запрашивать permission при первом входе

## 7. Privacy / terms / account deletion

Нужно подготовить до store submission:

| Asset | Статус |
|---|---|
| Privacy Policy | TODO — `/privacy` |
| Terms of Service | TODO — `/terms` |
| Account deletion | TODO — self-service в `/account/settings` |
| Support contact | TODO — email/форма |
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
| 110 | Install APK on phone + pass manual checklist |
| 111 | Release AAB + production signing |
| 112 | Privacy Policy + Terms review/update |
| 113 | Account deletion self-service |
| 114 | Push notifications + Google Play submission |
| 115 | Capacitor iOS wrapper |

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

- `docs/PWA_FOUNDATION_PHASE_107.md`
- `docs/UX_PRODUCT_AUDIT_PHASE_87.md`
- `docs/MOBILE_NAV_PHASE_64.md`
