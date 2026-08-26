import { ImportQueueStatus } from "@prisma/client";
import { prisma } from "@/shared/lib/prisma";

export type ExistingImportUrlMatch = {
  isDuplicate: boolean;
  draftId: string | null;
  listingId: string | null;
  reason: string | null;
};

export async function findExistingImportForUrl(url: string): Promise<ExistingImportUrlMatch> {
  const existingDraft = await prisma.importedListingDraft.findFirst({
    where: { source_url: url },
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      published_listing_id: true,
      duplicate_of_listing_id: true,
    },
  });

  if (existingDraft) {
    return {
      isDuplicate: true,
      draftId: existingDraft.id,
      listingId:
        existingDraft.published_listing_id ?? existingDraft.duplicate_of_listing_id ?? null,
      reason: "Уже импортировано",
    };
  }

  const existingQueueItem = await prisma.importQueueItem.findFirst({
    where: {
      url,
      status: { in: [ImportQueueStatus.PENDING, ImportQueueStatus.PROCESSING, ImportQueueStatus.SUCCESS] },
    },
    orderBy: { created_at: "desc" },
    select: {
      draft_id: true,
      duplicate_draft_id: true,
      draft: {
        select: {
          published_listing_id: true,
          duplicate_of_listing_id: true,
        },
      },
    },
  });

  if (existingQueueItem) {
    const draftId = existingQueueItem.draft_id ?? existingQueueItem.duplicate_draft_id;
    return {
      isDuplicate: true,
      draftId,
      listingId:
        existingQueueItem.draft?.published_listing_id ??
        existingQueueItem.draft?.duplicate_of_listing_id ??
        null,
      reason: "Уже импортировано",
    };
  }

  return {
    isDuplicate: false,
    draftId: null,
    listingId: null,
    reason: null,
  };
}
