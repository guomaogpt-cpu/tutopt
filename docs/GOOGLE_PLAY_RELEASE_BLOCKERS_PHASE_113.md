# Google Play Release Blockers — Phase 113 / 114 / 131 / 132

> **Статус:** blockers checklist перед Google Play submission.  
> **Phase 132** — Android release candidate config verified; debug APK builds.  
> **Не публикуем** в Play Console в этих фазах.

**⚠️ Legal:** Требуется финальная юридическая проверка Privacy Policy и Terms перед публикацией.

**Not “Ready to publish”** until: signed AAB, screenshots, test account in Console, legal sign-off, real device QA.

---

## Release blockers table

| Blocker | Status | Owner | Notes |
|---|---|---|---|
| Privacy Policy final URL | Needs review | Legal | https://tutopt-production.up.railway.app/privacy — lawyer sign-off pending |
| Terms URL | Needs review | Legal | https://tutopt-production.up.railway.app/terms |
| Support URL | Needs review | Ops | https://tutopt-production.up.railway.app/support — confirm `hello@tutopt.kg` |
| Account deletion URL | Done | Product | https://tutopt-production.up.railway.app/delete-account |
| Test account | Missing | QA | Placeholders only; fill in Play Console, not git |
| Screenshots | Missing | Design/QA | `docs/STORE_SCREENSHOTS_CHECKLIST_PHASE_131.md` |
| Store description | Done | Product | `docs/STORE_LISTING_TEXTS_PHASE_131.md` |
| Data safety notes | Needs review | Product/Legal | `docs/STORE_DATA_SAFETY_NOTES_PHASE_131.md` |
| Signed AAB | Missing | Android | Requires local keystore + `npm run android:release` |
| Real device QA | Needs review | QA | RC checklist Phase 132 in `ANDROID_REAL_DEVICE_QA_PHASE_112.md` |
| Production URL | Done | DevOps | Capacitor → `tutopt-production.up.railway.app`; routes 200/307 |
| Report/moderation flow | Done | Product | Reports + admin queue Phase 125 |
| Release notes | Done | Product | `docs/ANDROID_RELEASE_NOTES_PHASE_132.md` v1.0.0 |
| Android RC config | Done | Android | `docs/ANDROID_RELEASE_CANDIDATE_PHASE_132.md` |
| No exposed secrets | Done | Security | `.gitignore` keystore/key.properties |
| No debug labels | Done | Product | Mobile QA Phase 130 |
| No broken store routes | Done | Product | Verified Phase 132 |
| Minimal permissions | Done | Android | INTERNET only; POST_NOTIFICATIONS removed Phase 132 |
| Debug APK build | Done | Android | assembleDebug ok Phase 132 |

**Status legend:** Done | Needs review | Missing

---

## Store URLs (production)

| Page | URL |
|---|---|
| Privacy | https://tutopt-production.up.railway.app/privacy |
| Terms | https://tutopt-production.up.railway.app/terms |
| Support | https://tutopt-production.up.railway.app/support |
| Account deletion | https://tutopt-production.up.railway.app/delete-account |

---

## Test account

Prepare before submission — **never commit real credentials**:

```
Login: TO_BE_FILLED
Password: TO_BE_FILLED
Notes: TO_BE_FILLED
```

Enter credentials in **Google Play Console → App access** only.  
See `docs/STORE_REVIEW_TEST_ACCOUNT_PHASE_131.md`

---

## Signed AAB

| Item | Status |
|---|---|
| Release signing docs | ✅ |
| Debug APK | ✅ Phase 132 |
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
| 132 ✅ | Android RC config + debug build |
| **Next** | Signed AAB → internal testing → real device RC QA |

---

## Связанные документы

- `docs/ANDROID_RELEASE_CANDIDATE_PHASE_132.md`
- `docs/ANDROID_RELEASE_NOTES_PHASE_132.md`
- `docs/STORE_READINESS_PACK_PHASE_131.md`
- `docs/STORE_LISTING_TEXTS_PHASE_131.md`
- `docs/STORE_SCREENSHOTS_CHECKLIST_PHASE_131.md`
- `docs/STORE_DATA_SAFETY_NOTES_PHASE_131.md`
- `docs/STORE_REVIEW_TEST_ACCOUNT_PHASE_131.md`
- `docs/ANDROID_RELEASE_AAB_PHASE_113.md`
- `docs/ANDROID_REAL_DEVICE_QA_PHASE_112.md`
