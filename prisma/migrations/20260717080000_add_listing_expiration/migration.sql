-- Add manual renewal tracking for listing publication lifecycle.
-- expires_at already exists on listings; only renewed_at is new.
ALTER TABLE "listings" ADD COLUMN "renewed_at" TIMESTAMPTZ;
