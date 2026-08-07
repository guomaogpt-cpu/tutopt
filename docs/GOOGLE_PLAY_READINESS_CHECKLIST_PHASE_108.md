# Google Play Readiness Checklist — Phase 108

> Статус: **подготовка, не публикация**. Checklist для будущей submission.

## App identity

- [ ] **Финальное название:** ВсеТут
- [ ] **Package name:** kg.vsetut.app
- [ ] **Категория:** Shopping / Business (уточнить при submission)
- [ ] **Финальная иконка 1024×1024** для store listing (сейчас техническая из Phase 107)
- [ ] **Feature graphic** 1024×500
- [ ] **Screenshots phone** (минимум 2, рекомендуется 4–8):
  - [ ] Home `/`
  - [ ] Listings `/listings`
  - [ ] Create listing `/listings/new`
  - [ ] Listing detail `/listings/[id]`
  - [ ] Account `/account`
  - [ ] Cargo `/cargo`
- [ ] **Tablet screenshots** (optional)

## Store listing text

- [ ] **Short description** (до 80 символов)
  - Пример: «Объявления, услуги, опт и карго в Кыргызстане»
- [ ] **Full description** (до 4000 символов)
  - Объявления, услуги, опт, карго
  - Создание объявлений с фото
  - Кабинет, избранное, заявки
  - Карго-заявки
- [ ] **Support email** (публичный контакт)
- [ ] **Website URL:** https://tutopt-production.up.railway.app (или финальный домен)

## Legal & privacy

- [ ] **Privacy Policy URL** (публичная страница `/privacy` — проверить актуальность)
- [ ] **Terms of Service URL** (публичная страница `/terms` — проверить актуальность)
- [ ] **Account deletion flow**
  - Self-service в кабинете или documented email request
  - Apple/Google требуют возможность удаления аккаунта
- [ ] **Data safety form** (Google Play Console):
  - [ ] Какие данные собираются (email, phone, listing content, photos)
  - [ ] Передаются ли третьим лицам
  - [ ] Encryption in transit (HTTPS ✅)
  - [ ] Data deletion mechanism

## Content & moderation (UGC)

Приложение содержит user-generated content (объявления). Нужно описать в review notes:

- [ ] **Content moderation flow**
  - Admin moderation queue (`/admin/moderation/listings`)
  - Listing lifecycle (draft → pending → published/rejected)
- [ ] **Report listing flow**
  - Report API / UI на listing detail
- [ ] **Block/report user flow** (если есть / планируется)
- [ ] **Community guidelines** или terms section про запрещённый контент
- [ ] **Contact for abuse reports** (support email)

## Testing

- [ ] **Test account** для Google Play reviewers
  - Login email + password в review notes
  - Доступ к основным flows без 2FA блокеров
- [ ] **Android manual test** on real device/emulator:
  - [ ] App launch + splash
  - [ ] Home, market, listings
  - [ ] Login / register / logout
  - [ ] Create listing + photo upload
  - [ ] AI description (mock fallback)
  - [ ] Cargo request modal
  - [ ] Bottom nav active states
  - [ ] Back button (history + exit)
  - [ ] Offline → `/offline` fallback
  - [ ] Google OAuth (may fail in WebView — document workaround)

## Technical release

- [ ] **Release AAB** signed with production keystore
- [ ] **versionCode** / **versionName** incremented
- [ ] **Target SDK** meets Google Play requirements (check `android/variables.gradle`)
- [ ] **ProGuard/R8** rules if minify enabled (currently disabled)
- [ ] **No secrets in APK** — verify no `.env`, API keys, tokens embedded

## Permissions declaration

Текущие permissions (Phase 108):

| Permission | Declared | Justification |
|---|---|---|
| INTERNET | ✅ | Load web app |

Future (not now):

| Permission | When | Justification |
|---|---|---|
| POST_NOTIFICATIONS | Push phase | User alerts |
| CAMERA | Only if native camera needed | Currently file picker |

## Notification permissions (later)

- [ ] Push notifications — Phase 111+
- [ ] Opt-in UX before permission request
- [ ] Play Console declaration for notifications

## Thin wrapper / minimum functionality

Google Play может отклонить «пустую webview-обёртку». Приложение должно демонстрировать:

- [x] Browse listings (market, services, opt, cargo)
- [x] Create listing with photos
- [x] User account / cabinet
- [x] Favorites
- [x] Notifications
- [x] Cargo requests
- [ ] Push notifications (future enhancement)
- [ ] Offline meaningful content (limited — `/offline` fallback only)

**Review notes template:**

> ВсеТут — marketplace для объявлений, услуг, опта и карго в Кыргызстане. Пользователи могут просматривать и создавать объявления, загружать фото, управлять кабинетом, отправлять заявки и карго-запросы. Контент модерируется администраторами.

## Pre-submission checklist summary

| Item | Status |
|---|---|
| Android project (Capacitor) | ✅ Phase 108 |
| Production URL configured | ✅ |
| Icons / splash (basic) | ✅ |
| Privacy Policy | ⚠️ page exists, verify content |
| Terms | ⚠️ page exists, verify content |
| Account deletion | ❌ self-service TODO |
| Store screenshots | ❌ TODO |
| 1024 store icon | ❌ TODO |
| Signed AAB | ❌ TODO |
| Manual Android test | ❌ required |
| Google Play publish | ❌ not in this phase |

## Связанные документы

- `docs/ANDROID_APP_WRAPPER_PHASE_108.md`
- `docs/MOBILE_APP_ROADMAP_PHASE_107.md`
- `docs/PWA_FOUNDATION_PHASE_107.md`
