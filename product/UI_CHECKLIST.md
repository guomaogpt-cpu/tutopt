# UI Checklist — Tutopt

Чеклист для проверки UI перед релизом. Основан на UX audit и текущем состоянии MVP.

---

## Глобальная навигация

- [ ] Логотип ведёт на `/`
- [ ] «Каталог» ведёт на `/listings`
- [ ] Поиск в header → `/listings?q=...`
- [ ] CTA «Подать объявление» role-aware (guest/seller/buyer/moderator)
- [ ] Избранное (heart) → `/favorites` или login с `?next=`
- [ ] Колокольчик (auth) → `/notifications`, badge polling
- [ ] UserMenu по ролям корректен
- [ ] Logout работает, header обновляется
- [ ] Mobile menu: escape, backdrop, scroll lock
- [ ] Footer ссылки: about, help, contacts, privacy, terms

---

## Auth страницы

- [ ] `/login` — форма, errors, remember me, forgot password link
- [ ] `/login?next=/listings/xxx` — return после входа
- [ ] `/register` — BUYER/SELLER, company_name для seller
- [ ] `/register?role=SELLER&next=...` — preselect role
- [ ] `/forgot-password` — форма email
- [ ] `/auth/reset-password?token=...` — форма нового пароля
- [ ] Все validation errors на русском

---

## Публичные страницы

- [ ] `/` — hero, search, categories, recent listings, seller CTA
- [ ] `/listings` — фильтры, sort, pagination, empty state
- [ ] `/listings/[id]` — gallery, price, seller, lead form, similar
- [ ] `/seller/[id]` — profile, contacts (login gate), listings
- [ ] `/categories` — категории из БД → catalog filter
- [ ] `/catalog` — redirect на `/listings`
- [ ] `/sellers` — placeholder «скоро»

---

## Buyer

- [ ] `/favorites` — список, empty state, login redirect
- [ ] `/buyer/dashboard` — favorites, leads, views, profile
- [ ] FavoriteButton optimistic toggle
- [ ] Lead form: auth gate, success, «Отправить ещё заявку»
- [ ] Lead form: return URL при login

---

## Seller

- [ ] `/seller/dashboard` — список объявлений, статусы
- [ ] `/seller/leads` — все заявки, новые сверху, повторные
- [ ] `/listings/new` — форма, upload, validation, moderation flow
- [ ] Non-seller видит понятное сообщение на `/listings/new`

---

## Admin

- [ ] `/admin/moderation/listings` — approve/reject
- [ ] `/admin/users` — только ADMIN, role change
- [ ] MODERATOR не видит users, видит moderation
- [ ] Non-staff redirect с `/admin/*`

---

## Notifications

- [ ] Badge в header для auth users
- [ ] `/notifications` — список, unread highlight
- [ ] «Отметить все как прочитанные»
- [ ] Клик → link + mark read
- [ ] Badge обновляется без reload

---

## Визуальная консистентность (known gaps)

- [ ] Primary buttons единого стиля — **не выполнено**
- [ ] Empty states единого стиля — **не выполнено**
- [ ] Page paddings единые — **не выполнено**
- [ ] Заголовки: PublicPageHeader vs inline h1 — **не выполнено**
- [ ] Палитра: slate + blue-600 — **в целом OK**
- [ ] Custom 404 — **не выполнено**

---

## Mobile

- [ ] Header не ломается на 375px
- [ ] Catalog filters: bottom sheet
- [ ] Listing detail: sidebar под галереей
- [ ] Tables → cards на mobile (leads, buyer dashboard)
- [ ] Forms не вылезают за viewport
- [ ] Favorites в mobile header — **gap (только в hamburger)**

---

## Critical flows (smoke test)

1. [ ] Register SELLER → create listing → moderation → publish
2. [ ] Register BUYER → search → view listing → send lead
3. [ ] Seller receives notification → views lead
4. [ ] Buyer adds favorite → views in dashboard
5. [ ] Guest clicks lead → login → returns to listing → sends lead
6. [ ] Admin changes user role to MODERATOR
7. [ ] Moderator approves listing
