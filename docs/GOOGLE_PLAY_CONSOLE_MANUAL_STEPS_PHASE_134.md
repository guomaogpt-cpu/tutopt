# Google Play Console — Manual Steps (Phase 134)

> **Internal testing only.** Это **не** production release.

---

## Prerequisites

- Google Play Developer account (owner)
- **Fresh signed AAB** после Phase 134-pre hotfix
- AAB path: `android/app/build/outputs/bundle/release/app-release.aab`
- AAB **не** коммитить в git

---

## Step-by-step

### 1. Open Google Play Console

https://play.google.com/console

Sign in as project owner.

### 2. Create app (if not exists)

- Click **Create app**
- App name: **ВсеТут**
- Default language: Russian (ru-RU) or as needed
- App or game: **App**
- Free or paid: **Free**
- Declarations: accept policies

### 3. Set up app — Dashboard checklist

Complete required sections before internal testing release:

| Section | Action |
|---|---|
| App access | See `GOOGLE_PLAY_APP_ACCESS_NOTES_PHASE_134.md` + test account |
| Ads | Declare if app contains ads (typically No) |
| Content rating | Complete questionnaire (UGC marketplace) |
| Target audience | Adults / general |
| News app | No |
| COVID-19 | No |
| Data safety | Fill from `STORE_DATA_SAFETY_NOTES_PHASE_131.md` |
| Government apps | No |
| Financial features | No in-app payments in v1.0.0 |

### 4. Store listing (draft minimum)

From `STORE_LISTING_TEXTS_PHASE_131.md`:

- App name: **ВсеТут**
- Short description (≤80 chars)
- Full description
- App icon (512×512)
- Phone screenshots (min 2, recommend 6–8)
- Feature graphic (1024×500) — if required
- Privacy Policy URL: https://tutopt-production.up.railway.app/privacy
- Category: **Shopping**

### 5. Internal testing track

1. Left menu → **Testing** → **Internal testing**
2. Click **Create new release**
3. Upload **fresh signed AAB** (`app-release.aab`)
4. Release name: `1.0.0 (1)` or `Internal 1`
5. Release notes (ru-RU) — copy from `ANDROID_RELEASE_NOTES_PHASE_132.md`
6. Review → **Save** → **Start rollout to Internal testing**

**Important:** This rolls out to **internal testers only**, not production.

### 6. Testers group

1. **Testing** → **Internal testing** → **Testers** tab
2. Create email list (Gmail accounts)
3. Add owner + 2–5 trusted testers
4. Copy **opt-in URL** → share with testers

See `GOOGLE_PLAY_TESTERS_PHASE_134.md`

### 7. App access (for future review / store checks)

**Testing** → **Internal testing** or **App content** → **App access**

- Select: Some or all functionality requires sign-in
- Paste instructions from `GOOGLE_PLAY_APP_ACCESS_NOTES_PHASE_134.md`
- Enter test account phone + password **here only** (not in git)

### 8. Privacy policy URL

**Policy** → **App content** → Privacy policy:

```
https://tutopt-production.up.railway.app/privacy
```

### 9. Data safety

**Policy** → **Data safety**

Fill using `STORE_DATA_SAFETY_NOTES_PHASE_131.md`:
- Collected: yes
- Shared for ads: no
- Encryption in transit: yes
- Account deletion: yes (request-based)

### 10. Support contact

Use support email from `/support` page (e.g. hello@tutopt.kg — confirm with owner).

### 11. Screenshots

Capture per `STORE_SCREENSHOTS_CHECKLIST_PHASE_131.md` on **post–134-pre** build.

### 12. Review and rollout

- Verify release shows **Internal testing** (not Production)
- Status: Available to internal testers
- Testers install via opt-in link

---

## What this is NOT

| Action | Phase 134 |
|---|---|
| Internal testing rollout | ✅ |
| Closed testing (production track) | ❌ |
| Open testing | ❌ |
| Production release | ❌ |
| Staged rollout to all users | ❌ |

---

## After internal testing

1. Collect tester feedback
2. Fix critical bugs → new AAB → increment `versionCode`
3. Only after stable internal pass → consider closed testing
4. Legal review before production

---

## Связанные документы

- `docs/GOOGLE_PLAY_INTERNAL_TESTING_PHASE_134.md`
- `docs/GOOGLE_PLAY_TESTERS_PHASE_134.md`
- `docs/GOOGLE_PLAY_APP_ACCESS_NOTES_PHASE_134.md`
