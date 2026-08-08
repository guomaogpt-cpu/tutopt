# Google Play Release Blockers — Phase 113 / 114

> **Статус:** blockers checklist перед Google Play submission.  
> **Phase 114** добавила legal pages (draft), account deletion request flow, data safety notes.  
> **Не публикуем** в Play Console в этих фазах.

---

## Обязательные blockers

Google Play publish **нельзя** делать, пока не закрыты пункты ниже.

| # | Blocker | Status | Notes |
|---|---|---|---|
| 1 | **Privacy Policy URL** | ⚠️ draft | `/privacy` — expanded draft, **needs legal review** |
| 2 | **Terms of Service URL** | ⚠️ draft | `/terms` — expanded draft, **needs legal review** |
| 3 | **Account deletion page / flow** | ✅ MVP | `/delete-account` (public), `/account/delete` (auth), request API |
| 4 | **Support email / contact** | ⚠️ partial | `/support` added; email placeholder `hello@tutopt.kg` |
| 5 | **App screenshots** | ❌ missing | Phone screenshots for store listing not prepared |
| 6 | **App icon 1024×1024** | ⚠️ partial | PWA icons exist; store marketing asset not finalized |
| 7 | **Short description** | ❌ missing | Play Console listing text not written |
| 8 | **Full description** | ❌ missing | Play Console listing text not written |
| 9 | **Test account for reviewers** | ❌ missing | Phone/password credentials for Google review |
| 10 | **Data safety form** | ⚠️ notes | Draft notes in `docs/GOOGLE_PLAY_DATA_SAFETY_NOTES_PHASE_114.md` — not filled in Console |
| 11 | **User generated content policy** | ⚠️ partial | Terms draft + moderation; report flow exists |
| 12 | **Report listing flow** | ✅ exists | `ReportDialog` on listing detail |
| 13 | **Moderation explanation** | ⚠️ partial | Admin moderation queue exists; review notes not written |
| 14 | **Contact / support flow** | ⚠️ partial | `/support` page; final email TBD |
| 15 | **Signed release AAB** | ⏳ pending | Process documented; keystore must be created locally |
| 16 | **Real Android device QA passed** | ⏳ pending | See `docs/ANDROID_REAL_DEVICE_QA_PHASE_112.md` |
| 17 | **Firebase push credentials** | ⏳ pending | `FIREBASE_*` env + local `google-services.json` — see Phase 117 docs |
| 18 | **Notification permission / privacy copy** | ⚠️ draft | Opt-in UX in `/account`; `/privacy` push section — legal review |

---

## Legal pages (Phase 114)

| Route | Exists | Store-ready |
|---|---|---|
| `/privacy` | ✅ | ❌ draft — требует юридической проверки |
| `/terms` | ✅ | ❌ draft — требует юридической проверки |
| `/support` | ✅ | ⚠️ placeholder support email |
| `/delete-account` | ✅ | ✅ public Google Play web link |
| `/account/delete` | ✅ | ✅ authenticated request form |

**Rule:** Do not publish to Google Play until Privacy Policy and Terms are **final** (lawyer-approved) and ops process for deletion requests is defined.

---

## Account deletion (Phase 114)

**Implemented (MVP):**
- Public page: `/delete-account`
- Authenticated page: `/account/delete`
- API: `POST /api/account/deletion-request` → AuditLog `account_deletion_requested`, status `PENDING`
- Footer + account quick actions links
- No Prisma migration (uses existing AuditLog)

**Not implemented:**
- Automatic user/data deletion
- Admin queue UI
- Email confirmations
- 30-day SLA automation

See `docs/ACCOUNT_DELETION_PHASE_114.md`

---

## UGC / moderation (for review notes)

Product already has:
- Listing moderation workflow (submit → pending → published/rejected)
- Admin moderation queue
- Report listing UI on listing detail

Need for Play:
- Document in review notes how UGC is moderated
- Final Terms with prohibited content list (legal review)
- Support contact for abuse reports (`/support`)

---

## Data safety (Google Play Console)

Draft mapping: `docs/GOOGLE_PLAY_DATA_SAFETY_NOTES_PHASE_114.md`

| Data type | Collected | Purpose |
|---|---|---|
| Name, phone | ✅ | Account, listings |
| Email | ✅ optional | Google OAuth |
| Photos | ✅ | Listing images, cargo requests |
| User content | ✅ | Listings, leads, cargo requests |
| Device IDs | ❌ intentional | Not collected intentionally |
| Location | ❌ GPS | City text field only |
| AI input | ✅ optional | Description generation on user action |

Encryption in transit: ✅ HTTPS  
Data deletion: ⚠️ request-based; manual processing

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
| 114 ✅ | Legal pages (draft), account deletion request, data safety notes |
| 115 | Store assets + Play Console internal testing upload |
| 116 | Production rollout (after QA + legal sign-off) |

---

## Связанные документы

- `docs/ACCOUNT_DELETION_PHASE_114.md`
- `docs/GOOGLE_PLAY_DATA_SAFETY_NOTES_PHASE_114.md`
- `docs/ANDROID_RELEASE_AAB_PHASE_113.md`
- `docs/GOOGLE_PLAY_READINESS_CHECKLIST_PHASE_108.md`
- `docs/MOBILE_APP_ROADMAP_PHASE_107.md`
