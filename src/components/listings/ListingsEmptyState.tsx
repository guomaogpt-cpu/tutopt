import Link from "next/link";
import type { ListingVertical } from "@prisma/client";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getCatalogVerticalCopy } from "@/features/listings/lib/listing-display";
import { VERTICALS } from "@/features/verticals/verticals";

type ListingsEmptyStateProps = {
  hasActiveFilters: boolean;
  createListingHref: string;
  showCreateListingCTA?: boolean;
  vertical?: ListingVertical | null;
};

export function ListingsEmptyState({
  hasActiveFilters,
  createListingHref,
  showCreateListingCTA = true,
  vertical = null,
}: ListingsEmptyStateProps) {
  const copy = getCatalogVerticalCopy(vertical);
  const createHref =
    vertical && !createListingHref.includes("vertical=")
      ? VERTICALS[vertical].createListingHref
      : createListingHref;

  return (
    <EmptyState
      icon={Package}
      title={hasActiveFilters ? "Объявления не найдены" : copy.emptyTitle}
      description={
        hasActiveFilters
          ? "Попробуйте изменить фильтры или поисковый запрос."
          : copy.emptyDescription
      }
      className="mt-8 rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white"
      action={
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          {hasActiveFilters ? (
            <Button variant="outline" className="rounded-xl" asChild>
              <Link href={vertical ? `/listings?vertical=${vertical}` : "/listings"}>
                Сбросить фильтры
              </Link>
            </Button>
          ) : null}
          {showCreateListingCTA ? (
            <Button className="rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8]" asChild>
              <Link href={createHref}>Подать объявление</Link>
            </Button>
          ) : null}
        </div>
      }
    />
  );
}
