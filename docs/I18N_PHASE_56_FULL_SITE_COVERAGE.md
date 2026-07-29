# Interface i18n — Phase 56: expanded full-site UI coverage

Builds on Phase 53 (dictionary system) and Phase 54 (locale detection/persistence).
No changes to Prisma, routes, auth/uploads logic, `ThemeProvider`, or middleware locale
routing. No DB user content (listing titles/descriptions, seller names, category/city
names) was translated — only static interface copy.

## 1. Dictionary additions

New typed key groups appended to `src/lib/i18n/dictionaries.ts` (existing keys kept
unchanged, `DictionaryKey`/`Dictionary` types still derive from `DICTIONARY as const`):

- `footer.*` — footer columns, brand tagline, copyright
- `cta.*` — homepage seller CTA card
- `howItWorks.*` — homepage "how it works" steps
- `catalog.*` — catalog toolbar, search, sort, filters panel, empty state
- `listing.*` — listing detail characteristics/description/contact/seller card labels
- `form.*` — lead form static labels
- `quickActions.*`, `buyer.*`, `seller.*` — buyer/seller dashboard quick action cards
- `admin.*` — admin nav labels
- `auth.*` (extended) — login/register form titles, labels, buttons, messages
- `roles.*` — role selector (buyer/seller) titles and descriptions
- `favorites.*` — favorites page empty state and summary
- `notifications.*` — notifications list filters, empty state, summary, items
- `status.*` — listing status labels (draft/pending/published/rejected/archived)

All new keys follow the existing `{ ru, kg, en }` shape. Kyrgyz strings are simple,
direct UI translations (not reviewed by a native speaker — see Known gaps). English
strings use general marketplace terminology.

## 2. Listing status translation

`src/features/listings/lib/listing-status.ts`:

- `listingStatusLabels` (RU map) and `listingStatusBadgeClass` — **kept unchanged** for
  server-rendered contexts that don't have a client locale (e.g. `src/app/listings/[id]/page.tsx`
  admin/owner status badges rendered server-side).
- Added `listingStatusLabelKeys: Record<ListingStatus, DictionaryKey>` mapping each
  status to a `status.*` dictionary key.
- Added `getListingStatusLabel(locale, status)` — calls `translate()` from
  `dictionaries.ts`. Used by `ListingContactCard` (client component) for the
  locale-aware status badge.

## 3. Components converted / wired to `useTranslation`

| Component | Notes |
|---|---|
| `src/components/layout/Footer.tsx` | Converted to `"use client"`; all columns, links, brand copy, copyright translated |
| `src/components/home/SellerCtaSection.tsx` | Converted to `"use client"` |
| `src/components/home/HowItWorksSection.tsx` | Converted to `"use client"` |
| `src/components/listings/ListingCharacteristics.tsx` | Converted to `"use client"`; "Характеристики" title |
| `src/components/listings/ListingDescription.tsx` | Title, "показать полностью/свернуть", empty-description message |
| `src/components/listings/ListingContactCard.tsx` | "Город", "Бренд", "за", login-to-see-contacts CTA, no-contacts message, status badge via `getListingStatusLabel` |
| `src/components/listings/ListingSellerCard.tsx` | "Проверен", "Объявлений", "Город", "На платформе с", "Профиль продавца", report trigger label |
| `src/components/listings/ListingLeadForm.tsx` | Static labels: Телефон/Email, "Отправка...", "Отправить ещё", login/owner/hint copy |
| `src/components/listings/ListingsEmptyState.tsx` | Converted to `"use client"`; "Ничего не найдено" / reset / add-listing CTA |
| `src/components/listings/ListingsCatalogToolbar.tsx` | Search placeholder/aria, "Найдено", pluralized listing word (locale-aware), sort/filter labels, reset chips |
| `src/components/listings/CatalogFiltersPanel.tsx` | Category/city/brand/price/photos labels, apply/reset, drawer & panel titles |
| `src/components/admin/AdminNav.tsx` | Nav aria-label + all 5 nav item labels |
| `src/components/buyer/BuyerQuickActions.tsx` | Converted to `"use client"`; all 4 quick-action cards |
| `src/components/seller/SellerQuickActions.tsx` | Converted to `"use client"`; quick-action cards + per-vertical create links |
| `src/components/auth/LoginForm.tsx` | Title, description, field labels, remember-me, forgot-password, submit states, success/error messages, footer link |
| `src/components/auth/RegisterForm.tsx` | Title, description, name label/placeholder (role-aware), password label, submit states, success/error messages, footer link, phone-verification-required message |
| `src/components/auth/RoleSelector.tsx` | Legend + buyer/seller titles & descriptions |
| `src/components/favorites/FavoritesPageContent.tsx` | Empty state, "Всего в избранном", "Последнее добавление", catalog CTAs |
| `src/components/notifications/NotificationsList.tsx` | Filter tabs, summary card labels, empty state + per-role CTA, mark-all-read, "Новое" badge, "От:", "Открыть →", empty-category message |

## 4. Reused existing keys

To avoid duplicate strings, several new usages reuse existing Phase 53 keys:
`auth.favorites`, `auth.signIn`, `vertical.postListing`, `search.find`, `common.close`.

## 5. Partial RU gaps (component renders both translated and RU-sourced text)

These components are now wired to `useTranslation`, but still render some text that is
generated by **server-side utility functions** returning RU-only strings. Converting
those utilities was out of scope for this phase (they are consumed from many
call sites, including server components, and touching them risks a much larger
surface area):

- `ListingContactCard` / listing detail page: `priceCaption`, `moqLabel`, `stockLabel`
  props are populated server-side from `getListingPriceFieldLabel` /
  `getListingDisplayFlags` (`src/features/listings/lib/listing-display.ts`) — still RU.
- `ListingSellerCard`: `roleLabel` (`getSellerProfileLabel`) and `ctaLabel`
  (`getListingSellerCardCtaLabel`) from `src/features/sellers/lib/seller-vertical-profile.ts` — still RU.
- `ListingLeadForm`: most of `getLeadFormConfig()` output (title, subtitle, message
  label/placeholder, submit label, success/login copy, templates) from
  `src/features/leads/lib/lead-form-config.ts` — still RU (per-vertical generated copy).
- `ListingsEmptyState`: vertical-specific `emptyTitle`/`emptyDescription` from
  `getCatalogVerticalCopy()` (`listing-display.ts`) — still RU; only the
  "no results for active filters" copy and CTA buttons are translated.
- `ListingsCatalogToolbar`: `listingSortOptions` labels (e.g. "Сначала новые" is only
  the fallback) and vertical tab labels (`VERTICAL_LIST[].label`) are still RU.
- `FavoritesPageContent`: `formatLastAddedDate` uses `toLocaleDateString("ru-RU", …)` —
  date formatting not locale-aware.
- `NotificationsList`: `formatNotificationDateTime` uses `toLocaleString("ru-RU", …)` —
  same date-formatting gap. `notification.title` / `notification.message` are
  server-generated per-event strings — still RU (not covered here; would require
  templating each notification type, out of scope).

## 6. Not translated (unchanged from Phase 53)

- Listing `title` / `description` from the database (explicitly excluded — DB user content)
- Seller company names, category/city names from the database
- SEO metadata / sitemap by language
- Prisma schema, migrations, routes, middleware, auth/upload flows — unchanged
- `ThemeProvider` — unchanged

## 7. Known gaps

- **KG copy needs native review** — Phase 56 additions are simple, direct Kyrgyz
  translations by a non-native process; recommend a native-speaker pass before wide release.
- No `/ru` `/kg` `/en` routes or SEO-indexed locale variants (unchanged from Phase 53/54).
- Server-generated per-vertical/per-notification strings listed in §5 remain RU; a
  future phase should either move that copy into the dictionary keyed by vertical, or
  pass `locale` down to those server utilities.
- Date/time formatting (`toLocaleDateString`/`toLocaleString`) is hardcoded to `ru-RU`
  in `FavoritesPageContent` and `NotificationsList`.
- No browser/smoke testing was run for this phase per instructions — verified via
  `tsc --noEmit`, `eslint`, and `next build` only.

## 8. Verification performed

- `npx tsc --noEmit` — passes (dictionary `as const` + `DictionaryKey` still typecheck)
- `npx eslint` on all changed files — no errors/warnings
- `npx next build` — production build succeeds, all routes compile
