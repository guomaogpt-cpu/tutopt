# Google Play Internal Testing — Phase 134

> **Статус:** пакет для загрузки signed AAB в **Internal testing** track.  
> **Не production release.** Не open testing. Не публикация для всех пользователей.

---

## 1. Цель

Подготовить проект **ВсеТут** к первой загрузке signed AAB в Google Play Console на **internal testing track** — для проверки установки, основных сценариев и store forms без production rollout.

---

## 2. Что уже готово

| Item | Status |
|---|---|
| Android wrapper (Capacitor) | ✅ |
| App id `kg.vsetut.app`, name **ВсеТут** | ✅ |
| versionName `1.0.0`, versionCode `1` | ✅ |
| Production URL | ✅ https://tutopt-production.up.railway.app |
| Release blockers Phase 134-pre | ✅ fixed + device retest passed |
| Railway deploy + migrations | ✅ |
| Privacy / Terms / Support / Delete account | ✅ URLs live |
| Reports / moderation | ✅ |
| Signed AAB build process | ✅ documented |
| Store listing texts draft | ✅ |
| Data Safety notes draft | ✅ |
| Release notes draft | ✅ |

---

## 3. Что нужно сделать перед загрузкой

- [ ] **Собрать fresh signed AAB** после Phase 134-pre hotfix (старый AAB не финальный)
- [ ] Проверить `versionCode` / `versionName` в `android/app/build.gradle`
- [ ] Убедиться, что AAB **не** в git
- [ ] Подготовить Gmail-адреса internal testers (2–5 + owner)
- [ ] Создать test account; credentials **только** в Play Console
- [ ] Сделать screenshots на **свежей** версии (post hotfix)
- [ ] Заполнить Data Safety в Console по `STORE_DATA_SAFETY_NOTES_PHASE_131.md`
- [ ] Скопировать store listing из `STORE_LISTING_TEXTS_PHASE_131.md`

---

## 4. Какой AAB загружать

| Field | Value |
|---|---|
| **Path (local)** | `android/app/build/outputs/bundle/release/app-release.aab` |
| **Git** | ❌ never commit |
| **Upload** | Вручную в Play Console → Internal testing → Create release |

**⚠️ Fresh AAB required:** после hotfix Phase 134-pre (`46df7a5`+) нужно собрать **новый** signed AAB. AAB, собранный до исправлений поиска, создания объявлений и публичной страницы компании, **не считать финальным**.

---

## 5. App identity

| Field | Value |
|---|---|
| App name | ВсеТут |
| Package | `kg.vsetut.app` |
| versionName | `1.0.0` |
| versionCode | `1` |
| Production URL | https://tutopt-production.up.railway.app |

---

## 6. Internal testing track

- Track: **Internal testing** only
- Rollout: internal testers group
- **Not:** Open testing, Closed testing (production), Production

См. `docs/GOOGLE_PLAY_CONSOLE_MANUAL_STEPS_PHASE_134.md`

---

## 7. Testers

- Gmail / Google accounts only
- Owner + 2–5 trusted testers
- Не приглашать случайных клиентов на первом этапе

См. `docs/GOOGLE_PLAY_TESTERS_PHASE_134.md`

---

## 8. Test account

Placeholders in repo only. Real login/password → **Play Console → App access** only.

См.:
- `docs/STORE_REVIEW_TEST_ACCOUNT_PHASE_131.md`
- `docs/GOOGLE_PLAY_APP_ACCESS_NOTES_PHASE_134.md`

---

## 9. Store listing minimum

| Field | Source |
|---|---|
| App name | ВсеТут |
| Short description | `STORE_LISTING_TEXTS_PHASE_131.md` |
| Full description | `STORE_LISTING_TEXTS_PHASE_131.md` |
| App icon | 512×512 from project assets |
| Phone screenshots | `STORE_SCREENSHOTS_CHECKLIST_PHASE_131.md` |
| Privacy Policy URL | https://tutopt-production.up.railway.app/privacy |
| Category | Shopping (primary) |

---

## 10. Data Safety

Fill manually in Play Console using reference:

`docs/STORE_DATA_SAFETY_NOTES_PHASE_131.md`

Key points:
- Account info, phone, UGC, photos, leads, reports, city (text), diagnostics
- No GPS, no payments, no push (current version)
- Account deletion via `/delete-account`

---

## 11. App access / review notes

Copy from `docs/GOOGLE_PLAY_APP_ACCESS_NOTES_PHASE_134.md`

Test account instructions → Console only, not git.

---

## 12. Privacy / Terms / Support / Delete account URLs

| Page | URL |
|---|---|
| Privacy | https://tutopt-production.up.railway.app/privacy |
| Terms | https://tutopt-production.up.railway.app/terms |
| Support | https://tutopt-production.up.railway.app/support |
| Account deletion | https://tutopt-production.up.railway.app/delete-account |
| Website | https://tutopt-production.up.railway.app |

---

## 13. После загрузки

1. Review release in Console → **Start rollout to Internal testing**
2. Copy internal testing link → send to testers
3. Testers install from Play Store testing link
4. Collect feedback in `GOOGLE_PLAY_TESTERS_PHASE_134.md` table
5. Fix critical issues before closed/open testing

---

## 14. Что проверить тестерам

- [ ] Install from Play testing link
- [ ] App opens → production URL loads
- [ ] Login / register (phone + password)
- [ ] Search from home → `/listings?q=...`
- [ ] Open listing, send lead
- [ ] Create listing (success, no false error)
- [ ] Upload photo from gallery
- [ ] Account → «Управление» → Мои объявления
- [ ] Company public page
- [ ] Report listing
- [ ] Privacy, Terms, Support, Delete account
- [ ] Android Back, keyboard in forms

---

## 15. Что не делать

- ❌ Production release
- ❌ Open testing
- ❌ Commit AAB/APK to git
- ❌ Commit keystore / passwords / test credentials
- ❌ Promise chat / payments / push / iOS in store listing

---

## Связанные документы

- `docs/GOOGLE_PLAY_CONSOLE_MANUAL_STEPS_PHASE_134.md`
- `docs/GOOGLE_PLAY_TESTERS_PHASE_134.md`
- `docs/GOOGLE_PLAY_APP_ACCESS_NOTES_PHASE_134.md`
- `docs/GOOGLE_PLAY_RELEASE_BLOCKERS_PHASE_113.md`
- `docs/ANDROID_RELEASE_NOTES_PHASE_132.md`
- `docs/ANDROID_KEYSTORE_LOCAL_SETUP_PHASE_133.md`
