# Стиль карточек объявлений (marketplace / Lalafo 2.0)

## Новый стиль

Buyer-facing карточки используют единый визуальный язык:

- мягкая белая карточка, `rounded-2xl` (~16px);
- лёгкая тень и border, без тяжёлых рамок;
- hover: лёгкий подъём (`-translate-y-0.5`) и усиление тени;
- фото сверху, `aspect-ratio 4:3`, `object-cover`;
- **цена крупнее и жирнее title**;
- title — максимум 2 строки;
- city + date — secondary;
- vertical badge на фото (слева сверху);
- favorite — круглая кнопка на фото (справа сверху).

Компонент: `src/components/listings/ListingCard.tsx`.

Варианты плотности:

- `catalog` / `default` / `showcase` — стандартная marketplace-карточка
  (с именем продавца);
- `home` — чуть компактнее для preview-секций и рекомендаций.

## Где используются

| Место | Компонент / variant |
|-------|---------------------|
| `/listings` | `ListingCard` `catalog` |
| Homepage preview | `ListingCard` `home` |
| Vertical landings | `ListingCard` `catalog` |
| `/favorites` | `ListingCard` `catalog` |
| Buyer dashboard favorites | `ListingCard` `catalog` |
| Similar listings | `ListingCard` `home` |
| Seller other listings | `ListingCard` `home` |
| Seller storefront | `ListingCard` `catalog` |
| Buyer recently viewed | локальный list-row (тот же visual language: цена → title) |
| `/seller/dashboard` | `SellerDashboardListingCard` (workspace row) |
| `/seller/listings` | `SellerListingManageCard` (workspace row + actions) |

## Цена

`formatListingCardPrice` (`listing-display.ts`):

- есть цена → «12 000 сом» (и `/ ед.` для OPT/MARKET);
- SERVICES/CARGO без цены → «Цена договорная», с ценой → «от …»;
- иначе → «Цена не указана».

Никогда не показывается `null` / `undefined`.

## Фото / placeholder

- есть `imageUrl` → Next/Image, `object-cover`;
- нет фото → tinted фон по vertical + иконка `Package` (без текста «Нет фото»).

Upload/storage/`/api/uploads` не менялись.

## Vertical badges

`VerticalListingBadge` + `getListingVerticalBadgeLabel`:

- ТутОпт — blue;
- ТутМаркет — indigo;
- ТутУслуги — teal;
- ТутКарго — rose.

Без `vertical-theme`. Цвета локально в компоненте badge.

## Buyer vs seller cards

**Buyer-facing** (`ListingCard`) — marketplace grid: фото → цена → title → city/date.

**Seller-management** — горизонтальные workspace-карточки: фото-thumb,
status/lifecycle badges, quality, actions (edit/archive/restore/renew).
Визуально освежены (rounded-2xl, soft shadow, tinted placeholder), но не
превращаются в покупательские grid-карточки, чтобы не ломать actions.

## Serialization

Карточки получают уже сериализованные данные через
`serializeListingCard` / `serializeListingCards` (price string, dates ISO).
Prisma Decimal/Date в Client Components не передаются.

## Analytics

Новых card-click events не добавляли: existing
`similar_listing_click`, `seller_other_listing_click`, `seller_listing_click`
сохранены. Дублировать `listing_card_click` не стали.

## Later

- skeleton loading;
- sponsored / promoted badges;
- image carousel in card;
- card A/B test;
- responsive density settings.
