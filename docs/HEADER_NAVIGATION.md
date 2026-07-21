# Header navigation

## Структура компонентов

| Файл | Роль |
|------|------|
| `src/components/layout/Header.tsx` | Server wrapper, передаёт user |
| `src/components/layout/header/HeaderClient.tsx` | Desktop nav, mobile bar, drawer |
| `src/components/layout/header/HeaderSearch.tsx` | Поиск (обёртка над `SearchWithSuggest`) |
| `src/components/layout/header/HeaderNotificationsBell.tsx` | Колокольчик уведомлений |
| `src/components/layout/header/UserMenu.tsx` | Profile dropdown |
| `src/features/navigation/lib/header-nav.ts` | Primary links + active state |
| `src/features/navigation/lib/header-menu.ts` | Role-based пункты UserMenu |

## Desktop nav

Только направления:

- **Опт** → `/opt`
- **Объявления** → `/market`
- **Услуги** → `/services`
- **Карго** → `/cargo`

Убрано из header:

- Каталог (`/listings`) — каталог открывается через поиск и CTA на страницах
- Продавцы (`/sellers`) — не основной вход marketplace
- Маркет / ТутМаркет — заменены на понятное **«Объявления»**
- Категории (`/categories`) — не в header; вход через главную («Смотреть все категории») и `/categories`

Logo → `/`.

## Search

- Placeholder: «Найти товар, услугу или доставку...»
- Submit с запросом → `/listings?q=…` (и `vertical`, если контекст страницы его даёт)
- Пустой submit → `/listings`
- Desktop: центр / правее nav, `max-w-[380px]`
- Mobile: отдельная строка под top bar
- Suggestions сохранены (`SearchWithSuggest`)

## Actions

Одинаковая высота `h-10`: favorites, notifications, profile, login/register, burger.

Guest: Войти / Регистрация (desktop); на mobile — «Войти» + burger.

## Mobile drawer

Секции:

1. **Направления** — Опт, Объявления, Услуги, Карго  
2. **Аккаунт** (если auth) — кабинет / заявки / избранное / уведомления по роли  
3. **Выйти** или Войти / Регистрация  

Без Каталог / Продавцы / Категории.

## Role-based кабинет (UserMenu + drawer)

| Role | Кабинет |
|------|---------|
| BUYER | `/buyer/dashboard` |
| SELLER | `/seller/dashboard` |
| MODERATOR | `/admin` (+ модерация) |
| ADMIN | `/admin` (+ users, модерация) |

Логика в `header-menu.ts` / `getMobileAccountLinks` — не менять без нужды.

## Active state

`isNavLinkActive(pathname, href)` + мягкий tint по направлению
(`getHeaderNavActiveClass`) без `vertical-theme`.

## Later

- mega menu
- categories dropdown
- city selector
- saved searches in header
- sticky mobile bottom nav
