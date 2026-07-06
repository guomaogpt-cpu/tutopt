# Feature: Buyers

**Статус:** MVP ✅  
**Роли:** BUYER (+ все auth users на dashboard)

---

## Обзор

Покупатель ищет оптовые товары, сохраняет в избранное, отправляет заявки продавцам, отслеживает активность в кабинете.

---

## Реализовано

### Кабинет покупателя `/buyer/dashboard`

- **Избранное** — превью до 6 карточек + ссылка на `/favorites`
- **Мои заявки** — таблица отправленных leads
- **Недавно просмотренные** — на основе `UserListingView`
- **Профиль** — имя, email, телефон, роль (read-only)
- Auth required, redirect с `?next=`

### Избранное `/favorites`

- Добавление/удаление через `FavoriteButton` на карточках
- Optimistic UI toggle
- API: `POST/DELETE /api/favorites/[listingId]`, `GET /api/favorites`
- Empty state с CTA в каталог
- Guest → login с return URL

### Заявки (Leads)

- Форма на `/listings/[id]` — количество, сообщение, телефон, email
- Quick templates («Есть в наличии?», «Какая цена при опте?» и др.)
- Повторные заявки на одно объявление **разрешены**
- После успеха: «Отправить ещё заявку»
- Owner не может отправить заявку на своё объявление
- Guest → login с return URL

### Просмотры объявлений

- `recordListingView()` при посещении `/listings/[id]`
- Model: `UserListingView` (user_id, listing_id, viewed_at)
- Отображение в buyer dashboard

### Контакты продавца

- На `/seller/[id]` и listing detail — контакты видны только после login
- Guest видит CTA «Войти» с return URL

---

## User flows

```
Главная / Каталог
  → Карточка объявления
    → Избранное ♡
    → Отправить заявку
      → (guest) Login → return → Submit
      → (auth) Success → Seller notification

Кабинет покупателя
  → Избранное / Заявки / Просмотры
```

---

## Ограничения MVP

- Нет редактирования профиля
- Нет отмены/редактирования заявки
- Нет статуса заявки со стороны buyer (только просмотр)
- Нет подписок на категории (schema есть)
- Нет чата с продавцом
- Buyer dashboard доступен всем auth ролям (не только BUYER)

---

## Метрики (будущее)

- Количество заявок на buyer
- Conversion: view → lead
- Favorites → lead rate
