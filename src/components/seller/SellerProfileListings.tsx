"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ListingCard } from "@/components/listings/ListingCard";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import { SearchInput } from "@/components/ui/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SellerProfileListingsProps = {
  listings: ListingCardData[];
  isAuthenticated?: boolean;
  favoriteListingIds?: string[];
};

type SellerListingSort = "newest" | "price_asc" | "price_desc";

function sortListings(items: ListingCardData[], sort: SellerListingSort): ListingCardData[] {
  const next = [...items];

  switch (sort) {
    case "price_asc":
      return next.sort((a, b) => Number(a.price.toString()) - Number(b.price.toString()));
    case "price_desc":
      return next.sort((a, b) => Number(b.price.toString()) - Number(a.price.toString()));
    default:
      return next.sort((a, b) => {
        const aDate = a.published_at ?? a.created_at;
        const bDate = b.published_at ?? b.created_at;
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      });
  }
}

export function SellerProfileListings({
  listings,
  isAuthenticated = false,
  favoriteListingIds = [],
}: SellerProfileListingsProps) {
  const favoriteIds = new Set(favoriteListingIds);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SellerListingSort>("newest");

  const categories = useMemo(() => {
    const names = new Set<string>();
    for (const listing of listings) {
      names.add(listing.category.name);
    }
    return Array.from(names).sort((a, b) => a.localeCompare(b, "ru"));
  }, [listings]);

  const filteredListings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = listings.filter((listing) => {
      const matchesQuery =
        !normalizedQuery || listing.title.toLowerCase().includes(normalizedQuery);
      const matchesCategory = category === "all" || listing.category.name === category;
      return matchesQuery && matchesCategory;
    });

    return sortListings(filtered, sort);
  }, [listings, query, category, sort]);

  return (
    <section
      id="seller-listings"
      className="scroll-mt-24"
      aria-labelledby="seller-listings-title"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 id="seller-listings-title" className="text-xl font-bold tracking-tight text-[#0F172A] sm:text-2xl">
          Объявления продавца
        </h2>
        {listings.length > 0 ? (
          <p className="text-sm text-[#64748B]">
            Опубликовано:{" "}
            <span className="font-medium text-[#0F172A]">{listings.length}</span>
          </p>
        ) : null}
      </div>

      {listings.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-[rgba(148,163,184,0.18)] bg-white px-6 py-12 text-center shadow-sm">
          <p className="text-base font-medium text-[#0F172A]">
            У продавца пока нет опубликованных объявлений.
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#64748B]">
            Загляните позже или посмотрите предложения других продавцов в каталоге.
          </p>
          <Link
            href="/listings"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#2563EB] px-5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
          >
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white p-3 sm:flex-row sm:items-center sm:p-4">
            <SearchInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onClear={() => setQuery("")}
              placeholder="Поиск по объявлениям..."
              containerClassName="min-w-0 flex-1"
              className="h-11 rounded-xl bg-white"
            />

            <div className="flex flex-col gap-2 sm:flex-row sm:shrink-0">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-11 w-full rounded-xl bg-white sm:w-[180px]" aria-label="Категория">
                  <SelectValue placeholder="Категория" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  {categories.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sort} onValueChange={(value) => setSort(value as SellerListingSort)}>
                <SelectTrigger className="h-11 w-full rounded-xl bg-white sm:w-[180px]" aria-label="Сортировка">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Сначала новые</SelectItem>
                  <SelectItem value="price_asc">Сначала дешевле</SelectItem>
                  <SelectItem value="price_desc">Сначала дороже</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredListings.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[rgba(148,163,184,0.25)] bg-white px-6 py-10 text-center">
              <p className="text-sm text-[#64748B]">
                По вашему запросу объявления не найдены. Измените поиск или фильтры.
              </p>
            </div>
          ) : (
            <div className="mt-5 grid w-full min-w-0 grid-cols-2 gap-3 max-[339px]:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {filteredListings.map((listing) => (
                <div key={listing.id} className="min-w-0 w-full">
                  <ListingCard
                    listing={listing}
                    isAuthenticated={isAuthenticated}
                    isFavorited={favoriteIds.has(listing.id)}
                    variant="catalog"
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
