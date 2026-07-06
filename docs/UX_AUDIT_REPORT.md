# Tutopt — UX/UI & Route Audit Report

**Дата:** 6 июля 2026  
**Проект:** `/Users/tilek/Projects/tutopt`  
**Тип:** read-only аудит (код, маршруты, компоненты; без правок UI)  
**Версия стека:** Next.js 15, Tailwind, Prisma, PostgreSQL

---

## Резюме

Основные пользовательские маршруты из MVP **существуют и в целом работают**. Критичные сценарии (каталог → карточка → заявка, регистрация/вход, кабинет продавца, модерация, избранное, уведомления) реализованы.

Главные проблемы:

1. **Наследие демо-страниц** (`/catalog`, `/categories`, `/sellers`) со ссылками на несуществующие маршруты.
2. **Несогласованная защита страниц** — redirect vs inline-сообщение на одной странице.
3. **Разорванный post-login flow** — после входа нет возврата на объявление/избранное.
4. **Фрагментированный UI** — кнопки, empty states, отступы и заголовки страниц без единой системы.
5. **Мобильная навигация слабее десктопа** — избранное и auth shortcuts спрятаны в меню.

**Итого по приоритетам:** P0 — 2, P1 — 12, P2 — 18, P3 — 11.

---

## Методология

- Проверены все `page.tsx` в `src/app/` (23 маршрута).
- Проанализированы: `HeaderClient`, `UserMenu`, `header-menu.ts`, `Footer`, role guards, формы, empty states.
- Проверены API-guards для критичных flow (listings, leads, favorites, notifications, admin).
- **Не выполнялось:** визуальное тестирование в браузере на реальных устройствах, accessibility audit (WCAG), performance audit.

---

## 1. Инвентаризация маршрутов

### Запрошенные маршруты — статус

| Маршрут | Статус | Примечание |
|---------|--------|------------|
| `/` | ✅ OK | Hero, категории, новые объявления, CTA |
| `/listings` | ✅ OK | Каталог с фильтрами, сортировкой, пагинацией |
| `/listings/[id]` | ✅ OK | `notFound()` если нет доступа / не найдено |
| `/seller/[id]` | ✅ OK | Поиск по `id` или `slug` |
| `/login` | ✅ OK | Форма входа |
| `/register` | ✅ OK | Регистрация BUYER/SELLER |
| `/favorites` | ✅ OK | `redirect("/login")` для гостя |
| `/notifications` | ✅ OK | `redirect("/login")` для гостя |
| `/buyer/dashboard` | ✅ OK | Только auth; роль не проверяется |
| `/seller/dashboard` | ✅ OK | SELLER/ADMIN; иначе inline denial |
| `/seller/leads` | ✅ OK | SELLER/ADMIN; сортировка `created_at desc` |
| `/listings/new` | ✅ OK | SELLER/ADMIN; иначе inline denial |
| `/admin/users` | ✅ OK | Только ADMIN; иначе redirect |
| `/admin/moderation/listings` | ✅ OK | ADMIN + MODERATOR через layout |

### Дополнительные маршруты (вне списка, но в коде)

| Маршрут | Статус | Риск |
|---------|--------|------|
| `/catalog` | ⚠️ Legacy demo | Ссылки на `/listing/[slug]` → **404** |
| `/categories` | ⚠️ Legacy demo | Ссылки на `/category/[slug]` → **404** |
| `/sellers` | ⚠️ Legacy demo | Mock slugs → `/seller/[slug]` часто **404** |
| `/about`, `/help`, `/contacts`, `/privacy`, `/terms` | ✅ OK | Статические страницы |
| `/admin/moderation` | ✅ Redirect | → `/admin/moderation/listings` |

### Отсутствующие маршруты

| Ожидаемый URL | Где используется | Результат |
|---------------|------------------|-----------|
| `/listing/[slug]` | `src/app/catalog/page.tsx`, `PopularListings.tsx` | 404 |
| `/category/[slug]` | `src/app/categories/page.tsx`, `QuickCategories.tsx` | 404 |
| `/search` | `src/components/home/SearchBar.tsx` | 404 |
| `/auth/reset-password` | `src/app/api/auth/forgot-password/route.ts` | 404 (страницы нет) |
| Custom `not-found.tsx` | — | Дефолтный Next.js 404 |

---

## 2. Навигация

### Header — что работает

- Логотип, каталог, поиск → `/listings?q=...` ✅
- Колокольчик уведомлений (auth) → `/notifications` ✅
- UserMenu по ролям через `getHeaderMenuItems()` ✅
- Logout: `POST /api/auth/logout` → `router.push("/")` + `refresh()` ✅
- Mobile menu: escape, backdrop, scroll lock ✅

### Проблемы навигации

#### P1 — Дублирование пунктов меню SELLER

- **Маршрут:** Header / UserMenu (все страницы)
- **Проблема:** «Кабинет продавца» и «Мои объявления» ведут на один URL `/seller/dashboard`.
- **Почему важно:** Путаница, лишний шум в меню, на mobile меню длиннее.
- **Как исправить:** Убрать дубликат или переименовать/развести по смыслу (например, «Мои объявления» → якорь на список).
- **Файлы:** `src/features/navigation/lib/header-menu.ts`, `src/components/layout/header/HeaderClient.tsx`

#### P1 — Дублирование входа/регистрации для гостя

- **Маршрут:** Header desktop
- **Проблема:** «Войти» и «Регистрация» показаны inline **и** в UserMenu dropdown.
- **Почему важно:** Визуальный шум, непоследовательный паттерн auth.
- **Как исправить:** Оставить один канал (либо inline, либо dropdown).
- **Файлы:** `src/components/layout/header/HeaderClient.tsx`, `src/components/layout/header/UserMenu.tsx`

#### P1 — «Подать объявление» видно всем ролям

- **Маршрут:** Header → `/listings/new`
- **Проблема:** BUYER/MODERATOR видят CTA, но получают экран «доступно только продавцам».
- **Почему важно:** Ложное ожидание, лишний клик в ключевом CTA.
- **Как исправить:** Показывать кнопку только SELLER/ADMIN или вести на `/register` с role=SELLER для гостя.
- **Файлы:** `src/components/layout/header/HeaderClient.tsx`, `src/features/navigation/lib/header-menu.ts`

#### P2 — ADMIN: дубли «Админка» и «Пользователи»

- **Маршрут:** UserMenu ADMIN
- **Проблема:** Оба пункта → `/admin/users`.
- **Как исправить:** Оставить один пункт или развести на подразделы.
- **Файлы:** `src/features/navigation/lib/header-menu.ts`

#### P2 — MODERATOR без «Избранное» в dropdown, но heart в header работает

- **Маршрут:** Header
- **Проблема:** Несогласованность меню по ролям.
- **Файлы:** `src/features/navigation/lib/header-menu.ts`

#### P2 — Footer не содержит ссылок на legacy-страницы

- **Маршрут:** Footer
- **Проблема:** `/catalog`, `/categories`, `/sellers` не в навигации — хорошо, но страницы остаются доступны по прямому URL.
- **Файлы:** `src/app/catalog/page.tsx`, `src/app/categories/page.tsx`, `src/app/sellers/page.tsx`

---

## 3. Роли и доступ

### Матрица доступа (фактическая)

| Страница | Guest | BUYER | SELLER | MODERATOR | ADMIN |
|----------|-------|-------|--------|-----------|-------|
| `/buyer/dashboard` | → login | ✅ | ✅ | ✅ | ✅ |
| `/favorites` | → login | ✅ | ✅* | ✅* | ✅* |
| `/notifications` | → login | ✅ | ✅ | ✅ | ✅ |
| `/seller/dashboard` | inline | inline deny | ✅ | inline deny | ✅ |
| `/seller/leads` | inline | inline deny | ✅ | inline deny | ✅ |
| `/listings/new` | inline | inline deny | ✅ | inline deny | ✅ |
| `/admin/*` | → login | → `/` | → `/` | ✅ moderation | ✅ full |
| `/admin/users` | — | redirect | redirect | → moderation | ✅ |

\*Избранное доступно всем авторизованным; в UserMenu ссылка есть только у BUYER.

### Проблемы ролей

#### P1 — «Кабинет покупателя» показывается всем авторизованным

- **Маршрут:** `/buyer/dashboard`, Header menu
- **Проблема:** SELLER/MODERATOR/ADMIN видят buyer dashboard с избранным и заявками — может быть ОК, но eyebrow «Покупатель» вводит в заблуждение.
- **Почему важно:** Ролевая модель в UI неочевидна.
- **Как исправить:** Показывать пункт только BUYER или переименовать в «Мой кабинет».
- **Файлы:** `src/features/navigation/lib/header-menu.ts`, `src/app/buyer/dashboard/page.tsx`

#### P1 — Несогласованный UX закрытых страниц

- **Маршрут:** seller pages vs buyer pages
- **Проблема:** Buyer/favorites/notifications → `redirect("/login")`; seller pages → inline `ListingAccessMessage` на той же URL.
- **Почему важно:** Разный mental model, SEO/URL остаётся «доступным» для seller denial.
- **Как исправить:** Унифицировать: redirect или единый `AccessDenied` layout.
- **Файлы:** `src/app/seller/dashboard/page.tsx`, `src/app/listings/new/page.tsx`, `src/app/favorites/page.tsx`, `src/components/listings/NewListingForm.tsx`

#### P2 — BUYER не видит админку

- **Статус:** ✅ Работает — `admin/layout.tsx` redirect на `/`.

#### P2 — MODERATOR видит только модерацию

- **Статус:** ✅ `/admin/users` redirect; AdminNav скрывает «Пользователи».

#### P3 — Logout без feedback при ошибке

- **Маршрут:** UserMenu / mobile menu
- **Проблема:** При ошибке `logoutRequest()` пользователь остаётся в сессии без сообщения.
- **Файлы:** `src/components/layout/header/UserMenu.tsx`, `src/components/layout/header/HeaderClient.tsx`

---

## 4. UI consistency

### Что единообразно

- Базовая палитра: **slate** (текст/бордеры) + **blue-600** (primary CTA)
- Карточки: преимущественно `rounded-2xl border border-slate-200`
- Контейнер: `Container` + `max-w-*` паттерн

### Проблемы

#### P2 — Нет единого design token для кнопок

- **Маршрут:** глобально
- **Проблема:** `buttonPrimaryClassName` в `FormField.tsx` не используется везде; отклонения в `NewListingForm` (`rounded-2xl py-4 shadow-md`), hero, filters, lead form.
- **Файлы:** `src/components/public/FormField.tsx`, `src/components/listings/NewListingForm.tsx`, `src/components/home/HeroSection.tsx`, `src/components/listings/CatalogFiltersPanel.tsx`

#### P2 — `text-gray-900` в body vs `text-slate-*` в компонентах

- **Маршрут:** глобально
- **Проблема:** `globals.css` задаёт `text-gray-900`, компоненты — slate.
- **Файлы:** `src/app/globals.css`

#### P2 — Разные вертикальные ритмы страниц

- **Маршрут:** catalog `py-6`, favorites/notifications `py-10`, auth/seller `py-14`, buyer `py-12`
- **Проблема:** Страницы ощущаются из разных «приложений».
- **Файлы:** `src/app/listings/page.tsx`, `src/app/favorites/page.tsx`, `src/app/login/page.tsx`, `src/app/buyer/dashboard/page.tsx`

#### P2 — Заголовки: `PublicPageHeader` vs inline `h1`

- **Маршрут:** catalog/favorites vs auth/seller
- **Проблема:** `text-2xl sm:text-3xl` vs `text-3xl sm:text-4xl`.
- **Файлы:** `src/components/public/PublicPageHeader.tsx`, `src/app/favorites/page.tsx`, `src/app/listings/page.tsx`

#### P2 — Сетки карточек: `gap-4` vs `gap-5`

- **Маршрут:** catalog vs favorites/home
- **Файлы:** `src/app/listings/page.tsx`, `src/app/favorites/page.tsx`, `src/components/home/RecentListingsSection.tsx`

#### P3 — Rose-акценты избранного vs blue-система

- **Маршрут:** `FavoriteButton`
- **Проблема:** Намеренный акцент, но выбивается из палитры.
- **Файлы:** `src/components/listings/FavoriteButton.tsx`

#### P3 — Disabled stub «Позвонить» на карточке объявления

- **Маршрут:** `/listings/[id]`
- **Проблема:** Занимает место, выглядит как сломанная кнопка.
- **Файлы:** `src/components/listings/ListingContactCard.tsx`

#### P3 — `FormSection` с `hover:shadow-md`, остальные карточки — нет

- **Файлы:** `src/components/listings/NewListingForm.tsx` (FormSection)

---

## 5. Mobile

### Что работает

- Hamburger menu с overlay и scroll lock
- Catalog filters: bottom sheet `max-h-[85vh]`
- Listing detail: sidebar дублируется под галереей на mobile
- Seller/buyer tables: desktop table + mobile cards

### Проблемы

#### P1 — Нет кнопки избранного в mobile header

- **Маршрут:** все страницы (mobile)
- **Проблема:** Heart только на desktop (`lg:flex`); на mobile — только через hamburger.
- **Почему важно:** Избранное — частый сценарий покупателя.
- **Как исправить:** Добавить `FavoritesButton` в mobile bar рядом с bell.
- **Файлы:** `src/components/layout/header/HeaderClient.tsx`

#### P1 — Гость на mobile: нет быстрого «Войти»

- **Маршрут:** mobile header
- **Проблема:** Auth только в hamburger; в top bar только «+» и menu.
- **Файлы:** `src/components/layout/header/HeaderClient.tsx`

#### P2 — Высокий header на mobile

- **Маршрут:** все страницы
- **Проблема:** 72px bar + search row = много above-the-fold.
- **Файлы:** `src/components/layout/header/HeaderClient.tsx`, `HeaderSearch.tsx`

#### P2 — Форма заявки далеко на mobile

- **Маршрут:** `/listings/[id]`
- **Проблема:** CTA «Отправить заявку» в sidebar есть, но форма после характеристик и описания — длинный скролл.
- **Файлы:** `src/app/listings/[id]/page.tsx`, `ListingContactCard.tsx`, `ListingLeadForm.tsx`

#### P2 — Touch targets в фильтрах меньше, чем в формах

- **Маршрут:** `/listings`
- **Проблема:** Filter fields `py-2.5` vs lead form `py-3`.
- **Файлы:** `src/components/listings/CatalogFiltersPanel.tsx`, `ListingsCatalogToolbar.tsx`

#### P3 — Дублирование `h1` на listing detail (скрытый на desktop, отдельный на mobile)

- **Файлы:** `src/app/listings/[id]/page.tsx`

---

## 6. Empty states

### Реализация по поверхностям

| Сценарий | Компонент | Уровень |
|----------|-----------|---------|
| Нет объявлений / нет поиска | `ListingsEmptyState` | Rich (emoji + CTA) |
| Нет избранного | `favorites/page.tsx` inline | Rich |
| Нет уведомлений | `NotificationsList` | Rich |
| Нет заявок (seller) | `SellerLeadsTable` | Rich |
| Нет заявок (buyer dashboard) | `BuyerLeadsSection` | Text + link |
| Нет избранного (buyer dashboard) | `BuyerFavoritesSection` | Text + link |
| Нет просмотров | `BuyerRecentViewsSection` | Text + link |
| Нет объявлений seller dashboard | `seller/dashboard/page.tsx` | Text only |
| Нет на модерации | `ModerationListingsTable` | Minimal |
| Similar listings | `SimilarListings` | **Секция скрыта** (`null`) |

### Проблемы

#### P1 — Empty states не унифицированы

- **Маршрут:** buyer dashboard vs full pages
- **Проблема:** Один и тот же смысл («нет заявок») — карточка у seller, одна строка у buyer.
- **Как исправить:** Общий `EmptyState` компонент с вариантами.
- **Файлы:** `src/components/buyer/*`, `src/components/seller/SellerLeadsTable.tsx`, `src/app/favorites/page.tsx`

#### P2 — `ListingsEmptyState` CTA «Подать объявление» для всех

- **Маршрут:** `/listings` (пустой каталог)
- **Проблема:** Гость/buyer попадают на `/listings/new` с denial.
- **Файлы:** `src/components/listings/ListingsEmptyState.tsx`

#### P2 — Пустой каталог на главной (`RecentListingsSection`)

- **Маршрут:** `/`
- **Проблема:** Отдельный empty copy без единого стиля с каталогом.
- **Файлы:** `src/components/home/RecentListingsSection.tsx`

#### P3 — Similar listings исчезает без сообщения

- **Маршрут:** `/listings/[id]`
- **Файлы:** `src/components/listings/SimilarListings.tsx`

---

## 7. Forms

### Login (`/login`)

| Аспект | Статус |
|--------|--------|
| Field errors | ✅ Alert banner + inline |
| Loading | ✅ «Вход...», disabled inputs |
| Double submit | ⚠️ `isSubmitting` сбрасывается в `finally` до redirect — можно повторно отправить |
| Forgot password | ❌ Нет ссылки на UI |

#### P2 — Повторный submit после успешного входа

- **Файлы:** `src/app/login/page.tsx`

#### P1 — Сообщения валидации API на английском

- **Маршрут:** `/login`, `/register`
- **Проблема:** `"Password must be at least 8 characters"`, `"Either email or phone is required"` из `auth.validators.ts`.
- **Файлы:** `src/features/auth/validators/auth.validators.ts`, `src/app/login/page.tsx`, `src/app/register/page.tsx`

### Register (`/register`)

| Аспект | Статус |
|--------|--------|
| Role selection | ✅ BUYER/SELLER |
| company_name for SELLER | ✅ Условное поле |
| Client validation | ⚠️ Минимальная (перед fetch) |
| Redirect after success | → `/` (нет role-based landing) |

#### P2 — После регистрации SELLER всегда на главную

- **Проблема:** Логичнее вести на `/seller/dashboard` или `/listings/new`.
- **Файлы:** `src/app/register/page.tsx`

### Listing create (`/listings/new`)

| Аспект | Статус |
|--------|--------|
| Client validation | ✅ Категория, фото, город |
| Server errors | ⚠️ English messages |
| Loading | ✅ «Публикация...» |
| Double submit | ✅ disabled + no photos guard |
| Upload loading | ⚠️ Текст «Загрузка...» легко пропустить |

#### P1 — Ошибки валидации объявления на английском

- **Файлы:** `src/features/listings/validators/listing.validators.ts`, `NewListingForm.tsx`

#### P2 — После создания — redirect на detail с badge «На модерации»

- **Проблема:** Продавец может не понять, что объявление ещё не в каталоге.
- **Файлы:** `src/components/listings/NewListingForm.tsx`, `ListingContactCard.tsx`

### Lead form (`/listings/[id]`)

| Аспект | Статус |
|--------|--------|
| Auth gate | ✅ Login link / redirect |
| Owner gate | ✅ Сообщение + link to leads |
| Success state | ✅ + «Отправить ещё заявку» |
| Loading | ⚠️ Submit disabled, поля активны |
| Errors | ⚠️ Plain red text, не alert banner |

#### P0 — После login нет возврата на объявление

- **Маршрут:** `/listings/[id]` → `/login`
- **Проблема:** `router.push("/login")` без `?next=` / callback URL; после входа пользователь на `/`, теряет контекст заявки.
- **Почему важно:** Ломает критичный сценарий «гость → войти → отправить заявку».
- **Как исправить:** `redirect(/login?next=...)` + обработка на login page.
- **Файлы:** `src/components/listings/ListingLeadForm.tsx`, `src/components/listings/FavoriteButton.tsx`, `src/app/login/page.tsx`

#### P2 — Поля формы заявки не disabled при отправке

- **Файлы:** `src/components/listings/ListingLeadForm.tsx`

#### P3 — Ошибка формы заявки без `role="alert"`

- **Файлы:** `src/components/listings/ListingLeadForm.tsx`

---

## 8. Critical flows

### Матрица критичных сценариев

| Сценарий | Статус | Замечания |
|----------|--------|-----------|
| Регистрация | ✅ Работает | English errors; redirect на `/` |
| Вход | ✅ Работает | Нет return URL |
| Создание объявления | ✅ Работает | PENDING_MODERATION → не в каталоге до approve |
| Модерация | ✅ Работает | Empty state минимальный |
| Публикация | ✅ Работает | Approve → PUBLISHED |
| Поиск объявления | ✅ Работает | Header + catalog toolbar |
| Отправка заявки | ⚠️ Частично | Повторные заявки OK; guest login flow broken |
| Уведомление продавцу | ✅ Работает | DB + polling 30s |
| Избранное | ✅ Работает | Optimistic toggle; guest без return URL |

### Legacy / dead code (риск регрессии)

| Компонент | Проблема | Приоритет |
|-----------|----------|-----------|
| `SearchBar.tsx` | Routes `/catalog`, `/search` | P1 (если подключат на главную) |
| `PopularListings.tsx` | `/listing/[slug]` | P3 (не импортируется) |
| `QuickCategories.tsx` | `/category/[slug]` | P3 (не импортируется) |
| `/catalog`, `/categories`, `/sellers` | Demo mock + broken links | P1 |

#### P0 — Legacy `/catalog` и `/categories` ведут на 404

- **Маршрут:** `/catalog`, `/categories`
- **Проблема:** Клик по карточке → `/listing/{slug}` или `/category/{slug}` — маршрутов нет.
- **Почему важно:** Полностью ломает навигацию на этих страницах; страницы доступны по прямому URL.
- **Как исправить:** Redirect на `/listings` или удалить/переписать страницы; ссылки → `/listings/[id]` и `/listings?category=`.
- **Файлы:** `src/app/catalog/page.tsx`, `src/app/categories/page.tsx`, `src/components/public/mock-data.ts`

#### P1 — Password reset без UI-страницы

- **Маршрут:** `/auth/reset-password` (отсутствует)
- **Проблема:** API `forgot-password` генерирует URL на несуществующую страницу; на `/login` нет «Забыли пароль?».
- **Файлы:** `src/app/api/auth/forgot-password/route.ts`, `src/app/login/page.tsx`

#### P1 — `/sellers` demo → 404 на профили

- **Маршрут:** `/sellers`
- **Проблема:** Mock slugs не совпадают с БД → `notFound()` на `/seller/[id]`.
- **Файлы:** `src/app/sellers/page.tsx`, `src/components/public/mock-data.ts`

#### P2 — Нет кастомной 404

- **Проблема:** Битые legacy-ссылки показывают generic Next.js 404 без навигации назад.
- **Файлы:** `src/app/not-found.tsx` (создать)

#### P2 — Notifications: просмотр списка не помечает прочитанным

- **Маршрут:** `/notifications`
- **Проблема:** По дизайну только клик/read-all; пользователь может ожидать auto-read при открытии страницы.
- **Файлы:** `src/components/notifications/NotificationsList.tsx`

---

## 9. Сводная таблица проблем по приоритету

### P0 — ломает сценарий (2)

| # | Маршрут | Проблема |
|---|---------|----------|
| 1 | `/listings/[id]` → `/login` | Нет return URL после входа — гость теряет контекст заявки/избранного |
| 2 | `/catalog`, `/categories` | Клики по карточкам ведут на несуществующие `/listing/*`, `/category/*` |

### P1 — сильно мешает (12)

| # | Маршрут | Проблема |
|---|---------|----------|
| 3 | Header | Дубли seller menu (кабинет = мои объявления) |
| 4 | Header | Дубли guest login/register |
| 5 | Header → `/listings/new` | CTA «Подать объявление» для не-продавцов |
| 6 | `/buyer/dashboard` | Показывается всем ролям как «Кабинет покупателя» |
| 7 | Seller vs buyer pages | Разный паттерн auth denial (redirect vs inline) |
| 8 | Mobile header | Нет heart избранного в top bar |
| 9 | Mobile header | Нет быстрого «Войти» для гостя |
| 10 | Buyer dashboard | Empty states слабее, чем на full pages |
| 11 | `/listings` empty | CTA «Подать объявление» ведёт не-продавцов на denial |
| 12 | `/login`, `/register` | Ошибки валидации на английском |
| 13 | `/listings/new` | Ошибки валидации объявления на английском |
| 14 | `/sellers`, forgot-password | Legacy/broken flows (demo 404, reset без страницы) |

### P2 — визуальная/UX проблема (18)

| # | Область | Проблема |
|---|---------|----------|
| 15 | Header ADMIN | Дубли пунктов админки |
| 16 | Header MODERATOR | Нет избранного в menu vs heart в header |
| 17 | Logout | Нет сообщения при ошибке |
| 18 | Global | Кнопки без единого token |
| 19 | Global | gray-900 vs slate |
| 20 | Pages | Разные vertical paddings |
| 21 | Pages | Разные размеры заголовков |
| 22 | Grids | gap-4 vs gap-5 |
| 23 | Mobile | Высокий header |
| 24 | `/listings/[id]` | Форма заявки далеко на mobile |
| 25 | `/listings` filters | Мелкие touch targets |
| 26 | `/listings` empty | CTA для не-продавцов |
| 27 | `/` | Отдельный empty для recent listings |
| 28 | Login | Повторный submit после success |
| 29 | Register | Redirect на `/` вместо role-based |
| 30 | Listing create | Неясность статуса «На модерации» |
| 31 | Lead form | Поля не disabled при pending |
| 32 | Global | Нет custom 404 |

### P3 — косметика (11)

| # | Область | Проблема |
|---|---------|----------|
| 33 | FavoriteButton | Rose vs blue palette |
| 34 | ListingContactCard | Disabled «Позвонить» stub |
| 35 | FormSection | hover:shadow только там |
| 36 | `/listings/[id]` | Дубли h1 mobile/desktop |
| 37 | SimilarListings | Секция скрывается без сообщения |
| 38 | Lead form | Error без role="alert" |
| 39 | PopularListings | Dead code |
| 40 | QuickCategories | Dead code |
| 41 | SearchBar | Dead code (опасен при reuse) |
| 42 | `/notifications` | Нет auto-read при открытии страницы |
| 43 | Image upload | Слабый loading indicator |

---

## 10. Рекомендуемый порядок исправлений

1. **P0:** Return URL для login; redirect или удаление legacy `/catalog`, `/categories`.
2. **P1:** Role-aware header CTA; унификация empty states; русификация validation messages; mobile favorites.
3. **P2:** Page layout tokens; custom 404; унификация auth denial UX.
4. **P3:** Cleanup dead components; polish loading/disabled states.

---

## Приложение: проверенные файлы (ключевые)

```
src/app/**/page.tsx
src/components/layout/header/*
src/features/navigation/lib/header-menu.ts
src/components/listings/*
src/components/notifications/*
src/components/buyer/*
src/components/seller/*
src/components/admin/*
src/features/auth/validators/auth.validators.ts
src/features/listings/validators/listing.validators.ts
src/app/admin/layout.tsx
src/app/globals.css
```

---

*Отчёт подготовлен без изменений кода приложения. Следующий шаг — приоритизировать P0/P1 и завести задачи на исправление.*
