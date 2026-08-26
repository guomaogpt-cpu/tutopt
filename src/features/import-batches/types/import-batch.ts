import type { ImportQueueStatus } from "@prisma/client";

export const MAX_URLS_PER_BATCH = 100;
export const PROCESS_BATCH_SIZE = 8;

export type ImportBatchRow = {
  id: string;
  sourcePlatform: string | null;
  totalCount: number;
  pendingCount: number;
  processingCount: number;
  successCount: number;
  failedCount: number;
  duplicateCount: number;
  skippedCount: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

export type ImportQueueItemRow = {
  id: string;
  batchId: string;
  url: string;
  sourcePlatform: string;
  status: ImportQueueStatus;
  errorMessage: string | null;
  draftId: string | null;
  duplicateDraftId: string | null;
  createdAt: string;
  updatedAt: string;
  processedAt: string | null;
};

export type ImportBatchDetail = ImportBatchRow & {
  items: ImportQueueItemRow[];
};
