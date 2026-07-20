import Link from "next/link";
import type { ListingVertical } from "@prisma/client";
import { AppBreadcrumbs } from "@/components/navigation/Breadcrumbs";
import { HomeHeroSearch } from "@/components/home/HomeHeroSearch";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  HERO_BACKGROUND_IMAGE,
  HERO_OVERLAY_GRADIENT,
  HERO_OVERLAY_GRADIENT_MOBILE,
} from "@/features/home/lib/hero-assets";
import type { VerticalHeroBenefit } from "@/features/verticals/vertical-hero-content";
import { VERTICALS } from "@/features/verticals/verticals";
import { cn } from "@/lib/utils";

const VERTICAL_HERO_STYLES: Record<
  ListingVertical,
  {
    section: string;
    accent: string;
    label: string;
    directionBadge: string;
    statusBadge: string;
    titleUnderline: string;
    benefitIcon: string;
    benefitText: string;
    primaryButton: string;
    secondaryButton: string;
    useWholesaleBackground: boolean;
  }
> = {
  OPT: {
    section: "relative isolate overflow-x-clip",
    accent: "",
    label: "text-white/80",
    directionBadge: "border border-white/30 bg-white/15 text-white backdrop-blur-sm",
    statusBadge: "border border-white/25 bg-white/10 text-white/90 backdrop-blur-sm",
    titleUnderline: "bg-white/90",
    benefitIcon: "text-white/75",
    benefitText: "text-white/[0.88]",
    primaryButton:
      "bg-white text-blue-700 hover:bg-white/95 active:scale-[0.98]",
    secondaryButton:
      "border border-white/35 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 active:scale-[0.98]",
    useWholesaleBackground: true,
  },
  MARKET: {
    section:
      "border-b border-indigo-200 bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-500 shadow-sm",
    accent: "",
    label: "text-indigo-100",
    directionBadge: "border border-white/25 bg-white/15 text-white backdrop-blur-sm",
    statusBadge: "border border-white/25 bg-white/10 text-white/90 backdrop-blur-sm",
    titleUnderline: "bg-white/90",
    benefitIcon: "text-white/75",
    benefitText: "text-white/[0.88]",
    primaryButton: "bg-white text-indigo-700 hover:bg-white/95 active:scale-[0.98]",
    secondaryButton:
      "border border-white/35 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 active:scale-[0.98]",
    useWholesaleBackground: false,
  },
  SERVICES: {
    section:
      "border-b border-teal-200 bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-500 shadow-sm",
    accent: "",
    label: "text-teal-100",
    directionBadge: "border border-white/25 bg-white/15 text-white backdrop-blur-sm",
    statusBadge: "border border-white/25 bg-white/10 text-white/90 backdrop-blur-sm",
    titleUnderline: "bg-white/90",
    benefitIcon: "text-white/75",
    benefitText: "text-white/[0.88]",
    primaryButton: "bg-white text-teal-800 hover:bg-white/95 active:scale-[0.98]",
    secondaryButton:
      "border border-white/35 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 active:scale-[0.98]",
    useWholesaleBackground: false,
  },
  CARGO: {
    section:
      "border-b border-rose-200 bg-gradient-to-br from-rose-600 via-rose-500 to-orange-500 shadow-sm",
    accent: "",
    label: "text-rose-100",
    directionBadge: "border border-white/25 bg-white/15 text-white backdrop-blur-sm",
    statusBadge: "border border-white/25 bg-white/10 text-white/90 backdrop-blur-sm",
    titleUnderline: "bg-white/90",
    benefitIcon: "text-white/75",
    benefitText: "text-white/[0.88]",
    primaryButton: "bg-white text-rose-700 hover:bg-white/95 active:scale-[0.98]",
    secondaryButton:
      "border border-white/35 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 active:scale-[0.98]",
    useWholesaleBackground: false,
  },
};

type VerticalHeroProps = {
  vertical: ListingVertical;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  benefits: VerticalHeroBenefit[];
  statusBadge?: string | null;
  listingCount?: number;
  categoryCount?: number;
};

export function VerticalHero({
  vertical,
  title,
  subtitle,
  searchPlaceholder,
  benefits,
  statusBadge,
  listingCount,
  categoryCount,
}: VerticalHeroProps) {
  const config = VERTICALS[vertical];
  const styles = VERTICAL_HERO_STYLES[vertical];
  const resolvedBadge =
    statusBadge === undefined
      ? config.comingSoon
        ? "Раздел готовится к запуску"
        : null
      : statusBadge;
  const showStats =
    !config.comingSoon &&
    listingCount !== undefined &&
    categoryCount !== undefined;

  return (
    <section className={styles.section}>
      {styles.useWholesaleBackground ? (
        <>
          <div
            className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat md:bg-[center_right]"
            style={{ backgroundImage: `url("${HERO_BACKGROUND_IMAGE}")` }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 z-[1] md:hidden"
            style={{ background: HERO_OVERLAY_GRADIENT_MOBILE }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 z-[1] hidden md:block"
            style={{ background: HERO_OVERLAY_GRADIENT }}
            aria-hidden="true"
          />
        </>
      ) : null}

      <div className="relative z-10 px-4 py-8 md:px-0 md:py-12 lg:py-14">
        <Container size="lg" className="min-w-0 px-0 sm:px-6 lg:px-8">
          <AppBreadcrumbs
            className="mb-4 text-white/70 [&_a]:text-white/80 [&_a:hover]:text-white [&_span]:text-white/90"
            items={[
              { label: "Главная", href: "/" },
              { label: config.label },
            ]}
          />

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 max-w-[760px] text-white lg:max-w-[820px]">
              <div className="flex flex-wrap items-center gap-2">
                <p
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wider sm:text-sm",
                    styles.label,
                  )}
                >
                  Направление
                </p>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    styles.directionBadge,
                  )}
                >
                  {config.label}
                </span>
                {resolvedBadge ? (
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-medium",
                      styles.statusBadge,
                    )}
                  >
                    {resolvedBadge}
                  </span>
                ) : null}
              </div>

              <h1
                className={cn(
                  "mt-2 text-[1.625rem] font-bold leading-[1.12] text-white",
                  "md:text-[38px] md:font-extrabold md:leading-[1.05] md:tracking-tight",
                )}
              >
                {title}
              </h1>
              <span
                className={cn("mt-2 block h-1 w-14 rounded-full", styles.titleUnderline)}
                aria-hidden="true"
              />
              <p className="mt-3 max-w-[640px] text-[15px] leading-relaxed text-white/[0.88] md:text-lg">
                {subtitle}
              </p>

              <div className="mt-4 w-full min-w-0 md:mt-6">
                <HomeHeroSearch
                  placeholder={searchPlaceholder}
                  buttonLabel="Найти"
                />
              </div>

              <BenefitsList
                benefits={benefits}
                iconClassName={styles.benefitIcon}
                textClassName={styles.benefitText}
              />

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                <Button
                  className={cn("h-11 w-full rounded-xl sm:w-auto", styles.primaryButton)}
                  asChild
                >
                  <Link href={config.listingsHref}>Смотреть объявления</Link>
                </Button>
                <Button
                  className={cn("h-11 w-full rounded-xl sm:w-auto", styles.secondaryButton)}
                  asChild
                >
                  <Link href={config.createListingHref}>Подать объявление</Link>
                </Button>
              </div>
            </div>

            {showStats ? (
              <div className="grid w-full max-w-sm grid-cols-2 gap-3 lg:w-auto">
                <StatCard value={listingCount} label="объявлений" />
                <StatCard value={categoryCount} label="категорий" />
              </div>
            ) : null}
          </div>
        </Container>
      </div>
    </section>
  );
}

type BenefitsListProps = {
  benefits: VerticalHeroBenefit[];
  iconClassName: string;
  textClassName: string;
};

function BenefitsList({ benefits, iconClassName, textClassName }: BenefitsListProps) {
  return (
    <ul
      className={cn(
        "mt-[18px] grid grid-cols-2 gap-x-3 gap-y-2",
        "md:mt-5 md:flex md:flex-wrap md:gap-x-6 md:gap-y-2",
      )}
    >
      {benefits.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className={cn(
            "flex min-w-0 items-start gap-1.5 text-xs leading-tight md:items-center md:whitespace-nowrap md:text-sm",
            textClassName,
          )}
        >
          <Icon
            className={cn("mt-0.5 size-3.5 shrink-0 md:mt-0 md:size-4", iconClassName)}
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <span className="line-clamp-2 md:line-clamp-none">{label}</span>
        </li>
      ))}
    </ul>
  );
}

type StatCardProps = {
  value: number;
  label: string;
};

function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3.5 backdrop-blur-sm">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="mt-0.5 text-xs text-white/80">{label}</p>
    </div>
  );
}
