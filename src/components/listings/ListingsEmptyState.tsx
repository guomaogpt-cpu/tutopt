import Link from "next/link";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

type ListingsEmptyStateProps = {
  hasActiveFilters: boolean;
  createListingHref: string;
  showCreateListingCTA?: boolean;
};

export function ListingsEmptyState({
  hasActiveFilters,
  createListingHref,
  showCreateListingCTA = true,
}: ListingsEmptyStateProps) {
  return (
    <EmptyState
      icon={Package}
      title="Объявления не найдены"
      description={
        hasActiveFilters
          ? "Попробуйте изменить фильтры или поисковый запрос."
          : "Пока нет опубликованных объявлений. Станьте первым продавцом на платформе."
      }
      className="mt-8 rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white"
      action={
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          {hasActiveFilters ? (
            <Button variant="outline" className="rounded-xl" asChild>
              <Link href="/listings">Сбросить фильтры</Link>
            </Button>
          ) : null}
          {showCreateListingCTA ? (
            <Button className="rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8]" asChild>
              <Link href={createListingHref}>Подать объявление</Link>
            </Button>
          ) : null}
        </div>
      }
    />
  );
}
