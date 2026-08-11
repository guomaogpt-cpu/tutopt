# Listing Leads & Contact Flow — Phase 119

> **Цель:** улучшить marketplace flow «покупатель → заявка → продавец» **без native push**, чата, CRM и платежей.

---

## 1. Цель

Покупатель нашёл объявление → оставил заявку → продавец увидел **in-app** уведомление → обработал заявку в `/account/requests`.

---

## 2. Почему push отложили

- Firebase / native push foundation (Phase 117) готов, но **в Phase 119 не подключаем** доставку push по заявкам.
- Фокус — UX формы, CTA, дубли, статусы, seller dashboard и in-app notifications.
- Push для `NEW_LEAD` можно включить отдельной фазой после QA и Play internal testing.

---

## 3. CTA на объявлении

`/listings/[id]`:

| Контекст | Primary | Secondary |
|---|---|---|
| Чужое объявление | **Связаться** | В избранное (+ tel если есть) |
| Своё объявление | **Редактировать** | Посмотреть заявки |

**Mobile:**

- Sticky CTA снизу (`ListingMobileStickyCta`) — offset над bottom nav
- Открывает bottom drawer, не scroll к форме
- Back закрывает drawer (`closeTopmostOverlay`)

**Desktop:**

- Inline форма + sidebar `ListingContactCard`

---

## 4. Форма заявки

Bottom sheet (`ListingLeadContactDrawer` + `ListingLeadFormContent`):

| Поле | Поведение |
|---|---|
| Имя | из профиля, read-only |
| Телефон | из профиля; обязателен если нет в профиле |
| Сообщение | prefill: «Здравствуйте, интересует объявление «{title}». Актуально?» |

**Auth:** заявку может отправить только авторизованный пользователь (login prompt для гостя).

**Success:**

- «Заявка отправлена»
- «Продавец увидит ваше сообщение и свяжется с вами»
- Кнопки: «Открыть объявление» / «Смотреть другие объявления»

---

## 5. Защита от дублей

- Soft guard: `userId + listingId` (или `phone + listingId`) за **24 часа**
- При дубле: не создавать lead, показать «Вы уже отправили заявку по этому объявлению»
- Кнопки: **Открыть мои заявки** / **Вернуться к объявлению**
- API `force_resend` остаётся для edge cases, в UI не показывается

---

## 6. In-app notification продавцу

При `POST /api/listings/[id]/leads`:

| Поле | Значение |
|---|---|
| Type | `NEW_LEAD` (существующий) |
| Title | Новая заявка по объявлению |
| Text | Покупатель заинтересовался объявлением «{title}». |
| Link | `/account/requests` |

**Push не отправляется** в Phase 119. Ошибка notification не блокирует создание lead (try/catch).

---

## 7. /account/requests

**Received tab** — «Заявки по моим объявлениям»:

Карточка (`AccountReceivedLeadCard`):

- статус (human label)
- название объявления + ссылка
- имя покупателя, телефон, сообщение, дата
- **Позвонить** / **В работе** / **Закрыть**

**Empty states:**

| Ситуация | Текст | CTA |
|---|---|---|
| Есть объявления, нет заявок | Пока нет заявок… | Мои объявления |
| Нет своих объявлений | У вас пока нет объявлений… | Подать объявление |

**Buyer tab (sent):** «Мои обращения» — уже есть в tabs, без большого refactor.

---

## 8. Статусы заявок

| Enum | Label |
|---|---|
| `NEW` | Новая |
| `VIEWED` | В работе |
| `CLOSED` | Закрыта |

«Неактуальна» — future (отдельный enum без schema change не добавляли; `CLOSED` покрывает закрытие продавцом).

---

## 9. Android/WebView considerations

- Drawer: `max-height` + keyboard inset CSS var
- `inputMode="tel"` на телефоне
- `role="dialog"` — Back закрывает overlay
- Sticky CTA не перекрывает bottom nav
- Success / duplicate states видны без пустой формы

---

## 10. Security

- `sellerId` из listing owner на server, не из client
- Нельзя отправить заявку на своё объявление
- Auth required; нельзя подставить чужой `userId`
- Phone/message length limits (Zod)
- `link` только relative (`/account/requests`)
- Contact data видит только владелец объявления / admin
- No raw stack traces, no `any`

---

## 11. Account activity

`/account` activity block:

- счётчики новых заявок и заявок в работе
- primary кнопка **Открыть заявки** при наличии lead activity
- quick links: notifications, listings, requests

---

## 12. Future

- Native push для `NEW_LEAD` (reuse Phase 117 `dispatchUserPush`)
- Полноценный чат
- Buyer request history dashboard
- Anti-spam / rate limits по IP
- WhatsApp deep link
- Статус «Неактуальна» при необходимости

---

## 13. Phase 121 — First-run onboarding ✅

Empty state на `/account/requests` и auth copy дополнены в рамках Phase 121:

- received tab: «Мои объявления» + «Подать объявление»
- noListings: «Создайте объявление, чтобы начать получать заявки»

См. `docs/FIRST_RUN_ONBOARDING_PHASE_121.md`

---

## 14. Phase 126 — Leads per listing ✅

- `/account/requests?listingId=...` — filter received leads by listing
- Link from `SellerListingManageCard` on `/account/listings`
- Owner-scoped listing lookup

См. `docs/SELLER_LISTING_MANAGEMENT_PHASE_126.md`

---

## Связанные документы

- `docs/APP_NOTIFICATIONS_ACTIVITY_PHASE_116.md`
- `docs/LISTING_MODERATION_NOTIFICATIONS_PHASE_118.md`
- `docs/MOBILE_APP_UX_UPGRADE_PHASE_115.md`
- `docs/MOBILE_APP_ROADMAP_PHASE_107.md`
- `docs/ANDROID_PUSH_NOTIFICATIONS_PHASE_117.md` (infrastructure only; lead push deferred)
- `docs/FIRST_RUN_ONBOARDING_PHASE_121.md`
