import Link from "next/link";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

type ListingsEmptyStateProps = {
  hasActiveFilters: boolean;
  createListingHref: string;
};

export function ListingsEmptyState({
  hasActiveFilters,
  createListingHref,
}: ListingsEmptyStateProps) {
  return (
    <EmptyState
      icon={Package}
      title="Объявления не найдены"
      description={
        hasActiveFilters
          ? "По выбранным фильтрам ничего не найдено. Попробуйте изменить параметры поиска или сбросить фильтры."
          : "Пока нет опубликованных объявлений. Станьте первым продавцом на платформе."
      }
      className="mt-8"
      action={
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href={createListingHref}>Подать объявление</Link>
          </Button>
          {hasActiveFilters ? (
            <Button variant="outline" asChild>
              <Link href="/listings">Сбросить фильтры</Link>
            </Button>
          ) : null}
        </div>
      }
    />
  );
}
