# Feature: Sellers

**Статус:** MVP ✅  
**Роли:** SELLER, ADMIN

---

## Обзор

Продавец размещает оптовые объявления, проходит модерацию, получает заявки от покупателей, управляет присутствием на платформе.

---

## Реализовано

### Регистрация продавца

- При register с `role=SELLER` обязательно `company_name`
- Автоматически создаётся `SellerProfile`
- CTA на главной и в header ведут на register/login с `next=/listings/new`

### Кабинет продавца `/seller/dashboard`

- Список объявлений продавца с статусами
- CTA «Подать объявление»
- Empty state: «Создать первое объявление»
- Auth: SELLER / ADMIN, иначе сообщение об ограничении

### Создание объявления `/listings/new`

- Форма: title, description, price, MOQ, unit, category, city, brand, stock
- Загрузка до 10 фото (`POST /api/uploads/listing-images`)
- Client validation: категория, город, ≥1 фото
- После submit → status `PENDING_MODERATION`
- Redirect на карточку объявления

### Входящие заявки `/seller/leads`

- Таблица всех leads по объявлениям продавца
- Сортировка: `created_at desc`
- Повторные заявки от одного buyer отображаются отдельно
- Поля: товар, покупатель (имя, phone, email), количество, сообщение, дата, статус
- Mobile: card layout

### Публичный профиль `/seller/[id]`

- Поиск по `id` (UUID) или `slug`
- Шапка: компания, логотип, verified badge
- Контакты: phone, email, WhatsApp, Telegram, website (auth gate)
- Список PUBLISHED объявлений через `ListingCard`
- Ссылка с карточки объявления: «Все объявления продавца»

### Уведомления

- При новой заявке → Notification type `NEW_LEAD`
- Link: `/seller/leads`
- Polling badge в header

---

## SellerProfile (schema)

- `company_name`, `slug`, `description`, `logo_url`
- `contact_phone`, `contact_email`, `whatsapp`, `telegram`, `website`
- `is_verified` — badge на профиле (ручная установка)
- `city_id` — привязка к городу

---

## Статусы объявлений

| Статус | Видимость |
|--------|-----------|
| DRAFT | Только owner |
| PENDING_MODERATION | Owner + staff |
| PUBLISHED | Все |
| REJECTED | Owner + staff |
| ARCHIVED | Owner + staff |

---

## Не реализовано

- Редактирование объявления
- Архивация / снятие с публикации UI
- Управление статусом заявки (VIEWED/CLOSED) — schema есть
- Верификация документов (SellerDocument)
- Аналитика просмотров и конверсий
- Каталог поставщиков `/sellers` (placeholder)
- Редактирование профиля компании

---

## Метрики (будущее)

- Leads per listing
- Time to first lead
- Listing approval rate
- Active listings count
