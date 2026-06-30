import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { ListingGallery } from "@/components/listings/ListingGallery";
import { listingUnitOptions } from "@/features/listings/constants";
import { prisma } from "@/shared/lib/prisma";

type ListingPageProps = {
  params: Promise<{ id: string }>;
};

const statusLabels: Record<string, string> = {
  DRAFT: "Черновик",
  PENDING_MODERATION: "На модерации",
  PUBLISHED: "Опубликовано",
  REJECTED: "Отклонено",
  ARCHIVED: "В архиве",
};

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      category: { select: { name: true, slug: true } },
      city: { select: { name: true } },
      brand: { select: { name: true } },
      images: {
        orderBy: { sort_order: "asc" },
        select: { id: true, url: true },
      },
      sellerProfile: {
        select: {
          id: true,
          company_name: true,
          slug: true,
          is_verified: true,
        },
      },
    },
  });

  if (!listing) {
    notFound();
  }

  const unitLabel =
    listingUnitOptions.find((option) => option.value === listing.unit)?.label ?? listing.unit;

  return (
    <main className="bg-white py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-wider text-blue-600">
            {statusLabels[listing.status] ?? listing.status}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {listing.title}
          </h1>

          <div className="mt-6">
            <ListingGallery images={listing.images} title={listing.title} />
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-2xl font-bold text-slate-900">
              {listing.price.toString()} {listing.currency}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Мин. партия: {listing.moq} {unitLabel.toLowerCase()}
              {listing.stock_quantity != null ? ` · Остаток: ${listing.stock_quantity}` : null}
            </p>
          </div>

          <section className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">Описание</h2>
            <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-slate-600">
              {listing.description}
            </p>
          </section>

          <section className="mt-8 grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 p-5">
              <h3 className="text-sm font-medium uppercase tracking-wide text-slate-500">
                Категория
              </h3>
              <p className="mt-2 font-medium text-slate-900">{listing.category.name}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 p-5">
              <h3 className="text-sm font-medium uppercase tracking-wide text-slate-500">Город</h3>
              <p className="mt-2 font-medium text-slate-900">{listing.city?.name ?? "—"}</p>
            </article>
            {listing.brand ? (
              <article className="rounded-2xl border border-slate-200 p-5">
                <h3 className="text-sm font-medium uppercase tracking-wide text-slate-500">
                  Бренд
                </h3>
                <p className="mt-2 font-medium text-slate-900">{listing.brand.name}</p>
              </article>
            ) : null}
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Продавец</h2>
            <p className="mt-3 text-base font-medium text-slate-900">
              {listing.sellerProfile.company_name}
              {listing.sellerProfile.is_verified ? (
                <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                  Проверен
                </span>
              ) : null}
            </p>
            <Link
              href={`/seller/${listing.sellerProfile.slug}`}
              className="mt-4 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Профиль компании →
            </Link>
          </section>
        </div>
      </Container>
    </main>
  );
}
