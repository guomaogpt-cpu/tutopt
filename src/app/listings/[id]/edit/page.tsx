import type { Metadata } from "next";
import Link from "next/link";
import { UserRole } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import {
  ListingAccessMessage,
  NewListingForm,
  type ListingFormInitialValues,
} from "@/components/listings/NewListingForm";
import { Container } from "@/components/ui/container";
import { PageHeader, PageHeaderContent } from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { needsSellerOnboarding } from "@/features/auth/lib/seller-onboarding";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildSellerOnboardingUrl } from "@/features/auth/validators/seller-onboarding.validators";
import { getEditListingRestrictionMessage } from "@/lib/security/user-restrictions";
import { prisma } from "@/shared/lib/prisma";

type EditListingPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Редактировать объявление | Tutopt",
  robots: { index: false, follow: false },
};

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { id } = await params;
  const editPath = `/listings/${id}/edit`;
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl(editPath));
  }
  if (user.role !== UserRole.SELLER && user.role !== UserRole.ADMIN) {
    notFound();
  }
  if (needsSellerOnboarding({ role: user.role, phone: user.phone })) {
    redirect(buildSellerOnboardingUrl(editPath));
  }

  const listing = await prisma.listing.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      vertical: true,
      category_id: true,
      price: true,
      currency: true,
      moq: true,
      unit: true,
      city_id: true,
      brand_id: true,
      stock_quantity: true,
      status: true,
      sellerProfile: { select: { user_id: true } },
      images: {
        orderBy: { sort_order: "asc" },
        select: { url: true },
      },
    },
  });

  if (!listing || listing.sellerProfile.user_id !== user.id) {
    notFound();
  }

  const restrictionMessage = getEditListingRestrictionMessage(user);

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

  const initialValues: ListingFormInitialValues = {
    title: listing.title,
    description: listing.description,
    vertical: listing.vertical,
    categoryId: listing.category_id,
    price: listing.price.toString(),
    currency: listing.currency,
    moq: listing.moq,
    unit: listing.unit,
    cityId: listing.city_id ?? "",
    brandId: listing.brand_id,
    stockQuantity: listing.stock_quantity,
    imageUrls: listing.images.map((image) => image.url),
    status: listing.status,
  };

  return (
    <main className="min-w-0 bg-[#F5F7FA] py-6 sm:py-8">
      <Container size="md" className="max-w-[1100px] min-w-0">
        <nav aria-label="Хлебные крошки" className="text-sm text-[#64748B]">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/seller/dashboard" className="transition hover:text-[#2563EB]">
                Кабинет продавца
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/listings/${listing.id}`} className="transition hover:text-[#2563EB]">
                {listing.title}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-[#334155]">Редактирование</li>
          </ol>
        </nav>

        <PageHeader className="mt-4 pb-0">
          <PageHeaderContent>
            <PageTitle className="text-2xl text-[#0F172A] sm:text-3xl">
              Редактировать объявление
            </PageTitle>
            <PageSubtitle className="text-sm text-[#64748B] sm:text-base">
              Измените данные объявления и сохраните их
            </PageSubtitle>
          </PageHeaderContent>
        </PageHeader>

        {restrictionMessage ? (
          <ListingAccessMessage
            title="Редактирование недоступно"
            description={restrictionMessage}
            actionHref="/seller/dashboard"
            actionLabel="Вернуться в кабинет"
          />
        ) : categories.length === 0 || cities.length === 0 ? (
          <ListingAccessMessage
            title="Редактирование временно недоступно"
            description="Для формы нужны активные категории и города."
            actionHref={`/listings/${listing.id}`}
            actionLabel="Вернуться к объявлению"
          />
        ) : (
          <NewListingForm
            mode="edit"
            listingId={listing.id}
            categories={categories}
            cities={cities.map((item) => ({ id: item.id, label: item.name }))}
            brands={brands.map((item) => ({ id: item.id, label: item.name }))}
            initialValues={initialValues}
            cancelHref={`/listings/${listing.id}`}
          />
        )}
      </Container>
    </main>
  );
}
