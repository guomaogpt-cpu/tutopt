# Listing Cards, Modals & Profile Cleanup — Phase 135

> **Статус:** UX hotfix перед internal testing.  
> **Scope:** cards, contact modal, cargo modal, seller profile layout.

---

## 1. Цель

Упростить карточки объявлений, сделать модальные окна компактнее и убрать дублирующую статистику на публичном профиле продавца — без redesign всего сайта и без новых функций.

---

## 2. Что было неправильно

| Area | Problem |
|---|---|
| Listing cards | Характеристики (состояние, напряжение, MOQ, chips) в карточке → разная высота |
| Contact modal | Bottom sheet на desktop — почти full screen |
| Cargo modal | На desktop прибит к низу, не по центру |
| Seller profile | Верхний блок статистики дублировал правую карточку |
| Vertical labels | «ТутОпт», «ТутУслуги» в публичном UI |

---

## 3. Новый формат карточки

1. Фото (4:3)
2. Маленький бейдж раздела (Объявления / Услуги / Опт / Карго)
3. Цена (или «Цена договорная» / «Цена по запросу»)
4. Название (max 2 строки)
5. Meta: **Город · Категория · Дата**
6. Автор/продавец снизу (border-top)

Файл: `src/components/listings/ListingCard.tsx`

---

## 4. Что убрали из карточек

- Highlight chips (характеристики)
- MOQ / «Мин. партия»
- Единица измерения в строке цены
- Company verification badge в footer карточки
- Seller block только на desktop — теперь на всех viewport

---

## 5. Где остаются характеристики

- `/listings/[id]` — блок характеристик, описание, продавец, связаться, жалоба **без изменений**

---

## 6. Contact seller modal

- Mobile: bottom sheet, max ~85vh, scroll внутри
- Desktop (md+): centered dialog, max-width ~560px
- Компактная форма: имя, телефон, сообщение, submit
- Textarea 3 строки в drawer mode

Файлы:
- `src/components/listings/ListingLeadContactDrawer.tsx`
- `src/components/ui/responsive-modal-classes.ts`

---

## 7. Cargo modal

- Mobile: bottom sheet
- Desktop: centered, max-width ~640px, max-height 85vh
- Исправлено позиционирование (не прибит к низу на desktop)

Файл: `src/components/cargo/CargoRequestModal.tsx`

---

## 8. Seller/company profile cleanup

- Удалён `SellerProfileStats` с `/seller/[id]`
- Остаётся: слева объявления, справа sticky profile card
- Mobile: profile card сверху, затем объявления
- Публичные labels направлений: Опт / Услуги / Объявления / Карго

---

## 9. Desktop/mobile checks

| Viewport | Check |
|---|---|
| 1440px | Cards equal height, modals centered |
| 390×844 | Clean cards, compact modals |
| 430×932 | Seller footer visible on cards |

Routes: `/`, `/market`, `/services`, `/opt`, `/listings`, `/listings/[id]`, `/favorites`, `/seller/[id]`, `/companies/[id]`, `/cargo`, `/account/listings`

---

## 10. Known limitations

- Account dashboard uses separate `SellerDashboardListingCard` (seller tools, not public catalog)
- Company page layout unchanged (no duplicate stats block)
- Detail page contact form on desktop remains inline (not modal)
- Superseded by Phase 138: compact dense marketplace cards

---

## Связанные документы

- `docs/LISTING_CARDS_DETAIL_PHASE_124.md`
- `docs/SELLER_COMPANY_STOREFRONT_PHASE_127.md`
- `docs/MOBILE_QA_FREEZE_PHASE_130.md`
- `docs/GOOGLE_PLAY_RELEASE_BLOCKERS_PHASE_113.md`
- `docs/HOME_HEADER_CLEANUP_PHASE_136.md`
- `docs/STICKY_TWO_LEVEL_HEADER_PHASE_137.md`
- `docs/COMPACT_MARKETPLACE_CARDS_PHASE_138.md`
