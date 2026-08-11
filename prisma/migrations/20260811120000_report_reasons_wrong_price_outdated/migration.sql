-- Phase 125: additional listing report reasons
ALTER TYPE "ReportReason" ADD VALUE IF NOT EXISTS 'WRONG_PRICE';
ALTER TYPE "ReportReason" ADD VALUE IF NOT EXISTS 'OUTDATED';
