# Phase 68 — Mobile home first screen

## 1. What changed on the mobile first screen

The homepage first viewport is denser and more marketplace-like:

1. Compact header (existing site chrome)
2. Short mobile title + subtitle
3. Full-width search with camera (photo search unchanged)
4. Compact 2×2 section tiles
5. Horizontal “Сейчас ищут” chip strip
6. Start of “Новые объявления” (6-card preview)

Large vertical gaps in the entry block were reduced on mobile only.

## 2. Hero / search / tiles / trending

| Block | Mobile | Desktop |
| --- | --- | --- |
| Copy | `home.mobileTitle` + `home.mobileSubtitle` | existing `home.lead` |
| Search | `home.searchPlaceholder`, header variant + camera | same component, wider lead row |
| Tiles | 2×2 near-square cards (~108–128px) | wider cards, 4 columns on `lg` |
| Trending | moved under tiles, `compact`, horizontal scroll | wrap chips, slightly larger |
| Latest | dense section, 6 cards, “Смотреть все” | same preview count, larger type |

Routes for tiles remain `/market`, `/services`, `/opt`, `/cargo`.
Trending chips still link to `/listings?q=<tag>`.

## 3. Mobile-only changes

- Responsive title/subtitle swap (`sm:hidden` / `hidden sm:block`)
- Tighter section paddings (`dense`, compact trending)
- Horizontal scroll for trending chips
- Eyebrow/section descriptions hidden on small screens where they only add height
- Bottom nav clearance still provided by the root layout `pb-[calc(5rem+env(safe-area-inset-bottom))]`

## 4. What did not change

- Prisma schema / migrations
- Auth
- Uploads
- Photo search backend / modal behavior
- Desktop overall home structure (lead + search row, discovery sections)
- Mobile bottom navigation component

## 5. Known gaps

- Later: A/B testing hero copy
- Later: real trending searches from analytics
- Later: personalized home feed
