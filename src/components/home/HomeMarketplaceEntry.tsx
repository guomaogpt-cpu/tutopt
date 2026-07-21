"use client";

import Link from "next/link";
import {
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
  href: string;
  icon: LucideIcon;
  accentLine: string;
  iconWrap: string;
  iconColor: string;
};

const ENTRY_CARDS: EntryCard[] = [
  {
    id: "OPT",
    label: "Опт",
    href: "/opt",
    icon: Package,
    accentLine: "bg-violet-500",
    iconWrap: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    id: "MARKET",
    label: "Объявления",
    href: "/market",
    icon: Megaphone,
    accentLine: "bg-emerald-500",
    iconWrap: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    id: "SERVICES",
    label: "Услуги",
    href: "/services",
    icon: Briefcase,
    accentLine: "bg-blue-500",
    iconWrap: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    id: "CARGO",
    label: "Карго",
    href: "/cargo",
    icon: Truck,
    accentLine: "bg-orange-500",
    iconWrap: "bg-orange-50",
    iconColor: "text-orange-600",
  },
];

/**
 * Light marketplace entry for `/` — title, search, paper-style direction cards.
 * Replaces the old “Выберите, что вы ищете” + VerticalCards block on homepage.
 */
export function HomeMarketplaceEntry() {
  return (
    <section
      data-home-section="marketplace-entry"
      className="overflow-x-clip bg-[#F5F7FA] pb-3 pt-5 sm:pt-6 lg:pt-7"
      aria-labelledby="home-marketplace-heading"
    >
      <Container size="lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="min-w-0 max-w-xl text-left">
            <h1
              id="home-marketplace-heading"
              className="text-[2rem] font-extrabold uppercase leading-none tracking-tight text-[#0F172A] sm:text-4xl lg:text-[2.75rem]"
            >
              Объявления
            </h1>
            <p className="mt-2 text-sm leading-snug text-[#64748B] sm:text-[15px]">
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

        <div
          className="my-5 border-t border-dashed border-slate-300/90 sm:my-6"
          aria-hidden="true"
        />

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
                    "group relative flex h-full min-h-[112px] flex-col items-center justify-center overflow-hidden",
                    "rounded-2xl border border-slate-200/90 bg-white px-4 py-5 text-center",
                    "shadow-[0_6px_18px_rgba(15,23,42,0.05)] transition duration-200",
                    "hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]",
                    "sm:min-h-[120px] sm:py-6",
                  )}
                >
                  <span
                    className={cn(
                      "mb-3 flex size-11 items-center justify-center rounded-xl sm:size-12",
                      card.iconWrap,
                      card.iconColor,
                    )}
                    aria-hidden="true"
                  >
                    <Icon className="size-5 sm:size-6" strokeWidth={1.75} />
                  </span>
                  <span className="text-[15px] font-bold tracking-tight text-[#0F172A] sm:text-base">
                    {card.label}
                  </span>
                  <span
                    className={cn(
                      "absolute inset-x-8 bottom-0 h-[3px] rounded-t-full",
                      card.accentLine,
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
