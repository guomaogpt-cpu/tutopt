# User Generated Content Safety — Phase 125

Notes for Google Play UGC policy and in-app review submission.

---

## What users can publish

- Text listings (title, description, price, characteristics)
- Photos attached to listings
- Cargo requests and responses
- Company/seller profile information

---

## Moderation

| Layer | Implementation |
|---|---|
| Pre-publish | Listings go to `PENDING_MODERATION` → staff approve/reject |
| Post-publish | Users can report via «Пожаловаться» on listing detail |
| Admin review | `/admin/reports` — manual review, no auto-block |
| Hide action | Staff sets listing to `REJECTED`; author notified in-app |

---

## Report mechanism

- Button on `/listings/[id]` (not primary CTA)
- Auth required
- Reasons: fraud, prohibited item, wrong category/price, offensive content, duplicate, outdated, other
- One active report per user per listing
- Support contact: `/support`

---

## Prohibited content

Documented in `/terms` §4 (draft — **requires legal review**):

- Illegal goods/services
- Weapons, ammunition
- Drugs and controlled substances
- Fake documents, fraud
- IP violations
- Dangerous goods without permits
- Offensive/extremist content
- Content illegal under Kyrgyz Republic law

---

## Account safety

- Account deletion request: `/delete-account`, `/account/delete` (Phase 114)
- User blocking/restrictions: admin tools (existing)
- Privacy policy: `/privacy` (draft)

---

## For Play Console review notes

Suggested text:

> ВсеТут allows users to post classified listings with photos. New listings are moderated before publication. Users can report suspicious listings from the listing page. Reports are reviewed manually by moderators who can hide content and notify the author. Prohibited content is described in Terms of Service. Support: /support. Account deletion: /delete-account.

---

## Related docs

- `docs/TRUST_SAFETY_REPORTS_PHASE_125.md`
- `docs/GOOGLE_PLAY_RELEASE_BLOCKERS_PHASE_113.md`
- `docs/GOOGLE_PLAY_DATA_SAFETY_NOTES_PHASE_114.md`
- `docs/LISTING_MODERATION_NOTIFICATIONS_PHASE_118.md`
