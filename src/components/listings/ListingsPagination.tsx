import Link from "next/link";
import {
  LISTINGS_PER_PAGE,
  buildListingsCatalogQueryString,
  type ListingsCatalogFilters,
} from "@/features/listings/lib/listings-catalog";

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
    <nav
      aria-label="Пагинация каталога"
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
    >
      {filters.page > 1 ? (
        <PaginationLink filters={filters} page={filters.page - 1} label="Назад" />
      ) : null}

      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="px-2 text-sm text-slate-400">
            …
          </span>
        ) : (
          <PaginationLink
            key={page}
            filters={filters}
            page={page}
            label={String(page)}
            isActive={page === filters.page}
          />
        ),
      )}

      {filters.page < totalPages ? (
        <PaginationLink filters={filters} page={filters.page + 1} label="Вперёд" />
      ) : null}
    </nav>
  );
}

function PaginationLink({
  filters,
  page,
  label,
  isActive = false,
}: {
  filters: ListingsCatalogFilters;
  page: number;
  label: string;
  isActive?: boolean;
}) {
  const href = `/listings${buildListingsCatalogQueryString(filters, { page })}`;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`inline-flex min-w-10 items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium transition ${
        isActive
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
      }`}
    >
      {label}
    </Link>
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
