# Android Release AAB — Phase 113

## 1. Цель

Подготовить **release AAB** для Android-приложения **ВсеТут** (`kg.vsetut.app`) без публикации в Google Play.

Эта фаза даёт:
- release signing strategy (без секретов в git)
- скрипт локальной сборки signed AAB
- документацию по keystore
- checklist blockers перед Play Console

**Не в scope (Phase 113):** Google Play upload, iOS, native camera.

**Phase 117:** Android push foundation added — FCM requires `google-services.json` locally and `FIREBASE_*` on server for delivery. AAB builds without `google-services.json` still succeed; push disabled until configured.

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
| Privacy Policy final text | ⚠️ draft expanded Phase 114 — legal review |
| Terms final text | ⚠️ draft expanded Phase 114 — legal review |
| Account deletion self-service | ✅ request-based MVP (Phase 114) |
| Real Android device QA pass | ⏳ pending |
| Store screenshots / descriptions | ⏳ not prepared |
| Google Play test account | ⏳ not prepared |
| Data safety form in Console | ⏳ notes only — see Phase 114 doc |

См. `docs/GOOGLE_PLAY_RELEASE_BLOCKERS_PHASE_113.md`

---

## 15. Phase 114 (completed)

- Legal pages expanded (draft): `/privacy`, `/terms`
- Support: `/support`
- Account deletion: `/delete-account`, `/account/delete`, API request flow
- Data safety notes: `docs/GOOGLE_PLAY_DATA_SAFETY_NOTES_PHASE_114.md`
- Blockers doc updated

**Phase 115 (next):**
- Lawyer review for Privacy + Terms
- Store listing assets (screenshots, 1024 icon, descriptions)
- Play Console app creation + internal testing track
- Upload signed AAB to **internal testing** (not production)

---

## 16. Phase 125 — UGC safety (Play review)

Before Play submission, document UGC moderation in review notes:

- Listing reports on detail page (`/listings/[id]`)
- Admin report queue `/admin/reports`
- Manual hide → author notification
- Prohibited content in `/terms` §4 (draft)

See `docs/USER_GENERATED_CONTENT_SAFETY_PHASE_125.md` and `docs/TRUST_SAFETY_REPORTS_PHASE_125.md`.

---

## 17. Phase 130 — Mobile QA Freeze

Before building release AAB for testers, run mobile QA freeze checklist: `docs/MOBILE_QA_FREEZE_PHASE_130.md`.

Focus: home/account/cargo mobile layout, no duplicate CTAs, legal drafts still require review before Play upload.

---

## 18. Phase 131 — Store readiness pack ✅

- Legal pages polished (`/privacy`, `/terms`, `/support`, deletion)
- Store listing texts, screenshots checklist, data safety notes
- Test account doc (placeholders only)
- iOS/TestFlight prep plan (no iOS project)

См. `docs/STORE_READINESS_PACK_PHASE_131.md`

---

## 19. Before signed AAB upload

| Ready | Item |
|---|---|
| ✅ | Mobile QA freeze (Phase 130) |
| ✅ | Store listing texts draft |
| ✅ | Account deletion public URL |
| ⚠️ | Legal review privacy + terms |
| ⚠️ | Support email confirmed |
| ❌ | Screenshots captured |
| ❌ | Test account in Play Console |
| ❌ | Local keystore + signed AAB |
| ❌ | Real device QA retest |

**AAB output path:** `android/app/build/outputs/bundle/release/app-release.aab`

**Never commit:** keystore, `key.properties` with secrets, passwords, API keys, real review credentials.

---

## 20. Phase 132 — Android Release Candidate ✅

| Item | Status |
|---|---|
| App id `kg.vsetut.app` | ✅ |
| App name ВсеТут | ✅ |
| version 1.0.0 / code 1 | ✅ |
| Production URL in Capacitor | ✅ |
| Permissions INTERNET only | ✅ POST_NOTIFICATIONS removed |
| Debug APK build | ✅ |
| Release AAB | ⏳ needs local keystore |
| Store URLs documented | ✅ |

See `docs/ANDROID_RELEASE_CANDIDATE_PHASE_132.md` and `docs/ANDROID_RELEASE_NOTES_PHASE_132.md`.

**Next:** Phase 133 — signed AAB + real device release test.

---

## 21. Phase 133 — Signed AAB + real device release test ✅ (prep)

| Item | Status |
|---|---|
| Signing setup verified | ✅ debug without keystore; release uses local `key.properties` |
| Keystore local setup doc | ✅ `ANDROID_KEYSTORE_LOCAL_SETUP_PHASE_133.md` |
| Real device release checklist | ✅ `ANDROID_REAL_DEVICE_RELEASE_TEST_PHASE_133.md` |
| `.gitignore` `*.p12` | ✅ |
| Production routes re-check | ✅ 200/307 |
| Debug APK build | ✅ Phase 133 |
| Signed AAB | ⏳ not built — local keystore missing |
| Real device QA executed | ⏳ pending manual test |

**Next:** owner keystore → signed AAB → Play internal testing → complete device checklist.

---

## Связанные документы

- `docs/ANDROID_APP_WRAPPER_PHASE_108.md`
- `docs/ANDROID_APK_TEST_INSTALL_PHASE_109.md`
- `docs/ANDROID_KEYSTORE_LOCAL_SETUP_PHASE_133.md`
- `docs/ANDROID_REAL_DEVICE_RELEASE_TEST_PHASE_133.md`
- `docs/ANDROID_REAL_DEVICE_QA_PHASE_112.md`
- `docs/ACCOUNT_DELETION_PHASE_114.md`
- `docs/GOOGLE_PLAY_DATA_SAFETY_NOTES_PHASE_114.md`
- `docs/GOOGLE_PLAY_READINESS_CHECKLIST_PHASE_108.md`
- `docs/TRUST_SAFETY_REPORTS_PHASE_125.md`
- `docs/MOBILE_QA_FREEZE_PHASE_130.md`
- `docs/STORE_READINESS_PACK_PHASE_131.md`
