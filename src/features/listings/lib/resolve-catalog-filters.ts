import type { ListingVertical } from "@prisma/client";
import {
  getCategorySeoSlug,
  getCategorySlugCandidates,
} from "@/features/seo/category-seo-slug";
import { getDescendantIds } from "@/features/listings/lib/category-search";
import type { ListingsCatalogFilters } from "@/features/listings/lib/listings-catalog";
import type { CategoryItem } from "@/features/listings/types/category";

export type ResolvedCatalogFilters = {
  filters: ListingsCatalogFilters;
  categoryIds: string[] | null;
};

function resolveCategoryRef(
  ref: string,
  categories: readonly CategoryItem[],
  vertical: ListingVertical | null,
): CategoryItem | null {
  const trimmed = ref.trim();
  if (!trimmed) {
    return null;
  }

  const byId = categories.find((category) => category.id === trimmed);
  if (byId) {
    return byId;
  }

  const lower = trimmed.toLowerCase();

  for (const category of categories) {
    if (category.slug === lower) {
      return category;
    }
    const categoryVertical = category.vertical ?? vertical;
    if (
      categoryVertical &&
      getCategorySeoSlug({ slug: category.slug, vertical: categoryVertical }) === lower
    ) {
      return category;
    }
  }

  if (vertical) {
    for (const slug of getCategorySlugCandidates(vertical, lower)) {
      const found = categories.find((category) => category.slug === slug);
      if (found) {
        return found;
      }
    }
  }

  return categories.find((category) => category.slug.endsWith(lower)) ?? null;
}

export function resolveCatalogCategoryFilter(
  filters: ListingsCatalogFilters,
  categories: readonly CategoryItem[],
  rawCategory: string,
  rawSubcategory: string,
): ResolvedCatalogFilters {
  const resolvedSubcategory = rawSubcategory
    ? resolveCategoryRef(rawSubcategory, categories, filters.vertical)
    : null;
  const resolvedCategory = rawCategory
    ? resolveCategoryRef(rawCategory, categories, filters.vertical)
    : null;

  let categoryId = filters.categoryId;
  let subcategoryId = filters.subcategoryId;

  if (resolvedSubcategory) {
    subcategoryId = resolvedSubcategory.id;
    categoryId = resolvedSubcategory.parent_id ?? categoryId;
  } else if (resolvedCategory) {
    categoryId = resolvedCategory.id;
    subcategoryId = "";
  }

  const nextFilters: ListingsCatalogFilters = {
    ...filters,
    categoryId,
    subcategoryId,
  };

  let categoryIds: string[] | null = null;
  if (subcategoryId) {
    categoryIds = [subcategoryId];
  } else if (categoryId) {
    categoryIds = Array.from(getDescendantIds([...categories], categoryId));
  }

  return { filters: nextFilters, categoryIds };
}
