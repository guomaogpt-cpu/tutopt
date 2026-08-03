# Services MVP — Phase 99

## 1. Цель

Довести раздел **Услуги** до user-friendly MVP: услуги не выглядят как товарный каталог — отдельный вход `/services`, service copy, зелёная тема, связь с исполнителем. Карго не трогали.

## 2. Что проверено

| Зона | Результат |
|---|---|
| `/services` | Hero, категории, последние услуги, «Как это работает» |
| `/listings?vertical=SERVICES` | Заголовок «Услуги», placeholder, green accents, empty |
| `/listings/new?vertical=SERVICES` | Тип «Услуга», form labels, green submit, success |
| `/listings/[id]` (SERVICES) | «Связаться», исполнитель, service hint/success |
| `/account/listings` filter SERVICES | Empty state для услуг |
| Contact/lead | Message + phone, без quantity/email |
| Mobile | Компактный hero, 2-col категории, sticky CTA |

## 3. Что улучшено

- Hero: «Услуги» + подзаголовок + «Найти услугу» / «Разместить услугу»
- Green theme wash (вместо teal) + how-it-works
- Catalog copy, placeholders, empty «Услуги не найдены…» + «Сбросить фильтры»
- Lead CTA «Связаться»; success «Исполнитель получит…»
- Seller card role «Исполнитель»; company badge green
- Create: page title «Разместить услугу», city label, moderation success CTAs
- Account empty for SERVICES filter
- Header/catalog search placeholder «Какая услуга нужна?»

## 4. Как работает `/services`

Компактный green hero → категории → последние услуги → короткий «Как это работает».

## 5. Категории услуг

Существующая структура профессий сохранена; отображение компактное (2 колонки mobile). Рекомендуемый набор уже покрыт seed/config (ремонт, электрики, клининг, IT и т.д.).

## 6. Как работает каталог услуг

`/listings?vertical=SERVICES`: поиск, фильтры/drawer, сортировка, green primary, service empty states.

## 7. Как работает создание услуги

`/listings/new?vertical=SERVICES`: labels без MOQ/товарной терминологии; success «Услуга отправлена на модерацию» + открыть / мои / ещё одну.

## 8. Как работает карточка услуги

Фото, название, цена/договорная, город, категория, исполнитель/компания, verified, избранное.

## 9. Как работает связь с исполнителем

Кнопка «Связаться» → lead (сообщение + телефон) → success для исполнителя. Чата нет.

## 10. Что осталось

- Живой create/upload прогон на production
- Наполнение категорий контентом
- Вне scope: чат, календарь, оплата, рейтинги, отзывы

## 11. Решение

**Готово к тесту услуг** как MVP.

---

## Phase 99 services MVP

Services landing + catalog + executor contact copy polish.

## Phase 100 opt B2B MVP

See `docs/OPT_B2B_MVP_PHASE_100.md`.
