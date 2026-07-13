import Link from "next/link";
import { ExternalLink, Inbox, LayoutGrid, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type SellerQuickActionsProps = {
  sellerProfileId: string | null;
};

const cardClassName = cn(
  "flex min-w-0 items-center gap-3 rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white p-4",
  "shadow-[0_4px_16px_rgba(15,23,42,0.04)] transition hover:border-[rgba(37,99,235,0.22)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]",
  "sm:p-5",
);

const iconWrapClassName =
  "flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]";

export function SellerQuickActions({ sellerProfileId }: SellerQuickActionsProps) {
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
    </section>
  );
}
