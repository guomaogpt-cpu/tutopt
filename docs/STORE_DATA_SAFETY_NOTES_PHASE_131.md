# Store Data Safety Notes — Phase 131 / 134

> Notes for Google Play Data safety form and App Store Privacy Nutrition Labels.  
> **Do not auto-fill Console** — use as reference when completing forms manually.

**Legal review required** before final **production** submission.  
**Phase 134:** use for Internal testing Data Safety form in Play Console.

---

## Data usage summary (for Console)

| Statement | Answer |
|---|---|
| Data used for marketplace operation | Yes — listings, leads, account |
| Some data is public | Yes — published listings, photos, city name in listing |
| Phone/contacts in leads | Visible to seller/buyer within a request |
| Account deletion | Request via https://tutopt-production.up.railway.app/delete-account |
| Payments | Not collected (no in-app purchases) |
| GPS location | Not collected |
| Push notifications | Not active in v1.0.0 — do not declare |

---

## Summary

| Question | Answer |
|---|---|
| Collects data? | Yes |
| Shares data for ads? | No |
| Encryption in transit | Yes (HTTPS) |
| User can request deletion | Yes (request-based) |
| Account required for core features | Partial (browse public; post/request requires login) |

---

## Data types

### 1. Account info

| Field | Detail |
|---|---|
| Examples | Phone, name, profile |
| Purpose | Registration, authentication, account management |
| Required | Phone for primary login |
| Visibility | Private (not public) |
| Who sees | User, admins for support |
| Deletion | Via `/account/delete` request |

### 2. Email address

| Field | Detail |
|---|---|
| Examples | Google OAuth email, profile email |
| Purpose | Optional login, contact |
| Required | No |
| Visibility | Private |
| Deletion | Via account deletion request |

### 3. User-generated listings

| Field | Detail |
|---|---|
| Examples | Title, description, price, category, attributes |
| Purpose | Marketplace listings |
| Visibility | **Public** when published |
| Who sees | All visitors, seller, moderators |
| Deletion | Hidden/deleted on account removal or moderation |

### 4. Listing photos

| Field | Detail |
|---|---|
| Examples | Images uploaded by user |
| Purpose | Illustrate listings |
| Visibility | **Public** when listing published |
| Deletion | Removed with listing/account per policy |

### 5. Leads / requests

| Field | Detail |
|---|---|
| Examples | Buyer name, phone, message, listing reference |
| Purpose | Contact between buyer and seller |
| Visibility | **Private** — seller of listing + buyer |
| Who sees | Seller, buyer, admins for moderation/support |
| Deletion | Via account deletion request |

### 6. Support requests

| Field | Detail |
|---|---|
| Examples | Email to support, deletion requests |
| Purpose | Customer support |
| Visibility | Private |
| Deletion | Processed per support policy |

### 7. Reports / complaints

| Field | Detail |
|---|---|
| Examples | Report reason, listing reference |
| Purpose | Trust & safety, moderation |
| Visibility | Private (staff only) |
| Deletion | Retained for moderation audit |

### 8. City / location

| Field | Detail |
|---|---|
| Examples | City name in listing (text field) |
| Purpose | Search and display |
| Visibility | Public in listing |
| GPS | **Not collected** intentionally |
| Deletion | With listing/account |

### 9. Diagnostics / technical logs

| Field | Detail |
|---|---|
| Examples | IP, session cookies, error logs, audit log |
| Purpose | Security, debugging, abuse prevention |
| Visibility | Internal (staff/infra) |
| Deletion | Rotated per retention policy |

### 10. AI description input (optional)

| Field | Detail |
|---|---|
| Examples | Listing title, category, attributes sent to AI provider |
| Purpose | Generate description draft on user action |
| Visibility | Sent to third-party AI only when user clicks generate |
| Deletion | Per provider retention; user controls published text |

---

## NOT collected (current version)

- Precise GPS location
- Payment / financial info (no in-app payments)
- Device advertising ID (intentionally)
- Push token — **deferred**; do not declare in store until production push enabled
- Contacts list, SMS, call logs

---

## Google Play Data safety mapping hints

| Play category | Likely answer |
|---|---|
| Personal info → Name | Collected, optional |
| Personal info → Email | Collected, optional |
| Personal info → Phone | Collected, required for login |
| Photos and videos | Collected, user-provided |
| App activity → User-generated content | Collected |
| App info → Crash logs | May collect server-side errors |

Mark data as **not sold**, **not used for advertising**.

---

## Account deletion

- Public URL: `/delete-account`
- Authenticated: `/account/delete`
- Method: Request → manual review → delete/anonymize
- Timeline: Several business days (manual)

---

## Связанные документы

- `docs/GOOGLE_PLAY_DATA_SAFETY_NOTES_PHASE_114.md` (earlier draft)
- `docs/GOOGLE_PLAY_INTERNAL_TESTING_PHASE_134.md`
- `docs/GOOGLE_PLAY_RELEASE_BLOCKERS_PHASE_113.md`
- `docs/STORE_READINESS_PACK_PHASE_131.md`
