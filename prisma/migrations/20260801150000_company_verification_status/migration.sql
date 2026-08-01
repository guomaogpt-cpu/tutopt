-- CreateEnum
CREATE TYPE "CompanyVerificationStatus" AS ENUM ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED');

-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'COMPANY_VERIFIED';
ALTER TYPE "NotificationType" ADD VALUE 'COMPANY_VERIFICATION_REJECTED';

-- AlterTable
ALTER TABLE "seller_profiles"
  ADD COLUMN "verification_status" "CompanyVerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
  ADD COLUMN "verified_by_id" UUID,
  ADD COLUMN "verification_note" TEXT;

-- Backfill from legacy boolean
UPDATE "seller_profiles"
SET "verification_status" = 'VERIFIED',
    "verified_at" = COALESCE("verified_at", NOW())
WHERE "is_verified" = true;

-- AddForeignKey
ALTER TABLE "seller_profiles"
  ADD CONSTRAINT "seller_profiles_verified_by_id_fkey"
  FOREIGN KEY ("verified_by_id") REFERENCES "users"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "seller_profiles_verification_status_idx" ON "seller_profiles"("verification_status");
