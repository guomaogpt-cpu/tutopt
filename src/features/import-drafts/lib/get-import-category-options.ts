import { prisma } from "@/shared/lib/prisma";

export type ImportCategoryOption = {
  slug: string;
  label: string;
  parentSlug: string | null;
  vertical: string;
};

export async function getImportCategoryOptions(): Promise<ImportCategoryOption[]> {
  const categories = await prisma.category.findMany({
    where: { is_active: true },
    select: {
      slug: true,
      name: true,
      vertical: true,
      parent_id: true,
      parent: {
        select: {
          slug: true,
          name: true,
        },
      },
    },
    orderBy: [{ parent_id: "asc" }, { sort_order: "asc" }, { name: "asc" }],
  });

  return categories.map((category) => ({
    slug: category.slug,
    label: category.parent ? `${category.parent.name} → ${category.name}` : category.name,
    parentSlug: category.parent?.slug ?? null,
    vertical: category.vertical,
  }));
}
