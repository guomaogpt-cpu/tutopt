import Link from "next/link";
import { ListingCard } from "@/components/listings/ListingCard";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Section, SectionHeader, SectionTitle } from "@/components/ui/section";
import { Heart } from "lucide-react";

type BuyerFavoritesSectionProps = {
  listings: ListingCardData[];
  favoriteListingIds: string[];
};

export function BuyerFavoritesSection({
  listings,
  favoriteListingIds,
}: BuyerFavoritesSectionProps) {
  const favoriteIds = new Set(favoriteListingIds);

  return (
    <Section spacing="none" aria-labelledby="buyer-favorites-title">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 border-b pb-4">
          <SectionHeader className="mb-0">
            <SectionTitle id="buyer-favorites-title" className="text-lg">
              Последние избранные
            </SectionTitle>
          </SectionHeader>
          <Button variant="outline" size="sm" asChild>
            <Link href="/favorites">Смотреть всё</Link>
          </Button>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          {listings.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="В избранном пока пусто"
              description="Добавляйте интересные объявления, нажимая на сердечко в карточках."
              className="border-0 bg-transparent py-8"
              action={
                <Button asChild>
                  <Link href="/listings">Перейти в каталог</Link>
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  isAuthenticated
                  isFavorited={favoriteIds.has(listing.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Section>
  );
}
