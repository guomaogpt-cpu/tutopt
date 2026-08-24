# Seller / Company Storefront — Phase 127

## 1. Цель

Сделать публичные профили продавца и компании понятной витриной объявлений: покупатель открывает объявление → видит продавца → переходит в профиль → видит активные объявления и сигналы доверия.

Без магазина, оплаты, подписок, рейтингов, чата и сложной верификации.

## 2. Публичный профиль компании

Маршрут: `/companies/[id|slug]`

**Верх:**
- Название, тип, verified badge (только `VERIFIED`)
- Город, дата на платформе, количество активных объявлений
- Действия: «Посмотреть объявления», «Связаться» (через первое объявление), «Пожаловаться на профиль»

**Блоки:**
- «О компании» с empty state: «Компания пока не добавила описание.»
- Активные объявления (`PUBLISHED`, не истёкшие, `posted_as_company=true`)
- Vertical chips: Все / Объявления / Услуги / Опт / Карго
- Компактные карточки (`variant="home"`)

**Не показывается:**
- Статус «Не проверена» публично
- Admin notes, email/телефон без auth-логики
- Draft / pending / rejected listings

## 3. Публичный профиль личного продавца

Маршрут: `/seller/[id|slug]`

- Имя пользователя или «Пользователь ВсеTut»
- **Layout:** слева объявления, справа sticky profile card (desktop); mobile — карточка сверху
- **Phase 135:** верхний блок статистики (`SellerProfileStats`) удалён — без дублирования правой карточки
- Vertical filters и список объявлений

## 4. Объявления продавца

- Только `PUBLISHED` + not expired
- Company page: только `posted_as_company=true`
- Seller page: все опубликованные объявления профиля
- Empty: «У этой компании пока нет активных объявлений.»

## 5. Блок продавца на объявлении

`ListingSellerCard` на `/listings/[id]`:

- Компания или автор, город, количество объявлений, «На сайте с»
- Verified badge только при `verification_status === VERIFIED` и публикации от компании
- Подпись «Проверенная компания» для verified company
- CTA «Профиль продавца» / «Открыть компанию»
- «Связаться» остаётся главным CTA в contact card

## 6. Account company preview

`/account/company`:

- Preview «Как вас видят покупатели»
- Чеклист заполненности полей
- Статус проверки (owner-only pending/rejected)
- CTA «Посмотреть публичный профиль»
- Подсказка: «Заполненный профиль повышает доверие покупателей.»

## 7. Verified badge

Единый компонент `CompanyVerificationBadge`:

- Публично: только `VERIFIED` → «Проверенная компания» / «Проверенная карго-компания»
- Owner/admin: pending / rejected / unverified
- ListingCard, listing detail, company profile, account company, admin

## 8. Admin company links

`/admin/companies`:

- Ссылка на публичный профиль
- Количество активных объявлений компании
- Verified/unverified labels через badge

## 9. Privacy / safety

**Public:** name, city, description, type, logo, website, verified badge, active listings count

**Private:** phone, email, whatsapp, telegram (guest), admin notes, internal ids

**Filtering:** только approved/published active listings на витрине

## 10. Android / WebView considerations

- Профиль открывается из listing detail по ссылке
- Back возвращает на объявление (browser history)
- Компактные карточки на mobile, без horizontal scroll на chips
- Verified badge compact, не ломает layout
- `scroll-mt-24` для anchor «Посмотреть объявления»

## 11. Future

- Рейтинги и отзывы
- Подписка на продавца
- Расширенная жалоба на компанию (admin workflow)
- Баннер витрины компании
- Платное продвижение компании

## Phase 129 — Marketplace analytics MVP

- Admin «Компании на проверке» card links to `/admin/companies`
- Storefront metrics remain separate from analytics phase

См. `docs/MARKETPLACE_ANALYTICS_PHASE_129.md`

## Файлы

| File | Change |
|---|---|
| `src/app/companies/[id]/page.tsx` | Storefront layout, about, actions |
| `src/app/seller/[id]/page.tsx` | Display name for personal sellers |
| `src/components/listings/ListingSellerCard.tsx` | Verified company block |
| `src/components/seller/SellerProfileSidebar.tsx` | Public display name + badge |
| `src/components/company/CompanyStorefrontPreview.tsx` | Account preview |
| `src/components/company/CompanyPublicProfileActions.tsx` | View listings / report |
| `src/features/sellers/lib/public-seller-display.ts` | Shared display helpers |
| `src/app/account/company/page.tsx` | Preview section |
| `src/app/admin/companies/page.tsx` | Listing counts + slug |
| `src/components/admin/AdminCompaniesTable.tsx` | Public link + counts |

## Migration

Нет — Prisma schema не менялась.
