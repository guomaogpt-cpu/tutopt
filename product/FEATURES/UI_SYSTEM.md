# Feature: UI System

**Статус:** MVP (partial) — нет единой design system  
**Стек:** Tailwind CSS, Lucide icons, custom components

---

## Обзор

Tutopt использует utility-first Tailwind без формализованной design system. Есть повторяющиеся паттерны, но без централизованных tokens.

---

## Цветовая палитра

| Token | Использование |
|-------|---------------|
| `slate-*` | Текст, бордеры, фоны |
| `blue-600` | Primary CTA, links, accents |
| `blue-50` | Hover backgrounds, badges |
| `green-*` | Success states |
| `red-*` | Errors, logout |
| `amber-*` | Warnings (seed missing) |
| `rose-*` | Favorites active state |

**Отклонение:** `globals.css` задаёт `text-gray-900` для body, компоненты используют `slate`.

---

## Типографика

| Элемент | Классы |
|---------|--------|
| Page title (PublicPageHeader) | `text-3xl sm:text-4xl font-bold` |
| Page title (inline) | `text-2xl sm:text-3xl font-bold` |
| Section heading | `text-2xl sm:text-3xl font-bold` |
| Card title | `text-base font-semibold` |
| Body | `text-sm` / `text-base` |
| Muted | `text-sm text-slate-500/600` |
| Eyebrow | `text-sm font-medium uppercase tracking-wider text-blue-600` |

**Проблема:** два стиля page title без единого правила.

---

## Кнопки

### Primary (наиболее частый)

```
rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700
```

### Secondary

```
rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50
```

### Экспорт из FormField

```ts
buttonPrimaryClassName = "w-full rounded-xl bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700"
```

**Проблема:** NewListingForm использует `rounded-2xl py-4 shadow-md` — крупнее остальных.

---

## Карточки

### Базовый паттерн

```
rounded-2xl border border-slate-200 bg-white
```

### Вариации

| Контекст | Дополнительно |
|----------|---------------|
| ListingCard | `shadow-sm`, hover border |
| Empty states | `bg-slate-50` или `bg-white` + emoji |
| Form sections | `p-6 sm:p-8` |
| Contact cards | `p-6`, no shadow |
| Admin tables | `shadow-sm`, `overflow-hidden` |

---

## Формы

### Inputs (FormField)

```
rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
```

### NewListingForm inputs

```
rounded-2xl py-3.5 text-base  — крупнее стандартных
```

### Errors

- Banner: `rounded-xl border border-red-200 bg-red-50 text-red-800`
- Field: `text-xs text-red-600`
- Success: `border-green-200 bg-green-50 text-green-800`

---

## Layout

### Container

```
mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8
```

### Page backgrounds

| Тип | Background |
|-----|------------|
| Public (catalog, favorites) | `bg-white` |
| Auth, seller, admin | `bg-slate-50` |
| Home | `bg-white` + section backgrounds |

### Page padding (не унифицировано)

- Catalog: `py-6 sm:py-8`
- Favorites, notifications: `py-6 sm:py-10`
- Auth, seller: `py-10 sm:py-14`
- Buyer dashboard: `py-8 sm:py-12`

---

## Навигация

### Header

- Height: 72px
- Logo left, search center (desktop), actions right
- Mobile: search below header, hamburger menu
- Focus ring: `focus-visible:ring-2 focus-visible:ring-blue-500`

### Footer

- Static links: about, help, contacts, privacy, terms
- Simple layout, no social icons

---

## Иконки

- **Library:** Lucide React
- Category icons: rule-based mapping by name/slug
- Favorites: Heart (rose when active)
- Notifications: Bell + badge

---

## Empty states (4 уровня)

1. **Rich card** — emoji/icon + title + description + CTA button
2. **Text + link** — одна строка + ссылка (buyer dashboard sections)
3. **Inline** — внутри компонента (image upload)
4. **Hidden** — `return null` (similar listings)

**Tech debt:** нужен единый `<EmptyState>` компонент.

---

## Responsive breakpoints

- Tailwind defaults: `sm` 640, `md` 768, `lg` 1024, `xl` 1280
- Header desktop nav: `lg:flex`
- Catalog filters: mobile sheet / desktop popover at same breakpoint
- Tables → cards: `md:hidden` / `hidden md:block`

---

## Анимации

```css
animate-fade-in-up  — 0.35s ease-out
animate-scale-in    — 0.25s ease-out
```

Используются минимально.

---

## Компоненты (ключевые)

| Компонент | Путь |
|-----------|------|
| Container | `components/layout/Container` |
| Logo | `components/layout/Logo` |
| HeaderClient | `components/layout/header/HeaderClient` |
| UserMenu | `components/layout/header/UserMenu` |
| HeaderSearch | `components/layout/header/HeaderSearch` |
| HeaderNotificationsBell | `components/layout/header/HeaderNotificationsBell` |
| ListingCard | `components/listings/ListingCard` |
| ListingGallery | `components/listings/ListingGallery` |
| FormField | `components/public/FormField` |
| PublicPageHeader | `components/public/PublicPageHeader` |
| SectionHeading | `components/ui/SectionHeading` |
| ListingsEmptyState | `components/listings/ListingsEmptyState` |

---

## Roadmap UI System

1. Design tokens file (colors, spacing, typography, radii)
2. `<Button variant="primary|secondary|ghost">`
3. `<Card>`, `<EmptyState>`, `<PageHeader>`
4. Unified page layout wrapper
5. Storybook или component gallery
6. Custom 404 page
7. Mobile nav polish

---

## Чеклист

См. `UI_CHECKLIST.md` для pre-release проверок.
