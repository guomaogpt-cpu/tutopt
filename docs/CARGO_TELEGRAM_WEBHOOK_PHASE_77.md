# Phase 77 — Cargo Telegram connect via bot webhook

## 1. How Telegram connect works

1. Seller opens `/seller/cargo-settings`
2. Clicks **Подключить Telegram**
3. Server creates a one-time `telegramConnectToken` (TTL 1 hour)
4. UI shows `https://t.me/<BOT_USERNAME>?start=<token>`
5. Seller opens the bot and presses **Start**
6. Telegram sends an update to `POST /api/webhooks/telegram`
7. Webhook validates the token, saves `telegramChatId`, enables `notifyTelegram`, clears the token
8. Settings UI shows **Telegram подключён** (auto-refresh while waiting)

Manual Chat ID entry from Phase 76 remains as a collapsed fallback.

## 2. Start token

Stored on `CargoSubscription`:

- `telegram_connect_token` (unique, nullable)
- `telegram_connect_token_expires_at`

Generated with `crypto.randomBytes` (base64url). One-time use. Cleared after success or expiry.

## 3. CargoSubscription Telegram fields

| Field | Purpose |
| --- | --- |
| `notify_telegram` | send matching request alerts |
| `telegram_chat_id` | destination chat |
| `telegram_username` | optional display |
| `telegram_connected_at` | when chat was linked |
| `telegram_connect_token` | pending `/start` token |
| `telegram_connect_token_expires_at` | token TTL |

## 4. Environment (Railway Variables)

| Variable | Required | Notes |
| --- | --- | --- |
| `TELEGRAM_BOT_TOKEN` | for send + webhook replies | skip sends if missing |
| `TELEGRAM_BOT_USERNAME` | for connect deep links | without it, connect-link returns a clear error |
| `TELEGRAM_WEBHOOK_SECRET` | optional | checked via `X-Telegram-Bot-Api-Secret-Token` or `?secret=` |
| `NEXT_PUBLIC_APP_URL` | already required | board links in request messages |

App does not crash if Telegram env vars are absent.

## 5. Webhook endpoint

`POST /api/webhooks/telegram`

- Always returns `{ ok: true }` for soft failures (except unauthorized secret → 401)
- Handles `/start <token>` only
- Does not link chat without a valid non-expired token
- Confirms with RU message: «Telegram подключён…»

### After deploy: set webhook

Point Telegram at the public Railway URL, for example:

`https://<your-app>/api/webhooks/telegram`

If using secret:

`setWebhook` with `secret_token=<TELEGRAM_WEBHOOK_SECRET>`

(or append `?secret=` if you prefer query auth)

## 6. Manual fallback

Collapsed **Ручной ввод Chat ID** on the settings page. Same Phase 76 validation: `notifyTelegram` requires chat id.

## 7. Disconnect

`POST /api/cargo/telegram/disconnect`

- `notifyTelegram = false`
- clears connect token
- **keeps** `telegramChatId` so the seller can re-enable without reconnecting

## 8. Data NOT sent in cargo alerts

Unchanged from Phase 76: no client phone, name/company, or free-text comment.

## 9. Not implemented

- bot commands beyond `/start`
- Telegram menu / reply keyboards
- rich message templates
- delivery logs
- WhatsApp
- Email

## Related APIs

- `POST /api/cargo/telegram/connect-link`
- `POST /api/cargo/telegram/disconnect`
- `POST /api/seller/cargo-subscriptions/telegram-test`
- `POST /api/webhooks/telegram`

## Related UX

Telegram connect status is also summarized on the unified cabinet `/account` (Phase 81). Settings remain at `/seller/cargo-settings`.
