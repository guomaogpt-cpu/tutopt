-- CreateEnum
CREATE TYPE "ImportDraftStatus" AS ENUM ('PENDING_REVIEW', 'READY', 'REJECTED', 'DUPLICATE', 'PUBLISHED', 'FAILED');

-- CreateTable
CREATE TABLE "imported_listing_drafts" (
    "id" UUID NOT NULL,
    "source_platform" VARCHAR(50) NOT NULL,
    "source_url" TEXT,
    "source_external_id" VARCHAR(200),
    "raw_title" VARCHAR(200),
    "raw_description" TEXT,
    "raw_price" VARCHAR(50),
    "raw_currency" VARCHAR(10),
    "raw_city" VARCHAR(100),
    "raw_images" JSONB,
    "raw_contact" TEXT,
    "normalized_title" VARCHAR(200),
    "normalized_description" TEXT,
    "normalized_price" DECIMAL(12,2),
    "normalized_currency" VARCHAR(3),
    "normalized_city" VARCHAR(100),
    "normalized_category" VARCHAR(170),
    "normalized_subcategory" VARCHAR(170),
    "normalized_images" JSONB,
    "notes" TEXT,
    "status" "ImportDraftStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "duplicate_of_listing_id" UUID,
    "published_listing_id" UUID,
    "created_by_id" UUID,
    "reviewed_by_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "reviewed_at" TIMESTAMPTZ,
    "published_at" TIMESTAMPTZ,

    CONSTRAINT "imported_listing_drafts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "imported_listing_drafts_status_idx" ON "imported_listing_drafts"("status");

-- CreateIndex
CREATE INDEX "imported_listing_drafts_source_url_idx" ON "imported_listing_drafts"("source_url");

-- CreateIndex
CREATE INDEX "imported_listing_drafts_source_platform_idx" ON "imported_listing_drafts"("source_platform");

-- CreateIndex
CREATE INDEX "imported_listing_drafts_created_at_idx" ON "imported_listing_drafts"("created_at" DESC);

-- AddForeignKey
ALTER TABLE "imported_listing_drafts" ADD CONSTRAINT "imported_listing_drafts_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imported_listing_drafts" ADD CONSTRAINT "imported_listing_drafts_reviewed_by_id_fkey" FOREIGN KEY ("reviewed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imported_listing_drafts" ADD CONSTRAINT "imported_listing_drafts_published_listing_id_fkey" FOREIGN KEY ("published_listing_id") REFERENCES "listings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imported_listing_drafts" ADD CONSTRAINT "imported_listing_drafts_duplicate_of_listing_id_fkey" FOREIGN KEY ("duplicate_of_listing_id") REFERENCES "listings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
