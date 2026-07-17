# Saved Searches (MVP, localStorage)

Лёгкие сохранённые поиски покупателя без изменений в БД.

## Как работает

1. На `/listings` в toolbar есть кнопка «Сохранить поиск» (`SaveSearchButton`).
2. Сохраняется каноничный URL текущего поиска (pathname + query params), а не состояние формы.
3. Список хранится в `localStorage` под ключом `tutopt.savedSearches.v1`.
4. На `/buyer/dashboard` блок «Сохранённые поиски» (`SavedSearchesPanel`, client component):
   title, vertical, дата сохранения, «Открыть» и удаление.
5. Работает и для guest — это чисто браузерная функция, login не требуется
   (но блок виден только на защищённом `/buyer/dashboard`).

## Helper

`src/lib/saved-searches/local-saved-searches.ts`:

- `getSavedSearches()` — чтение с валидацией структуры; битый JSON → пустой список
- `saveSearch(input)` — дубликаты по нормализованному URL не создаются
- `removeSavedSearch(id)`, `clearSavedSearches()`
- `isSearchSaved(url)`, `normalizeSearchUrl(url)`

Тип `SavedSearch`: `id`, `title`, `url`, `query`, `vertical`, `createdAt`.

## Какие параметры сохраняются

Все текущие параметры каталога: `q`, `vertical`, `category`, `city`, `brand`,
`priceFrom`/`priceTo`, `withPhoto`, `sort`. Title собирается из читаемых частей:
«Поиск: …», label направления, «Категория: …», город; иначе «Все объявления».

## Почему page убирается

`normalizeSearchUrl` удаляет `page` и сортирует параметры: сохранённый поиск должен
открываться с первой страницы, а одинаковые поиски с разным порядком параметров —
считаться одним и тем же (для дедупликации).

## Ограничение max 20

Хранится не более 20 поисков (новые вытесняют старые с конца). Это защита от
разрастания localStorage; для большего нужен серверный вариант.

## Почему localStorage, а не БД

- нулевая стоимость: без migration, API и авторизации
- мгновенный UX, работает у guest
- потеря при смене устройства/очистке браузера — приемлемо для MVP

## Analytics

События: `saved_search_create`, `saved_search_remove`, `saved_search_open`.
Params: `vertical`, `has_query`, `has_category`. Полный текст запроса не отправляется.

## Что позже

- server-side saved searches (модель + синхронизация между устройствами)
- подписка на новые объявления по сохранённому поиску
- email/telegram notifications
- push notifications
- sharing сохранённого поиска
- аналитика популярных поисков
