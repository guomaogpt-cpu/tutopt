"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { SearchSuggestDropdown } from "@/components/search/SearchSuggestDropdown";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import {
  buildListingsCatalogQueryString,
  parseListingsCatalogParams,
} from "@/features/listings/lib/listings-catalog";
import { fetchSearchSuggestions } from "@/features/search/lib/search-suggest-client";
import {
  EMPTY_SEARCH_SUGGEST_RESPONSE,
  SEARCH_SUGGEST_DEBOUNCE_MS,
  SEARCH_SUGGEST_MIN_LENGTH,
  type SearchSuggestResponse,
} from "@/features/search/lib/search-suggest-types";
import { resolveSearchVertical } from "@/features/verticals/verticals";
import { trackSearch } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

export type SearchWithSuggestProps = {
  id?: string;
  variant?: "header" | "hero";
  placeholder?: string;
  buttonLabel?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
};

export function SearchWithSuggest({
  id,
  variant = "header",
  placeholder,
  buttonLabel,
  className = "",
  inputClassName = "",
  disabled = false,
}: SearchWithSuggestProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const generatedId = useId();
  const inputId = id ?? `search-with-suggest-${generatedId}`;
  const dropdownId = `${inputId}-dropdown`;
  const containerRef = useRef<HTMLDivElement>(null);

  const urlQuery = pathname === "/listings" ? (searchParams.get("q") ?? "") : "";
  const [query, setQuery] = useState(urlQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestResponse>(
    EMPTY_SEARCH_SUGGEST_RESPONSE,
  );

  const isHero = variant === "hero";
  const resolvedPlaceholder =
    placeholder ?? (isHero ? "Что вы ищете?" : "Найти товары, услуги…");
  const resolvedButtonLabel = buttonLabel ?? (isHero ? "Найти" : "Найти");
  const searchVertical = resolveSearchVertical(pathname, searchParams);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < SEARCH_SUGGEST_MIN_LENGTH) {
      setSuggestions(EMPTY_SEARCH_SUGGEST_RESPONSE);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const controller = new AbortController();

    const timer = window.setTimeout(() => {
      void fetchSearchSuggestions(trimmed, controller.signal, searchVertical)
        .then((result) => {
          if (!controller.signal.aborted) {
            setSuggestions(result);
          }
        })
        .catch(() => {
          if (!controller.signal.aborted) {
            setSuggestions(EMPTY_SEARCH_SUGGEST_RESPONSE);
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setIsLoading(false);
          }
        });
    }, SEARCH_SUGGEST_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, searchVertical]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  function navigateWithQuery(nextQuery: string) {
    if (pathname === "/listings") {
      const filters = parseListingsCatalogParams(
        Object.fromEntries(searchParams.entries()),
      );
      const href = `/listings${buildListingsCatalogQueryString(filters, {
        q: nextQuery.trim(),
        page: 1,
      })}`;
      router.push(href);
      return;
    }

    const trimmed = nextQuery.trim();
    const vertical = resolveSearchVertical(pathname, searchParams);
    const params = new URLSearchParams();
    if (trimmed) {
      params.set("q", trimmed);
    }
    if (vertical) {
      params.set("vertical", vertical);
    }
    const queryString = params.toString();
    router.push(queryString ? `/listings?${queryString}` : "/listings");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsOpen(false);
    const trimmed = query.trim();
    if (trimmed) {
      trackSearch(trimmed, searchVertical);
    }
    navigateWithQuery(query);
  }

  function handleClear() {
    setQuery("");
    setSuggestions(EMPTY_SEARCH_SUGGEST_RESPONSE);
    setIsOpen(false);
    navigateWithQuery("");
  }

  function handleInputChange(value: string) {
    setQuery(value);
    if (value.trim().length >= SEARCH_SUGGEST_MIN_LENGTH) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
      setSuggestions(EMPTY_SEARCH_SUGGEST_RESPONSE);
    }
  }

  function handleSelectSuggestion() {
    setIsOpen(false);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  function handleInputFocus() {
    if (query.trim().length >= SEARCH_SUGGEST_MIN_LENGTH) {
      setIsOpen(true);
    }
  }

  if (isHero) {
    return (
      <form
        onSubmit={handleSubmit}
        className={cn("w-full min-w-0 max-w-[760px] overflow-x-clip", className)}
      >
        <label htmlFor={inputId} className="sr-only">
          Поиск оптовых товаров
        </label>
        <div className="flex flex-col md:flex-row md:items-stretch">
          <div ref={containerRef} className="relative z-20 min-w-0 w-full flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 z-10 size-[18px] -translate-y-1/2 text-muted-foreground md:left-4 md:size-5"
              aria-hidden="true"
            />
            <input
              id={inputId}
              type="search"
              role="combobox"
              value={query}
              disabled={disabled}
              onChange={(event) => handleInputChange(event.target.value)}
              onFocus={handleInputFocus}
              onKeyDown={handleInputKeyDown}
              placeholder={resolvedPlaceholder}
              autoComplete="off"
              aria-expanded={isOpen}
              aria-controls={dropdownId}
              aria-autocomplete="list"
              className={cn(
                "h-12 w-full min-w-0 rounded-[14px] border border-input bg-white py-0 pl-10 pr-3 text-[15px] text-slate-900 shadow-sm transition placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                "md:h-14 md:rounded-l-2xl md:rounded-r-none md:border-r-0 md:pl-12 md:pr-4",
                inputClassName,
              )}
            />
            <SearchSuggestDropdown
              id={dropdownId}
              query={query}
              isOpen={isOpen}
              isLoading={isLoading}
              suggestions={suggestions}
              catalogVertical={searchVertical}
              onSelect={handleSelectSuggestion}
            />
          </div>
          <Button
            type="submit"
            disabled={disabled}
            className="mt-2.5 h-12 w-full shrink-0 rounded-[14px] bg-[#2563EB] px-5 hover:bg-[#1D4ED8] md:mt-0 md:h-14 md:w-[180px] md:rounded-l-none md:rounded-r-2xl"
          >
            {resolvedButtonLabel}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex min-w-0 items-center gap-2", className)}>
      <label htmlFor={inputId} className="sr-only">
        Поиск объявлений
      </label>
      <div ref={containerRef} className="relative min-w-0 flex-1">
        <SearchInput
          id={inputId}
          role="combobox"
          value={query}
          disabled={disabled}
          onChange={(event) => handleInputChange(event.target.value)}
          onFocus={handleInputFocus}
          onKeyDown={handleInputKeyDown}
          onClear={handleClear}
          placeholder={resolvedPlaceholder}
          autoComplete="off"
          aria-expanded={isOpen}
          aria-controls={dropdownId}
          aria-autocomplete="list"
          containerClassName="w-full"
          className={cn("h-10 rounded-xl bg-white", inputClassName)}
        />
        <SearchSuggestDropdown
          id={dropdownId}
          query={query}
          isOpen={isOpen}
          isLoading={isLoading}
          suggestions={suggestions}
          catalogVertical={searchVertical}
          onSelect={handleSelectSuggestion}
        />
      </div>
      <Button
        type="submit"
        size="icon"
        disabled={disabled}
        className="h-10 w-10 shrink-0 bg-[#2563EB] hover:bg-[#1D4ED8] sm:hidden"
        aria-label={resolvedButtonLabel}
      >
        <Search className="size-4" aria-hidden="true" />
      </Button>
      <Button
        type="submit"
        disabled={disabled}
        className="hidden h-10 shrink-0 bg-[#2563EB] hover:bg-[#1D4ED8] sm:inline-flex"
      >
        {resolvedButtonLabel}
      </Button>
    </form>
  );
}
