# App Notifications & Activity — Phase 116

> **Статус:** in-app notifications and activity polish.  
> **Не в scope:** Firebase Push, native push, Google Play publish.

---

## 1. Цель

Сделать приложение «живее» для пользователя без native push:
- понятный центр уведомлений
- бейджи unread в bottom nav и header
- блок активности в кабинете
- human-readable статусы объявлений и заявок
- быстрые переходы из уведомлений

Production: `https://tutopt-production.up.railway.app` (Capacitor WebView)

---

## 2. Что было до фазы

| Область | Состояние |
|---|---|
| `/notifications` | 3 фильтра (все / непрочитанные / заявки), mark read работал |
| Bottom nav badge | Только точка, без числа |
| Unread store | Стартовал с 0 до первого poll (~30s) |
| `/account` | Stats cards, без compact «Активность» |
| Listing status | «Опубликовано», без подсказок |
| Toast | Компоненты есть, `<Toaster />` не был смонтирован |
| Listing moderation notifications | Нет (нет enum в Prisma — без migration) |

---

## 3. Bottom nav badge

- **Numeric badge** на табе «Уведомления»: `1`…`9+`
- Shared store + `NotificationsUnreadRoot` (SSR hydrate + 30s poll)
- Не ломает layout (min-width badge, ring)

Файлы: `MobileBottomNav.tsx`, `NotificationsUnreadRoot.tsx`, `NotificationsUnreadSync.tsx`, `notification-display.ts`

---

## 4. `/notifications`

**Фильтры:**
- Все
- Заявки (`NEW_LEAD`)
- Объявления (placeholder — moderation notifications future)
- Карго (`NEW_CARGO_*`)
- Система (`COMPANY_*`)

**Карточка:**
- title, message, time, unread pill
- action label: «Открыть заявку» / «Открыть карго» / …
- click → mark read → navigate

**Mark all read** + success/error toast

---

## 5. `/account` activity

Блок **«Активность»**:
- новые уведомления (unread count)
- новые заявки продавцу (`receivedLeadsCount`)
- объявления на модерации
- активные объявления
- карго-заявки

Quiet empty state + CTA «Подать объявление»

Файл: `AccountActivitySummary.tsx`

---

## 6. Status mapping

### Listings (display only, DB unchanged)

| Enum | Label |
|---|---|
| DRAFT | Черновик |
| PENDING_MODERATION | На модерации |
| PUBLISHED | **Активно** |
| REJECTED | Отклонено |
| ARCHIVED | В архиве |

Hints: `status.hint.*` in i18n

### Leads

| Enum | Label |
|---|---|
| NEW | Новая |
| VIEWED | В работе |
| CLOSED | Закрыта |

### Cargo requests

Existing i18n keys + `cargoStatus.hint.*`

---

## 7. Mark as read

Existing API:
- `PATCH /api/notifications/[id]/read`
- `PATCH /api/notifications/read-all`

UI: optimistic update + unread store sync + toast on mark-all

---

## 8. Android / WebView

- Badge stable size (`9+` cap)
- Notifications page uses layout bottom padding for nav
- Back → history (standard)
- Long text: `line-clamp` on cards
- No horizontal scroll on filter tabs (`overflow-x-auto`)

---

## 9. Почему native push не включали (Phase 116)

Phase 116 = **in-app only**. Native push добавлен в **Phase 117**.

---

## 10. Phase 118 — Listing moderation notifications ✅

Закрыт gap по объявлениям:

| Type | In-app | Push |
|---|---|---|
| `LISTING_SUBMITTED` | ✅ | — |
| `LISTING_APPROVED` | ✅ | ✅ |
| `LISTING_REJECTED` | ✅ | ✅ |

Фильтр «Объявления» в `/notifications` показывает все три типа.

См. `docs/LISTING_MODERATION_NOTIFICATIONS_PHASE_118.md`

---

## 11. Future

- Buyer «cargo request created» notification
- Lead deep link with ID
- Notification preferences by type

---

## Связанные документы

- `docs/MOBILE_APP_UX_UPGRADE_PHASE_115.md`
- `docs/MOBILE_APP_ROADMAP_PHASE_107.md`
- `docs/LISTING_MODERATION_NOTIFICATIONS_PHASE_118.md`
- `docs/ANDROID_PUSH_NOTIFICATIONS_PHASE_117.md`
- `product/FEATURES/NOTIFICATIONS.md`
