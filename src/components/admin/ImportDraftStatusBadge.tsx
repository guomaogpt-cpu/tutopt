"use client";

import type { ImportDraftStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<ImportDraftStatus, string> = {
  PENDING_REVIEW: "На проверке",
  READY: "Готов",
  REJECTED: "Отклонён",
  DUPLICATE: "Дубль",
  PUBLISHED: "Опубликован",
  FAILED: "Ошибка",
};

const STATUS_CLASSES: Record<ImportDraftStatus, string> = {
  PENDING_REVIEW: "bg-[#FFFBEB] text-[#D97706]",
  READY: "bg-[#EFF6FF] text-[#2563EB]",
  REJECTED: "bg-[#FEF2F2] text-[#DC2626]",
  DUPLICATE: "bg-[#F1F5F9] text-[#64748B]",
  PUBLISHED: "bg-[#ECFDF5] text-[#059669]",
  FAILED: "bg-[#FEF2F2] text-[#DC2626]",
};

type ImportDraftStatusBadgeProps = {
  status: ImportDraftStatus;
  className?: string;
};

export function ImportDraftStatusBadge({ status, className }: ImportDraftStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        STATUS_CLASSES[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export function getImportDraftStatusLabel(status: ImportDraftStatus): string {
  return STATUS_LABELS[status];
}
