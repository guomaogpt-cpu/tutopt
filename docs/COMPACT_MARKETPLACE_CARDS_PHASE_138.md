# Phase 138 — Compact Marketplace Cards

## 1. Цель

Сделать публичные карточки объявлений компактными в стиле маркетплейса (Wildberries-like density): меньше высота, меньше отступы, плотная сетка, больше товаров на экране.

## 2. Что было неправильно

| Проблема | Причина |
|----------|---------|
| Карточки слишком вытянутые | `min-h-[8.75rem]`, `mt-auto`, divider |
| Много пустого воздуха | Большие gap/padding, 4:3 + длинный content |
| Мало карточек на экране | Широкие gap, ≤5 колонок на 1920px |
| Meta в 2–3 строки | `line-clamp-2`, MapPin icon, длинные категории |

## 3. Новый compact card format

```
┌─────────────┐
│   photo 1:1 │
│ badge ♥     │
├─────────────┤
│ 170 000 сом │
│ Title (2ln) │
│ City·Cat·Dt │
│ Seller      │
└─────────────┘
```

- Padding: 10–12px mobile, 12px desktop
- Gaps: 4–6px между блоками
- No divider, no mt-auto spacer
- aspect-square photo

## 4. Что убрано

- `min-h` на content block
- `mt-auto` spacer
- Border-top divider перед продавцом
- MapPin icon в meta
- Desktop glow shadow effect
- Hover translate-y
- Длинные category names (truncate to 16 chars)

Характеристики по-прежнему не показываются (Phase 135).

## 5. Grid density

**Файл:** `src/components/listings/listing-card-grid.ts`

| Breakpoint | Columns |
|------------|---------|
| mobile | 2 (1 on <340px) |
| md | 3 |
| lg | 4 |
| xl | 5 |
| 2xl | 6 |

Gap: 8px mobile → 10–12px desktop.

Home grid: +1 column on md+.

Profile grid (seller/company): max 3–4 columns.

## 6. Mobile behavior

- 2 columns on listings/home/favorites (≥340px)
- Compact text sizes (10–13px)
- Meta line-clamp-1
- Square photos maximize visual density

## 7. Desktop behavior

- Up to 6 cards per row on 1920px
- Tighter gaps vs Phase 135
- Cards equal structure without forced min-height

## 8. Detail page boundary

`/listings/[id]` — без изменений: характеристики, описание, полное название, CTA.

## 9. Known limitations

- `/account/listings` uses `SellerListingManageCard` — не затронут
- Services cards in 2-col mobile may feel tight for long titles — mitigated by truncate
- Category truncation is card-only; full name on detail page
- **Phase 140:** card border/shadow/text contrast improved
- **Phase 142:** seller removed from cards; one-line titles; wider container

## Связанные документы

- `docs/LISTING_CARDS_MODALS_PROFILE_CLEANUP_PHASE_135.md`
- `docs/STICKY_TWO_LEVEL_HEADER_PHASE_137.md`
- `docs/MOBILE_QA_FREEZE_PHASE_130.md`
- `docs/GOOGLE_PLAY_RELEASE_BLOCKERS_PHASE_113.md`
- `docs/HEADER_CATEGORY_CONTRAST_PHASE_140.md`
- `docs/HEADER_CARD_DENSITY_CLEANUP_PHASE_142.md`
