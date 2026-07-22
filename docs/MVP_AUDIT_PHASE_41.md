# MVP Audit — Phase 41

Дата: 2026-07-22  
Цель: зафиксировать состояние MVP, UI freeze, критические технические разрывы.

## UI freeze

Текущий UI временно заморожен. Не менять ради красоты:
главную, логотип, header визуально, карточки направлений, listing cards, цвета verticals.

Менять UI только при поломке функциональности / build / misleading copy.

## 1. Routes — присутствуют

### Public
| Route | Status |
|-------|--------|
| `/` | OK |
| `/listings` | OK |
| `/listings/[id]` | OK |
| `/opt` | OK |
| `/market` | OK |
| `/services` | OK |
| `/cargo` | OK |
| `/categories` | OK |
| `/seller/[id]` | OK |

### Auth
| Route | Status |
|-------|--------|
| `/login` | OK |
| `/register` | OK |
| `/seller/onboarding` | OK |

### Buyer
| Route | Status |
|-------|--------|
| `/buyer/dashboard` | OK |
| `/favorites` | OK |
| `/compare` | **MISSING** (нет page; ссылок в UI нет) |
| `/notifications` | OK |

### Seller
| Route | Status |
|-------|--------|
| `/seller/dashboard` | OK |
| `/seller/listings` | OK |
| `/listings/new` | OK |
| `/listings/[id]/edit` | OK |
| `/seller/leads` | OK |

### Admin
| Route | Status |
|-------|--------|
| `/admin` | OK |
| `/admin/users` | OK |
| `/admin/moderation/listings` | OK |
| `/admin/reports` | OK |

### System
| Route | Status |
|-------|--------|
| `/api/health` | OK |
| `/sitemap.xml` | OK |
| `/robots.txt` | OK |

Связанные: `/catalog` → redirect `/listings`; `/sellers` существует (footer).

## 2. Отсутствующие route

1. **`/compare`** — feature упомянута в roadmap/docs, page отсутствует. В header/buyer dashboard ссылок нет. Не создавать в Phase 41.

## 3. Основные flow (по коду)

| Flow | Оценка |
|------|--------|
| Browse home / verticals / catalog | OK — `PUBLISHED` + `buildNotExpiredListingFilter` |
| Listing detail (public) | OK — `canViewListing` |
| Create listing (SELLER) | OK → `PENDING_MODERATION` |
| Edit / archive / restore / renew | OK — lifecycle + renew APIs |
| Leads | OK после фикса expiration |
| Favorites | OK после фильтра public+notExpired |
| Seller / buyer dashboards | OK (buyer: auth-only, без role gate) |
| Admin moderation / reports / users | OK — layout staff + API requireStaff/Admin |
| Uploads | OK — `/api/uploads/*`, `UPLOAD_DIR`, normalize URL |
| Auth phone + Google | OK; post-login redirect выровнен с Google |

## 4. Критические проблемы (найдено)

1. **SEO leak:** `generateMetadata` на `/listings/[id]` отдавал title/description/OG для non-public listings.
2. **Leads на expired:** POST `/api/listings/[id]/leads` проверял только `PUBLISHED`, не expiration.
3. **Favorites / recent views:** показывали non-public / expired listings.
4. **Login/register redirect:** password flow игнорировал `defaultPostAuthPath` (в отличие от Google).
5. **Граница expiration:** `isListingExpired` (`<`) vs filter (`gt`) расходились на точке `now`.

## 5. Исправлено в Phase 41

1. Metadata: публичные данные только если `canViewListing(listing, null)`.
2. Leads: reject если `isListingExpired`.
3. Favorites + recent views: `buildPublicListingWhere()`.
4. Helper `buildPublicListingWhere` в `listing-expiration.ts`.
5. Align `isListingExpired` / status на `<= now`.
6. Login + Register: `defaultPostAuthPath(role, next)`.

Schema / migrations / uploads / auth architecture **не менялись**.

## 6. Guards (проверка)

| Area | Guard |
|------|-------|
| Admin pages | `admin/layout` — staff |
| Admin APIs | `requireAdmin` / `requireStaff` |
| Seller pages | `getCurrentUser` + role/onboarding redirects |
| Buyer pages | auth only |
| Middleware | pathname header for `/admin/*` only (не auth) |

Broken header links: **не найдены** (Опт / Объявления / Услуги / Карго).

## 7. Public visibility

Единый паттерн публичных списков: `status: PUBLISHED` + not expired.  
Архив = `ListingStatus.ARCHIVED` (soft-delete поля в schema нет).

Seller management видит все свои статусы — корректно.

## 8. Uploads

Без изменений. Serving через `/api/uploads/...`, helper `normalizeListingImageUrl`, `UPLOAD_DIR` в env.

## 9. Migrations / seed

- Prisma schema **не менялась** в этой фазе.
- **Railway migration: не нужна** для Phase 41.
- **Seed: не нужен.**

Уже применённые ранее migrations (lifecycle, expiration, etc.) должны быть на Railway из прошлых фаз — проверить `prisma migrate status` при деплое, если что-то отстаёт.

## 10. Рекомендуемые следующие фазы

| Phase | Фокус |
|-------|--------|
| **42** | ~~Seller flow stabilization~~ — **done** |
| **43** | ~~Buyer flow stabilization~~ — **done** |
| **44** | ~~Admin/moderation stabilization~~ — **done** |
| **45** | ~~Production stability~~ — **done** |
| **46** | ~~Mobile/responsive~~ — **done** (`docs/MOBILE_RESPONSIVE_STABILIZATION.md`) |
| **47** | ~~SEO/indexing~~ — **done** (`docs/SEO_INDEXING_STABILIZATION.md`) |
| **48** | ~~Security/anti-spam~~ — **done** (`docs/SECURITY_ANTISPAM_STABILIZATION.md`) |
| **49** | Compare MVP (`/compare`) или явно вырезать из docs/roadmap |
| **50** | Saved searches polish + catalog filter consistency |
| **51** | Buyer dashboard role gate / seller-vs-buyer IA |
| **52** | Soft-delete / trash retention (если нужна отдельно от ARCHIVED) |

## Seller flow follow-up — Phase 42

Выполнено в Phase 42 (см. `docs/SELLER_FLOW_STABILIZATION.md`):

- ADMIN может edit/archive/restore/renew свои объявления (как create).
- Create API требует полный KG phone / onboarding (`isSellerPhoneComplete`).
- Audit `listing.create`.
- Nav: «Мои объявления» → `/seller/listings`.
- Фильтр «Истёкшие» только для `PUBLISHED`.

UI / schema / uploads / auth architecture не менялись.

## Buyer flow follow-up — Phase 43

Выполнено в Phase 43 (см. `docs/BUYER_FLOW_STABILIZATION.md`):

- Guest PII fix: контакты продавца не сериализуются в client props на `/listings/[id]` и `/seller/[id]`.
- `/compare` по-прежнему отсутствует (нет UI-ссылок; не stub).
- Catalog / favorites / leads / saved searches / recently viewed / notifications — критических поломок не найдено.

## Admin/moderation follow-up — Phase 44

Выполнено в Phase 44 (см. `docs/ADMIN_MODERATION_STABILIZATION.md`):

- Критических security/visibility багов не найдено; guards API/layout OK.
- Dashboard «опубликованные» counts = PUBLISHED + not expired.
- Header/mobile: ссылка «Жалобы» для staff.
- Audit label `listing.create`.
- `/admin/settings` и `/admin/reports/[id]` page — gaps (не stub).

## Production stability follow-up — Phase 45

Выполнено в Phase 45 (см. `docs/PRODUCTION_STABILITY_AUDIT.md`):

- Deploy: Nixpacks + `postinstall prisma generate` + release `migrate deploy`.
- Schema в этой фазе **не** менялась → новых migrations нет.
- Health: поле `service`.
- Demo OTP: код не пишется в production console.
- Docs: deploy workflow + production checklist обновлены.

## Mobile/responsive follow-up — Phase 46

Выполнено в Phase 46 (см. `docs/MOBILE_RESPONSIVE_STABILIZATION.md`):

- Header logo max-width на узких экранах (desktop sizes сохранены).
- CategoryPicker / seller listing actions / audit filters — overflow/wrap fixes.
- Home listings + listing title/description — narrow-screen safety.
- Без редизайна desktop UI / logo file / nav labels.

## SEO/indexing follow-up — Phase 47

Выполнено в Phase 47 (см. `docs/SEO_INDEXING_STABILIZATION.md`):

- Brand в metadata: **ВсеТут**; title template; public vertical titles выровнены.
- Private/auth/admin: `noindex,nofollow` via `buildPrivatePageMetadata` / admin layout.
- Sitemap: static URLs always + `/categories`; DB dynamic в try/catch; `force-dynamic`.
- Robots: расширенный Disallow + absolute sitemap URL.
- Listing/seller metadata: safe fallbacks, noindex for non-public / missing.

## Security/anti-spam follow-up — Phase 48

Выполнено в Phase 48 (см. `docs/SECURITY_ANTISPAM_STABILIZATION.md`):

- Rate limits: OTP, login, register, password reset, upload, favorites, listing update (+ existing listing/lead/report).
- Upload: listing restriction + magic-byte MIME check.
- Renew/restore: listing restriction; JSON-LD XSS escape.
- Forgot-password: token no longer logged in full URL.
- Gaps: Redis rate limit, CSRF/origin hardening, duplicate-report DB constraint.

## Current MVP state (кратко)

Платформа с 4 направлениями, каталогом, CRUD объявлений, moderation, leads, favorites, dashboards, auth, Railway deploy — **готова как MVP**.  
UI заморожен. Flows 42–48 стабилизированы. Следующий приоритет — `/compare` или вырезать.
