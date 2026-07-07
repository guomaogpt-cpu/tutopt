"use client";

import Link from "next/link";
import type { ListingStatus } from "@prisma/client";
import { ListingStatus as ListingStatusEnum, Prisma } from "@prisma/client";
import { useMemo, useState } from "react";
import { formatListingPrice } from "@/features/listings/lib/format-listing-price";
import { listingStatusLabels } from "@/features/listings/lib/listing-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Section, SectionHeader, SectionTitle } from "@/components/ui/section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package } from "lucide-react";

export type SellerDashboardListing = {
  id: string;
  title: string;
  status: ListingStatus;
  price: string;
  currency: string;
  created_at: string;
};

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

function getListingBadgeVariant(
  status: ListingStatus,
): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" {
  switch (status) {
    case ListingStatusEnum.PUBLISHED:
      return "success";
    case ListingStatusEnum.PENDING_MODERATION:
      return "warning";
    case ListingStatusEnum.REJECTED:
      return "destructive";
    default:
      return "secondary";
  }
}

type SellerDashboardListingsProps = {
  listings: SellerDashboardListing[];
};

export function SellerDashboardListings({ listings }: SellerDashboardListingsProps) {
  const [activeTab, setActiveTab] = useState<ListingTab>("all");

  const filteredListings = useMemo(() => {
    const config = TAB_CONFIG.find((tab) => tab.value === activeTab);
    if (!config?.statuses) {
      return listings;
    }
    return listings.filter((listing) => config.statuses?.includes(listing.status));
  }, [activeTab, listings]);

  if (listings.length === 0) {
    return (
      <Section spacing="none" aria-labelledby="seller-listings-title">
        <SectionHeader className="mb-4">
          <SectionTitle id="seller-listings-title" className="text-xl">
            Мои объявления
          </SectionTitle>
        </SectionHeader>
        <EmptyState
          icon={Package}
          title="У вас пока нет объявлений"
          description="Создайте первое объявление, чтобы начать получать заявки от покупателей."
          action={
            <Button asChild>
              <Link href="/listings/new">Подать объявление</Link>
            </Button>
          }
        />
      </Section>
    );
  }

  return (
    <Section spacing="none" aria-labelledby="seller-listings-title">
      <SectionHeader className="mb-4">
        <SectionTitle id="seller-listings-title" className="text-xl">
          Мои объявления
        </SectionTitle>
      </SectionHeader>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ListingTab)}>
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1">
          {TAB_CONFIG.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="text-xs sm:text-sm">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TAB_CONFIG.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-4 space-y-3">
            {filteredListings.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-sm text-muted-foreground">
                  В этой категории пока нет объявлений.
                </CardContent>
              </Card>
            ) : (
              filteredListings.map((listing) => (
                <Card key={listing.id}>
                  <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/listings/${listing.id}`}
                          className="font-medium text-foreground transition hover:text-primary"
                        >
                          {listing.title}
                        </Link>
                        <Badge variant={getListingBadgeVariant(listing.status)}>
                          {listingStatusLabels[listing.status]}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {new Date(listing.created_at).toLocaleDateString("ru-RU")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-semibold text-foreground">
                        {formatListingPrice(new Prisma.Decimal(listing.price), listing.currency)}
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/listings/${listing.id}`}>Открыть</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </Section>
  );
}
