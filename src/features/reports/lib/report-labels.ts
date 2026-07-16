import type { ReportReason, ReportStatus } from "@prisma/client";
import { REPORT_REASON_LABELS } from "@/features/reports/validators/report.validators";

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  OPEN: "Новая",
  RESOLVED: "Рассмотрена",
  DISMISSED: "Отклонена",
};

export function getReportReasonLabel(reason: ReportReason): string {
  return REPORT_REASON_LABELS[reason];
}

export function getReportStatusLabel(status: ReportStatus): string {
  return REPORT_STATUS_LABELS[status];
}

export type ReportTargetType = "listing" | "seller";
