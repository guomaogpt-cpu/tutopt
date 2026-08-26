import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ImportDraftDetailPanel } from "@/components/admin/ImportDraftDetailPanel";
import { getImportCategoryOptions } from "@/features/import-drafts/lib/get-import-category-options";
import { serializeImportDraft } from "@/features/import-drafts/lib/import-draft-serializer";
import { Button } from "@/components/ui/button";
import { prisma } from "@/shared/lib/prisma";

type AdminImportDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ batchId?: string }>;
};

export default async function AdminImportDetailPage({
  params,
  searchParams,
}: AdminImportDetailPageProps) {
  const { id } = await params;
  const { batchId } = await searchParams;

  const [draft, categories, nextDraftId] = await Promise.all([
    prisma.importedListingDraft.findUnique({ where: { id } }),
    getImportCategoryOptions(),
    findNextDraftId(id, batchId),
  ]);

  if (!draft) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost" className="px-0">
          <Link href={batchId ? `/admin/import?batchId=${batchId}` : "/admin/import"}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к импорту
          </Link>
        </Button>

        {nextDraftId ? (
          <Button asChild variant="outline">
            <Link
              href={
                batchId
                  ? `/admin/import/${nextDraftId}?batchId=${batchId}`
                  : `/admin/import/${nextDraftId}`
              }
            >
              Следующий черновик
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : null}
      </div>

      <ImportDraftDetailPanel draft={serializeImportDraft(draft)} categories={categories} />
    </div>
  );
}

async function findNextDraftId(currentDraftId: string, batchId?: string): Promise<string | null> {
  if (batchId) {
    const items = await prisma.importQueueItem.findMany({
      where: {
        batch_id: batchId,
        status: "SUCCESS",
        draft_id: { not: null },
      },
      orderBy: { created_at: "asc" },
      select: { draft_id: true },
    });

    const draftIds = items
      .map((item) => item.draft_id)
      .filter((value): value is string => Boolean(value));
    const currentIndex = draftIds.indexOf(currentDraftId);
    if (currentIndex >= 0 && currentIndex < draftIds.length - 1) {
      return draftIds[currentIndex + 1] ?? null;
    }
    return null;
  }

  const nextDraft = await prisma.importedListingDraft.findFirst({
    where: {
      id: { not: currentDraftId },
      status: { in: ["READY", "PENDING_REVIEW"] },
    },
    orderBy: { created_at: "desc" },
    select: { id: true },
  });

  return nextDraft?.id ?? null;
}
