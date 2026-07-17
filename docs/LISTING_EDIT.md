# Редактирование объявлений

## Доступ

Страница редактирования находится по адресу `/listings/[id]/edit`.

- Гость перенаправляется на вход с возвратом на edit route.
- Редактировать объявление может только пользователь с ролью `SELLER`.
- `sellerProfile.user_id` объявления должен совпадать с id текущего пользователя.
- Чужое или несуществующее объявление возвращает `notFound`; форма и исходные данные
  не раскрываются.
- `BUYER`, `ADMIN` и `MODERATOR` не получают доступ в этой фазе.
- Seller onboarding должен быть завершён.

Проверки выполняются и на серверной странице, и повторно в PATCH API. Клиентская
форма не является источником прав доступа.

## Редактируемые поля

Форма переиспользует `NewListingForm` и ту же Zod-схему, что создание объявления:

- title;
- description;
- vertical;
- category;
- price и currency;
- MOQ и unit;
- city;
- brand;
- stock quantity;
- images.

На клиент передаются только сериализованные значения: Prisma `Decimal` цены
преобразуется в string, даты в форму не передаются, nullable-поля преобразуются
в пустые строки или `null`.

Нельзя изменить через PATCH API: id, `seller_profile_id`, owner, short id,
просмотры, admin/moderation fields или другие внутренние поля.

## Валидация и ограничения

PATCH `/api/listings/[id]` использует общую `updateListingSchema`
(`createListingSchema`) и повторяет критические серверные проверки создания:

- title/description trim и ограничения длины;
- content moderation checks;
- category должна быть активной и соответствовать vertical;
- city и optional brand должны существовать и быть активными;
- от 1 до 10 изображений;
- значения price, MOQ, unit и stock валидируются Zod.

Учитываются `blocked_at` / `is_blocked` и `listing_restricted_at` через
`getEditListingRestrictionMessage`. При ограничении страница показывает
понятный empty state, а API возвращает `Forbidden`.

## Статус после редактирования

API вычисляет список изменённых seller-controlled полей. Если изменилось хотя бы
одно поле и исходный статус был `PUBLISHED` или `REJECTED`, объявление переводится
в `PENDING_MODERATION`. При этом очищаются `published_at` и предыдущая
`rejection_reason`.

Объявление, уже находящееся в `PENDING_MODERATION`, остаётся на модерации.
`DRAFT` и `ARCHIVED` не публикуются и не меняют статус автоматически.
Если данные фактически не изменились, текущий статус сохраняется.

В форме показывается предупреждение:
«После редактирования объявление может быть отправлено на повторную модерацию.»

## Фото

Используется существующий `ListingImageUpload` и существующий upload route:

- текущие изображения подставляются в форму в сохранённом порядке;
- пользователь может удалить изображение из списка и добавить новое;
- максимум — 10 изображений;
- порядок массива сохраняется в `sort_order`;
- при сохранении изменённого списка старые записи `ListingImage` заменяются
  транзакционно;
- физические файлы не удаляются.

`UPLOAD_DIR`, upload API и Railway volume logic не изменялись.

## Listing quality

Общая форма продолжает строить `ListingQualityInput` и показывает существующий
`NewListingSidebar` с quality preview и подсказками, поэтому edit flow получает
те же рекомендации качества, что и создание объявления.

## Ссылки «Редактировать»

- На карточках «Мои объявления» в seller dashboard.
- В верхней части listing detail только когда текущий пользователь — владелец.

Публичные карточки и seller storefront не получают edit-ссылок.

## Audit log

После успешного изменения создаётся событие `listing.update`:

- `status_before`;
- `status_after`;
- `changed_fields` — только имена полей;
- `vertical`.

В audit metadata не сохраняются title, description, контакты или приватные
данные продавца. Ошибка записи audit log не отменяет основное обновление.

## Analytics

- `listing_edit_start`: `vertical`, `status_before`;
- `listing_edit_submit`: `vertical`, `status_before`, `status_after`.

Title, description, seller data, phone и email не отправляются.

## Later

- история изменений;
- восстановление старой версии;
- безопасное удаление неиспользуемых физических файлов;
- admin edit;
- bulk edit;
- draft autosave.
