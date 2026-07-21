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
import { HOMEPAGE_PAPER_BANNER_PUBLIC_PATH } from "@/features/home/lib/homepage-paper-banner";
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

type HomepagePaperEntryProps = {
  bannerAvailable: boolean;
};

/**
 * Homepage entry: paper banner background (desktop/tablet) + overlay content.
 * Mobile / missing asset → compact fallback without the image.
 */
export function HomepagePaperEntry({ bannerAvailable }: HomepagePaperEntryProps) {
  return (
    <section
      data-home-section="paper-entry"
      className="overflow-x-clip bg-[#F5F7FA] pb-2 pt-4 sm:pt-5 lg:pt-6"
      aria-labelledby="home-paper-heading"
    >
      <Container size="lg">
        {bannerAvailable ? (
          <>
            <PaperBannerLayout
              className="hidden md:block"
              headingId="home-paper-heading"
            />
            <FallbackEntryLayout className="md:hidden" />
          </>
        ) : (
          <FallbackEntryLayout headingId="home-paper-heading" />
        )}
      </Container>
    </section>
  );
}

function PaperBannerLayout({
  className,
  headingId,
}: {
  className?: string;
  headingId: string;
}) {
  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      style={{
        aspectRatio: "1672 / 941",
        backgroundImage: `url('${HOMEPAGE_PAPER_BANNER_PUBLIC_PATH}')`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Title — top-left of main paper sheet */}
      <div className="absolute left-[5.5%] top-[9%] z-10 max-w-[46%] lg:left-[6%] lg:top-[10%]">
        <h1
          id={headingId}
          className="text-[clamp(1.75rem,3.6vw,2.75rem)] font-extrabold uppercase leading-[0.95] tracking-tight text-[#0F172A]"
        >
          Объявления
        </h1>
        <p className="mt-2 max-w-[22rem] text-[clamp(0.8rem,1.15vw,0.95rem)] leading-snug text-[#64748B]">
          Покупайте, продавайте, находите услуги
        </p>
      </div>

      {/* Search — sits in the rounded cutout (top-right) */}
      <div className="absolute right-[5%] top-[10%] z-20 w-[min(42%,420px)] lg:right-[5.5%] lg:top-[11%]">
        <SearchWithSuggest
          id="home-paper-search"
          variant="header"
          placeholder="Поиск объявлений, услуг и компаний..."
          buttonLabel="Найти"
          className="w-full"
          inputClassName="h-10 border-slate-200/80 bg-white/95 shadow-none lg:h-11"
        />
      </div>

      {/* Clickable tear-off tabs — transparent overlays, content “printed” on paper */}
      <ul
        className="absolute inset-x-[3.5%] bottom-[3.5%] top-[51%] z-10 grid grid-cols-4 gap-0 lg:inset-x-[4%] lg:bottom-[4%] lg:top-[52%]"
        aria-label="Направления"
      >
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
                  "group relative flex h-full min-w-0 flex-col items-center justify-center px-1.5 py-2 text-center",
                  "rounded-lg outline-none transition",
                  "hover:bg-black/[0.02] focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2",
                )}
              >
                <span
                  className={cn(
                    "mb-2 flex size-9 items-center justify-center rounded-xl lg:mb-2.5 lg:size-11",
                    card.iconWrap,
                    card.iconColor,
                  )}
                  aria-hidden="true"
                >
                  <Icon className="size-4 lg:size-5" strokeWidth={1.75} />
                </span>
                <span className="text-[13px] font-bold tracking-tight text-[#0F172A] lg:text-[15px]">
                  {card.label}
                </span>
                <span
                  className={cn(
                    "mt-2 h-[3px] w-8 rounded-full lg:mt-2.5 lg:w-10",
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
  );
}

function FallbackEntryLayout({
  className,
  headingId,
}: {
  className?: string;
  headingId?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <div className="flex flex-col gap-3.5 sm:gap-4">
        <div className="min-w-0">
          <h1
            id={headingId}
            className="text-[1.75rem] font-extrabold uppercase leading-none tracking-tight text-[#0F172A] sm:text-3xl"
          >
            Объявления
          </h1>
          <p className="mt-2 text-sm leading-snug text-[#64748B]">
            Покупайте, продавайте, находите услуги
          </p>
        </div>

        <div className="w-full min-w-0">
          <SearchWithSuggest
            id="home-paper-search-fallback"
            variant="header"
            placeholder="Поиск объявлений, услуг и компаний..."
            buttonLabel="Найти"
          />
        </div>
      </div>

      <div
        className="my-4 border-t border-dashed border-slate-300/90 sm:my-5"
        aria-hidden="true"
      />

      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
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
                  "group relative flex min-h-[96px] flex-col items-center justify-center overflow-hidden",
                  "rounded-2xl border border-slate-200/90 bg-white px-3 py-4 text-center",
                  "shadow-[0_6px_16px_rgba(15,23,42,0.05)] transition duration-200",
                  "hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_10px_22px_rgba(15,23,42,0.08)]",
                )}
              >
                <span
                  className={cn(
                    "mb-2 flex size-10 items-center justify-center rounded-xl",
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
                    "absolute inset-x-10 bottom-0 h-[3px] rounded-t-full",
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
  );
}
