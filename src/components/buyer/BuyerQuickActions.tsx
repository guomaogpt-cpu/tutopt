import Link from "next/link";
import { Bell, Heart, Inbox, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const cardClassName = cn(
  "flex min-w-0 items-center gap-3 rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white p-4",
  "shadow-[0_4px_16px_rgba(15,23,42,0.04)] transition hover:border-[rgba(37,99,235,0.22)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]",
  "dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/30",
  "sm:p-5",
);

const iconWrapClassName =
  "flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB] dark:bg-blue-950 dark:text-blue-300";

export function BuyerQuickActions() {
  return (
    <section aria-labelledby="buyer-quick-actions-title">
      <h2 id="buyer-quick-actions-title" className="mb-4 text-lg font-bold text-[#0F172A] sm:text-xl dark:text-slate-100">
        Быстрые действия
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/listings" className={cardClassName}>
          <div className={iconWrapClassName}>
            <LayoutGrid className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[#0F172A] dark:text-slate-100">Найти товар</p>
            <p className="mt-0.5 text-xs text-[#64748B] dark:text-slate-400">Каталог оптовых предложений</p>
          </div>
        </Link>

        <Link href="/favorites" className={cardClassName}>
          <div className={iconWrapClassName}>
            <Heart className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[#0F172A] dark:text-slate-100">Избранное</p>
            <p className="mt-0.5 text-xs text-[#64748B] dark:text-slate-400">Сохранённые объявления</p>
          </div>
        </Link>

        <Link href="/notifications" className={cardClassName}>
          <div className={iconWrapClassName}>
            <Bell className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[#0F172A] dark:text-slate-100">Уведомления</p>
            <p className="mt-0.5 text-xs text-[#64748B] dark:text-slate-400">Обновления по заявкам</p>
          </div>
        </Link>

        <Link href="#buyer-leads" className={cardClassName}>
          <div className={iconWrapClassName}>
            <Inbox className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[#0F172A] dark:text-slate-100">Мои заявки</p>
            <p className="mt-0.5 text-xs text-[#64748B] dark:text-slate-400">Отправленные запросы</p>
          </div>
        </Link>
      </div>
    </section>
  );
}
