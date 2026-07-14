# Deploy Workflow (Railway)

Инструкция по дальнейшей работе с production deploy Tutopt на Railway.

Первичный сетап: [`README_DEPLOY.md`](../README_DEPLOY.md).

---

## 1. Как работает текущий deploy

- Проект Tutopt подключён к Railway через **GitHub Repository**.
- Production URL: [https://tutopt-production.up.railway.app](https://tutopt-production.up.railway.app)
- Push в ветку `main` запускает Railway deploy.
- Railway сам делает **build / redeploy** после push.
- Конфигурация в репозитории: `railway.toml` (Nixpacks, `npm run start`, release: `npx prisma migrate deploy`).

---

## 2. Как правильно делать изменения

### 1. Работать локально

```bash
npm run dev
```

### 2. Проверить перед commit

```bash
npm run lint
npm run build
```

### 3. Закоммитить

```bash
git status --short
git add .
git commit -m "краткое описание изменений"
```

### 4. Отправить на GitHub

```bash
git push origin main
```

### 5. Проверить Railway

Railway → **tutopt** → **Deployments** — дождаться successful deployment.

### 6. Проверить production

Открыть: [https://tutopt-production.up.railway.app](https://tutopt-production.up.railway.app)

---

## 3. Checklist после каждого deploy

| Страница | URL |
|----------|-----|
| Главная | `/` |
| Каталог | `/listings` |
| Карточка объявления | `/listings/[id]` |
| Вход | `/login` |
| Регистрация | `/register` |
| Избранное | `/favorites` |
| Уведомления | `/notifications` |
| Кабинет продавца | `/seller/dashboard` |
| Заявки продавца | `/seller/leads` |
| Кабинет покупателя | `/buyer/dashboard` |
| Админка (пользователи) | `/admin/users` |
| Модерация объявлений | `/admin/moderation/listings` |

Базовый адрес: `https://tutopt-production.up.railway.app`

После проверки смотрите логи при ошибках: Railway → Deployments → View Logs.

---

## 4. Prisma и база данных

Если меняется Prisma schema:

### 1. Создать migration локально

```bash
npx prisma migrate dev --name short_migration_name
```

### 2. Проверить локально

```bash
npm run lint
npm run build
```

### 3. Закоммитить migration files

Включая `prisma/schema.prisma` и файлы в `prisma/migrations/`.

### 4. После deploy на Railway

Убедитесь, что release command (`npx prisma migrate deploy` из `railway.toml`) отработал.

Если нет — выполните в **Railway Console / Shell**:

```bash
npx prisma migrate deploy
```

### Важно

- Не использовать `prisma db push` на production без крайней необходимости.
- Не удалять production database.
- Seed на production запускать осторожно и только осознанно.
- Не менять production DB руками без причины.

---

## 5. Env variables (Railway service tutopt)

В Railway → **tutopt** → **Variables** должны быть:

| Переменная | Примечание |
|------------|------------|
| `DATABASE_URL` | Ссылка на Railway Postgres |
| `NODE_ENV` | `production` |
| `LOG_LEVEL` | например `info` |
| `NEXT_PUBLIC_APP_URL` | публичный URL приложения |

Пример публичного URL (можно писать в docs):

```text
NEXT_PUBLIC_APP_URL=https://tutopt-production.up.railway.app
```

`DATABASE_URL` должен ссылаться на Railway Postgres (Reference Variable), например:

```text
${{ Postgres.DATABASE_URL }}
```

### Google OAuth

Локально в `.env`:

```text
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Production (Railway Variables):

```text
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=https://tutopt-production.up.railway.app/api/auth/google/callback
NEXT_PUBLIC_APP_URL=https://tutopt-production.up.railway.app
```

Google Cloud Console → Authorized redirect URIs:
- `http://localhost:3000/api/auth/google/callback`
- `https://tutopt-production.up.railway.app/api/auth/google/callback`

**SELLER через Google:** User создаётся без телефона и без SellerProfile → redirect на `/seller/onboarding` → OTP + реальный телефон → SellerProfile → `/seller/dashboard`.

### OTP / SMS

Сейчас SMS-провайдер **не подключён**.

- **development:** OTP в server console и toast (`devOtpCode`)
- **production без `SMS_PROVIDER` и без demo:** `/api/auth/otp/send` → «SMS-подтверждение пока не настроено»
- **временный demo на Railway (тестовый сайт):**

```text
DEMO_OTP_ENABLED=true
```

Тогда OTP возвращается в response и показывается в UI toast. Это **временный** режим.

Перед реальными пользователями обязательно:

```text
DEMO_OTP_ENABLED=false
```

(или удалить переменную)

- Подпись `phoneVerificationToken`: `OTP_SECRET` (опционально) или fallback на `DATABASE_URL`

Позже для реального SMS:
1. выбрать провайдера (Twilio / local KG SMS)
2. задать `SMS_PROVIDER` + ключи провайдера
3. подключить adapter в `src/features/auth/lib/phone-otp.ts`
4. выключить `DEMO_OTP_ENABLED`

Обычная регистрация больше **не** принимает email — только phone + OTP + password. Email появляется только через Google.

Реальные значения секретов **не** коммитить и **не** писать в документацию.

> После смены `NEXT_PUBLIC_*` нужен **Redeploy** (значение вшивается на этапе build).

Опционально только для ручного `npm run admin:create`: `ADMIN_EMAIL`, `ADMIN_PHONE`, `ADMIN_NAME`, `ADMIN_PASSWORD`.

---

## 6. Uploads / изображения

Текущая логика (код не менять в рамках этой инструкции):

| | |
|--|--|
| Файл | `src/features/listings/lib/save-upload.ts` |
| Путь на диске | `public/uploads/listings/` |
| URL | `/uploads/listings/<filename>` |

**Риск на production:** локальный filesystem внутри контейнера **не персистентен**. Файлы могут пропасть при redeploy / перезапуске.

Временные варианты:

- Railway **Volume** с mount path `/app/public/uploads` (если volume уже настроен и подходит под текущий путь).
- Долгосрочно: Cloudflare R2 / S3-compatible storage (отдельная задача; upload logic пока не менялась).

---

## 7. Emergency rollback

Если production сломался после push:

### Вариант A — Railway Deployments

1. Railway → **tutopt** → **Deployments**
2. Открыть предыдущий **successful** deployment
3. Redeploy / rollback, если доступно в UI

### Вариант B — git revert

```bash
git revert <commit_hash>
git push origin main
```

Railway заново задеплоит откат.

### Вариант C — остановить autodeploy

Временно выключить autodeploy в настройках сервиса, если нужно остановить постоянные redeploy / нестабильные push.

После любого rollback проверьте checklist из раздела 3.

---

## 8. Правила работы дальше

- Не пушить незавершённые изменения в `main`.
- Перед push всегда делать `npm run lint` и `npm run build`.
- Не коммитить `.env`.
- Не писать реальные секреты в README / docs.
- Не менять Prisma schema без migration.
- Не запускать seed на production повторно без понимания последствий.
- Большие задачи делить на маленькие.
- После каждого deploy проверять production вручную (checklist выше).
