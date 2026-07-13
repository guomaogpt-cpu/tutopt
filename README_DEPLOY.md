# Deploy Tutopt on Railway

Краткая инструкция для деплоя Next.js + Prisma + PostgreSQL на [Railway](https://railway.app).

## 1. Создать сервисы

1. Создайте новый проект в Railway.
2. Добавьте **PostgreSQL** plugin — Railway автоматически создаст `DATABASE_URL`.
3. Добавьте **Web Service** из GitHub-репозитория (ветка `main` или нужная вам).

Railway/Nixpacks определит Next.js по `package.json`. Дополнительная конфигурация — в `railway.toml`.

## 2. Переменные окружения

Задайте в Railway Dashboard → Service → Variables:

| Переменная | Обязательна | Описание |
|------------|-------------|----------|
| `DATABASE_URL` | Да | Подключение к PostgreSQL (часто подставляется из PostgreSQL plugin) |
| `NODE_ENV` | Да | `production` |
| `NEXT_PUBLIC_APP_URL` | Да | Публичный URL приложения, например `https://your-app.up.railway.app` |
| `LOG_LEVEL` | Нет | `debug` \| `info` \| `warn` \| `error` (по умолчанию `info`) |

Для создания первого админа (только при ручном запуске `admin:create`):

| Переменная | Описание |
|------------|----------|
| `ADMIN_EMAIL` | Email администратора |
| `ADMIN_PHONE` | Телефон |
| `ADMIN_NAME` | Имя |
| `ADMIN_PASSWORD` | Пароль (не коммитить, не логировать) |

**Не требуются** отдельные `SESSION_SECRET`, `JWT_SECRET`, `COOKIE_SECRET` — сессии хранятся в БД.

> `NEXT_PUBLIC_*` вшивается при **build**. После смены `NEXT_PUBLIC_APP_URL` нужен **redeploy** (новый build).

## 3. Build и start

Скрипты из `package.json`:

```bash
npm run build    # next build (postinstall → prisma generate)
npm run start    # next start (слушает PORT от Railway)
```

Миграции при деплое (из `railway.toml`):

```bash
npx prisma migrate deploy
```

Если release command не сработал, выполните вручную:

```bash
railway run npx prisma migrate deploy
```

## 4. Seed и admin (вручную, один раз)

**Seed** (регионы, города, категории, бренды) — **не** запускается автоматически при deploy:

```bash
railway run npm run db:seed
```

Seed идемпотентен для справочников (upsert), но на production запускайте осознанно.

**Первый администратор** — отдельная команда (не seed):

```bash
# Сначала задайте ADMIN_* в Variables, затем:
railway run npm run admin:create
```

## 5. Загрузка изображений (uploads)

Сейчас фото объявлений сохраняются **локально на диск**:

- Путь на сервере: `public/uploads/listings/`
- URL в приложении: `/uploads/listings/<filename>`
- Код: `src/features/listings/lib/save-upload.ts`

**На Railway без Volume это не персистентно:** файлы пропадут при redeploy или перезапуске контейнера.

### Вариант A — Railway Volume (временное решение)

1. В сервисе добавьте **Volume**.
2. Mount path: `/app/public/uploads`
3. Убедитесь, что рабочая директория приложения — корень репозитория (`/app` в Nixpacks).

Тогда `public/uploads/listings/` будет сохраняться между рестартами (но не между сменой сервиса/региона без бэкапа).

### Вариант B — объектное хранилище (рекомендуется позже)

S3/R2/Cloudinary — отдельная задача; сейчас upload logic не менялась.

## 6. Проверка после deploy

1. Откройте `NEXT_PUBLIC_APP_URL` — главная страница загружается.
2. Проверьте каталог `/listings`.
3. Войдите под admin (после `admin:create`).
4. Загрузите тестовое фото объявления — убедитесь, что Volume настроен, если нужна персистентность.
5. Логи: Railway Dashboard → Deployments → View Logs.

Локальная проверка перед push:

```bash
npm run lint
npm run build
```

## 7. Чеклист в Railway Dashboard

- [ ] PostgreSQL plugin подключён, `DATABASE_URL` доступен web-сервису
- [ ] `NODE_ENV=production`
- [ ] `NEXT_PUBLIC_APP_URL` = публичный HTTPS URL сервиса
- [ ] Deploy прошёл, `prisma migrate deploy` выполнился (release logs)
- [ ] `railway run npm run db:seed` (если БД пустая)
- [ ] `railway run npm run admin:create` (первый admin)
- [ ] Volume на `/app/public/uploads` (если нужны локальные фото)

## 8. Полезные команды

```bash
npm run db:migrate:deploy   # prisma migrate deploy
npm run db:seed             # базовый seed
npm run admin:create        # создать/обновить admin
npm run db:studio           # Prisma Studio (только локально)
```
