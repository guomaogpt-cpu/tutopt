# Mobile homepage UI hotfix 2

## Changes

1. **Second search hidden on mobile**  
   The in-page `SearchWithSuggest` under the home title is `hidden sm:block`.  
   Phones use only the header search (camera / suggest / submit unchanged).

2. **Smaller section tiles**  
   Replaced full-width `aspect-square` tiles with compact 2×2 buttons:  
   `grid-cols-2 gap-2`, `min-h-[100px]`, denser padding (`p-2.5`).

3. **Colored category cards (mobile)**  
   Soft tinted gradients per vertical:  
   Listings violet · Services emerald · Wholesale blue · Cargo rose/orange.  
   Dark mode uses matching soft tints (not flat white squares).

4. **Tighter first screen**  
   Less section padding; content packed at the top of each tile (no empty stretch).  
   Trending (“Сейчас ищут”) sits closer under the grid.

## Desktop / tablet

From `sm:` the previous wider white cards, search row, and spacing remain.
Bottom navigation was not changed.
