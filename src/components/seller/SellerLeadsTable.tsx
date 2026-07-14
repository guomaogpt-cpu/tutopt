import Image from "next/image";
import Link from "next/link";
import { Inbox, Package } from "lucide-react";
import { LeadStatusBadge } from "@/components/seller/LeadStatusBadge";
import type { SellerLeadItem } from "@/features/leads/lib/leads-data";
import { formatListingDate } from "@/features/listings/lib/format-listing-price";
import { normalizeListingImageUrl } from "@/features/listings/lib/listing-image-url";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SellerLeadsTableProps = {
  leads: SellerLeadItem[];
};

export function SellerLeadsTable({ leads }: SellerLeadsTableProps) {
  if (leads.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[rgba(148,163,184,0.25)] bg-white px-6 py-12 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
          <Inbox className="size-6" aria-hidden="true" />
        </div>
        <p className="mt-5 text-base font-semibold text-[#0F172A]">Пока нет заявок</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#64748B]">
          Когда покупатели заинтересуются вашими товарами, заявки появятся здесь.
        </p>
        <Button
          variant="outline"
          asChild
          className="mt-6 h-11 rounded-xl border-[rgba(148,163,184,0.25)]"
        >
          <Link href="/seller/dashboard">К моим объявлениям</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {leads.map((lead) => {
        const imageUrl = lead.listing.image_url
          ? normalizeListingImageUrl(lead.listing.image_url)
          : null;

        return (
          <article
            key={lead.id}
            className={cn(
              "overflow-hidden rounded-3xl border border-[rgba(148,163,184,0.18)] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]",
            )}
          >
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:p-5">
              <Link
                href={`/listings/${lead.listing.id}`}
                className="relative mx-auto size-20 shrink-0 overflow-hidden rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[#F1F5F9] sm:mx-0 sm:size-24"
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={lead.listing.title}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-1 text-[11px] text-[#94A3B8]">
                    <Package className="size-5" aria-hidden="true" />
                    Нет фото
                  </div>
                )}
              </Link>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                      Товар
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-[#0F172A]">
                      <Link
                        href={`/listings/${lead.listing.id}`}
                        className="transition hover:text-[#2563EB]"
                      >
                        {lead.listing.title}
                      </Link>
                    </h3>
                  </div>
                  <LeadStatusBadge status={lead.status} />
                </div>

                <p className="mt-2 text-sm text-[#64748B]">{formatListingDate(lead.created_at)}</p>

                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                      Покупатель
                    </dt>
                    <dd className="mt-1 font-medium text-[#0F172A]">{lead.buyer.name}</dd>
                    {lead.buyer.phone ? (
                      <dd className="mt-1 break-all text-sm text-[#64748B]">{lead.buyer.phone}</dd>
                    ) : null}
                    {lead.buyer.email ? (
                      <dd className="break-all text-sm text-[#64748B]">{lead.buyer.email}</dd>
                    ) : null}
                  </div>

                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                      Количество
                    </dt>
                    <dd className="mt-1 font-medium text-[#0F172A]">{lead.quantity}</dd>
                  </div>

                  <div className="sm:col-span-2">
                    <dt className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                      Сообщение
                    </dt>
                    <dd className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-[#334155]">
                      {lead.message ?? "—"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="border-t border-[rgba(148,163,184,0.14)] p-4 sm:px-5 sm:py-4">
              <Button
                variant="outline"
                asChild
                className="h-11 w-full rounded-xl border-[rgba(148,163,184,0.25)] sm:w-auto"
              >
                <Link href={`/listings/${lead.listing.id}`}>Открыть объявление</Link>
              </Button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
