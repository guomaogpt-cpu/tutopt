# SEO Strategy — Tutopt

Краткий план SEO для мульти-направленной classified-платформы.

**Статус:** Phase 5 (category + city SEO landings)  
**Код:** metadata, sitemap, robots, JSON-LD, breadcrumbs + ЧПУ `/{vertical}/{category}` и `/{vertical}/{category}/{city}`.

---

## Current phase (сейчас)

| Поверхность | URL | SEO |
|-------------|-----|-----|
| Главная | `/` | metadata + canonical |
| Направления | `/opt`, `/market`, `/services`, `/cargo` | title/description/OG/canonical |
| Category landing | `/opt/produkty-pitaniya` | generateMetadata + BreadcrumbList |
| Category + city | `/opt/produkty-pitaniya/bishkek` | generateMetadata + empty state if no listings |
| Каталог | `/listings`, `/listings?vertical=…` | dynamic metadata по query (без rewrite) |
| Карточка | `/listings/[id]` | generateMetadata + Product/Service JSON-LD |
| Sitemap | `/sitemap.xml` | static + categories + real category/city combos + listings |
| Robots | `/robots.txt` | allow public, disallow private/api |

### SEO URL rules (MVP)

```text
/{verticalSlug}/{categorySeoSlug}
/{verticalSlug}/{categorySeoSlug}/{citySeoSlug}
```

Примеры:

```text
/opt/produkty-pitaniya
/opt/produkty-pitaniya/bishkek
/market/telefony-i-elektronika
/services/remont-i-stroitelstvo
/cargo/dostavka-kitay-kyrgyzstan
```

- MARKET/SERVICES/CARGO: в path убирается DB-prefix (`market-`, `services-`, `cargo-`).
- Города: публичные алиасы `bishkek` / `osh` → DB slug `bishkek-city` / `osh-city`.
- Listing detail пока по id: `/listings/[id]`.

---

## Future (Phase 6+)

Глубокие деревья категорий в path:

```text
/opt/produkty-pitaniya/frukty/yabloki/bishkek
/market/telefony/iphone/bishkek
```

Также:

- 301 с `/listings?category=…` на ЧПУ где возможно;
- vertical + city без category (`/opt/bishkek`);
- listing SEO slug URL;
- category SEO editor text в CMS.

Правила slug:

- латиница / транслит;
- стабильные slug (не менять без 301);
- namespace по vertical в path;
- city slug из справочника + friendly aliases.

---

## Canonical / redirect strategy

- Category / category+city: canonical = текущий ЧПУ path.
- Catalog query URLs пока остаются рабочими без обязательного 301.
- Listing detail: canonical `/listings/[id]`.
- Пустые city-комбинации не попадают в sitemap (страница может отдать empty state).

---

## Что не индексируем

- `/admin`, `/seller/dashboard`, `/buyer/dashboard`
- `/favorites`, `/notifications`
- `/login`, `/register`, `/api/*`
- черновики и непубликованные объявления (нет в sitemap)
- пустые category+city комбинации (нет в sitemap)

---

Связанный документ: [`PLATFORM_VERTICALS_STRATEGY.md`](./PLATFORM_VERTICALS_STRATEGY.md).
