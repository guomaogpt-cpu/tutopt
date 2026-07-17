import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  SELLER_LISTINGS_PER_PAGE,
  buildSellerListingsQueryString,
  type SellerListingsFilters,
} from "@/features/sellers/lib/seller-listings";
import { Button } from "@/components/ui/button";

type SellerListingsPaginationProps = {
  filters: SellerListingsFilters;
  totalCount: number;
};

export function SellerListingsPagination({
  filters,
  totalCount,
}: SellerListingsPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / SELLER_LISTINGS_PER_PAGE));

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Пагинация объявлений"
      className="mt-6 flex items-center justify-center gap-3"
    >
      <Button
        asChild={filters.page > 1}
        variant="outline"
        disabled={filters.page <= 1}
        className="h-10 gap-1 rounded-xl border-[rgba(148,163,184,0.25)] bg-white"
      >
        {filters.page > 1 ? (
          <Link
            href={`/seller/listings${buildSellerListingsQueryString(filters, { page: filters.page - 1 })}`}
            aria-label="Предыдущая страница"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            Назад
          </Link>
        ) : (
          <span>
            <ChevronLeft className="size-4" aria-hidden="true" />
            Назад
          </span>
        )}
      </Button>

      <span className="text-sm text-[#64748B]">
        Страница <span className="font-medium text-[#0F172A]">{filters.page}</span> из{" "}
        {totalPages}
      </span>

      <Button
        asChild={filters.page < totalPages}
        variant="outline"
        disabled={filters.page >= totalPages}
        className="h-10 gap-1 rounded-xl border-[rgba(148,163,184,0.25)] bg-white"
      >
        {filters.page < totalPages ? (
          <Link
            href={`/seller/listings${buildSellerListingsQueryString(filters, { page: filters.page + 1 })}`}
            aria-label="Следующая страница"
          >
            Вперёд
            <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        ) : (
          <span>
            Вперёд
            <ChevronRight className="size-4" aria-hidden="true" />
          </span>
        )}
      </Button>
    </nav>
  );
}
