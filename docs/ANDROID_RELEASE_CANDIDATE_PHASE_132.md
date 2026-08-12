# Android Release Candidate — Phase 132

## 1. Цель

Подготовить Android release candidate (RC) для публикации в Google Play **без фактической публикации**.

---

## 2. Android config

| Parameter | Value | Status |
|---|---|---|
| Package / app id | `kg.vsetut.app` | ✅ |
| App name | ВсеТут | ✅ |
| versionName | `1.0.0` | ✅ |
| versionCode | `1` | ✅ |
| minSdk | 24 | ✅ |
| targetSdk | 36 | ✅ |
| compileSdk | 36 | ✅ |

Sources: `capacitor.config.ts`, `android/app/build.gradle`, `android/variables.gradle`, `strings.xml`

---

## 3. App identity

- **Capacitor `appId`:** `kg.vsetut.app`
- **Display name:** ВсеТут (`@string/app_name`, `capacitor.config.ts`)
- **No Tutopt/TutMarket** in Android strings
- **Launcher:** `@mipmap/ic_launcher` + adaptive icon (`mipmap-anydpi-v26`)

---

## 4. Permissions

| Permission | RC status |
|---|---|
| `INTERNET` | ✅ required |
| `POST_NOTIFICATIONS` | ❌ removed Phase 132 (push deferred) |
| Camera / storage / location / contacts / mic | ❌ not declared |

File: `android/app/src/main/AndroidManifest.xml`

---

## 5. Production URL

| Setting | Value |
|---|---|
| Capacitor server URL | `https://tutopt-production.up.railway.app` |
| cleartext | `false` |
| androidScheme | `https` |

**Route check (HTTP):**

| Route | Status |
|---|---|
| `/` | 200 |
| `/market` | 200 |
| `/listings` | 200 |
| `/listings/new` | 200 |
| `/account` | 307 → login (expected) |
| `/privacy` | 200 |
| `/terms` | 200 |
| `/support` | 200 |
| `/delete-account` | 200 |

No localhost in release config.

---

## 6. Build process

| Step | Command (internal) | Output |
|---|---|---|
| Prerequisites | `npm run android:check` | JDK, SDK, android/ |
| Debug APK | `npm run android:debug` | `android/app/build/outputs/apk/debug/app-debug.apk` |
| Release AAB | `npm run android:release` | `android/app/build/outputs/bundle/release/app-release.aab` |

Release AAB requires local `android/key.properties` + keystore (not in git).

**Phase 132 build result:**
- Debug APK: **ok** (Gradle assembleDebug)
- Release AAB: **not tested** — requires local signing keystore

---

## 7. Signing safety

| Item | Status |
|---|---|
| `*.jks` / `*.keystore` in `.gitignore` | ✅ |
| `android/key.properties` in `.gitignore` | ✅ |
| `android/key.properties.example` | ✅ committed (placeholders) |
| `google-services.json` ignored | ✅ |
| Debug build without secrets | ✅ |
| Release requires local keystore | ✅ expected |

**Never commit:** keystore, passwords, API keys, review credentials.

---

## 8. Icons / splash

| Asset | Status |
|---|---|
| Adaptive icon (API 26+) | ✅ `ic_launcher.xml` + foreground mipmaps |
| Splash | ✅ `drawable/splash.png` + Capacitor SplashScreen plugin |
| Splash background | `#ffffff` |
| Branding | ВсеТут (no legacy TutMarket in Android res) |

Existing assets only — no new images generated in Phase 132.

---

## 9. Store URLs (production)

Use in Google Play Console:

| Field | URL |
|---|---|
| Privacy Policy | https://tutopt-production.up.railway.app/privacy |
| Terms | https://tutopt-production.up.railway.app/terms |
| Support | https://tutopt-production.up.railway.app/support |
| Account deletion | https://tutopt-production.up.railway.app/delete-account |
| Website | https://tutopt-production.up.railway.app |

Legal content still requires lawyer review before public store listing.

---

## 10. Test account

See `docs/STORE_REVIEW_TEST_ACCOUNT_PHASE_131.md`.

```
Login: TO_BE_FILLED
Password: TO_BE_FILLED
Notes: TO_BE_FILLED
```

**Before Google Play submission:** project owner creates test account manually and enters credentials **only in Google Play Console → App access**, not in the repository.

---

## 11. Release notes

See `docs/ANDROID_RELEASE_NOTES_PHASE_132.md` — version 1.0.0, features and limitations.

---

## 12. Google Play blockers

See updated `docs/GOOGLE_PLAY_RELEASE_BLOCKERS_PHASE_113.md`.

**Not ready to publish yet:** signed AAB, screenshots, test account in Console, legal sign-off, real device QA retest.

---

## 13. Known limitations

- Push notifications disabled (permission removed)
- `@capacitor/push-notifications` in deps but not production-enabled
- Google OAuth may be unstable in WebView — phone login primary for review
- Release AAB requires owner-created keystore
- `webContentsDebuggingEnabled: false` in production Capacitor config

---

## 14. Next step

**Phase 133 — signed AAB and real device release test**

1. Create keystore locally
2. Fill `android/key.properties`
3. Run `npm run android:release`
4. Upload AAB to Play Console internal testing
5. Complete real device RC checklist (`docs/ANDROID_REAL_DEVICE_QA_PHASE_112.md`)
6. Capture screenshots per `docs/STORE_SCREENSHOTS_CHECKLIST_PHASE_131.md`

Alternative if Android RC fully signed off: Phase 133 — iOS Capacitor setup (see `docs/IOS_TESTFLIGHT_PREP_PHASE_131.md`).

---

## Migration

Нет.
