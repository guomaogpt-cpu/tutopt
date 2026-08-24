import { Search, X } from "lucide-react";
import * as React from "react";
import { searchInputMobileProps } from "@/features/search/lib/search-form";
import { cn } from "@/lib/utils";

export type SearchInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  onClear?: () => void;
  containerClassName?: string;
  clearButtonClassName?: string;
};

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, containerClassName, clearButtonClassName, value, onClear, disabled, ...props }, ref) => {
    const hasValue = value !== undefined && value !== "";

    return (
      <div className={cn("relative", containerClassName)}>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          ref={ref}
          {...searchInputMobileProps}
          value={value}
          disabled={disabled}
          className={cn(
            "flex h-10 w-full rounded-xl border border-input bg-background py-2 pl-10 pr-10 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        />
        {hasValue && onClear && !disabled ? (
          <button
            type="button"
            onClick={onClear}
            className={cn(
              "absolute right-2 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground",
              clearButtonClassName,
            )}
            aria-label="Очистить поиск"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>
    );
  },
);
SearchInput.displayName = "SearchInput";

export { SearchInput };
