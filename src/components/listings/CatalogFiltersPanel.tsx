"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { SelectOption } from "@/features/listings/constants";
import type { ListingsCatalogFilters } from "@/features/listings/lib/listings-catalog";

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

const fieldClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

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
  const panelRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState<FilterDraft>(() => filtersToDraft(filters));

  useEffect(() => {
    if (open) {
      setDraft(filtersToDraft(filters));
    }
  }, [open, filters]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  function updateDraft<K extends keyof FilterDraft>(key: K, value: FilterDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleResetPanel() {
    setDraft(emptyDraft);
    onReset();
    onClose();
  }

  const formFields = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="filter-category" className="text-sm font-medium text-slate-700">
          Категория
        </label>
        <select
          id="filter-category"
          value={draft.categoryId}
          onChange={(event) => updateDraft("categoryId", event.target.value)}
          className={fieldClassName}
        >
          <option value="">Все категории</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="filter-city" className="text-sm font-medium text-slate-700">
          Город
        </label>
        <select
          id="filter-city"
          value={draft.cityId}
          onChange={(event) => updateDraft("cityId", event.target.value)}
          className={fieldClassName}
        >
          <option value="">Все города</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="filter-brand" className="text-sm font-medium text-slate-700">
          Бренд
        </label>
        <select
          id="filter-brand"
          value={draft.brandId}
          onChange={(event) => updateDraft("brandId", event.target.value)}
          className={fieldClassName}
        >
          <option value="">Все бренды</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label htmlFor="filter-price-from" className="text-sm font-medium text-slate-700">
            Цена от
          </label>
          <input
            id="filter-price-from"
            type="number"
            min="0"
            step="0.01"
            value={draft.priceMin}
            onChange={(event) => updateDraft("priceMin", event.target.value)}
            placeholder="0"
            className={fieldClassName}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="filter-price-to" className="text-sm font-medium text-slate-700">
            Цена до
          </label>
          <input
            id="filter-price-to"
            type="number"
            min="0"
            step="0.01"
            value={draft.priceMax}
            onChange={(event) => updateDraft("priceMax", event.target.value)}
            placeholder="100000"
            className={fieldClassName}
          />
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={draft.withPhotos}
          onChange={(event) => updateDraft("withPhotos", event.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        Только с фото
      </label>
    </div>
  );

  const footer = (
    <div className="flex gap-3 border-t border-slate-100 bg-white p-4">
      <button
        type="button"
        onClick={handleResetPanel}
        className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        Сбросить
      </button>
      <button
        type="button"
        onClick={() => {
          onApply(draft);
          onClose();
        }}
        className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Применить
      </button>
    </div>
  );

  return (
    <>
      <button
        type="button"
        aria-label="Закрыть фильтры"
        className="fixed inset-0 z-40 bg-slate-900/30 md:hidden"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-2xl border border-slate-200 bg-white shadow-2xl md:absolute md:inset-auto md:right-0 md:top-full md:mt-2 md:w-[min(100vw-2rem,24rem)] md:max-h-[min(32rem,calc(100vh-8rem))] md:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Фильтры каталога"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 md:px-5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-500" aria-hidden="true" />
            <h2 className="text-base font-semibold text-slate-900">Фильтры</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 md:px-5">{formFields}</div>
        {footer}
      </div>
    </>
  );
}
