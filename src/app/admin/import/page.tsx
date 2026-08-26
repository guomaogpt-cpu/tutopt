import { Download } from "lucide-react";
import { ImportDraftCreateForm } from "@/components/admin/ImportDraftCreateForm";
import { ImportDraftsTable } from "@/components/admin/ImportDraftsTable";
import { serializeImportDraft } from "@/features/import-drafts/lib/import-draft-serializer";
import { PageHeader, PageHeaderContent } from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";
import { prisma } from "@/shared/lib/prisma";

export default async function AdminImportPage() {
  const drafts = await prisma.importedListingDraft.findMany({
    orderBy: { created_at: "desc" },
    take: 200,
  });

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
            Безопасный ручной импорт из внешних источников с проверкой перед публикацией.
          </PageSubtitle>
        </PageHeaderContent>
      </PageHeader>

      <ImportDraftCreateForm />
      <ImportDraftsTable drafts={rows} />
    </div>
  );
}
