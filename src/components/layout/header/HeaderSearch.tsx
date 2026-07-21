"use client";

import { Search } from "lucide-react";
import { SearchWithSuggest } from "@/components/search/SearchWithSuggest";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { cn } from "@/lib/utils";

const HEADER_SEARCH_PLACEHOLDER = "Найти товар, услугу или доставку...";

type HeaderSearchProps = {
  id?: string;
  className?: string;
  syncDisabled?: boolean;
  inputClassName?: string;
};

export function HeaderSearch(props: HeaderSearchProps) {
  if (props.syncDisabled) {
    return <HeaderSearchStatic {...props} />;
  }

  return (
    <SearchWithSuggest
      variant="header"
      placeholder={HEADER_SEARCH_PLACEHOLDER}
      {...props}
    />
  );
}

function HeaderSearchStatic({
  id = "header-search",
  className = "",
  inputClassName = "",
}: HeaderSearchProps) {
  return (
    <form className={cn("flex min-w-0 items-center gap-2", className)}>
      <label htmlFor={id} className="sr-only">
        Поиск объявлений
      </label>
      <SearchInput
        id={id}
        disabled
        placeholder={HEADER_SEARCH_PLACEHOLDER}
        containerClassName="min-w-0 flex-1"
        className={cn("h-10 rounded-xl bg-white", inputClassName)}
      />
      <Button
        type="button"
        disabled
        size="icon"
        className="h-10 w-10 shrink-0 bg-[#2563EB] hover:bg-[#1D4ED8] sm:hidden"
        aria-label="Найти"
      >
        <Search className="size-4" aria-hidden="true" />
      </Button>
      <Button
        type="button"
        disabled
        className="hidden h-10 shrink-0 bg-[#2563EB] hover:bg-[#1D4ED8] sm:inline-flex"
      >
        Найти
      </Button>
    </form>
  );
}
