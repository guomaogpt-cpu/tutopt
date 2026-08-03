# Closed Beta User Test — Phase 93

## 1. Цель тестирования

Провести живой closed beta с тремя ролями на production и закрыть только реальные P0/P1. Новые крупные функции не добавляются.

## 2. Production URL

https://tutopt-production.up.railway.app

## 3. Тестовые роли

| Роль | Задачи | Секреты |
|---|---|---|
| Обычный пользователь | объявление, избранное, кабинет, карго-заявка | пароли не записывать |
| Карго-компания | профиль компании, cargo-settings, Telegram, отклик | токены не записывать |
| Admin | moderation, companies, cargo-requests | — |

Нужны **два разных** обычных/карго аккаунта: нельзя откликаться на свою заявку.

## 4. Инструкция для тестеров

1. Открыть production URL (не localhost).
2. Использовать только свой тестовый аккаунт роли.
3. Заполнять форму данными из раздела «тестовый набор» ниже.
4. На каждый fail: сценарий, шаг, ожидание, факт, скрин (без паролей/токенов).
5. После Start в Telegram вернуться на сайт и нажать **Обновить статус**.

## Тестовый набор данных

**Объявление**
- Название: Тестовый товар для проверки
- Описание: Тестовое описание объявления
- Город: Бишкек
- Цена: 1000
- Тип: Объявление

**Услуга**
- Название: Тестовая услуга
- Описание: Проверка публикации услуги
- Город: Бишкек

**Компания**
- Название: Test Cargo Company
- Тип: Карго-компания
- Город: Бишкек
- Описание: Тестовая компания для проверки карго-заявок

**Карго-заявка**
- Откуда: Гуанчжоу
- Куда: Бишкек
- Товар: Тестовый груз
- Вес: 10 кг
- Габариты: 50×40×30 см
- Комментарий: Тестовая заявка

**Отклик**
- Цена: 100
- Валюта: USD
- Срок: 7–10 дней
- Комментарий: Тестовый отклик карго-компании

## 5. Сценарий A — обычный пользователь

1. `/` → разделы Опт / Объявления / Услуги / Карго  
2. `/market` → `/listings` → карточка  
3. Избранное (guest → login с `next`)  
4. После входа → `/account`  

**Pass:** нет buyer/seller терминов; кабинет = `/account`; mobile nav ок.

## 6. Сценарий B — публикация объявления

1. Guest «Подать» → login `next=/listings/new`  
2. Тип «Объявление», фото → «Фото загружено»  
3. Submit → success «на модерацию»  
4. `/account/listings` + публичная страница  

## 7. Сценарий C — профиль компании

1. `/account/company` (ссылка «Личный кабинет»)  
2. Создать Test Cargo Company  
3. Видно в `/account`, публичная страница  
4. Опционально: публикация от компании  

## 8. Сценарий D — карго-заявка

1. **Сначала войти** (гость больше не создаёт orphan-заявки)  
2. `/cargo` → Создать заявку → данные выше  
3. Success → **Открыть заявку** `/cargo/requests/[id]`  
4. `/account/requests` — заявка есть  
5. Guest на чужой заявке: без телефона клиента  

## 9. Сценарий E — карго-компания и отклик

1. Карго-аккаунт: карточка + `/account/cargo-settings`  
2. Открыть чужую заявку → отклик  
3. Повторный отклик запрещён; на свою — нельзя  
4. Владелец видит контакт компании в отклике  

## 10. Сценарий F — Telegram

1. `/account/cargo-settings` → Подключить → Start в боте  
2. **Обновить статус** → connected (chatId маскируется)  
3. Test message  
4. Новая подходящая заявка → Telegram link на `/cargo/requests/[id]`  

Env (без значений): `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME`, `NEXT_PUBLIC_APP_URL`, optional `TELEGRAM_WEBHOOK_SECRET`  
Webhook: `https://tutopt-production.up.railway.app/api/webhooks/telegram`

## 11. Сценарий G — admin

1. `/admin` → moderation approve/reject  
2. `/admin/companies` verify/reject  
3. Обычный user: нет admin links; `/admin` → redirect  

## 12. Таблица найденных проблем

| ID | Сценарий | Роль | Шаг | Ожидание | Факт | Приоритет | Решение | Статус |
|---|---|---|---|---|---|---|---|---|
| B93-01 | D | guest | создать заявку без входа | отклики/контакты доходят до клиента | `user_id=null` → orphan, owner не видит отклики | P0 | Require auth на API + login CTA в модалке | Fixed |
| B93-02 | C | user | `/account/company` | вернуться в кабинет | не было crumb | P1 | Ссылка «Личный кабинет» | Fixed |
| B93-03 | D/E | guest | detail с откликами | понятно, почему список пуст | count > 0 + «нет откликов» | P1 | Текст «отклики видит владелец» | Fixed |
| B93-04 | A–G | all | live login e2e | полный прогон | нет тестовых паролей у агента | — | Owner/testers | Pending manual |

## 13. Исправленные проблемы

- Карго-заявка только для авторизованных (`user_id` обязателен)
- Guest modal: login/register вместо мёртвой формы
- Company page: back to `/account`
- Cargo detail: корректный empty state для non-owner

## 14. Backlog

- P2: auto-favorite после login  
- P2: claim-token для legacy guest requests (если остались в БД)  
- P3: visual polish  

## 15. Решение о готовности

**Готово к первой группе закрытых тестеров** при условии:

1. Есть 3 аккаунта (user / cargo / admin)  
2. Telegram env + webhook настроены  
3. Тестеры прогоняют A–G по этому документу и отмечают Pass/Fail  

Не готово к открытому трафику без: успешного Pass по B–F у тестеров и admin G.

## Phase 93 live closed beta results

- Kit + test data documented  
- P0 guest orphan cargo fixed  
- P1 company back-link + responses empty copy fixed  
- Full authenticated live A–G: **requires tester accounts (owner)**
