"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import type {
  SuggestedCategory,
  SuggestedCharacteristic,
} from "@/lib/listings/listing-autosuggest";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ListingAutosuggestCardProps = {
  categorySuggestion: SuggestedCategory | null;
  characteristicSuggestions: readonly SuggestedCharacteristic[];
  showCategory: boolean;
  showCharacteristics: boolean;
  onChooseCategory: (suggestion: SuggestedCategory) => void;
  onApplyCharacteristics: () => void;
  onDismissCategory: () => void;
  onDismissCharacteristics: () => void;
  disabled?: boolean;
  className?: string;
};

export function ListingAutosuggestCard({
  categorySuggestion,
  characteristicSuggestions,
  showCategory,
  showCharacteristics,
  onChooseCategory,
  onApplyCharacteristics,
  onDismissCategory,
  onDismissCharacteristics,
  disabled = false,
  className,
}: ListingAutosuggestCardProps) {
  const { t } = useTranslation();

  if (!showCategory && !showCharacteristics) {
    return null;
  }

  return (
    <div
      className={cn(
        "space-y-3 rounded-xl border border-sky-200 bg-sky-50/80 p-3 dark:border-sky-900 dark:bg-sky-950/30 sm:p-3.5",
        className,
      )}
      role="status"
    >
      {showCategory && categorySuggestion ? (
        <div className="space-y-2">
          <p className="text-sm text-slate-800 dark:text-slate-100">
            {t("listingAutosuggest.categoryHint").replace(
              "{category}",
              categorySuggestion.name,
            )}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              size="sm"
              disabled={disabled}
              className="h-10 w-full rounded-xl sm:w-auto"
              onClick={() => onChooseCategory(categorySuggestion)}
            >
              {t("listingAutosuggest.chooseCategory")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={disabled}
              className="h-10 w-full rounded-xl text-slate-600 sm:w-auto dark:text-slate-300"
              onClick={onDismissCategory}
            >
              {t("listingAutosuggest.dismiss")}
            </Button>
          </div>
        </div>
      ) : null}

      {showCharacteristics && characteristicSuggestions.length > 0 ? (
        <div
          className={cn(
            "space-y-2",
            showCategory && categorySuggestion
              ? "border-t border-sky-200/80 pt-3 dark:border-sky-900"
              : null,
          )}
        >
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
            {t("listingAutosuggest.characteristicsHint")}
          </p>
          <ul className="space-y-0.5 text-sm text-slate-700 dark:text-slate-200">
            {characteristicSuggestions.map((item) => (
              <li key={item.fieldId}>
                {item.label}: {item.displayValue}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              size="sm"
              disabled={disabled}
              className="h-10 w-full rounded-xl sm:w-auto"
              onClick={onApplyCharacteristics}
            >
              {t("listingAutosuggest.apply")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={disabled}
              className="h-10 w-full rounded-xl text-slate-600 sm:w-auto dark:text-slate-300"
              onClick={onDismissCharacteristics}
            >
              {t("listingAutosuggest.dismiss")}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
