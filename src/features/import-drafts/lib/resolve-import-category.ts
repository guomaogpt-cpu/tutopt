import type { ListingVertical } from "@prisma/client";
import { mapExternalCategory } from "@/server/import/category-mapper";
import { ValidationError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

export type ResolvedImportCategory = {
  categoryId: string;
  vertical: ListingVertical;
  categorySlug: string;
  subcategorySlug: string | null;
};

async function findCategoryBySlug(slug: string) {
  return prisma.category.findFirst({
    where: {
      is_active: true,
      slug,
    },
    select: {
      id: true,
      slug: true,
      vertical: true,
      parent_id: true,
    },
  });
}

export async function resolveImportCategorySlug(params: {
  normalizedCategory: string | null;
  normalizedSubcategory: string | null;
  title?: string | null;
  description?: string | null;
}): Promise<ResolvedImportCategory> {
  const slugCandidates = [params.normalizedSubcategory, params.normalizedCategory].filter(
    (value): value is string => Boolean(value?.trim()),
  );

  for (const slug of slugCandidates) {
    const category = await findCategoryBySlug(slug.trim());
    if (category) {
      return {
        categoryId: category.id,
        vertical: category.vertical,
        categorySlug: category.slug,
        subcategorySlug: category.parent_id ? category.slug : null,
      };
    }
  }

  const mapped = mapExternalCategory({
    categoryText: params.normalizedCategory,
    subcategoryText: params.normalizedSubcategory,
    title: params.title,
    description: params.description,
  });

  const mappedCandidates = [mapped.normalizedSubcategory, mapped.normalizedCategory].filter(
    (value): value is string => Boolean(value),
  );

  for (const slug of mappedCandidates) {
    const category = await findCategoryBySlug(slug);
    if (category) {
      return {
        categoryId: category.id,
        vertical: category.vertical,
        categorySlug: mapped.normalizedCategory ?? category.slug,
        subcategorySlug: mapped.normalizedSubcategory,
      };
    }
  }

  if (params.normalizedCategory) {
    const byName = await prisma.category.findFirst({
      where: {
        is_active: true,
        name: { equals: params.normalizedCategory, mode: "insensitive" },
      },
      select: { id: true, slug: true, vertical: true, parent_id: true },
    });

    if (byName) {
      return {
        categoryId: byName.id,
        vertical: byName.vertical,
        categorySlug: byName.slug,
        subcategorySlug: byName.parent_id ? byName.slug : null,
      };
    }
  }

  throw new ValidationError("Укажите категорию перед публикацией.", {
    fieldErrors: {
      category: ["Выберите категорию из списка перед публикацией."],
    },
  });
}

export async function validateImportCategorySlugs(params: {
  normalizedCategory: string | null;
  normalizedSubcategory: string | null;
}): Promise<boolean> {
  const slugCandidates = [params.normalizedSubcategory, params.normalizedCategory].filter(
    (value): value is string => Boolean(value?.trim()),
  );

  for (const slug of slugCandidates) {
    const category = await findCategoryBySlug(slug.trim());
    if (category) {
      return true;
    }
  }

  return false;
}
