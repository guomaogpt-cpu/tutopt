-- AlterTable
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "blocked_at" TIMESTAMPTZ;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "blocked_reason" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "blocked_by_id" UUID;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "listing_restricted_at" TIMESTAMPTZ;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "lead_restricted_at" TIMESTAMPTZ;

-- Backfill blocked_at from existing is_blocked flags
UPDATE "users"
SET "blocked_at" = COALESCE("blocked_at", "updated_at", "created_at")
WHERE "is_blocked" = true AND "blocked_at" IS NULL;

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_blocked_by_id_fkey'
  ) THEN
    ALTER TABLE "users"
      ADD CONSTRAINT "users_blocked_by_id_fkey"
      FOREIGN KEY ("blocked_by_id") REFERENCES "users"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
