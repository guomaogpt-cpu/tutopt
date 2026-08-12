# Store Review Test Account — Phase 131

> **Важно:** не коммитить реальные пароли, OTP-коды и секреты в публичный репозиторий.

## Назначение

Google Play и App Store могут запросить тестовый аккаунт для проверки приложения. Перед отправкой на review подготовьте учётную запись и опишите credentials **только** в Play Console / App Store Connect (не в git).

---

## Требования к тестовому аккаунту

| Параметр | Значение |
|---|---|
| Роль | Обычный пользователь (SELLER или BUYER) |
| Вход | Телефон + пароль (основной способ; Google OAuth в WebView может быть нестабилен) |
| Доступ | Без admin/moderator прав |

---

## Что reviewer должен уметь проверить

1. **Войти** — `/login` с телефоном и паролем
2. **Открыть объявления** — главная, `/listings`, страница объявления
3. **Подать объявление** — `/listings/new` (draft → submit for moderation)
4. **Открыть кабинет** — `/account`
5. **Отправить заявку** — форма «Связаться» на чужом объявлении
6. **Пожаловаться** — кнопка «Пожаловаться» на странице объявления

---

## Что подготовить вручную перед submission

- [ ] Телефон тестового аккаунта
- [ ] Пароль (надёжный, только для review)
- [ ] Email (если используется)
- [ ] 1–2 опубликованных тестовых объявления (без реальных телефонов клиентов)
- [ ] 1 тестовая заявка (optional)
- [ ] Инструкции для reviewer в Play Console → App access

---

## Placeholder (заполнить перед отправкой)

**⚠️ Перед отправкой в Google Play:** владелец проекта вручную создаёт тестовый аккаунт и заполняет данные **только в Google Play Console → App access → Testing instructions**. Не добавлять реальные пароли в git, docs или issue tracker.

```
Review test account:
Login: TO_BE_FILLED
Password: TO_BE_FILLED
Notes: TO_BE_FILLED
```

**Пример Notes для reviewer:**

```
1. Open app → Login with phone + password above.
2. Home → tap listing → Contact seller to send a request.
3. Bottom nav → Post (+) to create a listing.
4. Profile tab → Account → My listings / My requests.
5. On listing detail → Report button for complaints flow.
Support: https://tutopt-production.up.railway.app/support
Privacy: https://tutopt-production.up.railway.app/privacy
Account deletion: https://tutopt-production.up.railway.app/delete-account
```

---

## OTP / demo flow

Если в production используется SMS OTP:
- подготовить тестовый номер с известным кодом **или**
- временно включить demo/test mode для review периода **или**
- указать reviewer instructions для получения кода через support

Не документировать реальные OTP-секреты в репозитории.

---

## Связанные документы

- `docs/STORE_LISTING_TEXTS_PHASE_131.md`
- `docs/GOOGLE_PLAY_RELEASE_BLOCKERS_PHASE_113.md`
- `docs/IOS_TESTFLIGHT_PREP_PHASE_131.md`
