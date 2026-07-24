"use client";

import { VerticalCategoryHighlights } from "@/components/verticals/VerticalCategoryHighlights";
import type { VerticalCategoryItem } from "@/components/verticals/VerticalCategoryHighlights";
import { getMarketCategoryVisual } from "@/features/market/market-category-visuals";

type MarketCategoryHighlightsProps = {
  categories: VerticalCategoryItem[];
};

export function MarketCategoryHighlights({
  categories,
}: MarketCategoryHighlightsProps) {
  return (
    <VerticalCategoryHighlights
      vertical="MARKET"
      categories={categories}
      accent="violet"
      getVisual={getMarketCategoryVisual}
      headingId="market-categories-heading"
      drawerDescription="Раздел «Объявления» — выберите категорию"
      drawerNavLabel="Все категории объявлений"
    />
  );
}
