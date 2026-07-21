"use client";

import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Megaphone,
  Package,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SearchWithSuggest } from "@/components/search/SearchWithSuggest";
import { trackVerticalClick } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

type EntryCard = {
  id: "OPT" | "MARKET" | "SERVICES" | "CARGO";
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  accentBar: string;
  iconWrap: string;
  iconColor: string;
};

const ENTRY_CARDS: EntryCard[] = [
  {
    id: "OPT",
    label: "Опт",
    description: "Оптовые товары и поставщики",
    href: "/opt",
    icon: Package,
    accentBar: "bg-violet-500",
    iconWrap: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    id: "MARKET",
    label: "Объявления",
    description: "Товары от частных лиц и компаний",
    href: "/market",
    icon: Megaphone,
    accentBar: "bg-emerald-500",
    iconWrap: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    id: "SERVICES",
    label: "Услуги",
    description: "Мастера, специалисты и компании",
    href: "/services",
    icon: Briefcase,
    accentBar: "bg-blue-500",
    iconWrap: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    id: "CARGO",
    label: "Карго",
    description: "Грузоперевозки и логистика",
    href: "/cargo",
    icon: Truck,
    accentBar: "bg-orange-500",
    iconWrap: "bg-orange-50",
    iconColor: "text-orange-600",
  },
];

/**
 * Integrated marketplace entry for `/`.
 * paperBoard experiment disabled — no outer poster wrapper / PNG layout.
 * PNG paper banner kept as reference only.
 */
export function HomepagePaperEntry() {
  return (
    <section
      data-home-section="marketplace-entry"
      className="overflow-x-clip bg-[#F8FAFC] pb-1 pt-5 sm:pt-6"
      aria-labelledby="home-marketplace-heading"
    >
      <Container size="lg">
        {/* Hero row — native page content, not a poster box */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="min-w-0 max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Tutopt
            </p>
            <h1
              id="home-marketplace-heading"
              className="mt-1.5 text-[1.75rem] font-extrabold uppercase leading-none tracking-tight text-[#0F172A] sm:text-3xl lg:text-[2.4rem]"
            >
              Объявления
            </h1>
            <p className="mt-2.5 text-sm leading-relaxed text-[#64748B] sm:text-[15px]">
              Покупайте, продавайте, находите услуги
            </p>
          </div>

          <div className="w-full min-w-0 lg:max-w-[440px]">
            <SearchWithSuggest
              id="home-marketplace-search"
              variant="header"
              placeholder="Поиск объявлений, услуг и компаний..."
              buttonLabel="Найти"
            />
          </div>
        </div>

        {/* Light separator — not a paper cut line */}
        <div
          className="my-5 border-t border-slate-200/80 sm:my-6"
          aria-hidden="true"
        />

        {/* Standalone direction cards */}
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-4 lg:gap-4">
          {ENTRY_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <li key={card.id} className="min-w-0">
                <Link
                  href={card.href}
                  onClick={() => {
                    trackVerticalClick(card.id, "homepage");
                  }}
                  className={cn(
                    "group relative flex h-full min-h-[132px] flex-col overflow-hidden",
                    "rounded-[20px] border border-slate-200/70 bg-white p-4 shadow-sm",
                    "transition duration-200",
                    "hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:ring-offset-2",
                    "sm:min-h-[140px] sm:p-5",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-xl",
                        card.iconWrap,
                        card.iconColor,
                      )}
                      aria-hidden="true"
                    >
                      <Icon className="size-5" strokeWidth={1.75} />
                    </span>
                    <ArrowRight
                      className="size-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="mt-3 min-w-0 flex-1">
                    <p className="text-[15px] font-bold tracking-tight text-[#0F172A]">
                      {card.label}
                    </p>
                    <p className="mt-1 text-xs leading-snug text-[#64748B] sm:text-[13px]">
                      {card.description}
                    </p>
                  </div>

                  <span
                    className={cn(
                      "mt-4 h-[3px] w-10 rounded-full",
                      card.accentBar,
                    )}
                    aria-hidden="true"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
