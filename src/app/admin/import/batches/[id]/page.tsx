import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ImportBatchPanel } from "@/components/admin/ImportBatchPanel";
import { getImportBatchDetail } from "@/features/import-batches/lib/process-import-batch";
import { Button } from "@/components/ui/button";

type AdminImportBatchPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminImportBatchPage({ params }: AdminImportBatchPageProps) {
  const { id } = await params;

  try {
    const batch = await getImportBatchDetail(id);

    return (
      <div className="space-y-6">
        <Button asChild variant="ghost" className="px-0">
          <Link href="/admin/import">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к импорту
          </Link>
        </Button>

        <ImportBatchPanel batch={batch} />
      </div>
    );
  } catch {
    notFound();
  }
}
