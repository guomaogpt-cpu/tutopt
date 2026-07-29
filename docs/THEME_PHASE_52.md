# Theme support — Phase 52

## Summary

Реальное переключение темы сайта: **Светлая / Тёмная / Системная** через `next-themes` и кнопки в settings drawer (Phase 51).

## 1. Library

- Package: `next-themes`
- Tailwind: `darkMode: ["class"]` (уже было в `tailwind.config.ts`)
- CSS variables: `:root` / `.dark` в `src/app/globals.css`

## 2. ThemeProvider

- File: `src/components/providers/ThemeProvider.tsx`
- Wired in: `src/components/providers.tsx` → wraps the app inside `AppProviders`
- Layout: `src/app/layout.tsx` — `<html suppressHydrationWarning>`

Provider options:

- `attribute="class"`
- `defaultTheme="system"`
- `enableSystem`
- `disableTransitionOnChange`
- `storageKey="vsetut.theme"` (совместим с Phase 51 preference key)

## 3. Settings drawer

- `useTheme()` → `setTheme("light" | "dark" | "system")`
- Active highlight only after `mounted` (avoids hydration mismatch)
- Menu structure unchanged (language still preference-only)

## 4. Dark styles added (basic readability)

| Area | Notes |
|------|--------|
| Header | Already had dark classes; mobile divider updated |
| Settings drawer | Dark section cards, text, pills, links |
| Listing cards | Dark bg/border/title/price/meta/favorite/badge; softer glow |
| Search inputs | `SearchWithSuggest` hero/header inputs |
| Auth | `AuthLayout`, `AuthFormCard` |
| Vertical landings | `/market` `/opt` `/services` `/cargo` page backgrounds + headings |
| Dashboard mains | `bg-[#F5F7FA]` pages → `dark:bg-slate-950` |
| Home | `dark:bg-slate-950` |
| Buyer quick actions | Dark cards |

## 5. Not changed

- Hero images / 300px height
- Language / i18n (Phase 53)
- Prisma / auth / uploads
- Header primary links / logo

## 6. Known gaps

- Полный visual QA dark mode ещё нужен
- Отдельные dashboard/admin/form cards могут потребовать polish
- Некоторые hardcoded `text-[#0F172A]` / `bg-white` блоки вне основных surfaces

## 7. Manual check

1. Settings → Тема: Светлая / Тёмная / Системная
2. Header + drawer readability
3. `/`, `/listings`, listing cards
4. `/login`, `/register`
5. `/market` (и другие verticals) — hero 300px + text contrast
6. `/buyer/dashboard`, `/seller/dashboard`
