-- CreateEnum
CREATE TYPE "ListingVertical" AS ENUM ('OPT', 'MARKET', 'SERVICES', 'CARGO');

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "vertical" "ListingVertical" NOT NULL DEFAULT 'OPT';

-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "vertical" "ListingVertical" NOT NULL DEFAULT 'OPT';

-- CreateIndex
CREATE INDEX "categories_vertical_idx" ON "categories"("vertical");

-- CreateIndex
CREATE INDEX "listings_vertical_status_idx" ON "listings"("vertical", "status");

-- Keep fuzzy title search index from init migration (not managed by Prisma schema)
CREATE INDEX IF NOT EXISTS "listings_title_trgm_idx" ON "listings" USING GIN ("title" gin_trgm_ops);
