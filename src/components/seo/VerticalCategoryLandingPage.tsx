import Link from "next/link";
import type { ListingVertical } from "@prisma/client";
import { ListingCard } from "@/components/listings/ListingCard";
import { AppBreadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import type {
  SeoLandingCategory,
  SeoLandingCity,
} from "@/features/seo/get-vertical-category-page-data";
import {
  buildSeoLandingBodyText,
  buildSeoLandingBreadcrumbJsonLd,
  buildSeoLandingH1,
  buildSeoLandingItemListJsonLd,
  buildSeoLandingPath,
} from "@/features/seo/vertical-category-seo";
import { VERTICALS } from "@/features/verticals/verticals";

type VerticalCategoryLandingPageProps = {
  vertical: ListingVertical;
  category: SeoLandingCategory;
  city: SeoLandingCity | null;
  listings: ListingCardData[];
  totalCount: number;
};

export function VerticalCategoryLandingPage({
  vertical,
  category,
  city,
  listings,
  totalCount,
}: VerticalCategoryLandingPageProps) {
  const config = VERTICALS[vertical];
  const path = buildSeoLandingPath(category, city);
  const h1 = buildSeoLandingH1(category, city);
  const seoText = buildSeoLandingBodyText(category, city);
  const createHref = `${config.createListingHref}&category=${category.id}`;

  const breadcrumbItems = [
    { label: "Главная", href: "/" },
    { label: config.label, href: config.href },
    {
      label: category.name,
      href: city ? buildSeoLandingPath(category) : undefined,
    },
    ...(city ? [{ label: city.name }] : []),
  ];

  const breadcrumbJsonLd = buildSeoLandingBreadcrumbJsonLd({ category, city });
  const itemListJsonLd = buildSeoLandingItemListJsonLd({
    path,
    name: h1,
    listings,
  });

  return (
    <main className="min-w-0 bg-[#F5F7FA] py-6 sm:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {itemListJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      ) : null}

      <Container size="lg" className="min-w-0">
        <AppBreadcrumbs className="mb-4" items={breadcrumbItems} />

        <header className="mb-5 sm:mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
            {h1}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#64748B] sm:text-base">
            Найдите актуальные предложения, поставщиков и объявления в Кыргызстане.
          </p>
          <p className="mt-1 text-sm text-[#94A3B8]">
            {totalCount > 0
              ? `Найдено объявлений: ${totalCount}`
              : "Пока нет опубликованных объявлений"}
          </p>
        </header>

        <div className="mb-6">
          <Button
            className="h-11 w-full rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] sm:w-auto"
            asChild
          >
            <Link href={createHref}>Подать объявление в этот раздел</Link>
          </Button>
        </div>

        {listings.length === 0 ? (
          <div className="rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white px-5 py-8 text-sm text-[#64748B]">
            В этой категории пока нет объявлений
            {city ? ` в городе ${city.name}` : ""}. Вы можете подать первое
            объявление в раздел {config.label}.
          </div>
        ) : (
          <div className="grid w-full min-w-0 grid-cols-2 gap-3 max-[339px]:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {listings.map((listing) => (
              <div key={listing.id} className="min-w-0 w-full">
                <ListingCard listing={listing} variant="catalog" />
              </div>
            ))}
          </div>
        )}

        <section className="mt-10 border-t border-[rgba(148,163,184,0.14)] pt-8">
          <h2 className="text-lg font-semibold tracking-tight text-[#0F172A]">
            О разделе
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#64748B] sm:text-base">
            {seoText}
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <Link
              href={config.listingsHref}
              className="font-medium text-[#2563EB] hover:underline"
            >
              Все объявления {config.label}
            </Link>
            <Link href={config.href} className="font-medium text-[#2563EB] hover:underline">
              На страницу направления
            </Link>
          </div>
        </section>
      </Container>
    </main>
  );
}
