# Phase 76 — Cargo Telegram notifications

## 1. How to enable Telegram notifications

Preferred (Phase 77):

1. Open `/seller/cargo-settings`
2. Click **Подключить Telegram**
3. Open the bot link and press **Start**
4. Status becomes connected; notifications use the linked chat

Manual fallback (Phase 76):

1. Expand **Ручной ввод Chat ID**
2. Enter Chat ID (+ optional username)
3. Enable Telegram notifications and save

See `docs/CARGO_TELEGRAM_WEBHOOK_PHASE_77.md` for webhook setup.

## 2. Fields added on CargoSubscription

Table `cargo_request_subscriptions`:

| Field | DB column | Notes |
| --- | --- | --- |
| `notifyTelegram` | `notify_telegram` | already existed; now active |
| `telegramChatId` | `telegram_chat_id` | required when notifyTelegram=true |
| `telegramUsername` | `telegram_username` | optional label |
| `telegramConnectedAt` | `telegram_connected_at` | set when chat id is saved/changed |

## 3. Environment

Railway Variables (do not commit secrets):

- `TELEGRAM_BOT_TOKEN` — BotFather token
- `TELEGRAM_BOT_USERNAME` — bot username without `@` (Phase 77 connect links)
- `TELEGRAM_WEBHOOK_SECRET` — optional webhook auth (Phase 77)
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

- bot commands beyond `/start` (see Phase 77 for webhook connect)
- Telegram menu
- rich HTML templates / delivery logs
- admin UI listing Telegram status per seller (**gap**)
- WhatsApp / Email

## 9. Phase 77

Bot webhook + start-token connect flow: `docs/CARGO_TELEGRAM_WEBHOOK_PHASE_77.md`.

## Related

- `src/lib/telegram/sendTelegramMessage.ts`
- `src/lib/telegram/cargo-telegram-notify.ts`
- `docs/CARGO_TELEGRAM_WEBHOOK_PHASE_77.md`
- `docs/CARGO_SUBSCRIPTIONS_PHASE_75.md`
- `docs/CARGO_NOTIFICATIONS_PHASE_74.md`
