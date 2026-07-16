"use client";

import { SlidersHorizontal, X } from "lucide-react";
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
import { catalogShowsBrandFilter } from "@/features/listings/lib/vertical-form-config";
import { VERTICAL_LIST } from "@/features/verticals/verticals";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { ListingVertical } from "@prisma/client";

type ListingsCatalogToolbarProps = {
  filters: ListingsCatalogFilters;
  categories: SelectOption[];
  cities: SelectOption[];
  brands: SelectOption[];
  lookups: CatalogLookupMaps;
  totalCount: number;
};

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

  const showBrandFilter = catalogShowsBrandFilter(filters.vertical);
  const activeChips = getActiveFilterChips(filters, lookups).filter(
    (chip) => showBrandFilter || chip.id !== "brand",
  );
  const panelFiltersOnly = hasActiveCatalogFilters({
    ...filters,
    q: "",
    sort: filters.sort,
    page: filters.page,
  });
  const hasFilters = hasActiveCatalogFilters(filters);

  useEffect(() => {
    setQuery(filters.q);
  }, [filters.q]);

  useEffect(() => {
    if (!filtersOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (window.matchMedia("(max-width: 767px)").matches) {
        return;
      }

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
      brandId: showBrandFilter ? draft.brandId : "",
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

  function handleResetAll() {
    setQuery("");
    router.push("/listings");
  }

  function handleVerticalChange(nextVertical: ListingVertical | null) {
    pushFilters({
      vertical: nextVertical,
      categoryId: "",
      brandId: "",
    });
  }

  return (
    <section className="space-y-3">
      <div
        className={cn(
          "rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white/95 p-3 shadow-sm backdrop-blur-sm sm:p-4",
        )}
      >
        <div
          className="mb-3 flex gap-1 overflow-x-auto pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          role="group"
          aria-label="Раздел объявлений"
        >
          <button
            type="button"
            onClick={() => handleVerticalChange(null)}
            className={cn(
              "h-7 shrink-0 rounded-full px-2.5 text-xs font-medium transition",
              filters.vertical === null
                ? "bg-blue-50 text-blue-700 ring-1 ring-[#2563EB]/40"
                : "bg-[#F8FAFC] text-[#64748B] ring-1 ring-[rgba(148,163,184,0.22)] hover:text-[#334155]",
            )}
          >
            Все
          </button>
          {VERTICAL_LIST.map((vertical) => {
            const isActive = filters.vertical === vertical.id;
            return (
              <button
                key={vertical.id}
                type="button"
                onClick={() => handleVerticalChange(vertical.id)}
                className={cn(
                  "h-7 shrink-0 rounded-full px-2.5 text-xs font-medium transition",
                  isActive
                    ? "bg-blue-50 text-blue-700 ring-1 ring-[#2563EB]/40"
                    : "bg-[#F8FAFC] text-[#64748B] ring-1 ring-[rgba(148,163,184,0.22)] hover:text-[#334155]",
                )}
              >
                {vertical.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <form onSubmit={handleCatalogSubmit} className="min-w-0 flex-1">
            <label htmlFor="catalog-search" className="sr-only">
              Поиск товара
            </label>
            <SearchInput
              id="catalog-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onClear={handleCatalogClear}
              placeholder="Найти товар..."
              containerClassName="w-full"
              className="h-11 rounded-xl bg-white"
            />
          </form>

          <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
            <Select value={filters.sort} onValueChange={handleSortChange}>
              <SelectTrigger
                className="h-11 min-w-[140px] flex-1 rounded-xl bg-white lg:w-[180px] lg:flex-none"
                aria-label="Сортировка"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {listingSortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div ref={filtersButtonRef} className="relative">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFiltersOpen((current) => !current)}
                aria-expanded={filtersOpen}
                className="h-11 gap-2 rounded-xl border-[rgba(148,163,184,0.25)] bg-white"
              >
                <SlidersHorizontal className="size-4" aria-hidden="true" />
                Фильтры
                {panelFiltersOnly ? (
                  <Badge variant="default" className="size-2 rounded-full p-0" aria-hidden="true">
                    <span className="sr-only">Есть активные фильтры</span>
                  </Badge>
                ) : null}
              </Button>

              <CatalogFiltersPanel
                open={filtersOpen}
                onClose={() => setFiltersOpen(false)}
                filters={filters}
                categories={categories}
                cities={cities}
                brands={brands}
                showBrandFilter={showBrandFilter}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
              />
            </div>
          </div>
        </div>

        <p className="mt-3 text-sm text-[#64748B]">
          Найдено:{" "}
          <span className="font-semibold text-[#0F172A]">{totalCount}</span>{" "}
          {totalCount === 1 ? "объявление" : totalCount < 5 ? "объявления" : "объявлений"}
        </p>
      </div>

      {activeChips.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <Button
              key={chip.id}
              type="button"
              variant="outline"
              size="sm"
              className="h-8 rounded-full border-[rgba(148,163,184,0.25)] bg-white px-3 font-normal text-[#334155] hover:bg-[#F8FAFC]"
              onClick={() => pushFilters(chip.clearPatch)}
            >
              {chip.label}
              <X className="size-3.5 text-[#94A3B8]" aria-hidden="true" />
              <span className="sr-only">Удалить фильтр</span>
            </Button>
          ))}
          {hasFilters ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 rounded-full px-3 text-[#2563EB] hover:text-[#1D4ED8]"
              onClick={handleResetAll}
            >
              Сбросить всё
            </Button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
