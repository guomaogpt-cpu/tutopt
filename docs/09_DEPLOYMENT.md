# Tutopt — Deployment & Infrastructure

## 1. Обзор окружений

| Окружение  | Домен               | Назначение    |
| ---------- | ------------------- | ------------- |
| local      | `localhost:3000`    | Разработка    |
| staging    | `staging.tutopt.kg` | QA, демо      |
| production | `tutopt.kg`         | Боевой трафик |

---

## 2. Архитектура (production)

```
                    ┌─────────────┐
                    │   Cloudflare │  CDN, DDoS, SSL
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   Nginx      │  Reverse proxy (опционально)
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼──────┐ ┌───▼───┐ ┌──────▼──────┐
       │  Next.js #1  │ │  #2   │ │  Next.js #N │  Docker containers
       └──────┬──────┘ └───┬───┘ └──────┬──────┘
              │            │            │
              └────────────┼────────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼──────┐ ┌───▼────┐ ┌─────▼─────┐
       │ PostgreSQL   │ │ Redis  │ │ S3/MinIO  │
       │ (primary)    │ │ (фаза2)│ │ uploads   │
       └─────────────┘ └────────┘ └───────────┘
```

---

## 3. Docker

### 3.1 Сервисы (docker-compose.yml)

| Сервис  | Образ                    | Порт |
| ------- | ------------------------ | ---- |
| `app`   | Dockerfile (multi-stage) | 3000 |
| `db`    | postgres:16-alpine       | 5432 |
| `redis` | redis:7-alpine (фаза 2)  | 6379 |
| `minio` | minio (dev/staging)      | 9000 |

### 3.2 Dockerfile (multi-stage)

**Этапы:**

1. `deps` — установка node_modules
2. `builder` — `next build`
3. `runner` — production image (standalone output)

**Размер цели:** < 200 MB

### 3.3 docker-compose (local)

```yaml
# Концептуальная структура (не код для копирования)
services:
  app:
    build: .
    ports: ["3000:3000"]
    env_file: .env
    depends_on: [db]
  db:
    image: postgres:16-alpine
    volumes: [pgdata:/var/lib/postgresql/data]
    environment:
      POSTGRES_DB: tutopt
      POSTGRES_USER: tutopt
      POSTGRES_PASSWORD: ${DB_PASSWORD}
```

---

## 4. Переменные окружения

### 4.1 `.env.example`

| Переменная                       | Описание                     | Пример                                    |
| -------------------------------- | ---------------------------- | ----------------------------------------- |
| `DATABASE_URL`                   | PostgreSQL connection string | `postgresql://tutopt:pass@db:5432/tutopt` |
| `NEXTAUTH_SECRET` / `JWT_SECRET` | Секрет сессий                | random 32+ chars                          |
| `NEXT_PUBLIC_APP_URL`            | Публичный URL                | `https://tutopt.kg`                       |
| `UPLOAD_PROVIDER`                | `local` \| `s3`              | `s3`                                      |
| `S3_BUCKET`                      | Bucket для изображений       | `tutopt-uploads`                          |
| `S3_REGION`                      |                              | `eu-central-1`                            |
| `S3_ACCESS_KEY`                  |                              |                                           |
| `S3_SECRET_KEY`                  |                              |                                           |
| `SMTP_HOST`                      | Email                        |                                           |
| `SMTP_PORT`                      |                              | `587`                                     |
| `SMTP_USER`                      |                              |                                           |
| `SMTP_PASSWORD`                  |                              |                                           |
| `EMAIL_FROM`                     |                              | `noreply@tutopt.kg`                       |
| `REDIS_URL`                      | (фаза 2)                     | `redis://redis:6379`                      |
| `NODE_ENV`                       |                              | `production`                              |

**Правило:** секреты только в env, никогда в git.

---

## 5. CI/CD

### 5.1 Pipeline (GitHub Actions)

**Trigger:** push to `main` → staging; tag `v*` → production

| Stage     | Действия                       |
| --------- | ------------------------------ |
| lint      | ESLint, Prettier check         |
| typecheck | `tsc --noEmit`                 |
| test      | Unit tests (фаза 2)            |
| build     | `next build`                   |
| docker    | Build & push image to registry |
| deploy    | SSH / K8s / Railway / VPS      |
| migrate   | `prisma migrate deploy`        |

### 5.2 Ветки

| Ветка            | Деплой                        |
| ---------------- | ----------------------------- |
| `main`           | staging (auto)                |
| `release/*`      | production (manual approve)   |
| feature branches | preview (опционально, Vercel) |

---

## 6. Хостинг (варианты)

### 6.1 Вариант A: VPS (рекомендуется для КР)

- **Провайдер:** локальный DC или Hetzner/DO
- **Конфиг MVP:** 2 vCPU, 4 GB RAM, 80 GB SSD
- **OS:** Ubuntu 22.04 LTS
- **Процесс:** Docker Compose + systemd

### 6.2 Вариант B: Vercel + Neon

- Next.js на Vercel
- PostgreSQL на Neon (serverless)
- Uploads на Cloudflare R2
- Проще старт, выше cost при росте

### 6.3 Вариант C: Kubernetes (фаза 3)

- При > 50k DAU
- HPA по CPU/RPS

**Рекомендация MVP:** VPS + Docker Compose

---

## 7. База данных

### 7.1 Миграции

```bash
# Деплой
npx prisma migrate deploy
```

- Миграции только вперёд (no rollback в prod без плана)
- Бэкап перед каждой миграцией

### 7.2 Connection pooling

- PgBouncer в transaction mode
- `connection_limit=10` на инстанс Next.js

### 7.3 Бэкапы

| Тип          | Частота             | Retention |
| ------------ | ------------------- | --------- |
| pg_dump full | daily 03:00 Bishkek | 30 days   |
| WAL / PITR   | continuous          | 7 days    |

Хранение: S3-compatible bucket, encryption at rest.

---

## 8. Файловое хранилище

### 8.1 Изображения объявлений

- Upload → S3/MinIO
- Обработка: resize 1200px max, thumbnail 400px, WebP
- CDN URL: `https://cdn.tutopt.kg/uploads/...`

### 8.2 Локальная разработка

- MinIO в docker-compose
- Публичный bucket policy для read

---

## 9. SSL и домен

- DNS: A-record → VPS IP (или CNAME на CDN)
- SSL: Let's Encrypt (certbot) или Cloudflare Full Strict
- Редирект: HTTP → HTTPS, www → non-www

---

## 10. Мониторинг и логи

| Компонент | Инструмент                                 |
| --------- | ------------------------------------------ |
| Uptime    | UptimeRobot / Better Stack                 |
| APM       | Sentry (errors)                            |
| Logs      | Structured JSON → Loki / CloudWatch        |
| Metrics   | Prometheus + Grafana (фаза 2)              |
| DB        | pg_stat_statements, slow query log > 500ms |

### 10.1 Health checks

- `GET /api/health` — каждые 30s
- Alert если 3 fail подряд

### 10.2 Алерты

- Error rate > 1%
- Response time p95 > 2s
- Disk > 80%
- DB connections > 80%

---

## 11. Безопасность инфраструктуры

- Firewall: только 80, 443, 22 (SSH по ключу)
- SSH: disable password auth
- Docker: non-root user в контейнере
- Secrets: GitHub Encrypted Secrets / Vault
- Dependabot: авто PR на уязвимости
- Rate limiting на Nginx/Cloudflare

---

## 12. Процедуры

### 12.1 Деплой production

1. Создать бэкап БД
2. Merge PR в `release`
3. CI build + push image
4. `docker compose pull && docker compose up -d`
5. `prisma migrate deploy`
6. Smoke test: health, главная, login
7. Мониторинг 15 мин

### 12.2 Rollback

1. `docker compose up -d` с предыдущим image tag
2. Откат миграции — только если обратимая
3. Restore DB из бэкапа (крайний случай)

### 12.3 Maintenance mode

- Env `MAINTENANCE_MODE=true`
- Middleware отдаёт 503 + статическую страницу
- Админка доступна по IP whitelist

---

## 13. Локальная разработка

```bash
# Концептуальный flow
cp .env.example .env
docker compose up -d db
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

**Порты:**

- App: 3000
- PostgreSQL: 5432
- MinIO console: 9001

---

## 14. Связанные документы

- [01_PRODUCT_SPEC.md](./01_PRODUCT_SPEC.md) — NFR
- [04_DATABASE.md](./04_DATABASE.md) — схема, миграции
- [08_SEO.md](./08_SEO.md) — CDN, домен
- [10_ROADMAP.md](./10_ROADMAP.md) — фазы инфраструктуры
