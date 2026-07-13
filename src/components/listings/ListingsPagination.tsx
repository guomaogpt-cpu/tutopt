import Link from "next/link";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import {
  LISTINGS_PER_PAGE,
  buildListingsCatalogQueryString,
  type ListingsCatalogFilters,
} from "@/features/listings/lib/listings-catalog";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

type ListingsPaginationProps = {
  filters: ListingsCatalogFilters;
  totalCount: number;
};

export function ListingsPagination({ filters, totalCount }: ListingsPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / LISTINGS_PER_PAGE));

  if (totalPages <= 1) {
    return null;
  }

  const pages = getPaginationRange(filters.page, totalPages);

  return (
    <Pagination aria-label="Пагинация каталога" className="mt-8">
      <PaginationContent className="flex-wrap gap-1 sm:gap-2">
        {filters.page > 1 ? (
          <PaginationItem>
            <Button
              variant="outline"
              size="default"
              className="h-9 gap-1 rounded-xl border-[rgba(148,163,184,0.25)] bg-white pl-2.5 pr-3"
              asChild
            >
              <Link
                href={`/listings${buildListingsCatalogQueryString(filters, { page: filters.page - 1 })}`}
                aria-label="Предыдущая страница"
              >
                <ChevronLeft className="size-4" />
                <span className="hidden sm:inline">Назад</span>
              </Link>
            </Button>
          </PaginationItem>
        ) : null}

        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <span
                aria-hidden
                className="flex size-9 items-center justify-center text-muted-foreground sm:size-10"
              >
                <MoreHorizontal className="size-4" />
              </span>
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <Button
                variant={page === filters.page ? "outline" : "ghost"}
                size="icon"
                className={cn(
                  "size-9 min-w-9 rounded-xl sm:size-10 sm:min-w-10",
                  page === filters.page && "border-[#2563EB]/30 bg-[#EFF6FF] text-[#2563EB]",
                )}
                asChild
              >
                <Link
                  href={`/listings${buildListingsCatalogQueryString(filters, { page })}`}
                  aria-current={page === filters.page ? "page" : undefined}
                >
                  {page}
                </Link>
              </Button>
            </PaginationItem>
          ),
        )}

        {filters.page < totalPages ? (
          <PaginationItem>
            <Button
              variant="outline"
              size="default"
              className="h-9 gap-1 rounded-xl border-[rgba(148,163,184,0.25)] bg-white pl-3 pr-2.5"
              asChild
            >
              <Link
                href={`/listings${buildListingsCatalogQueryString(filters, { page: filters.page + 1 })}`}
                aria-label="Следующая страница"
              >
                <span className="hidden sm:inline">Вперёд</span>
                <ChevronRight className="size-4" />
              </Link>
            </Button>
          </PaginationItem>
        ) : null}
      </PaginationContent>
    </Pagination>
  );
}

function getPaginationRange(
  currentPage: number,
  totalPages: number,
): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: Array<number | "ellipsis"> = [1];

  if (currentPage > 3) {
    pages.push("ellipsis");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (currentPage < totalPages - 2) {
    pages.push("ellipsis");
  }

  pages.push(totalPages);
  return pages;
}
