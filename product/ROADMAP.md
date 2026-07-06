# Roadmap — Tutopt

B2B маркетплейс оптовых товаров Кыргызстана.

---

## Фаза 0 — Foundation ✅ (июнь–июль 2026)

**Цель:** рабочий MVP для демо и первых пользователей.

| Блок | Результат |
|------|-----------|
| Инфраструктура | Next.js 15, PostgreSQL, Prisma, Docker |
| Auth | Login, register, sessions, password reset UI |
| Listings | CRUD create, moderation, publish, catalog, detail |
| Buyers | Favorites, leads, dashboard, listing views |
| Sellers | Dashboard, leads inbox, public profile |
| Admin | User roles, listing moderation |
| Notifications | DB notifications, polling badge |
| UX fixes | Return URL, role-aware CTA, русская валидация |

**Метрика успеха:** end-to-end сценарий «регистрация → объявление → модерация → заявка → уведомление» работает.

---

## Фаза 1 — Stabilization (Q3 2026)

**Цель:** продукт готов к закрытой бете с реальными продавцами.

- Email delivery (reset, verify, lead notifications)
- Редактирование объявлений
- Единая UI-система (tokens, empty states, 404)
- S3/CDN для изображений
- Seller lead management (viewed/closed)
- Production deploy + monitoring
- Базовая аналитика (просмотры, заявки)

**Метрика успеха:** 10+ активных продавцов, 50+ опубликованных объявлений.

---

## Фаза 2 — Growth (Q4 2026)

**Цель:** рост каталога и удержание покупателей.

- Каталог поставщиков
- Расширенный поиск (бренды, атрибуты, full-text)
- Подписки на категории
- Real-time уведомления (WebSocket/SSE)
- Верификация продавцов
- SEO-лендинги по категориям/городам
- Мобильный UX polish

**Метрика успеха:** 100+ объявлений, DAU/MAU ratio > 15%.

---

## Фаза 3 — Platform (2027)

**Цель:** полноценная B2B-платформа.

- Встроенный чат
- КП / коммерческие предложения
- Отчёты и модерация контента
- Платное продвижение
- API для интеграций
- Мобильное приложение (PWA или native)
- Мультиязычность (ru / ky / en)

---

## Не в scope (пока)

- Платежи и escrow
- Логистика и доставка
- CRM для продавцов
- Маркетплейс retail (B2C)
