-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'NEW_CARGO_REQUEST';

-- CreateEnum
CREATE TYPE "CargoRequestStatus" AS ENUM ('NEW', 'IN_REVIEW', 'CONTACTED', 'CLOSED');

-- CreateTable
CREATE TABLE "cargo_requests" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "company" VARCHAR(150),
    "from_location" VARCHAR(200) NOT NULL,
    "to_location" VARCHAR(200) NOT NULL,
    "item_name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "item_photo_url" TEXT,
    "quantity" VARCHAR(50),
    "weight" VARCHAR(50),
    "dimensions" VARCHAR(100),
    "urgency" VARCHAR(50),
    "comment" TEXT,
    "status" "CargoRequestStatus" NOT NULL DEFAULT 'NEW',
    "user_id" UUID,

    CONSTRAINT "cargo_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cargo_requests_created_at_idx" ON "cargo_requests"("created_at" DESC);

-- CreateIndex
CREATE INDEX "cargo_requests_status_idx" ON "cargo_requests"("status");

-- CreateIndex
CREATE INDEX "cargo_requests_user_id_idx" ON "cargo_requests"("user_id");

-- AddForeignKey
ALTER TABLE "cargo_requests" ADD CONSTRAINT "cargo_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
