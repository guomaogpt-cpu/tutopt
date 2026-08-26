import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ImportDraftDetailPanel } from "@/components/admin/ImportDraftDetailPanel";
import { getImportCategoryOptions } from "@/features/import-drafts/lib/get-import-category-options";
import { serializeImportDraft } from "@/features/import-drafts/lib/import-draft-serializer";
import { Button } from "@/components/ui/button";
import { prisma } from "@/shared/lib/prisma";

type AdminImportDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminImportDetailPage({ params }: AdminImportDetailPageProps) {
  const { id } = await params;

  const [draft, categories] = await Promise.all([
    prisma.importedListingDraft.findUnique({ where: { id } }),
    getImportCategoryOptions(),
  ]);

  if (!draft) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="px-0">
        <Link href="/admin/import">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад к импорту
        </Link>
      </Button>

      <ImportDraftDetailPanel draft={serializeImportDraft(draft)} categories={categories} />
    </div>
  );
}
