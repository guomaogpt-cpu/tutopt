import Link from "next/link";
import { ExternalLink, Inbox, LayoutGrid, ListChecks, PlusCircle } from "lucide-react";
import type { ListingVertical } from "@prisma/client";
import { VERTICALS } from "@/features/verticals/verticals";
import { cn } from "@/lib/utils";

type SellerQuickActionsProps = {
  sellerProfileId: string | null;
  verticalCounts?: Partial<Record<ListingVertical, number>>;
};

const cardClassName = cn(
  "flex min-w-0 items-center gap-3 rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white p-4",
  "shadow-[0_4px_16px_rgba(15,23,42,0.04)] transition hover:border-[rgba(37,99,235,0.22)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]",
  "sm:p-5",
);

const iconWrapClassName =
  "flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]";

const CREATE_LINKS: Array<{ vertical: ListingVertical; label: string; hint: string }> = [
  {
    vertical: "OPT",
    label: "Создать оптовое объявление",
    hint: VERTICALS.OPT.label,
  },
  {
    vertical: "MARKET",
    label: "Создать розничное объявление",
    hint: VERTICALS.MARKET.label,
  },
  {
    vertical: "SERVICES",
    label: "Разместить услугу",
    hint: VERTICALS.SERVICES.label,
  },
  {
    vertical: "CARGO",
    label: "Разместить перевозку",
    hint: VERTICALS.CARGO.label,
  },
];

export function SellerQuickActions({
  sellerProfileId,
  verticalCounts,
}: SellerQuickActionsProps) {
  const hasAnyListings =
    verticalCounts != null &&
    Object.values(verticalCounts).some((count) => (count ?? 0) > 0);

  return (
    <section aria-labelledby="seller-quick-actions-title">
      <h2 id="seller-quick-actions-title" className="mb-4 text-lg font-bold text-[#0F172A] sm:text-xl">
        Быстрые действия
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/listings/new" className={cardClassName}>
          <div className={iconWrapClassName}>
            <PlusCircle className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[#0F172A]">Подать объявление</p>
            <p className="mt-0.5 text-xs text-[#64748B]">Создать новое предложение</p>
          </div>
        </Link>

        <Link href="/seller/listings" className={cardClassName}>
          <div className={iconWrapClassName}>
            <ListChecks className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[#0F172A]">Мои объявления</p>
            <p className="mt-0.5 text-xs text-[#64748B]">Управление и продление</p>
          </div>
        </Link>

        <Link href="/seller/leads" className={cardClassName}>
          <div className={iconWrapClassName}>
            <Inbox className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[#0F172A]">Посмотреть заявки</p>
            <p className="mt-0.5 text-xs text-[#64748B]">Ответы покупателей</p>
          </div>
        </Link>

        {sellerProfileId ? (
          <Link href={`/seller/${sellerProfileId}`} className={cardClassName}>
            <div className={iconWrapClassName}>
              <ExternalLink className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[#0F172A]">Публичный профиль</p>
              <p className="mt-0.5 text-xs text-[#64748B]">Как видят покупатели</p>
            </div>
          </Link>
        ) : (
          <div
            className={cn(cardClassName, "cursor-not-allowed opacity-60")}
            aria-disabled="true"
          >
            <div className={cn(iconWrapClassName, "bg-[#F1F5F9] text-[#94A3B8]")}>
              <ExternalLink className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[#0F172A]">Публичный профиль</p>
              <p className="mt-0.5 text-xs text-[#64748B]">Появится после первого объявления</p>
            </div>
          </div>
        )}

        <Link href="/listings" className={cardClassName}>
          <div className={iconWrapClassName}>
            <LayoutGrid className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[#0F172A]">Перейти в каталог</p>
            <p className="mt-0.5 text-xs text-[#64748B]">Смотреть рынок</p>
          </div>
        </Link>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {CREATE_LINKS.map((item) => (
          <Link
            key={item.vertical}
            href={VERTICALS[item.vertical].createListingHref}
            className="rounded-xl border border-dashed border-[rgba(148,163,184,0.35)] bg-white/70 px-3 py-2.5 text-sm transition hover:border-[#2563EB]/40 hover:bg-white"
          >
            <p className="font-medium text-[#0F172A]">{item.label}</p>
            <p className="mt-0.5 text-xs text-[#64748B]">
              {item.hint}
              {hasAnyListings && verticalCounts?.[item.vertical]
                ? ` · ${verticalCounts[item.vertical]} в кабинете`
                : null}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
