# Listing Leads Workflow — Phase 128

## 1. Цель

Довести workflow заявок по объявлениям до понятного MVP: покупатель отправляет заявку → продавец видит и меняет статус → обе стороны понимают результат.

Без чата, оплаты, push, CRM и смешивания с cargo requests.

## 2. Создание заявки

- Кнопка «Связаться» на `/listings/[id]`
- Modal/bottom sheet: имя, телефон, сообщение
- Auth required; текст для гостя: «Войдите, чтобы отправить заявку продавцу.»
- Placeholder: «Здравствуйте. Меня интересует это объявление.»
- Кнопка: «Отправить заявку»
- API: `POST /api/listings/[id]/leads`

## 3. Success state

После отправки:
- «Заявка отправлена»
- «Продавец увидит ваш номер и сообщение в кабинете.»
- CTA: «Мои заявки», «Закрыть»

## 4. Полученные / отправленные заявки

`/account/requests`:
- **Полученные** — заявки по моим объявлениям
- **Отправленные** — заявки, которые я отправил
- Cargo tabs отдельно, не смешиваются с listing leads

## 5. Статусы

| Enum | UI |
|---|---|
| `NEW` | Новая |
| `VIEWED` | В работе |
| `CLOSED` | Завершена |
| `REJECTED` | Отклонена |

## 6. Действия продавца

- В работу → `VIEWED`
- Завершить → `CLOSED`
- Отклонить → `REJECTED`
- Позвонить (`tel:`), открыть объявление

## 7. Действия покупателя

- Статус, объявление, продавец, дата, сообщение
- Открыть объявление
- Отмена — future (нет в модели)

## 8. Уведомления

- Новая заявка → seller in-app `NEW_LEAD` → `/account/requests?tab=received&listingId=...`
- Смена статуса → buyer in-app `LEAD_STATUS_UPDATED` → `/account/requests?tab=sent`
- Push не делается

## 9. Dashboard integration

`/account` — компактные показатели:
- Новые заявки
- Полученные заявки
- Отправленные заявки

## 10. Listing-specific requests

- `/account/listings` → «Заявки: N» → `/account/requests?tab=received&listingId=...`
- Фильтр с заголовком и «Показать все заявки»

## 11. Duplicate guard

- Один активный lead (`NEW`/`VIEWED`) на buyer + listing
- Закрытые/отклонённые не блокируют новую заявку
- Double-click: loading state на кнопке

## 12. Android / WebView

- Bottom sheet с keyboard inset
- Back закрывает drawer
- Success state виден после отправки
- Tab chips горизонтально свайпаются

## 13. Security

- Seller видит только свои received leads
- Buyer видит только sent leads
- Self-request blocked
- Status update только owner listing
- Phone/message length validated

## 14. Known limitations

- Нет buyer cancel
- Нет push/email для leads
- Нет чата и WhatsApp API
- `force_resend` в API, но не в UI

## 15. Future

- Чат, WhatsApp integration
- Push notifications
- Lead analytics
- Cancellation by buyer
- Reminders

## Migration

- `LeadStatus.REJECTED`
- `NotificationType.LEAD_STATUS_UPDATED`

## Файлы

| File | Change |
|---|---|
| `ListingLeadFormContent.tsx` | Success, placeholder, login copy |
| `AccountReceivedLeadActions.tsx` | Complete/reject actions |
| `AccountLeadsQuickStats.tsx` | Dashboard stats |
| `lead-duplicate-check.ts` | Active-only duplicate |
| `lead-status.ts` | REJECTED mapping |
| `api/seller/leads/[id]/route.ts` | REJECTED + buyer notification |
| `notifications-data.ts` | Status updated notification |
