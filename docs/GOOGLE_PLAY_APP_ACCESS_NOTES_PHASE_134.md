# Google Play App Access Notes — Phase 134

> Copy into **Google Play Console → App content → App access**.  
> **Never commit** real login/password in git.

---

## App access summary (English — for Console)

```
App access:

Some features are available without login, such as browsing listings and viewing public pages.

Creating listings, sending requests, managing account data, reporting listings, and account deletion request require login.

A test account will be provided in the Play Console App access section.
```

---

## Russian variant (optional, for localized Console fields)

```
Доступ к приложению:

Часть функций доступна без входа: просмотр объявлений и публичных страниц.

Для создания объявлений, отправки заявок, управления аккаунтом, жалоб и запроса удаления аккаунта требуется вход.

Тестовый аккаунт будет указан в разделе App access в Play Console.
```

---

## Test account — enter in Console only

**⚠️ Do not paste real credentials in repo, docs, or issues.**

In Play Console → App access → Testing instructions:

```
Review test account:
Login (phone): TO_BE_FILLED_IN_CONSOLE
Password: TO_BE_FILLED_IN_CONSOLE

Instructions:
1. Open app → Login with phone + password above.
2. Home → search → open listing → Contact seller.
3. Bottom nav → Post (+) → create listing.
4. Profile → Account → «Управление» → Мои объявления / Мои заявки.
5. Listing detail → Report for complaints flow.
6. Account → Support, Privacy, Delete account links work in WebView.

Support: https://tutopt-production.up.railway.app/support
Privacy: https://tutopt-production.up.railway.app/privacy
Account deletion: https://tutopt-production.up.railway.app/delete-account
```

Replace `TO_BE_FILLED_IN_CONSOLE` with real values **only in Play Console**.

---

## What reviewer / tester must access

| Feature | Requires login |
|---|---|
| Browse listings, search | No |
| View listing detail | No |
| View company public page | No |
| Privacy / Terms / Support | No |
| Create listing | Yes |
| Send lead / request | Yes |
| Account / My listings | Yes |
| Favorites | Yes |
| Report listing | Yes |
| Account deletion request | Yes (authenticated flow) |

---

## Placeholder in repo

See `docs/STORE_REVIEW_TEST_ACCOUNT_PHASE_131.md` — placeholders only.

---

## Связанные документы

- `docs/STORE_REVIEW_TEST_ACCOUNT_PHASE_131.md`
- `docs/GOOGLE_PLAY_INTERNAL_TESTING_PHASE_134.md`
- `docs/GOOGLE_PLAY_CONSOLE_MANUAL_STEPS_PHASE_134.md`
