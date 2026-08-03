# Manual Production QA — Phase 92

Ручной checklist для действий, которые нельзя надёжно проверить только HTTP/кодом.

## 1. Цель проверки

Закрыть manual gaps после Phase 91 smoke-test:

- создание объявления + upload
- карго-заявка → отклик → контакты владельцу
- Telegram connect + test
- admin moderation / companies

Параллельно улучшен UX success/diagnostic (без новых больших фич).

## 2. Production URL

https://tutopt-production.up.railway.app

## 3. Требуемые тестовые аккаунты

Секреты и пароли **не** хранить в docs.

| Роль | Для чего |
|---|---|
| **Обычный пользователь** | login/register, создать MARKET объявление, создать карго-заявку, видеть `/account/requests` и `/cargo/requests/[id]` |
| **Карго-компания** | карточка CARGO / seller profile, `/account/cargo-settings`, Telegram connect, отклик на чужую заявку, board `/seller/cargo-requests` |
| **Admin** | `/admin`, moderation listings, companies verification, cargo-requests |

Рекомендуется 2 разных телефона/аккаунта для client vs cargo company (нельзя откликаться на свою заявку).

## 4. Сценарий A — обычный пользователь создаёт объявление

1. Открыть production → Войти / Регистрация  
2. `/listings/new` (или Подать)  
3. Тип: **Объявление** (MARKET)  
4. Мин. поля: название, категория, город, цена, описание  
5. Загрузить 1 фото → дождаться «Фото загружено»  
6. Отправить  
7. Success: «Объявление отправлено на модерацию»  
8. CTA: Открыть объявление / Мои объявления / Подать ещё  
9. `/account/listings` — карточка видна (часто статус «На модерации»)  
10. Публичная `/listings/[id]` открывается (owner/admin видят pending)

**Pass criteria:** нет 500, фото через `/api/uploads/...`, success ведёт в кабинет/деталь.

## 5. Сценарий B — upload фото

1. На `/listings/new` выбрать JPG/PNG/WEBP  
2. Дождаться превью и счётчика `N / 10`  
3. Сообщение «Фото загружено»  
4. После submit фото на детальной странице после reload  

**Fail:** upload 4xx/5xx, blob URL в payload, фото пропало после reload.

## 6. Сценарий C — клиент создаёт карго-заявку

1. `/cargo` → «Создать заявку»  
2. Модалка: контакты + маршрут + товар (мин.)  
3. Отправить  
4. Success: «Заявка отправлена»  
5. CTA: **Открыть заявку** → `/cargo/requests/[id]` + «Мои заявки»  
6. `/account/requests?tab=cargoRequests` — заявка есть  

**Pass:** userId привязан (владелец видит заявку), detail не 500, guest без private phone.

## 7. Сценарий D — карго-компания откликается

1. Войти как карго-компания (профиль + желательно CARGO listing)  
2. `/seller/cargo-requests` или `/cargo` → открыть `/cargo/requests/[id]` чужой заявки  
3. «Откликнуться» → цена/срок/комментарий/контакт/телефон  
4. Success: «Отклик отправлен»  
5. Повторный отклик запрещён («Вы уже отправили отклик»)  
6. На своей заявке отклик недоступен  

## 8. Сценарий E — владелец заявки видит контакты отклика

1. Войти как владелец заявки  
2. `/account/requests` или `/cargo/requests/[id]`  
3. Виден отклик: цена, комментарий, **contact name/phone компании**  
4. Guest / чужой user **не** видит эти контакты и не видит телефон клиента  

## 9. Сценарий F — Telegram connect + test message

1. `/account/cargo-settings`  
2. Статус Telegram (не подключён / подключён)  
3. «Подключить» → ссылка бота  
4. В Telegram: Start  
5. На сайте: «Обновить статус» (или дождаться auto-refresh ~4s)  
6. Статус «Telegram подключён» (chatId маскируется)  
7. Test message → «Тестовое сообщение отправлено»  
8. Новая подходящая заявка → Telegram с ссылкой на `/cargo/requests/[id]`  

Env (без значений): `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME`, `NEXT_PUBLIC_APP_URL`, optional `TELEGRAM_WEBHOOK_SECRET`  
Webhook: `https://tutopt-production.up.railway.app/api/webhooks/telegram`

## 10. Сценарий G — admin moderation

1. Войти admin  
2. `/admin` → `/admin/moderation/listings`  
3. Approve / reject тестового объявления → статус меняется  
4. `/admin/companies` — verify/reject если есть очередь  
5. `/admin/cargo-requests` — список / empty state  
6. Обычный user: нет admin links в меню; `/admin` → redirect  

## 11. Найденные проблемы

### P0
- Нет новых P0 в этой фазе (после UUID fix Phase 91). Полный live login e2e — **у владельца продукта**.

### P1 (UX, закрыто в коде)
- После создания карго-заявки не было прямой ссылки на `/cargo/requests/[id]`
- После Telegram Start неочевидно, что нужно обновить статус
- После upload фото не было короткого success hint
- В modal отклика кнопка «OK» без i18n

### P2
- Полный manual run A–G на production с тремя аккаунтами

## 12. Исправленные проблемы

- Cargo success → CTA «Открыть заявку» (`createdRequestId`)
- Telegram: hint + кнопка «Обновить статус»
- Listing upload: «Фото загружено»
- Cargo respond modal: `common.close`
- i18n RU/KG/EN для новых ключей

## 13. Что осталось на потом

- Владелец продукта: прогнать сценарии A–G на production и отметить Pass/Fail в этом файле
- При Fail — создать follow-up с скринами (без секретов)
- Чат / рейтинг / платежи — вне scope

## Phase 92 manual production QA results

| Сценарий | Статус в этой фазе |
|---|---|
| A Listing create | Checklist + success UX уже был; upload hint добавлен |
| B Upload | Checklist + «Фото загружено» |
| C Cargo request | Checklist + open detail CTA |
| D Cargo response | Checklist (код Phase 89/90); modal close i18n |
| E Owner contacts | Checklist (логика Phase 89) |
| F Telegram | Checklist + refresh status CTA |
| G Admin | Checklist (guards Phase 91) |

**Requires owner manual run:** A–G на live с тестовыми аккаунтами.

## Phase 93 live closed beta results

See `docs/CLOSED_BETA_USER_TEST_PHASE_93.md`.

- Closed beta kit + test data
- P0: guest cargo requests required auth (no more orphan `user_id=null`)
- P1: company back link; responses empty copy for non-owners
- Live Pass/Fail still filled by testers with three accounts

## Phase 94 cargo demo readiness

See `docs/CARGO_DEMO_READINESS_PHASE_94.md`.

## Phase 95 cargo closed launch preparation

See `docs/CARGO_CLOSED_LAUNCH_PHASE_95.md`. Onboarding + feedback CTA + closed-launch operator kit for first 5–10 users.
