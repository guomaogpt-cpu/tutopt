"use client";

import { useMemo, useState } from "react";
import { getCategoryPath, searchCategories } from "@/features/listings/lib/category-tree";
import {
  getCategoryEmoji,
  getDescendantIds,
  getRootCategories,
} from "@/features/listings/lib/category-search";
import type { CategoryItem } from "@/features/listings/types/category";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";

type CategoryPickerProps = {
  categories: CategoryItem[];
  value: string;
  onChange: (categoryId: string) => void;
  disabled?: boolean;
  error?: string;
};

export function CategoryPicker({
  categories,
  value,
  onChange,
  disabled = false,
  error,
}: CategoryPickerProps) {
  const roots = useMemo(() => getRootCategories(categories), [categories]);
  const [selectedRootId, setSelectedRootId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedPath = value ? getCategoryPath(categories, value).join(" → ") : "";
  const selectedRoot = roots.find((root) => root.id === selectedRootId);

  const searchResults = useMemo(() => {
    const normalized = searchQuery.trim();
    if (!normalized) {
      return [];
    }

    const allResults = searchCategories(categories, normalized);

    if (!selectedRootId) {
      return allResults;
    }

    const scope = getDescendantIds(categories, selectedRootId);
    const scoped = allResults.filter((result) => scope.has(result.id));
    const rest = allResults.filter((result) => !scope.has(result.id));

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

  if (value) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Категория</p>
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
      <p className="text-sm font-medium text-foreground">Категория</p>

      {!selectedRootId ? (
        <div className="animate-fade-in-up space-y-3">
          <p className="text-sm text-muted-foreground">Шаг 1 — выберите основное направление</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {roots.map((root) => (
              <Button
                key={root.id}
                type="button"
                variant="outline"
                disabled={disabled}
                onClick={() => handleRootSelect(root.id)}
                className="h-auto flex-col gap-3 px-4 py-5 text-center hover:border-primary/40"
              >
                <span className="text-3xl">{getCategoryEmoji(root)}</span>
                <span className="text-sm font-semibold leading-snug">{root.name}</span>
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <Card className="animate-fade-in-up bg-muted/20">
          <CardContent className="space-y-4 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getCategoryEmoji(selectedRoot ?? roots[0])}</span>
                <div>
                  <Badge variant="secondary" className="mb-1">
                    Шаг 2
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
              placeholder="Начните вводить категорию..."
              disabled={disabled}
              containerClassName="w-full"
            />

            {searchQuery.trim() ? (
              <ul className="max-h-72 space-y-2 overflow-y-auto">
                {searchResults.length === 0 ? (
                  <li className="rounded-xl border bg-background px-4 py-6 text-center text-sm text-muted-foreground">
                    Категории не найдены. Попробуйте другой запрос.
                  </li>
                ) : (
                  searchResults.map((result) => (
                    <li key={result.id}>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={disabled}
                        onClick={() => {
                          onChange(result.id);
                          setSearchQuery("");
                        }}
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
            ) : (
              <p className="rounded-xl border bg-background px-4 py-5 text-sm text-muted-foreground">
                Введите название категории — например, «моющ», «цемент», «рис». Поиск работает по всей
                базе категорий.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
