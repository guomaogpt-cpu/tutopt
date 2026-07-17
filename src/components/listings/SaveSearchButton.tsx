"use client";

import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import type { CatalogLookupMaps } from "@/features/listings/lib/catalog-active-filters";
import { buildCatalogHref } from "@/features/listings/lib/catalog-active-filters";
import type { ListingsCatalogFilters } from "@/features/listings/lib/listings-catalog";
import { VERTICALS } from "@/features/verticals/verticals";
import { trackSavedSearch } from "@/lib/analytics/events";
import { isSearchSaved, saveSearch } from "@/lib/saved-searches/local-saved-searches";
import { Button } from "@/components/ui/button";

type SaveSearchButtonProps = {
  filters: ListingsCatalogFilters;
  lookups: CatalogLookupMaps;
};

function buildSearchTitle(
  filters: ListingsCatalogFilters,
  lookups: CatalogLookupMaps,
): string {
  const parts: string[] = [];

  if (filters.q) {
    parts.push(`Поиск: ${filters.q}`);
  }

  if (filters.vertical) {
    parts.push(VERTICALS[filters.vertical].label);
  }

  if (filters.categoryId) {
    const categoryName = lookups.categories[filters.categoryId];
    if (categoryName) {
      parts.push(`Категория: ${categoryName}`);
    }
  }

  if (filters.cityId) {
    const cityName = lookups.cities[filters.cityId];
    if (cityName) {
      parts.push(cityName);
    }
  }

  return parts.length > 0 ? parts.join(" · ") : "Все объявления";
}

export function SaveSearchButton({ filters, lookups }: SaveSearchButtonProps) {
  const url = buildCatalogHref(filters);
  const [saved, setSaved] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    setSaved(isSearchSaved(url));
    setJustSaved(false);
  }, [url]);

  function handleSave() {
    if (saved) {
      return;
    }

    const result = saveSearch({
      title: buildSearchTitle(filters, lookups),
      url,
      query: filters.q || null,
      vertical: filters.vertical,
    });

    if (result) {
      setSaved(true);
      setJustSaved(true);
      trackSavedSearch("create", {
        vertical: filters.vertical,
        hasQuery: Boolean(filters.q),
        hasCategory: Boolean(filters.categoryId),
      });
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleSave}
      disabled={saved && !justSaved}
      className="h-11 gap-2 rounded-xl border-[rgba(148,163,184,0.25)] bg-white"
      title={saved ? "Этот поиск уже сохранён" : "Сохранить текущий поиск"}
    >
      {saved ? (
        <BookmarkCheck className="size-4 text-[#059669]" aria-hidden="true" />
      ) : (
        <Bookmark className="size-4" aria-hidden="true" />
      )}
      {justSaved ? "Поиск сохранён" : saved ? "Сохранено" : "Сохранить поиск"}
    </Button>
  );
}
