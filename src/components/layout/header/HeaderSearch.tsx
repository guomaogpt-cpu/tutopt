"use client";

import { Search } from "lucide-react";
import { PhotoSearchButton } from "@/components/search/PhotoSearchButton";
import { SearchWithSuggest } from "@/components/search/SearchWithSuggest";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type HeaderSearchProps = {
  id?: string;
  className?: string;
  syncDisabled?: boolean;
  inputClassName?: string;
};

export function HeaderSearch(props: HeaderSearchProps) {
  const { t } = useTranslation();
  const placeholder = t("search.headerPlaceholder");

  if (props.syncDisabled) {
    return <HeaderSearchStatic {...props} placeholder={placeholder} />;
  }

  return (
    <SearchWithSuggest
      variant="header"
      placeholder={placeholder}
      buttonLabel={t("search.find")}
      {...props}
    />
  );
}

function HeaderSearchStatic({
  id = "header-search",
  className = "",
  inputClassName = "",
  placeholder,
}: HeaderSearchProps & { placeholder: string }) {
  const { t } = useTranslation();

  return (
    <form className={cn("flex min-w-0 items-center gap-2", className)}>
      <label htmlFor={id} className="sr-only">
        {t("search.listingsLabel")}
      </label>
      <div className="relative min-w-0 flex-1">
        <SearchInput
          id={id}
          disabled
          placeholder={placeholder}
          containerClassName="min-w-0 w-full"
          className={cn(
            "h-10 rounded-xl bg-white pr-12 dark:bg-slate-900 dark:text-slate-100",
            inputClassName,
          )}
        />
        <div className="absolute right-1.5 top-1/2 z-10 -translate-y-1/2">
          <PhotoSearchButton
            sizeClassName="size-8"
            className="border-transparent bg-transparent shadow-none hover:border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
          />
        </div>
      </div>
      <Button
        type="button"
        disabled
        size="icon"
        className="h-10 w-10 shrink-0 bg-[#2563EB] hover:bg-[#1D4ED8] sm:hidden"
        aria-label={t("search.find")}
      >
        <Search className="size-4" aria-hidden="true" />
      </Button>
      <Button
        type="button"
        disabled
        className="hidden h-10 shrink-0 bg-[#2563EB] hover:bg-[#1D4ED8] sm:inline-flex"
      >
        {t("search.find")}
      </Button>
    </form>
  );
}
