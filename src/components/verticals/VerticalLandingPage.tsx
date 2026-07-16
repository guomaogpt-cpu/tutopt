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

  return (
    <main className="min-w-0 overflow-x-clip bg-[#F5F7FA]">
      <section className="border-b border-[rgba(148,163,184,0.14)] bg-white">
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
                <p className="text-sm font-medium uppercase tracking-wider text-[#2563EB]">
                  Направление
                </p>
                {resolvedBadge ? (
                  <span className="rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-medium text-[#92400E]">
                    {resolvedBadge}
                  </span>
                ) : null}
              </div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
                {resolvedTitle}
              </h1>
              <p className="mt-3 text-base leading-relaxed text-[#64748B] sm:text-lg">
                {resolvedSubtitle}
              </p>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                <Button
                  className="h-11 w-full rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] sm:w-auto"
                  asChild
                >
                  <Link href={config.listingsHref}>Смотреть объявления</Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-11 w-full rounded-xl border-[rgba(148,163,184,0.25)] bg-white sm:w-auto"
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
            <VerticalCards activeVertical={verticalId} variant="compact" />
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
                      className="flex h-full min-h-[56px] items-center rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white px-3.5 py-3 text-sm font-medium text-[#334155] shadow-[0_4px_12px_rgba(15,23,42,0.03)] transition hover:border-[rgba(37,99,235,0.28)] hover:text-[#2563EB]"
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
                className="shrink-0 text-sm font-medium text-[#2563EB] hover:underline"
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
