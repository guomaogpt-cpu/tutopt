# Cargo company listings hotfix

## 1. CargoRequest vs cargo company listing

| Concept | What it is |
| --- | --- |
| **CargoRequest** | Client shipping request on `/cargo` (form → board → responses) |
| **vertical=cargo listing** | Public card of a cargo company / cargo service |

They are separate flows and must not be mixed in the UI.

## 2. How a user adds a cargo company

1. Open `/cargo`
2. Use **Добавить карго-компанию** (hero, CTA block after “How it works”, or empty companies state)
3. Goes to `/listings/new?vertical=cargo`
4. Optionally fill **Профиль компании** at `/account/company` (type: Карго-компания)
5. Form preselects Карго; user can post as personal account or company
6. Submit → moderation (unchanged) → success + link to **Мои объявления**

## 3. Where the company appears

After publish/moderation approval, the listing shows in:

- `/cargo` companies section
- `/listings?vertical=CARGO`
- seller dashboard / my listings
- `/companies/[id]` when company profile (`company_type`) is configured

## 4. Categories

Seed list updated in `prisma/seed-data/categories.ts` (China / Kyrgyzstan / international / road / air / rail / warehousing / customs / other).

**Gap:** live DB still has previous cargo category rows until seed is re-run. This hotfix did **not** run seed. Category i18n keys exist under `cargo.categories.*` for future UI mapping.

## 5. Unchanged

- CargoRequest / CargoResponse
- Auth
- Moderation logic
- Market / services / wholesale listing flows

## Related

- Phase 79 company profile: `docs/COMPANY_PROFILE_PHASE_79.md`
- Gap: cargo subscriptions remain per user/seller profile (not per company yet)
