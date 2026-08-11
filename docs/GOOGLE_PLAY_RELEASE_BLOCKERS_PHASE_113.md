# Google Play Release Blockers — Phase 113 / 114 / 131

> **Статус:** blockers checklist перед Google Play submission.  
> **Phase 131** — store readiness pack: legal pages, listing texts, screenshots checklist, data safety notes.  
> **Не публикуем** в Play Console в этих фазах.

**⚠️ Legal:** Требуется финальная юридическая проверка Privacy Policy и Terms перед публикацией.

---

## Release blockers table

| Blocker | Status | Owner | Notes |
|---|---|---|---|
| Privacy Policy final URL | Needs review | Legal | `/privacy` — content updated Phase 131; lawyer sign-off pending |
| Terms final URL | Needs review | Legal | `/terms` — content updated Phase 131; lawyer sign-off pending |
| Support contact | Needs review | Ops | `/support`; default `hello@tutopt.kg` — confirm before publish |
| Account deletion flow | Done | Product | `/delete-account`, `/account/delete`, API request |
| Test account | Missing | QA | Template: `docs/STORE_REVIEW_TEST_ACCOUNT_PHASE_131.md` |
| Screenshots | Missing | Design/QA | Checklist: `docs/STORE_SCREENSHOTS_CHECKLIST_PHASE_131.md` |
| App description | Done | Product | `docs/STORE_LISTING_TEXTS_PHASE_131.md` — copy to Console manually |
| Data safety answers | Needs review | Product/Legal | `docs/STORE_DATA_SAFETY_NOTES_PHASE_131.md` |
| Signed AAB | Missing | Android | Local keystore + `npm run android:release` |
| Real device QA | Needs review | QA | `docs/ANDROID_REAL_DEVICE_QA_PHASE_112.md`, Phase 130 freeze |
| Production URL stable | Needs review | DevOps | HTTPS domain for store URLs |
| Moderation/report flow | Done | Product | Reports + admin queue Phase 125 |
| No lorem ipsum | Done | Product | Verified Phase 131 |
| No exposed secrets | Done | Security | No passwords in repo/docs |
| No debug labels | Done | Product | Mobile QA Phase 130 |
| No broken routes | Done | Product | Store-critical routes checked Phase 131 |

**Status legend:** Done | Needs review | Missing

---

## Legal pages

| Route | Exists | Store-ready |
|---|---|---|
| `/privacy` | ✅ | ⚠️ Needs legal review |
| `/terms` | ✅ | ⚠️ Needs legal review |
| `/support` | ✅ | ⚠️ Confirm support email |
| `/delete-account` | ✅ | ✅ public store link |
| `/account/delete` | ✅ | ✅ authenticated request |

**Rule:** Do not publish until Privacy Policy and Terms are lawyer-approved.

---

## Account deletion (Phase 114 / 131)

**Implemented:**
- Public: `/delete-account`
- Auth: `/account/delete` with confirmation checkbox
- API: `POST /api/account/deletion-request` (session-scoped)
- Success: «Запрос на удаление аккаунта отправлен»
- Manual processing — no hard delete automation

See `docs/ACCOUNT_DELETION_PHASE_114.md`

---

## Store assets (Phase 131)

See `docs/STORE_SCREENSHOTS_CHECKLIST_PHASE_131.md` and `docs/STORE_LISTING_TEXTS_PHASE_131.md`.

- [ ] Feature graphic 1024×500
- [ ] Phone screenshots (6–8 recommended)
- [ ] App icon 512 / 1024
- [ ] Short + full description copied to Console

---

## Test account

Prepare before submission — **never commit real credentials**:

```
Login: TO_BE_FILLED
Password: TO_BE_FILLED
```

See `docs/STORE_REVIEW_TEST_ACCOUNT_PHASE_131.md`

---

## Data safety

Reference: `docs/STORE_DATA_SAFETY_NOTES_PHASE_131.md`  
Earlier draft: `docs/GOOGLE_PLAY_DATA_SAFETY_NOTES_PHASE_114.md`

Push notifications: **not declared** until production push enabled.

---

## Signed AAB

| Item | Status |
|---|---|
| Release signing docs | ✅ `docs/ANDROID_RELEASE_AAB_PHASE_113.md` |
| Local keystore | ⏳ owner creates |
| Output path | `android/app/build/outputs/bundle/release/app-release.aab` |

**Never commit:** keystore, passwords, API keys, review credentials.

---

## Phase order

| Phase | Scope |
|---|---|
| 113 ✅ | AAB prep, signing docs |
| 114 ✅ | Legal drafts, account deletion |
| 130 ✅ | Mobile QA freeze |
| 131 ✅ | Store readiness pack |
| Next | Legal sign-off → screenshots → signed AAB → internal testing |

---

## Связанные документы

- `docs/STORE_READINESS_PACK_PHASE_131.md`
- `docs/STORE_LISTING_TEXTS_PHASE_131.md`
- `docs/STORE_SCREENSHOTS_CHECKLIST_PHASE_131.md`
- `docs/STORE_DATA_SAFETY_NOTES_PHASE_131.md`
- `docs/STORE_REVIEW_TEST_ACCOUNT_PHASE_131.md`
- `docs/IOS_TESTFLIGHT_PREP_PHASE_131.md`
- `docs/ANDROID_RELEASE_AAB_PHASE_113.md`
- `docs/MOBILE_QA_FREEZE_PHASE_130.md`
