# Android Real Device Release Test — Phase 133

> **Статус:** checklist для проверки release/debug build на **реальном Android-устройстве**.  
> **Не публикуем** в Google Play в этой фазе.

---

## Build under test

| Field | Value |
|---|---|
| App | ВсеТут |
| Package | `kg.vsetut.app` |
| versionName | `1.0.0` |
| versionCode | `1` |
| Production URL | https://tutopt-production.up.railway.app |

**Install options:**
- Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk` (manual sideload)
- Signed AAB: internal testing track (after owner builds signed AAB + Play Console upload)

---

## QA checklist

- [ ] Установить APK/AAB/internal test build
- [ ] Открыть приложение
- [ ] Проверить главную
- [ ] Выполнить вход
- [ ] Зарегистрироваться тестовым аккаунтом
- [ ] Найти объявление
- [ ] Открыть объявление
- [ ] Отправить заявку
- [ ] Проверить заявку в кабинете
- [ ] Подать объявление
- [ ] Загрузить фото из галереи
- [ ] Отредактировать объявление
- [ ] Проверить модерационный статус
- [ ] Добавить в избранное
- [ ] Пожаловаться на объявление
- [ ] Открыть /privacy
- [ ] Открыть /terms
- [ ] Открыть /support
- [ ] Открыть /delete-account
- [ ] Проверить Android Back
- [ ] Проверить клавиатуру в формах
- [ ] Проверить tel: link
- [ ] Проверить плохой интернет / reload
- [ ] Проверить, что bottom nav ничего не перекрывает

---

## Test session record

| Field | Value |
|---|---|
| **Device** | |
| **Android version** | |
| **Build type** | debug APK / signed AAB / internal test |
| **Date** | |
| **Tester** | |
| **Result** | Pass / Fail / Partial |

### Critical issues

```
(none yet — fill after device test)
```

### Minor issues

```
(none yet — fill after device test)
```

### Decision

- [ ] **Ready for internal testing**
- [ ] **Needs fixes**

---

## Phase 133 automated prep (agent)

| Check | Result |
|---|---|
| Production routes HTTP | ✅ 200/307 (Phase 133) |
| Permissions (INTERNET only) | ✅ |
| Debug APK build | ✅ |
| Signed AAB | ⏳ not built — local keystore missing |
| Real device QA execution | ⏳ pending manual test on physical device |

**Note:** Google OAuth may be unstable in WebView — use phone/password for login during device test.

---

## Phase 134-pre Release blockers hotfix

Hotfix commit `46df7a5` — retest **signed AAB** after production deploy:

| Blocker | Code fix | Retest on device |
|---|---|---|
| Mobile search (query disappears) | ✅ `search-form.ts`, DOM read on submit | ⏳ required |
| Listing create false error | ✅ notification try/catch | ⏳ required |
| Company public page 404 | ✅ stable `SellerProfile.id` links | ⏳ required |
| Account «Мои объявления» | ✅ `AccountManagementNav` | ⏳ required |

**Before retest:** owner must run **Railway migrate deploy** (no reset/drop).  
See `docs/RELEASE_BLOCKERS_HOTFIX_PHASE_134_PRE.md`.

### Phase 134-pre device checklist (priority)

- [ ] Homepage search «фасовщик» → `/listings?q=фасовщик`, query preserved
- [ ] Listings page search update works
- [ ] Create listing → success UI (no false error)
- [ ] Company public page from `/account/company`
- [ ] Company public page from `/admin/companies`
- [ ] Account → «Управление» → «Мои объявления»

---

## Связанные документы

- `docs/ANDROID_REAL_DEVICE_QA_PHASE_112.md`
- `docs/ANDROID_RELEASE_CANDIDATE_PHASE_132.md`
- `docs/ANDROID_KEYSTORE_LOCAL_SETUP_PHASE_133.md`
- `docs/STORE_REVIEW_TEST_ACCOUNT_PHASE_131.md`
- `docs/RELEASE_BLOCKERS_HOTFIX_PHASE_134_PRE.md`
- `docs/MOBILE_QA_FREEZE_PHASE_130.md`
