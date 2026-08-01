"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { SearchWithSuggest } from "@/components/search/SearchWithSuggest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type SearchType = "companies" | "directions" | "services" | "requests";

const SEARCH_TYPES: Array<{
  value: SearchType;
  labelKey: DictionaryKey;
  authOnly?: boolean;
}> = [
  { value: "companies", labelKey: "cargo.searchTypeCompanies" },
  { value: "directions", labelKey: "cargo.searchTypeDirections" },
  { value: "services", labelKey: "cargo.searchTypeServices" },
  { value: "requests", labelKey: "cargo.searchTypeRequests", authOnly: true },
];

type CargoLandingSearchProps = {
  isAuthenticated: boolean;
};

export function CargoLandingSearch({ isAuthenticated }: CargoLandingSearchProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchType, setSearchType] = useState<SearchType>("companies");
  const [query, setQuery] = useState("");

  const availableTypes = SEARCH_TYPES.filter(
    (item) => !item.authOnly || isAuthenticated,
  );

  function handleSimpleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();

    if (searchType === "requests") {
      if (!isAuthenticated) {
        router.push(buildLoginUrl("/seller/cargo-requests"));
        return;
      }
      router.push(
        trimmed
          ? `/seller/cargo-requests?q=${encodeURIComponent(trimmed)}`
          : "/seller/cargo-requests",
      );
      return;
    }

    const href = trimmed
      ? `/listings?vertical=CARGO&q=${encodeURIComponent(trimmed)}`
      : "/listings?vertical=CARGO";
    router.push(href);
  }

  return (
    <section
      aria-label={t("cargo.searchPlaceholder")}
      className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-3.5"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <label className="sr-only" htmlFor="cargo-search-type">
          {t("cargo.searchTypeCompanies")}
        </label>
        <select
          id="cargo-search-type"
          value={searchType}
          onChange={(event) => setSearchType(event.target.value as SearchType)}
          className={cn(
            "h-11 w-full shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-800",
            "dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:w-[11.5rem]",
          )}
        >
          {availableTypes.map((item) => (
            <option key={item.value} value={item.value}>
              {t(item.labelKey)}
            </option>
          ))}
        </select>

        {searchType === "companies" ? (
          <div className="min-w-0 flex-1">
            <SearchWithSuggest
              variant="phrase"
              placeholder={t("cargo.searchPlaceholder")}
              buttonLabel={t("search.find")}
              className="min-w-0 w-full"
            />
          </div>
        ) : (
          <form onSubmit={handleSimpleSubmit} className="flex min-w-0 flex-1 gap-2">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("cargo.searchPlaceholder")}
              className="h-11 min-w-0 flex-1 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-950"
            />
            <Button
              type="submit"
              className="h-11 shrink-0 rounded-xl bg-orange-500 px-4 text-white hover:bg-orange-600"
            >
              <Search className="size-4 sm:mr-1.5" aria-hidden="true" />
              <span className="hidden sm:inline">{t("search.find")}</span>
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
