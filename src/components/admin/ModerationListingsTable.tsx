"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { ListingStatus } from "@prisma/client";
import { ListingStatus as ListingStatusEnum, Prisma } from "@prisma/client";
import { Package } from "lucide-react";
import { ListingStatusBadge } from "@/components/seller/ListingStatusBadge";
import { formatListingDate, formatListingPrice } from "@/features/listings/lib/format-listing-price";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type ModerationListingRow = {
  id: string;
  title: string;
  status: ListingStatus;
  price: string;
  currency: string;
  created_at: string;
  imageUrl: string | null;
  categoryName: string;
  cityName: string | null;
  sellerName: string;
};

type ModerationListingsTableProps = {
  listings: ModerationListingRow[];
};

type ModerationFilter = "all" | "pending" | "published" | "rejected";

const FILTER_CONFIG: Array<{ value: ModerationFilter; label: string }> = [
  { value: "all", label: "Все" },
  { value: "pending", label: "На модерации" },
  { value: "published", label: "Опубликованные" },
  { value: "rejected", label: "Отклонённые" },
];

type ApiErrorBody = {
  error?: {
    message?: string;
  };
};

function filterByStatusTab(
  listings: ModerationListingRow[],
  tab: ModerationFilter,
): ModerationListingRow[] {
  switch (tab) {
    case "pending":
      return listings.filter((listing) => listing.status === ListingStatusEnum.PENDING_MODERATION);
    case "published":
      return listings.filter((listing) => listing.status === ListingStatusEnum.PUBLISHED);
    case "rejected":
      return listings.filter((listing) => listing.status === ListingStatusEnum.REJECTED);
    default:
      return listings;
  }
}

function ModerationListingCard({
  listing,
  isPending,
  onApprove,
  onReject,
}: {
  listing: ModerationListingRow;
  isPending: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  const canModerate = listing.status === ListingStatusEnum.PENDING_MODERATION;

  return (
    <article
      className={cn(
        "overflow-hidden rounded-3xl border border-[rgba(148,163,184,0.18)] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]",
      )}
    >
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:p-5">
        <Link
          href={`/listings/${listing.id}`}
          className="relative mx-auto size-24 shrink-0 overflow-hidden rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[#F1F5F9] sm:mx-0 sm:size-28"
        >
          {listing.imageUrl ? (
            <Image
              src={listing.imageUrl}
              alt={listing.title}
              fill
              unoptimized
              className="object-cover"
              sizes="112px"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1 text-[11px] text-[#94A3B8]">
              <Package className="size-5" aria-hidden="true" />
              Нет фото
            </div>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <ListingStatusBadge status={listing.status} />
          </div>

          <h3 className="mt-2 line-clamp-2 text-base font-semibold text-[#0F172A]">
            <Link href={`/listings/${listing.id}`} className="transition hover:text-[#2563EB]">
              {listing.title}
            </Link>
          </h3>

          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[#64748B]">Продавец</dt>
              <dd className="font-medium text-[#0F172A]">{listing.sellerName}</dd>
            </div>
            <div>
              <dt className="text-[#64748B]">Категория</dt>
              <dd className="font-medium text-[#0F172A]">{listing.categoryName}</dd>
            </div>
            <div>
              <dt className="text-[#64748B]">Цена</dt>
              <dd className="font-medium text-[#0F172A]">
                {formatListingPrice(new Prisma.Decimal(listing.price), listing.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-[#64748B]">Город</dt>
              <dd className="font-medium text-[#0F172A]">{listing.cityName ?? "—"}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-[#64748B]">Дата создания</dt>
              <dd className="font-medium text-[#0F172A]">
                {formatListingDate(new Date(listing.created_at))}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-[rgba(148,163,184,0.14)] p-4 sm:flex-row sm:flex-wrap sm:p-5">
        <Button
          variant="outline"
          asChild
          className="h-11 w-full rounded-xl border-[rgba(148,163,184,0.25)] sm:w-auto"
        >
          <Link href={`/listings/${listing.id}`}>Открыть</Link>
        </Button>
        {canModerate ? (
          <>
            <Button
              type="button"
              disabled={isPending}
              onClick={onApprove}
              className="h-11 w-full rounded-xl bg-[#059669] hover:bg-[#047857] sm:flex-1"
            >
              Одобрить
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={onReject}
              className="h-11 w-full rounded-xl border-[#FECACA] bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2] sm:flex-1"
            >
              Отклонить
            </Button>
          </>
        ) : null}
      </div>
    </article>
  );
}

export function ModerationListingsTable({ listings }: ModerationListingsTableProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<ModerationFilter>("pending");
  const [query, setQuery] = useState("");
  const [seller, setSeller] = useState("all");
  const [category, setCategory] = useState("all");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const sellers = useMemo(() => {
    const names = new Set(listings.map((listing) => listing.sellerName));
    return Array.from(names).sort((a, b) => a.localeCompare(b, "ru"));
  }, [listings]);

  const categories = useMemo(() => {
    const names = new Set(listings.map((listing) => listing.categoryName));
    return Array.from(names).sort((a, b) => a.localeCompare(b, "ru"));
  }, [listings]);

  const filterCounts = useMemo(
    () => ({
      all: listings.length,
      pending: listings.filter((listing) => listing.status === ListingStatusEnum.PENDING_MODERATION)
        .length,
      published: listings.filter((listing) => listing.status === ListingStatusEnum.PUBLISHED).length,
      rejected: listings.filter((listing) => listing.status === ListingStatusEnum.REJECTED).length,
    }),
    [listings],
  );

  function applyExtraFilters(items: ModerationListingRow[]): ModerationListingRow[] {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((listing) => {
      const matchesQuery =
        !normalizedQuery || listing.title.toLowerCase().includes(normalizedQuery);
      const matchesSeller = seller === "all" || listing.sellerName === seller;
      const matchesCategory = category === "all" || listing.categoryName === category;
      return matchesQuery && matchesSeller && matchesCategory;
    });
  }

  async function moderateListing(listingId: string, action: "approve" | "reject") {
    setPendingId(listingId);
    setErrorMessage("");

    try {
      const response = await fetch(`/api/admin/listings/${listingId}/moderation`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        const body = (await response.json()) as ApiErrorBody;
        throw new Error(body.error?.message ?? "Не удалось обработать объявление");
      }

      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Не удалось обработать объявление");
    } finally {
      setPendingId(null);
    }
  }

  if (listings.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[rgba(148,163,184,0.25)] bg-white px-6 py-12 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
          <Package className="size-6" aria-hidden="true" />
        </div>
        <p className="mt-5 text-base font-semibold text-[#0F172A]">Нет объявлений для модерации</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#64748B]">
          Новые объявления продавцов появятся здесь.
        </p>
        <Button asChild className="mt-6 h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8]">
          <Link href="/listings">Открыть каталог</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {errorMessage ? (
        <div
          className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]"
          role="alert"
        >
          {errorMessage}
        </div>
      ) : null}

      <Tabs
        value={activeFilter}
        onValueChange={(value) => setActiveFilter(value as ModerationFilter)}
      >
        <TabsList
          className={cn(
            "h-auto w-full justify-start gap-1 overflow-x-auto rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white p-1",
            "scrollbar-none",
          )}
        >
          {FILTER_CONFIG.map((filter) => (
            <TabsTrigger
              key={filter.value}
              value={filter.value}
              className="shrink-0 rounded-xl px-3 py-2 text-xs data-[state=active]:bg-[#EFF6FF] data-[state=active]:text-[#2563EB] sm:text-sm"
            >
              {filter.label}
              <span className="ml-1.5 text-[#94A3B8]">({filterCounts[filter.value]})</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-4 rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onClear={() => setQuery("")}
              placeholder="Поиск по названию..."
              containerClassName="min-w-0 flex-1"
              className="h-11 rounded-xl bg-white"
            />

            <div className="flex flex-col gap-2 sm:flex-row sm:shrink-0">
              <Select value={seller} onValueChange={setSeller}>
                <SelectTrigger className="h-11 w-full rounded-xl bg-white sm:w-[180px]" aria-label="Продавец">
                  <SelectValue placeholder="Продавец" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все продавцы</SelectItem>
                  {sellers.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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
            </div>
          </div>
        </div>

        {FILTER_CONFIG.map((filter) => {
          const tabListings = applyExtraFilters(filterByStatusTab(listings, filter.value));

          return (
            <TabsContent key={filter.value} value={filter.value} className="mt-4 space-y-4">
              {tabListings.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[rgba(148,163,184,0.25)] bg-white px-6 py-10 text-center">
                  <p className="text-sm text-[#64748B]">В этой категории объявлений нет.</p>
                </div>
              ) : (
                tabListings.map((listing) => (
                  <ModerationListingCard
                    key={listing.id}
                    listing={listing}
                    isPending={pendingId === listing.id}
                    onApprove={() => void moderateListing(listing.id, "approve")}
                    onReject={() => void moderateListing(listing.id, "reject")}
                  />
                ))
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
