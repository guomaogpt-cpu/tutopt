# Backlog — Tutopt

**Обновлено:** июль 2026  
**Статус продукта:** MVP foundation (v0.1)

Приоритеты: **P0** — блокер, **P1** — важно для роста, **P2** — улучшение, **P3** — nice-to-have.

---

## P0 — Критично

| ID | Задача | Область | Статус |
|----|--------|---------|--------|
| B-001 | Email-отправка для сброса пароля (сейчас только API + dev-log) | Auth | Open |
| B-002 | Email-верификация аккаунта | Auth | Open |
| B-003 | Production-ready хранение изображений (S3/CDN вместо local uploads) | Listings | Open |

---

## P1 — Высокий приоритет

| ID | Задача | Область | Статус |
|----|--------|---------|--------|
| B-010 | Единый компонент EmptyState для всех страниц | UI | Open |
| B-011 | Custom 404 страница с навигацией | UI | Open |
| B-012 | Унификация auth denial UX (redirect vs inline) | Auth | Open |
| B-013 | Профиль пользователя (редактирование имени, телефона, email) | Auth | Open |
| B-014 | Редактирование объявления продавцом | Listings | Open |
| B-015 | Снятие/архивация объявления продавцом | Listings | Open |
| B-016 | Статусы заявок: просмотрено / закрыто (seller actions) | Leads | Open |
| B-017 | Каталог поставщиков `/sellers` (сейчас placeholder) | Sellers | Open |
| B-018 | WebSocket/SSE для уведомлений (сейчас polling 30s) | Notifications | Open |
| B-019 | Поиск по продавцам и брендам в каталоге | Search | Open |
| B-020 | Мобильная кнопка избранного в header top bar | UI | Open |

---

## P2 — Средний приоритет

| ID | Задача | Область | Статус |
|----|--------|---------|--------|
| B-030 | Дизайн-токены кнопок и карточек (единая система) | UI | Open |
| B-031 | Единые vertical paddings страниц | UI | Open |
| B-032 | Role-based landing после регистрации (SELLER → dashboard) | Auth | Open |
| B-033 | Похожие объявления: empty message вместо скрытия секции | Listings | Open |
| B-034 | Отчёты на объявления (Report model есть в schema) | Admin | Open |
| B-035 | Подписки на категории (CategorySubscription в schema) | Buyers | Open |
| B-036 | SEO-страницы (SeoPage model в schema) | Search | Open |
| B-037 | Аналитика просмотров для продавца | Sellers | Open |
| B-038 | Верификация продавца (документы, SellerDocument) | Sellers | Open |
| B-039 | Чат / сообщения между buyer и seller | Leads | Open |
| B-040 | Фильтр «только с фото» — UX polish | Search | Open |

---

## P3 — Низкий приоритет

| ID | Задача | Область | Статус |
|----|--------|---------|--------|
| B-050 | Удалить dead code: SearchBar, PopularListings, QuickCategories | Tech | Open |
| B-051 | i18n (кыргызский / английский) | UI | Open |
| B-052 | Тёмная тема | UI | Open |
| B-053 | PWA / offline | Platform | Open |
| B-054 | Интеграция WhatsApp/Telegram click-to-chat на listing | Listings | Open |
| B-055 | Рейтинг и отзывы продавцов | Sellers | Open |
| B-056 | Платные продвижения объявлений | Monetization | Open |

---

## Done (реализовано в MVP)

| ID | Задача |
|----|--------|
| D-001 | Регистрация BUYER / SELLER |
| D-002 | Вход / выход, сессии, remember me |
| D-003 | Return URL после login (`?next=`) |
| D-004 | Сброс пароля: forgot + reset страницы |
| D-005 | Создание объявления с фото и модерацией |
| D-006 | Каталог с фильтрами, сортировкой, пагинацией |
| D-007 | Карточка объявления (gallery, sidebar, lead form) |
| D-008 | Избранное |
| D-009 | Заявки (leads) buyer → seller |
| D-010 | Уведомления DB + polling |
| D-011 | Кабинет покупателя |
| D-012 | Кабинет продавца + входящие заявки |
| D-013 | Публичный профиль продавца |
| D-014 | Админка: пользователи + модерация |
| D-015 | Role-aware CTA «Подать объявление» |
| D-016 | Legacy routes fix: /catalog, /categories, /sellers |
| D-017 | Русские сообщения валидации |
