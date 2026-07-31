# Mobile home section grid hotfix

## 1. What was fixed

The four home section tiles (Listings, Services, Wholesale, Cargo) no longer use
fixed / clamped heights on mobile (`min-h` / `max-h`), which made the grid look
uneven and not fill the container width cleanly.

## 2. Why fixed size was removed

`aspect-square` plus `max-h-[128px]` / `min-h-[108px]` fought the grid track size:
tiles did not share equal fluid cells and the block looked cramped or skewed.

## 3. Mobile layout

- `grid w-full grid-cols-2 gap-[3px]`
  (`grid-cols-2` → `repeat(2, minmax(0, 1fr))`)
- Each tile: `aspect-square w-full` (via link `w-full` + square aspect)
- Compact content: icon + title + short subtitle (`line-clamp-1`)
- No fixed tile widths; no flex-wrap; no centered shrink gap

## 4. Desktop preserved

From `sm:` / `lg:`:

- Wider gaps (`gap-3.5` / `gap-4`)
- `aspect-auto`, larger padding, longer descriptions
- Four columns on `lg`

Routes, search, auth, Prisma, and listing cards were not changed.
