"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ImportCategoryOption } from "@/features/import-drafts/lib/get-import-category-options";

type ImportCategorySelectProps = {
  categories: ImportCategoryOption[];
  categorySlug: string;
  subcategorySlug: string;
  onCategoryChange: (slug: string) => void;
  onSubcategoryChange: (slug: string) => void;
  disabled?: boolean;
};

export function ImportCategorySelect({
  categories,
  categorySlug,
  subcategorySlug,
  onCategoryChange,
  onSubcategoryChange,
  disabled = false,
}: ImportCategorySelectProps) {
  const parentOptions = categories.filter((category) => category.parentSlug === null);
  const leafOptions = categories.filter((category) => category.parentSlug !== null);

  const selectedLeaf = subcategorySlug || categorySlug;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <label htmlFor="import-category-parent" className="text-sm font-medium text-slate-900 dark:text-slate-100">
          Категория
        </label>
        <Select
          value={categorySlug || undefined}
          onValueChange={(value) => {
            onCategoryChange(value);
            if (subcategorySlug) {
              const stillValid = leafOptions.some(
                (option) => option.slug === subcategorySlug && option.parentSlug === value,
              );
              if (!stillValid) {
                onSubcategoryChange("");
              }
            }
          }}
          disabled={disabled}
        >
          <SelectTrigger id="import-category-parent">
            <SelectValue placeholder="Выберите категорию" />
          </SelectTrigger>
          <SelectContent>
            {parentOptions.map((option) => (
              <SelectItem key={option.slug} value={option.slug}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="import-category-leaf" className="text-sm font-medium text-slate-900 dark:text-slate-100">
          Подкатегория для публикации
        </label>
        <Select
          value={selectedLeaf || undefined}
          onValueChange={(value) => {
            const option = leafOptions.find((item) => item.slug === value);
            onSubcategoryChange(value);
            if (option?.parentSlug) {
              onCategoryChange(option.parentSlug);
            }
          }}
          disabled={disabled}
        >
          <SelectTrigger id="import-category-leaf">
            <SelectValue placeholder="Выберите подкатегорию" />
          </SelectTrigger>
          <SelectContent>
            {leafOptions
              .filter((option) => !categorySlug || option.parentSlug === categorySlug)
              .map((option) => (
                <SelectItem key={option.slug} value={option.slug}>
                  {option.label}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-[#64748B]">
          Для публикации используется slug подкатегории из справочника проекта.
        </p>
      </div>
    </div>
  );
}
