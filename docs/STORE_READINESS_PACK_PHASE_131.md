# Store Readiness Pack — Phase 131

## 1. Цель

Подготовить комплект материалов для публикации ВсеТут в Google Play и будущего iOS/TestFlight **без фактической публикации**.

---

## 2. Legal pages (UI)

| Route | Status | Notes |
|---|---|---|
| `/privacy` | ✅ updated | Plain language, who sees data, no push section |
| `/terms` | ✅ updated | UGC, moderation, requests, prohibited content |
| `/support` | ✅ updated | Topics + mailto links |
| `/delete-account` | ✅ updated | Public instructions |
| `/account/delete` | ✅ updated | Auth form + confirmation |

**UI:** без грубого «черновик» — показывается дата обновления.  
**Docs:** требуется финальная юридическая проверка перед публикацией.

---

## 3. Store docs created

| Doc | Purpose |
|---|---|
| `STORE_REVIEW_TEST_ACCOUNT_PHASE_131.md` | Test account placeholder |
| `STORE_LISTING_TEXTS_PHASE_131.md` | Short/full description, keywords |
| `STORE_SCREENSHOTS_CHECKLIST_PHASE_131.md` | Screenshot requirements |
| `STORE_DATA_SAFETY_NOTES_PHASE_131.md` | Play Console data safety |
| `IOS_TESTFLIGHT_PREP_PHASE_131.md` | Future iOS plan |

---

## 4. UI components

- `LegalPageShell` — unified layout, back link, related pages
- `LegalPageUpdateNote` — last updated date (replaces draft banner in UI)
- `LEGAL_DRAFT_NOTICE` — internal/docs only

---

## 5. Security

- No real passwords in docs
- No API keys in client
- Test credentials: TO_BE_FILLED placeholders only
- Account deletion scoped to session user

---

## 6. Before Google Play submit

1. Lawyer review privacy + terms
2. Replace support email if needed (`NEXT_PUBLIC_SUPPORT_EMAIL`)
3. Fill legal operator details
4. Create test account + Play Console credentials
5. Capture screenshots per checklist
6. Complete Data safety form
7. Build signed AAB locally
8. Real device QA pass

---

## Migration

Нет.
