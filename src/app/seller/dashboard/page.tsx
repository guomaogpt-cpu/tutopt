import Link from "next/link";
import { UserRole } from "@prisma/client";
import { Container } from "@/components/layout/Container";
import { ListingAccessMessage } from "@/components/listings/NewListingForm";
import { PublicPageHeader } from "@/components/public/PublicPageHeader";
import { getCurrentUser } from "@/features/auth/lib/session";
import { prisma } from "@/shared/lib/prisma";

const statusLabels: Record<string, string> = {
  DRAFT: "Черновик",
  PENDING_MODERATION: "На модерации",
  PUBLISHED: "Опубликовано",
  REJECTED: "Отклонено",
  ARCHIVED: "В архиве",
};

export default async function SellerDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="bg-slate-50 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl">
            <PublicPageHeader title="Кабинет продавца" />
            <ListingAccessMessage
              title="Нужно войти, чтобы подать объявление"
              description="Войдите в аккаунт продавца, чтобы управлять объявлениями."
              actionHref="/login"
              actionLabel="Войти"
            />
          </div>
        </Container>
      </main>
    );
  }

  if (user.role !== UserRole.SELLER && user.role !== UserRole.ADMIN) {
    return (
      <main className="bg-slate-50 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl">
            <PublicPageHeader title="Кабинет продавца" />
            <ListingAccessMessage
              title="Создание объявлений доступно только продавцам"
              description="Этот раздел доступен аккаунтам с ролью продавца."
            />
          </div>
        </Container>
      </main>
    );
  }

  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { user_id: user.id },
    include: {
      listings: {
        orderBy: { created_at: "desc" },
        take: 20,
        select: {
          id: true,
          title: true,
          status: true,
          price: true,
          currency: true,
          created_at: true,
        },
      },
    },
  });

  const listings = sellerProfile?.listings ?? [];

  return (
    <main className="bg-slate-50 py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <PublicPageHeader
              eyebrow="Продавец"
              title="Кабинет продавца"
              description={
                sellerProfile
                  ? `Компания: ${sellerProfile.company_name}`
                  : "Создайте первое объявление — профиль компании будет создан автоматически."
              }
            />
            <Link
              href="/listings/new"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Подать объявление
            </Link>
          </div>

          <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900">Мои объявления</h2>

            {listings.length === 0 ? (
              <p className="mt-4 text-sm text-slate-600">
                У вас пока нет объявлений.{" "}
                <Link href="/listings/new" className="font-medium text-blue-600 hover:text-blue-700">
                  Создать первое объявление
                </Link>
              </p>
            ) : (
              <ul className="mt-6 divide-y divide-slate-100">
                {listings.map((listing) => (
                  <li
                    key={listing.id}
                    className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <Link
                        href={`/listings/${listing.id}`}
                        className="font-medium text-slate-900 transition hover:text-blue-600"
                      >
                        {listing.title}
                      </Link>
                      <p className="mt-1 text-sm text-slate-500">
                        {statusLabels[listing.status] ?? listing.status} ·{" "}
                        {new Date(listing.created_at).toLocaleDateString("ru-RU")}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">
                      {listing.price.toString()} {listing.currency}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </Container>
    </main>
  );
}
