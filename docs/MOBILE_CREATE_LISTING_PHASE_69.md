# Phase 69 — Mobile create listing UX

## 1. What changed on `/listings/new` (mobile)

The create-listing page is denser and clearer on phones:

- Compact page header (breadcrumbs hidden on mobile)
- Progress strip: Basics → Photos → Price → Description
- Logical card sections in one column
- Larger photo upload / preview grid
- Review summary before publish
- Sticky “Publish” bar above the bottom nav
- Success state after create (open listing / my listings)
- `beforeunload` warning when the form is dirty (no DB drafts)

## 2. Form blocks

1. **Basics** — title, vertical, category (+ brand when relevant)
2. **Photos** — upload, previews, remove, main-photo badge
3. **Price** — price, currency, unit, MOQ/stock when configured
4. **Location** — city
5. **Description** — textarea
6. **Publish** — compact summary + submit

Desktop keeps the two-column layout with `NewListingSidebar`.

## 3. Upload on mobile

- Full-width upload CTA
- Gallery picker via `input[type=file]` (`accept` image types, `multiple`)
- 2-column square preview grid on small screens
- Easy remove control; first image marked as main
- Limit shown as `n / 10`
- Storage/upload API unchanged

## 4. Submit

- Client validation with field-adjacent / alert messages (i18n)
- Same `createListingRequest` / moderation flow
- Create mode shows in-page success instead of immediate hard redirect
- Edit mode still redirects to the listing detail

Guest → login with `next=/listings/new`  
Buyer → seller upgrade  
Seller needing onboarding → onboarding  
(unchanged guards)

## 5. What did not change

- Prisma schema / migrations
- Upload storage architecture
- Auth architecture
- Moderation logic / listing statuses
- Seller onboarding flow internals
- Desktop sidebar + submit behavior (non-sticky)

## 6. Known gaps

- Later: real drafts in DB
- Later: client image compression
- Later: camera-capture optimization
- Later: dedicated seller app flow
