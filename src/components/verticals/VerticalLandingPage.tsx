import Link from "next/link";
import type { ListingVertical } from "@prisma/client";
import { ListingCard } from "@/components/listings/ListingCard";
import { AppBreadcrumbs } from "@/components/navigation/Breadcrumbs";
import { VerticalCards } from "@/components/verticals/VerticalCards";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import { getCategorySeoSlug } from "@/features/seo/category-seo-slug";
import {
  VERTICALS,
  type VerticalDefinition,
} from "@/features/verticals/verticals";
import { cn } from "@/lib/utils";

const VERTICAL_LANDING_STYLES: Record<
  ListingVertical,
  {
    heroSection: string;
    heroAccent: string;
    directionBadge: string;
    label: string;
    statusBadge: string;
    titleUnderline: string;
    mainBg: string;
    primaryButton: string;
    secondaryButton: string;
    link: string;
    categoryAccent: string;
    categoryHover: string;
  }
> = {
  OPT: {
    heroSection:
      "border-b border-blue-200 bg-gradient-to-br from-blue-100 via-blue-50 to-white shadow-sm",
    heroAccent: "border-t-4 border-t-blue-600 sm:border-t-0 sm:border-l-4 sm:border-l-blue-600",
    directionBadge: "border border-blue-600 bg-blue-600 text-white",
    label: "text-blue-700",
    statusBadge: "border border-blue-200 bg-blue-100 text-blue-700",
    titleUnderline: "bg-blue-600",
    mainBg: "bg-gradient-to-b from-blue-50/50 to-slate-50",
    primaryButton:
      "bg-blue-600 text-white transition-colors hover:bg-blue-700 active:scale-[0.98]",
    secondaryButton:
      "border border-blue-200 bg-blue-100 text-blue-700 transition-colors hover:bg-blue-200 active:scale-[0.98]",
    link: "text-blue-700 hover:underline",
    categoryAccent: "border-l-4 border-l-blue-500",
    categoryHover: "hover:border-blue-300 hover:bg-blue-50/70",
  },
  MARKET: {
    heroSection:
      "border-b border-indigo-200 bg-gradient-to-br from-indigo-100 via-indigo-50 to-white shadow-sm",
    heroAccent:
      "border-t-4 border-t-indigo-600 sm:border-t-0 sm:border-l-4 sm:border-l-indigo-600",
    directionBadge: "border border-indigo-600 bg-indigo-600 text-white",
    label: "text-indigo-700",
    statusBadge: "border border-indigo-200 bg-indigo-100 text-indigo-700",
    titleUnderline: "bg-indigo-600",
    mainBg: "bg-gradient-to-b from-indigo-50/60 to-slate-50",
    primaryButton:
      "bg-indigo-600 text-white transition-colors hover:bg-indigo-700 active:scale-[0.98]",
    secondaryButton:
      "border border-indigo-200 bg-indigo-100 text-indigo-700 transition-colors hover:bg-indigo-200 active:scale-[0.98]",
    link: "text-indigo-700 hover:underline",
    categoryAccent: "border-l-4 border-l-indigo-500",
    categoryHover: "hover:border-indigo-300 hover:bg-indigo-50/70",
  },
  SERVICES: {
    heroSection:
      "border-b border-teal-200 bg-gradient-to-br from-teal-100 via-teal-50 to-white shadow-sm",
    heroAccent: "border-t-4 border-t-teal-700 sm:border-t-0 sm:border-l-4 sm:border-l-teal-700",
    directionBadge: "border border-teal-700 bg-teal-700 text-white",
    label: "text-teal-700",
    statusBadge: "border border-teal-200 bg-teal-100 text-teal-700",
    titleUnderline: "bg-teal-700",
    mainBg: "bg-gradient-to-b from-teal-50/60 to-slate-50",
    primaryButton:
      "bg-teal-700 text-white transition-colors hover:bg-teal-800 active:scale-[0.98]",
    secondaryButton:
      "border border-teal-200 bg-teal-100 text-teal-700 transition-colors hover:bg-teal-200 active:scale-[0.98]",
    link: "text-teal-700 hover:underline",
    categoryAccent: "border-l-4 border-l-teal-600",
    categoryHover: "hover:border-teal-300 hover:bg-teal-50/70",
  },
  CARGO: {
    heroSection:
      "border-b border-rose-200 bg-gradient-to-br from-rose-100 via-rose-50 to-white shadow-sm",
    heroAccent: "border-t-4 border-t-rose-600 sm:border-t-0 sm:border-l-4 sm:border-l-rose-600",
    directionBadge: "border border-rose-600 bg-rose-600 text-white",
    label: "text-rose-700",
    statusBadge: "border border-rose-200 bg-rose-100 text-rose-700",
    titleUnderline: "bg-rose-600",
    mainBg: "bg-gradient-to-b from-rose-50/60 to-slate-50",
    primaryButton:
      "bg-rose-600 text-white transition-colors hover:bg-rose-700 active:scale-[0.98]",
    secondaryButton:
      "border border-rose-200 bg-rose-100 text-rose-700 transition-colors hover:bg-rose-200 active:scale-[0.98]",
    link: "text-rose-700 hover:underline",
    categoryAccent: "border-l-4 border-l-rose-500",
    categoryHover: "hover:border-rose-300 hover:bg-rose-50/70",
  },
};

export type VerticalLandingCategory = {
  id: string;
  name: string;
  slug: string;
  vertical: ListingVertical;
};

type VerticalLandingPageProps = {
  vertical: ListingVertical;
  title?: string;
  subtitle?: string;
  statusBadge?: string | null;
  categories: VerticalLandingCategory[];
  listings: ListingCardData[];
  publishedCount?: number;
};

export function VerticalLandingPage({
  vertical: verticalId,
  title,
  subtitle,
  statusBadge,
  categories,
  listings,
  publishedCount,
}: VerticalLandingPageProps) {
  const config: VerticalDefinition = VERTICALS[verticalId];
  const resolvedTitle = title ?? config.label;
  const resolvedSubtitle = subtitle ?? config.subtitle;
  const resolvedBadge =
    statusBadge === undefined
      ? config.comingSoon
        ? "Раздел готовится к запуску"
        : null
      : statusBadge;
  const listingCount = publishedCount ?? listings.length;
  const styles = VERTICAL_LANDING_STYLES[verticalId];

  return (
    <main className={cn("min-w-0 overflow-x-clip", styles.mainBg)}>
      <section className={cn(styles.heroSection, styles.heroAccent)}>
        <Container size="lg" className="py-8 sm:py-10">
          <AppBreadcrumbs
            className="mb-4"
            items={[
              { label: "Главная", href: "/" },
              { label: resolvedTitle },
            ]}
          />
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <p
                  className={cn(
                    "text-sm font-medium uppercase tracking-wider",
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
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
                {resolvedTitle}
              </h1>
              <span
                className={cn("mt-2 block h-1 w-14 rounded-full", styles.titleUnderline)}
                aria-hidden="true"
              />
              <p className="mt-3 text-base leading-relaxed text-[#64748B] sm:text-lg">
                {resolvedSubtitle}
              </p>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                <Button
                  className={cn("h-11 w-full rounded-xl sm:w-auto", styles.primaryButton)}
                  asChild
                >
                  <Link href={config.listingsHref}>Смотреть объявления</Link>
                </Button>
                <Button
                  variant="outline"
                  className={cn("h-11 w-full rounded-xl sm:w-auto", styles.secondaryButton)}
                  asChild
                >
                  <Link href={config.createListingHref}>Подать объявление</Link>
                </Button>
              </div>
            </div>

            {!config.comingSoon ? (
              <div className="grid w-full max-w-sm grid-cols-2 gap-3 lg:w-auto">
                <div className="rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[#F8FAFC] px-4 py-3.5">
                  <p className="text-2xl font-bold text-[#0F172A]">{listingCount}</p>
                  <p className="mt-0.5 text-xs text-[#64748B]">объявлений</p>
                </div>
                <div className="rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[#F8FAFC] px-4 py-3.5">
                  <p className="text-2xl font-bold text-[#0F172A]">{categories.length}</p>
                  <p className="mt-0.5 text-xs text-[#64748B]">категорий</p>
                </div>
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      <Container size="lg" className="space-y-10 py-8 sm:space-y-12 sm:py-10">
        <section aria-labelledby="platform-verticals-heading">
          <h2
            id="platform-verticals-heading"
            className="text-lg font-semibold tracking-tight text-[#0F172A]"
          >
            Направления платформы
          </h2>
          <div className="mt-4">
            <VerticalCards
              activeVertical={verticalId}
              variant="compact"
              trackingSource="vertical_page"
            />
          </div>
        </section>

        <section aria-labelledby="vertical-categories-heading">
          <h2
            id="vertical-categories-heading"
            className="text-lg font-semibold tracking-tight text-[#0F172A]"
          >
            Категории
          </h2>

          {categories.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white px-5 py-7 text-sm text-[#64748B]">
              Категории появятся после запуска раздела
            </div>
          ) : (
            <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
              {categories.map((category) => {
                const seoHref = `/${config.slug}/${getCategorySeoSlug(category)}`;

                return (
                  <li key={category.id} className="min-w-0">
                    <Link
                      href={seoHref}
                      className={cn(
                        "flex h-full min-h-[56px] items-center rounded-2xl border border-slate-200 bg-white py-3 pl-3.5 pr-3.5 text-sm font-medium text-[#334155] shadow-[0_4px_12px_rgba(15,23,42,0.03)] transition-colors",
                        styles.categoryAccent,
                        styles.categoryHover,
                      )}
                    >
                      <span className="line-clamp-2">{category.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section aria-labelledby="vertical-listings-heading">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2
              id="vertical-listings-heading"
              className="text-lg font-semibold tracking-tight text-[#0F172A]"
            >
              Последние объявления
            </h2>
            {listings.length > 0 ? (
              <Link
                href={config.listingsHref}
                className={cn("shrink-0 text-sm font-medium", styles.link)}
              >
                Все объявления
              </Link>
            ) : null}
          </div>

          {listings.length === 0 ? (
            <div className="rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white px-5 py-7 text-sm text-[#64748B]">
              {`В ${config.label} пока нет объявлений`}
            </div>
          ) : (
            <div className="grid w-full min-w-0 grid-cols-2 gap-3 max-[339px]:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
              {listings.map((listing) => (
                <div key={listing.id} className="min-w-0 w-full">
                  <ListingCard listing={listing} variant="catalog" />
                </div>
              ))}
            </div>
          )}
        </section>
      </Container>
    </main>
  );
}
