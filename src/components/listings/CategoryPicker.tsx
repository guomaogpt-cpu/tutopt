"use client";

import { useMemo, useState } from "react";
import { getCategoryPath, searchCategories } from "@/features/listings/lib/category-tree";
import {
  getCategoryEmoji,
  getDescendantIds,
  getRootCategories,
} from "@/features/listings/lib/category-search";
import type { CategoryItem } from "@/features/listings/types/category";

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
    onChange("");
  }

  if (value) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">Категория</p>
        <div className="flex items-start justify-between gap-4 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-white px-5 py-4 shadow-sm">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-blue-600">Выбрано</p>
            <p className="mt-1 text-base font-semibold text-slate-900">{selectedPath}</p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            disabled={disabled}
            className="shrink-0 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
          >
            Изменить
          </button>
        </div>
        {error ? <p className="text-xs text-red-600">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-slate-700">Категория</p>

      {!selectedRootId ? (
        <div className="animate-fade-in-up space-y-3">
          <p className="text-sm text-slate-500">Шаг 1 — выберите основное направление</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {roots.map((root) => (
              <button
                key={root.id}
                type="button"
                disabled={disabled}
                onClick={() => handleRootSelect(root.id)}
                className="group flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg"
              >
                <span className="text-3xl transition group-hover:scale-110">{getCategoryEmoji(root)}</span>
                <span className="mt-3 text-sm font-semibold leading-snug text-slate-900">{root.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="animate-fade-in-up space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getCategoryEmoji(selectedRoot ?? roots[0])}</span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Шаг 2</p>
                <p className="font-semibold text-slate-900">{selectedRoot?.name}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedRootId(null);
                setSearchQuery("");
              }}
              disabled={disabled}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              ← Назад
            </button>
          </div>

          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Начните вводить категорию..."
              disabled={disabled}
              autoFocus
              className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-11 pr-4 text-base shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {searchQuery.trim() ? (
            <ul className="max-h-72 space-y-2 overflow-y-auto">
              {searchResults.length === 0 ? (
                <li className="rounded-xl bg-white px-4 py-6 text-center text-sm text-slate-500">
                  Категории не найдены. Попробуйте другой запрос.
                </li>
              ) : (
                searchResults.map((result) => (
                  <li key={result.id}>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        onChange(result.id);
                        setSearchQuery("");
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm"
                    >
                      <p className="font-medium text-slate-900">{result.label}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{result.path}</p>
                    </button>
                  </li>
                ))
              )}
            </ul>
          ) : (
            <p className="rounded-xl bg-white px-4 py-5 text-sm text-slate-500">
              Введите название категории — например, «моющ», «цемент», «рис». Поиск работает по всей
              базе категорий.
            </p>
          )}
        </div>
      )}

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
