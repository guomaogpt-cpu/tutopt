import type { CategoryItem } from "@/features/listings/types/category";

export type CategoryTreeNode = CategoryItem & {
  children: CategoryTreeNode[];
};

export function buildCategoryTree(categories: CategoryItem[]): CategoryTreeNode[] {
  const nodes = new Map<string, CategoryTreeNode>();

  for (const category of categories) {
    nodes.set(category.id, { ...category, children: [] });
  }

  const roots: CategoryTreeNode[] = [];

  for (const node of nodes.values()) {
    if (node.parent_id && nodes.has(node.parent_id)) {
      nodes.get(node.parent_id)?.children.push(node);
    } else {
      roots.push(node);
    }
  }

  const sortNodes = (items: CategoryTreeNode[]): CategoryTreeNode[] =>
    items
      .sort((a, b) => a.name.localeCompare(b.name, "ru"))
      .map((item) => ({ ...item, children: sortNodes(item.children) }));

  return sortNodes(roots);
}

export function getCategoryPath(
  categories: CategoryItem[],
  categoryId: string,
): string[] {
  const byId = new Map(categories.map((item) => [item.id, item]));
  const path: string[] = [];
  let current = byId.get(categoryId);

  while (current) {
    path.unshift(current.name);
    current = current.parent_id ? byId.get(current.parent_id) : undefined;
  }

  return path;
}

export function searchCategories(
  categories: CategoryItem[],
  query: string,
): { id: string; label: string; path: string }[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  return categories
    .filter((category) => category.name.toLowerCase().includes(normalized))
    .map((category) => {
      const pathParts = getCategoryPath(categories, category.id);
      return {
        id: category.id,
        label: category.name,
        path: pathParts.join(" → "),
      };
    })
    .slice(0, 20);
}

export function findCategoryNode(
  roots: CategoryTreeNode[],
  categoryId: string,
): CategoryTreeNode | undefined {
  for (const root of roots) {
    if (root.id === categoryId) {
      return root;
    }
    const child = findCategoryNode(root.children, categoryId);
    if (child) {
      return child;
    }
  }
  return undefined;
}
