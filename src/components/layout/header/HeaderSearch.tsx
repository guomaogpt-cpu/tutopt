"use client";

import { Search } from "lucide-react";
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
      <SearchInput
        id={id}
        disabled
        placeholder={placeholder}
        containerClassName="min-w-0 flex-1"
        className={cn("h-10 rounded-xl bg-white dark:bg-slate-900 dark:text-slate-100", inputClassName)}
      />
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
