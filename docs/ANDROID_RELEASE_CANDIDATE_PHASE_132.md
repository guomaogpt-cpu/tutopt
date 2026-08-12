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
| `/services` | 200 |
| `/opt` | 200 |
| `/cargo` | 200 |
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

**Phase 133 update:**
- Debug APK: **ok** (re-verified)
- Signed AAB: **ok** (owner builds locally)
- Real device QA: **ok** (Phase 134-pre retest passed)

**⚠️ Phase 134 — Fresh AAB required before Play upload:**

После hotfix Phase 134-pre (`46df7a5`+) **обязательно собрать новый signed AAB** перед загрузкой в Google Play Internal Testing. AAB, собранный **до** исправлений (mobile search, listing create false error, company public 404, account nav), **не считать финальным**.

Output path (не коммитить):
`android/app/build/outputs/bundle/release/app-release.aab`

---

## 7. Signing safety

| Item | Status |
|---|---|
| `*.jks` / `*.keystore` / `*.p12` in `.gitignore` | ✅ |
| `android/key.properties` in `.gitignore` | ✅ |
| `android/key.properties.example` | ✅ committed (placeholders) |
| Keystore setup doc | ✅ `docs/ANDROID_KEYSTORE_LOCAL_SETUP_PHASE_133.md` |
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

**Not ready to publish yet:** signed AAB, screenshots, test account in Console, legal sign-off, real device QA pass.

**Phase 133:** signing verified; keystore instruction added; device checklist ready; signed AAB and device QA still pending owner/QA.

---

## 13. Known limitations

- Push notifications disabled (permission removed)
- `@capacitor/push-notifications` in deps but not production-enabled
- Google OAuth may be unstable in WebView — phone login primary for review
- Release AAB requires owner-created keystore
- `webContentsDebuggingEnabled: false` in production Capacitor config

---

## 14. Next step

**Phase 134 — Google Play Internal testing**

1. Build **fresh signed AAB** after Phase 134-pre hotfix
2. Follow `docs/GOOGLE_PLAY_INTERNAL_TESTING_PHASE_134.md`
3. Upload to **Internal testing** only (not production)
4. Add testers per `docs/GOOGLE_PLAY_TESTERS_PHASE_134.md`
5. Capture screenshots on fresh build

---

## Migration

Нет.
