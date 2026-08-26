import { requireStaff } from "@/features/admin/lib/require-admin";
import { publishImportDraft } from "@/features/import-drafts/lib/publish-import-draft";
import { serializeImportDraft } from "@/features/import-drafts/lib/import-draft-serializer";
import { createAuditLog } from "@/lib/audit/audit-log";
import { jsonData, withApiHandler } from "@/shared/lib/api-route";
import { prisma } from "@/shared/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  return withApiHandler(async () => {
    const staff = await requireStaff();
    const { id } = await context.params;

    const result = await publishImportDraft({ draftId: id, staff });

    const draft = await prisma.importedListingDraft.findUniqueOrThrow({
      where: { id: result.draftId },
    });

    await createAuditLog({
      actorId: staff.id,
      actorRole: staff.role,
      action: "import_draft.publish",
      targetType: "listing",
      targetId: result.listingId,
      metadata: {
        draft_id: result.draftId,
      },
    });

    return jsonData({
      draft: serializeImportDraft(draft),
      listingId: result.listingId,
    });
  });
}
