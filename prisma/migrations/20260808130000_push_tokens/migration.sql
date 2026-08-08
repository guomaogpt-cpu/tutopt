-- CreateEnum
CREATE TYPE "PushPlatform" AS ENUM ('ANDROID', 'PWA', 'IOS');

-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'LISTING_APPROVED';
ALTER TYPE "NotificationType" ADD VALUE 'LISTING_REJECTED';

-- CreateTable
CREATE TABLE "push_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token" VARCHAR(512) NOT NULL,
    "platform" "PushPlatform" NOT NULL DEFAULT 'ANDROID',
    "device_id" VARCHAR(200),
    "app_version" VARCHAR(50),
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "last_seen_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "push_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "push_tokens_token_key" ON "push_tokens"("token");

-- CreateIndex
CREATE INDEX "push_tokens_user_id_enabled_idx" ON "push_tokens"("user_id", "enabled");

-- AddForeignKey
ALTER TABLE "push_tokens" ADD CONSTRAINT "push_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
