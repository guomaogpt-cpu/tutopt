"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import type { ListingVertical } from "@prisma/client";
import {
  formatCategoryAnnouncementsCount,
  getCategoryIcon,
} from "@/features/home/lib/category-icons";
import type { CategoriesDirectoryItem } from "@/features/home/lib/categories-page-data";
import { VERTICAL_LIST, VERTICALS } from "@/features/verticals/verticals";
import { cn } from "@/lib/utils";

type VerticalFilter = "ALL" | ListingVertical;

const VERTICAL_CARD_STYLES: Record<
  ListingVertical,
  {
    card: string;
    icon: string;
    badge: string;
  }
> = {
  OPT: {
    card: "border-blue-200/80 bg-gradient-to-br from-blue-50/80 to-white hover:border-blue-300",
    icon: "bg-blue-100 text-blue-600",
    badge: "bg-blue-600 text-white",
  },
  MARKET: {
    card: "border-indigo-200/80 bg-gradient-to-br from-indigo-50/80 to-white hover:border-indigo-300",
    icon: "bg-indigo-100 text-indigo-600",
    badge: "bg-indigo-600 text-white",
  },
  SERVICES: {
    card: "border-teal-200/80 bg-gradient-to-br from-teal-50/80 to-white hover:border-teal-300",
    icon: "bg-teal-100 text-teal-700",
    badge: "bg-teal-700 text-white",
  },
  CARGO: {
    card: "border-rose-200/80 bg-gradient-to-br from-rose-50/80 to-white hover:border-rose-300",
    icon: "bg-rose-100 text-rose-600",
    badge: "bg-rose-600 text-white",
  },
};

const FILTER_TABS: { id: VerticalFilter; label: string }[] = [
  { id: "ALL", label: "Все" },
  ...VERTICAL_LIST.map((v) => ({ id: v.id as VerticalFilter, label: v.label })),
];

type CategoriesDirectoryProps = {
  categories: CategoriesDirectoryItem[];
};

export function CategoriesDirectory({ categories }: CategoriesDirectoryProps) {
  const [verticalFilter, setVerticalFilter] = useState<VerticalFilter>("ALL");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filtered = useMemo(() => {
    return categories.filter((category) => {
      if (verticalFilter !== "ALL" && category.vertical !== verticalFilter) {
        return false;
      }

      if (!deferredQuery) {
        return true;
      }

      return (
        category.name.toLowerCase().includes(deferredQuery) ||
        category.slug.toLowerCase().includes(deferredQuery)
      );
    });
  }, [categories, verticalFilter, deferredQuery]);

  const grouped = useMemo(() => {
    if (verticalFilter !== "ALL") {
      return null;
    }

    return VERTICAL_LIST.map((vertical) => ({
      vertical,
      items: filtered.filter((item) => item.vertical === vertical.id),
    })).filter((group) => group.items.length > 0);
  }, [filtered, verticalFilter]);

  if (categories.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
        <p className="text-base font-medium text-slate-900">Категории пока не добавлены.</p>
        <Link
          href="/listings"
          className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Смотреть все объявления
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 sm:mt-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          className={cn(
            "flex gap-2 overflow-x-auto pb-1",
            "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          )}
          role="tablist"
          aria-label="Фильтр по направлению"
        >
          {FILTER_TABS.map((tab) => {
            const isActive = verticalFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setVerticalFilter(tab.id)}
                className={cn(
                  "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition",
                  isActive
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <label className="relative block w-full sm:max-w-[280px]">
          <span className="sr-only">Поиск по категориям</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Найти категорию…"
            className={cn(
              "h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900",
              "placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100",
            )}
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <p className="text-base font-medium text-slate-900">
            {deferredQuery
              ? "Категории по запросу не найдены."
              : "В этом разделе пока нет категорий."}
          </p>
          <Link
            href="/listings"
            className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Смотреть все объявления
          </Link>
        </div>
      ) : grouped ? (
        <div className="mt-8 space-y-9">
          {grouped.map((group) => (
            <section key={group.vertical.id} aria-labelledby={`cat-group-${group.vertical.id}`}>
              <div className="mb-3.5 flex items-end justify-between gap-3">
                <div>
                  <h2
                    id={`cat-group-${group.vertical.id}`}
                    className="text-base font-bold tracking-tight text-slate-900 sm:text-lg"
                  >
                    {group.vertical.label}
                  </h2>
                  <p className="mt-0.5 text-sm text-slate-500">{group.vertical.homeCardDescription}</p>
                </div>
                <Link
                  href={group.vertical.listingsHref}
                  className="shrink-0 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Все объявления
                </Link>
              </div>
              <CategoryCardsGrid items={group.items} />
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <CategoryCardsGrid items={filtered} />
        </div>
      )}
    </div>
  );
}

function CategoryCardsGrid({ items }: { items: CategoriesDirectoryItem[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((category) => (
        <li key={category.id}>
          <CategoryDirectoryCard category={category} />
        </li>
      ))}
    </ul>
  );
}

function CategoryDirectoryCard({ category }: { category: CategoriesDirectoryItem }) {
  const Icon = getCategoryIcon(category.name, category.slug);
  const styles = VERTICAL_CARD_STYLES[category.vertical];
  const verticalLabel = VERTICALS[category.vertical].label;
  const href = `/listings?vertical=${category.vertical}&category=${encodeURIComponent(category.id)}`;

  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full min-h-[132px] flex-col rounded-2xl border p-4 transition duration-200",
        "shadow-[0_4px_14px_rgba(15,23,42,0.03)]",
        "hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,23,42,0.08)]",
        styles.card,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(
            "inline-flex size-10 shrink-0 items-center justify-center rounded-xl",
            styles.icon,
          )}
          aria-hidden="true"
        >
          <Icon className="size-5" strokeWidth={1.75} />
        </span>
        <ChevronRight
          className="size-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500"
          aria-hidden="true"
        />
      </div>

      <h3 className="mt-3 line-clamp-2 text-[15px] font-semibold leading-snug text-slate-900">
        {category.name}
      </h3>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            styles.badge,
          )}
        >
          {verticalLabel}
        </span>
        <span className="text-xs font-medium text-slate-500">
          {formatCategoryAnnouncementsCount(category.listingsCount)}
        </span>
      </div>
    </Link>
  );
}
