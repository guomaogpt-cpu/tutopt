-- Phase 77: Telegram connect start-token fields
ALTER TABLE "cargo_request_subscriptions" ADD COLUMN "telegram_connect_token" VARCHAR(64);
ALTER TABLE "cargo_request_subscriptions" ADD COLUMN "telegram_connect_token_expires_at" TIMESTAMPTZ;

CREATE UNIQUE INDEX "cargo_request_subscriptions_telegram_connect_token_key"
  ON "cargo_request_subscriptions"("telegram_connect_token");
