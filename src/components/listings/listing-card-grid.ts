import { cn } from "@/lib/utils";

/** Dense public listing card grid — marketplace / Wildberries-style density. */
export const LISTING_CARD_GRID_CLASS = cn(
  "grid w-full min-w-0 grid-cols-2 gap-2",
  "max-[339px]:grid-cols-1",
  "sm:gap-2",
  "md:grid-cols-4 md:gap-2.5",
  "lg:grid-cols-5 lg:gap-2.5",
  "xl:grid-cols-6 xl:gap-3",
  "2xl:grid-cols-6",
);

/** Home showcase — one extra column on large screens. */
export const LISTING_CARD_GRID_HOME_CLASS = cn(
  "grid w-full min-w-0 grid-cols-2 gap-2",
  "max-[339px]:grid-cols-1",
  "sm:gap-2",
  "md:grid-cols-4 md:gap-2.5",
  "lg:grid-cols-5 lg:gap-2.5",
  "xl:grid-cols-6 xl:gap-3",
  "2xl:grid-cols-7",
);

/** Seller/company profile column — narrower content area. */
export const LISTING_CARD_GRID_PROFILE_CLASS = cn(
  "grid w-full min-w-0 grid-cols-2 gap-2",
  "max-[339px]:grid-cols-1",
  "sm:gap-2",
  "md:grid-cols-3 md:gap-2.5",
  "lg:grid-cols-4 lg:gap-2.5",
  "2xl:grid-cols-4",
);
