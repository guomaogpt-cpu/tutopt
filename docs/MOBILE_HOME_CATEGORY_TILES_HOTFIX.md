# Mobile home category tiles hotfix

## 1. What changed

The four homepage section cards (Listings, Services, Wholesale, Cargo) in
`HomepagePaperEntry` use a compact **2×2** grid on mobile instead of four full-width
stacked rows.

## 2. Why 2×2 compact grid

Four long horizontal cards forced heavy scrolling before the rest of the home feed.
A near-square 2×2 tile grid keeps all four sections visible in roughly half the first
phone viewport, next to search.

Mobile tile rules:

- `grid-cols-2`
- `aspect-square` with height clamped about 110–140px
- short subtitle (`home.*Short`) with `line-clamp-1`
- longer description and accent bar only from `sm:` up

## 3. Mobile-only changes

- Compact section padding
- Slightly smaller lead title on phones
- Square tiles + short labels
- Desktop/tablet keep wider cards (`sm:aspect-auto`, longer copy, 4 columns on `lg`)

## 4. Desktop preserved

Routes, search behavior, listing cards, auth, uploads, and Prisma were not changed.
Large-screen cards remain the previous wider style in a 4-column row.
