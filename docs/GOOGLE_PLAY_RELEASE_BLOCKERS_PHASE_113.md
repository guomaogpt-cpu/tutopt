# Google Play Release Blockers — Phase 113 / 114 / 131 / 132 / 133 / 134-pre / 134

> **Статус:** подготовка **Internal testing** (Phase 134).  
> **Не production release.**  
> **Phase 134-pre** — release blockers fixed; device retest passed; Railway deploy ok.

**⚠️ Legal:** Требуется финальная юридическая проверка Privacy Policy и Terms перед **production** публикацией.

**Not “Ready for production”** until: internal testing feedback, legal sign-off, screenshots in Console, closed testing pass.

---

## Release blockers table

| Blocker | Status | Owner | Notes |
|---|---|---|---|
| Privacy Policy final URL | Needs review | Legal | https://tutopt-production.up.railway.app/privacy — lawyer sign-off pending |
| Terms URL | Needs review | Legal | https://tutopt-production.up.railway.app/terms |
| Support URL | Needs review | Ops | https://tutopt-production.up.railway.app/support |
| Account deletion URL | Done | Product | https://tutopt-production.up.railway.app/delete-account |
| Privacy page exists | Done | Product | Live on production |
| Terms page exists | Done | Product | Live on production |
| Support page exists | Done | Product | Live on production |
| Delete account page exists | Done | Product | Live on production |
| Release blockers Phase 134-pre | Done | Product | Search, listing create, company 404, account nav |
| Production deploy | Done | DevOps | Railway successful |
| Railway migrations | Done | DevOps | Deployed (no reset) |
| Reports/moderation | Done | Product | Phase 125 |
| Signed AAB build process | Done | Android | `npm run android:release` |
| Fresh signed AAB after hotfix | Needs manual | Owner | Rebuild before Play upload — **not** old AAB |
| Upload to internal testing | Needs manual | Owner | `GOOGLE_PLAY_INTERNAL_TESTING_PHASE_134.md` |
| Internal testers group | Needs manual | Owner | `GOOGLE_PLAY_TESTERS_PHASE_134.md` |
| Test account in Console | Needs manual | QA | Real creds **Console only** |
| Data Safety in Console | Needs manual | Product/Legal | `STORE_DATA_SAFETY_NOTES_PHASE_131.md` |
| Screenshots in Console | Missing | Design/QA | Fresh post–134-pre build |
| Store listing draft | Done | Product | Texts ready — paste in Console |
| Release notes | Done | Product | `ANDROID_RELEASE_NOTES_PHASE_132.md` |
| Real device QA | Done | QA | Phase 134-pre retest passed |
| Real tester feedback | Needs manual | QA | After internal testing install |
| Cards/modals/profile UX | Done | Product | Phase 135 cleanup |
| Home/header UX | Done | Product | Phase 136–137 cleanup |
| Compact listing cards | Done | Product | Phase 138 |
| Category drawer header | Done | Product | Phase 139–145 |
| Internal testing track | Needs manual | Owner | Not production / not open testing |
| Production URL | Done | DevOps | tutopt-production.up.railway.app |
| Android RC config | Done | Android | Phase 132 |
| No exposed secrets | Done | Security | keystore/key.properties gitignored |
| Minimal permissions | Done | Android | INTERNET only |
| Final legal review | Missing | Legal | Before production release |
| Production release approval | Missing | Owner | After internal testing pass |

**Status legend:** Done | Needs review | Missing | Needs manual

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

**Never commit real credentials:**

```
Login: TO_BE_FILLED
Password: TO_BE_FILLED
Notes: TO_BE_FILLED
```

Enter in **Google Play Console → App access** only.  
See `docs/GOOGLE_PLAY_APP_ACCESS_NOTES_PHASE_134.md`

---

## Signed AAB

| Item | Status |
|---|---|
| Output path | `android/app/build/outputs/bundle/release/app-release.aab` |
| Git | ❌ never commit |
| Fresh build after 134-pre | ⚠️ **required** before upload |
| Keystore | Local only — `ANDROID_KEYSTORE_LOCAL_SETUP_PHASE_133.md` |

---

## Phase order

| Phase | Scope |
|---|---|
| 113 ✅ | AAB prep, signing docs |
| 114 ✅ | Legal drafts, account deletion |
| 130 ✅ | Mobile QA freeze |
| 131 ✅ | Store readiness pack |
| 132 ✅ | Android RC config |
| 133 ✅ | Keystore docs, device checklist |
| 134-pre ✅ | Release blockers hotfix + retest |
| **134** | Internal testing pack — **current** |
| 135 ✅ | Cards/modals/profile UX cleanup |
| 136 ✅ | Home/header UX cleanup |
| 137 ✅ | Sticky two-level header |
| 138 ✅ | Compact marketplace cards |
| 139 ✅ | Category drawer header |
| 140 ✅ | Category icon + contrast |
| 141 ✅ | Second-level header nav restored |
| 142 ✅ | Header/card density pre-AAB polish |
| 143 ✅ | Lalafo-style glass header + currency UI |
| 144 ✅ | Header click disappear bugfix |
| 145 ✅ | Lalafo-style category mega dropdown |
| 146 ✅ | Import drafts system (admin manual import) |
| 147-import ✅ | Import by URL agent MVP (Lalafo/OG extractors) |
| 149 ✅ | Bulk import queue (batch URLs → drafts) |
| 151 ✅ | Import URL fetch fix (Lalafo errors + partial draft) |
| 147 ✅ | Header dropdown & scroll lock fix |
| 148 ✅ | Profile/settings panel below header |
| **Next** | Upload fresh AAB → internal testers → feedback |

---

## Связанные документы

- `docs/GOOGLE_PLAY_INTERNAL_TESTING_PHASE_134.md`
- `docs/GOOGLE_PLAY_CONSOLE_MANUAL_STEPS_PHASE_134.md`
- `docs/GOOGLE_PLAY_TESTERS_PHASE_134.md`
- `docs/GOOGLE_PLAY_APP_ACCESS_NOTES_PHASE_134.md`
- `docs/LISTING_CARDS_MODALS_PROFILE_CLEANUP_PHASE_135.md`
- `docs/HOME_HEADER_CLEANUP_PHASE_136.md`
- `docs/STICKY_TWO_LEVEL_HEADER_PHASE_137.md`
- `docs/COMPACT_MARKETPLACE_CARDS_PHASE_138.md`
- `docs/CATEGORY_DRAWER_HEADER_PHASE_139.md`
- `docs/HEADER_CATEGORY_CONTRAST_PHASE_140.md`
- `docs/SECOND_LEVEL_HEADER_NAV_PHASE_141.md`
- `docs/HEADER_CARD_DENSITY_CLEANUP_PHASE_142.md`
- `docs/LALAFO_STYLE_GLASS_HEADER_PHASE_143.md`
- `docs/HEADER_CLICK_DISAPPEAR_BUGFIX_PHASE_144.md`
- `docs/LALAFO_STYLE_CATEGORY_MEGA_DROPDOWN_PHASE_145.md`
- `docs/HEADER_DROPDOWN_SCROLL_LOCK_FIX_PHASE_147.md`
- `docs/IMPORT_DRAFTS_SYSTEM_PHASE_146.md`
- `docs/IMPORT_BY_URL_AGENT_PHASE_147.md`
- `docs/BULK_IMPORT_QUEUE_PHASE_149.md`
- `docs/IMPORT_URL_FETCH_FIX_PHASE_151.md`
- `docs/PROFILE_PANEL_BELOW_HEADER_FIX_PHASE_148.md`
- `docs/ANDROID_RELEASE_CANDIDATE_PHASE_132.md`
- `docs/ANDROID_RELEASE_NOTES_PHASE_132.md`
- `docs/STORE_LISTING_TEXTS_PHASE_131.md`
- `docs/STORE_SCREENSHOTS_CHECKLIST_PHASE_131.md`
- `docs/STORE_DATA_SAFETY_NOTES_PHASE_131.md`
- `docs/STORE_REVIEW_TEST_ACCOUNT_PHASE_131.md`
- `docs/RELEASE_BLOCKERS_HOTFIX_PHASE_134_PRE.md`
- `docs/ANDROID_REAL_DEVICE_RELEASE_TEST_PHASE_133.md`
