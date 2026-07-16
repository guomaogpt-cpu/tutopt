-- AlterEnum: add report reasons
ALTER TYPE "ReportReason" ADD VALUE IF NOT EXISTS 'PROHIBITED_ITEM';
ALTER TYPE "ReportReason" ADD VALUE IF NOT EXISTS 'DUPLICATE';
ALTER TYPE "ReportReason" ADD VALUE IF NOT EXISTS 'CONTACTS_IN_WRONG_PLACE';
ALTER TYPE "ReportReason" ADD VALUE IF NOT EXISTS 'OFFENSIVE_CONTENT';

-- AlterTable
ALTER TABLE "reports" ALTER COLUMN "listing_id" DROP NOT NULL;
ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "seller_profile_id" UUID;
ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "reviewed_at" TIMESTAMPTZ;
ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "reports_seller_profile_id_idx" ON "reports"("seller_profile_id");

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'reports_seller_profile_id_fkey'
  ) THEN
    ALTER TABLE "reports"
      ADD CONSTRAINT "reports_seller_profile_id_fkey"
      FOREIGN KEY ("seller_profile_id") REFERENCES "seller_profiles"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
