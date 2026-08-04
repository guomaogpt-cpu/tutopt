# Production Smoke Test — Phase 91

## 1. Цель проверки

Проверить production-поведение на Railway после Phase 89/90: публичные страницы, auth redirects, uploads, account/cargo routes, Telegram assumptions, SEO, mobile, error states. Исправить только P0/P1.

## 2. Production URL

https://tutopt-production.up.railway.app

## 3. Проверенные сценарии

| Область | Результат |
|---|---|
| `/` `/market` `/services` `/opt` `/cargo` `/listings` (+ vertical query) | 200, layout OK, TutMarket не найден, бренд ВсеТут |
| `/sitemap.xml` `/robots.txt` | 200; sitemap base = production URL |
| Guest `/account*` `/listings/new` `/favorites` `/admin` | 307 → `/login?next=…` (next сохраняется, в т.ч. `vertical`) |
| Legacy redirects | `/seller/dashboard`→`/account`, `/seller/cargo-settings`→`/account/cargo-settings`, listings/leads OK |
| Listing detail (valid UUID) | 200; images via `/api/uploads/...` → 200 |
| Cargo detail (valid UUID) | 200; guest без `tel:` / private phone |
| Uploads sample images | 200 |
| Google OAuth start | 307 → Google; `redirect_uri` = production callback |
| Empty search | 200 + empty copy |
| Admin guards (code + guest) | guest → login; non-staff → `/` (layout) |

## 4. Найденные проблемы

### P0
- Невалидный (не-UUID) id на `/listings/[id]` → **500** (Prisma UUID cast)
- Невалидный id на `/cargo/requests/[id]` → **500**
- Невалидный slug/id на `/companies/[id]` и `/seller/[id]` → **500** (`findFirst` с `id: non-uuid` в OR)

### P1
- Нет (после проверки публичных цветов/терминов/redirects)

### P2 / backlog
- Полный e2e create listing / cargo submit / Telegram test message — нужен тестовый аккаунт
- Admin moderation/verification UI — нужен staff-аккаунт
- Дальнейший polish catalog filter drawer

## 5. Исправленные проблемы

- Добавлен `isUuid()` (`src/shared/lib/is-uuid.ts`)
- `/listings/[id]` (+ edit): invalid → `notFound()` / safe metadata
- `/cargo/requests/[id]` + `getCargoRequestDetailForViewer`: invalid → not-found UI / `null`
- `getSellerProfileByParam`: UUID → OR id|slug; иначе только slug

## 6. Осталось на потом

- Manual account flows → см. `docs/MANUAL_PRODUCTION_QA_PHASE_92.md`
- Logged-in create listing / cargo / Telegram / admin: **requires owner manual run**

## 7. Production checklist

- [x] Public vertical pages 200
- [x] Sitemap / robots 200, production base URL
- [x] Auth `next` на account / listings/new / favorites
- [x] Uploads readable via `/api/uploads/...`
- [x] Account routes guest-gated
- [x] Cargo detail privacy for guest
- [x] Legacy soft redirects
- [x] Invalid UUID → safe 404 / not-found (fix deployed with this phase)
- [ ] Logged-in create listing (manual) — Phase 92 checklist
- [ ] Logged-in cargo request + response (manual) — Phase 92 checklist
- [ ] Telegram connect/test (manual) — Phase 92 checklist
- [ ] Admin staff flows (manual) — Phase 92 checklist

## 8. Env/Deploy notes

Нужны (значения не публикуются):

- `DATABASE_URL`
- `NEXT_PUBLIC_APP_URL` = `https://tutopt-production.up.railway.app`
- Session / auth secrets (см. `README_DEPLOY.md`)
- Google OAuth client + callback на production URL
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_BOT_USERNAME`
- `TELEGRAM_WEBHOOK_SECRET` (optional)

Webhook URL:

`https://tutopt-production.up.railway.app/api/webhooks/telegram`

Uploads: Railway volume + `/api/uploads/...` serve path (не локальный browser path).

## Phase 91 production smoke-test results

- Public/SEO/auth redirects/uploads: OK on live
- P0 invalid-UUID 500s: fixed in code (this commit)
- Logged-in / Telegram / admin: **requires manual account test**

## Phase 92 manual production QA results

Checklist + UX diagnostics: `docs/MANUAL_PRODUCTION_QA_PHASE_92.md`.

- Added cargo success → open `/cargo/requests/[id]`
- Telegram refresh status CTA
- Photo uploaded hint
- Full A–G scenarios documented; live login still owner-run

## Phase 93 live closed beta results

See `docs/CLOSED_BETA_USER_TEST_PHASE_93.md`.

Guest cargo create now requires login (P0 orphan fix). Ready for closed tester group after three accounts + Telegram env.

## Phase 94 cargo demo readiness

See `docs/CARGO_DEMO_READINESS_PHASE_94.md`.

## Phase 96 closed launch results and fixes

See `docs/CARGO_CLOSED_LAUNCH_RESULTS_PHASE_96.md`.

## Phase 98 market listings MVP

See `docs/MARKET_LISTINGS_MVP_PHASE_98.md`.

## Phase 99 services MVP

See `docs/SERVICES_MVP_PHASE_99.md`.

## Phase 100 opt B2B MVP

See `docs/OPT_B2B_MVP_PHASE_100.md`.

## Phase 101 company profiles MVP

See `docs/COMPANY_PROFILES_MVP_PHASE_101.md`. Smoke company flows: `/account/company`, `/companies/[id]`, post-as-company, verified badge, admin verify.
