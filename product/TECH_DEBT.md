# Tech Debt — Tutopt

**Обновлено:** июль 2026

---

## Архитектура

| ID | Описание | Impact | Effort |
|----|----------|--------|--------|
| TD-001 | Нет единого `EmptyState` компонента — 4+ варианта empty UI | Medium | Low |
| TD-002 | Кнопки и карточки без design tokens — inline Tailwind везде | Medium | Medium |
| TD-003 | `buttonPrimaryClassName` в FormField не используется консистентно | Low | Low |
| TD-004 | `text-gray-900` в globals.css vs `text-slate-*` в компонентах | Low | Low |
| TD-005 | Dead code: `SearchBar.tsx`, `PopularListings.tsx`, `QuickCategories.tsx` | Low | Low |
| TD-006 | `mock-data.ts` для legacy demo — можно удалить после cleanup | Low | Low |
| TD-007 | Дублирование `listingCardSelect` в нескольких `*-data.ts` | Medium | Medium |
| TD-008 | Нет custom `not-found.tsx` | Medium | Low |

---

## Auth & Security

| ID | Описание | Impact | Effort |
|----|----------|--------|--------|
| TD-010 | Password reset token не отправляется по email | High | Medium |
| TD-011 | Email verification flow не реализован (schema есть) | Medium | Medium |
| TD-012 | Нет rate limiting на auth endpoints | High | Medium |
| TD-013 | Нет CSRF protection явно (rely on SameSite cookie) | Medium | Low |

---

## Data & Storage

| ID | Описание | Impact | Effort |
|----|----------|--------|--------|
| TD-020 | Local file uploads — не production-ready | High | High |
| TD-021 | Schema models без UI: Report, CategorySubscription, SeoPage, ListingContactEvent | Low | — |
| TD-022 | ListingAttribute model — не используется в UI | Medium | Medium |
| TD-023 | SellerDocument / верификация — schema only | Medium | High |

---

## API & Performance

| ID | Описание | Impact | Effort |
|----|----------|--------|--------|
| TD-030 | Notifications polling 30s — не scalable | Medium | High |
| TD-031 | Нет кеширования каталога (каждый request → Prisma) | Medium | Medium |
| TD-032 | Нет full-text search (только ILIKE по title) | Medium | High |
| TD-033 | `package.json#prisma` deprecated warning (Prisma 7) | Low | Low |

---

## Testing & DevOps

| ID | Описание | Impact | Effort |
|----|----------|--------|--------|
| TD-040 | Нет unit/integration тестов | High | High |
| TD-041 | Нет E2E тестов (Playwright/Cypress) | High | High |
| TD-042 | Нет CI pipeline | High | Medium |
| TD-043 | Нет staging environment | Medium | Medium |
| TD-044 | `db:test-seed` отдельно от основного seed | Low | Low |

---

## Mobile & UX

| ID | Описание | Impact | Effort |
|----|----------|--------|--------|
| TD-050 | Нет favorites button в mobile header top bar | Medium | Low |
| TD-051 | Высокий header на mobile (72px + search) | Low | Medium |
| TD-052 | Lead form далеко на mobile listing detail | Medium | Medium |
| TD-053 | Filter touch targets меньше form fields | Low | Low |
