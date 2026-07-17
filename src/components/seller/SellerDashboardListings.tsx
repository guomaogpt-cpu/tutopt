"use client";

import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import {
  SellerDashboardListingCard,
  type SellerDashboardListing,
} from "@/components/seller/SellerDashboardListingCard";
import { Button } from "@/components/ui/button";

type SellerDashboardListingsProps = {
  /** Compact preview: the dashboard passes only the most recent listings. */
  listings: SellerDashboardListing[];
  totalCount: number;
};

export function SellerDashboardListings({
  listings,
  totalCount,
}: SellerDashboardListingsProps) {
  if (totalCount === 0) {
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
        <div>
          <h2 id="seller-listings-title" className="text-lg font-bold text-[#0F172A] sm:text-xl">
            Последние объявления
          </h2>
          <p className="mt-1 text-sm text-[#64748B]">
            Всего: <span className="font-medium text-[#0F172A]">{totalCount}</span>
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="h-10 gap-1.5 rounded-xl border-[rgba(148,163,184,0.25)] bg-white"
        >
          <Link href="/seller/listings">
            Все мои объявления
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        {listings.map((listing) => (
          <SellerDashboardListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {totalCount > listings.length ? (
        <div className="mt-4 text-center">
          <Button
            asChild
            variant="ghost"
            className="h-10 rounded-xl text-[#2563EB] hover:bg-[#EFF6FF]"
          >
            <Link href="/seller/listings">
              Показать все {totalCount} объявлений
              <ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      ) : null}
    </section>
  );
}
