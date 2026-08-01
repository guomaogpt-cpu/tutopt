-- AlterTable cargo_request_subscriptions — Telegram connection fields (Phase 76)
ALTER TABLE "cargo_request_subscriptions" ADD COLUMN "telegram_chat_id" VARCHAR(64);
ALTER TABLE "cargo_request_subscriptions" ADD COLUMN "telegram_username" VARCHAR(64);
ALTER TABLE "cargo_request_subscriptions" ADD COLUMN "telegram_connected_at" TIMESTAMPTZ;

CREATE INDEX "cargo_request_subscriptions_notify_telegram_idx"
  ON "cargo_request_subscriptions"("notify_telegram");
