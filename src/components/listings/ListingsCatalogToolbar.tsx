"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  CatalogFiltersPanel,
  type FilterDraft,
} from "@/components/listings/CatalogFiltersPanel";
import { SaveSearchButton } from "@/components/listings/SaveSearchButton";
import {
  getActiveFilterChips,
  getCatalogAnalyticsContext,
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
import {
  trackCatalogFilterChange,
  trackCatalogResetFilters,
  trackCatalogSearchSubmit,
  trackCatalogSortChange,
  trackCatalogVerticalTabClick,
} from "@/lib/analytics/events";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { ListingVertical } from "@prisma/client";

const VERTICAL_TAB_ACTIVE: Record<ListingVertical, string> = {
  OPT: "bg-blue-600 text-white shadow-sm",
  MARKET: "bg-indigo-600 text-white shadow-sm",
  SERVICES: "bg-teal-700 text-white shadow-sm",
  CARGO: "bg-rose-600 text-white shadow-sm",
};

const VERTICAL_TAB_INACTIVE =
  "bg-white text-[#64748B] ring-1 ring-[rgba(148,163,184,0.22)] hover:bg-[#F8FAFC] hover:text-[#334155]";

type ListingsCatalogToolbarProps = {
  filters: ListingsCatalogFilters;
  categories: SelectOption[];
  cities: SelectOption[];
  brands: SelectOption[];
  lookups: CatalogLookupMaps;
  totalCount: number;
};

function formatListingCount(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return "объявление";
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return "объявления";
  }
  return "объявлений";
}

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
  const hasFilters =
    hasActiveCatalogFilters(filters) || Boolean(filters.vertical);
  const currentSortLabel =
    listingSortOptions.find((option) => option.value === filters.sort)?.label ??
    "Сначала новые";

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

  function pushFilters(
    next: Partial<ListingsCatalogFilters>,
    analytics?: "filter" | "sort" | "search" | "vertical" | "reset",
  ) {
    const merged = { ...filters, ...next, page: 1 };
    const ctx = getCatalogAnalyticsContext(merged);

    if (analytics === "search") {
      trackCatalogSearchSubmit(ctx);
    } else if (analytics === "filter") {
      trackCatalogFilterChange(ctx);
    } else if (analytics === "sort") {
      trackCatalogSortChange(ctx);
    } else if (analytics === "vertical") {
      trackCatalogVerticalTabClick(merged.vertical, ctx);
    } else if (analytics === "reset") {
      trackCatalogResetFilters(getCatalogAnalyticsContext(filters));
    }

    router.push(`/listings${buildListingsCatalogQueryString(filters, { ...next, page: 1 })}`);
  }

  function handleCatalogSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    pushFilters({ q: query.trim() }, "search");
  }

  function handleCatalogClear() {
    setQuery("");
    pushFilters({ q: "" }, "filter");
  }

  function handleSortChange(value: string) {
    pushFilters({ sort: value as ListingSort }, "sort");
  }

  function handleApplyFilters(draft: FilterDraft) {
    pushFilters(
      {
        categoryId: draft.categoryId,
        cityId: draft.cityId,
        brandId: showBrandFilter ? draft.brandId : "",
        priceMin: draft.priceMin,
        priceMax: draft.priceMax,
        withPhotos: draft.withPhotos,
      },
      "filter",
    );
  }

  function handleResetFilters() {
    pushFilters(
      {
        categoryId: "",
        cityId: "",
        brandId: "",
        priceMin: "",
        priceMax: "",
        withPhotos: false,
      },
      "filter",
    );
  }

  function handleResetAll() {
    setQuery("");
    trackCatalogResetFilters(getCatalogAnalyticsContext(filters));
    router.push("/listings");
  }

  function handleVerticalChange(nextVertical: ListingVertical | null) {
    pushFilters(
      {
        vertical: nextVertical,
        categoryId: "",
        brandId: "",
      },
      "vertical",
    );
  }

  return (
    <section className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-[rgba(148,163,184,0.16)] bg-white shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
        <div className="border-b border-[rgba(148,163,184,0.12)] bg-gradient-to-br from-[#EFF6FF] via-white to-[#F8FAFC] px-4 py-4 sm:px-5 sm:py-5">
          <div
            className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Раздел объявлений"
          >
            <button
              type="button"
              role="tab"
              aria-selected={filters.vertical === null}
              onClick={() => handleVerticalChange(null)}
              className={cn(
                "h-9 shrink-0 rounded-full px-3.5 text-sm font-medium transition-colors",
                filters.vertical === null
                  ? "bg-[#2563EB] text-white shadow-sm"
                  : VERTICAL_TAB_INACTIVE,
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
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleVerticalChange(vertical.id)}
                  className={cn(
                    "h-9 shrink-0 rounded-full px-3.5 text-sm font-medium transition-colors",
                    isActive ? VERTICAL_TAB_ACTIVE[vertical.id] : VERTICAL_TAB_INACTIVE,
                  )}
                >
                  {vertical.label}
                </button>
              );
            })}
          </div>

          <form
            onSubmit={handleCatalogSubmit}
            className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center"
          >
            <label htmlFor="catalog-search" className="sr-only">
              Что вы ищете?
            </label>
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]"
                aria-hidden="true"
              />
              <Input
                id="catalog-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Что вы ищете?"
                className="h-12 rounded-xl border-[rgba(148,163,184,0.25)] bg-white pl-10 pr-10 text-base shadow-none"
              />
              {query ? (
                <button
                  type="button"
                  onClick={handleCatalogClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#64748B]"
                  aria-label="Очистить поиск"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>
            <Button
              type="submit"
              className="h-12 w-full shrink-0 rounded-xl bg-[#2563EB] px-6 text-base hover:bg-[#1D4ED8] sm:w-auto"
            >
              Найти
            </Button>
          </form>
        </div>

        <div className="flex flex-col gap-3 px-4 py-3 sm:px-5 sm:py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm text-[#64748B]">
              Найдено:{" "}
              <span className="font-semibold text-[#0F172A]">{totalCount}</span>{" "}
              {formatListingCount(totalCount)}
            </p>
            <p className="mt-0.5 text-xs text-[#94A3B8]">{currentSortLabel}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={filters.sort} onValueChange={handleSortChange}>
              <SelectTrigger
                className="h-10 min-w-[150px] flex-1 rounded-xl bg-white sm:flex-none sm:w-[180px]"
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
                className="h-10 gap-2 rounded-xl border-[rgba(148,163,184,0.25)] bg-white"
              >
                <SlidersHorizontal className="size-4" aria-hidden="true" />
                Фильтры
                {panelFiltersOnly ? (
                  <Badge
                    variant="default"
                    className="ml-0.5 size-2 rounded-full bg-[#2563EB] p-0"
                    aria-hidden="true"
                  >
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

            <SaveSearchButton filters={filters} lookups={lookups} />
          </div>
        </div>
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
              onClick={() => pushFilters(chip.clearPatch, "filter")}
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
