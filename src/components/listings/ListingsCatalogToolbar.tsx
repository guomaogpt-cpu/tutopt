"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  CatalogFiltersPanel,
  type FilterDraft,
} from "@/components/listings/CatalogFiltersPanel";
import { SaveSearchButton } from "@/components/listings/SaveSearchButton";
import { PhotoSearchButton } from "@/components/search/PhotoSearchButton";
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
import { translate, type Locale } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getVerticalTheme } from "@/lib/vertical-theme";
import { cn } from "@/lib/utils";
import type { ListingVertical } from "@prisma/client";

const VERTICAL_TAB_INACTIVE =
  "bg-white text-[#64748B] ring-1 ring-[rgba(148,163,184,0.22)] hover:bg-[#F8FAFC] hover:text-[#334155] dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200";

type ListingsCatalogToolbarProps = {
  filters: ListingsCatalogFilters;
  categories: SelectOption[];
  cities: SelectOption[];
  brands: SelectOption[];
  lookups: CatalogLookupMaps;
  totalCount: number;
};

function formatListingCount(locale: Locale, count: number): string {
  if (locale !== "ru") {
    return count === 1
      ? translate(locale, "catalog.listingWordOne")
      : translate(locale, "catalog.listingWordMany");
  }

  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return translate(locale, "catalog.listingWordOne");
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return translate(locale, "catalog.listingWordFew");
  }
  return translate(locale, "catalog.listingWordMany");
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
  const { t, locale } = useTranslation();
  const filtersButtonRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(filters.q);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const showBrandFilter = catalogShowsBrandFilter(filters.vertical);
  const theme = getVerticalTheme(filters.vertical);
  const sortLabel =
    t(
      listingSortOptions.find((option) => option.value === filters.sort)?.labelKey ??
        "sort.newest",
    );
  const activeChips = getActiveFilterChips(filters, lookups, {
    t,
    includeSort: true,
    sortLabel,
  }).filter((chip) => showBrandFilter || chip.id !== "brand");
  const panelFiltersOnly = hasActiveCatalogFilters({
    ...filters,
    q: "",
    sort: filters.sort,
    page: filters.page,
  });
  const hasFilters =
    hasActiveCatalogFilters(filters) ||
    Boolean(filters.vertical) ||
    filters.sort !== "newest";

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
        vertical: draft.vertical,
        categoryId: draft.categoryId,
        cityId: draft.cityId,
        brandId: catalogShowsBrandFilter(draft.vertical) ? draft.brandId : "",
        priceMin: draft.priceMin,
        priceMax: draft.priceMax,
        withPhotos: draft.withPhotos,
        sort: draft.sort,
      },
      "filter",
    );
  }

  function handleResetFilters(scope: "panel" | "all" = "panel") {
    if (scope === "all") {
      pushFilters(
        {
          vertical: null,
          categoryId: "",
          cityId: "",
          brandId: "",
          priceMin: "",
          priceMax: "",
          withPhotos: false,
          sort: "newest",
        },
        "filter",
      );
      return;
    }

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
      <div className="overflow-hidden rounded-2xl border border-[rgba(148,163,184,0.16)] bg-white shadow-[0_4px_16px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <div
          className={cn(
            "border-b border-[rgba(148,163,184,0.12)] bg-gradient-to-br via-white to-[#F8FAFC] px-4 py-3 sm:px-5 sm:py-5 dark:border-slate-800 dark:via-slate-900 dark:to-slate-950",
            filters.vertical === "MARKET"
              ? "from-purple-50 dark:from-slate-900"
              : filters.vertical === "SERVICES"
                ? "from-green-50 dark:from-slate-900"
                : filters.vertical === "CARGO"
                  ? "from-orange-50 dark:from-slate-900"
                  : "from-[#EFF6FF] dark:from-slate-900",
          )}
        >
          <div
            className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label={t("catalog.sectionAriaLabel")}
          >
            <button
              type="button"
              role="tab"
              aria-selected={filters.vertical === null}
              onClick={() => handleVerticalChange(null)}
              className={cn(
                "h-9 shrink-0 rounded-full px-3.5 text-sm font-medium transition-colors",
                filters.vertical === null
                  ? "bg-blue-600 text-white shadow-sm dark:bg-blue-600"
                  : VERTICAL_TAB_INACTIVE,
              )}
            >
              {t("catalog.all")}
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
                    isActive
                      ? cn(getVerticalTheme(vertical.id).activeChip, "shadow-sm")
                      : VERTICAL_TAB_INACTIVE,
                  )}
                >
                  {t(
                    vertical.id === "MARKET"
                      ? "vertical.market"
                      : vertical.id === "OPT"
                        ? "vertical.opt"
                        : vertical.id === "SERVICES"
                          ? "vertical.services"
                          : "vertical.cargo",
                  )}
                </button>
              );
            })}
          </div>

          <form
            onSubmit={handleCatalogSubmit}
            className="mt-3 flex items-center gap-2 sm:mt-4"
          >
            <label htmlFor="catalog-search" className="sr-only">
              {t("catalog.searchAriaLabel")}
            </label>
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]"
                aria-hidden="true"
              />
              <Input
                id="catalog-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={
                  filters.vertical === "SERVICES"
                    ? t("services.searchPlaceholder")
                    : filters.vertical === "MARKET"
                      ? t("search.marketPlaceholder")
                      : t("mobileSearch.placeholder")
                }
                className="h-11 rounded-xl border-[rgba(148,163,184,0.25)] bg-white pl-10 pr-[4.5rem] text-base shadow-none sm:h-12 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
              <div className="absolute right-10 top-1/2 z-10 -translate-y-1/2">
                <PhotoSearchButton
                  vertical={filters.vertical}
                  categoryId={filters.categoryId || null}
                  initialQueryHint={query}
                  sizeClassName="size-8"
                  className="border-transparent bg-transparent shadow-none hover:border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
                />
              </div>
              {query ? (
                <button
                  type="button"
                  onClick={handleCatalogClear}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#64748B] dark:hover:bg-slate-800"
                  aria-label={t("catalog.clearSearch")}
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>
            <Button
              type="submit"
              size="icon"
              className={cn("size-11 shrink-0 rounded-xl sm:hidden", theme.primaryButton)}
              aria-label={t("search.find")}
            >
              <Search className="size-5" aria-hidden="true" />
            </Button>
            <Button
              type="submit"
              className={cn(
                "hidden h-12 shrink-0 rounded-xl px-6 text-base sm:inline-flex",
                theme.primaryButton,
              )}
            >
              {t("search.find")}
            </Button>
          </form>
        </div>

        <div className="flex flex-col gap-3 px-4 py-3 sm:px-5 sm:py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm text-[#64748B] dark:text-slate-400">
              {t("listings.found")}:{" "}
              <span className="font-semibold text-[#0F172A] dark:text-slate-100">{totalCount}</span>{" "}
              {formatListingCount(locale, totalCount)}
            </p>
            <p className="mt-0.5 text-xs text-[#94A3B8] dark:text-slate-500">{sortLabel}</p>
            {filters.photoSearch ? (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {t("listings.photoSearch.filterHint")}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={filters.sort} onValueChange={handleSortChange}>
              <SelectTrigger
                className="h-11 min-w-[132px] flex-1 rounded-xl bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:h-10 sm:flex-none sm:w-[200px]"
                aria-label={t("sort.title")}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {listingSortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(option.labelKey)}
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
                aria-label={filtersOpen ? t("listings.hideFilters") : t("filters.show")}
                className="h-11 gap-2 rounded-xl border-[rgba(148,163,184,0.25)] bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 sm:h-10"
              >
                <SlidersHorizontal className="size-4" aria-hidden="true" />
                {t("filters.title")}
                {panelFiltersOnly ? (
                  <Badge
                    variant="default"
                    className={cn("ml-0.5 size-2 rounded-full p-0", theme.primaryBg)}
                    aria-hidden="true"
                  >
                    <span className="sr-only">{t("filters.activeFilters")}</span>
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
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
              />
            </div>

            <SaveSearchButton filters={filters} lookups={lookups} />
          </div>
        </div>
      </div>

      {activeChips.length > 0 ? (
        <div
          className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible"
          aria-label={t("filters.activeFilters")}
        >
          {activeChips.map((chip) => (
            <Button
              key={chip.id}
              type="button"
              variant="outline"
              size="sm"
              className="h-9 shrink-0 rounded-full border-[rgba(148,163,184,0.25)] bg-white px-3 font-normal text-[#334155] hover:bg-[#F8FAFC] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              onClick={() => pushFilters(chip.clearPatch, "filter")}
            >
              <span className="max-w-[12rem] truncate">{chip.label}</span>
              <X className="size-3.5 text-[#94A3B8]" aria-hidden="true" />
              <span className="sr-only">
                {t(chip.clearAriaLabelKey ?? "filters.clearOne")}
              </span>
            </Button>
          ))}
          {hasFilters ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn("h-9 shrink-0 rounded-full px-3", theme.softLink)}
              onClick={handleResetAll}
            >
              {t("filters.clearAll")}
            </Button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
