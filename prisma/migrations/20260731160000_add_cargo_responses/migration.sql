-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'NEW_CARGO_RESPONSE';

-- CreateEnum
CREATE TYPE "CargoResponseStatus" AS ENUM ('NEW', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

-- CreateTable
CREATE TABLE "cargo_responses" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "cargo_request_id" UUID NOT NULL,
    "seller_profile_id" UUID NOT NULL,
    "price" VARCHAR(50),
    "currency" VARCHAR(10),
    "estimated_time" VARCHAR(100),
    "comment" VARCHAR(1000) NOT NULL,
    "contact_name" VARCHAR(100),
    "contact_phone" VARCHAR(20),
    "status" "CargoResponseStatus" NOT NULL DEFAULT 'NEW',

    CONSTRAINT "cargo_responses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cargo_responses_cargo_request_id_created_at_idx" ON "cargo_responses"("cargo_request_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "cargo_responses_seller_profile_id_created_at_idx" ON "cargo_responses"("seller_profile_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "cargo_responses_status_idx" ON "cargo_responses"("status");

-- CreateIndex
CREATE UNIQUE INDEX "cargo_responses_cargo_request_id_seller_profile_id_key" ON "cargo_responses"("cargo_request_id", "seller_profile_id");

-- AddForeignKey
ALTER TABLE "cargo_responses" ADD CONSTRAINT "cargo_responses_cargo_request_id_fkey" FOREIGN KEY ("cargo_request_id") REFERENCES "cargo_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cargo_responses" ADD CONSTRAINT "cargo_responses_seller_profile_id_fkey" FOREIGN KEY ("seller_profile_id") REFERENCES "seller_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
