"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  CatalogFiltersPanel,
  type FilterDraft,
} from "@/components/listings/CatalogFiltersPanel";
import {
  getActiveFilterChips,
  type CatalogLookupMaps,
} from "@/features/listings/lib/catalog-active-filters";
import type { SelectOption } from "@/features/listings/constants";
import {
  buildListingsCatalogQueryString,
  hasActiveCatalogFilters,
  listingSortOptions,
  type ListingSort,
  type ListingsCatalogFilters,
} from "@/features/listings/lib/listings-catalog";

type ListingsCatalogToolbarProps = {
  filters: ListingsCatalogFilters;
  categories: SelectOption[];
  cities: SelectOption[];
  brands: SelectOption[];
  lookups: CatalogLookupMaps;
  totalCount: number;
};

const fieldClassName =
  "rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

export function ListingsCatalogToolbar({
  filters,
  categories,
  cities,
  brands,
  lookups,
  totalCount,
}: ListingsCatalogToolbarProps) {
  const router = useRouter();
  const filtersButtonRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(filters.q);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeChips = getActiveFilterChips(filters, lookups);
  const panelFiltersOnly = hasActiveCatalogFilters({
    ...filters,
    q: "",
    sort: filters.sort,
    page: filters.page,
  });

  useEffect(() => {
    setQuery(filters.q);
  }, [filters.q]);

  useEffect(() => {
    if (!filtersOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!filtersButtonRef.current?.contains(event.target as Node)) {
        setFiltersOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [filtersOpen]);

  useEffect(() => {
    const trimmed = query.trim();
    const current = filters.q.trim();

    if (trimmed === current) {
      return;
    }

    const timeout = window.setTimeout(() => {
      router.push(
        `/listings${buildListingsCatalogQueryString(filters, { q: trimmed, page: 1 })}`,
      );
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [query, filters, router]);

  function pushFilters(next: Partial<ListingsCatalogFilters>) {
    router.push(`/listings${buildListingsCatalogQueryString(filters, { ...next, page: 1 })}`);
  }

  function handleCatalogSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    pushFilters({ q: query.trim() });
  }

  function handleCatalogClear() {
    setQuery("");
    pushFilters({ q: "" });
  }

  function handleSortChange(value: string) {
    pushFilters({ sort: value as ListingSort });
  }

  function handleApplyFilters(draft: FilterDraft) {
    pushFilters({
      categoryId: draft.categoryId,
      cityId: draft.cityId,
      brandId: draft.brandId,
      priceMin: draft.priceMin,
      priceMax: draft.priceMax,
      withPhotos: draft.withPhotos,
    });
  }

  function handleResetFilters() {
    pushFilters({
      categoryId: "",
      cityId: "",
      brandId: "",
      priceMin: "",
      priceMax: "",
      withPhotos: false,
    });
  }

  const showClear = query.length > 0;

  return (
    <section className="space-y-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <form onSubmit={handleCatalogSubmit} className="min-w-0 flex-1">
            <label htmlFor="catalog-search" className="sr-only">
              Поиск товара
            </label>
            <div className="relative">
              <input
                id="catalog-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Поиск товара..."
                className={`w-full ${fieldClassName} py-2.5 pl-4 ${showClear ? "pr-20" : "pr-11"}`}
              />
              {showClear ? (
                <button
                  type="button"
                  onClick={handleCatalogClear}
                  aria-label="Очистить поиск"
                  className="absolute inset-y-0 right-10 inline-flex w-8 items-center justify-center text-slate-400 transition hover:text-slate-600"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : null}
              <button
                type="submit"
                aria-label="Искать"
                className="absolute inset-y-0 right-0 inline-flex w-10 items-center justify-center text-slate-500 transition hover:text-blue-600"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </form>

          <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
            <label className="sr-only" htmlFor="catalog-sort">
              Сортировка
            </label>
            <select
              id="catalog-sort"
              value={filters.sort}
              onChange={(event) => handleSortChange(event.target.value)}
              className={`min-w-[150px] flex-1 ${fieldClassName} lg:flex-none`}
            >
              {listingSortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div ref={filtersButtonRef} className="relative">
              <button
                type="button"
                onClick={() => setFiltersOpen((current) => !current)}
                aria-expanded={filtersOpen}
                className={`inline-flex items-center gap-2 ${fieldClassName} font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50/40`}
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                Фильтры
                {panelFiltersOnly ? (
                  <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    •
                  </span>
                ) : null}
              </button>

              <div className="md:relative">
                <CatalogFiltersPanel
                  open={filtersOpen}
                  onClose={() => setFiltersOpen(false)}
                  filters={filters}
                  categories={categories}
                  cities={cities}
                  brands={brands}
                  onApply={handleApplyFilters}
                  onReset={handleResetFilters}
                />
              </div>
            </div>
          </div>
        </div>

        <p className="mt-3 text-sm text-slate-600">
          Найдено: <span className="font-semibold text-slate-900">{totalCount}</span>
        </p>
      </div>

      {activeChips.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {activeChips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => pushFilters(chip.clearPatch)}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              <span>{chip.label}</span>
              <X className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              <span className="sr-only">Удалить фильтр</span>
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
