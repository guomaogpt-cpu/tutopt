import Link from "next/link";
import type { ListingVertical } from "@prisma/client";
import { ListingCard } from "@/components/listings/ListingCard";
import { OptCategoryHighlights } from "@/components/opt/OptCategoryHighlights";
import { VerticalHero } from "@/components/verticals/VerticalHero";
import { VerticalCards } from "@/components/verticals/VerticalCards";
import { Container } from "@/components/ui/container";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import { getCategorySeoSlug } from "@/features/seo/category-seo-slug";
import { VERTICAL_HERO_CONTENT } from "@/features/verticals/vertical-hero-content";
import {
  VERTICALS,
  type VerticalDefinition,
} from "@/features/verticals/verticals";
import { cn } from "@/lib/utils";

const VERTICAL_LANDING_STYLES: Record<
  ListingVertical,
  {
    mainBg: string;
    link: string;
    categoryAccent: string;
    categoryHover: string;
  }
> = {
  OPT: {
    mainBg: "bg-gradient-to-b from-blue-50/50 to-slate-50",
    link: "text-blue-700 hover:underline",
    categoryAccent: "border-l-4 border-l-blue-500",
    categoryHover: "hover:border-blue-300 hover:bg-blue-50/70",
  },
  MARKET: {
    mainBg: "bg-gradient-to-b from-indigo-50/60 to-slate-50",
    link: "text-indigo-700 hover:underline",
    categoryAccent: "border-l-4 border-l-indigo-500",
    categoryHover: "hover:border-indigo-300 hover:bg-indigo-50/70",
  },
  SERVICES: {
    mainBg: "bg-gradient-to-b from-teal-50/60 to-slate-50",
    link: "text-teal-700 hover:underline",
    categoryAccent: "border-l-4 border-l-teal-600",
    categoryHover: "hover:border-teal-300 hover:bg-teal-50/70",
  },
  CARGO: {
    mainBg: "bg-gradient-to-b from-rose-50/60 to-slate-50",
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
  statusBadge?: string | null;
  categories: VerticalLandingCategory[];
  listings: ListingCardData[];
  publishedCount?: number;
};

export function VerticalLandingPage({
  vertical: verticalId,
  statusBadge,
  categories,
  listings,
  publishedCount,
}: VerticalLandingPageProps) {
  const config: VerticalDefinition = VERTICALS[verticalId];
  const heroContent = VERTICAL_HERO_CONTENT[verticalId];
  const listingCount = publishedCount ?? listings.length;
  const styles = VERTICAL_LANDING_STYLES[verticalId];

  return (
    <main className={cn("min-w-0 overflow-x-clip", styles.mainBg)}>
      <VerticalHero
        vertical={verticalId}
        title={heroContent.title}
        subtitle={heroContent.subtitle}
        searchPlaceholder={heroContent.searchPlaceholder}
        benefits={heroContent.benefits}
        statusBadge={statusBadge}
        listingCount={listingCount}
        categoryCount={categories.length}
      />

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

        {verticalId === "OPT" ? (
          <OptCategoryHighlights categories={categories} />
        ) : (
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
        )}

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
