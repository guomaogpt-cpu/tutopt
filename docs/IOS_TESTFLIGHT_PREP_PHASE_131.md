# iOS / TestFlight Preparation — Phase 131

> **Не создавать iOS project в этой фазе.** План для будущей работы.

---

## Prerequisites

| Item | Status |
|---|---|
| Apple Developer Program ($99/year) | Not started |
| Mac with Xcode | Required |
| Capacitor iOS platform | Not added |
| Bundle ID | TBD — align with Android `app id` if possible |
| Privacy Policy URL | `/privacy` (stable HTTPS) |
| Support URL | `/support` |

---

## Future steps

### 1. Apple Developer setup
- Enroll in Apple Developer Program
- Create App ID (bundle identifier)
- Configure signing certificates & provisioning profiles

### 2. Capacitor iOS
```text
npm install @capacitor/ios
npx cap add ios
npx cap sync ios
```
- Open `ios/App/App.xcworkspace` in Xcode
- Set deployment target (iOS 15+ recommended)
- Configure `Info.plist` permissions (camera/photos for listing upload)

### 3. App icons & splash
- Reuse `/public/icons/` assets
- Generate iOS app icon set in Xcode Asset Catalog
- Splash screen via Capacitor Splash Screen plugin

### 4. App Store Connect
- Create app record
- Fill metadata (use `docs/STORE_LISTING_TEXTS_PHASE_131.md`)
- Privacy Policy URL, Support URL
- Age rating questionnaire (UGC → likely 17+ or with moderation notes)
- App Privacy details (use `docs/STORE_DATA_SAFETY_NOTES_PHASE_131.md`)

### 5. TestFlight
- Archive in Xcode → Upload to App Store Connect
- Internal testing group first
- External testing after basic QA
- Review notes + test account (see `docs/STORE_REVIEW_TEST_ACCOUNT_PHASE_131.md`)

### 6. Screenshots
- Per device class (6.7", 6.5", 5.5")
- See `docs/STORE_SCREENSHOTS_CHECKLIST_PHASE_131.md` iOS section

---

## Known iOS considerations

- WebView auth: Google OAuth may need ASWebAuthenticationSession or native flow
- Phone login primary (same as Android)
- Safe area / notch layout already partially handled via CSS env()
- No push until APNs configured (out of scope)

---

## Bundle ID suggestion

Align with Android package name from `capacitor.config.ts` / `android/app/build.gradle` when adding iOS.

---

## Do NOT do in Phase 131

- ❌ Create `ios/` folder
- ❌ TestFlight build
- ❌ App Store submission
- ❌ Push notifications setup

---

## Связанные документы

- `docs/STORE_LISTING_TEXTS_PHASE_131.md`
- `docs/STORE_SCREENSHOTS_CHECKLIST_PHASE_131.md`
- `docs/STORE_REVIEW_TEST_ACCOUNT_PHASE_131.md`
- `docs/MOBILE_APP_ROADMAP_PHASE_107.md`
