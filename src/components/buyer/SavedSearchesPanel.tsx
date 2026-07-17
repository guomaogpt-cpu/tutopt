"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bookmark, Trash2 } from "lucide-react";
import type { ListingVertical } from "@prisma/client";
import { isListingVertical, VERTICALS } from "@/features/verticals/verticals";
import { trackSavedSearch } from "@/lib/analytics/events";
import {
  getSavedSearches,
  removeSavedSearch,
  type SavedSearch,
} from "@/lib/saved-searches/local-saved-searches";
import { Button } from "@/components/ui/button";

const VISIBLE_LIMIT = 10;

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function resolveVertical(value: string | null): ListingVertical | null {
  return value && isListingVertical(value) ? value : null;
}

function formatSavedDate(value: string): string {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "" : dateFormatter.format(parsed);
}

export function SavedSearchesPanel() {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSearches(getSavedSearches());
    setLoaded(true);
  }, []);

  function handleRemove(search: SavedSearch) {
    removeSavedSearch(search.id);
    setSearches(getSavedSearches());
    trackSavedSearch("remove", {
      vertical: resolveVertical(search.vertical),
      hasQuery: Boolean(search.query),
      hasCategory: search.url.includes("category="),
    });
  }

  function handleOpen(search: SavedSearch) {
    trackSavedSearch("open", {
      vertical: resolveVertical(search.vertical),
      hasQuery: Boolean(search.query),
      hasCategory: search.url.includes("category="),
    });
  }

  return (
    <section aria-labelledby="buyer-saved-searches-title">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <h2
          id="buyer-saved-searches-title"
          className="text-lg font-bold text-[#0F172A] sm:text-xl"
        >
          Сохранённые поиски
        </h2>
        {searches.length > 0 ? (
          <p className="text-sm text-[#64748B]">
            {searches.length}{" "}
            {searches.length === 1 ? "поиск" : searches.length < 5 ? "поиска" : "поисков"}
          </p>
        ) : null}
      </div>

      {loaded && searches.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[rgba(148,163,184,0.25)] bg-white px-6 py-10 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
            <Bookmark className="size-5" aria-hidden="true" />
          </div>
          <p className="mt-4 text-base font-semibold text-[#0F172A]">
            Сохранённых поисков пока нет
          </p>
          <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-[#64748B]">
            Настройте фильтры в каталоге и нажмите «Сохранить поиск», чтобы быстро
            возвращаться к нужным объявлениям.
          </p>
          <Button asChild className="mt-5 h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8]">
            <Link href="/listings">Перейти к поиску</Link>
          </Button>
        </div>
      ) : null}

      {searches.length > 0 ? (
        <div className="overflow-hidden rounded-3xl border border-[rgba(148,163,184,0.18)] bg-white shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
          <ul className="divide-y divide-[rgba(148,163,184,0.1)]">
            {searches.slice(0, VISIBLE_LIMIT).map((search) => {
              const vertical = resolveVertical(search.vertical);
              const savedDate = formatSavedDate(search.createdAt);

              return (
                <li
                  key={search.id}
                  className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#0F172A]">
                      {search.title}
                    </p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-[#94A3B8]">
                      {vertical ? (
                        <span className="font-medium text-[#2563EB]">
                          {VERTICALS[vertical].label}
                        </span>
                      ) : null}
                      {savedDate ? <span>Сохранён {savedDate}</span> : null}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="h-9 rounded-xl border-[rgba(148,163,184,0.25)]"
                    >
                      <Link href={search.url} onClick={() => handleOpen(search)}>
                        Открыть
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemove(search)}
                      className="h-9 rounded-xl px-2.5 text-[#94A3B8] hover:text-[#DC2626]"
                      aria-label={`Удалить сохранённый поиск «${search.title}»`}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
