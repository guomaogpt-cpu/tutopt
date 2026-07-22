# Production Checklist

Чеклист для проверки Tutopt после deploy на Railway.

---

## 1. Railway deploy

- [ ] Build successful (Railway → Deployments)
- [ ] Deploy successful, service online
- [ ] Release: `npx prisma migrate deploy` succeeded (`railway.toml` releaseCommand)
- [ ] `/api/health` возвращает `{ "ok": true, "service": "tutopt", "database": "ok" }`
- [ ] Нет критических ошибок в View Logs

---

## 2. Database

- [ ] Migrations applied via **only** `npx prisma migrate deploy` (never `migrate dev` / `db push` / reset on Railway)
- [ ] Seed **only if** seed/справочники менялись: `npm run db:seed`
- [ ] Данные не удалены, категории и объявления на месте
- [ ] `ListingVertical` enum и поля `vertical` работают

---

## 3. Uploads

- [ ] `UPLOAD_DIR` настроен (например `/app/uploads`)
- [ ] Railway volume attached to `/app/uploads`
- [ ] Фото объявлений открываются через `/api/uploads/...`
- [ ] Загрузка нового фото при создании объявления работает
- [ ] Archive/delete listing **не** удаляет файлы с диска

---

## 4. Auth

- [ ] Вход по телефону + паролю (`/login`)
- [ ] Google OAuth redirect (`/api/auth/google/callback`)
- [ ] Seller onboarding (`/seller/onboarding`)
- [ ] **`DEMO_OTP_ENABLED=false` (или unset) перед реальными пользователями**
- [ ] Если demo OTP включён — только временный тест; OTP не должен попадать в production logs как код
- [ ] `OTP_SECRET` задан отдельно от `DATABASE_URL` (рекомендуется)

Полный env/deploy audit: [`PRODUCTION_STABILITY_AUDIT.md`](./PRODUCTION_STABILITY_AUDIT.md).

---

## 5. Public pages

| Страница | URL |
|----------|-----|
| Главная | `/` |
| ТутОпт | `/opt` |
| ТутМаркет | `/market` |
| ТутУслуги | `/services` |
| ТутКарго | `/cargo` |
| Каталог | `/listings` |
| Создание объявления | `/listings/new` |
| Карточка объявления | `/listings/[id]` |
| Профиль продавца | `/seller/[id]` |

---

## 6. Admin

| Страница | URL |
|----------|-----|
| Dashboard | `/admin` |
| Пользователи | `/admin/users` |
| Модерация | `/admin/moderation/listings` |
| Фильтр OPT | `/admin/moderation/listings?vertical=OPT` |
| Фильтр MARKET | `/admin/moderation/listings?vertical=MARKET` |
| Фильтр SERVICES | `/admin/moderation/listings?vertical=SERVICES` |
| Фильтр CARGO | `/admin/moderation/listings?vertical=CARGO` |

- [ ] MODERATOR имеет доступ к модерации
- [ ] ADMIN имеет доступ ко всему
- [ ] SELLER / BUYER / guest не имеют доступа к `/admin`

---

## 7. SEO

- [ ] `/sitemap.xml` открывается
- [ ] `/robots.txt` открывается
- [ ] Sitemap build-safe (не падает при недоступной БД на build)
- [ ] Listing detail: title, description, canonical
- [ ] SEO category pages: `/opt/[slug]`, `/market/[slug]`, и т.д.
- [ ] Private routes **не** в sitemap: admin, dashboard, favorites, notifications, login, api

---

## 8. Analytics & verification

Env variables (Railway → Variables, после смены — Redeploy):

| Переменная | Назначение |
|------------|------------|
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 |
| `NEXT_PUBLIC_YANDEX_METRIKA_ID` | Yandex Metrika |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console |
| `NEXT_PUBLIC_YANDEX_VERIFICATION` | Yandex Webmaster |

- [ ] Скрипты аналитики не рендерятся, если env пустые
- [ ] Verification meta появляется только при заполненных env
- [ ] Реальные ID не закоммичены в репозиторий

---

## 9. Smoke test after deploy

1. [ ] Создать объявление (`/listings/new?vertical=OPT`)
2. [ ] Загрузить фото
3. [ ] Отправить заявку с карточки объявления
4. [ ] Проверить уведомление продавцу (`/notifications`)
5. [ ] Одобрить объявление в модерации (`/admin/moderation/listings`)
6. [ ] Проверить, что объявление видно в каталоге
7. [ ] Проверить 404: несуществующая страница показывает «Страница не найдена»

---

## 10. Health endpoint

```bash
curl https://tutopt-production.up.railway.app/api/health
```

Ожидаемый ответ (healthy):

```json
{
  "ok": true,
  "app": "tutopt",
  "environment": "production",
  "timestamp": "2026-07-16T...",
  "database": "ok"
}
```

При проблеме с БД:

```json
{
  "ok": false,
  "app": "tutopt",
  "environment": "production",
  "timestamp": "2026-07-16T...",
  "database": "error"
}
```

HTTP status: `200` (ok) / `503` (database error).

---

## Связанные документы

- [`DEPLOY_WORKFLOW.md`](./DEPLOY_WORKFLOW.md) — workflow deploy
- [`PLATFORM_VERTICALS_STRATEGY.md`](./PLATFORM_VERTICALS_STRATEGY.md) — vertical-направления
- [`09_DEPLOYMENT.md`](./09_DEPLOYMENT.md) — общая документация deployment
