import Image from "next/image";
import Link from "next/link";
import { Inbox, Package } from "lucide-react";
import { LeadStatusBadge } from "@/components/seller/LeadStatusBadge";
import type { BuyerLeadItem } from "@/features/leads/lib/leads-data";
import { formatListingDate } from "@/features/listings/lib/format-listing-price";
import { normalizeListingImageUrl } from "@/features/listings/lib/listing-image-url";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BuyerLeadsSectionProps = {
  leads: BuyerLeadItem[];
};

export function BuyerLeadsSection({ leads }: BuyerLeadsSectionProps) {
  return (
    <section id="buyer-leads" className="scroll-mt-24" aria-labelledby="buyer-leads-title">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 id="buyer-leads-title" className="text-lg font-bold text-[#0F172A] sm:text-xl">
          Мои заявки
        </h2>
        {leads.length > 0 ? (
          <p className="text-sm text-[#64748B]">
            Всего: <span className="font-medium text-[#0F172A]">{leads.length}</span>
          </p>
        ) : null}
      </div>

      {leads.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[rgba(148,163,184,0.25)] bg-white px-6 py-12 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
            <Inbox className="size-6" aria-hidden="true" />
          </div>
          <p className="mt-5 text-base font-semibold text-[#0F172A]">Вы ещё не отправляли заявки</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#64748B]">
            Найдите товар в каталоге и отправьте запрос поставщику.
          </p>
          <Button asChild className="mt-6 h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8]">
            <Link href="/listings">Перейти в каталог</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
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
                  {lead.listing.image_url ? (
                    <Image
                      src={normalizeListingImageUrl(lead.listing.image_url)}
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
                        Продавец
                      </dt>
                      <dd className="mt-1">
                        <Link
                          href={`/seller/${lead.sellerProfile.id}`}
                          className="font-medium text-[#0F172A] transition hover:text-[#2563EB]"
                        >
                          {lead.sellerProfile.company_name}
                        </Link>
                      </dd>
                    </div>

                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                        Количество
                      </dt>
                      <dd className="mt-1 font-medium text-[#0F172A]">{lead.quantity}</dd>
                    </div>

                    {lead.message ? (
                      <div className="sm:col-span-2">
                        <dt className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                          Сообщение
                        </dt>
                        <dd className="mt-1 line-clamp-3 whitespace-pre-wrap text-sm leading-relaxed text-[#334155]">
                          {lead.message}
                        </dd>
                      </div>
                    ) : null}
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
          ))}
        </div>
      )}
    </section>
  );
}
