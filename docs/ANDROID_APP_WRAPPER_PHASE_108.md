# Android App Wrapper — Phase 108

## 1. Цель

Подготовить Android-приложение **ВсеТут** на базе существующего production web app без React Native и без локального запуска Next.js на устройстве. Приложение открывает production URL в native WebView через Capacitor.

## 2. Почему не React Native сейчас

- Весь продукт — Next.js App Router + server routes (auth, uploads, AI, cargo, Prisma)
- React Native потребовал бы полный rewrite UI и API-слоя
- Capacitor wrapper даёт быстрый путь к APK/AAB с тем же production backend
- PWA foundation (Phase 107) уже обеспечивает mobile UX, icons, offline fallback

## 3. Выбранный подход: Capacitor (remote URL)

### Рассмотренные варианты

| | Capacitor | TWA (Trusted Web Activity) |
|---|---|---|
| Push / camera / native plugins позже | ✅ проще | ❌ ограничено |
| Remote production URL | ✅ `server.url` | ✅ Digital Asset Links |
| Dev/debug foundation | ✅ Android Studio + cap sync | assetlinks.json, Chrome deps |
| Google Play thin-wrapper risk | ⚠️ есть | ✅ лучше для «чистой» PWA |

**Выбран Capacitor** для Phase 108:

- Быстрее поднять dev foundation и APK pipeline
- Единая структура для будущих native plugins (push, share, camera)
- Не требует Digital Asset Links на этом этапе
- TWA можно рассмотреть позже для Google Play, если review попросит «более PWA-native» delivery

## 4. Production URL

```
https://tutopt-production.up.railway.app
```

- **Не** localhost
- **Не** internal Railway URL
- Настроено в `capacitor.config.ts` → `server.url`

`allowNavigation` ограничивает in-app navigation доменом Railway production.

## 5. App name

**ВсеТут** — `android/app/src/main/res/values/strings.xml`

## 6. App id

**kg.vsetut.app**

- `applicationId` в `android/app/build.gradle`
- `appId` в `capacitor.config.ts`
- Package: `kg.vsetut.app.MainActivity`

## 7. Permissions

Только необходимые:

| Permission | Зачем |
|---|---|
| `INTERNET` | загрузка web app |

**Не добавлены:** CAMERA, LOCATION, CONTACTS, MICROPHONE, STORAGE.

- Photo upload работает через `<input type="file">` + WebView file chooser (не требует CAMERA permission)
- FileProvider уже есть для Capacitor file handling

## 8. Icons / splash

Источник: `public/icons/icon-512.png` (Phase 107, без нового дизайна).

| Asset | Расположение |
|---|---|
| Launcher icons | `android/app/src/main/res/mipmap-*/ic_launcher*.png` |
| Adaptive foreground | `mipmap-*/ic_launcher_foreground.png` |
| Adaptive background | white `#FFFFFF` |
| Splash | `drawable*/splash.png` |

**Gap:** для Google Play нужна финальная иконка **1024×1024** (store listing), текущая — рабочая техническая версия.

## 9. Auth considerations

- Login/register — web-based forms на production URL
- Session cookies работают в WebView same-origin
- **Google OAuth risk:** Google может блокировать OAuth в embedded WebView → использовать Custom Tabs / Browser plugin позже
- Redirect URLs должны включать production domain
- **Manual test required:** login, register, logout, session persistence

## 10. Upload considerations

- Listing photo upload через existing `/api/uploads/listing-images`
- WebView file picker (Capacitor `captureInput: true`)
- **Manual test required:** upload на `/listings/new` в Android emulator/device

## 11. Known risks

1. **Thin wrapper policy** — Google Play может отклонить app без достаточной native value → см. checklist
2. **Google OAuth in WebView** — может не работать → fallback: email/password или Browser plugin
3. **Service worker in WebView** — production SW кэширует static; private API не кэшируется (Phase 107)
4. **Offline** — `/offline` fallback работает через production SW, не через local shell
5. **External links** — ссылки вне production domain открываются системным browser (Capacitor default)
6. **Back button** — Capacitor BridgeActivity: history back → exit app

## 12. Как получить APK / AAB

### Prerequisites

- Android Studio + Android SDK
- JDK 17+

### Dev workflow

1. `npm run cap:sync` — синхронизировать config и web assets
2. `npm run cap:open` — открыть проект в Android Studio
3. Build → Build Bundle(s) / APK(s)

### CLI (если SDK настроен)

```text
cd android
./gradlew assembleDebug      # debug APK
./gradlew bundleRelease      # release AAB (нужен signing key)
```

Release signing: создать keystore, настроить `android/app/build.gradle` signingConfigs (не в этой фазе).

## 13. Что нужно для Google Play

См. `docs/GOOGLE_PLAY_READINESS_CHECKLIST_PHASE_108.md`.

Кратко:

- Privacy Policy URL
- Terms URL
- Account deletion flow
- Store screenshots + 1024 icon
- Data safety form
- Content moderation explanation (UGC listings)

## Структура проекта

```text
capacitor.config.ts          # Capacitor config + production URL
mobile-shell/index.html      # minimal placeholder (cap sync requirement)
android/                     # native Android project
  app/src/main/
    AndroidManifest.xml
    java/kg/vsetut/app/MainActivity.java
    res/mipmap-*/            # launcher icons
    res/drawable*/           # splash
package.json                 # cap:sync, cap:open scripts
```

## NPM scripts

| Script | Действие |
|---|---|
| `npm run cap:sync` | cap sync android |
| `npm run cap:open` | open Android Studio |
| `npm run cap:copy` | cap copy android |

## Web routes — logical check

| Route | Expected in wrapper |
|---|---|
| `/` | ✅ home, bottom nav |
| `/market` | ✅ catalog |
| `/listings` | ✅ search tab active |
| `/listings/new` | ✅ create flow, sticky submit |
| `/listings/[id]` | ✅ detail + sticky CTA |
| `/account` | ✅ cabinet |
| `/cargo` | ✅ cargo landing + modal |
| `/login`, `/register` | ✅ auth forms |

**Android runtime manual test required** для: login, upload, AI button, Google OAuth, back button на modals.

## Связанные документы

- `docs/PWA_FOUNDATION_PHASE_107.md`
- `docs/MOBILE_APP_ROADMAP_PHASE_107.md`
- `docs/GOOGLE_PLAY_READINESS_CHECKLIST_PHASE_108.md`
