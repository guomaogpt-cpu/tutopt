"use client";

import Image from "next/image";
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
 * Stable homepage entry after visual review:
 * - title + one search as normal HTML (never pixel-fit onto the banner cutout)
 * - paper image as decorative backdrop (desktop/tablet, limited height)
 * - 4 even HTML direction cards
 */
export function HomepagePaperEntry({ bannerAvailable }: HomepagePaperEntryProps) {
  return (
    <section
      data-home-section="paper-entry"
      className="overflow-x-clip bg-[#F5F7FA] pb-1 pt-4 sm:pt-5"
      aria-labelledby="home-paper-heading"
    >
      <Container size="lg" className="max-w-[1280px]">
        {/* Title + search — single HTML row */}
        <div className="flex flex-col gap-3.5 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="min-w-0 max-w-xl">
            <h1
              id="home-paper-heading"
              className="text-[1.75rem] font-extrabold uppercase leading-none tracking-tight text-[#0F172A] sm:text-3xl lg:text-[2.5rem]"
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

        <div className="mt-4 sm:mt-5">
          {bannerAvailable ? (
            <div className="relative mx-auto hidden max-w-[1180px] md:block">
              {/* Decorative paper — cropped to tabs area, limited height */}
              <div className="relative mx-auto h-[300px] overflow-hidden lg:h-[340px]">
                <Image
                  src={HOMEPAGE_PAPER_BANNER_PUBLIC_PATH}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1280px) 100vw, 1180px"
                  className="pointer-events-none object-cover object-bottom"
                  aria-hidden="true"
                />
              </div>

              {/* Even HTML cards on the tear-off zone */}
              <ul
                className="absolute inset-x-3 bottom-3 z-10 grid grid-cols-4 gap-2.5 sm:inset-x-4 sm:bottom-4 lg:inset-x-5 lg:bottom-5 lg:gap-3"
                aria-label="Направления"
              >
                {ENTRY_CARDS.map((card) => (
                  <li key={card.id} className="min-w-0">
                    <DirectionCard card={card} compact />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Mobile / no-banner: no image, simple grid */}
          <ul
            className={cn(
              "grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3",
              bannerAvailable && "md:hidden",
            )}
            aria-label="Направления"
          >
            {ENTRY_CARDS.map((card) => (
              <li key={card.id} className="min-w-0">
                <DirectionCard card={card} />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

function DirectionCard({
  card,
  compact = false,
}: {
  card: EntryCard;
  compact?: boolean;
}) {
  const Icon = card.icon;

  return (
    <Link
      href={card.href}
      onClick={() => {
        trackVerticalClick(card.id, "homepage");
      }}
      className={cn(
        "group relative flex flex-col items-center justify-center overflow-hidden text-center",
        "rounded-2xl border border-slate-200/90 bg-white",
        "shadow-[0_6px_16px_rgba(15,23,42,0.05)] transition duration-200",
        "hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_10px_22px_rgba(15,23,42,0.08)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:ring-offset-2",
        compact
          ? "min-h-[108px] px-2 py-3.5 lg:min-h-[118px] lg:px-3 lg:py-4"
          : "min-h-[96px] px-3 py-4",
      )}
    >
      <span
        className={cn(
          "mb-2 flex items-center justify-center rounded-xl",
          compact ? "size-9 lg:size-10" : "size-10",
          card.iconWrap,
          card.iconColor,
        )}
        aria-hidden="true"
      >
        <Icon
          className={compact ? "size-4 lg:size-[18px]" : "size-5"}
          strokeWidth={1.75}
        />
      </span>
      <span
        className={cn(
          "font-bold tracking-tight text-[#0F172A]",
          compact ? "text-[13px] lg:text-sm" : "text-[15px]",
        )}
      >
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
  );
}
