# Android Real Device QA — Phase 112

## 1. Устройство / Android version

| Field | Value |
|---|---|
| Device model | Not available to automated agent |
| Android version | Not available to automated agent |
| APK | `app-debug.apk` (Capacitor remote URL) |
| App id | `kg.vsetut.app` |
| Tester | Automated deploy/code audit + known WebView pattern fixes |

**Note:** Физический Android-телефон недоступен агенту Cursor. Phase 112 включает:
- проверку production deploy Phase 111 (`a01c315`)
- code audit типичных Android WebView failure modes
- исправление багов, которые воспроизводятся на реальных устройствах (photo MIME, hardware Back confirm)
- чеклист для финального pass на телефоне

---

## 2. Deploy status

| Check | Result |
|---|---|
| Expected commit | `a01c315` — fix: polish android mobile qa issues |
| `/` | ✅ HTTP 200 |
| `/market` | ✅ HTTP 200 |
| `/listings/new` | ✅ HTTP 307 (auth redirect — expected for guest) |
| `/account` | ✅ HTTP 307 (auth redirect — expected for guest) |
| `/cargo` | ✅ HTTP 200 |
| Layout chunk changed | ✅ `layout-183825d82b2563a4.js` (was `layout-ecc8ae1ddb9dc268.js`) |
| Phase 111 marker | ✅ `keyboard-inset` in production layout chunk |

**Вывод:** Phase 111 задеплоен на Railway.

---

## 3. Проверенные сценарии

| Сценарий | Метод | Статус |
|---|---|---|
| Production routes | HTTP + JS bundle markers | ✅ |
| Launch / bottom nav / safe-area | Production HTML review | ✅ (web-level) |
| Listing form stability | Phase 110 markers in production | ✅ |
| Keyboard / sticky (Phase 111) | Production `keyboard-inset` in bundle | ✅ deployed |
| Photo upload Android MIME | Code audit → fix applied | ✅ fixed (see §5) |
| Hardware Back + form guard | Code audit → fix applied | ✅ fixed (see §5) |
| Full APK manual pass | Real device | ⏳ pending human tester |

---

## 4. Найденные баги

| # | Симптом (типично на Android WebView) | Root cause |
|---|---|---|
| 1 | Gallery photo pick fails with «JPG, PNG, WEBP» | Client rejects `file.type === ""` from Android gallery |
| 2 | Upload fails after pick despite valid JPEG | Server `validateListingImageFile` rejects empty MIME; `detectedMime !== file.type` when type is `""` |
| 3 | Cargo photo upload same failure | Same server validation in `save-cargo-request-upload.ts` |
| 4 | Gallery picker not opening / limited on Android | Strict `accept="image/jpeg,image/png,image/webp"` without `image/*` |
| 5 | Double confirm or no confirm on hardware Back from listing form | `useMobileFormBackGuard` used popstate only; Capacitor Back bypassed or double-fired with popstate |

---

## 5. Исправленные баги

| Fix | Files |
|---|---|
| Normalize client MIME from extension (`image/jpg`, empty type) | `src/lib/uploads/image-file-validation.ts` |
| Server accepts empty/wrong client MIME; magic bytes are source of truth | `save-upload.ts`, `save-cargo-request-upload.ts` |
| Client photo validation uses extension fallback | `ListingImageUpload.tsx` |
| `accept` includes `image/*` for Android gallery | `ListingImageUpload.tsx`, `CargoRequestForm.tsx` |
| Native Back guard via `setMobileBackGuard` (no double confirm) | `mobile-back-guard.ts`, `MobileAppShell.tsx`, `use-mobile-form-back-guard.ts` |

---

## 6. Photo upload result

| Check | Status |
|---|---|
| Gallery opens (accept attribute) | ✅ fixed (code) — retest on device |
| Empty MIME from Android accepted | ✅ fixed server + client |
| Preview after pick | ⏳ device retest |
| Form fields not reset after upload | ✅ Phase 110 — retest on device |
| Photo visible on published listing | ⏳ device retest |

**Native camera:** not in scope — future phase if gallery-only insufficient.

---

## 7. Auth result

| Check | Status |
|---|---|
| Login phone/password | ⏳ device retest |
| Register | ⏳ device retest |
| Keyboard vs submit button | ✅ Phase 111 scroll-margin — retest on device |
| Session after app restart | ⏳ device retest (WebView cookies) |
| Google OAuth | Known risk — use phone/password on Android |

---

## 8. Listing creation result

| Check | Status |
|---|---|
| Equipment → Packaging subcategory | ✅ categories visible on production `/market` |
| Fields don't reset | ✅ Phase 110 — retest on device |
| Draft restore after app reopen | ✅ Phase 110 — retest on device |
| Draft cleared after publish | ✅ Phase 110 — retest on device |
| Sticky submit above keyboard + nav | ✅ Phase 111 — retest on device |
| Back confirm on unsaved form | ✅ Phase 112 native guard fix — retest on device |

---

## 9. Cargo result

| Check | Status |
|---|---|
| `/cargo` opens | ✅ production HTTP 200 |
| Request form drawer | ⏳ device retest |
| Keyboard vs fields | ✅ Phase 111 drawer padding — retest |
| Back closes drawer | ✅ Phase 111 overlay handler — retest |
| Photo upload in cargo form | ✅ Phase 112 MIME fix — retest |
| Submit + detail page | ⏳ device retest |

---

## 10. Known issues

| Issue | Severity | Action |
|---|---|---|
| Real device QA not completed by agent | — | Human tester: `docs/ANDROID_MANUAL_TEST_CHECKLIST_PHASE_109.md` |
| Google OAuth in WebView | Medium | Phone/password primary |
| Native camera | Low | Future phase |
| Draft blob previews not restored | Low | Phase 110 limitation |
| Release AAB / Play Store | — | Not in scope |

---

## 11. Готовность к release AAB

**Partial** — process ready, signed artifact pending local keystore.

Blockers:
- [ ] Full manual pass on real Android device
- [ ] Privacy Policy + Terms production-ready
- [ ] Account deletion self-service
- [ ] Signed release keystore + signed AAB
- [ ] Play Console (not in Phase 113)

## Phase 113 Android release AAB preparation

Release signing docs and `android:release` script added. See `docs/ANDROID_RELEASE_AAB_PHASE_113.md`.

Unsigned AAB can be built locally via Gradle for size verification; Google Play requires signed AAB.

---

## Phase 115 — Mobile App UX Upgrade

UX polish для mobile/PWA/WebView — см. `docs/MOBILE_APP_UX_UPGRADE_PHASE_115.md`.

**Device retest focus:**
- Compact mobile home (search, quick actions)
- Bottom nav FAB + keyboard hide on forms
- Listing creation user-friendly labels
- Account profile + service links
- Sticky edit CTA on own listings

Status: **retest pending** on real device after deploy.

---

## Phase 116 — App Notifications & Activity

In-app notifications polish — см. `docs/APP_NOTIFICATIONS_ACTIVITY_PHASE_116.md`.

**Device retest focus:**
- Bottom nav numeric badge (9+)
- `/notifications` filters and mark-all-read
- Account activity block
- Status labels and hints
- Toast on mark-all-read

Status: **retest pending** after deploy.

---

## Phase 122 — Mobile gestures and swipe UX

Swipe gallery, drawer dismiss, horizontal scroll polish — см. `docs/MOBILE_GESTURES_PHASE_122.md`.

**Device retest focus:**
- Photo swipe on listing detail (WebView touch)
- Swipe-down sheet vs inner scroll conflict
- Android Back with fullscreen gallery open
- No accidental form dismiss on cargo/lead drawers

Status: **retest pending** on real device.

---

## Phase 130 — Mobile QA Freeze

Pre-release mobile stabilization pass — см. `docs/MOBILE_QA_FREEZE_PHASE_130.md`.

**Device retest focus:**
- Home first screen (no clutter, single search)
- Account mobile layout
- Cargo page scroll length
- Filter drawer apply/reset above bottom nav
- Listing create sticky submit

Status: **retest recommended** before RC.

---

## Phase 132 — Android Release Candidate checklist

Before Play internal testing, verify on **real device** (APK or internal test AAB):

| # | Scenario | Pass |
|---|---|---|
| 1 | Install APK / internal test AAB | ☐ |
| 2 | App opens production URL (not localhost) | ☐ |
| 3 | Splash → home loads | ☐ |
| 4 | Login / register (phone + password) | ☐ |
| 5 | Browse listings / search | ☐ |
| 6 | Open listing detail | ☐ |
| 7 | Create listing | ☐ |
| 8 | Upload photo in listing form | ☐ |
| 9 | Send lead (contact seller) | ☐ |
| 10 | Receive lead (seller account) | ☐ |
| 11 | Report listing | ☐ |
| 12 | Account deletion page opens | ☐ |
| 13 | Support / privacy / terms open in WebView | ☐ |
| 14 | Android Back (app, modal, form) | ☐ |
| 15 | Keyboard does not hide submit | ☐ |
| 16 | `tel:` link opens dialer | ☐ |
| 17 | Poor network / offline — graceful error, no crash | ☐ |

See `docs/ANDROID_RELEASE_CANDIDATE_PHASE_132.md`.

Status: **pending** — run after signed AAB internal test upload.

---

## Связанные документы

- `docs/ANDROID_MANUAL_QA_POLISH_PHASE_111.md`
- `docs/ANDROID_RELEASE_AAB_PHASE_113.md`
- `docs/GOOGLE_PLAY_RELEASE_BLOCKERS_PHASE_113.md`
- `docs/ANDROID_MANUAL_TEST_CHECKLIST_PHASE_109.md`
- `docs/ANDROID_FORM_STABILITY_PHASE_110.md`
- `docs/MOBILE_APP_ROADMAP_PHASE_107.md`
- `docs/MOBILE_APP_UX_UPGRADE_PHASE_115.md`
- `docs/APP_NOTIFICATIONS_ACTIVITY_PHASE_116.md`
- `docs/ANDROID_RELEASE_CANDIDATE_PHASE_132.md`
- `docs/ANDROID_RELEASE_NOTES_PHASE_132.md`
