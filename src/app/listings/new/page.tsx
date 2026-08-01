import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { CreateListingPageHeader } from "@/components/listings/CreateListingPageHeader";
import { NewListingForm } from "@/components/listings/NewListingForm";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { needsPhoneForPosting } from "@/features/auth/lib/seller-onboarding";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildSellerOnboardingUrl } from "@/features/auth/validators/seller-onboarding.validators";
import { parseListingVerticalParam } from "@/features/verticals/verticals";
import { prisma } from "@/shared/lib/prisma";
import { Container } from "@/components/ui/container";
import { buildPrivatePageMetadata } from "@/shared/seo/seo.config";

export const metadata = buildPrivatePageMetadata(
  "Новое объявление",
  "Создание объявления на ВсеТут.",
);

type NewListingPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function NewListingPage({ searchParams }: NewListingPageProps) {
  const rawParams = await searchParams;
  const verticalParam =
    typeof rawParams.vertical === "string" ? rawParams.vertical : undefined;
  const categoryParam =
    typeof rawParams.category === "string" ? rawParams.category.trim() : undefined;
  const initialVertical = parseListingVerticalParam(verticalParam);
  const returnPath = initialVertical
    ? categoryParam
      ? `/listings/new?vertical=${initialVertical}&category=${encodeURIComponent(categoryParam)}`
      : `/listings/new?vertical=${initialVertical}`
    : "/listings/new";

  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl(returnPath));
  }

  if (user.role === UserRole.MODERATOR) {
    redirect("/");
  }

  if (
    user.role !== UserRole.BUYER &&
    user.role !== UserRole.SELLER &&
    user.role !== UserRole.ADMIN
  ) {
    redirect("/");
  }

  if (needsPhoneForPosting(user.phone)) {
    redirect(buildSellerOnboardingUrl(returnPath));
  }

  const [categories, cities, brands] = await Promise.all([
    prisma.category.findMany({
      where: { is_active: true },
      orderBy: [{ sort_order: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        parent_id: true,
        icon: true,
        vertical: true,
      },
    }),
    prisma.city.findMany({
      where: { is_active: true },
      orderBy: [{ sort_order: "asc" }, { name: "asc" }],
      select: { id: true, name: true },
    }),
    prisma.brand.findMany({
      where: { is_active: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <main className="min-w-0 overflow-x-clip bg-[#F5F7FA] py-4 dark:bg-slate-950 sm:py-8">
      <Container size="md" className="max-w-[1100px] min-w-0">
        <CreateListingPageHeader initialVertical={initialVertical} />

        {categories.length === 0 || cities.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200 sm:mt-8 sm:p-6">
            Для создания объявления нужны категории и города в базе. Запустите{" "}
            <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/60">npm run db:seed</code>.
          </div>
        ) : (
          <NewListingForm
            categories={categories}
            cities={cities.map((item) => ({ id: item.id, label: item.name }))}
            brands={brands.map((item) => ({ id: item.id, label: item.name }))}
            initialVertical={initialVertical}
            initialCategoryId={categoryParam}
          />
        )}
      </Container>
    </main>
  );
}
