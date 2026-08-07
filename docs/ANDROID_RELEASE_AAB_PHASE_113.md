# Android Release AAB — Phase 113

## 1. Цель

Подготовить **release AAB** для Android-приложения **ВсеТут** (`kg.vsetut.app`) без публикации в Google Play.

Эта фаза даёт:
- release signing strategy (без секретов в git)
- скрипт локальной сборки signed AAB
- документацию по keystore
- checklist blockers перед Play Console

**Не в scope:** Google Play upload, push notifications, iOS, native camera.

---

## 2. Что такое release AAB

**AAB (Android App Bundle)** — формат публикации в Google Play. Play Console генерирует оптимизированные APK для устройств пользователей.

Для локальной проверки можно также собрать debug APK (Phase 109), но для store submission нужен **signed release AAB**.

---

## 3. Почему это не Google Play publish

Phase 113 **только готовит** артефакт и процесс signing.

**Не делается:**
- загрузка в Play Console
- создание store listing
- review submission
- rollout

---

## 4. App id

```
kg.vsetut.app
```

- `capacitor.config.ts` → `appId`
- `android/app/build.gradle` → `applicationId`
- Package: `kg.vsetut.app.MainActivity`

---

## 5. App name

**ВсеТут**

- `capacitor.config.ts` → `appName`
- `android/app/src/main/res/values/strings.xml`

---

## 6. Production URL

```
https://tutopt-production.up.railway.app
```

Capacitor remote URL — приложение загружает production web app в WebView.

---

## 7. Version name / code

| Field | Value | File |
|---|---|---|
| versionName | `1.0.0` | `android/app/build.gradle` |
| versionCode | `1` | `android/app/build.gradle` |

Перед каждым новым upload в Play Console увеличивайте **versionCode** (integer, always increment).

---

## 8. Signing / keystore

Release AAB для Google Play **должен быть подписан release keystore**.

### Локальная настройка (one-time)

1. Создайте keystore **локально** (пароли не коммитить):

   ```text
   keytool -genkeypair -v \
     -keystore android/keystore/vsetut-release.jks \
     -alias vsetut \
     -keyalg RSA -keysize 2048 -validity 10000 \
     -storetype JKS
   ```

2. Скопируйте template:

   ```text
   cp android/key.properties.example android/key.properties
   ```

3. Заполните `android/key.properties`:

   ```properties
   storeFile=../keystore/vsetut-release.jks
   storePassword=<your-store-password>
   keyAlias=vsetut
   keyPassword=<your-key-password>
   ```

4. Gradle автоматически подключит signing при сборке release (см. `android/app/build.gradle`).

### Без keystore

Скрипт `android:release` завершится с понятным сообщением.  
Gradle может собрать **unsigned** AAB (`bundleRelease`), но Google Play **не примет** unsigned bundle.

---

## 9. Где хранить keystore

| Asset | Location | Git |
|---|---|---|
| Release keystore | `android/keystore/vsetut-release.jks` (local) | ❌ never |
| Signing config | `android/key.properties` (local) | ❌ never |
| Template | `android/key.properties.example` | ✅ committed |

**Backup:** сохраните keystore и пароли в password manager / secure vault. Потеря keystore = невозможность обновлять приложение в Play Store.

---

## 10. Что нельзя коммитить

- `*.jks`, `*.keystore`
- `android/key.properties`
- `signing.properties`, `release-signing.properties`
- пароли, alias secrets
- `android/app/build/` outputs
- `*.aab`, `*.apk` build artifacts

`.gitignore` (root + `android/.gitignore`) настроен для этих файлов.

---

## 11. Как собрать release AAB локально

**Prerequisites:** JDK 17+, Android SDK — см. `docs/ANDROID_APK_TEST_INSTALL_PHASE_109.md`

**Steps:**

1. Настройте keystore (§8)
2. Проверьте prerequisites: `npm run android:check`
3. Соберите signed AAB: `npm run android:release`

Скрипт:
- проверяет JDK/SDK/Capacitor
- требует `android/key.properties`
- запускает `cap sync` + `gradlew bundleRelease`
- **не** создаёт keystore автоматически
- **не** печатает пароли

---

## 12. Где будет лежать AAB

```
android/app/build/outputs/bundle/release/app-release.aab
```

Typical size: ~3–5 MB (remote URL wrapper, minimal native code).

**Не коммитить** AAB в git.

---

## 13. Как проверить AAB перед загрузкой

1. **Signature check:**

   ```text
   jarsigner -verify -verbose android/app/build/outputs/bundle/release/app-release.aab
   ```

   Должно показать verified signature (не `jar is unsigned`).

2. **Local install test** (optional):

   ```text
   bundletool build-apks --bundle=app-release.aab --output=app.apks --mode=universal
   bundletool install-apks --apks=app.apks
   ```

3. **Smoke test on device:**
   - launch → production URL loads
   - login, listing form, photo upload, cargo
   - см. `docs/ANDROID_MANUAL_TEST_CHECKLIST_PHASE_109.md`

4. **Version check:** `versionCode` / `versionName` в Play Console должны совпадать с `build.gradle`.

---

## 14. Known blockers

| Blocker | Status |
|---|---|
| Signed release keystore (local) | ⏳ owner must create |
| Privacy Policy final text | ⏳ draft page exists |
| Terms final text | ⏳ draft page exists |
| Account deletion self-service | ❌ not implemented |
| Real Android device QA pass | ⏳ pending |
| Store screenshots / descriptions | ⏳ not prepared |
| Google Play test account | ⏳ not prepared |

См. `docs/GOOGLE_PLAY_RELEASE_BLOCKERS_PHASE_113.md`

---

## 15. Next phase: Google Play Console preparation

**Phase 114 (proposed):**
- Final legal pages (Privacy, Terms) with lawyer review
- Account deletion flow (`/account/delete` or self-service)
- Support contact page
- Store listing assets (screenshots, 1024 icon, descriptions)
- Play Console app creation + internal testing track
- Upload signed AAB to **internal testing** (not production)

---

## Связанные документы

- `docs/ANDROID_APP_WRAPPER_PHASE_108.md`
- `docs/ANDROID_APK_TEST_INSTALL_PHASE_109.md`
- `docs/ANDROID_REAL_DEVICE_QA_PHASE_112.md`
- `docs/GOOGLE_PLAY_RELEASE_BLOCKERS_PHASE_113.md`
- `docs/GOOGLE_PLAY_READINESS_CHECKLIST_PHASE_108.md`
