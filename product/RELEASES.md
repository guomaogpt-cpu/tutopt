# Releases — Tutopt

---

## v0.1.0 — MVP Foundation

**Дата:** июль 2026  
**Статус:** текущая версия

### Платформа

- Next.js 15 (App Router), TypeScript, Tailwind CSS
- PostgreSQL + Prisma ORM
- Docker Compose для локальной разработки
- Session-based auth (cookie)

### Аутентификация

- Регистрация: BUYER / SELLER
- Вход по email или телефону (+996)
- Remember me
- Logout
- Forgot password / reset password (UI + API)
- Return URL после login (`/login?next=...`)

### Объявления

- Создание объявления (SELLER/ADMIN)
- Загрузка до 10 фото
- Статусы: DRAFT → PENDING_MODERATION → PUBLISHED / REJECTED
- Каталог `/listings` с фильтрами, сортировкой, пагинацией
- Карточка объявления с галереей, характеристиками, формой заявки
- Похожие объявления

### Покупатели

- Избранное
- Отправка заявок (повторные заявки разрешены)
- Кабинет: избранное, заявки, просмотры, профиль
- Запись просмотров объявлений

### Продавцы

- Кабинет продавца со списком объявлений
- Входящие заявки `/seller/leads`
- Публичный профиль `/seller/[id]`
- Уведомления о новых заявках

### Админка

- Модерация объявлений (MODERATOR + ADMIN)
- Управление ролями пользователей (ADMIN)
- Audit log смены ролей

### UI / Навигация

- Responsive header с поиском, избранным, уведомлениями
- Role-aware CTA «Подать объявление»
- Главная: hero, категории, новые объявления, CTA
- Статические страницы: about, help, contacts, privacy, terms

### API Endpoints

```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/listings
POST   /api/uploads/listing-images
POST   /api/listings/[id]/leads
GET/POST/DELETE /api/favorites/[listingId]
GET    /api/favorites
GET    /api/notifications
GET    /api/notifications/unread-count
PATCH  /api/notifications/[id]/read
PATCH  /api/notifications/read-all
PATCH  /api/admin/listings/[id]/moderation
PATCH  /api/admin/users/[id]/role
```

### Известные ограничения v0.1

- Нет email-отправки (reset token только в dev-log)
- Изображения на локальном диске
- Уведомления через polling (30 сек), без WebSocket
- Нет редактирования объявлений
- Нет каталога поставщиков (placeholder)
- Профиль пользователя read-only

---

## v0.2.0 — Planned

- Email delivery
- Edit listing
- S3 uploads
- Unified UI system
- Custom 404
