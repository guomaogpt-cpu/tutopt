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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const activeChips = getActiveFilterChips(filters, lookups);
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

  function handleResetAll() {
    setQuery("");
    router.push("/listings");
  }

  return (
    <section className="space-y-3">
      <Card>
        <CardContent className="space-y-3 p-3 sm:p-4">
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
                placeholder="Поиск товара..."
                containerClassName="w-full"
              />
            </form>

            <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
              <Select value={filters.sort} onValueChange={handleSortChange}>
                <SelectTrigger className="min-w-[150px] flex-1 lg:w-[180px] lg:flex-none" aria-label="Сортировка">
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
                  className="gap-2"
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
                  onApply={handleApplyFilters}
                  onReset={handleResetFilters}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
            <p>
              Найдено: <span className="font-semibold text-foreground">{totalCount}</span>
            </p>
            {hasFilters ? (
              <Button type="button" variant="ghost" size="sm" onClick={handleResetAll}>
                Сбросить
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {activeChips.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {activeChips.map((chip) => (
            <Button
              key={chip.id}
              type="button"
              variant="outline"
              size="sm"
              className="h-8 rounded-full px-3 font-normal"
              onClick={() => pushFilters(chip.clearPatch)}
            >
              {chip.label}
              <X className="size-3.5 text-muted-foreground" aria-hidden="true" />
              <span className="sr-only">Удалить фильтр</span>
            </Button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
