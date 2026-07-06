# Feature: Authentication

**Статус:** MVP ✅  
**Роли:** все

---

## Обзор

Session-based аутентификация с cookie. Пользователь регистрируется как покупатель или продавец, входит по email или телефону (+996).

---

## Реализовано

### Регистрация `/register`

- Поля: имя, email, телефон (хотя бы одно из email/phone), пароль
- Выбор роли: BUYER / SELLER
- Для SELLER: обязательное `company_name` → создаётся SellerProfile
- Query params: `?role=SELLER`, `?next=/path`
- После успеха → redirect на `next` или `/`

### Вход `/login`

- Email или телефон + пароль
- Remember me (продлевает сессию)
- Return URL: `/login?next=<internal-path>`
- Валидация `next`: только пути начинающиеся с `/`, без `//` и `://`
- Ссылка «Забыли пароль?» → `/forgot-password`

### Выход

- POST `/api/auth/logout`
- Очистка session cookie
- Redirect на `/`

### Сброс пароля

- `/forgot-password` — форма email
- POST `/api/auth/forgot-password` — генерирует token
- `/auth/reset-password?token=...` — форма нового пароля
- POST `/api/auth/reset-password` — обновляет пароль, инвалидирует сессии
- **Ограничение:** email не отправляется, token в dev-log

### Сессии

- Model: `Session` (user_id, token_hash, expires_at)
- Cookie: httpOnly
- `GET /api/auth/me` — текущий пользователь
- Blocked users (`is_blocked`) не получают сессию

---

## Роли

| Роль | Регистрация | Назначение |
|------|-------------|------------|
| BUYER | Public | Покупатель, заявки, избранное |
| SELLER | Public + company_name | Продавец, объявления |
| MODERATOR | ADMIN only | Модерация |
| ADMIN | Script `admin:create` | Полный доступ |

---

## Защита страниц

| Страница | Guest | Auth |
|----------|-------|------|
| `/favorites` | → `/login?next=/favorites` | ✅ |
| `/notifications` | → `/login?next=/notifications` | ✅ |
| `/buyer/dashboard` | → `/login?next=...` | ✅ |
| `/seller/dashboard` | → `/login?next=...` | ✅ |
| `/listings/new` | → `/login?next=/listings/new` | role check |
| `/admin/*` | → `/login?next=...` | staff only |

---

## API

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

---

## Не реализовано

- Email verification
- OAuth (Google, etc.)
- 2FA
- Смена пароля в профиле
- Редактирование профиля
- Rate limiting

---

## Связанные решения

- PD-004, PD-005, PD-008 (см. `DECISIONS.md`)
