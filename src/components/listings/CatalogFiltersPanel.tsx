"use client";

import type { ListingVertical } from "@prisma/client";
import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { SelectOption } from "@/features/listings/constants";
import {
  listingSortOptions,
  type ListingSort,
  type ListingsCatalogFilters,
} from "@/features/listings/lib/listings-catalog";
import { catalogShowsBrandFilter } from "@/features/listings/lib/vertical-form-config";
import { VERTICAL_LIST } from "@/features/verticals/verticals";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

export type FilterDraft = {
  vertical: ListingVertical | null;
  categoryId: string;
  cityId: string;
  brandId: string;
  priceMin: string;
  priceMax: string;
  withPhotos: boolean;
  sort: ListingSort;
};

type CatalogFiltersPanelProps = {
  open: boolean;
  onClose: () => void;
  filters: ListingsCatalogFilters;
  categories: SelectOption[];
  cities: SelectOption[];
  brands: SelectOption[];
  onApply: (draft: FilterDraft) => void;
  onReset: (scope: "panel" | "all") => void;
};

function filtersToDraft(filters: ListingsCatalogFilters): FilterDraft {
  return {
    vertical: filters.vertical,
    categoryId: filters.categoryId,
    cityId: filters.cityId,
    brandId: filters.brandId,
    priceMin: filters.priceMin,
    priceMax: filters.priceMax,
    withPhotos: filters.withPhotos,
    sort: filters.sort,
  };
}

const emptyDraft: FilterDraft = {
  vertical: null,
  categoryId: "",
  cityId: "",
  brandId: "",
  priceMin: "",
  priceMax: "",
  withPhotos: false,
  sort: "newest",
};

function sanitizeNonNegativeNumber(value: string): string {
  if (value.trim() === "") {
    return "";
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return "";
  }
  return value;
}

function validatePriceRange(priceMin: string, priceMax: string): boolean {
  if (!priceMin || !priceMax) {
    return true;
  }
  const min = Number(priceMin);
  const max = Number(priceMax);
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return true;
  }
  return min <= max;
}

type FilterFieldsProps = {
  draft: FilterDraft;
  categories: SelectOption[];
  cities: SelectOption[];
  brands: SelectOption[];
  showBrandFilter: boolean;
  showVerticalAndSort: boolean;
  priceError: string | null;
  onUpdate: <K extends keyof FilterDraft>(key: K, value: FilterDraft[K]) => void;
};

function FilterFields({
  draft,
  categories,
  cities,
  brands,
  showBrandFilter,
  showVerticalAndSort,
  priceError,
  onUpdate,
}: FilterFieldsProps) {
  const { t } = useTranslation();

  const visibleCategories = useMemo(() => {
    if (!draft.vertical) {
      return categories;
    }
    return categories.filter(
      (category) => !category.vertical || category.vertical === draft.vertical,
    );
  }, [categories, draft.vertical]);

  return (
    <div className="space-y-4">
      {showVerticalAndSort ? (
        <>
          <div className="space-y-2">
            <label htmlFor="filter-vertical" className="text-sm font-medium text-foreground">
              {t("filters.section")}
            </label>
            <Select
              value={draft.vertical ?? "all"}
              onValueChange={(value) => {
                const nextVertical =
                  value === "all" ? null : (value as ListingVertical);
                onUpdate("vertical", nextVertical);
                onUpdate("categoryId", "");
                onUpdate("brandId", "");
              }}
            >
              <SelectTrigger
                id="filter-vertical"
                className="h-11 rounded-xl dark:border-slate-700 dark:bg-slate-950"
              >
                <SelectValue placeholder={t("catalog.all")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("catalog.all")}</SelectItem>
                {VERTICAL_LIST.map((vertical) => (
                  <SelectItem key={vertical.id} value={vertical.id}>
                    {t(
                      vertical.id === "MARKET"
                        ? "vertical.market"
                        : vertical.id === "OPT"
                          ? "vertical.opt"
                          : vertical.id === "SERVICES"
                            ? "vertical.services"
                            : "vertical.cargo",
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="filter-sort" className="text-sm font-medium text-foreground">
              {t("sort.title")}
            </label>
            <Select
              value={draft.sort}
              onValueChange={(value) => onUpdate("sort", value as ListingSort)}
            >
              <SelectTrigger
                id="filter-sort"
                className="h-11 rounded-xl dark:border-slate-700 dark:bg-slate-950"
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
          </div>
        </>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="filter-category" className="text-sm font-medium text-foreground">
          {draft.vertical === "SERVICES"
            ? t("services.serviceCategory")
            : t("filters.category")}
        </label>
        <Select
          value={draft.categoryId || "all"}
          onValueChange={(value) => onUpdate("categoryId", value === "all" ? "" : value)}
        >
          <SelectTrigger
            id="filter-category"
            className="h-11 rounded-xl dark:border-slate-700 dark:bg-slate-950"
          >
            <SelectValue placeholder={t("catalog.allCategories")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("catalog.allCategories")}</SelectItem>
            {visibleCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="filter-city" className="text-sm font-medium text-foreground">
          {t("filters.city")}
        </label>
        <Select
          value={draft.cityId || "all"}
          onValueChange={(value) => onUpdate("cityId", value === "all" ? "" : value)}
        >
          <SelectTrigger
            id="filter-city"
            className="h-11 rounded-xl dark:border-slate-700 dark:bg-slate-950"
          >
            <SelectValue placeholder={t("catalog.allCities")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("catalog.allCities")}</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.id}>
                {city.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showBrandFilter ? (
        <div className="space-y-2">
          <label htmlFor="filter-brand" className="text-sm font-medium text-foreground">
            {t("catalog.brand")}
          </label>
          <Select
            value={draft.brandId || "all"}
            onValueChange={(value) => onUpdate("brandId", value === "all" ? "" : value)}
          >
            <SelectTrigger
              id="filter-brand"
              className="h-11 rounded-xl dark:border-slate-700 dark:bg-slate-950"
            >
              <SelectValue placeholder={t("catalog.allBrands")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("catalog.allBrands")}</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">{t("filters.price")}</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label htmlFor="filter-price-from" className="text-xs text-muted-foreground">
              {t("filters.priceFrom")}
            </label>
            <Input
              id="filter-price-from"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={draft.priceMin}
              onChange={(event) =>
                onUpdate("priceMin", sanitizeNonNegativeNumber(event.target.value))
              }
              placeholder="0"
              className="h-11 rounded-xl dark:border-slate-700 dark:bg-slate-950"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="filter-price-to" className="text-xs text-muted-foreground">
              {t("filters.priceTo")}
            </label>
            <Input
              id="filter-price-to"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={draft.priceMax}
              onChange={(event) =>
                onUpdate("priceMax", sanitizeNonNegativeNumber(event.target.value))
              }
              placeholder="100000"
              className="h-11 rounded-xl dark:border-slate-700 dark:bg-slate-950"
            />
          </div>
        </div>
        {priceError ? (
          <p className="text-xs text-destructive">{priceError}</p>
        ) : null}
      </div>

      <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-muted/40 px-4 py-3 text-sm text-foreground dark:border-slate-800 dark:bg-slate-950">
        <input
          type="checkbox"
          checked={draft.withPhotos}
          onChange={(event) => onUpdate("withPhotos", event.target.checked)}
          className="size-4 rounded border-input text-primary focus:ring-ring"
        />
        {t("filters.onlyWithPhoto")}
      </label>
    </div>
  );
}

type FilterActionsProps = {
  onReset: () => void;
  onApply: () => void;
  applyDisabled?: boolean;
  className?: string;
};

function FilterActions({
  onReset,
  onApply,
  applyDisabled = false,
  className,
}: FilterActionsProps) {
  const { t } = useTranslation();

  return (
    <div className={cn("flex gap-3", className)}>
      <Button
        type="button"
        variant="outline"
        className="h-12 flex-1 rounded-xl dark:border-slate-700 dark:bg-slate-950"
        onClick={onReset}
      >
        {t("filters.reset")}
      </Button>
      <Button
        type="button"
        className="h-12 flex-1 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8]"
        onClick={onApply}
        disabled={applyDisabled}
      >
        {t("filters.apply")}
      </Button>
    </div>
  );
}

export function CatalogFiltersPanel({
  open,
  onClose,
  filters,
  categories,
  cities,
  brands,
  onApply,
  onReset,
}: CatalogFiltersPanelProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<FilterDraft>(() => filtersToDraft(filters));
  const [isMobile, setIsMobile] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);
  const showBrandFilter = catalogShowsBrandFilter(draft.vertical);

  useEffect(() => {
    if (open) {
      setDraft(filtersToDraft(filters));
      setPriceError(null);
    }
  }, [open, filters]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  function updateDraft<K extends keyof FilterDraft>(key: K, value: FilterDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    if (key === "priceMin" || key === "priceMax") {
      setPriceError(null);
    }
  }

  function handleResetPanel() {
    if (isMobile) {
      setDraft(emptyDraft);
      setPriceError(null);
      onReset("all");
      onClose();
      return;
    }

    setDraft({
      ...filtersToDraft(filters),
      categoryId: "",
      cityId: "",
      brandId: "",
      priceMin: "",
      priceMax: "",
      withPhotos: false,
    });
    setPriceError(null);
    onReset("panel");
    onClose();
  }

  function handleApplyPanel() {
    if (!validatePriceRange(draft.priceMin, draft.priceMax)) {
      setPriceError(t("filters.invalidPriceRange"));
      return;
    }

    onApply(
      showBrandFilter
        ? draft
        : {
            ...draft,
            brandId: "",
          },
    );
    onClose();
  }

  const fields = (
    <FilterFields
      draft={draft}
      categories={categories}
      cities={cities}
      brands={brands}
      showBrandFilter={showBrandFilter}
      showVerticalAndSort={isMobile}
      priceError={priceError}
      onUpdate={updateDraft}
    />
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
        <DrawerContent
          side="bottom"
          className="max-h-[min(92vh,40rem)] gap-0 bg-white px-0 pb-0 dark:bg-slate-950 [&>button]:hidden"
        >
          <DrawerHeader className="border-b border-slate-200 px-4 pb-4 text-left dark:border-slate-800">
            <DrawerTitle className="flex items-center gap-2 text-base text-slate-900 dark:text-slate-100">
              <SlidersHorizontal className="size-4 text-slate-500" aria-hidden="true" />
              {t("filters.title")}
            </DrawerTitle>
          </DrawerHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">{fields}</div>
          <DrawerFooter
            className="sticky bottom-0 border-t border-slate-200 bg-white px-4 pt-3 dark:border-slate-800 dark:bg-slate-950"
            style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
          >
            <FilterActions
              onReset={handleResetPanel}
              onApply={handleApplyPanel}
              applyDisabled={Boolean(priceError)}
            />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  if (!open) {
    return null;
  }

  return (
    <Card className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,24rem)] max-h-[min(32rem,calc(100vh-8rem))] overflow-hidden rounded-2xl border-[rgba(148,163,184,0.18)] bg-white shadow-[0_12px_32px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-[rgba(148,163,184,0.12)] px-4 py-3 dark:border-slate-800">
        <CardTitle className="flex items-center gap-2 text-base text-[#0F172A] dark:text-slate-100">
          <SlidersHorizontal className="size-4 text-[#64748B]" aria-hidden="true" />
          {t("filters.title")}
        </CardTitle>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label={t("common.close")}
        >
          <X className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="max-h-[min(24rem,calc(100vh-12rem))] overflow-y-auto px-4 py-4">
        {fields}
      </CardContent>
      <CardFooter className="border-t px-4 py-4 dark:border-slate-800">
        <FilterActions
          onReset={handleResetPanel}
          onApply={handleApplyPanel}
          applyDisabled={Boolean(priceError)}
          className="w-full"
        />
      </CardFooter>
    </Card>
  );
}
