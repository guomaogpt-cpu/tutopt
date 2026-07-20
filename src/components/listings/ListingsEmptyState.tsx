import Link from "next/link";
import type { ListingVertical } from "@prisma/client";
import { SearchX } from "lucide-react";
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
      icon={SearchX}
      title={hasActiveFilters ? "Ничего не найдено" : copy.emptyTitle}
      description={
        hasActiveFilters
          ? "Попробуйте изменить запрос, выбрать другой город или сбросить фильтры."
          : copy.emptyDescription
      }
      className="mt-8 rounded-2xl border border-[rgba(148,163,184,0.16)] bg-white shadow-[0_4px_14px_rgba(15,23,42,0.03)]"
      action={
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          {hasActiveFilters ? (
            <Button
              variant="outline"
              className="h-11 rounded-xl border-[rgba(148,163,184,0.25)]"
              asChild
            >
              <Link href={vertical ? `/listings?vertical=${vertical}` : "/listings"}>
                Сбросить фильтры
              </Link>
            </Button>
          ) : null}
          {showCreateListingCTA ? (
            <Button className="h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8]" asChild>
              <Link href={createHref}>Добавить объявление</Link>
            </Button>
          ) : null}
        </div>
      }
    />
  );
}
