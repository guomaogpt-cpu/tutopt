# Tutopt — SEO Strategy

## 1. Цели

- Органический трафик из Google и Yandex по запросам оптовой торговли в Кыргызстане
- Индексация категорий, объявлений и профилей продавцов
- Core Web Vitals в зелёной зоне

**Целевые запросы (примеры):**

- оптом бишкек
- купить оптом кыргызстан
- поставщики [категория] бишкек
- [товар] оптом цена

---

## 2. Технический SEO

### 2.1 Рендеринг

- **SSR/SSG** через Next.js App Router для всех публичных страниц
- ISR для страниц категорий (revalidate: 3600 сек)
- Динамические объявления: SSR с кэшем CDN

### 2.2 Meta-теги (по типу страницы)

| Страница | title | description |
|----------|-------|-------------|
| Главная | Tutopt — Оптовый маркетплейс Кыргызстана | Купить и продать оптом в Бишкеке и по всей КР. Тысячи объявлений от проверенных поставщиков. |
| Категория | {Категория} оптом — купить в Кыргызстане \| Tutopt | {SEO description категории из CMS} |
| Объявление | {Название} — {цена} сом \| Tutopt | {Первые 155 символов описания} |
| Продавец | {Компания} — оптовый поставщик \| Tutopt | {Описание компании} |
| Поиск | Результаты поиска «{q}» \| Tutopt | noindex (см. ниже) |

**Правила title:**

- Длина ≤ 60 символов
- Уникальность на каждой странице
- Бренд «Tutopt» в конце через `|`

### 2.3 Robots

**`/robots.txt`:**

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /account/
Disallow: /seller/dashboard/
Disallow: /api/
Disallow: /auth/

Sitemap: https://tutopt.kg/sitemap.xml
```

**noindex:**

- `/search?q=*` — поисковые выдачи
- Страницы пагинации `?page>1` — `noindex, follow` (или canonical на page=1)
- Черновики, архивные объявления
- Страницы с >3 фильтрами в query (thin content)

### 2.4 Canonical URL

| Случай | Canonical |
|--------|-----------|
| Объявление | `https://tutopt.kg/listing/{slug}` |
| Категория без фильтров | `https://tutopt.kg/category/{slug}` |
| Категория с 1-2 фильтрами | self (если уникальный контент) |
| Дубли slug | 301 на основной |
| www | 301 на non-www (или наоборот — единообразно) |

### 2.5 Sitemap

**`/sitemap.xml`** — sitemap index:

| Файл | Содержимое | Changefreq |
|------|------------|------------|
| `sitemap-static.xml` | Главная, about, for-sellers, ... | monthly |
| `sitemap-categories.xml` | Все активные категории | weekly |
| `sitemap-listings-{n}.xml` | Объявления PUBLISHED, по 10k URL | daily |
| `sitemap-sellers.xml` | Верифицированные продавцы | weekly |
| `sitemap-seo.xml` | SEO-лендинги | monthly |

Генерация: cron job / API route, обновление при publish listing.

### 2.6 hreflang (фаза 2)

```html
<link rel="alternate" hreflang="ru" href="https://tutopt.kg/..." />
<link rel="alternate" hreflang="ky" href="https://tutopt.kg/ky/..." />
<link rel="alternate" hreflang="x-default" href="https://tutopt.kg/..." />
```

---

## 3. Структурированные данные (Schema.org)

### 3.1 Главная и категории

```json
{
  "@type": "WebSite",
  "name": "Tutopt",
  "url": "https://tutopt.kg",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://tutopt.kg/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### 3.2 Объявление

```json
{
  "@type": "Product",
  "name": "...",
  "description": "...",
  "image": ["..."],
  "offers": {
    "@type": "Offer",
    "price": "1500",
    "priceCurrency": "KGS",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "..."
    }
  }
}
```

### 3.3 BreadcrumbList

На всех внутренних страницах:

Главная → Категория → Объявление

### 3.4 Organization

На `/about` и в footer:

```json
{
  "@type": "Organization",
  "name": "Tutopt",
  "url": "https://tutopt.kg",
  "logo": "https://tutopt.kg/logo.png",
  "address": { "@type": "PostalAddress", "addressCountry": "KG" }
}
```

---

## 4. Контентная стратегия

### 4.1 SEO-лендинги (через админку)

Шаблонные страницы под long-tail:

- `/p/optovaya-torgovlya-bishkek`
- `/p/postavshchiki-produktov-pitaniya-kyrgyzstan`
- `/p/stroitelnye-materialy-optom`

Каждая: уникальный H1, 800+ слов, ссылки на категории, блок свежих объявлений.

### 4.2 Категории

- Уникальное SEO-описание 150-300 слов внизу страницы
- FAQ schema для топ-категорий (фаза 2)

### 4.3 Блог (фаза 3)

- «Как выбрать оптового поставщика в КР»
- Отраслевые обзоры

---

## 5. Производительность (CWV)

| Метрика | Цель |
|---------|------|
| LCP | < 2.5 s |
| INP | < 200 ms |
| CLS | < 0.1 |

**Меры:**

- `next/image` с WebP/AVIF
- Lazy load изображений ниже fold
- Font subsetting (кириллица)
- CDN для static assets
- Preconnect к CDN и API

---

## 6. Внутренняя перелинковка

- Mega-menu: все категории 1-2 уровня
- Breadcrumbs на каждой странице
- Блок «Похожие объявления» на listing
- Блок «Другие категории» на category
- Footer: топ-20 категорий

---

## 7. Open Graph и соцсети

```html
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="https://tutopt.kg/og/listing/{id}.jpg" />
<meta property="og:url" content="..." />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
```

**OG-изображения:** динамическая генерация (Next.js OG Image) с фото товара + ценой + логотипом.

---

## 8. Локальное SEO

- Google Business Profile (если есть офис)
- Упоминание городов в title категорий: «... в Бишкеке»
- Фильтр по региону → landing «{Категория} в {Регион}»

---

## 9. Мониторинг

| Инструмент | Назначение |
|------------|------------|
| Google Search Console | Индексация, ошибки |
| Yandex Webmaster | Индексация RU/KZ рынок |
| Lighthouse CI | CWV в pipeline |
| Ahrefs / Serpstat (фаза 2) | Позиции, backlinks |

**Алерты:**

- Падение indexed pages > 10%
- Рост 404
- CWV out of green

---

## 10. Чеклист перед запуском

- [ ] robots.txt и sitemap доступны
- [ ] Все публичные страницы имеют unique title/description
- [ ] Schema.org валидна (Google Rich Results Test)
- [ ] 301 с HTTP на HTTPS
- [ ] favicon, apple-touch-icon
- [ ] 404 и 500 кастомные страницы
- [ ] Canonical на дублях
- [ ] noindex на /search, /admin, /account

---

## 11. Связанные документы

- [03_PAGES.md](./03_PAGES.md) — маршруты
- [06_ADMIN_PANEL.md](./06_ADMIN_PANEL.md) — SEO-страницы в админке
- [07_SEARCH_FILTERS.md](./07_SEARCH_FILTERS.md) — canonical фильтров
- [09_DEPLOYMENT.md](./09_DEPLOYMENT.md) — CDN, домен
