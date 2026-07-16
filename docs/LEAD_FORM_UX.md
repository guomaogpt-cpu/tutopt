# Lead form UX by vertical (Phase 8)

Адаптация заявок **без Prisma migration**: тексты, шаблоны, notifications и UI seller/buyer leads.

Config: `src/features/leads/lib/lead-form-config.ts`

## Будущие поля (Phase 9+, нужна migration)

### OPT
- `quantity` (уже есть)
- `target_price`
- `delivery_city`
- `purchase_deadline`

### MARKET
- `offer_price`
- `preferred_contact_method`

### SERVICES
- `task_location`
- `preferred_date`
- `budget`
- `service_scope`

### CARGO
- `origin_city`
- `destination_city`
- `cargo_weight`
- `cargo_volume`
- `cargo_type`
- `delivery_deadline`
