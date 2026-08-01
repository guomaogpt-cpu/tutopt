-- AlterTable cargo_requests
ALTER TABLE "cargo_requests" ADD COLUMN "service_type" VARCHAR(80);
ALTER TABLE "cargo_requests" ADD COLUMN "direction" VARCHAR(80);

CREATE INDEX "cargo_requests_service_type_idx" ON "cargo_requests"("service_type");
CREATE INDEX "cargo_requests_direction_idx" ON "cargo_requests"("direction");

-- Extend cargo_request_subscriptions for Phase 75 preferences
ALTER TABLE "cargo_request_subscriptions" ADD COLUMN "service_types" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "cargo_request_subscriptions" ADD COLUMN "directions" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "cargo_request_subscriptions" ADD COLUMN "from_locations" JSONB;
ALTER TABLE "cargo_request_subscriptions" ADD COLUMN "to_locations" JSONB;
ALTER TABLE "cargo_request_subscriptions" ADD COLUMN "notify_in_app" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "cargo_request_subscriptions" ADD COLUMN "notify_email" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "cargo_request_subscriptions" ADD COLUMN "notify_telegram" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "cargo_request_subscriptions" ADD COLUMN "notify_whatsapp" BOOLEAN NOT NULL DEFAULT false;

-- Rename index is_active -> enabled (column stays is_active, mapped as enabled in Prisma)
DROP INDEX IF EXISTS "cargo_request_subscriptions_is_active_idx";
CREATE INDEX "cargo_request_subscriptions_is_active_idx" ON "cargo_request_subscriptions"("is_active");
