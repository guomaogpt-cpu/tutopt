# Smoke Tests

Минимальные smoke-проверки для Tutopt после deploy.

## Что проверяется автоматически

Скрипт `npm run smoke` делает GET-запросы к критическим URL и проверяет, что ответ не 500.

- Public pages
- Vertical pages (OPT, MARKET, SERVICES, CARGO)
- Listings with vertical filters
- SEO endpoints (`/sitemap.xml`, `/robots.txt`)
- Health endpoint (`/api/health`)
- Auth pages (`/login`, `/register`)
- Seller listing create pages (`/listings/new` и `?vertical=`)
- Admin routes for guest (допустимы 200/302/401/403, недопустим 500)

## Команды

### Локально

```bash
npm run dev
SMOKE_BASE_URL=http://localhost:3000 npm run smoke
```

### Production

```bash
SMOKE_BASE_URL=https://tutopt-production.up.railway.app npm run smoke
```

Переменная:

- `SMOKE_BASE_URL` — базовый URL (по умолчанию `http://localhost:3000`)

## Список URL в скрипте

- `/`
- `/opt`
- `/market`
- `/services`
- `/cargo`
- `/listings`
- `/listings?vertical=OPT`
- `/listings?vertical=MARKET`
- `/listings?vertical=SERVICES`
- `/listings?vertical=CARGO`
- `/sitemap.xml`
- `/robots.txt`
- `/api/health`
- `/login`
- `/register`
- `/listings/new`
- `/listings/new?vertical=OPT`
- `/listings/new?vertical=MARKET`
- `/listings/new?vertical=SERVICES`
- `/listings/new?vertical=CARGO`
- `/admin`
- `/admin/moderation/listings`

## Что НЕ проверяет автоматический smoke

- Реальный логин/регистрация
- Создание объявления
- Upload файлов
- Отправка заявки (lead)
- Уведомления
- Модерация approve/reject

Эти сценарии проверяются вручную после deploy.

## Manual smoke checklist after deploy

1. Проверить Railway deploy logs
2. Запустить `npm run smoke` с production URL
3. Вручную создать объявление
4. Вручную загрузить фото
5. Вручную отправить заявку
6. Вручную проверить уведомления
7. Вручную проверить модерацию объявления

## Связанные документы

- [`PRODUCTION_CHECKLIST.md`](./PRODUCTION_CHECKLIST.md)
- [`DEPLOY_WORKFLOW.md`](./DEPLOY_WORKFLOW.md)
