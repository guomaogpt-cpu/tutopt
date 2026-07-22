import Link from "next/link";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { NewListingForm } from "@/components/listings/NewListingForm";
import {
  buildLoginUrl,
  buildSellerUpgradeUrl,
} from "@/features/auth/lib/login-redirect";
import { needsSellerOnboarding } from "@/features/auth/lib/seller-onboarding";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildSellerOnboardingUrl } from "@/features/auth/validators/seller-onboarding.validators";
import {
  DEFAULT_LISTING_VERTICAL,
  parseListingVerticalParam,
} from "@/features/verticals/verticals";
import { prisma } from "@/shared/lib/prisma";
import { Container } from "@/components/ui/container";
import { PageHeader, PageHeaderContent } from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";
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
  const initialVertical =
    parseListingVerticalParam(verticalParam) ?? DEFAULT_LISTING_VERTICAL;
  const returnPath = categoryParam
    ? `/listings/new?vertical=${initialVertical}&category=${categoryParam}`
    : `/listings/new?vertical=${initialVertical}`;

  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl(returnPath));
  }

  if (user.role === UserRole.BUYER) {
    redirect(buildSellerUpgradeUrl(returnPath));
  }

  if (user.role === UserRole.SELLER && needsSellerOnboarding({ role: user.role, phone: user.phone })) {
    redirect(buildSellerOnboardingUrl(returnPath));
  }

  if (user.role === UserRole.MODERATOR) {
    redirect("/");
  }

  if (user.role !== UserRole.SELLER && user.role !== UserRole.ADMIN) {
    redirect("/");
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
    <main className="min-w-0 bg-[#F5F7FA] py-6 sm:py-8">
      <Container size="md" className="max-w-[1100px] min-w-0">
        <nav aria-label="Хлебные крошки" className="text-sm text-[#64748B]">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="transition hover:text-[#2563EB]">
                Главная
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/seller/dashboard" className="transition hover:text-[#2563EB]">
                Кабинет продавца
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="line-clamp-1 font-medium text-[#334155]">Новое объявление</li>
          </ol>
        </nav>

        <PageHeader className="mt-4 pb-0">
          <PageHeaderContent>
            <PageTitle className="text-2xl text-[#0F172A] sm:text-3xl">Подать объявление</PageTitle>
            <PageSubtitle className="text-sm text-[#64748B] sm:text-base">
              Добавьте товар или предложение в выбранный раздел платформы
            </PageSubtitle>
          </PageHeaderContent>
        </PageHeader>

        {categories.length === 0 || cities.length === 0 ? (
          <div className="mt-8 rounded-[22px] border border-[#FDE68A] bg-[#FFFBEB] p-6 text-sm text-[#92400E]">
            Для создания объявления нужны категории и города в базе. Запустите{" "}
            <code className="rounded bg-[#FEF3C7] px-1">npm run db:seed</code>.
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
