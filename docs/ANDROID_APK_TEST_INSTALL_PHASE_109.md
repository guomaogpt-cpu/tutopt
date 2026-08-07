# Android Debug APK — Test Install (Phase 109)

## 1. Что это за APK

**ВсеТут** debug APK — тестовая сборка Android-приложения, которое открывает production web app:

`https://tutopt-production.up.railway.app`

Приложение не содержит backend, базу данных и секреты. Это Capacitor WebView wrapper вокруг уже работающего сайта.

## 2. Это debug APK, не Google Play release

| | Debug APK | Release AAB |
|---|---|---|
| Назначение | тест на своём телефоне | Google Play |
| Подпись | debug keystore (auto) | production keystore |
| Публикация | ❌ не для store | ✅ store submission |
| Безопасность | только для dev/test | production signing |

**Не распространять debug APK как production release.**

## 3. Что нужно для сборки (локально)

На Mac нужны:

1. **JDK 17+**
   - Проще всего: установить [Android Studio](https://developer.android.com/studio) (включает JBR)
   - Альтернатива: `brew install openjdk@17`

2. **Android SDK**
   - Устанавливается вместе с Android Studio
   - Путь по умолчанию: `~/Library/Android/sdk`
   - Нужны: Platform SDK 36, Build-Tools, platform-tools

3. **Переменные окружения** (добавить в `~/.zshrc` если Android Studio уже установлена):

   ```text
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export ANDROID_SDK_ROOT=$ANDROID_HOME
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

   Если JDK не находится автоматически:

   ```text
   export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
   ```

4. **Проверка готовности:**

   ```text
   bash scripts/check-android-prerequisites.sh
   ```

5. **Сборка debug APK:**

   ```text
   bash scripts/build-android-debug.sh
   ```

   Или через npm:

   ```text
   npm run android:debug
   ```

### Ожидаемый артефакт

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

### Если сборка не проходит

| Симптом | Решение |
|---|---|
| `Unable to locate Java Runtime` | Установить JDK 17 / Android Studio |
| `SDK location not found` | Задать `ANDROID_HOME` |
| Gradle sync failed | Открыть `android/` в Android Studio → Sync |
| Capacitor plugin error | `npm run cap:sync` |
| compileSdk mismatch | Android Studio → SDK Manager → Platform 36 |

## 4. Как установить на Android

### Вариант A: через USB (adb)

1. На телефоне: **Настройки → Для разработчиков → Отладка по USB** (включить)
2. Подключить телефон к Mac
3. Скопировать APK на телефон или установить через adb:

   ```text
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Вариант B: через файл

1. Скопировать `app-debug.apk` на телефон (AirDrop, Telegram, Google Drive, USB)
2. Открыть файл на телефоне
3. Подтвердить установку

## 5. Как разрешить установку из неизвестных источников

Зависит от версии Android:

- **Android 8+:** система спросит разрешение для конкретного приложения (Files, Chrome, Telegram) при первой установке APK
- **Старые версии:** **Настройки → Безопасность → Неизвестные источники**

Рекомендация: после установки отключить «неизвестные источники» для приложения-установщика.

## 6. Что проверить после установки

1. Иконка **ВсеТут** появилась на главном экране
2. Приложение открывается, показывает splash, затем главную
3. Работает интернет (Wi‑Fi или мобильные данные)
4. Bottom nav: Главная, Поиск, Подать, Уведомления, Кабинет
5. Можно открыть `/listings/new` и `/account`
6. Login/register открываются
7. Back button возвращает назад по истории

Полный чеклист: `docs/ANDROID_MANUAL_TEST_CHECKLIST_PHASE_109.md`

## 7. Как удалить приложение

**Настройки → Приложения → ВсеТут → Удалить**

Или долгое нажатие на иконку → Удалить.

## 8. Known issues

| Issue | Статус |
|---|---|
| Google OAuth может не работать в WebView | Использовать email/password login для теста |
| Offline — только `/offline` fallback, не полный offline marketplace | Expected (Phase 107) |
| Service worker кэширует только static assets | Private API не кэшируется |
| Pull-to-refresh может перезагрузить форму | Проверить на `/listings/new` |
| Maskable icon — техническая, не финальная store icon | Phase 108 gap |

## 9. Что нужно для release build (позже)

- Production keystore (`.jks`) — **не создавать в Phase 109**
- `./gradlew bundleRelease` → AAB
- Privacy Policy + Terms URLs
- Account deletion flow
- Google Play assets (icon 1024, screenshots, descriptions)
- Data safety form
- Manual test checklist passed

## Связанные документы

- `docs/ANDROID_APP_WRAPPER_PHASE_108.md`
- `docs/ANDROID_MANUAL_TEST_CHECKLIST_PHASE_109.md`
- `docs/GOOGLE_PLAY_READINESS_CHECKLIST_PHASE_108.md`
- `docs/MOBILE_APP_ROADMAP_PHASE_107.md`

## Phase 109 status

| Item | Status |
|---|---|
| Capacitor config verified | ✅ |
| Cap sync | ✅ |
| Build scripts added | ✅ |
| Debug APK built in CI/agent env | ❌ JDK + Android SDK not available |
| Install on phone | ⏳ manual step after local build |
