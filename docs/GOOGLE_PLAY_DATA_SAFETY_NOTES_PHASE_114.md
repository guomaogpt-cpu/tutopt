# Google Play Data Safety Notes — Phase 114

> **Назначение:** черновик для заполнения Play Console → App content → Data safety.  
> **Не юридическая декларация** — сверить с финальной Privacy Policy и фактическим кодом перед submit.

---

## App context

| Field | Value |
|---|---|
| App name | ВсеТут |
| Package | `kg.vsetut.app` |
| Type | Capacitor WebView → production web app |
| User accounts | Yes (phone OTP, optional Google OAuth) |
| User-generated content | Yes (listings, photos, cargo requests, leads) |

---

## Possible collected data

### Personal info

| Data | Collected | Optional | Notes |
|---|---|---|---|
| Phone number | Yes | No (primary login) | Account auth |
| Name / profile name | Yes | Partial | Display on listings |
| Email | Yes | Yes | If Google OAuth linked |
| User IDs | Yes | No | Internal account id |

### Photos and videos

| Data | Collected | Notes |
|---|---|---|
| Listing photos | Yes | Uploaded by user for ads |
| Cargo request photos | Yes | If user attaches images |

### App activity

| Data | Collected | Notes |
|---|---|---|
| Listings created/edited | Yes | User-generated content |
| Favorites | Yes | Saved listings |
| Leads / buyer requests | Yes | Inquiry flow |
| Cargo requests | Yes | Shipping request forms |
| Search / browse history | Partial | Server logs may include URLs; no dedicated analytics product declared |

### Messages / requests

| Data | Collected | Notes |
|---|---|---|
| Inquiry / lead messages | Yes | Text submitted via listing contact flows |
| Cargo request details | Yes | Origin, destination, cargo description |

### Device or other IDs

| Data | Collected | Notes |
|---|---|---|
| Advertising ID | No | Not intentionally collected |
| Device ID | Partial | Standard HTTP logs, session cookies |
| Push token (FCM) | Yes (opt-in) | Android app only; stored for notification delivery |
| Precise GPS location | No | City is user-entered text field |

### App info and performance

| Data | Collected | Notes |
|---|---|---|
| Crash logs | Possible | Hosting platform / server logs |
| Diagnostics | Possible | Error logs on Railway infrastructure |

---

## Data purposes (Play Console mapping)

| Purpose | Applies to |
|---|---|
| App functionality | Auth, listings, favorites, cargo, notifications, listing moderation status |
| Notification delivery | Push tokens → Firebase Cloud Messaging (Android) |
| Account management | Profile, login, deletion requests |
| User-generated content | Listings, photos, descriptions |
| Security / fraud prevention | Rate limits, moderation, audit logs |
| Customer support | Support email, deletion requests |
| Analytics | Minimal — confirm before declaring; no third-party analytics SDK in Capacitor wrapper |
| Personalization | Favorites, account dashboard |
| AI features (optional) | Listing description generation when user clicks generate |

---

## AI description generation

When user explicitly requests AI-generated listing description:

- Input: title, category, characteristics, partial description user typed
- Sent to: OpenAI API (or configured AI provider)
- Purpose: generate draft text only
- User must review before publish
- Do **not** declare «data not shared» if AI path is enabled in production

---

## Data sharing

| Recipient | Shared data | Purpose |
|---|---|---|
| Cloud hosting (Railway) | All server-processed data | Infrastructure |
| AI provider (OpenAI) | Listing draft fields | Only on user-initiated generation |
| Google (OAuth) | Email, name | If user chooses Google sign-in |
| Google (Firebase Cloud Messaging) | Push token, notification payload | Android push delivery only; user opt-in |

**Data sale:** declare «No» — push tokens are not sold to third parties (verify with legal).

**Push opt-out:** user can disable in `/account` or Android system settings; server marks token `enabled=false`.

**Encryption in transit:** Yes (HTTPS to production URL).

**Encryption at rest:** Depends on hosting DB config — confirm with infra.

**Data deletion:** Account deletion request flow added Phase 114; full automated deletion not yet implemented. Declare deletion request available; actual removal is manual review.

---

## User-generated content (store policy)

App contains UGC:

- Listings (title, description, price, photos)
- Cargo requests
- Leads / inquiries

**Moderation in product:**
- Listing submit → pending → published/rejected (admin moderation)
- Terms prohibit illegal goods, spam, fraud

**Report flow:**
- ✅ `ReportDialog` on listing detail page — user can report listing
- Admin moderation queue exists

**If asked in Play Console:** explain moderation + report button + support email.

---

## Play Console checklist (draft answers)

- [ ] Does your app collect or share user data? → **Yes**
- [ ] Is all data encrypted in transit? → **Yes** (HTTPS)
- [ ] Can users request account deletion? → **Yes** (`/delete-account`, `/account/delete`)
- [ ] Is data used for advertising? → **No** (unless changed — re-audit)
- [ ] Photos → collected, user-provided, app functionality
- [ ] Personal info → phone, name, optional email
- [ ] User-generated content → yes, moderated

---

## Blockers before final Data safety submit

| Item | Status |
|---|---|
| Final Privacy Policy | ⏳ draft — legal review |
| Confirmed operator / legal entity | ⏳ placeholder |
| Final support email | ⏳ `hello@tutopt.kg` or `NEXT_PUBLIC_SUPPORT_EMAIL` |
| Verify OpenAI usage in production | ⏳ confirm env |
| Automated deletion vs manual | ⏳ declare accurately |
| Analytics / crash SDK audit | ⏳ confirm no undeclared SDKs |
| Firebase credentials for push | ⏳ set on Railway before production push |
| Notification permission UX copy | ✅ opt-in in `/account` (Phase 117) |
| Privacy Policy push section | ⚠️ draft on `/privacy` — legal review |

---

## Связанные документы

- `docs/ACCOUNT_DELETION_PHASE_114.md`
- `docs/GOOGLE_PLAY_RELEASE_BLOCKERS_PHASE_113.md`
- `/privacy` (draft)
- `/terms` (draft)
