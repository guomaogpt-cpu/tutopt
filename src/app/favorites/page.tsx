import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart } from "lucide-react";
import { ListingCard } from "@/components/listings/ListingCard";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { getUserFavoriteListings } from "@/features/favorites/lib/favorites-data";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader, PageHeaderContent } from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";
import { Section } from "@/components/ui/section";

export default async function FavoritesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/favorites"));
  }

  const listings = await getUserFavoriteListings(user.id);
  const favoriteIds = new Set(listings.map((listing) => listing.id));

  return (
    <main className="bg-background py-6 sm:py-10">
      <Container size="lg">
        <PageHeader className="pb-4">
          <PageHeaderContent>
            <PageTitle className="text-2xl sm:text-3xl">Избранное</PageTitle>
            <PageSubtitle className="text-sm sm:text-base">
              Сохранённые объявления для быстрого доступа к оптовым предложениям.
            </PageSubtitle>
          </PageHeaderContent>
        </PageHeader>

        <Section spacing="none" className="mt-4">
          {listings.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="Вы пока ничего не добавили в избранное"
              description="Нажимайте на сердечко в карточках объявлений, чтобы сохранить интересные предложения."
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
        </Section>
      </Container>
    </main>
  );
}
