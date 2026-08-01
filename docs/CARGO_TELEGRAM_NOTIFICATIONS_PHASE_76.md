# Phase 76 — Cargo Telegram notifications

## 1. How to enable Telegram notifications

1. Open `/seller/cargo-settings`
2. Enter **Telegram Chat ID** (from the bot; manual for now)
3. Optionally enter Telegram username
4. Enable **Включить Telegram-уведомления**
5. Save settings
6. Optionally click **Отправить тестовое сообщение**

In-app notifications keep working independently.

## 2. Fields added on CargoSubscription

Table `cargo_request_subscriptions`:

| Field | DB column | Notes |
| --- | --- | --- |
| `notifyTelegram` | `notify_telegram` | already existed; now active |
| `telegramChatId` | `telegram_chat_id` | required when notifyTelegram=true |
| `telegramUsername` | `telegram_username` | optional label |
| `telegramConnectedAt` | `telegram_connected_at` | set when chat id is saved/changed |

## 3. Environment

Railway Variables (add later; do not commit secrets):

- `TELEGRAM_BOT_TOKEN` — BotFather token
- `NEXT_PUBLIC_APP_URL` — already required; used for “Open requests” link

If `TELEGRAM_BOT_TOKEN` is missing:

- app starts normally
- Telegram sends are skipped (`status: skipped`)
- in-app notifications still work

Token is never exposed to the client and must not be logged.

## 4. When Telegram is sent

After a successful `POST /api/cargo/requests` (cargo request already saved):

1. In-app notifications (Phase 74/75) run in their own try/catch
2. Telegram sends run in a separate try/catch

Telegram recipients:

- `CargoSubscription.enabled = true`
- `notifyTelegram = true`
- `telegramChatId` present
- soft match on service types / directions / optional locations (Phase 75)
- one message per `userId` / chatId
- request author is excluded

## 5. Test message

`POST /api/seller/cargo-subscriptions/telegram-test`

- authenticated seller/admin only
- uses request `chatId` or saved subscription chat id
- returns `sent` / `skipped` (missing token) / `failed`
- never returns the bot token

## 6. Data NOT sent in Telegram

- client phone
- client name / company
- free-text comment (may contain contacts)
- raw stack traces / bot token

Sent: item name, route, optional service type/direction labels, weight, dimensions, quantity, board URL.

## 7. If Telegram send fails

- cargo request remains created
- in-app notifications still attempted/created
- client UX is unchanged (no fatal error)

## 8. Not implemented

- Telegram webhook
- automatic chatId discovery / bot commands
- WhatsApp
- email
- rich HTML templates / delivery logs
- admin UI listing Telegram status per seller (**gap**)

## 9. Future Phase 77

- Telegram bot webhook for automatic chatId linking
- email notifications
- notification delivery logs
- optional admin visibility of Telegram connected state

## Related

- `src/lib/telegram/sendTelegramMessage.ts`
- `src/lib/telegram/cargo-telegram-notify.ts`
- `docs/CARGO_SUBSCRIPTIONS_PHASE_75.md`
- `docs/CARGO_NOTIFICATIONS_PHASE_74.md`
