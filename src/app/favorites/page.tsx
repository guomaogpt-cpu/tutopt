import Link from "next/link";
import { redirect } from "next/navigation";
import { FavoritesPageContent } from "@/components/favorites/FavoritesPageContent";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { getUserFavoritesPageData } from "@/features/favorites/lib/favorites-data";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
} from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";
import { buildPrivatePageMetadata } from "@/shared/seo/seo.config";

export const metadata = buildPrivatePageMetadata(
  "Избранное",
  "Избранные объявления на ВсеТут.",
);

export default async function FavoritesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/favorites"));
  }

  const { listings, lastAddedAt } = await getUserFavoritesPageData(user.id);

  return (
    <main className="min-w-0 bg-[#F5F7FA] py-6 sm:py-8">
      <Container size="lg" className="max-w-[1280px] min-w-0">
        <PageHeader className="pb-0">
          <PageHeaderContent>
            <PageTitle className="text-2xl text-[#0F172A] sm:text-3xl">Избранное</PageTitle>
            <PageSubtitle className="text-sm text-[#64748B] sm:text-base">
              Сохранённые товары, к которым можно быстро вернуться
            </PageSubtitle>
          </PageHeaderContent>
          <PageHeaderActions className="w-full sm:w-auto">
            <Button
              asChild
              className="h-11 w-full rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] sm:w-auto"
            >
              <Link href="/listings">Перейти в каталог</Link>
            </Button>
          </PageHeaderActions>
        </PageHeader>

        <div className="mt-6 lg:mt-8">
          <FavoritesPageContent
            initialListings={listings}
            initialLastAddedAt={lastAddedAt?.toISOString() ?? null}
          />
        </div>
      </Container>
    </main>
  );
}
