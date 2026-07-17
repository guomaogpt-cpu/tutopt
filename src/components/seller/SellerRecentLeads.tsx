import Link from "next/link";
import type { ListingVertical } from "@prisma/client";
import { Inbox } from "lucide-react";
import { LeadStatusBadge } from "@/components/seller/LeadStatusBadge";
import { VerticalListingBadge } from "@/components/listings/VerticalListingBadge";
import { formatListingDate } from "@/features/listings/lib/format-listing-price";

export type SellerRecentLead = {
  id: string;
  status: "NEW" | "VIEWED" | "CLOSED";
  created_at: Date;
  buyerName: string;
  listingId: string;
  listingTitle: string;
  listingVertical: ListingVertical;
};

type SellerRecentLeadsProps = {
  leads: SellerRecentLead[];
};

export function SellerRecentLeads({ leads }: SellerRecentLeadsProps) {
  return (
    <section aria-labelledby="seller-recent-leads-title">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <h2
          id="seller-recent-leads-title"
          className="text-lg font-bold text-[#0F172A] sm:text-xl"
        >
          Последние заявки
        </h2>
        <Link href="/seller/leads" className="text-sm font-medium text-[#2563EB]">
          Открыть заявки →
        </Link>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[rgba(148,163,184,0.25)] bg-white px-6 py-10 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
            <Inbox className="size-5" aria-hidden="true" />
          </div>
          <p className="mt-4 text-base font-semibold text-[#0F172A]">Заявок пока нет</p>
          <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-[#64748B]">
            Когда покупатели будут писать по вашим объявлениям, заявки появятся здесь.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-[rgba(148,163,184,0.18)] bg-white shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
          <ul className="divide-y divide-[rgba(148,163,184,0.1)]">
            {leads.map((lead) => (
              <li
                key={lead.id}
                className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <VerticalListingBadge vertical={lead.listingVertical} />
                    <LeadStatusBadge status={lead.status} />
                  </div>
                  <Link
                    href={`/listings/${lead.listingId}`}
                    className="mt-1 block truncate text-sm font-semibold text-[#0F172A] transition hover:text-[#2563EB]"
                  >
                    {lead.listingTitle}
                  </Link>
                  <p className="truncate text-xs text-[#64748B]">{lead.buyerName}</p>
                </div>
                <p className="shrink-0 text-xs text-[#94A3B8]">
                  {formatListingDate(lead.created_at)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
