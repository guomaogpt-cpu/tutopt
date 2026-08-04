# Market production P0 hotfix — `/market` 500

## 1. Симптом

Production `GET /market` → **500 Internal Server Error**.

UI: «Ошибка / Что-то пошло не так».

Console: `Error: An error occurred in the Server Components render...` (message omitted in production).

`GET /favicon.ico` → 404 (отдельный polish, не причина 500).

## 2. Причина

`MarketLandingPage` был **Server Component** и передавал функцию `getMarketCategoryVisual` в client-компонент `VerticalCategoryHighlights` (`getVisual={...}`).

В React Server Components **нельзя** передавать функции через RSC → Client boundary. Это даёт runtime 500 только на `/market`.

`/opt` не падал, потому что `OptLandingPage` и `OptCategoryHighlights` оба `"use client"` — функция остаётся в client bundle.

Railway logs из Cursor **недоступны**; причина найдена **по коду** (сравнение market vs opt).

## 3. Почему это production P0

`/market` — главный вход в обычные объявления. 500 блокирует весь market vertical для пользователей.

## 4. Что исправлено

- `MarketLandingPage` → `"use client"` (как `/opt` / `/services`)
- Добавлен client-wrapper `MarketCategoryHighlights` (зеркало `OptCategoryHighlights`)
- `getMarketCategoryVisual` больше не пересекает RSC boundary
- `/market` page: try/catch вокруг `getVerticalPageData` + fallback categories / empty listings
- Empty state с CTA «Подать объявление»
- Favicon: rewrite `/favicon.ico` → logo PNG

## 5. Какие fallback добавлены

При ошибке загрузки данных или пустых категориях:

- 9 базовых market-категорий (Электроника, Одежда, Дом и сад, …)
- `listings: []`, `publishedCount: 0`
- страница всё равно рендерит hero + CTA

## 6. Какие routes проверены

Локально: lint / tsc / build.

После деплоя ожидается:

- `/market` — 200
- `/listings?vertical=market` / `MARKET`
- `/listings/new?vertical=market` / `MARKET`
- `/opt`, `/services`, `/cargo`, `/`
- `/sitemap.xml`, `/robots.txt`

## 7. Что осталось

- Подтвердить 200 на production после deploy
- При желании уменьшить вес favicon (сейчас rewrite на PNG logo)
- Не трогали cargo / company / auth
