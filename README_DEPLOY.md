# Deploy Tutopt on Railway (GitHub Repository)

Инструкция для деплоя Next.js + Prisma + PostgreSQL на [Railway](https://railway.app) через подключение GitHub-репозитория.

> Deploy выполняется вручную через Railway UI. Этот файл — только инструкция.

---

## 1. Создать Railway project через GitHub Repository

1. Зайдите на [railway.app](https://railway.app) и войдите в аккаунт.
2. Нажмите **New Project**.
3. Выберите **Deploy from GitHub repo**.
4. Подключите GitHub-аккаунт, если ещё не подключён.
5. Выберите репозиторий **tutopt** (или ваш fork).
6. Railway создаст Web Service и начнёт первый build.

**Важно:** код с `railway.toml`, `postinstall` и `README_DEPLOY.md` должен быть уже в репозитории (закоммичен и запушен вами).

Railway/Nixpacks определит Next.js по `package.json`. Дополнительные настройки — в `railway.toml` в корне репозитория.

---

## 2. Добавить PostgreSQL

1. В том же Railway project нажмите **+ New** → **Database** → **PostgreSQL**.
2. Дождитесь, пока база поднимется.
3. Откройте PostgreSQL service → вкладка **Variables** или **Connect**.
4. Скопируйте `DATABASE_URL` (или используйте **Reference Variable** в web-сервисе).

### Подключить DATABASE_URL к web-сервису

1. Откройте **Web Service** (Next.js).
2. **Variables** → **New Variable** → **Add Reference**.
3. Выберите PostgreSQL service → переменную `DATABASE_URL`.

Так web-приложение получит доступ к БД без ручного копирования строки подключения.

---

## 3. Переменные окружения (Railway Variables)

В Web Service → **Variables** добавьте:

| Переменная | Обязательна | Описание |
|------------|-------------|----------|
| `DATABASE_URL` | Да | Reference из PostgreSQL plugin |
| `NODE_ENV` | Да | `production` |
| `NEXT_PUBLIC_APP_URL` | Да | Публичный HTTPS URL сервиса, например `https://tutopt-production.up.railway.app` |
| `LOG_LEVEL` | Нет | `debug` \| `info` \| `warn` \| `error` (по умолчанию `info`) |
| `GOOGLE_CLIENT_ID` | Нет* | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Нет* | Google OAuth Client Secret |
| `GOOGLE_REDIRECT_URI` | Нет* | `https://tutopt-production.up.railway.app/api/auth/google/callback` |

\* Без Google-переменных работает вход по телефону/паролю; кнопка Google будет disabled.

### Для создания admin (только при ручном запуске)

| Переменная | Когда нужна |
|------------|-------------|
| `ADMIN_EMAIL` | `npm run admin:create` |
| `ADMIN_PHONE` | `npm run admin:create` |
| `ADMIN_NAME` | `npm run admin:create` |
| `ADMIN_PASSWORD` | `npm run admin:create` |

### Не используются в проекте

Следующие переменные **не нужны** — в коде их нет:

- `SESSION_SECRET`
- `JWT_SECRET`
- `COOKIE_SECRET`

Сессии хранятся в PostgreSQL (таблица `Session`), cookie — `tutopt_session`.

> `NEXT_PUBLIC_*` встраивается при **build**. После смены `NEXT_PUBLIC_APP_URL` нужен **Redeploy** (новый build).

### Публичный домен

1. Web Service → **Settings** → **Networking** → **Generate Domain**.
2. Скопируйте выданный URL и укажите его в `NEXT_PUBLIC_APP_URL`.
3. Запустите **Redeploy**, чтобы build подхватил новый URL.

---

## 4. Build, start и migrations

### Автоматически (из `package.json` + `railway.toml`)

| Этап | Команда |
|------|---------|
| postinstall | `prisma generate` |
| build | `npm run build` → `next build` |
| release | `npx prisma migrate deploy` |
| start | `npm run start` → `next start` |

`next start` слушает `PORT`, который Railway задаёт автоматически.

### Migrations вручную (если release не сработал)

Через Railway CLI:

```bash
railway link          # привязать к проекту
railway run npx prisma migrate deploy
```

Или через Railway Dashboard → Web Service → **Settings** → выполнить одноразовую команду в shell/deploy logs, если доступно.

**Seed не запускается автоматически** при каждом deploy.

---

## 5. Seed и admin (вручную, один раз)

### Базовый seed (регионы, города, категории, бренды)

Только если БД пустая:

```bash
railway run npm run db:seed
```

Seed использует upsert для справочников, но на production запускайте осознанно.

### Первый администратор

Seed **не создаёт** admin. Отдельная команда:

1. Задайте `ADMIN_EMAIL`, `ADMIN_PHONE`, `ADMIN_NAME`, `ADMIN_PASSWORD` в Variables.
2. Выполните:

```bash
railway run npm run admin:create
```

---

## 6. Uploads (фото объявлений)

Сейчас загрузка — **локальная файловая система**:

| | |
|--|--|
| Код | `src/features/listings/lib/save-upload.ts` |
| API | `src/app/api/uploads/listing-images/route.ts` |
| Путь на диске | `public/uploads/listings/` |
| URL в браузере | `/uploads/listings/<filename>` |

### Без Railway Volume

Загрузка **работает**, но файлы **не персистентны** — пропадут при redeploy или перезапуске контейнера.

### С Railway Volume (рекомендуется для MVP)

1. Web Service → **Volumes** → **Add Volume**.
2. **Mount path:** `/app/public/uploads`
3. Redeploy сервиса.

Nixpacks использует `/app` как рабочую директорию — путь совпадает с `process.cwd()/public/uploads/listings`.

Объектное хранилище (S3/R2) — отдельная задача, upload logic сейчас не менялась.

---

## 7. Проверка после deploy

1. **Deployments** → убедитесь, что build и release прошли без ошибок.
2. Откройте публичный URL — главная страница загружается.
3. Проверьте `/listings` — каталог открывается.
4. Войдите под admin (после `admin:create`).
5. Загрузите тестовое фото объявления — проверьте Volume, если нужна персистентность.
6. Смотрите логи: **Deployments** → **View Logs**.

### Локальная проверка перед push

```bash
npm run lint
npm run build
```

---

## 8. Чеклист в Railway Dashboard

- [ ] New Project → Deploy from GitHub repo → выбран репозиторий tutopt
- [ ] Добавлен PostgreSQL, `DATABASE_URL` подключён к web-сервису (Reference)
- [ ] `NODE_ENV=production`
- [ ] Сгенерирован публичный домен
- [ ] `NEXT_PUBLIC_APP_URL` = этот домен → **Redeploy**
- [ ] Build успешен, `prisma migrate deploy` в release logs
- [ ] `railway run npm run db:seed` (если БД пустая)
- [ ] `ADMIN_*` заданы → `railway run npm run admin:create`
- [ ] Volume на `/app/public/uploads` (если нужны локальные фото)

---

## 9. Полезные npm scripts

```bash
npm run build              # production build
npm run start              # production server
npm run lint               # ESLint
npm run db:migrate:deploy  # prisma migrate deploy
npm run db:seed            # базовый seed
npm run admin:create       # создать/обновить admin
```
