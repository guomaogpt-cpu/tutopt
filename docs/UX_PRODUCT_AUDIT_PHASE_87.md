# UX Product Audit — Phase 87

## 1. Executive summary

### Что сейчас хорошо
- Единый кабинет `/account` с быстрыми действиями, объявлениями, заявками, компанией и карго.
- Публичная навигация по вертикалям (`/opt`, `/market`, `/services`, `/cargo`) и подача через `/listings/new` с выбором типа.
- Mobile bottom nav ведёт на `/`, `/listings`, `/listings/new`, `/favorites`, `/account`.
- Guest browse + auth только для действий (заявка, избранное, подача).
- Карго-лендинг: компактный hero, заявка в модалке, компании и актуальные заявки без публичных приватных контактов.
- `next` / safe internal path для login и onboarding уже есть.

### Что мешает пользователю
- Терминология «покупатель / продавец / стать продавцом / кабинет продавца» конфликтует с единым аккаунтом.
- Старые `/buyer/*` и `/seller/*` всё ещё выглядят как основные кабинеты в CTA, уведомлениях и хлебных крошках.
- Deep links уведомлений и success-state заявок уводили на legacy routes.
- Footer и help FAQ описывали устаревшую модель «зарегистрируйтесь как продавец».

### Что исправить в первую очередь (сделано в Phase 87)
1. Убрать видимую buyer/seller терминологию в ключевых UI-точках.
2. Перевести primary deep links на `/account`, `/account/listings`, `/account/requests`.
3. После upgrade/onboarding возвращать в `/account` (или сохранённый `next`).
4. Soft-notice на legacy dashboards без hard-redirect.
5. Синхронизировать footer, help, profile menu и notification links.

---

## 2. User flows

### Guest search flow
1. `/` → выбор раздела (`/opt`, `/market`, `/services`, `/cargo`) или поиск `/listings`.
2. Карточка `/listings/[id]` — просмотр без регистрации.
3. Заявка / избранное / контакты (где restricted) → login с safe `next`.

**Вердикт:** сценарий рабочий. Auth gate только на действиях.

### Guest post listing flow
1. CTA «Подать» → `/listings/new` (guest → login/register с `next=/listings/new`).
2. После auth — форма с выбором типа публикации.
3. Не требуется явный выбор «покупатель/продавец» на регистрации (RoleSelector не используется в register).

**Вердикт:** после Phase 87 upgrade/onboarding copy больше не «стать продавцом»; fallback redirect → `/account`.

### Registered user account flow
1. Profile / mobile → `/account`.
2. Оттуда: объявления, заявки, избранное, уведомления, компания, карго-настройки.
3. Legacy `/buyer/dashboard` и `/seller/dashboard` остаются, но с soft-notice.

**Вердикт:** `/account` — главная точка входа.

### Company flow
1. `/account/company` — создание/редактирование профиля компании.
2. Публичная страница `/companies/[id]` (и legacy `/seller/[id]`).
3. Публикация от личного аккаунта или компании на форме подачи.

**Вердикт:** поток понятен; soft CTA на компанию достаточен (без принуждения).

### Cargo client flow
1. `/cargo` → «Создать заявку» (модалка).
2. Success state после отправки.
3. Авторизованный пользователь видит заявки в `/account/requests`.

**Вердикт:** OK. Notification deep link на отклик исправлен на `/account/requests`.

### Cargo company flow
1. Карточка CARGO-листинга + `/seller/cargo-settings` (Telegram/подписки).
2. Доска `/seller/cargo-requests` (пока operational board).
3. Отклик без лишнего раскрытия контактов guest-аудитории.

**Вердикт:** OK для MVP; board остаётся на `/seller/cargo-requests` временно.

---

## 3. Problems by priority

### P0 — критично (исправлено)
| Проблема | Где | Фикс |
|---|---|---|
| Onboarding/upgrade UI «Стать продавцом» ломает модель единого аккаунта | `SellerUpgradeForm`, `/seller/upgrade`, API copy | Переименовано в подготовку профиля; redirect → `/account` |
| Help FAQ: «зарегистрируйтесь как продавец» | `help/page.tsx` | Обновлён FAQ под единый аккаунт |
| NEW_LEAD уже на `/account/requests`; NEW_CARGO_RESPONSE вёл на `/buyer/cargo-requests` | `notifications-data.ts` | Owner → `/account/requests` |
| Footer labels «Кабинет покупателя/продавца» | dictionaries + Footer hrefs | Личный кабинет / Мои объявления / Мои заявки |

### P1 — сильно мешает (исправлено)
| Проблема | Фикс |
|---|---|
| UserMenu role «Покупатель/Продавец» | «Аккаунт» |
| ListingLeadForm → `/seller/leads` | `/account/requests` |
| Edit listing breadcrumb → seller dashboard | `/account/listings` |
| Onboarding/upgrade default redirect → seller dashboard | `/account` |
| BuyerQuickActions cargo → `/buyer/cargo-requests` | `/account/requests` |
| SellerQuickActions / RecentLeads / DashboardListings на legacy | `/account/listings`, `/account/requests` |
| Soft-notice отсутствовал на buyer/seller dashboards и leads/cargo board | `AccountMigrateNotice` |
| Notification CTA «кабинет продавца» | «личный кабинет» |
| Profile menu без «Карго-настройки» / «Мои заявки» | Добавлено в header menu |
| Lead form copy «продавцу» | нейтральные формулировки |

### P2 — улучшения (backlog)
- Полная замена слова «Продавец» на публичных карточках/seller profile pages.
- Breadcrumbs и empty CTA consistency на всех admin pages.
- Дальнейшая группировка длинных полей `/listings/new`.
- Filters density на catalog mobile.
- Soft-redirect strategy для `/seller/listings` → `/account/listings` (сейчас notice only).

### P3 — polish (backlog)
- Микроанимации empty states.
- Иконки status badges.
- Visual alignment оставшихся blue buttons внутри vertical themes на legacy pages.

---

## 4. Duplicate / legacy routes

| Route | Статус |
|---|---|
| `/account`, `/account/listings`, `/account/requests`, `/account/company` | **Primary** |
| `/listings/new`, `/listings/[id]/edit` | **Primary** posting/editing |
| `/seller/cargo-settings`, `/seller/cargo-requests` | **Temporary operational** (cargo board/settings) |
| `/seller/dashboard`, `/seller/listings`, `/seller/leads` | Legacy + soft notice → account |
| `/buyer/dashboard`, `/buyer/cargo-requests` | Legacy + soft notice / links → account |
| `/seller/upgrade`, `/seller/onboarding` | Internal gates (phone/profile), copy нейтрализован |
| `/seller/[id]` | Legacy public seller URL; prefer `/companies/[id]` |

Позже: soft/hard redirects с legacy dashboards на `/account*` после стабилизации аналитики.

---

## 5. Recommended information architecture

### Public
- `/` home
- `/opt`, `/market`, `/services`, `/cargo`
- `/listings`, `/listings/[id]`
- `/companies/[id]`
- `/favorites`, `/notifications` (auth)
- `/help`, `/login`, `/register`

### Account
- `/account` hub
- `/account/listings`
- `/account/requests`
- `/account/company`
- (опционально позже) `/account/cargo-settings` как alias

### Company
- Create/edit: `/account/company`
- Public: `/companies/[id]`

### Cargo
- Landing: `/cargo`
- Request detail: `/cargo/requests/[id]`
- Company board: `/seller/cargo-requests` (temp)
- Settings: `/seller/cargo-settings` (temp)

### Admin
- `/admin`, users, companies, moderation, cargo-requests — без изменения терминов ролей в admin UI

---

## 6. Fixes done in this phase

- Аудит-документ создан.
- Терминология buyer/seller убрана из ключевых user-facing точек (upgrade, help, footer, menu role, leads copy, notifications CTA).
- Deep links переведены на `/account*` где это primary path.
- Upgrade/onboarding redirect fallback → `/account`.
- Soft migrate notices на legacy buyer/seller dashboards, leads и cargo board.
- Profile menu: «Мои заявки», «Карго-настройки».
- Footer publishing column → `/account/listings` + `/account/requests`.

---

## 7. Remaining backlog

- Hard redirects legacy → `/account*` после метрик.
- Alias `/account/cargo-settings` вместо `/seller/cargo-settings`.
- Полный copy-pass «продавец» на public company/seller pages (частично сделано в Phase 88).
- Mobile filter sheet polish на каталогах.
- Admin empty-state CTA audit.
- Optional deprecate dead `RoleSelector` component.
- Visual theme pass на оставшихся legacy seller pages (P2/P3).

---

## Phase 88 fixes

### P0 исправлены
- Приватные `name`/`phone` карго-заявок больше не отдаются на `/seller/cargo-requests` не-админам (`includeContacts`).
- Safe `next` ужесточён в `defaultPostAuthPath` / `buildSellerOnboardingUrl` через `isSafeInternalPath`.

### P1 исправлены
- Empty CTA на `/account` summaries (listings + requests).
- Success `/listings/new`: добавлен «Подать ещё одно».
- Vertical theme на MobileBottomNav, listing contact/sticky CTA, lead form, post-as selector.
- Mobile bottom-nav padding на favorites / notifications / company.
- Empty CTA на cargo board.
- Guest header/settings login/register сохраняют `next` текущей страницы.
- User-facing «Продавец» → «Автор» / нейтральные формулировки на профилях, карточках, dict keys.

### Оставлено на P2/P3
- Hard redirects legacy dashboards.
- `/account/cargo-settings` alias.
- Admin empty states + filter density.
- Полный visual polish legacy seller pages.
- Микроанимации empty states.

### Основные routes (без изменений IA)
- `/account`, `/account/listings`, `/account/requests`, `/listings/new`, `/cargo`

### Legacy временно
- `/buyer/*`, `/seller/dashboard|listings|leads`, `/seller/cargo-*`

---

## Phase 89 QA results

Product QA checklist: `docs/PRODUCT_QA_PHASE_89.md`.

**P0 fixed:** cargo response contacts shown to request owner.  
**P1 fixed:** cargo success CTA, services/opt form titles, theme price, orange respond button, double mobile padding, staff post hide, response status i18n.  
**Backlog:** field grouping on `/listings/new`.

## Phase 90 follow-up fixes

Closed in `docs/POST_QA_GAPS_PHASE_90.md`: cargo request detail route, account cargo-settings, soft legacy redirects, filter density, admin empty states.

## Phase 98 market listings MVP

See `docs/MARKET_LISTINGS_MVP_PHASE_98.md`. Ordinary listings `/market` + `/listings` polished for closed user test (hero, categories, purple theme, contact CTA).

## Phase 99 services MVP

See `docs/SERVICES_MVP_PHASE_99.md`. Services vertical polished separately from product listings (green theme, executor copy).

## Phase 100 opt B2B MVP

See `docs/OPT_B2B_MVP_PHASE_100.md`. Wholesale vertical polished as B2B (supplier/MOQ/blue theme).

## Phase 101 company profiles MVP

See `docs/COMPANY_PROFILES_MVP_PHASE_101.md`. Company cabinet + public showcase polished for closed testing (verified-only public badge, company listings filter, card links).

## Phase 102 simplified listing creation with AI description

See `docs/LISTING_CREATION_AI_PHASE_102.md`. Listing create UX simplified with step chips, characteristics, and optional OpenAI description helper.

## Phase 107 PWA / mobile app foundation

See `docs/PWA_FOUNDATION_PHASE_107.md` and `docs/MOBILE_APP_ROADMAP_PHASE_107.md`.

- Web App Manifest, PWA icons, mobile metadata (`themeColor`, `appleWebApp`)
- Minimal service worker + `/offline` fallback (no private API caching)
- Install prompt: banner after interaction + card in `/account`
- Bottom nav updated: Уведомления (`/notifications`) + Кабинет (`/account`)
- Sticky CTA offset unified to 5rem; global `overflow-x-clip`
- Capacitor / native wrapper deferred — roadmap documented

## Phase 108 Android wrapper foundation

See `docs/ANDROID_APP_WRAPPER_PHASE_108.md` and `docs/GOOGLE_PLAY_READINESS_CHECKLIST_PHASE_108.md`.

- Capacitor Android wrapper with production URL
- App id `kg.vsetut.app`, portrait, INTERNET-only permissions
- Launcher icons + splash from PWA assets
- APK/AAB build and store submission — next phases

