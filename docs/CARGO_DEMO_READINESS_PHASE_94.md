# Cargo Demo Readiness — Phase 94

## 1. Цель

Подготовить карго-раздел к презентации как **рабочий MVP**: контрольный сценарий, demo-safe тексты/empty/status, privacy, Telegram assumptions. Без новых крупных функций.

## 2. Что уже работает

- `/cargo` — hero, компании, актуальные заявки, dual CTA
- Создание заявки (только после входа) → success → `/cargo/requests/[id]`
- Отклики карго-компаний; owner видит контакты отклика
- `/account/requests`, `/account/cargo-settings`
- Telegram connect / refresh / test / notify link на detail
- Invalid UUID → safe not-found (не Prisma 500)

## 3. Что показываем на презентации

**Карго MVP** позволяет клиенту оставить заявку на перевозку, карго-компаниям получить заявку и отправить отклик, а клиенту увидеть условия и контакт исполнителя. Telegram используется для оперативных уведомлений карго-компаний.

Показать живой loop: заявка → detail → отклик → контакты у владельца → (опционально) Telegram.

## 4. Что не обещаем как готовое

Не позиционировать как:

- полностью готовый продукт / финальная версия
- production-grade logistics CRM
- автоматизированная карго-платформа полного цикла
- чат, рейтинг, платежи, тарифы, сотрудники компании

## 5. Демо-сценарий

1. **`/cargo`** — hero, «Создать заявку», компании, актуальные заявки, «Нужна перевозка?» / «Вы карго-компания?»
2. **Создать заявку** (залогинен): Гуанчжоу → Бишкек, Тестовый груз, 10 кг, 50×40×30, комментарий «Проверка карго MVP»
3. **Detail** `/cargo/requests/[id]` — маршрут, товар, статус; guest без телефона клиента
4. **Карго-компания** — `/account/cargo-settings`, Telegram status, открыть заявку, отклик (100 USD, 7–10 дней)
5. **Клиент** — `/account/requests` → отклик: цена, срок, комментарий, контакт компании
6. **Telegram** — test message; notification по заявке; link → production `/cargo/requests/[id]`

## 6. Тестовые аккаунты без паролей

| Роль | Назначение |
|---|---|
| Клиент | создать заявку, видеть отклики |
| Карго-компания | settings, Telegram, отклик |
| Admin (опционально) | модерация / cargo-requests |

Пароли и токены не записывать.

## 7. Тестовые данные

См. сценарий выше. Не использовать реальные телефоны клиентов, коммерческие секреты, токены. Тестовый контакт в отклике — вымышленный.

## 8. Контрольный checklist

- [ ] `/cargo` 200, CTA видны, orange theme
- [ ] Login → создать заявку → open detail
- [ ] Guest detail без `tel:` клиента
- [ ] Компания откликается; повтор запрещён; своя заявка — нельзя
- [ ] Owner видит контакт компании
- [ ] Статусы человекочитаемые (не raw NEW/ACCEPTED)
- [ ] Empty: компании / заявки / board / settings понятны
- [ ] Telegram refresh + test + notify link
- [ ] Mobile: modal/drawer, без critical overflow

## 9. Риски

| Риск | Митигация |
|---|---|
| Telegram env не настроен | Показать UI status + docs env names; skip live notify |
| Нет второй учётки карго | Подготовить до презентации |
| Старые guest orphan-заявки в БД | Новые только с auth; orphans не показывать как happy-path |
| DNS/deploy lag | Проверить URL за 30 мин до демо |

## 10. Что исправлено перед демо

- Короче hero subtitle
- Empty state актуальных заявок (title + description + CTA)
- Guest login button → «Войти»
- Статусы отклика: «Новый отклик» / «Отклик принят»
- Меньше технического copy на board empty / contactsRestricted
- Empty CTA открывает модалку создания заявки

## 11. Решение: готово / не готово к презентации

**Готово к презентации как MVP**, если:

1. Два аккаунта (клиент + карго) и (желательно) Telegram env  
2. Контрольный checklist пройден за 10–15 минут до встречи  

Не готово обещать «полный продукт» или live Telegram, если webhook/token не проверены в этот день.

## Phase 94 cargo demo readiness

Product framing: MVP shipping request ↔ company response ↔ owner contacts (+ optional Telegram). Demo kit and copy polish shipped in this phase.

## Phase 95 cargo closed launch preparation

See `docs/CARGO_CLOSED_LAUNCH_PHASE_95.md`. Closed launch for 5–10 users: short onboarding, client/company instructions, feedback CTA, operator + metrics checklists.

## Phase 96 closed launch results and fixes

See `docs/CARGO_CLOSED_LAUNCH_RESULTS_PHASE_96.md`.

## Phase 97 second closed cycle preparation

See `docs/CARGO_SECOND_CLOSED_CYCLE_PHASE_97.md`.