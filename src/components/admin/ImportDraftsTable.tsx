"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { ImportDraftStatus } from "@prisma/client";
import { ExternalLink, Package } from "lucide-react";
import { ImportDraftStatusBadge } from "@/components/admin/ImportDraftStatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ImportDraftRow } from "@/features/import-drafts/types/import-draft";

type ImportDraftsTableProps = {
  drafts: ImportDraftRow[];
};

type DraftTab = "all" | "drafts" | "published" | "rejected";

function filterDrafts(drafts: ImportDraftRow[], tab: DraftTab): ImportDraftRow[] {
  switch (tab) {
    case "drafts":
      return drafts.filter((draft) =>
        ["PENDING_REVIEW", "READY"].includes(draft.status),
      );
    case "published":
      return drafts.filter((draft) => draft.status === "PUBLISHED");
    case "rejected":
      return drafts.filter((draft) =>
        ["REJECTED", "DUPLICATE", "FAILED"].includes(draft.status),
      );
    default:
      return drafts;
  }
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getPreviewImage(draft: ImportDraftRow): string | null {
  return draft.normalizedImages[0] ?? draft.rawImages[0] ?? null;
}

async function postDraftAction(draftId: string, action: "ready" | "reject" | "duplicate" | "publish") {
  const path =
    action === "publish"
      ? `/api/admin/import-drafts/${draftId}/publish`
      : `/api/admin/import-drafts/${draftId}/${action}`;

  const response = await fetch(path, {
    method: "POST",
    headers: action === "duplicate" ? { "Content-Type": "application/json" } : undefined,
    body: action === "duplicate" ? JSON.stringify({}) : undefined,
  });

  const body = (await response.json()) as {
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new Error(body.error?.message ?? "Не удалось выполнить действие");
  }
}

export function ImportDraftsTable({ drafts }: ImportDraftsTableProps) {
  const router = useRouter();
  const [tab, setTab] = useState<DraftTab>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filteredDrafts = useMemo(() => filterDrafts(drafts, tab), [drafts, tab]);

  async function handleAction(draftId: string, action: "ready" | "reject" | "duplicate" | "publish") {
    setBusyId(draftId);
    setErrorMessage(null);

    try {
      await postDraftAction(draftId, action);
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Не удалось выполнить действие");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="rounded-[20px] border border-[rgba(148,163,184,0.18)] bg-white shadow-[0_4px_16px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-[rgba(148,163,184,0.18)] px-5 py-4 dark:border-slate-800">
        <h2 className="text-lg font-semibold text-[#0F172A] dark:text-slate-100">Черновики</h2>
      </div>

      <Tabs value={tab} onValueChange={(value) => setTab(value as DraftTab)} className="p-5 pt-4">
        <TabsList className="mb-4 flex h-auto flex-wrap gap-1">
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="drafts">Черновики</TabsTrigger>
          <TabsTrigger value="published">Опубликованные</TabsTrigger>
          <TabsTrigger value="rejected">Отклонённые / Дубли</TabsTrigger>
        </TabsList>

        {errorMessage ? (
          <p className="mb-4 text-sm text-[#DC2626]" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <TabsContent value={tab} className="mt-0">
          {filteredDrafts.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center text-[#64748B]">
              <Package className="h-10 w-10 opacity-40" />
              <p>Черновики не найдены</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[rgba(148,163,184,0.18)] text-[#64748B] dark:border-slate-800">
                    <th className="px-2 py-3 font-medium">Фото</th>
                    <th className="px-2 py-3 font-medium">Название</th>
                    <th className="px-2 py-3 font-medium">Цена</th>
                    <th className="px-2 py-3 font-medium">Город</th>
                    <th className="px-2 py-3 font-medium">Источник</th>
                    <th className="px-2 py-3 font-medium">Статус</th>
                    <th className="px-2 py-3 font-medium">Создан</th>
                    <th className="px-2 py-3 font-medium">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDrafts.map((draft) => {
                    const preview = getPreviewImage(draft);
                    const title = draft.normalizedTitle ?? draft.rawTitle ?? "Без названия";
                    const priceLabel =
                      draft.normalizedPrice ?? draft.rawPrice
                        ? `${draft.normalizedPrice ?? draft.rawPrice} ${draft.normalizedCurrency ?? draft.rawCurrency ?? "KGS"}`
                        : "—";

                    return (
                      <tr
                        key={draft.id}
                        className="border-b border-[rgba(148,163,184,0.12)] dark:border-slate-800"
                      >
                        <td className="px-2 py-3">
                          {preview ? (
                            <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-[#F1F5F9]">
                              <Image
                                src={preview}
                                alt=""
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#F1F5F9]">
                              <Package className="h-5 w-5 text-[#94A3B8]" />
                            </div>
                          )}
                        </td>
                        <td className="px-2 py-3">
                          <div className="max-w-[220px]">
                            <Link
                              href={`/admin/import/${draft.id}`}
                              className="font-medium text-[#0F172A] hover:text-[#2563EB] dark:text-slate-100"
                            >
                              {title}
                            </Link>
                            {draft.sourceUrl ? (
                              <a
                                href={draft.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 flex items-center gap-1 text-xs text-[#64748B] hover:text-[#2563EB]"
                              >
                                <ExternalLink className="h-3 w-3" />
                                Источник
                              </a>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-2 py-3 whitespace-nowrap">{priceLabel}</td>
                        <td className="px-2 py-3">
                          {draft.normalizedCity ?? draft.rawCity ?? "—"}
                        </td>
                        <td className="px-2 py-3">{draft.sourcePlatform}</td>
                        <td className="px-2 py-3">
                          <ImportDraftStatusBadge status={draft.status as ImportDraftStatus} />
                        </td>
                        <td className="px-2 py-3 whitespace-nowrap text-[#64748B]">
                          {formatDate(draft.createdAt)}
                        </td>
                        <td className="px-2 py-3">
                          <div className="flex min-w-[220px] flex-wrap gap-1">
                            <Button asChild size="sm" variant="outline">
                              <Link href={`/admin/import/${draft.id}`}>Открыть</Link>
                            </Button>
                            {draft.status !== "PUBLISHED" ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={busyId === draft.id}
                                  onClick={() => handleAction(draft.id, "ready")}
                                >
                                  Готов
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={busyId === draft.id}
                                  onClick={() => handleAction(draft.id, "reject")}
                                >
                                  Отклонить
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={busyId === draft.id}
                                  onClick={() => handleAction(draft.id, "duplicate")}
                                >
                                  Дубль
                                </Button>
                                <Button
                                  size="sm"
                                  disabled={busyId === draft.id}
                                  onClick={() => handleAction(draft.id, "publish")}
                                >
                                  Опубликовать
                                </Button>
                              </>
                            ) : draft.publishedListingId ? (
                              <Button asChild size="sm" variant="outline">
                                <Link href={`/listings/${draft.publishedListingId}`}>
                                  Объявление
                                </Link>
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
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
