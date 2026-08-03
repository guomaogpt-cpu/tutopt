# Market Listings MVP — Phase 98

## 1. Цель

Довести обычные объявления (`/market`, `/listings`) до состояния **user-friendly MVP**: понятный вход, каталог, создание, просмотр, связь с автором, mobile и фиолетовая тема раздела. Карго не трогали без необходимости.

## 2. Что проверено

| Страница / зона | Результат |
|---|---|
| `/market` | Hero, категории, последние объявления, purple wash |
| `/listings`, `?vertical=MARKET` | Поиск, фильтры/drawer, сортировка, карточки, empty |
| `/listings/new?vertical=MARKET` | Тип «Объявление», upload hint, purple submit, success |
| `/listings/[id]` | Галерея, цена, автор/компания, lead, 404 для bad id |
| `/account/listings` | Свои объявления, статусы, empty CTA |
| Upload | Существующий flow `/api/uploads/...` без изменений schema |
| Mobile | Компактный hero, 2-col категории, дата на карточке, sticky CTA |
| Security | Ownership edit/archive, session userId, safe not-found |

## 3. Что улучшено

- `/market` hero: заголовок «Объявления», подзаголовок, CTA «Найти товар» + «Подать объявление»
- Категории после hero (сетка 2 колонки на mobile) через `VerticalCategoryHighlights`
- Фиолетовый page wash / toolbar / empty CTA / company badge для MARKET
- Contact CTA «Связаться»; lead MARKET без quantity/email; success copy по ТЗ
- Market request hint без оптовой терминологии
- Дата и seller/company row на карточке видны на mobile
- Каталог H1/описание из `getCatalogVerticalCopy` при `vertical=MARKET`

## 4. Как работает `/market`

Компактный hero → категории → последние объявления. Создание: `/listings/new?vertical=MARKET`. Каталог: `/listings?vertical=MARKET`.

## 5. Как работает `/listings`

Поиск, вкладки вертикалей, фильтры (drawer на mobile), сортировка новые/дешёвые/дорогие, карточки, empty «Ничего не найдено» + сброс. Для MARKET — purple акценты.

## 6. Как работает создание объявления

Любой аккаунт может подать объявление. Тип «Объявление», фото с «Фото загружено», success: открыть / мои / ещё одно.

## 7. Как работает страница объявления

Guest смотрит карточку. Связь через lead-форму (login при необходимости). Автор видит заявки в `/account/requests`. Чата нет.

## 8. Как работает `/account/listings`

Только свои объявления; фильтры статуса/типа; edit/archive; empty с «Подать объявление».

## 9. Что осталось

- Живой ручной прогон upload/create на production с тестовым аккаунтом
- Больше контента в категориях (данные seed/модерация)
- Не в scope: чат, рейтинги, платежи, продвижение, CRM

## 10. Решение: готово / не готово к тесту обычных объявлений

**Готово к тесту обычных объявлений** как MVP: вход `/market`, каталог, создание, detail + связь, account listings и purple theme согласованы.

---

## Phase 98 market listings MVP

Market landing + catalog + contact copy polish for ordinary listings.
