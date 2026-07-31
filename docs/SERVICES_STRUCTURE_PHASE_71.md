# Phase 71 — Services profession structure

## 1. How services differ from listings

`/services` is framed as a specialist marketplace:

- Hero copy asks for a service / specialist (not a product)
- Profession tiles sit under the hero
- Catalog filters label category as “Категория услуги”
- Cards use “Цена по договорённости” when price is missing
- Create-listing form uses service-oriented titles and hints when `vertical=SERVICES`

Wholesale, market, and cargo verticals are unchanged.

## 2. Professions added

Canonical list (seed slugs in `prisma/seed-data/categories.ts`):

1. Ремонт и строительство  
2. Электрики  
3. Сантехники  
4. Мебельщики  
5. Грузчики  
6. Клининг  
7. Автоуслуги  
8. Красота и здоровье  
9. Обучение  
10. Бухгалтерия  
11. Юристы  
12. IT и digital  
13. Дизайн  
14. Фото и видео  
15. Мастера на час  
16. Другое  

UI config: `src/features/services/services-professions.ts`  
Visuals: `src/features/services/services-category-visuals.ts`

**Note:** New category rows appear in the live DB after running the existing seed (no migration). Until then, profession tiles show whatever SERVICES categories already exist.

## 3. How `/services` works

1. Compact hero + service search placeholder  
2. Profession grid → `/listings?vertical=SERVICES&category=<id>`  
3. Latest service listings (or services empty state)

## 4. Labels for `vertical=SERVICES`

| Surface | Change |
| --- | --- |
| ListingCard | `services.priceByAgreement`; city + profession meta |
| Filters | `services.serviceCategory` |
| Create form | `services.formCategory`, `services.formDescriptionHint` |
| Empty catalog | `services.emptyTitle` / `emptyDescription` + CTAs |

## 5. Unchanged

- Prisma schema / migrations  
- Auth  
- Uploads  
- Listing model fields  
- Market / Opt / Cargo flows  

## 6. Known gaps

- Later: experience / schedule / on-site visit fields  
- Later: specialist ratings & reviews  
- Later: verified specialists  
- Later: dedicated service profile pages  
