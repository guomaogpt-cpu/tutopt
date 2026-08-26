"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ExternalLink, Play, RefreshCw } from "lucide-react";
import { ImportQueueStatusBadge } from "@/components/admin/ImportQueueStatusBadge";
import { Button } from "@/components/ui/button";
import type { ImportBatchDetail } from "@/features/import-batches/types/import-batch";

type ImportBatchPanelProps = {
  batch: ImportBatchDetail;
};

type ApiErrorBody = {
  error?: {
    message?: string;
  };
};

function formatDate(value: string | null): string {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function ImportBatchPanel({ batch: initialBatch }: ImportBatchPanelProps) {
  const router = useRouter();
  const [batch, setBatch] = useState(initialBatch);
  const [isProcessing, setIsProcessing] = useState(false);
  const [busyItemId, setBusyItemId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const processedCount =
    batch.successCount + batch.failedCount + batch.duplicateCount + batch.skippedCount;
  const progressPercent =
    batch.totalCount > 0 ? Math.round((processedCount / batch.totalCount) * 100) : 0;
  const hasPending = batch.pendingCount > 0 || batch.processingCount > 0;

  const readyDraftIds = useMemo(
    () =>
      batch.items
        .filter((item) => item.status === "SUCCESS" && item.draftId)
        .map((item) => item.draftId as string),
    [batch.items],
  );

  async function handleProcess() {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/admin/import/batches/${batch.id}/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const body = (await response.json()) as ApiErrorBody & {
        data?: { batch?: ImportBatchDetail };
      };

      if (!response.ok) {
        throw new Error(body.error?.message ?? "Не удалось обработать очередь");
      }

      if (body.data?.batch) {
        setBatch(body.data.batch);
      }

      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Не удалось обработать очередь");
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleItemAction(itemId: string, action: "retry" | "skip") {
    setBusyItemId(itemId);
    setErrorMessage(null);

    try {
      const response = await fetch(
        `/api/admin/import/batches/${batch.id}/items/${itemId}/${action}`,
        { method: "POST" },
      );

      const body = (await response.json()) as ApiErrorBody;

      if (!response.ok) {
        throw new Error(body.error?.message ?? "Не удалось выполнить действие");
      }

      const refreshResponse = await fetch(`/api/admin/import/batches/${batch.id}`);
      const refreshBody = (await refreshResponse.json()) as {
        data?: { batch?: ImportBatchDetail };
      };

      if (refreshBody.data?.batch) {
        setBatch(refreshBody.data.batch);
      }

      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Не удалось выполнить действие");
    } finally {
      setBusyItemId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[20px] border border-[rgba(148,163,184,0.18)] bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#0F172A] dark:text-slate-100">
              Очередь импорта
            </h1>
            <p className="mt-1 text-sm text-[#64748B]">
              Создана {formatDate(batch.createdAt)}
              {batch.sourcePlatform ? ` · ${batch.sourcePlatform}` : " · Auto detect"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {hasPending ? (
              <Button disabled={isProcessing} onClick={handleProcess}>
                <Play className="mr-2 h-4 w-4" />
                {isProcessing ? "Обрабатываем..." : "Обработать следующие"}
              </Button>
            ) : null}
            {readyDraftIds.length > 0 ? (
              <Button asChild variant="outline">
                <Link href={`/admin/import?batchId=${batch.id}&status=READY`}>
                  Открыть готовые черновики
                </Link>
              </Button>
            ) : null}
            {readyDraftIds[0] ? (
              <Button asChild variant="outline">
                <Link href={`/admin/import/${readyDraftIds[0]}?batchId=${batch.id}`}>
                  Проверить первый черновик
                </Link>
              </Button>
            ) : null}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <SummaryCard label="Всего" value={batch.totalCount} />
          <SummaryCard label="Ожидает" value={batch.pendingCount} />
          <SummaryCard label="Готово" value={batch.successCount} tone="success" />
          <SummaryCard label="Ошибки" value={batch.failedCount} tone="failed" />
          <SummaryCard label="Дубли" value={batch.duplicateCount} tone="duplicate" />
          <SummaryCard label="Пропущено" value={batch.skippedCount} />
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-sm text-[#64748B]">
            <span>Прогресс</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#E2E8F0] dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-[#2563EB] transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {errorMessage ? (
          <p className="mt-4 text-sm text-[#DC2626]" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>

      <div className="rounded-[20px] border border-[rgba(148,163,184,0.18)] bg-white shadow-[0_4px_16px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto p-5">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[rgba(148,163,184,0.18)] text-[#64748B] dark:border-slate-800">
                <th className="px-2 py-3 font-medium">URL</th>
                <th className="px-2 py-3 font-medium">Источник</th>
                <th className="px-2 py-3 font-medium">Статус</th>
                <th className="px-2 py-3 font-medium">Черновик</th>
                <th className="px-2 py-3 font-medium">Ошибка</th>
                <th className="px-2 py-3 font-medium">Обработано</th>
                <th className="px-2 py-3 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {batch.items.map((item) => {
                const draftId = item.draftId ?? item.duplicateDraftId;

                return (
                  <tr
                    key={item.id}
                    className="border-b border-[rgba(148,163,184,0.12)] dark:border-slate-800"
                  >
                    <td className="px-2 py-3">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex max-w-[280px] items-start gap-1 break-all text-[#2563EB] hover:underline"
                      >
                        <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        {item.url}
                      </a>
                    </td>
                    <td className="px-2 py-3">{item.sourcePlatform}</td>
                    <td className="px-2 py-3">
                      <ImportQueueStatusBadge status={item.status} />
                    </td>
                    <td className="px-2 py-3">
                      {draftId ? (
                        <Link
                          href={`/admin/import/${draftId}?batchId=${batch.id}`}
                          className="text-[#2563EB] hover:underline"
                        >
                          Открыть
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-2 py-3 text-[#64748B]">{item.errorMessage ?? "—"}</td>
                    <td className="px-2 py-3 whitespace-nowrap text-[#64748B]">
                      {formatDate(item.processedAt)}
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex flex-wrap gap-1">
                        {item.status === "FAILED" || item.status === "SKIPPED" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busyItemId === item.id}
                            onClick={() => handleItemAction(item.id, "retry")}
                          >
                            <RefreshCw className="mr-1 h-3.5 w-3.5" />
                            Повторить
                          </Button>
                        ) : null}
                        {item.status === "PENDING" || item.status === "FAILED" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busyItemId === item.id}
                            onClick={() => handleItemAction(item.id, "skip")}
                          >
                            Пропустить
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "success" | "failed" | "duplicate";
}) {
  const toneClass =
    tone === "success"
      ? "text-emerald-600"
      : tone === "failed"
        ? "text-red-600"
        : tone === "duplicate"
          ? "text-amber-600"
          : "text-[#0F172A] dark:text-slate-100";

  return (
    <div className="rounded-xl border border-[rgba(148,163,184,0.18)] px-3 py-2 dark:border-slate-800">
      <p className="text-xs text-[#64748B]">{label}</p>
      <p className={`text-xl font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
}
