# Управление объявлениями продавца (/seller/listings)

## Назначение

`/seller/listings` — отдельная страница управления всеми объявлениями
продавца. Dashboard (`/seller/dashboard`) остаётся обзорным кабинетом с
компактным превью последних 5 объявлений; полное управление (фильтры, поиск,
архив, продление) вынесено сюда.

Доступ: только авторизованный продавец (гость → login, BUYER → seller
upgrade, SELLER без onboarding → onboarding). Guards те же, что у dashboard.

## Фильтры

Работают server-side через URL searchParams
(`src/features/sellers/lib/seller-listings.ts`):

- `status`: `all` | `active` | `pending` | `rejected` | `archived` | `expired`;
- `vertical`: `OPT` | `MARKET` | `SERVICES` | `CARGO` (или все);
- `q`: поиск по title (contains, case-insensitive);
- `page`: страница пагинации.

Пример: `/seller/listings?status=active&vertical=OPT&q=цемент`.

Маппинг статусов на реальные поля схемы:

- `active` — `status = PUBLISHED` и не истёк срок (`expires_at IS NULL OR > now`);
- `pending` — `PENDING_MODERATION`;
- `rejected` — `REJECTED`;
- `archived` — `status = ARCHIVED` (в схеме нет `archived_at`, архив хранится
  в `ListingStatus`);
- `expired` — `expires_at < now`;
- `all` — все объявления продавца, включая архив и черновики.

Фильтра и статуса `deleted` **нет**: в схеме нет soft-delete поля
(`deleted_at` / статуса `DELETED`), а менять схему в этой фазе запрещено.
Скрытие с сайта выполняется архивированием.

Запрос всегда ограничен `seller_profile_id` текущего продавца — чужие
объявления недоступны.

## Что показывается в списке

Фото/placeholder, title, vertical badge, категория, цена (или «Цена не
указана»), город, статус модерации (badge), бейджи «Скоро истечёт» /
«Истекло», дата публикации/создания, «Публикация до …», quality badge,
просмотры.

## Действия продавца

- **Открыть** → `/listings/[id]`;
- **Редактировать** → `/listings/[id]/edit` (flow Phase 31);
- **Продлить** (confirmation) → `POST /api/listings/[id]/renew` (Phase 33);
  доступно для опубликованных;
- **Архивировать** (confirmation) → `POST /api/listings/[id]/lifecycle`
  `{ action: "archive" }`; доступно для PUBLISHED / PENDING_MODERATION /
  REJECTED;
- **Восстановить** (confirmation) → `POST /api/listings/[id]/lifecycle`
  `{ action: "restore" }`; доступно для ARCHIVED, объявление уходит на
  модерацию, при approve заполняется свежий `expires_at`.

Кнопки показываются только когда действие доступно. Physical delete не
выполняется: изображения, leads, reports и audit logs не удаляются.
Если аккаунт ограничен/заблокирован, вверху страницы предупреждение
«Аккаунт ограничен. Некоторые действия недоступны», а сами API-actions
дополнительно проверяют блокировку.

## Связь с dashboard

- В dashboard блок «Мои объявления» стал компактным: последние 5 объявлений
  + кнопки «Все мои объявления» и «Показать все N объявлений» →
  `/seller/listings`.
- В «Быстрые действия» добавлена карточка «Мои объявления».

## Pagination

Простая server-side пагинация через `?page=`: 20 объявлений на страницу
(`SELLER_LISTINGS_PER_PAGE`), кнопки «Назад»/«Вперёд» и счётчик страниц.

## Почему удаление мягкое

В текущей схеме нет физического удаления объявлений: история заявок,
жалоб и модерации должна сохраняться. Продавец скрывает объявление через
архив; отдельный soft delete (`deleted_at`) — кандидат на будущую фазу
с migration.

## Audit / Analytics

Audit: новые actions логируют `listing.archive` и `listing.restore`
(metadata: `vertical`, `status_before`, `status_after`); renew/update уже
логировались в Phase 31/33.

Analytics:

- `seller_listings_filter_change` — `status_filter`, `vertical`;
- `seller_listing_action_click` — `action` (open/edit/renew/archive/restore),
  `vertical`, `status_filter`.

Title, description и данные продавца не отправляются.

## Later

- bulk actions;
- массовое продление;
- экспорт объявлений;
- сортировка по просмотрам/заявкам;
- draft listings (создание черновиков);
- paid promotion;
- полноценный soft delete с `deleted_at`.
