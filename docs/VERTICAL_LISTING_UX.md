# Vertical listing UX notes (Phase 6)

Адаптивный UI формы `/listings/new` и фильтров каталога **без Prisma migration**.

## Что сделано без schema changes

- Labels / placeholders / tips по `OPT | MARKET | SERVICES | CARGO`
- Скрытие brand / stock / MOQ где неуместно
- Remap labels для существующих `ListingUnit` (услуга/час/рейс/кг…)
- `?category=` предвыбор на SEO CTA
- Категории фильтруются по vertical (client + API)

## Будущие поля (Phase 7+, нужна migration)

### SERVICES
- `service_area`
- `experience_years`
- `price_type`
- `works_remotely`
- `callout_available`

### CARGO
- `origin_city`
- `destination_city`
- `cargo_type`
- `vehicle_type`
- `weight_limit`
- `volume_limit`
- `delivery_time`

### MARKET
- `condition`
- `delivery_available`
- `negotiable` (или использовать `price_negotiable`)

### Units
Расширить `ListingUnit` отдельными значениями вместо UI-remap:
- SERVICES: HOUR, DAY, SQM, PROJECT, VISIT, SERVICE
- CARGO: TRIP, TON, CUBIC_METER, KM
