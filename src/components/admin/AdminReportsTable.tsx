"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { ListingVertical, ReportReason, ReportStatus } from "@prisma/client";
import { Flag, Package } from "lucide-react";
import { VerticalListingBadge } from "@/components/listings/VerticalListingBadge";
import { updateReportStatusRequest } from "@/features/reports/lib/reports-client";
import {
  getReportReasonLabel,
  getReportStatusLabel,
} from "@/features/reports/lib/report-labels";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type AdminReportRow = {
  id: string;
  reason: ReportReason;
  comment: string | null;
  status: ReportStatus;
  created_at: string;
  reporterName: string | null;
  listingId: string | null;
  listingTitle: string | null;
  listingVertical: ListingVertical | null;
  sellerId: string | null;
  sellerName: string | null;
  sellerUserId: string | null;
  targetType: "listing" | "seller";
};

type AdminReportsTableProps = {
  reports: AdminReportRow[];
};

type StatusFilter = "all" | "open" | "resolved" | "dismissed";
type TypeFilter = "all" | "listing" | "seller";

const STATUS_FILTERS: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "Все" },
  { value: "open", label: "Новые" },
  { value: "resolved", label: "Рассмотренные" },
  { value: "dismissed", label: "Отклонённые" },
];

const TYPE_FILTERS: Array<{ value: TypeFilter; label: string }> = [
  { value: "all", label: "Все типы" },
  { value: "listing", label: "Объявления" },
  { value: "seller", label: "Продавцы" },
];

function statusMatches(status: ReportStatus, filter: StatusFilter): boolean {
  switch (filter) {
    case "open":
      return status === "OPEN";
    case "resolved":
      return status === "RESOLVED";
    case "dismissed":
      return status === "DISMISSED";
    default:
      return true;
  }
}

function statusBadgeClass(status: ReportStatus): string {
  switch (status) {
    case "OPEN":
      return "bg-[#FFFBEB] text-[#D97706]";
    case "RESOLVED":
      return "bg-[#ECFDF5] text-[#059669]";
    case "DISMISSED":
      return "bg-[#F1F5F9] text-[#64748B]";
    default:
      return "bg-[#F1F5F9] text-[#64748B]";
  }
}

export function AdminReportsTable({ reports }: AdminReportsTableProps) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("open");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const counts = useMemo(
    () => ({
      all: reports.length,
      open: reports.filter((item) => item.status === "OPEN").length,
      resolved: reports.filter((item) => item.status === "RESOLVED").length,
      dismissed: reports.filter((item) => item.status === "DISMISSED").length,
    }),
    [reports],
  );

  const filtered = useMemo(
    () =>
      reports.filter((report) => {
        const matchesStatus = statusMatches(report.status, statusFilter);
        const matchesType = typeFilter === "all" || report.targetType === typeFilter;
        return matchesStatus && matchesType;
      }),
    [reports, statusFilter, typeFilter],
  );

  async function handleAction(reportId: string, action: "resolve" | "dismiss") {
    setPendingId(reportId);
    setErrorMessage("");

    try {
      await updateReportStatusRequest(reportId, action);
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Не удалось обновить жалобу");
    } finally {
      setPendingId(null);
    }
  }

  if (reports.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[rgba(148,163,184,0.25)] bg-white px-6 py-12 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#FEF2F2] text-[#DC2626]">
          <Flag className="size-6" aria-hidden="true" />
        </div>
        <p className="mt-5 text-base font-semibold text-[#0F172A]">Жалоб пока нет</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-[#64748B]">
          Новые жалобы на объявления и продавцов появятся здесь.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {errorMessage ? (
        <div
          className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]"
          role="alert"
        >
          {errorMessage}
        </div>
      ) : null}

      <Tabs
        value={statusFilter}
        onValueChange={(value) => setStatusFilter(value as StatusFilter)}
      >
        <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white p-1">
          {STATUS_FILTERS.map((filter) => (
            <TabsTrigger
              key={filter.value}
              value={filter.value}
              className="shrink-0 rounded-xl px-3 py-2 text-xs data-[state=active]:bg-[#EFF6FF] data-[state=active]:text-[#2563EB] sm:text-sm"
            >
              {filter.label}
              <span className="ml-1.5 text-[#94A3B8]">({counts[filter.value]})</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap gap-2">
        {TYPE_FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setTypeFilter(filter.value)}
            className={cn(
              "inline-flex h-9 items-center rounded-full px-3.5 text-sm font-medium transition",
              typeFilter === filter.value
                ? "bg-[#2563EB] text-white"
                : "bg-white text-[#475569] ring-1 ring-slate-200 hover:ring-[#2563EB]/35",
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[rgba(148,163,184,0.25)] bg-white px-6 py-10 text-center">
          <Package className="mx-auto size-6 text-[#94A3B8]" aria-hidden="true" />
          <p className="mt-3 text-sm text-[#64748B]">В этом фильтре жалоб нет.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((report) => {
            const canAct = report.status === "OPEN";
            const objectHref = report.listingId
              ? `/listings/${report.listingId}`
              : report.sellerId
                ? `/seller/${report.sellerId}`
                : null;

            return (
              <article
                key={report.id}
                className="rounded-3xl border border-[rgba(148,163,184,0.18)] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] sm:p-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                      statusBadgeClass(report.status),
                    )}
                  >
                    {getReportStatusLabel(report.status)}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-[#F1F5F9] px-2.5 py-0.5 text-[11px] font-medium text-[#475569]">
                    {report.targetType === "listing" ? "Объявление" : "Продавец"}
                  </span>
                  {report.listingVertical ? (
                    <VerticalListingBadge vertical={report.listingVertical} />
                  ) : null}
                </div>

                <h3 className="mt-3 text-base font-semibold text-[#0F172A]">
                  {getReportReasonLabel(report.reason)}
                </h3>

                {report.comment ? (
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#475569]">
                    {report.comment}
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-[#94A3B8]">Без комментария</p>
                )}

                <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-[#64748B]">Объект</dt>
                    <dd className="font-medium text-[#0F172A]">
                      {report.listingTitle ?? report.sellerName ?? "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#64748B]">Кто пожаловался</dt>
                    <dd className="font-medium text-[#0F172A]">{report.reporterName ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-[#64748B]">Дата</dt>
                    <dd className="font-medium text-[#0F172A]">
                      {new Date(report.created_at).toLocaleString("ru-RU")}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 flex flex-col gap-2 border-t border-[rgba(148,163,184,0.14)] pt-4 sm:flex-row sm:flex-wrap">
                  {objectHref ? (
                    <Button
                      variant="outline"
                      asChild
                      className="h-11 w-full rounded-xl border-[rgba(148,163,184,0.25)] sm:w-auto"
                    >
                      <Link href={objectHref}>Открыть</Link>
                    </Button>
                  ) : null}
                  {report.sellerUserId ? (
                    <Button
                      variant="outline"
                      asChild
                      className="h-11 w-full rounded-xl border-[rgba(148,163,184,0.25)] sm:w-auto"
                    >
                      <Link href={`/admin/users#user-${report.sellerUserId}`}>
                        Открыть пользователя
                      </Link>
                    </Button>
                  ) : null}
                  {canAct ? (
                    <>
                      <Button
                        type="button"
                        disabled={pendingId === report.id}
                        onClick={() => void handleAction(report.id, "resolve")}
                        className="h-11 w-full rounded-xl bg-[#059669] hover:bg-[#047857] sm:flex-1"
                      >
                        Отметить рассмотренной
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={pendingId === report.id}
                        onClick={() => void handleAction(report.id, "dismiss")}
                        className="h-11 w-full rounded-xl border-[#FECACA] bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2] sm:flex-1"
                      >
                        Отклонить жалобу
                      </Button>
                    </>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
