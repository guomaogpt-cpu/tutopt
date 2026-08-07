"use client";

import { useEffect, useMemo, useState } from "react";
import { getCategoryPath } from "@/features/listings/lib/category-tree";
import {
  getCategoryEmoji,
  getChildCategories,
  getDescendantIds,
  getRootCategories,
  searchCategoriesWithSynonyms,
} from "@/features/listings/lib/category-search";
import type { CategoryItem } from "@/features/listings/types/category";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { cn } from "@/lib/utils";

type CategoryPickerProps = {
  categories: CategoryItem[];
  value: string;
  onChange: (categoryId: string) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
};

export function CategoryPicker({
  categories,
  value,
  onChange,
  disabled = false,
  error,
  label = "Категория",
}: CategoryPickerProps) {
  const roots = useMemo(() => getRootCategories(categories), [categories]);
  const [selectedRootId, setSelectedRootId] = useState<string | null>(() => {
    if (!value) {
      return null;
    }
    const path = getCategoryPath(categories, value);
    const root = categories.find(
      (category) => category.parent_id === null && path[0] === category.name,
    );
    return root?.id ?? null;
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!value) {
      setSelectedRootId(null);
      return;
    }

    const path = getCategoryPath(categories, value);
    const root = categories.find(
      (category) => category.parent_id === null && path[0] === category.name,
    );
    setSelectedRootId(root?.id ?? null);
  }, [categories, value]);

  const selectedPath = value ? getCategoryPath(categories, value).join(" → ") : "";
  const selectedRoot = roots.find((root) => root.id === selectedRootId);
  const children = useMemo(
    () => (selectedRootId ? getChildCategories(categories, selectedRootId) : []),
    [categories, selectedRootId],
  );

  const globalSearchResults = useMemo(() => {
    const normalized = searchQuery.trim();
    if (!normalized) {
      return [];
    }
    return searchCategoriesWithSynonyms(categories, normalized);
  }, [categories, searchQuery]);

  const scopedSearchResults = useMemo(() => {
    if (!selectedRootId || !searchQuery.trim()) {
      return [];
    }
    const scope = getDescendantIds(categories, selectedRootId);
    const all = searchCategoriesWithSynonyms(categories, searchQuery);
    const scoped = all.filter((result) => scope.has(result.id));
    const rest = all.filter((result) => !scope.has(result.id));
    return [...scoped, ...rest].slice(0, 24);
  }, [categories, searchQuery, selectedRootId]);

  function handleReset() {
    onChange("");
    setSelectedRootId(null);
    setSearchQuery("");
  }

  function handleRootSelect(rootId: string) {
    setSelectedRootId(rootId);
    setSearchQuery("");
    const hasChildren = categories.some((category) => category.parent_id === rootId);
    if (!hasChildren) {
      onChange(rootId);
      return;
    }
    onChange("");
  }

  function selectCategory(categoryId: string) {
    onChange(categoryId);
    setSearchQuery("");
  }

  if (value) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-start justify-between gap-4 p-4">
            <div className="min-w-0">
              <Badge variant="secondary" className="mb-2">
                Выбрано
              </Badge>
              <p className="text-base font-semibold text-foreground">{selectedPath}</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleReset} disabled={disabled}>
              Изменить
            </Button>
          </CardContent>
        </Card>
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-foreground">{label}</p>

      {!selectedRootId ? (
        <SearchInput
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          onClear={() => setSearchQuery("")}
          placeholder="Например: упаковочное оборудование, станок, холодильник, кафе, насос"
          disabled={disabled}
          containerClassName="w-full"
          aria-label="Найти категорию"
        />
      ) : null}

      {searchQuery.trim() && !selectedRootId ? (
        <ul className="max-h-72 space-y-2 overflow-y-auto">
          {globalSearchResults.length === 0 ? (
            <li className="rounded-xl border bg-background px-4 py-6 text-center text-sm text-muted-foreground">
              Категории не найдены. Попробуйте другой запрос.
            </li>
          ) : (
            globalSearchResults.map((result) => (
              <li key={result.id}>
                <Button
                  type="button"
                  variant="outline"
                  disabled={disabled}
                  onClick={() => selectCategory(result.id)}
                  className="h-auto w-full justify-start px-4 py-3 text-left"
                >
                  <span>
                    <span className="block font-medium">{result.label}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{result.path}</span>
                  </span>
                </Button>
              </li>
            ))
          )}
        </ul>
      ) : null}

      {!selectedRootId && !searchQuery.trim() ? (
        <div className="animate-fade-in-up space-y-3">
          <p className="text-sm text-muted-foreground">Выберите категорию</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {roots.map((root) => {
              const isEquipment = root.slug.includes("oborudovanie");
              return (
                <Button
                  key={root.id}
                  type="button"
                  variant="outline"
                  disabled={disabled}
                  onClick={() => handleRootSelect(root.id)}
                  className={cn(
                    "h-auto min-w-0 flex-col gap-3 whitespace-normal px-3 py-4 text-center hover:border-primary/40 sm:px-4 sm:py-5",
                    isEquipment && "border-sky-300 bg-sky-50/80 dark:border-sky-800 dark:bg-sky-950/30",
                  )}
                >
                  <span className="text-3xl">{getCategoryEmoji(root)}</span>
                  <span className="break-words text-sm font-semibold leading-snug">{root.name}</span>
                </Button>
              );
            })}
          </div>
        </div>
      ) : null}

      {selectedRootId ? (
        <Card className="animate-fade-in-up bg-muted/20">
          <CardContent className="space-y-4 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getCategoryEmoji(selectedRoot ?? roots[0])}</span>
                <div>
                  <Badge variant="secondary" className="mb-1">
                    Подкатегория
                  </Badge>
                  <p className="font-semibold text-foreground">{selectedRoot?.name}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedRootId(null);
                  setSearchQuery("");
                }}
                disabled={disabled}
              >
                ← Назад
              </Button>
            </div>

            <SearchInput
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onClear={() => setSearchQuery("")}
              placeholder="Найти подкатегорию..."
              disabled={disabled}
              containerClassName="w-full"
            />

            {searchQuery.trim() ? (
              <ul className="max-h-72 space-y-2 overflow-y-auto">
                {scopedSearchResults.length === 0 ? (
                  <li className="rounded-xl border bg-background px-4 py-6 text-center text-sm text-muted-foreground">
                    Подкатегории не найдены.
                  </li>
                ) : (
                  scopedSearchResults.map((result) => (
                    <li key={result.id}>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={disabled}
                        onClick={() => selectCategory(result.id)}
                        className="h-auto w-full justify-start px-4 py-3 text-left"
                      >
                        <span>
                          <span className="block font-medium">{result.label}</span>
                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            {result.path}
                          </span>
                        </span>
                      </Button>
                    </li>
                  ))
                )}
              </ul>
            ) : (
              <div className="flex flex-wrap gap-2">
                {children.map((child) => (
                  <Button
                    key={child.id}
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    onClick={() => selectCategory(child.id)}
                    className="h-11 rounded-xl px-3.5 text-sm font-medium"
                  >
                    {child.name}
                  </Button>
                ))}
                {children.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Нет подкатегорий — выберите направление выше.</p>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}

      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
