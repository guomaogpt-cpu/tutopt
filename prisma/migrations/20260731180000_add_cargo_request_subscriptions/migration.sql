-- CreateTable
CREATE TABLE "cargo_request_subscriptions" (
    "id" UUID NOT NULL,
    "seller_profile_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "cargo_request_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cargo_request_subscriptions_seller_profile_id_key" ON "cargo_request_subscriptions"("seller_profile_id");

-- CreateIndex
CREATE INDEX "cargo_request_subscriptions_user_id_idx" ON "cargo_request_subscriptions"("user_id");

-- CreateIndex
CREATE INDEX "cargo_request_subscriptions_is_active_idx" ON "cargo_request_subscriptions"("is_active");

-- AddForeignKey
ALTER TABLE "cargo_request_subscriptions" ADD CONSTRAINT "cargo_request_subscriptions_seller_profile_id_fkey" FOREIGN KEY ("seller_profile_id") REFERENCES "seller_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cargo_request_subscriptions" ADD CONSTRAINT "cargo_request_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
