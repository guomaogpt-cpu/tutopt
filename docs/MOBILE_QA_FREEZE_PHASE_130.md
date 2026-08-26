# Mobile QA Freeze — Phase 130

## 1. Цель

Стабилизировать мобильную версию ВсеТут перед дальнейшими релизами без новых функций и без redesign.

Основной путь: **Главная → поиск → список → объявление → заявка → кабинет → мои объявления/заявки**.

---

## 2. Проверенные маршруты

| Route | Статус |
|---|---|
| `/` | ✅ упрощена |
| `/market`, `/services`, `/opt`, `/cargo` | ✅ |
| `/listings`, `/listings?q=...` | ✅ |
| `/listings/[id]` | ✅ sticky CTA над bottom nav |
| `/listings/new` | ✅ sticky submit, без raw npm |
| `/account` | ✅ облегчён mobile layout |
| `/account/listings`, `/account/requests` | ✅ |
| `/account/company` | ✅ |
| `/favorites`, `/notifications` | ✅ через bottom nav |
| `/login`, `/register` | ✅ |
| `/privacy`, `/terms`, `/support`, `/delete-account` | ✅ draft legal |

---

## 3. Проверенные viewport sizes

- **375×812** — iPhone SE / mini
- **390×844** — iPhone 14
- **430×932** — iPhone Pro Max

Проверки: overflow-x-clip, safe-area, bottom nav padding, horizontal chips scroll.

---

## 4. Главная

**Оставлено на mobile:**
- header (без search row на `/`)
- title + subtitle ВсеТут
- один search (`HomepagePaperEntry`)
- разделы 2×2
- новые объявления
- bottom nav «Подать»

**Убрано / не подключено:**
- welcome card, quick actions, trending chips (компоненты есть, не импортируются)
- PWA banner на `/` (скрыт в `PwaInstallPrompt`)
- footer на mobile (`hidden md:block`) — нет дубля «Подать»
- empty state «Подать» на mobile — только bottom nav FAB

---

## 5. Search/listings

- Поиск с главной → `/listings?q=...`
- Фильтры: drawer footer с отступом над bottom nav
- Статусы через i18n (`status.*`)
- Карточки: variant `home` компактнее

---

## 6. Listing detail

- Sticky CTA: `mobileStickyBottomOffset(5)` — над bottom nav
- Свой listing: «Редактировать» + «Перейти к заявкам», без «Связаться»
- Характеристики: пустые значения фильтруются
- 404 через not-found page (Phase 124)

---

## 7. Listing creation

- Sticky submit над bottom nav, `pb-24` на форме
- beforeunload при dirty form
- AI: graceful fail без OpenAI key
- Empty categories: user-friendly message без shell-команд

---

## 8. Account

**Mobile упрощение:**
- «Моя активность» — основной блок
- Quick start — только desktop (`lg:block`)
- Meta favorites/notifications — скрыты на xs (есть в bottom nav)
- Listings/requests summaries — desktop only
- Company/cargo cards — mobile
- PWA install card — desktop only
- Push settings — только native Android

---

## 9. Requests

- Status chips horizontal scroll
- tel: links на received cards
- Empty states i18n

---

## 10. Cargo

- Hero компактнее (150px mobile)
- Dual CTA + How it works — desktop only
- Feedback CTA — desktop only
- Quick guide + hero CTA достаточны на mobile

---

## 11. Legal/store readiness

- `/privacy`, `/terms` — draft + `LegalDraftBanner`
- `/support` — contact email
- `/delete-account` — понятный flow
- Final legal review pending (docs note)

---

## 12. Android/WebView

- Back: drawer/modal guards (Phase 122)
- Keyboard inset CSS var
- Bottom nav hides on `/listings/new` form focus
- Native app: no PWA prompts
- Google OAuth in WebView — known limitation (phone login primary)

---

## 13. Исправленные проблемы

| Issue | Fix |
|---|---|
| Перегруженный `/account` на mobile | Скрыты duplicate blocks |
| Footer дублирует bottom nav на mobile | Footer `md:block` only |
| Два «Подать» на home empty state | CTA hidden on mobile |
| Cargo page overload | Dual CTA/HowItWorks hidden mobile |
| Raw `npm run db:seed` on create | User-friendly message |
| `(leads)` in privacy text | «заявки» |
| EN «Go to leads», «Dashboard» | «Go to requests», «My account» |
| Filter drawer under bottom nav | Extra padding in drawer footer |
| Push settings on mobile web | Native Android only |
| Admin «Marketplace overview» EN | «Обзор маркетплейса» |

---

## Phase 135 — Cards/modals/profile cleanup

| Issue | Fix |
|---|---|
| Listing cards overloaded with characteristics | Removed chips/MOQ from `ListingCard` |
| Uneven card heights | Fixed min-height + line-clamp layout |
| Contact modal huge on desktop | Centered dialog md+ |
| Cargo modal bottom on desktop | Centered dialog md+ |
| Seller profile duplicate stats | Removed `SellerProfileStats` |

See `docs/LISTING_CARDS_MODALS_PROFILE_CLEANUP_PHASE_135.md`

---

## Phase 136 — Home/header cleanup

| Issue | Fix |
|---|---|
| Duplicate search on home | Removed hero search; header search on all pages |
| Large hero title | Removed from `HomepagePaperEntry` |
| «Сейчас ищут» chips | Removed from `/` |
| Large section cards | Compact horizontal nav row |
| Header logo | Icon + «ВСЁ ТУТ» wordmark |

See `docs/HOME_HEADER_CLEANUP_PHASE_136.md`

---

## Phase 137 — Sticky two-level header

| Issue | Fix |
|---|---|
| Nav in top header row | Moved to level 2 only |
| Home section dupes | Removed `HomepagePaperEntry` |
| Search camera padding | Tightened right padding |
| Logo spacing/font | Brand block gap 4px, font-black |

See `docs/STICKY_TWO_LEVEL_HEADER_PHASE_137.md`

---

## Phase 138 — Compact marketplace cards

| Issue | Fix |
|---|---|
| Cards too tall | Removed min-height, divider, mt-auto |
| Sparse grid | Up to 6 cols @ 2xl, tighter gaps |
| Long meta | line-clamp-1, category truncate |
| Photo ratio | aspect-square for density |

See `docs/COMPACT_MARKETPLACE_CARDS_PHASE_138.md`

---

## Phase 139 — Category drawer header

| Issue | Fix |
|---|---|
| Second-level section nav overload | Removed; categories in drawer |
| No category navigation | «Категории» button next to logo |
| Section dupes | Drawer replaces sticky nav |

See `docs/CATEGORY_DRAWER_HEADER_PHASE_139.md`

---

## Phase 140 — Header category icon & contrast

| Issue | Fix |
|---|---|
| Category button too large | Icon-only 44–48px |
| Home too flat/white | Section bg alternation + borders |
| Cards blend with bg | Stronger border/shadow/text |
| Drawer low contrast | Tinted verticals + list cards |

See `docs/HEADER_CATEGORY_CONTRAST_PHASE_140.md`

---

## Phase 141 — Second-level header nav restored

| Issue | Fix |
|---|---|
| Missing section nav after Phase 139 | Restored `HeaderSectionNav` in sticky header |
| Home section dupes | Still no large cards on `/` |
| Category drawer | Kept icon-only + drawer alongside level 2 |

See `docs/SECOND_LEVEL_HEADER_NAV_PHASE_141.md`

---

## Phase 142 — Header/card density cleanup

| Issue | Fix |
|---|---|
| Header gray second level | Unified white header block |
| Cards too tall | One-line title, no seller, smaller text |
| Narrow desktop layout | Container max-w 1600px, denser grid |

See `docs/HEADER_CARD_DENSITY_CLEANUP_PHASE_142.md`

---

## Phase 143 — Lalafo-style glass header

| Issue | Fix |
|---|---|
| Sections in wrong row | Moved to top row near logo |
| Search/categories layout | Bottom row: Категории + search + Поиск |
| Flat white header | Glass blur + 4-color gradient accent |
| Currency unclear | Region/currency indicator (no auto conversion) |

See `docs/LALAFO_STYLE_GLASS_HEADER_PHASE_143.md`

---

## Phase 144 — Header click disappear bugfix

| Issue | Fix |
|---|---|
| Header disappears on click | z-index layering + pointer-events fix |
| Drawer overlay blocks header | Overlay z-70, header z-60, closed overlay inert |
| Glass gradient intercepts clicks | gradient z-0 pointer-events-none |

See `docs/HEADER_CLICK_DISAPPEAR_BUGFIX_PHASE_144.md`

---

## Phase 145 — Lalafo-style category mega dropdown

| Issue | Fix |
|---|---|
| Side drawer UX | Mega dropdown under header |
| Category navigation | Left main + right subcategory grid |
| Overlay bugs | z-55 panel below header z-60 |

See `docs/LALAFO_STYLE_CATEGORY_MEGA_DROPDOWN_PHASE_145.md`

---

## Phase 147 — Header dropdown & scroll lock fix

| Issue | Fix |
|---|---|
| Profile/currency broken mid-scroll | Fixed header + modal={false} dropdowns |
| Category menu scroll | Body scroll lock with position restore |
| Header top row disappears | Fixed header instead of sticky |

See `docs/HEADER_DROPDOWN_SCROLL_LOCK_FIX_PHASE_147.md`

---

## Phase 148 — Profile panel below header

| Issue | Fix |
|---|---|
| Settings drawer overlaps header/search | `belowHeader` drawer offset via `--site-header-height` |
| Backdrop dims header glass | Backdrop starts below header |
| Scroll jump on open | `useBodyScrollLock` + `modal={false}` |

See `docs/PROFILE_PANEL_BELOW_HEADER_FIX_PHASE_148.md`

---

## 14. Known limitations

- Google OAuth unstable in Android WebView — use phone/password
- Legal texts are drafts — need lawyer review
- View count not incremented
- Orphan components: `HomeWelcomeBlock`, `MobileHomeQuickActions`, `HomeMobileTrendingChips` (not wired)
- Desktop footer hidden on mobile — legal links via account service links + settings drawer

---

## 15. Что нельзя добавлять до release candidate

- Новые большие features (чат, оплата, push campaigns)
- iOS app
- Google Play publish без legal finalization
- Redesign desktop
- Prisma migrations for analytics/views
- Heavy chart libraries

---

## Файлы

| File | Change |
|---|---|
| `src/app/account/page.tsx` | Mobile layout simplification |
| `src/components/layout/Footer.tsx` | Hidden on mobile |
| `src/components/home/HomeListingsSection.tsx` | No mobile post CTA in empty |
| `src/components/cargo/CargoLandingPage.tsx` | Less sections on mobile |
| `src/components/cargo/CargoCompactHero.tsx` | Smaller hero |
| `src/components/account/PushNotificationsSettings.tsx` | Native only |
| `src/app/listings/new/page.tsx` | No raw npm message |
| `src/app/privacy/page.tsx` | Text cleanup |
| `src/components/listings/CatalogFiltersPanel.tsx` | Drawer nav padding |
| `src/lib/i18n/dictionaries.ts` | Label cleanup |

---

## Migration

Нет.
