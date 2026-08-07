# Google Play Release Blockers — Phase 113

> **Статус:** blockers checklist перед Google Play submission.  
> **Phase 113 не публикует** в Play Console.

---

## Обязательные blockers

Google Play publish **нельзя** делать, пока не закрыты пункты ниже.

| # | Blocker | Status | Notes |
|---|---|---|---|
| 1 | **Privacy Policy URL** | ⚠️ partial | `/privacy` exists — draft text, not final legal review |
| 2 | **Terms of Service URL** | ⚠️ partial | `/terms` exists — draft text, not final legal review |
| 3 | **Account deletion page / flow** | ❌ missing | No `/account/delete`, no self-service API |
| 4 | **Support email / contact** | ❌ missing | No `/support` page; no public support email in app |
| 5 | **App screenshots** | ❌ missing | Phone screenshots for store listing not prepared |
| 6 | **App icon 1024×1024** | ⚠️ partial | PWA icons exist; store marketing asset not finalized |
| 7 | **Short description** | ❌ missing | Play Console listing text not written |
| 8 | **Full description** | ❌ missing | Play Console listing text not written |
| 9 | **Test account for reviewers** | ❌ missing | Phone/password credentials for Google review |
| 10 | **Data safety form** | ❌ missing | Play Console questionnaire not filled |
| 11 | **User generated content policy** | ⚠️ partial | Moderation exists in product; not documented for store |
| 12 | **Report listing flow** | ⚠️ verify | Check listing detail report UI/API exists |
| 13 | **Moderation explanation** | ⚠️ partial | Admin moderation queue exists; review notes not written |
| 14 | **Contact / support flow** | ❌ missing | No dedicated support channel in app |
| 15 | **Signed release AAB** | ⏳ pending | Process documented; keystore must be created locally |
| 16 | **Real Android device QA passed** | ⏳ pending | See `docs/ANDROID_REAL_DEVICE_QA_PHASE_112.md` |

---

## Legal pages (current state)

| Route | Exists | Store-ready |
|---|---|---|
| `/privacy` | ✅ | ❌ draft — «полный юридический текст будет опубликован» |
| `/terms` | ✅ | ❌ draft — same disclaimer |
| `/support` | ❌ | — |
| `/account/delete` | ❌ | — |

**Rule:** Do not publish to Google Play until Privacy Policy and Terms are final and account deletion is available.

---

## Account deletion (required by Google / Apple)

**Current:** no self-service account deletion.

**Minimum for Play Store:**
- In-app path or web page explaining how to request deletion
- Deletion within reasonable timeframe (Google: 30 days max for request handling)
- Data removed from active systems

**Proposed Phase 114:**
- `/account/settings` → «Удалить аккаунт»
- Server route: soft-delete or anonymize user + listings
- Confirmation email / phone OTP

---

## UGC / moderation (for review notes)

Product already has:
- Listing moderation workflow (submit → pending → published/rejected)
- Admin moderation queue

Need for Play:
- Document in review notes how UGC is moderated
- Report/abuse flow visible to users
- Support contact for abuse reports

---

## Data safety (Google Play Console)

Declare approximately:

| Data type | Collected | Purpose |
|---|---|---|
| Name, phone | ✅ | Account, listings |
| Photos | ✅ | Listing images, cargo requests |
| User content | ✅ | Listings, messages, cargo requests |
| Device IDs | ❌ | Not collected intentionally |
| Location | ❌ | City text field only, no GPS |

Encryption in transit: ✅ HTTPS  
Data deletion: ❌ until account deletion ships

---

## Store assets checklist

- [ ] Feature graphic 1024×500
- [ ] Phone screenshots (min 2):
  - [ ] Home
  - [ ] Market / listings
  - [ ] Create listing
  - [ ] Listing detail
  - [ ] Account
  - [ ] Cargo
- [ ] App icon 512×512 (Play) / 1024×1024 (high-res)
- [ ] Short description (≤80 chars)
- [ ] Full description (≤4000 chars)

---

## Test account for Google reviewers

Prepare before submission:

- Phone + password login (primary — Google OAuth may fail in WebView)
- Test user with sample listings
- Credentials in Play Console → App access → testing instructions

---

## Signed AAB

| Item | Status |
|---|---|
| Release signing docs | ✅ `docs/ANDROID_RELEASE_AAB_PHASE_113.md` |
| `key.properties.example` | ✅ committed |
| Local keystore | ⏳ owner creates |
| Signed `app-release.aab` | ⏳ after keystore |

---

## Recommended phase order

| Phase | Scope |
|---|---|
| 113 ✅ | Release AAB prep, signing docs, blockers checklist |
| 114 | Legal pages final + account deletion |
| 115 | Store assets + Play Console internal testing upload |
| 116 | Production rollout (after QA + legal sign-off) |

---

## Связанные документы

- `docs/ANDROID_RELEASE_AAB_PHASE_113.md`
- `docs/GOOGLE_PLAY_READINESS_CHECKLIST_PHASE_108.md`
- `docs/MOBILE_APP_ROADMAP_PHASE_107.md`
