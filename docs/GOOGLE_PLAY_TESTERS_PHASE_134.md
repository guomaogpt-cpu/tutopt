# Google Play Internal Testers — Phase 134

> **Internal testing only.** Trusted testers, not public users.

---

## Internal testers setup

### Who to add

| Rule | Detail |
|---|---|
| Account type | Gmail / Google accounts only |
| Minimum | Project owner + 2 trusted testers |
| Recommended | 3–5 testers total |
| Do not add | Random clients, untrusted emails on first pass |

### How to add

1. Play Console → **Testing** → **Internal testing** → **Testers**
2. Create list e.g. `vsetut-internal-v1`
3. Add emails (one per line)
4. Save → share **opt-in URL** with list members
5. Testers accept invite → install from Play Store

---

## What testers should verify

After installing from Play **internal testing** link:

| # | Scenario |
|---|---|
| 1 | Install completes without errors |
| 2 | App opens → home loads (production URL) |
| 3 | Login / register (phone + password) |
| 4 | Search from home → results with query preserved |
| 5 | Open listing detail |
| 6 | Send lead / request to seller |
| 7 | Create listing → success (no false error) |
| 8 | Upload photo from gallery |
| 9 | Account → «Управление» → Мои объявления |
| 10 | Company public page (if applicable) |
| 11 | Report listing |
| 12 | Open /privacy, /terms, /support, /delete-account |
| 13 | Android Back button |
| 14 | Keyboard in forms (no overlap with bottom nav) |

**Login tip:** Prefer phone + password. Google OAuth may be unstable in WebView.

---

## Tester feedback table

Fill after internal testing session:

| Tester | Device | Android version | Result | Issues |
|---|---|---|---|---|
| | | | Pass / Fail / Partial | |
| | | | | |
| | | | | |
| | | | | |
| | | | | |

---

## Reporting issues

For each issue record:

- Steps to reproduce
- Expected vs actual
- Screenshot (no real client PII)
- Build: internal testing `1.0.0 (1)` + date

Critical blockers → fix before closed testing.

---

## Security

- Do not share internal testing link publicly
- Do not post test account credentials in chat/email groups
- Credentials only in Play Console App access

---

## Связанные документы

- `docs/GOOGLE_PLAY_INTERNAL_TESTING_PHASE_134.md`
- `docs/GOOGLE_PLAY_CONSOLE_MANUAL_STEPS_PHASE_134.md`
- `docs/ANDROID_REAL_DEVICE_RELEASE_TEST_PHASE_133.md`
