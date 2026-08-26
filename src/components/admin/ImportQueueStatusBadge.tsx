import type { ImportQueueStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<ImportQueueStatus, string> = {
  PENDING: "Ожидает",
  PROCESSING: "Обрабатывается",
  SUCCESS: "Готово",
  FAILED: "Ошибка",
  DUPLICATE: "Дубль",
  SKIPPED: "Пропущено",
};

const STATUS_CLASSES: Record<ImportQueueStatus, string> = {
  PENDING: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  PROCESSING: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  SUCCESS: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  FAILED: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  DUPLICATE: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  SKIPPED: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

type ImportQueueStatusBadgeProps = {
  status: ImportQueueStatus;
  className?: string;
};

export function ImportQueueStatusBadge({ status, className }: ImportQueueStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_CLASSES[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export function getImportQueueStatusLabel(status: ImportQueueStatus): string {
  return STATUS_LABELS[status];
}
