import Link from "next/link";
import { Layers } from "lucide-react";
import { ImportQueueStatusBadge } from "@/components/admin/ImportQueueStatusBadge";
import { Button } from "@/components/ui/button";
import type { ImportBatchRow } from "@/features/import-batches/types/import-batch";

type ImportBatchesListProps = {
  batches: ImportBatchRow[];
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function ImportBatchesList({ batches }: ImportBatchesListProps) {
  if (batches.length === 0) {
    return null;
  }

  return (
    <div className="rounded-[20px] border border-[rgba(148,163,184,0.18)] bg-white shadow-[0_4px_16px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-[rgba(148,163,184,0.18)] px-5 py-4 dark:border-slate-800">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-[#0F172A] dark:text-slate-100">
          <Layers className="h-5 w-5 text-[#2563EB]" />
          Последние массовые импорты
        </h2>
      </div>

      <div className="overflow-x-auto p-5">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[rgba(148,163,184,0.18)] text-[#64748B] dark:border-slate-800">
              <th className="px-2 py-3 font-medium">Создан</th>
              <th className="px-2 py-3 font-medium">Всего</th>
              <th className="px-2 py-3 font-medium">Готово</th>
              <th className="px-2 py-3 font-medium">Ожидает</th>
              <th className="px-2 py-3 font-medium">Ошибки</th>
              <th className="px-2 py-3 font-medium">Дубли</th>
              <th className="px-2 py-3 font-medium">Действия</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch) => (
              <tr key={batch.id} className="border-b border-[rgba(148,163,184,0.12)] dark:border-slate-800">
                <td className="px-2 py-3 whitespace-nowrap">{formatDate(batch.createdAt)}</td>
                <td className="px-2 py-3">{batch.totalCount}</td>
                <td className="px-2 py-3">
                  <ImportQueueStatusBadge status="SUCCESS" />
                  <span className="ml-2">{batch.successCount}</span>
                </td>
                <td className="px-2 py-3">{batch.pendingCount}</td>
                <td className="px-2 py-3">{batch.failedCount}</td>
                <td className="px-2 py-3">{batch.duplicateCount}</td>
                <td className="px-2 py-3">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/import/batches/${batch.id}`}>Открыть</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
