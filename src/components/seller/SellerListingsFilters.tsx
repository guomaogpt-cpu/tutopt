"use client";

import type { ListingVertical } from "@prisma/client";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  buildSellerListingsQueryString,
  sellerListingsStatusOptions,
  type SellerListingsFilters as SellerListingsFiltersState,
  type SellerListingsStatusFilter,
} from "@/features/sellers/lib/seller-listings";
import { VERTICAL_LIST } from "@/features/verticals/verticals";
import { trackSellerListingsFilterChange } from "@/lib/analytics/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const VERTICAL_ALL = "all";

type SellerListingsFiltersProps = {
  filters: SellerListingsFiltersState;
};

export function SellerListingsFilters({ filters }: SellerListingsFiltersProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(filters.q);

  function applyFilters(next: Partial<SellerListingsFiltersState>) {
    const merged: SellerListingsFiltersState = {
      ...filters,
      q: searchValue.trim(),
      ...next,
      page: 1,
    };

    trackSellerListingsFilterChange({
      statusFilter: merged.status,
      vertical: merged.vertical,
    });
    router.push(`/seller/listings${buildSellerListingsQueryString(merged)}`);
  }

  return (
    <form
      className="flex flex-col gap-3 rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white p-4 sm:flex-row sm:items-center"
      onSubmit={(event) => {
        event.preventDefault();
        applyFilters({});
      }}
    >
      <div className="relative min-w-0 flex-1">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Поиск по названию"
          className="h-10 rounded-xl pl-10"
          aria-label="Поиск по своим объявлениям"
        />
      </div>

      <Select
        value={filters.status}
        onValueChange={(value) =>
          applyFilters({ status: value as SellerListingsStatusFilter })
        }
      >
        <SelectTrigger className="sm:w-[180px]" aria-label="Фильтр по статусу">
          <SelectValue placeholder="Статус" />
        </SelectTrigger>
        <SelectContent>
          {sellerListingsStatusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.vertical ?? VERTICAL_ALL}
        onValueChange={(value) =>
          applyFilters({
            vertical: value === VERTICAL_ALL ? null : (value as ListingVertical),
          })
        }
      >
        <SelectTrigger className="sm:w-[180px]" aria-label="Фильтр по направлению">
          <SelectValue placeholder="Направление" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={VERTICAL_ALL}>Все направления</SelectItem>
          {VERTICAL_LIST.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="submit" variant="outline" className="h-10 rounded-xl sm:w-auto">
        Найти
      </Button>
    </form>
  );
}
