"use client";

import Link from "next/link";
import {
  Briefcase,
  Megaphone,
  Package,
  Scissors,
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
 * HTML/CSS paper entry for `/`.
 * PNG paper banner kept as reference, active layout is HTML/CSS for responsiveness.
 */
export function HomepagePaperEntry() {
  return (
    <section
      data-home-section="paper-entry"
      className="overflow-x-clip bg-[#F6F7F9] pb-1 pt-4 sm:pt-5"
      aria-labelledby="home-paper-heading"
    >
      <Container size="lg" className="max-w-[1280px]">
        <div
          className={cn(
            "overflow-hidden rounded-sm border border-slate-200/80",
            "shadow-[0_10px_28px_rgba(15,23,42,0.06)]",
            "bg-[linear-gradient(180deg,#FFFEFC_0%,#FBFBFA_100%)]",
          )}
        >
          {/* Top paper sheet */}
          <div className="flex flex-col gap-4 px-5 py-6 sm:px-7 sm:py-7 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-10 lg:py-8">
            <div className="min-w-0 max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Tutopt
              </p>
              <h1
                id="home-paper-heading"
                className="mt-1 text-[1.75rem] font-extrabold uppercase leading-none tracking-tight text-[#0F172A] sm:text-3xl lg:text-[2.5rem]"
              >
                Объявления
              </h1>
              <p className="mt-2 text-sm leading-snug text-[#64748B] sm:text-[15px]">
                Покупайте, продавайте, находите услуги
              </p>
            </div>

            <div className="w-full min-w-0 lg:max-w-[440px]">
              <SearchWithSuggest
                id="home-paper-search"
                variant="header"
                placeholder="Поиск объявлений, услуг и компаний..."
                buttonLabel="Найти"
              />
            </div>
          </div>

          {/* Dashed cut line + scissors marks */}
          <div className="relative px-4 sm:px-6 lg:px-8" aria-hidden="true">
            <div className="border-t border-dashed border-slate-300/90" />
            <div className="pointer-events-none absolute inset-x-6 top-0 flex -translate-y-1/2 justify-around sm:inset-x-10 lg:inset-x-14">
              {ENTRY_CARDS.map((card) => (
                <span
                  key={card.id}
                  className="inline-flex size-5 items-center justify-center rounded-full bg-[#FFFEFC] text-slate-400"
                >
                  <Scissors className="size-3.5 rotate-90" strokeWidth={1.75} />
                </span>
              ))}
            </div>
          </div>

          {/* Tear-off direction cards */}
          <ul
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            aria-label="Направления"
          >
            {ENTRY_CARDS.map((card, index) => {
              const Icon = card.icon;
              return (
                <li
                  key={card.id}
                  className={cn(
                    "min-w-0 border-t border-dashed border-slate-200/90",
                    index % 2 === 1 && "sm:border-l sm:border-dashed sm:border-slate-200/90",
                    index > 0 && "lg:border-l lg:border-dashed lg:border-slate-200/90",
                  )}
                >
                  <Link
                    href={card.href}
                    onClick={() => {
                      trackVerticalClick(card.id, "homepage");
                    }}
                    className={cn(
                      "group relative flex h-full min-h-[112px] flex-col items-center justify-center px-4 py-5 text-center",
                      "transition duration-200",
                      "hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_8px_18px_rgba(15,23,42,0.06)]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400/50",
                      "sm:min-h-[120px] sm:py-6 lg:min-h-[128px]",
                    )}
                  >
                    <span
                      className={cn(
                        "mb-2.5 flex size-10 items-center justify-center rounded-xl lg:size-11",
                        card.iconWrap,
                        card.iconColor,
                      )}
                      aria-hidden="true"
                    >
                      <Icon className="size-5" strokeWidth={1.75} />
                    </span>
                    <span className="text-[15px] font-bold tracking-tight text-[#0F172A]">
                      {card.label}
                    </span>
                    <span
                      className={cn(
                        "mt-3 h-[3px] w-9 rounded-full",
                        card.accentLine,
                      )}
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
