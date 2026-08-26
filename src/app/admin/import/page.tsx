import { Download } from "lucide-react";
import { ImportByUrlForm } from "@/components/admin/ImportByUrlForm";
import { ImportDraftCreateForm } from "@/components/admin/ImportDraftCreateForm";
import { ImportDraftsTable } from "@/components/admin/ImportDraftsTable";
import { getImportCategoryOptions } from "@/features/import-drafts/lib/get-import-category-options";
import { serializeImportDraft } from "@/features/import-drafts/lib/import-draft-serializer";
import { PageHeader, PageHeaderContent } from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";
import { prisma } from "@/shared/lib/prisma";

export default async function AdminImportPage() {
  const [drafts, categories] = await Promise.all([
    prisma.importedListingDraft.findMany({
      orderBy: { created_at: "desc" },
      take: 200,
    }),
    getImportCategoryOptions(),
  ]);

  const rows = drafts.map((draft) => serializeImportDraft(draft));

  return (
    <div className="space-y-6">
      <PageHeader>
        <PageHeaderContent>
          <PageTitle className="flex items-center gap-2">
            <Download className="h-6 w-6 text-[#2563EB]" />
            Импорт объявлений
          </PageTitle>
          <PageSubtitle>
            Импорт по ссылке с автозаполнением или ручной черновик с проверкой перед публикацией.
          </PageSubtitle>
        </PageHeaderContent>
      </PageHeader>

      <ImportByUrlForm />
      <ImportDraftCreateForm categories={categories} />
      <ImportDraftsTable drafts={rows} />
    </div>
  );
}
