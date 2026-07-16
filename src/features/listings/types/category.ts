import type { ListingVertical } from "@prisma/client";

export type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  icon?: string | null;
  vertical: ListingVertical;
};
