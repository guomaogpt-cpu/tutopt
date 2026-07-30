# Mobile navigation — Phase 64

## 1. What was added

- Fixed **mobile bottom navigation** (`md:hidden`) with safe-area padding for iPhone
- Root layout **content spacer** so pages are not covered by the bar (`pb` + `env(safe-area-inset-bottom)`, cleared from `md:` up)
- Cleaner **mobile header**: logo + notifications (if signed in) + menu; favorites/sign-in moved to bottom tabs / drawer
- Compact **mobile search** row under the header with short placeholder (`mobileSearch.placeholder`)
- `viewport-fit=cover` so safe-area insets work

## 2. Bottom nav items

| Tab | Route | Icon |
| --- | --- | --- |
| Home | `/` | Home |
| Search | `/listings` | Search |
| Post (center) | `getCreateListingHref(user)` → typically `/listings/new` or login/upgrade | PlusCircle |
| Favorites | `/favorites` | Heart |
| Profile | `/buyer/dashboard`, `/seller/dashboard`, `/admin`, or `/login` | User |

## 3. Active state

`getActiveMobileNavTab(pathname)`:

- `/` → home
- `/listings`, `/market`, `/opt`, `/services`, `/cargo`, `/categories` (+ nested) → search  
  (`/listings/new` is checked first → post)
- `/listings/new` → post
- `/favorites` → favorites
- `/buyer`, `/seller`, `/admin`, `/login`, `/register`, `/notifications` → profile

## 4. Mobile search

- Still uses `HeaderSearch` / `SearchWithSuggest` (submit → `/listings?q=…`)
- Mobile placeholder: “Что ищем?” / KG / EN via `mobileSearch.placeholder`
- Camera button remains `type="button"` and opens the existing photo-search modal
- Desktop header search unchanged (`search.headerPlaceholder`)

## 5. Unchanged

- Auth architecture
- Uploads architecture
- Photo search backend / hybrid logic
- Prisma schema / migrations
- Desktop header nav and desktop search layout

## 6. Known gaps

- Later: native app
- Later: push notifications
- Later: dedicated mobile seller flow
