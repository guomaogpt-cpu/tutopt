# Listing Leads & Contact Flow — Phase 119

> **Цель:** улучшить marketplace flow «покупатель → заявка → продавец» без чата, CRM и native calls API.

---

## 1. Цель

Покупатель нашёл объявление → оставил заявку → продавец получил уведомление (in-app + push) → видит заявку в `/account/requests`.

---

## 2. Что было до фазы

- Lead model (`NEW`, `VIEWED`, `CLOSED`) и API `POST /api/listings/[id]/leads`
- Inline форма на `/listings/[id]`, scroll-to-form CTA
- Duplicate guard 10 минут
- Уведомление `NEW_LEAD` + push (Phase 117)
- `/account/requests` с tabs (sent/received/cargo)

---

## 3. CTA на объявлении

- **Mobile sticky:** «Связаться» + избранное + tel (если есть)
- **Desktop sidebar:** `ListingContactCard` — связаться + избранное + контакты
- **Своё объявление:** «Редактировать» + «Посмотреть заявки»
- CTA открывает **bottom drawer** (не scroll)

---

## 4. Форма заявки

Bottom sheet (`ListingLeadContactDrawer`):

| Поле | Поведение |
|---|---|
| Имя | из профиля, read-only |
| Телефон | из профиля, editable; обязателен если нет в профиле |
| Сообщение | prefill: «Здравствуйте, интересует объявление «{title}». Актуально?» |

Desktop (lg+): inline форма на странице. Mobile: compact card + drawer.

---

## 5. Защита от дублей

- Soft guard: `userId + listingId` в **24 часа**
- `force_resend: true` — повторная отправка по кнопке
- UI duplicate state: «Открыть мои заявки» / «Отправить повторно»

---

## 6. Статусы заявок

| Enum | Label |
|---|---|
| `NEW` | Новая |
| `VIEWED` | В работе |
| `CLOSED` | Закрыта |

Продавец: позвонить, «В работе», «Закрыть» в карточке заявки.

---

## 7. Уведомления продавцу

При создании lead:

- In-app: `NEW_LEAD` — «Новая заявка по объявлению»
- Link: `/account/requests`
- Push через Phase 117 helper (failure не блокирует lead)

---

## 8. Push integration

Reuse `dispatchUserPush` after `createNewLeadNotification`. Wrapped in try/catch on lead API.

---

## 9. /account/requests

- Received tab: «Заявки по вашим объявлениям»
- Карточка: статус, объявление, покупатель, сообщение, действия
- Empty state → «Мои объявления»

---

## 10. Android/WebView considerations

- Drawer: `max-height` + keyboard inset CSS var
- `role="dialog"` — Back закрывает overlay (`closeTopmostOverlay`)
- Sticky CTA offset above bottom nav
- `inputMode="tel"` на телефоне

---

## 11. Security

- `sellerId` из listing owner на server
- Auth required для submit
- Phone/message length limits (Zod)
- Contact data visible только продавцу заявки
- No secrets in push payload

---

## 12. Future

- Полноценный чат
- Buyer request history dashboard
- Anti-spam / rate limits по IP
- Lead analytics
- WhatsApp deep link

---

## Связанные документы

- `docs/APP_NOTIFICATIONS_ACTIVITY_PHASE_116.md`
- `docs/ANDROID_PUSH_NOTIFICATIONS_PHASE_117.md`
- `docs/MOBILE_APP_UX_UPGRADE_PHASE_115.md`
