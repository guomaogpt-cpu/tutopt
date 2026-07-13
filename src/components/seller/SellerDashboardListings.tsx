"use client";

import Link from "next/link";
import type { ListingStatus } from "@prisma/client";
import { ListingStatus as ListingStatusEnum } from "@prisma/client";
import { useMemo, useState } from "react";
import { Package } from "lucide-react";
import {
  SellerDashboardListingCard,
  type SellerDashboardListing,
} from "@/components/seller/SellerDashboardListingCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type ListingTab = "all" | "published" | "pending" | "rejected" | "draft_archive";

const TAB_CONFIG: Array<{
  value: ListingTab;
  label: string;
  statuses: ListingStatus[] | null;
}> = [
  { value: "all", label: "Все", statuses: null },
  { value: "published", label: "Опубликованные", statuses: [ListingStatusEnum.PUBLISHED] },
  {
    value: "pending",
    label: "На модерации",
    statuses: [ListingStatusEnum.PENDING_MODERATION],
  },
  { value: "rejected", label: "Отклонённые", statuses: [ListingStatusEnum.REJECTED] },
  {
    value: "draft_archive",
    label: "Черновики / Архив",
    statuses: [ListingStatusEnum.DRAFT, ListingStatusEnum.ARCHIVED],
  },
];

function filterListingsByTab(
  listings: SellerDashboardListing[],
  tab: ListingTab,
): SellerDashboardListing[] {
  const config = TAB_CONFIG.find((item) => item.value === tab);
  if (!config?.statuses) {
    return listings;
  }
  return listings.filter((listing) => config.statuses?.includes(listing.status));
}

type SellerDashboardListingsProps = {
  listings: SellerDashboardListing[];
};

export function SellerDashboardListings({ listings }: SellerDashboardListingsProps) {
  const [activeTab, setActiveTab] = useState<ListingTab>("all");

  const tabCounts = useMemo(() => {
    const counts: Record<ListingTab, number> = {
      all: listings.length,
      published: 0,
      pending: 0,
      rejected: 0,
      draft_archive: 0,
    };

    for (const listing of listings) {
      if (listing.status === ListingStatusEnum.PUBLISHED) {
        counts.published += 1;
      }
      if (listing.status === ListingStatusEnum.PENDING_MODERATION) {
        counts.pending += 1;
      }
      if (listing.status === ListingStatusEnum.REJECTED) {
        counts.rejected += 1;
      }
      if (
        listing.status === ListingStatusEnum.DRAFT ||
        listing.status === ListingStatusEnum.ARCHIVED
      ) {
        counts.draft_archive += 1;
      }
    }

    return counts;
  }, [listings]);

  if (listings.length === 0) {
    return (
      <section aria-labelledby="seller-listings-title" className="mt-8 lg:mt-10">
        <h2 id="seller-listings-title" className="mb-4 text-lg font-bold text-[#0F172A] sm:text-xl">
          Мои объявления
        </h2>
        <div className="rounded-3xl border border-dashed border-[rgba(148,163,184,0.25)] bg-white px-6 py-12 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
            <Package className="size-6" aria-hidden="true" />
          </div>
          <p className="mt-5 text-base font-semibold text-[#0F172A]">У вас пока нет объявлений</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#64748B]">
            Создайте первое объявление, чтобы начать получать заявки от покупателей.
          </p>
          <Button asChild className="mt-6 h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8]">
            <Link href="/listings/new">Подать объявление</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="seller-listings-title" className="mt-8 lg:mt-10">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 id="seller-listings-title" className="text-lg font-bold text-[#0F172A] sm:text-xl">
          Мои объявления
        </h2>
        <p className="text-sm text-[#64748B]">
          Всего: <span className="font-medium text-[#0F172A]">{listings.length}</span>
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ListingTab)}>
        <TabsList
          className={cn(
            "h-auto w-full justify-start gap-1 overflow-x-auto rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white p-1",
            "scrollbar-none",
          )}
        >
          {TAB_CONFIG.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="shrink-0 rounded-xl px-3 py-2 text-xs data-[state=active]:bg-[#EFF6FF] data-[state=active]:text-[#2563EB] sm:text-sm"
            >
              {tab.label}
              <span className="ml-1.5 text-[#94A3B8]">({tabCounts[tab.value]})</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {TAB_CONFIG.map((tab) => {
          const tabListings = filterListingsByTab(listings, tab.value);

          return (
            <TabsContent key={tab.value} value={tab.value} className="mt-4 space-y-3">
              {tabListings.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[rgba(148,163,184,0.25)] bg-white px-6 py-10 text-center">
                  <p className="text-sm text-[#64748B]">В этой категории пока нет объявлений.</p>
                </div>
              ) : (
                tabListings.map((listing) => (
                  <SellerDashboardListingCard key={listing.id} listing={listing} />
                ))
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </section>
  );
}
