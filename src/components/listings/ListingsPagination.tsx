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
      <PaginationContent>
        {filters.page > 1 ? (
          <PaginationItem>
            <Button variant="outline" size="default" className="gap-1 pl-2.5" asChild>
              <Link
                href={`/listings${buildListingsCatalogQueryString(filters, { page: filters.page - 1 })}`}
                aria-label="Предыдущая страница"
              >
                <ChevronLeft className="size-4" />
                <span>Назад</span>
              </Link>
            </Button>
          </PaginationItem>
        ) : null}

        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <span
                aria-hidden
                className="flex size-10 items-center justify-center text-muted-foreground"
              >
                <MoreHorizontal className="size-4" />
              </span>
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <Button
                variant={page === filters.page ? "outline" : "ghost"}
                size="icon"
                className="min-w-10"
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
            <Button variant="outline" size="default" className="gap-1 pr-2.5" asChild>
              <Link
                href={`/listings${buildListingsCatalogQueryString(filters, { page: filters.page + 1 })}`}
                aria-label="Следующая страница"
              >
                <span>Вперёд</span>
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
