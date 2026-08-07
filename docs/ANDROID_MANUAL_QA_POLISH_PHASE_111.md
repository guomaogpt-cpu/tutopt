# Android Manual QA Polish — Phase 111

## 1. Цель

После Phase 110 (стабильность формы объявления) пройти Android UX-сценарии и исправить мелкие layout/keyboard/back баги, которые мешают пользоваться приложением через Capacitor WebView.

**Не в scope:** новые функции, Google Play release, push, iOS, native camera, Prisma schema changes.

**Production URL (Capacitor remote):** https://tutopt-production.up.railway.app

---

## 2. Production deploy status

| Check | Result |
|---|---|
| `origin/main` commit | `db211ab` — fix: stabilize listing form on android webview |
| `/` | ✅ HTTP 200, главная загружается |
| `/market` | ✅ HTTP 200, категории и объявления видны |
| `/listings/new` | ✅ HTTP 200 (redirect/login gate для гостя — expected) |
| `/account` | ✅ HTTP 200 |
| `/cargo` | ✅ HTTP 200 |
| Phase 110 markers в JS bundle | ✅ `aiKeptExistingDescription`, «Найден черновик» найдены в production chunks |

**Вывод:** Phase 110 (`db211ab`) задеплоен на Railway. Android app получает актуальную web-версию с draft autosave и fix characteristics.

Phase 111 polish (keyboard/back/sticky) попадёт в Android app после deploy следующего commit.

---

## 3. Проверенные сценарии

| Сценарий | Метод проверки | Статус |
|---|---|---|
| Launch / routes | Production HTTP + HTML review | ✅ pass (web) |
| Bottom nav layout | Production HTML: `pb-[calc(5rem+env(safe-area-inset-bottom))]` | ✅ pass |
| Market categories incl. equipment | Production `/market` — «Оборудование и станки» | ✅ pass |
| Listing form stability (Phase 110) | Code review + production JS markers | ✅ pass |
| Auth forms | Code review: controlled inputs, autocomplete | ✅ pass (web code) |
| Keyboard / sticky submit | Code review + CSS `--keyboard-inset` | ✅ fixed in Phase 111 |
| Android back button | Code review: `MobileAppShell` Capacitor listener | ✅ fixed in Phase 111 |
| Unsaved form guard | Code review: `useMobileFormBackGuard` | ✅ fixed in Phase 111 |
| Listing detail sticky CTA | Code review: extra bottom padding | ✅ fixed in Phase 111 |
| Cargo modal keyboard | Code review: drawer bottom padding | ✅ fixed in Phase 111 |
| Real device APK flows | — | ⏳ requires manual retest |

---

## 4. Найденные баги

| # | Симптом | Где |
|---|---|---|
| 1 | Sticky submit / CTA перекрываются клавиатурой на mobile | `/listings/new`, listing detail |
| 2 | Listing detail: sticky CTA перекрывается bottom nav | `/listings/[id]` |
| 3 | Android hardware Back закрывает app вместо modal/keyboard | Capacitor WebView |
| 4 | Back из формы объявления без confirm теряет данные | `/listings/new` |
| 5 | Cargo request drawer: submit может быть под клавиатурой | `/cargo` modal |
| 6 | Login submit может быть под клавиатурой | `/login`, `/register` |
| 7 | Drawer close button selector для Back handler ненадёжен | `closeTopmostOverlay()` |

---

## 5. Исправленные баги

| Fix | Files |
|---|---|
| `--keyboard-inset` через `visualViewport` API | `src/lib/mobile/mobile-viewport.ts`, `globals.css` |
| Sticky bottom offset учитывает keyboard + safe-area | `mobileStickyBottomOffset()` → `NewListingForm`, `ListingMobileStickyCta` |
| Listing detail extra bottom padding для sticky CTA + nav | `src/app/listings/[id]/page.tsx` |
| Capacitor Back: overlay → blur field → history.back → exit | `src/components/mobile/MobileAppShell.tsx` |
| Unsaved form confirm on browser back | `src/hooks/use-mobile-form-back-guard.ts`, `NewListingForm.tsx` |
| Auth submit scroll-margin при keyboard | `.mobile-scroll-target` utility, `LoginForm`, `RegisterForm` |
| Cargo drawer keyboard padding | `CargoRequestModal.tsx` |
| Improved drawer close for Back handler | `closeTopmostOverlay()` — `button.absolute` selector |
| i18n: unsaved exit confirm message | `dictionaries.ts` — `listingForm.unsavedExitConfirm` |

---

## 6. Known issues

| Issue | Severity | Notes |
|---|---|---|
| Google OAuth в Android WebView | Medium | Может открываться во external browser или fail. **Phone/password login — primary path.** |
| File input / gallery в WebView | Medium | Работает на многих устройствах, но без native camera plugin. Future phase. |
| Real device QA не пройден агентом | — | Требуется retest на APK после deploy Phase 111 |
| Draft не хранит blob previews фото | Low | Только uploaded server URLs (Phase 110) |
| `window.confirm` для unsaved guard | Low | Нативный dialog; acceptable для MVP |
| Portrait lock в Android manifest | Info | Rotation не тестировался — expected |

---

## 7. Что нужно проверить на реальном Android

После deploy Phase 111 и reinstall/refresh APK:

1. **Launch** — splash → главная, no white screen, no horizontal scroll
2. **Auth** — login/register, keyboard не закрывает submit, session persist
3. **Listing form** — market → Оборудование → Упаковочное оборудование; characteristics не слетают; sticky submit над keyboard
4. **Photo** — gallery picker, form не сбрасывается
5. **Listing detail** — sticky CTA видна, не под nav
6. **Account** — все ссылки, empty states
7. **Cargo** — modal, fill, submit, back closes modal first
8. **Back button** — keyboard → modal → history → exit (home only)
9. **Draft** — partial fill → close app → restore banner

Checklist: `docs/ANDROID_MANUAL_TEST_CHECKLIST_PHASE_109.md`

---

## 8. Готовность к release AAB

**Нет** — нужен manual device QA pass после deploy Phase 111 polish.

Blockers before AAB:
- [ ] Real Android retest всех critical flows
- [ ] Privacy Policy + Terms pages
- [ ] Account deletion self-service
- [ ] Signed release keystore + Play Console setup

---

## Связанные документы

- `docs/ANDROID_FORM_STABILITY_PHASE_110.md`
- `docs/ANDROID_MANUAL_TEST_CHECKLIST_PHASE_109.md`
- `docs/MOBILE_APP_ROADMAP_PHASE_107.md`
- `docs/ANDROID_APK_TEST_INSTALL_PHASE_109.md`
