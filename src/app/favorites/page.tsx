import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { ListingCard } from "@/components/listings/ListingCard";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { getUserFavoriteListings } from "@/features/favorites/lib/favorites-data";

export default async function FavoritesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/favorites"));
  }

  const listings = await getUserFavoriteListings(user.id);
  const favoriteIds = new Set(listings.map((listing) => listing.id));

  return (
    <main className="bg-white py-6 sm:py-10">
      <Container>
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Избранное
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Сохранённые объявления для быстрого доступа к оптовым предложениям.
          </p>
        </div>

        {listings.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl">
              ♡
            </div>
            <p className="mt-5 text-base font-medium text-slate-900">
              Вы пока ничего не добавили в избранное
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
              Нажимайте на сердечко в карточках объявлений, чтобы сохранить интересные предложения.
            </p>
            <Link
              href="/listings"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
      </Container>
    </main>
  );
}
