# Logo update hotfix

## New file

- `public/logos/vsetut-logo-new.png` (1024×1024 PNG)
- Source upload: `public/images/tutvselogo.png` (same asset; kept as upload copy)

## Where updated

- `src/components/layout/BrandLogo.tsx` — single source (`BRAND_LOGO_SRC`)
- Desktop / mobile header via `HeaderClient` → `BrandLogo`
- Footer via `Footer` → `BrandLogo`
- Auth pages via `AuthLayout` / `AuthBrandPanel`
- Settings drawer logo
- Root metadata `icons` / apple icon in `src/app/layout.tsx`

## Favicon

- Updated: metadata `icons` and `apple` point to `/logos/vsetut-logo-new.png`
- Note: asset is square and usable; a dedicated smaller favicon set can still be added later if needed

## Old file

- `public/images/vsetut.png` — left in place, no longer referenced by `BrandLogo`
- Not deleted

## Sizing

- Square mark with `object-contain`
- Header ~40–64px height (responsive)
- Footer / auth slightly smaller or equal
