import { Suspense } from "react";
import { Download } from "lucide-react";
import { BrowserPageImportForm } from "@/components/admin/BrowserPageImportForm";
import { BulkImportForm } from "@/components/admin/BulkImportForm";
import { ImportBatchesList } from "@/components/admin/ImportBatchesList";
import { ImportByUrlForm } from "@/components/admin/ImportByUrlForm";
import { ImportDraftCreateForm } from "@/components/admin/ImportDraftCreateForm";
import { ImportDraftsTable } from "@/components/admin/ImportDraftsTable";
import { getImportCategoryOptions } from "@/features/import-drafts/lib/get-import-category-options";
import { serializeImportDraft } from "@/features/import-drafts/lib/import-draft-serializer";
import { serializeImportBatch } from "@/features/import-batches/lib/import-batch-serializer";
import { PageHeader, PageHeaderContent } from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";
import { prisma } from "@/shared/lib/prisma";

type AdminImportPageProps = {
  searchParams: Promise<{
    status?: string;
    batchId?: string;
  }>;
};

export default async function AdminImportPage({ searchParams }: AdminImportPageProps) {
  const { status, batchId } = await searchParams;

  const [drafts, categories, batches, batchDraftIds] = await Promise.all([
    prisma.importedListingDraft.findMany({
      orderBy: { created_at: "desc" },
      take: 200,
    }),
    getImportCategoryOptions(),
    prisma.importBatch.findMany({
      orderBy: { created_at: "desc" },
      take: 10,
    }),
    batchId
      ? prisma.importQueueItem.findMany({
          where: {
            batch_id: batchId,
            draft_id: { not: null },
          },
          select: { draft_id: true },
        })
      : Promise.resolve([]),
  ]);

  let rows = drafts.map((draft) => serializeImportDraft(draft));

  if (batchId && batchDraftIds.length > 0) {
    const allowedIds = new Set(
      batchDraftIds.map((item) => item.draft_id).filter((id): id is string => Boolean(id)),
    );
    rows = rows.filter((draft) => allowedIds.has(draft.id));
  }

  if (status === "READY") {
    rows = rows.filter((draft) => draft.status === "READY");
  } else if (status === "FAILED") {
    rows = rows.filter((draft) => draft.status === "FAILED");
  } else if (status === "DUPLICATE") {
    rows = rows.filter((draft) => draft.status === "DUPLICATE");
  } else if (status === "PUBLISHED") {
    rows = rows.filter((draft) => draft.status === "PUBLISHED");
  }

  const readyCount = drafts.filter((draft) => draft.status === "READY").length;

  return (
    <div className="space-y-6">
      <PageHeader>
        <PageHeaderContent>
          <PageTitle className="flex items-center gap-2">
            <Download className="h-6 w-6 text-[#2563EB]" />
            Импорт объявлений
          </PageTitle>
          <PageSubtitle>
            Импорт по ссылке, массовая очередь или ручной черновик с проверкой перед публикацией.
            {readyCount > 0 ? ` Готово к проверке: ${readyCount}.` : ""}
          </PageSubtitle>
        </PageHeaderContent>
      </PageHeader>

      <ImportByUrlForm />
      <Suspense fallback={null}>
        <BrowserPageImportForm />
      </Suspense>
      <BulkImportForm />
      <ImportBatchesList batches={batches.map(serializeImportBatch)} />
      <ImportDraftCreateForm categories={categories} />
      <ImportDraftsTable
        drafts={rows}
        initialFilter={mapStatusFilter(status)}
        batchId={batchId ?? null}
      />
    </div>
  );
}

function mapStatusFilter(
  status: string | undefined,
): "all" | "ready" | "errors" | "duplicates" | "published" | "drafts" {
  switch (status) {
    case "READY":
      return "ready";
    case "FAILED":
      return "errors";
    case "DUPLICATE":
      return "duplicates";
    case "PUBLISHED":
      return "published";
    default:
      return "all";
  }
}
