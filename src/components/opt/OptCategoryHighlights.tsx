"use client";

import { VerticalCategoryHighlights } from "@/components/verticals/VerticalCategoryHighlights";
import type { VerticalCategoryItem } from "@/components/verticals/VerticalCategoryHighlights";
import { getOptCategoryVisual } from "@/features/opt/opt-category-visuals";

type OptCategoryHighlightsProps = {
  categories: VerticalCategoryItem[];
};

export function OptCategoryHighlights({ categories }: OptCategoryHighlightsProps) {
  return (
    <VerticalCategoryHighlights
      vertical="OPT"
      categories={categories}
      accent="blue"
      getVisual={getOptCategoryVisual}
      headingId="opt-categories-heading"
      drawerDescription="Раздел «ТутОпт» — выберите категорию"
      drawerNavLabel="Все оптовые категории"
    />
  );
}
