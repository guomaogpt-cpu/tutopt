import type { ListingStatus } from "@prisma/client";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";

export const listingStatusHintKeys: Partial<Record<ListingStatus, DictionaryKey>> = {
  PENDING_MODERATION: "status.hint.pendingModeration",
  REJECTED: "status.hint.rejected",
  PUBLISHED: "status.hint.published",
  DRAFT: "status.hint.draft",
  ARCHIVED: "status.hint.archived",
};
