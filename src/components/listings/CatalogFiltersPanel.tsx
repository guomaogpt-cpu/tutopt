"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { SelectOption } from "@/features/listings/constants";
import type { ListingsCatalogFilters } from "@/features/listings/lib/listings-catalog";
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

export type FilterDraft = {
  categoryId: string;
  cityId: string;
  brandId: string;
  priceMin: string;
  priceMax: string;
  withPhotos: boolean;
};

type CatalogFiltersPanelProps = {
  open: boolean;
  onClose: () => void;
  filters: ListingsCatalogFilters;
  categories: SelectOption[];
  cities: SelectOption[];
  brands: SelectOption[];
  onApply: (draft: FilterDraft) => void;
  onReset: () => void;
};

function filtersToDraft(filters: ListingsCatalogFilters): FilterDraft {
  return {
    categoryId: filters.categoryId,
    cityId: filters.cityId,
    brandId: filters.brandId,
    priceMin: filters.priceMin,
    priceMax: filters.priceMax,
    withPhotos: filters.withPhotos,
  };
}

const emptyDraft: FilterDraft = {
  categoryId: "",
  cityId: "",
  brandId: "",
  priceMin: "",
  priceMax: "",
  withPhotos: false,
};

type FilterFieldsProps = {
  draft: FilterDraft;
  categories: SelectOption[];
  cities: SelectOption[];
  brands: SelectOption[];
  onUpdate: <K extends keyof FilterDraft>(key: K, value: FilterDraft[K]) => void;
};

function FilterFields({ draft, categories, cities, brands, onUpdate }: FilterFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="filter-category" className="text-sm font-medium text-foreground">
          Категория
        </label>
        <Select
          value={draft.categoryId || "all"}
          onValueChange={(value) => onUpdate("categoryId", value === "all" ? "" : value)}
        >
          <SelectTrigger id="filter-category">
            <SelectValue placeholder="Все категории" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="filter-city" className="text-sm font-medium text-foreground">
          Город
        </label>
        <Select
          value={draft.cityId || "all"}
          onValueChange={(value) => onUpdate("cityId", value === "all" ? "" : value)}
        >
          <SelectTrigger id="filter-city">
            <SelectValue placeholder="Все города" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все города</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.id}>
                {city.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="filter-brand" className="text-sm font-medium text-foreground">
          Бренд
        </label>
        <Select
          value={draft.brandId || "all"}
          onValueChange={(value) => onUpdate("brandId", value === "all" ? "" : value)}
        >
          <SelectTrigger id="filter-brand">
            <SelectValue placeholder="Все бренды" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все бренды</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand.id} value={brand.id}>
                {brand.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label htmlFor="filter-price-from" className="text-sm font-medium text-foreground">
            Цена от
          </label>
          <Input
            id="filter-price-from"
            type="number"
            min="0"
            step="0.01"
            value={draft.priceMin}
            onChange={(event) => onUpdate("priceMin", event.target.value)}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="filter-price-to" className="text-sm font-medium text-foreground">
            Цена до
          </label>
          <Input
            id="filter-price-to"
            type="number"
            min="0"
            step="0.01"
            value={draft.priceMax}
            onChange={(event) => onUpdate("priceMax", event.target.value)}
            placeholder="100000"
          />
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-xl border bg-muted/40 px-4 py-3 text-sm text-foreground">
        <input
          type="checkbox"
          checked={draft.withPhotos}
          onChange={(event) => onUpdate("withPhotos", event.target.checked)}
          className="size-4 rounded border-input text-primary focus:ring-ring"
        />
        Только с фото
      </label>
    </div>
  );
}

type FilterActionsProps = {
  onReset: () => void;
  onApply: () => void;
  className?: string;
};

function FilterActions({ onReset, onApply, className }: FilterActionsProps) {
  return (
    <div className={`flex gap-3 ${className ?? ""}`}>
      <Button type="button" variant="outline" className="flex-1" onClick={onReset}>
        Сбросить
      </Button>
      <Button type="button" className="flex-1" onClick={onApply}>
        Применить
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
  const [draft, setDraft] = useState<FilterDraft>(() => filtersToDraft(filters));
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (open) {
      setDraft(filtersToDraft(filters));
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
  }

  function handleResetPanel() {
    setDraft(emptyDraft);
    onReset();
    onClose();
  }

  function handleApplyPanel() {
    onApply(draft);
    onClose();
  }

  const fields = (
    <FilterFields
      draft={draft}
      categories={categories}
      cities={cities}
      brands={brands}
      onUpdate={updateDraft}
    />
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
        <DrawerContent side="bottom" className="max-h-[85vh] px-0 pb-6 [&>button]:hidden">
          <DrawerHeader className="border-b px-4 pb-4 text-left">
            <DrawerTitle className="flex items-center gap-2 text-base">
              <SlidersHorizontal className="size-4 text-muted-foreground" aria-hidden="true" />
              Фильтры
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto px-4 py-4">{fields}</div>
          <DrawerFooter className="border-t px-4 pt-4">
            <FilterActions onReset={handleResetPanel} onApply={handleApplyPanel} />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  if (!open) {
    return null;
  }

  return (
    <Card className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,24rem)] max-h-[min(32rem,calc(100vh-8rem))] overflow-hidden shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b px-4 py-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <SlidersHorizontal className="size-4 text-muted-foreground" aria-hidden="true" />
          Фильтры
        </CardTitle>
        <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Закрыть">
          <X className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="max-h-[min(24rem,calc(100vh-12rem))] overflow-y-auto px-4 py-4">
        {fields}
      </CardContent>
      <CardFooter className="border-t px-4 py-4">
        <FilterActions onReset={handleResetPanel} onApply={handleApplyPanel} className="w-full" />
      </CardFooter>
    </Card>
  );
}
