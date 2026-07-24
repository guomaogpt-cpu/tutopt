import Link from "next/link";
import { ListingCard } from "@/components/listings/ListingCard";
import {
  OptCompactHero,
  type OptCategoryItem,
} from "@/components/opt/OptCompactHero";
import { Container } from "@/components/ui/container";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import { VERTICALS } from "@/features/verticals/verticals";

type OptLandingPageProps = {
  categories: OptCategoryItem[];
  listings: ListingCardData[];
};

export function OptLandingPage({ categories, listings }: OptLandingPageProps) {
  const config = VERTICALS.OPT;

  return (
    <main className="min-w-0 overflow-x-clip bg-gradient-to-b from-blue-50/50 to-slate-50">
      <OptCompactHero categories={categories} />

      <Container size="lg" className="py-8 sm:py-10">
        <section aria-labelledby="opt-listings-heading">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2
              id="opt-listings-heading"
              className="text-lg font-semibold tracking-tight text-[#0F172A]"
            >
              Последние объявления
            </h2>
            {listings.length > 0 ? (
              <Link
                href={config.listingsHref}
                className="shrink-0 text-sm font-medium text-blue-700 hover:underline"
              >
                Все объявления
              </Link>
            ) : null}
          </div>

          {listings.length === 0 ? (
            <div className="rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white px-5 py-7 text-sm text-[#64748B]">
              В ТутОпте пока нет объявлений
            </div>
          ) : (
            <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
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
