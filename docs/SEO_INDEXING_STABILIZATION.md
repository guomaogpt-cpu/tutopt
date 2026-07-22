# SEO / Indexing Stabilization — Phase 47

Дата: 2026-07-22  
UI freeze: только metadata / sitemap / robots. Без редизайна и без schema migration.

## 1. Public indexable pages

| Path | Metadata |
|------|----------|
| `/` | `ВсеТут — объявления, услуги, опт и карго` |
| `/listings` | `Объявления — ВсеТут` (+ vertical/search variants) |
| `/opt` `/market` `/services` `/cargo` | vertical `metaTitle` / `metaDescription` |
| `/categories` | `Категории — ВсеТут` |
| `/listings/[id]` | title + description + OG image (public only) |
| `/seller/[id]` | seller name / fallback `Продавец — ВсеТут` |
| SEO landings `/{vertical}/[category]/[city]` | existing helpers, brand ВсеТут |

## 2. noindex pages

`robots: { index: false, follow: false }` via `buildPrivatePageMetadata` / explicit:

- `/login`, `/register`, `/forgot-password`, `/auth/reset-password`
- `/seller/onboarding`, `/seller/upgrade`
- `/seller/dashboard`, `/seller/listings`, `/seller/leads`
- `/buyer/dashboard`
- `/favorites`, `/notifications`
- `/listings/new`, `/listings/[id]/edit`
- `/admin/*` (layout)
- `/compare` — route отсутствует; disallow в robots на будущее
- listing/seller not-found / DB-error metadata fallbacks

## 3. Sitemap policy

Файл: `src/app/sitemap.ts`

- `dynamic = "force-dynamic"` — не prerender на Railway build
- Static always: `/`, `/opt`, `/market`, `/services`, `/cargo`, `/listings`, `/categories`
- Dynamic (try/catch): published+not-expired listings (cap 5000), active categories, category×city combos, `/sellers`
- On DB failure → static only, no throw
- Not included: auth/admin/dashboard/favorites/notifications/edit/new, pending/rejected/archived/expired listings, seller profile URLs (gap)

## 4. Robots policy

Файл: `src/app/robots.ts`

- Allow `/`
- Disallow private/auth/admin/API paths (incl. `/seller/listings`, `/compare`)
- `sitemap` = absolute via `NEXT_PUBLIC_APP_URL` fallback
- No DB dependency

## 5. metadataBase / NEXT_PUBLIC_APP_URL

- `getSiteBaseUrl()` → `NEXT_PUBLIC_APP_URL` or `http://localhost:3000`
- Root `metadataBase: new URL(getSiteBaseUrl())`
- Canonical / OG / sitemap / robots use `getAbsoluteUrl()`
- Title template: `%s | ВсеТут`; public pages often use `title.absolute` via `buildPageMetadata`

## 6. Listing metadata

- Uses `canViewListing(..., null)` — non-public → noindex fallback
- try/catch around DB; error → noindex fallback
- OG image from first listing image when present
- Brand strings: ВсеТут

## 7. Seller metadata

- Missing profile / DB error → noindex + `Продавец — ВсеТут`
- Title uses company name with empty fallback «Продавец»
- MARKET SEO no longer «ТутМаркет»; OPT/SERVICES/CARGO keep vertical product names in titles where appropriate

## 8. OpenGraph / Twitter

- `buildPageMetadata` sets OG + Twitter (`summary` / `summary_large_image` if images)
- Root layout: siteName ВсеТут, default twitter summary
- No new image assets

## 9. Known SEO gaps

1. No site-wide WebSite/SearchAction JSON-LD (listing Product/Service JSON-LD already exists)
2. Seller public profiles not in sitemap
3. `/compare` not built
4. Query variants on `/listings` share canonical `/listings` (or vertical base) — intentional
5. Visible page copy may still say «Tutopt» in some legal/help UI (not changed — UI freeze)
6. Category landing **body** text still mentions Tutopt (page content, not metadata)

## 10. After deploy checklist

- [ ] `https://<host>/sitemap.xml` loads; static URLs present if DB ok/or degraded
- [ ] `https://<host>/robots.txt` Disallow + sitemap URL
- [ ] Home /listings /opt titles in HTML `<title>`
- [ ] Canonical on home/listings/listing detail
- [ ] View-source `/login` / `/admin` → noindex
- [ ] Non-public listing → noindex (or 404)

## Phase 47 policy

No Prisma schema/migration. No auth/uploads/UI redesign.
