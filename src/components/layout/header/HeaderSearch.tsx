"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import {
  buildListingsCatalogQueryString,
  parseListingsCatalogParams,
} from "@/features/listings/lib/listings-catalog";

type HeaderSearchProps = {
  id?: string;
  className?: string;
  syncDisabled?: boolean;
};

export function HeaderSearch(props: HeaderSearchProps) {
  if (props.syncDisabled) {
    return <HeaderSearchStatic {...props} />;
  }

  return <HeaderSearchInner {...props} />;
}

function HeaderSearchStatic({ id = "header-search", className = "" }: HeaderSearchProps) {
  return (
    <form className={className}>
      <label htmlFor={id} className="sr-only">
        Поиск товаров оптом
      </label>
      <div className="relative">
        <input
          id={id}
          type="search"
          disabled
          placeholder="Найти товары оптом..."
          className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-11 text-sm text-slate-900 shadow-sm"
        />
      </div>
    </form>
  );
}

function HeaderSearchInner({ id = "header-search", className = "" }: HeaderSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = pathname === "/listings" ? (searchParams.get("q") ?? "") : "";
  const [query, setQuery] = useState(urlQuery);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

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
    router.push(trimmed ? `/listings?q=${encodeURIComponent(trimmed)}` : "/listings");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigateWithQuery(query);
  }

  function handleClear() {
    setQuery("");
    navigateWithQuery("");
  }

  const showClear = query.length > 0;

  return (
    <form onSubmit={handleSubmit} className={className}>
      <label htmlFor={id} className="sr-only">
        Поиск товаров оптом
      </label>
      <div className="relative">
        <input
          id={id}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Найти товары оптом..."
          className={`w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-4 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${showClear ? "pr-20" : "pr-11"}`}
        />
        {showClear ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Очистить поиск"
            className="absolute inset-y-0 right-10 inline-flex w-8 items-center justify-center rounded-lg text-slate-400 transition hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
        <button
          type="submit"
          aria-label="Искать"
          className="absolute inset-y-0 right-0 inline-flex w-10 items-center justify-center rounded-r-xl text-slate-500 transition hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
