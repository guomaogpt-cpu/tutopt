-- CreateEnum
CREATE TYPE "ImportQueueStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'DUPLICATE', 'SKIPPED');

-- CreateTable
CREATE TABLE "import_batches" (
    "id" UUID NOT NULL,
    "source_platform" VARCHAR(50),
    "total_count" INTEGER NOT NULL,
    "pending_count" INTEGER NOT NULL,
    "processing_count" INTEGER NOT NULL DEFAULT 0,
    "success_count" INTEGER NOT NULL DEFAULT 0,
    "failed_count" INTEGER NOT NULL DEFAULT 0,
    "duplicate_count" INTEGER NOT NULL DEFAULT 0,
    "skipped_count" INTEGER NOT NULL DEFAULT 0,
    "created_by_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "completed_at" TIMESTAMPTZ,

    CONSTRAINT "import_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_queue_items" (
    "id" UUID NOT NULL,
    "batch_id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "source_platform" VARCHAR(50) NOT NULL,
    "status" "ImportQueueStatus" NOT NULL DEFAULT 'PENDING',
    "error_message" TEXT,
    "draft_id" UUID,
    "duplicate_draft_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "processed_at" TIMESTAMPTZ,

    CONSTRAINT "import_queue_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "import_batches_created_at_idx" ON "import_batches"("created_at" DESC);

-- CreateIndex
CREATE INDEX "import_queue_items_batch_id_status_idx" ON "import_queue_items"("batch_id", "status");

-- CreateIndex
CREATE INDEX "import_queue_items_url_idx" ON "import_queue_items"("url");

-- AddForeignKey
ALTER TABLE "import_batches" ADD CONSTRAINT "import_batches_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_queue_items" ADD CONSTRAINT "import_queue_items_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "import_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_queue_items" ADD CONSTRAINT "import_queue_items_draft_id_fkey" FOREIGN KEY ("draft_id") REFERENCES "imported_listing_drafts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_queue_items" ADD CONSTRAINT "import_queue_items_duplicate_draft_id_fkey" FOREIGN KEY ("duplicate_draft_id") REFERENCES "imported_listing_drafts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
